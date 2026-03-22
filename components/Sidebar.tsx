"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  Settings,
  Menu
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/consulta", icon: FileText, label: "Eventos" },
  { href: "/relatorio", icon: Sparkles, label: "IA Relatórios" },
  { href: "/admin", icon: Settings, label: "Administração" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-primary)] text-white rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar background overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen z-40
          w-64 bg-[var(--color-sidebar)] text-[var(--color-sidebar-text)]
          flex flex-col shadow-xl transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center font-bold text-[var(--color-sidebar)]">
              RE
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">
              SME Relist
            </h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors
                  ${isActive 
                    ? "bg-[var(--color-primary)] text-white" 
                    : "hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-sidebar-text)]"
                  }
                `}
              >
                <item.icon size={20} className={isActive ? "opacity-100" : "opacity-70"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 text-xs text-center opacity-50 border-t border-[rgba(255,255,255,0.1)]">
          &copy; {new Date().getFullYear()} SME
        </div>
      </aside>
    </>
  );
}
