"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, Calendar } from "lucide-react";

export default function ConsultaPage() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const carregarEventos = async () => {
    setLoading(true);
    try {
      const url = busca ? `/api/eventos?busca=${encodeURIComponent(busca)}` : "/api/eventos";
      const { data } = await axios.get(url);
      if (data.success) {
        setEventos(data.dados);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    carregarEventos();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Consulta de Eventos</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Busque, filtre e visualize as informações cadastradas.</p>
        </div>
      </header>

      {/* Barra de Ferramentas / Filtros */}
      <div className="bg-[var(--color-surface)] p-4 rounded-xl shadow-sm border border-[var(--color-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Buscar por ID, título ou conteúdo..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 bg-[var(--color-background)]"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-[var(--color-text-muted)]" size={20} />
          <button type="submit" className="hidden">Buscar</button>
        </form>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-background)] transition-colors font-medium">
            <Filter size={18} /> Filtros
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-background)] border-b border-[var(--color-border)] text-[var(--color-text-muted)] text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">ID do Evento</th>
                <th className="px-6 py-4 font-semibold">Título</th>
                <th className="px-6 py-4 font-semibold">Data</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[var(--color-text-muted)] animate-pulse">
                    Carregando registros...
                  </td>
                </tr>
              ) : eventos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-[var(--color-text-muted)]">
                    Nenhum evento encontrado.
                  </td>
                </tr>
              ) : (
                eventos.map((evento: any) => (
                  <tr key={evento._id} className="hover:bg-[var(--color-background)]/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{evento._id}</td>
                    <td className="px-6 py-4 font-medium">{evento.titulo}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)] flex items-center gap-2">
                       <Calendar size={16}/>
                       {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${evento.status === 'publicado' ? 'bg-green-100 text-green-700' : 
                          evento.status === 'rascunho' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-gray-100 text-gray-700'}`}
                      >
                        {evento.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium text-sm">
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
