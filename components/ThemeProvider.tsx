"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    async function carregarTema() {
      try {
        const { data } = await axios.get("/api/theme");
        if (data.success && data.dados?.cores) {
          setTheme(data.dados);
          const root = document.documentElement;
          const { cores } = data.dados;

          root.style.setProperty("--color-primary", cores.primary);
          root.style.setProperty("--color-primary-hover", cores.primaryHover);
          root.style.setProperty("--color-secondary", cores.secondary);
          root.style.setProperty("--color-accent", cores.accent);
          root.style.setProperty("--color-background", cores.background);
          root.style.setProperty("--color-surface", cores.surface);
          root.style.setProperty("--color-text", cores.text);
          root.style.setProperty("--color-text-muted", cores.textMuted);
          root.style.setProperty("--color-border", cores.border);
          root.style.setProperty("--color-danger", cores.danger);
          root.style.setProperty("--color-sidebar", cores.sidebar);
          root.style.setProperty("--color-sidebar-text", cores.sidebarText);
        }
      } catch (error) {
        console.error("Erro ao carregar tema:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarTema();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <div className="theme-wrapper">{children}</div>;
}
