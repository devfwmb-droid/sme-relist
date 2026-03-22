"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Palette, Layers, RefreshCw } from "lucide-react";

export default function AdminPage() {
  const [tema, setTema] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const { data } = await axios.get("/api/theme");
        if (data.success) setTema(data.dados);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingConfig(false);
      }
    }
    init();
  }, []);

  const handleSalvarTema = async () => {
    setSalvando(true);
    try {
      await axios.put("/api/theme", tema);
      window.location.reload(); // Recarrega para aplicar as novas cores do provider
    } catch (e) {
      alert("Erro ao salvar o tema.");
    } finally {
      setSalvando(false);
    }
  };

  const handleColorChange = (key: string, val: string) => {
    setTema({
      ...tema,
      cores: {
        ...tema.cores,
        [key]: val
      }
    });
  }

  if (loadingConfig || !tema) {
    return <div className="p-10 animate-pulse text-center">Carregando painel de administração...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Administração do Sistema</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Configure variáveis visuais, tipos de formulários e acessos.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Painel do Tema */}
        <section className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-4 mb-6">
            <Palette className="text-[var(--color-primary)]" />
            <h2 className="text-xl font-semibold">Identidade Visual (Theme)</h2>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium mb-1">Nome da Instituição</label>
             <input 
               type="text" 
               className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
               value={tema.nomeInstituicao || ""}
               onChange={(e) => setTema({ ...tema, nomeInstituicao: e.target.value })}
             />
          </div>

          <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 mt-6">Cores Principais</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Object.keys(tema.cores || {}).map((cKey) => (
              <div key={cKey} className="flex flex-col gap-1">
                <label className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">{cKey}</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={tema.cores[cKey]} 
                    onChange={(e) => handleColorChange(cKey, e.target.value)}
                    className="h-8 w-10 border-0 rounded cursor-pointer"
                  />
                  <span className="text-xs font-mono">{tema.cores[cKey]}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
             onClick={handleSalvarTema}
             disabled={salvando}
             className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {salvando ? <RefreshCw className="animate-spin" size={18} /> : "Salvar e Aplicar Tema"}
          </button>
        </section>

        {/* Tipos de Formulários */}
        <section className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Layers className="text-[var(--color-secondary)]" />
              <h2 className="text-xl font-semibold">Tipos de Formulário</h2>
            </div>
            <button className="px-3 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-md text-sm font-medium hover:bg-gray-50">
               + Novo Tipo
            </button>
          </div>

          <div className="text-center py-10 bg-[var(--color-background)] rounded-lg text-sm text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)]">
            Aqui serão exibidos os Tipos de Formulários cadastrados no Banco de Dados.
          </div>
        </section>

      </div>
    </div>
  );
}
