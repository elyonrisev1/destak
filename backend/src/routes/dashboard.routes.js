const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/dashboard/metrics
router.get('/metrics', authMiddleware, async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthStr = startOfMonth.toISOString().split('T')[0];

  const totalClients = await prisma.client.count({
    where: { active: true },
  });

  const campanhasAtivas = await prisma.schedule.count({
    where: {
      status: { in: ['agendado', 'em_andamento'] },
    },
  });

  const aReceber = await prisma.payment.aggregate({
    where: {
      status: { in: ['pendente', 'atrasado'] },
    },
    _sum: { value: true },
  });

  const faturamentoMes = await prisma.payment.aggregate({
    where: {
      status: 'recebido',
      date: { gte: startOfMonthStr },
    },
    _sum: { value: true },
  });

  res.json({
    success: true,
    data: {
      faturamentoMes: faturamentoMes._sum.value || 0,
      campanhasAtivas,
      aReceber: aReceber._sum.value || 0,
      totalClients,
    },
  });
});

// GET /api/dashboard/upcoming-schedules
router.get('/upcoming-schedules', authMiddleware, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const schedules = await prisma.schedule.findMany({
    where: {
      date: { gte: today },
      status: { not: 'concluido' },
    },
    include: {
      client: true,
      locution: true,
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
    take: 10,
  });

  res.json({
    success: true,
    data: schedules,
  });
});

// GET /api/dashboard/activity
router.get('/activity', authMiddleware, async (req, res) => {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  res.json({
    success: true,
    data: activities,
  });
});

// GET /api/dashboard/top-clients
router.get('/top-clients', authMiddleware, async (req, res) => {
  const clients = await prisma.client.findMany({
    include: {
      payments: {
        where: { status: 'recebido' },
      },
    },
  });

  const clientsWithTotal = clients.map((client) => ({
    ...client,
    totalFaturamento: client.payments.reduce((acc, p) => acc + p.value, 0),
  }));

  clientsWithTotal.sort((a, b) => b.totalFaturamento - a.totalFaturamento);

  res.json({
    success: true,
    data: clientsWithTotal.slice(0, 5),
  });
});

// GET /api/dashboard/revenue-chart
router.get('/revenue-chart', authMiddleware, async (req, res) => {
  const now = new Date();
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = date.toISOString().split('T')[0].slice(0, 7);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const nextMonthStr = nextMonth.toISOString().split('T')[0].slice(0, 7);

    const payments = await prisma.payment.findMany({
      where: {
        status: 'recebido',
        date: {
          gte: monthStr,
          lt: nextMonthStr,
        },
      },
    });

    const total = payments.reduce((acc, p) => acc + p.value, 0);

    monthlyData.push({
      month: date.toLocaleDateString('pt-BR', { month: 'short' }),
      value: total,
    });
  }

  res.json({
    success: true,
    data: monthlyData,
  });
});

module.exports = router;
