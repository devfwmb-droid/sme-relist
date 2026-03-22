import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evento from '@/lib/models/Evento';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const formTypeId = searchParams.get('formTypeId');
    const status = searchParams.get('status');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');
    const busca = searchParams.get('busca');
    const pagina = searchParams.get('pagina') || '1';
    const limite = searchParams.get('limite') || '20';

    const filtro: any = {};
    if (formTypeId) filtro.formTypeId = formTypeId;
    if (status) filtro.status = status;
    if (dataInicio || dataFim) {
      filtro.dataEvento = {};
      if (dataInicio) filtro.dataEvento.$gte = new Date(dataInicio);
      if (dataFim) filtro.dataEvento.$lte = new Date(dataFim);
    }
    if (busca) {
      filtro.$or = [
        { titulo: { $regex: busca, $options: 'i' } },
        { 'dados': { $regex: busca, $options: 'i' } },
      ];
    }

    const pageCount = parseInt(pagina, 10);
    const limitCount = parseInt(limite, 10);
    const skip = (pageCount - 1) * limitCount;

    const total = await Evento.countDocuments(filtro);
    const eventos = await Evento.find(filtro)
      .populate('formTypeId', 'nome campos cor')
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limitCount);

    return NextResponse.json({
      success: true,
      dados: eventos,
      paginacao: {
        total,
        pagina: pageCount,
        limite: limitCount,
        paginas: Math.ceil(total / limitCount),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    const evento = new Evento(body);
    await evento.save();
    
    return NextResponse.json({ success: true, dados: evento }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 400 });
  }
}
