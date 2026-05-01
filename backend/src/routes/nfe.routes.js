const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { generateNFePDF } = require('../utils/pdf.generator');

const router = express.Router();
const prisma = new PrismaClient();

const nfeSchema = z.object({
  numero: z.string().min(1, 'Número é obrigatório'),
  clientId: z.string().optional().nullable(),
  emitente: z.string().min(1, 'Emitente é obrigatório'),
  cnpj: z.string().optional().nullable(),
  destinatario: z.string().min(1, 'Destinatário é obrigatório'),
  items: z.string().or(z.array(z.object({
    descricao: z.string(),
    qtd: z.number(),
    valor: z.number(),
  }))),
  subtotal: z.number().positive(),
  iss: z.number().nonnegative(),
  total: z.number().positive(),
  formaPgto: z.string().min(1, 'Forma de pagamento é obrigatória'),
  natureza: z.string().optional().nullable(),
  chaveAcesso: z.string().min(1, 'Chave de acesso é obrigatória'),
  dataEmissao: z.string().min(10, 'Data de emissão é obrigatória'),
  obs: z.string().optional().nullable(),
});

// GET /api/nfe
router.get('/', authMiddleware, async (req, res) => {
  const { clientId } = req.query;

  const where = {};

  if (clientId) {
    where.clientId = clientId;
  }

  const nfes = await prisma.nFe.findMany({
    where,
    include: {
      client: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: nfes,
  });
});

// POST /api/nfe/emit
router.post('/emit', authMiddleware, validateMiddleware(nfeSchema), async (req, res) => {
  const { items, ...data } = req.body;

  const nfeData = {
    ...data,
    items: typeof items === 'string' ? items : JSON.stringify(items),
  };

  const nfe = await prisma.nFe.create({
    data: nfeData,
  });

  res.status(201).json({
    success: true,
    data: nfe,
  });
});

// GET /api/nfe/:id/pdf
router.get('/:id/pdf', authMiddleware, async (req, res) => {
  const { id } = req.params;

  const nfe = await prisma.nFe.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!nfe) {
    return res.status(404).json({
      success: false,
      error: 'NF-e não encontrada',
    });
  }

  const pdfBuffer = generateNFePDF(nfe);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="NFe_${nfe.numero}.pdf"`);
  res.send(pdfBuffer);
});

module.exports = router;
