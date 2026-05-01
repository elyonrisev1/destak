const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('destak2025', 10);
  await prisma.user.upsert({
    where: { email: 'admin@destak.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@destak.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Usuário admin criado');

  // Criar clientes
  const clientes = await Promise.all([
    prisma.client.upsert({
      where: { id: 'cliente-1' },
      update: {},
      create: {
        id: 'cliente-1',
        name: 'Padaria São João',
        phone: '(11) 98765-4321',
        email: 'contato@padariasaojoao.com',
        cpfCnpj: '12.345.678/0001-90',
        segment: 'Alimentação',
        address: 'Rua das Flores, 123 - Centro',
        notes: 'Cliente desde 2023. Prefere locuções masculinas.',
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'cliente-2' },
      update: {},
      create: {
        id: 'cliente-2',
        name: 'Auto Peças Silva',
        phone: '(11) 97654-3210',
        email: 'vendas@autopecassilva.com',
        cpfCnpj: '23.456.789/0001-12',
        segment: 'Automotivo',
        address: 'Av. Principal, 456 - Vila Nova',
        notes: 'Campanhas semanais. Pagamento pontual.',
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'cliente-3' },
      update: {},
      create: {
        id: 'cliente-3',
        name: 'Clínica Sorriso',
        phone: '(11) 96543-2109',
        email: 'contato@clinicasorriso.com',
        cpfCnpj: '34.567.890/0001-34',
        segment: 'Saúde',
        address: 'Rua da Saúde, 789 - Jardim Primavera',
        notes: 'Foco em campanhas institucionais.',
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'cliente-4' },
      update: {},
      create: {
        id: 'cliente-4',
        name: 'Magazine Popular',
        phone: '(11) 95432-1098',
        email: 'marketing@magazinepopular.com',
        cpfCnpj: '45.678.901/0001-56',
        segment: 'Varejo',
        address: 'Rua do Comércio, 100 - Centro',
        notes: 'Grandes volumes de campanhas. Cliente premium.',
        active: true,
      },
    }),
    prisma.client.upsert({
      where: { id: 'cliente-5' },
      update: {},
      create: {
        id: 'cliente-5',
        name: 'Escola Futuro Brilhante',
        phone: '(11) 94321-0987',
        email: 'secretaria@futurobrilhante.com',
        cpfCnpj: '56.789.012/0001-78',
        segment: 'Educação',
        address: 'Rua da Educação, 200 - Bairro Verde',
        notes: 'Campanhas sazonais (matrículas).',
        active: true,
      },
    }),
  ]);
  console.log('✅ 5 clientes criados');

  // Criar locuções
  const locucoes = await Promise.all([
    prisma.locution.create({
      data: {
        id: 'locucao-1',
        title: 'Promoção Pão Quentinho',
        text: 'Atenção! Na Padaria São João, pão francês quentinho saindo agora! Venha conferir nossas delícias!',
        voice: 'marcos',
        type: 'tts',
        duration: 15,
        musicStyle: 'upbeat',
        clientId: 'cliente-1',
      },
    }),
    prisma.locution.create({
      data: {
        id: 'locucao-2',
        title: 'Oferta de Óleos',
        text: 'Auto Peças Silva apresenta: troca de óleo com filtro grátis! Só essa semana!',
        voice: 'carlos',
        type: 'tts',
        duration: 20,
        musicStyle: 'rock',
        clientId: 'cliente-2',
      },
    }),
    prisma.locution.create({
      data: {
        id: 'locucao-3',
        title: 'Sorriso Radiante',
        text: 'Clínica Sorriso: seu sorriso é nossa prioridade. Agende sua avaliação gratuita!',
        voice: 'ana',
        type: 'tts',
        duration: 18,
        musicStyle: 'calm',
        clientId: 'cliente-3',
      },
    }),
  ]);
  console.log('✅ 3 locuções criadas');

  // Criar agendamentos
  const agora = new Date();
  const agendamentos = await Promise.all([
    prisma.schedule.create({
      data: {
        id: 'agendamento-1',
        clientId: 'cliente-1',
        locutionId: 'locucao-1',
        date: agora.toISOString().split('T')[0],
        time: '08:00',
        duration: '30 minutos',
        local: 'Centro e Vila Nova',
        value: 150.00,
        status: 'agendado',
        notes: 'Reforçar promoções do dia',
      },
    }),
    prisma.schedule.create({
      data: {
        id: 'agendamento-2',
        clientId: 'cliente-2',
        locutionId: 'locucao-2',
        date: agora.toISOString().split('T')[0],
        time: '10:00',
        duration: '1 hora',
        local: 'Zona Norte',
        value: 250.00,
        status: 'em_andamento',
        notes: 'Campanha especial de sábado',
      },
    }),
    prisma.schedule.create({
      data: {
        id: 'agendamento-3',
        clientId: 'cliente-3',
        locutionId: 'locucao-3',
        date: new Date(agora.getTime() + 86400000).toISOString().split('T')[0],
        time: '14:00',
        duration: '45 minutos',
        local: 'Jardim Primavera',
        value: 200.00,
        status: 'agendado',
        notes: 'Foco em famílias',
      },
    }),
    prisma.schedule.create({
      data: {
        id: 'agendamento-4',
        clientId: 'cliente-4',
        date: new Date(agora.getTime() + 86400000 * 2).toISOString().split('T')[0],
        time: '09:00',
        duration: '2 horas',
        local: 'Todo centro',
        value: 400.00,
        status: 'agendado',
        notes: 'Queima de estoque',
      },
    }),
    prisma.schedule.create({
      data: {
        id: 'agendamento-5',
        clientId: 'cliente-5',
        date: new Date(agovo.getTime() - 86400000).toISOString().split('T')[0],
        time: '16:00',
        duration: '1 hora',
        local: 'Bairro Verde',
        value: 180.00,
        status: 'concluido',
        notes: 'Campanha de matrículas',
      },
    }),
  ]);
  console.log('✅ 5 agendamentos criados');

  // Criar pagamentos
  const pagamentos = await Promise.all([
    prisma.payment.create({
      data: {
        id: 'pagamento-1',
        clientId: 'cliente-1',
        description: 'Campanha semanal - Pão Quentinho',
        value: 150.00,
        date: agora.toISOString().split('T')[0],
        method: 'pix',
        status: 'recebido',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-2',
        clientId: 'cliente-2',
        description: 'Campanha Óleos - Semana',
        value: 250.00,
        date: agora.toISOString().split('T')[0],
        dueDate: new Date(agora.getTime() + 86400000 * 5).toISOString().split('T')[0],
        method: 'debito',
        status: 'pendente',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-3',
        clientId: 'cliente-3',
        description: 'Avaliação Gratuita',
        value: 200.00,
        date: new Date(agora.getTime() - 86400000 * 10).toISOString().split('T')[0],
        method: 'cartao',
        status: 'recebido',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-4',
        clientId: 'cliente-4',
        description: 'Queima de Estoque',
        value: 400.00,
        date: new Date(agora.getTime() - 86400000 * 5).toISOString().split('T')[0],
        dueDate: new Date(agora.getTime() + 86400000 * 3).toISOString().split('T')[0],
        method: 'boleto',
        status: 'pendente',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-5',
        clientId: 'cliente-5',
        description: 'Campanha Matrículas',
        value: 180.00,
        date: new Date(agora.getTime() - 86400000 * 15).toISOString().split('T')[0],
        dueDate: new Date(agora.getTime() - 86400000).toISOString().split('T')[0],
        method: 'pix',
        status: 'atrasado',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-6',
        clientId: 'cliente-1',
        description: 'Campanha Especial',
        value: 300.00,
        date: new Date(agora.getTime() - 86400000 * 20).toISOString().split('T')[0],
        method: 'dinheiro',
        status: 'recebido',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-7',
        clientId: 'cliente-2',
        description: 'Promoção Relâmpago',
        value: 120.00,
        date: new Date(agora.getTime() - 86400000 * 25).toISOString().split('T')[0],
        method: 'pix',
        status: 'recebido',
      },
    }),
    prisma.payment.create({
      data: {
        id: 'pagamento-8',
        clientId: 'cliente-3',
        description: 'Institucional',
        value: 350.00,
        date: new Date(agora.getTime() - 86400000 * 30).toISOString().split('T')[0],
        method: 'cartao',
        status: 'recebido',
      },
    }),
  ]);
  console.log('✅ 8 pagamentos criados');

  // Criar atividades
  await Promise.all([
    prisma.activity.create({
      data: { text: 'Sistema iniciado', type: 'info' },
    }),
    prisma.activity.create({
      data: { text: 'Novo cliente cadastrado: Padaria São João', type: 'success' },
    }),
    prisma.activity.create({
      data: { text: 'Pagamento recebido: Auto Peças Silva - R$ 250,00', type: 'success' },
    }),
  ]);
  console.log('✅ Atividades criadas');

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
