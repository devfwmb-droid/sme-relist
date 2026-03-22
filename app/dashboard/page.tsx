"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FileText, CheckCircle, Clock } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await axios.get("/api/eventos/estatisticas");
        if (data.success) {
          setStats(data.dados);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 animate-pulse text-[var(--color-primary)] font-semibold">Carregando painel...</div>;
  }

  if (!stats) return <p>Falha ao carregar os dados.</p>;

  // Preparando dados para gráficos
  const COLORS = ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)"];
  
  const statusData = stats.porStatus.map((s: any) => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
    value: s.total
  }));

  const mesesStr = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const lineData = stats.porMes.map((m: any) => ({
    name: mesesStr[m._id.mes - 1],
    total: m.total
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">Dashboard</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Visão geral dos eventos e relatórios cadastrados.</p>
      </header>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-100 text-[var(--color-primary)] rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Total de Eventos</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
          </div>
        </div>
        
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-green-100 text-[var(--color-secondary)] rounded-xl">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Publicados</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {stats.porStatus.find((s:any) => s._id === 'publicado')?.total || 0}
            </p>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)] flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-yellow-100 text-[var(--color-accent)] rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--color-text-muted)]">Rascunhos</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {stats.porStatus.find((s:any) => s._id === 'rascunho')?.total || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold mb-6">Eventos por Mês</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lineData}>
                <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-border)' }} 
                />
                <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-6 rounded-2xl shadow-sm border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold mb-6">Distribuição de Status</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60}
                  outerRadius={100} 
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
