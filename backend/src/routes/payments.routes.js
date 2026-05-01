const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

const paymentSchema = z.object({
  clientId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  value: z.number().positive('Valor deve ser positivo'),
  date: z.string().min(10, 'Data é obrigatória'),
  dueDate: z.string().optional().nullable(),
  method: z.enum(['pix', 'dinheiro', 'cartao', 'debito', 'boleto']).default('pix'),
  status: z.enum(['recebido', 'pendente', 'atrasado']).default('recebido'),
});

// GET /api/payments
router.get('/', authMiddleware, async (req, res) => {
  const { status, method, clientId } = req.query;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (method) {
    where.method = method;
  }

  if (clientId) {
    where.clientId = clientId;
  }

  const payments = await prisma.payment.findMany({
    where,
    include: {
      client: true,
    },
    orderBy: { date: 'desc' },
  });

  res.json({
    success: true,
    data: payments,
  });
});

// GET /api/payments/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: 'Pagamento não encontrado',
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

// POST /api/payments
router.post('/', authMiddleware, validateMiddleware(paymentSchema), async (req, res) => {
  const data = req.body;

  const payment = await prisma.payment.create({
    data,
  });

  res.status(201).json({
    success: true,
    data: payment,
  });
});

// PUT /api/payments/:id
router.put('/:id', authMiddleware, validateMiddleware(paymentSchema), async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const payment = await prisma.payment.update({
    where: { id },
    data,
  });

  res.json({
    success: true,
    data: payment,
  });
});

// PATCH /api/payments/:id/received
router.patch('/:id/received', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const payment = await prisma.payment.update({
    where: { id },
    data: { status: 'recebido' },
  });

  res.json({
    success: true,
    data: payment,
  });
});

// DELETE /api/payments/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.payment.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Pagamento removido com sucesso',
  });
});

module.exports = router;
