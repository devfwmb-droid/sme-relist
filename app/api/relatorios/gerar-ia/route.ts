import { NextRequest, NextResponse } from 'next/server';
import { gerarRelatorio } from '@/lib/services/geminiService';

export async function POST(req: NextRequest) {
  try {
    const { dados, contexto, instrucaoExtra } = await req.json();

    if (!dados || !Array.isArray(dados) || dados.length === 0) {
      return NextResponse.json(
        { success: false, mensagem: 'Forneça um array de dados para geração do relatório.' },
        { status: 400 }
      );
    }

    const textoMarkdown = await gerarRelatorio({ dados, contexto, instrucaoExtra });
    return NextResponse.json({ success: true, relatorio: textoMarkdown });
  } catch (error: any) {
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { success: false, mensagem: error.message },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
