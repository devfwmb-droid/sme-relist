import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FormType from '@/lib/models/FormType';
import Evento from '@/lib/models/Evento';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const formType = await FormType.findById(id);
    if (!formType) {
      return NextResponse.json({ success: false, mensagem: 'Tipo de formulário não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, dados: formType });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const formType = await FormType.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!formType) {
      return NextResponse.json({ success: false, mensagem: 'Tipo de formulário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, dados: formType });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const formType = await FormType.findById(id);
    if (!formType) {
      return NextResponse.json({ success: false, mensagem: 'Tipo de formulário não encontrado' }, { status: 404 });
    }

    const eventosVinculados = await Evento.countDocuments({ formTypeId: id });
    if (eventosVinculados > 0) {
      return NextResponse.json(
        { success: false, mensagem: 'Não é possível remover porque existem eventos vinculados a este tipo de formulário.' },
        { status: 400 }
      );
    }

    await formType.deleteOne();
    return NextResponse.json({ success: true, mensagem: 'Tipo de formulário removido com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}
