import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Evento from '@/lib/models/Evento';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const evento = await Evento.findById(id).populate('formTypeId');
    if (!evento) {
      return NextResponse.json({ success: false, mensagem: 'Evento não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, dados: evento });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    const evento = await Evento.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!evento) {
      return NextResponse.json({ success: false, mensagem: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, dados: evento });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();

    const evento = await Evento.findByIdAndDelete(id);
    if (!evento) {
      return NextResponse.json({ success: false, mensagem: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, mensagem: 'Evento removido com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}
