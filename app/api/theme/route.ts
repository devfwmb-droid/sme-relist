import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ThemeConfig from '@/lib/models/ThemeConfig';

export async function GET() {
  try {
    await connectDB();
    let config = await ThemeConfig.findOne({ singletonKey: 'default' });

    if (!config) {
      config = await ThemeConfig.create({ singletonKey: 'default' });
    }

    return NextResponse.json({ success: true, dados: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Impede a alteração da chave do singleton
    delete body.singletonKey;

    let config = await ThemeConfig.findOne({ singletonKey: 'default' });
    if (!config) {
      config = await ThemeConfig.create({ singletonKey: 'default' });
    }

    // Mescla o objeto parcial de cores se enviado
    if (body.cores && typeof body.cores === 'object') {
      body.cores = { ...config.cores, ...body.cores };
    }

    config = await ThemeConfig.findOneAndUpdate(
      { singletonKey: 'default' },
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, dados: config });
  } catch (error: any) {
    return NextResponse.json({ success: false, mensagem: error.message }, { status: 400 });
  }
}
