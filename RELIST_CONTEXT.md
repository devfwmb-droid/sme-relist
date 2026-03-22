# SME RELIST — Resumo de Estado do Projeto (Project Status Summary)

## 📌 Contexto
Este projeto é um sistema gerador e gerenciador de relatórios descritivos da Secretaria Municipal de Educação (SME), utilizando Inteligência Artificial (Gemini) para transformar formulários preenchidos em textos embasados e padronizados.

Anteriormente uma API Express, foi **totalmente migrado para Next.js 15 (App Router)** para facilitar o **deploy serverless na Vercel**. A separação entre Frontend e Backend ocorre no mesmo repositório: 
- Backend via Serverless API Routes (`app/api/*`)
- Frontend via React Server/Client Components usando Tailwind CSS.

## ⚙️ Stack Tecnológico
- **Framework**: Next.js 15 (App Router), TypeScript, React 19.
- **Estilização**: Tailwind CSS v4 + Lucide React (Ícones).
- **Banco de Dados**: MongoDB Atlas via `mongoose` (acessado através de um Singleton wrapper em `lib/mongodb.ts`).
- **Exportação/Documentos**: `jspdf` (Edge-friendly) e `docx` (Node).
- **API de IA**: Google Gemini 1.5 Flash (`@google/generative-ai`).
- **Gráficos**: `recharts`.

## 📁 Estrutura de Diretórios
```text
sme-relist/
├── app/                  # Frontend App Router e API Routes
│   ├── api/              # Handlers (Eventos, FormTypes, Theme, Relatórios, Health)
│   ├── admin/            # Configurações de UI e Formulários
│   ├── consulta/         # Listagem e tabela 
│   ├── dashboard/        # Gráficos de Eventos
│   ├── relatorio/        # IA (Integração Gemini)
│   ├── globals.css       # Configurações de Tailwind CSS Variables
│   └── layout.tsx        # Entrypoint (Sidebar + ThemeProvider)
├── components/           # Componentes encapsulados de View
│   ├── Sidebar.tsx
│   └── ThemeProvider.tsx
├── lib/                  # Backend Interno e Classes Utilitárias
│   ├── mongodb.ts        # Singleton Serverless Connect MongoDB
│   ├── models/           # Mongoose Schemas (Evento, FormType, ThemeConfig)
│   └── services/         # Funções para exportação (PDF, DOCX) e API Gemini AI
└── .env.local            # Chaves sensíveis (GEMINI_API_KEY, MONGODB_URI)
```

## 🏗️ Padrões Importantes para IA / Agentes
1. **Banco de Dados Serverless:** A importação para queries de banco de dados do mongoose **SEMPRE** deve utilizar a chamada inicial à função assíncrona global:
   ```typescript
   import connectDB from '@/lib/mongodb';
   // Dentro do handler:
   await connectDB();
   ```
2. **Cores (Theming):** As cores são renderizadas como Variáveis CSS (e.g. `var(--color-primary)`). Configurações salvas usando `app/api/theme` enviam os defaults se vazios para o `<ThemeProvider>`. Evite hardcodar `#HEX` nos componentes; preencha a model `lib/models/ThemeConfig.ts` e consuma através do `var()`.
3. **Geradores de Buffer PDF/DOCX:** Na rota relatórios/exportar, o Next.js lida com exportação binária retornando um `new NextResponse(buffer, { headers })`. Node APIs (`fs`, pacotes Nativos nativos) são invocadas colocando `export const runtime = 'nodejs'` no início das APIs limitadas.
4. **Variáveis de Ambiente Adicionais:** Todas as vars DEVEM ser cadastradas em Vercel's Environment Variables Settings quando realizado o deploy. Em dev, armazene dentro de `.env.local`.

## 🚀 Como Executar Localmente
\`\`\`bash
npm install
npm run dev
\`\`\`
O sistema estará rodando em `http://localhost:3000`.
