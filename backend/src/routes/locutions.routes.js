const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();
const prisma = new PrismaClient();

const locutionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  text: z.string().optional().nullable(),
  voice: z.string().optional().nullable(),
  type: z.enum(['tts', 'upload', 'clone', 'mix']).default('tts'),
  duration: z.number().int().positive().optional().nullable(),
  fileUrl: z.string().optional().nullable(),
  musicStyle: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
});

// GET /api/locutions
router.get('/', authMiddleware, async (req, res) => {
  const { clientId, type } = req.query;

  const where = {};

  if (clientId) {
    where.clientId = clientId;
  }

  if (type) {
    where.type = type;
  }

  const locutions = await prisma.locution.findMany({
    where,
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: locutions,
  });
});

// POST /api/locutions
router.post('/', authMiddleware, validateMiddleware(locutionSchema), async (req, res) => {
  const data = req.body;

  const locution = await prisma.locution.create({
    data,
  });

  res.status(201).json({
    success: true,
    data: locution,
  });
});

// DELETE /api/locutions/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  await prisma.locution.delete({
    where: { id },
  });

  res.json({
    success: true,
    message: 'Locução removida com sucesso',
  });
});

module.exports = router;
