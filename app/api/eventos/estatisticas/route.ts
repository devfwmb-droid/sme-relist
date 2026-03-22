import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evento from '@/lib/models/Evento';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const formTypeId = searchParams.get('formTypeId');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    const matchFiltro: any = {};

    if (formTypeId) {
      matchFiltro.formTypeId = formTypeId;
    }

    if (dataInicio || dataFim) {
      matchFiltro.dataEvento = {};
      if (dataInicio) matchFiltro.dataEvento.$gte = new Date(dataInicio);
      if (dataFim) matchFiltro.dataEvento.$lte = new Date(dataFim);
    }

    const [total, porStatus, porMes] = await Promise.all([
      Evento.countDocuments(matchFiltro),
      Evento.aggregate([
        { $match: matchFiltro },
        { $group: { _id: '$status', total: { $sum: 1 } } },
      ]),
      Evento.aggregate([
        { $match: matchFiltro },
        {
          $group: {
            _id: {
              ano: { $year: '$dataEvento' },
              mes: { $month: '$dataEvento' },
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { '_id.ano': 1, '_id.mes': 1 } },
        { $limit: 12 },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      dados: { total, porStatus, porMes },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}
