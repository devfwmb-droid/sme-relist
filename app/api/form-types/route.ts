import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FormType from '@/lib/models/FormType';

export async function GET() {
  try {
    await connectDB();
    const formTypes = await FormType.find().sort({ nome: 1 });
    return NextResponse.json({ success: true, dados: formTypes });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const formType = new FormType(body);
    await formType.save();

    return NextResponse.json({ success: true, dados: formType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 400 });
  }
}
