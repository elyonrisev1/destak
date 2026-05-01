const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

const scheduleSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  locutionId: z.string().optional().nullable(),
  date: z.string().min(10, 'Data é obrigatória'),
  time: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  local: z.string().optional().nullable(),
  value: z.number().default(0),
  status: z.enum(['agendado', 'em_andamento', 'concluido', 'cancelado']).default('agendado'),
  notes: z.string().optional().nullable(),
});

// GET /api/schedules
router.get('/', authMiddleware, async (req, res) => {
  const { month, clientId, status } = req.query;

  const where = {};

  if (clientId) {
    where.clientId = clientId;
  }

  if (status) {
    where.status = status;
  }

  if (month) {
    const [year, monthNum] = month.split('-');
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0);

    where.date = {
      gte: startDate.toISOString().split('T')[0],
      lte: endDate.toISOString().split('T')[0],
    };
  }

  const schedules = await prisma.schedule.findMany({
    where,
    include: {
      client: true,
      locution: true,
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });

  res.json({
    success: true,
    data: schedules,
  });
});

// GET /api/schedules/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const schedule = await prisma.schedule.findUnique({
    where: { id },
    include: {
      client: true,
      locution: true,
    },
  });

  if (!schedule) {
    return res.status(404).json({
      success: false,
      error: 'Agendamento não encontrado',
    });
  }

  res.json({
    success: true,
    data: schedule,
  });
});

// POST /api/schedules
router.post('/', authMiddleware, validateMiddleware(scheduleSchema), async (req, res) => {
  const data = req.body;

  const schedule = await prisma.schedule.create({
    data,
  });

  res.status(201).json({
    success: true,
    data: schedule,
  });
});

// PUT /api/schedules/:id
router.put('/:id', authMiddleware, validateMiddleware(scheduleSchema), async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const schedule = await prisma.schedule.update({
    where: { id },
    data,
  });

  res.json({
    success: true,
    data: schedule,
  });
});

// DELETE /api/schedules/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.schedule.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Agendamento removido com sucesso',
  });
});

module.exports = router;
