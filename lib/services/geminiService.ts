import { GoogleGenerativeAI } from '@google/generative-ai';

interface GerarRelatorioParams {
  dados: any[];
  contexto?: string;
  instrucaoExtra?: string;
}

const INSTRUCAO_SISTEMA = `Você é um assistente especializado em redação técnica para a Secretaria Municipal de Educação.
Sua tarefa é redigir relatórios técnicos formais, claros e bem estruturados com base nos dados fornecidos.
O relatório deve seguir padrões de documentação oficial pública:
- Linguagem formal e objetiva
- Estrutura com introdução, desenvolvimento e conclusão
- Tabelas e listas quando necessário para organizar os dados
- Conclusões e destaques relevantes baseados nos dados
- Formato de saída: Markdown
Nunca invente dados. Use apenas as informações fornecidas.`;

/**
 * Gera um relatório técnico formal em Markdown usando o Gemini 1.5 Flash.
 */
export async function gerarRelatorio({ dados, contexto = '', instrucaoExtra = '' }: GerarRelatorioParams): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no ambiente.');
  }

  if (!dados || dados.length === 0) {
    throw new Error('Nenhum dado fornecido para geração do relatório.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: INSTRUCAO_SISTEMA,
  });

  const dadosFormatados = JSON.stringify(dados, null, 2);

  const prompt = `${contexto ? `**Contexto:** ${contexto}\n\n` : ''}${
    instrucaoExtra ? `**Instrução adicional:** ${instrucaoExtra}\n\n` : ''
  }**Total de registros:** ${dados.length}

**Dados para o relatório:**
\`\`\`json
${dadosFormatados}
\`\`\`

Com base nesses dados, redija o relatório técnico formal conforme as instruções.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
