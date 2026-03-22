import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evento from '@/lib/models/Evento';
import { gerarPDF } from '@/lib/services/exportService';

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

    const buffer = await gerarPDF({ titulo, textoRelatorio, eventos, nomeInstituicao });

    const nomeArquivo = `relatorio_${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}
