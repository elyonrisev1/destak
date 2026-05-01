const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth.middleware');
const { generateReportPDF } = require('../utils/pdf.generator');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/summary
router.get('/summary', authMiddleware, async (req, res) => {
  const { period, clientId } = req.query;

  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case '3months':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'month':
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const where = {
    date: {
      gte: startDate.toISOString().split('T')[0],
    },
  };

  if (clientId) {
    where.clientId = clientId;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { client: true },
  });

  const schedules = await prisma.schedule.findMany({
    where: clientId ? { clientId, date: { gte: startDate.toISOString().split('T')[0] } } : { date: { gte: startDate.toISOString().split('T')[0] } },
    include: { client: true },
  });

  const totalRecebido = payments
    .filter((p) => p.status === 'recebido')
    .reduce((acc, p) => acc + p.value, 0);

  const totalPendente = payments
    .filter((p) => p.status === 'pendente')
    .reduce((acc, p) => acc + p.value, 0);

  const totalAtrasado = payments
    .filter((p) => p.status === 'atrasado')
    .reduce((acc, p) => acc + p.value, 0);

  const porSegmento = {};
  schedules.forEach((s) => {
    const segment = s.client?.segment || 'Outros';
    if (!porSegmento[segment]) {
      porSegmento[segment] = { count: 0, value: 0 };
    }
    porSegmento[segment].count++;
    porSegmento[segment].value += s.value;
  });

  res.json({
    success: true,
    data: {
      period: period || 'month',
      financeiro: {
        totalRecebido,
        totalPendente,
        totalAtrasado,
        total: totalRecebido + totalPendente + totalAtrasado,
      },
      agendamentos: {
        total: schedules.length,
        concluidos: schedules.filter((s) => s.status === 'concluido').length,
        emAndamento: schedules.filter((s) => s.status === 'em_andamento').length,
        agendados: schedules.filter((s) => s.status === 'agendado').length,
      },
      porSegmento,
    },
  });
});

// GET /api/reports/by-segment
router.get('/by-segment', authMiddleware, async (req, res) => {
  const clients = await prisma.client.findMany({
    include: {
      schedules: true,
      payments: true,
    },
  });

  const bySegment = {};

  clients.forEach((client) => {
    const segment = client.segment;
    if (!bySegment[segment]) {
      bySegment[segment] = {
        clients: 0,
        totalCampanhas: 0,
        totalFaturamento: 0,
      };
    }
    bySegment[segment].clients++;
    bySegment[segment].totalCampanhas += client.schedules.length;
    bySegment[segment].totalFaturamento += client.payments
      .filter((p) => p.status === 'recebido')
      .reduce((acc, p) => acc + p.value, 0);
  });

  res.json({
    success: true,
    data: bySegment,
  });
});

// GET /api/reports/pdf
router.get('/pdf', authMiddleware, async (req, res) => {
  const { period, clientId } = req.query;

  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case '3months':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case '6months':
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const payments = await prisma.payment.findMany({
    where: {
      date: { gte: startDate.toISOString().split('T')[0] },
      ...(clientId && { clientId }),
    },
    include: { client: true },
  });

  const schedules = await prisma.schedule.findMany({
    where: {
      date: { gte: startDate.toISOString().split('T')[0] },
      ...(clientId && { clientId }),
    },
    include: { client: true },
  });

  const pdfBuffer = generateReportPDF({
    period,
    payments,
    schedules,
    generatedAt: now.toISOString(),
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Relatorio_Destak_${period}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = router;
