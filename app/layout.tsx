import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SME RELIST",
  description: "Gerador de Relatórios para a Secretaria Municipal de Educação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex`}>
        <ThemeProvider>
          <div className="flex min-h-screen w-full">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-y-auto w-full max-w-[1600px] mx-auto">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
