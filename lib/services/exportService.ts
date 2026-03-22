import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType } from 'docx';
import { jsPDF } from 'jspdf';
import { downloadImagemDrive } from './driveHelper';

interface ExportParams {
  titulo: string;
  textoRelatorio?: string;
  eventos: any[];
  nomeInstituicao?: string;
}

export async function gerarPDF({ titulo, textoRelatorio, eventos = [], nomeInstituicao = 'Secretaria Municipal de Educação' }: ExportParams): Promise<Buffer> {
  const doc = new jsPDF() as any; // tipagem básica para ignorar erros locais
  
  let y = 20;

  // Cabeçalho
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(29, 78, 216); // #1D4ED8
  doc.text(nomeInstituicao, 105, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59); // #1E293B
  doc.text(titulo, 105, y, { align: 'center' });

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // #64748B
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 105, y, { align: 'center' });

  y += 10;
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240); // #E2E8F0
  doc.line(20, y, 190, y);
  y += 10;

  // Texto Relatório (aproximação simples do markdown)
  if (textoRelatorio) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    
    // Simplificando o markdown para PDF
    const textoLimpo = textoRelatorio
      .replace(/#{1,6}\s+(.+)/g, (_, t) => t.toUpperCase())
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/^\s*[-*+]\s+/gm, '• ');

    const splitText = doc.splitTextToSize(textoLimpo, 170);
    // Verificando paginação manual
    for (let i = 0; i < splitText.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitText[i], 20, y);
      y += 6;
    }
    y += 10;
  }

  // Lista os eventos (simplificado por razões do jsPDF)
  if (eventos.length > 0) {
     if (y > 250) {
        doc.addPage();
        y = 20;
     }

     doc.setFont('helvetica', 'bold');
     doc.setFontSize(13);
     doc.setTextColor(29, 78, 216);
     doc.text('REGISTROS DE EVENTOS', 20, y);
     y += 10;

     for (const evento of eventos) {
       if (y > 270) {
         doc.addPage();
         y = 20;
       }

       doc.setFontSize(11);
       doc.setFont('helvetica', 'bold');
       doc.setTextColor(30, 41, 59);
       doc.text(`ID: ${evento._id} — ${evento.titulo || ''}`, 20, y);
       y += 6;

       if (evento.dataEvento) {
         doc.setFontSize(9);
         doc.setFont('helvetica', 'normal');
         doc.setTextColor(100, 116, 139);
         doc.text(`Data: ${new Date(evento.dataEvento).toLocaleDateString('pt-BR')}`, 20, y);
         y += 6;
       }

       if (evento.dados) {
         doc.setFontSize(9);
         doc.setFont('helvetica', 'normal');
         doc.setTextColor(51, 65, 85);
         for (const [chave, valor] of Object.entries(evento.dados)) {
           if (y > 270) {
             doc.addPage();
             y = 20;
           }
           const valString = Array.isArray(valor) ? valor.join(', ') : String(valor);
           const splitText = doc.splitTextToSize(`${chave}: ${valString}`, 170);
           doc.text(splitText, 20, y);
           y += 5 * splitText.length;
         }
       }

       // JS PDF não lida buffer cru nativamente facilmente pra imagem externa, ignoraremos imagens no PDF básico de Vercel/Edge
       y += 10;
     }
  }

  // jsPDF gera ArrayBuffer no ambiente server/browser
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}


export async function gerarDOCX({ titulo, textoRelatorio, eventos = [], nomeInstituicao = 'Secretaria Municipal de Educação' }: ExportParams): Promise<Buffer> {
  const children: any[] = [];

  children.push(
    new Paragraph({
      text: nomeInstituicao,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: titulo,
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
          size: 18,
          color: '64748B',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '' })
  );

  if (textoRelatorio) {
    const linhas = textoRelatorio.split('\n');
    for (const linha of linhas) {
      const textoLimpo = linha
        .replace(/#{1,6}\s+/, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1');

      children.push(
        new Paragraph({
          children: [new TextRun({ text: textoLimpo, size: 22 })],
        })
      );
    }
    children.push(new Paragraph({ text: '' }));
  }

  for (const evento of eventos) {
    children.push(
      new Paragraph({
        text: `${evento._id} — ${evento.titulo || ''}`,
        heading: HeadingLevel.HEADING_3,
      })
    );

    if (evento.dados && typeof evento.dados === 'object') {
      for (const [chave, valor] of Object.entries(evento.dados)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${chave}: `, bold: true, size: 20 }),
              new TextRun({
                text: Array.isArray(valor) ? valor.join(', ') : String(valor),
                size: 20,
              }),
            ],
          })
        );
      }
    }

    if (evento.imagens && evento.imagens.length > 0) {
      for (const img of evento.imagens) {
        try {
          const buffer = await downloadImagemDrive(img.url);
          if (img.label) {
            children.push(new Paragraph({ children: [new TextRun({ text: img.label, italics: true, size: 18 })] }));
          }
          children.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: buffer,
                  transformation: { width: 400, height: 300 },
                }),
              ],
            })
          );
        } catch {
          children.push(
            new Paragraph({ children: [new TextRun({ text: `[Imagem indisponível: ${img.label || img.url}]`, color: 'EF4444', size: 18 })] })
          );
        }
      }
    }

    children.push(new Paragraph({ text: '' }));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return await Packer.toBuffer(doc);
}
