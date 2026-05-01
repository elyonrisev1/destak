const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email().optional().nullable(),
  cpfCnpj: z.string().optional().nullable(),
  segment: z.string().min(1, 'Segmento é obrigatório'),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  active: z.boolean().optional(),
});

// GET /api/clients
router.get('/', authMiddleware, async (req, res) => {
  const { segment, search, active } = req.query;

  const where = {};

  if (segment) {
    where.segment = segment;
  }

  if (active !== undefined) {
    where.active = active === 'true';
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const clients = await prisma.client.findMany({
    where,
    include: {
      schedules: true,
      payments: true,
      locutions: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: clients,
  });
});

// GET /api/clients/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      schedules: { orderBy: { createdAt: 'desc' } },
      payments: { orderBy: { createdAt: 'desc' } },
      locutions: { orderBy: { createdAt: 'desc' } },
      nfes: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!client) {
    return res.status(404).json({
      success: false,
      error: 'Cliente não encontrado',
    });
  }

  res.json({
    success: true,
    data: client,
  });
});

// POST /api/clients
router.post('/', authMiddleware, validateMiddleware(clientSchema), async (req, res) => {
  const data = req.body;

  const client = await prisma.client.create({
    data,
  });

  res.status(201).json({
    success: true,
    data: client,
  });
});

// PUT /api/clients/:id
router.put('/:id', authMiddleware, validateMiddleware(clientSchema), async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const client = await prisma.client.update({
    where: { id },
    data,
  });

  res.json({
    success: true,
    data: client,
  });
});

// DELETE /api/clients/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.client.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Cliente removido com sucesso',
  });
});

module.exports = router;
