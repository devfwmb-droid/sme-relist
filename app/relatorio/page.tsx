"use client";

import { useState } from "react";
import axios from "axios";
import { Play, Download, Settings2 } from "lucide-react";

export default function RelatorioPage() {
  const [instrucao, setInstrucao] = useState("");
  const [relatorio, setRelatorio] = useState("");
  const [loading, setLoading] = useState(false);

  const testarIA = async () => {
    setLoading(true);
    setRelatorio("");
    try {
      // Simulando dados de eventos para não depender do banco vazio
      const dadosMock = [
        { _id: "2026032200", titulo: "Reunião de Pais e Mestres", dataEvento: "2026-03-22", status: "publicado", dados: { participantes: 120, feedback: "Muito positivo" } },
        { _id: "2026032201", titulo: "Apresentação da Banda", dataEvento: "2026-03-22", status: "publicado", dados: { participantes: 400, feedback: "Excelente" } }
      ];

      const { data } = await axios.post("/api/relatorios/gerar-ia", {
        dados: dadosMock,
        contexto: "Resumo semanal dos eventos escolares.",
        instrucaoExtra: instrucao
      });

      if (data.success) {
        setRelatorio(data.relatorio);
      }
    } catch (error: any) {
      alert("Erro ao gerar relatório (verifique console e API KEY do Gemini): " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportar = async (formato: 'pdf' | 'docx') => {
    try {
      const resp = await axios.post(`/api/relatorios/exportar-${formato}`, {
        titulo: "Relatório de Teste Exportação",
        textoRelatorio: relatorio,
        eventos: [], // Enviando vazio pois a prioridade será o texto Markdown
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_sme.${formato}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      alert("Erro na exportação.");
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Gerador de IA (Gemini)</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Crie relatórios descritivos completos baseados nos dados dos eventos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel de Configuração */}
        <div className="bg-[var(--color-surface)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] h-fit">
          <div className="flex items-center gap-2 mb-4">
             <Settings2 className="text-[var(--color-primary)]" />
             <h2 className="text-xl font-semibold">Configurações e Contexto</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Instrução Extra (Opcional)</label>
              <textarea 
                className="w-full p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:outline-none"
                rows={4}
                placeholder="Exemplo: Foque nos pontos positivos abordados..."
                value={instrucao}
                onChange={(e) => setInstrucao(e.target.value)}
              />
            </div>
            <button 
              onClick={testarIA}
              disabled={loading}
              className="w-full py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Play size={18} /> Gerar Relatório via IA</>
              )}
            </button>
          </div>
        </div>

        {/* Console / Output */}
        <div className="bg-[var(--color-surface)] p-6 rounded-xl shadow-sm border border-[var(--color-border)] flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-xl font-semibold">Resultado</h2>
             <div className="flex gap-2">
               <button 
                  onClick={() => exportar('pdf')}
                  disabled={!relatorio} 
                  className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
               >
                 <Download size={14}/> PDF
               </button>
               <button 
                  onClick={() => exportar('docx')}
                  disabled={!relatorio} 
                  className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
               >
                 <Download size={14}/> DOCX
               </button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 rounded-lg border border-[var(--color-border)] text-sm font-mono whitespace-pre-wrap">
            {loading ? "Aguardando Gemini..." : relatorio || "Clique em 'Gerar' para obter um relatório baseado nos eventos cadastrados."}
          </div>
        </div>
      </div>
    </div>
  );
}
