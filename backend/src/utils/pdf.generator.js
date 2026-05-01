const PDFDocument = require('pdfkit');

function generateNFePDF(nfe) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Cabeçalho
    doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('NOTA FISCAL DE SERVIÇOS - MEI', { align: 'center' });

    doc.fontSize(12).text(`Nº ${nfe.numero}`, { align: 'right' });
    doc.moveDown();

    // Chave de acesso
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Chave de Acesso: ${nfe.chaveAcesso}`, { align: 'center' });
    doc.moveDown();

    // Emitente
    doc.fontSize(12).font('Helvetica-Bold').text('EMITENTE:');
    doc.font('Helvetica').text(nfe.emitente);
    if (nfe.cnpj) doc.text(`CNPJ: ${nfe.cnpj}`);
    doc.moveDown();

    // Destinatário
    doc.fontSize(12).font('Helvetica-Bold').text('DESTINATÁRIO:');
    doc.font('Helvetica').text(nfe.destinatario);
    if (nfe.client?.cpfCnpj) doc.text(`CPF/CNPJ: ${nfe.client.cpfCnpj}`);
    if (nfe.client?.address) doc.text(`Endereço: ${nfe.client.address}`);
    doc.moveDown();

    // Itens
    doc.fontSize(12).font('Helvetica-Bold').text('ITENS:');
    doc.moveDown();

    const items = typeof nfe.items === 'string' ? JSON.parse(nfe.items) : nfe.items;
    let y = doc.y;

    items.forEach((item, index) => {
      doc.fontSize(10).text(`${index + 1}. ${item.descricao}`, 40, y);
      doc.text(`${item.qtd} x R$ ${item.valor.toFixed(2)}`, 300, y, { width: 100, align: 'right' });
      doc.text(`R$ ${(item.qtd * item.valor).toFixed(2)}`, 420, y, { width: 80, align: 'right' });
      y += 20;
    });

    doc.y = y + 10;

    // Totais
    doc.fontSize(11).font('Helvetica-Bold').text('RESUMO FINANCEIRO:', { underline: true });
    doc.font('Helvetica');
    doc.text(`Subtotal: R$ ${nfe.subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`ISS (${((nfe.iss / nfe.subtotal) * 100).toFixed(1)}%): R$ ${nfe.iss.toFixed(2)}`, { align: 'right' });
    doc.fontSize(12).font('Helvetica-Bold').text(`TOTAL: R$ ${nfe.total.toFixed(2)}`, { align: 'right' });
    doc.moveDown();

    // Informações adicionais
    doc.fontSize(10).font('Helvetica-Bold').text('INFORMAÇÕES ADICIONAIS:');
    doc.font('Helvetica');
    doc.text(`Natureza da Operação: ${nfe.natureza || 'Prestação de Serviços'}`);
    doc.text(`Forma de Pagamento: ${nfe.formaPgto}`);
    doc.text(`Data de Emissão: ${new Date(nfe.dataEmissao).toLocaleDateString('pt-BR')}`);
    if (nfe.obs) doc.text(`Observações: ${nfe.obs}`);

    doc.end();
  });
}

function generateReportPDF({ period, payments, schedules, generatedAt }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // Título
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('RELATÓRIO DESTAK PUBLICIDADE', { align: 'center' });
    doc.fontSize(12).text(`Período: ${period}`, { align: 'center' });
    doc.fontSize(10).text(`Gerado em: ${new Date(generatedAt).toLocaleString('pt-BR')}`, { align: 'center' });
    doc.moveDown(2);

    // Resumo financeiro
    const totalRecebido = payments
      .filter((p) => p.status === 'recebido')
      .reduce((acc, p) => acc + p.value, 0);
    const totalPendente = payments
      .filter((p) => p.status === 'pendente')
      .reduce((acc, p) => acc + p.value, 0);
    const totalAtrasado = payments
      .filter((p) => p.status === 'atrasado')
      .reduce((acc, p) => acc + p.value, 0);

    doc.fontSize(14).font('Helvetica-Bold').text('RESUMO FINANCEIRO:');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Recebido: R$ ${totalRecebido.toFixed(2)}`);
    doc.text(`Total Pendente: R$ ${totalPendente.toFixed(2)}`);
    doc.text(`Total Atrasado: R$ ${totalAtrasado.toFixed(2)}`);
    doc.text(`Total Geral: R$ ${(totalRecebido + totalPendente + totalAtrasado).toFixed(2)}`);
    doc.moveDown(2);

    // Agendamentos
    doc.fontSize(14).font('Helvetica-Bold').text('AGENDAMENTOS:');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total: ${schedules.length}`);
    doc.text(`Concluídos: ${schedules.filter((s) => s.status === 'concluido').length}`);
    doc.text(`Em Andamento: ${schedules.filter((s) => s.status === 'em_andamento').length}`);
    doc.text(`Agendados: ${schedules.filter((s) => s.status === 'agendado').length}`);
    doc.moveDown(2);

    // Lista de agendamentos
    doc.fontSize(12).font('Helvetica-Bold').text('LISTA DE AGENDAMENTOS:');
    doc.fontSize(9).font('Helvetica');

    schedules.slice(0, 20).forEach((s, i) => {
      doc.text(`${i + 1}. ${s.client?.name || 'N/A'} - ${s.date} às ${s.time || 'N/A'}`);
      doc.text(`   Valor: R$ ${s.value.toFixed(2)} | Status: ${s.status}`, { indent: 20 });
    });

    if (schedules.length > 20) {
      doc.text(`... e mais ${schedules.length - 20} agendamentos`);
    }

    doc.end();
  });
}

module.exports = { generateNFePDF, generateReportPDF };
