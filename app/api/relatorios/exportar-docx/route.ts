import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evento from '@/lib/models/Evento';
import { gerarDOCX } from '@/lib/services/exportService';

// Vercel Edge functions não suportam algumas bibliotecas nativas de Node
// Mantemos Node runtime para DOCX
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { titulo, textoRelatorio, filtros, nomeInstituicao } = body;

    const filtroMongo: any = {};
    if (filtros?.formTypeId) filtroMongo.formTypeId = filtros.formTypeId;
    if (filtros?.status) filtroMongo.status = filtros.status;
    if (filtros?.dataInicio || filtros?.dataFim) {
      filtroMongo.dataEvento = {};
      if (filtros.dataInicio) filtroMongo.dataEvento.$gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) filtroMongo.dataEvento.$lte = new Date(filtros.dataFim);
    }

    const eventos = filtros
      ? await Evento.find(filtroMongo).sort({ _id: -1 }).limit(500)
      : [];

    const buffer = await gerarDOCX({ titulo, textoRelatorio, eventos, nomeInstituicao });

    const nomeArquivo = `relatorio_${new Date().toISOString().slice(0, 10)}.docx`;

    // Criando NextResponse e setando Buffer nativo (convertido para não quebrar tipagem no build)
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}
