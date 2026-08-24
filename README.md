# 🦅 NEXUS POLÍTICA 2026 (Sistema Águia)
### Plataforma de Gestão Eleitoral, Inteligência de Campo & CRM Político de Alta Performance

<p align="center">
  <img src="src/assets/logo.png" alt="Nexus Política Logo" width="220" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/LGPD-Compliant-10B981?style=for-the-badge&logo=shield&logoColor=white" alt="LGPD" />
  <img src="https://img.shields.io/badge/Build-Passing-22C55E?style=for-the-badge" alt="Build Status" />
</p>

---

## 📌 1. Visão Geral do Projeto

O **Nexus Política (Sistema Águia)** é uma solução tecnológica completa, desenhada especificamente para campanhas eleitorais modernas e operações políticas de alta performance (Majoritárias, Deputado Federal, Estadual e Municipais).

A plataforma unifica em uma única interface intuitiva:
1. **CRM Eleitoral e Gestão de Votos** com rastreamento por árvore de indicações e geolocalização.
2. **Organizador de Caos & Inteligência de Campo:** Algoritmos locais e IA para transformar relatos brutos, anotações de rua e áudios em tarefas, alertas de crise e briefings contextuais para o candidato.
3. **Gestão Financeira & Caixa Forte:** Controle orçamentário rígido, recibos, requisição de combustível e relatórios compatíveis com o SPCE / TSE.
4. **Logística de Materiais e Equipes:** Controle em tempo real de estoque de insumos (santinhos, adesivos, bandeiras) e cotas por região.
5. **Mapeamento TRE:** Contingente eleitoral por zona, seção e locais de votação com mapas interativos.
6. **Conformidade LGPD & Sistema Híbrido de Cookies:** Governança de dados, auditoria de consentimento no Supabase e blindagem jurídica.

---

## 🚀 2. Principais Módulos e Funcionalidades

### 👥 A. CRM Eleitoral & Gestão de Eleitores
- **Cadastro Completo:** Registro ágil de eleitores com telefone, endereço, zona/seção eleitoral, profissão e foto.
- **Sentimento do Eleitor:** Classificação visual rápida (*Apoiador*, *Neutro*, *Oposição*).
- **Árvore de Multiplicação de Votos:** Rastreamento de quem indicou quem (`indicated_by`), permitindo identificar os maiores cabos eleitorais e multiplicadores de voto da campanha.
- **Modo Comunidades & Lideranças Tradicionais:** Marcador para atendimento a populações indígenas, Tuxauas e comunidades ribeirinhas/interior.
- **Exportação Profissional:** Geração instantânea de relatórios em **PDF**, **Excel (.xlsx)** e **Word (.docx)**.

### 🧠 B. Inteligência Estratégica & "Organizador de Caos"
- **Processamento de Relatos de Campo:** Transforma anotações soltas e transcrições de conversas em:
  - **Tarefas Logísticas:** Verba, combustível, veículos e materiais.
  - **Ações Políticas:** Reuniões com lideranças locais, compromissos comunitários e alianças.
  - **Alertas de Crise:** Detecção antecipada de problemas em bairros, estradas vicinais ou denúncias.
- **Gerador de Briefings para o Candidato:** Síntese contextual por município com prioridades, temas sensíveis a evitar e tom de discurso recomendado antes de qualquer comício ou caminhada.

### 🗺️ C. Mapeamento TRE & Geolocalização
- **Dados Oficiais de Zonas e Seções:** Mapeamento eleitoral detalhado por municípios, bairros e seções.
- **Mapa Interativo (Geomap):** Visualização térmica e espacial da densidade de apoiadores e votos conquistados em tempo real.
- **Cruzamento Histórico:** Identificação de colégios eleitorais prioritários e zonas com maior potencial de crescimento.

### 🛡️ D. Gestão de Equipes & Hierarquia de Acesso (RBAC)
- **Hierarquia em 4 Níveis:**
  1. **Administrador Master:** Acesso irrestrito a configurações globais.
  2. **Coordenador Geral:** Visão macro da campanha, caixa financeiro, aprovações e relatórios executivos.
  3. **Coordenador Regional:** Gestão das equipes de uma zona ou microrregião específica.
  4. **Líder de Equipe / Cabo Eleitoral:** Acesso focado no cadastro de rua, solicitações de apoio e metas de votos.
- **Convites Rápidos via WhatsApp:** Geração de links de login instantâneo com token criptografado para cadastrar novos líderes sem atrito.
- **Página de Autocadastro Público (`/cadastro`):** Link exclusivo para cada equipe/líder captar eleitores organicamente.

### 💰 E. Caixa Forte & Gestão Financeira (SPCE / TSE)
- **Controle Rígido de Entradas e Saídas:** Registro de receitas, doações e despesas por categoria contábil.
- **Sigilo Financeiro com RLS:** Transações financeiras só são visíveis para a coordenação geral; líderes têm acesso bloqueado.
- **Solicitações de Urgência & Combustível:** Fluxo de pedidos em tempo real de equipes de rua com justificativa e aprovação em 1 clique.
- **Comprovantes e Recibos:** Upload e vinculação de comprovantes fiscais para prestação de contas.

### 📦 F. Logística de Materiais & Insumos
- **Controle de Estoque:** Entrada e saída de santinhos, bandeiras, praguinhas, adesivos perfurados e camisetas.
- **Requisições das Equipes:** Histórico de entregas e saldo de materiais por líder de equipe.

### 📅 G. Agenda do Candidato & Eventos
- **Gestão de Compromissos:** Caminhadas, comícios, carreatas, sabatinas e reuniões com lideranças.
- **Detecção de Conflitos:** Alerta visual em caso de sobreposição de horários ou distâncias logísticas inviáveis.

### 💬 H. Disparos e Comunicação WhatsApp
- **Disparo Direto:** Integração via protocolo `wa.me` para envio individual ou em lote.
- **Tags Dinâmicas:** Personalização da mensagem com o nome do eleitor, líder e município.

### 🍪 I. Sistema Híbrido de Consentimento de Cookies & LGPD *(Novo)*
- **Banner Fluido com Glassmorphism:** Micro-animação suave que não atrapalha a navegação móvel ou desktop.
- **Arquitetura Híbrida Inteligente:**
  - *Visitantes Anônimos:* Gravação instantânea (0ms) no `localStorage` sob a chave `nexus_cookie_consent_v1`.
  - *Usuários Autenticados:* Sincronização automática com o Supabase (`users` e coleção de auditoria `user_consents` com log de IP/UserAgent/Data).
- **Painel de Preferências:** Permite ao usuário escolher entre *Cookies Essenciais*, *Preferências de Tema* e *Desempenho/Cache*.
- **Acesso Global:** Botões de reconfiguração disponíveis no rodapé da Landing Page, na Política de Cookies (`/cookies`) e no Perfil do Usuário.

### 🛒 J. Landing Page de Vendas & Planos Comerciais
- **Design de Alta Conversão:** Visual moderno e escuro (*dark mode premium*) com calculadora de metas de votos, depoimentos e garantias.
- **Planos Configuráveis:**
  - 🟢 **Degustação de Campo:** R$ 0 (14 Dias Grátis)
  - 🔵 **Municipal Tático:** R$ 597,97/mês
  - 🟣 **Estadual Estratégico:** R$ 997,97/mês
  - 🟡 **Nacional Soberano:** R$ 1.497,97/mês
- **Garantia Incondicional de 7 Dias:** Totalmente respaldada pelo Art. 49 do Código de Defesa do Consumidor (CDC).

---

## 🏗️ 3. Arquitetura e Stack Tecnológica

```
NEXUS_OFICIAL/
├── 🌐 Frontend: React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + Motion
├── ⚡ Backend / API Server: Node.js 20 + Express + esbuild (dist/server.cjs)
├── 🗄️ Banco de Dados: Supabase PostgreSQL 15 (Row Level Security - RLS)
├── 📱 Offline Engine: LocalStorage + Buffer de Sincronização em Background
└── 📊 Relatórios: docx + jspdf + xlsx + Recharts
```

---

## 📂 4. Estrutura de Diretórios

```bash
NEXUS_OFICIAL/
├── dist/                      # Bundle de produção otimizado (SPA + server.cjs)
├── public/                    # Arquivos estáticos públicos e favicon
├── src/
│   ├── assets/                # Imagens, logomarcas e vetores
│   ├── components/            # Componentes React da aplicação
│   │   ├── common/            # Componentes globais (CookieConsentBanner, SystemLoadingScreen)
│   │   ├── coordinator/       # Telas e widgets do Coordenador Geral/Regional
│   │   ├── cabo/              # Telas e formulários do Líder de Equipe / Cabo
│   │   ├── dashboard/         # Organismos, mapas e insights analíticos
│   │   ├── routing/           # Rotas protegidas (ProtectedRoute, PublicRoute)
│   │   ├── CoordinatorDashboard.tsx # Painel mestre de coordenação
│   │   ├── CaboDashboard.tsx        # Painel mestre de campo/líder
│   │   ├── EleitoralDashboard.tsx   # Dashboard analítico e gráficos
│   │   ├── PublicVoterRegister.tsx  # Tela pública de cadastro (/cadastro)
│   │   └── SalesLandingPage.tsx     # Landing page de vendas e planos
│   ├── config/                # Configurações de planos Asaas e WhatsApp
│   ├── data/                  # Schemas SQL e dados estáticos de zonas/seções
│   ├── lib/                   # Serviços e integrações de banco de dados
│   │   ├── SupabaseProvider.tsx     # Contexto global de autenticação e sessão
│   │   ├── supabaseService.ts       # Camada de abstração e cache reativo
│   │   ├── planService.ts           # Regras de limite de planos e validações
│   │   ├── candidateService.ts      # Dados do candidato da campanha
│   │   └── treDataService.ts        # Processamento e georreferenciamento TRE
│   ├── pages/                 # Páginas da aplicação
│   │   ├── LoginPage.tsx            # Tela de autenticação
│   │   ├── DashboardPage.tsx        # Roteador dinâmico de painéis por perfil
│   │   ├── ProfilePage.tsx          # Perfil, preferências de tema e cookies
│   │   ├── TermsPage.tsx            # Termos de Uso e LGPD
│   │   ├── PrivacyPage.tsx          # Política de Privacidade
│   │   ├── CookiesPage.tsx          # Política de Cookies interativa
│   │   └── SupportPage.tsx          # Central de suporte ao cliente
│   ├── App.tsx                # Componente raiz com roteamento global
│   └── main.tsx               # Ponto de entrada React
├── server.ts                  # Servidor de produção Express com CSP e hardening
├── schema.sql                 # Script SQL completo com tabelas, RLS e triggers
├── vite.config.ts             # Configuração do Vite e otimizações de build
├── package.json               # Dependências e scripts do projeto
└── README.md                  # Documentação oficial do projeto
```

---

## 🔒 5. Modelo de Segurança & RLS (Row Level Security)

O sistema segue o princípio de **privilégio mínimo** com políticas ativas no PostgreSQL do Supabase:

| Tabela | RLS Líder de Equipe | RLS Coordenação Geral | RLS Público Anônimo |
| :--- | :--- | :--- | :--- |
| `voters` | Apenas eleitores cadastrados por ele | Todos os eleitores da campanha | Apenas inserção via `/cadastro` |
| `transactions` | ❌ Acesso Bloqueado | Leitura e Escrita Total | ❌ Acesso Bloqueado |
| `urgencies` | Criação e Leitura das suas próprias | Aprovação e Gestão de todas | ❌ Acesso Bloqueado |
| `materials` | Leitura e Solicitação de cota | Gestão de estoque e aprovação | ❌ Acesso Bloqueado |
| `user_consents`| Leitura do seu próprio consentimento | Auditoria LGPD | ❌ Acesso Bloqueado |

---

## 🛠️ 6. Instalação e Execução Local

### Pré-requisitos
- **Node.js:** Versão 20.x ou superior
- **NPM** ou **Yarn**

### Passo a Passo

1. **Clonar o Repositório:**
```powershell
git clone https://github.com/JoadsonRocha/NEXUS_OFICIAL.git
cd NEXUS_OFICIAL
```

2. **Instalar Dependências:**
```powershell
npm install
```

3. **Configurar Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

4. **Executar em Modo de Desenvolvimento:**
```powershell
npm run dev
```
Acesse a aplicação no navegador em `http://localhost:5173`.

5. **Gerar Build de Produção:**
```powershell
npm run build
```
O comando irá compilar a aplicação React com o Vite e empacotar o servidor Node.js com o `esbuild` no diretório `dist/`.

6. **Iniciar Servidor de Produção:**
```powershell
node dist/server.cjs
```

---

## 📜 7. Conformidade com a Legislação Brasileira

- **LGPD (Lei nº 13.709/2018):** O sistema atua como operador tecnológico de dados. Termos de responsabilidade, política de cookies auditada e direitos do titular são respeitados integralmente.
- **Código de Defesa do Consumidor (Art. 49):** Garantia incondicional de reembolso em até 7 dias corridos para todas as contratações de planos.
- **Resoluções do TSE (Tribunal Superior Eleitoral):** Módulo de prestação de contas com categorias espelhadas nas rubricas oficiais do SPCE.

---

## 👨‍💻 8. Autoria e Suporte

Desenvolvido para campanhas eleitorais vitoriosas com propósito, estratégia e tecnologia de ponta.

- **Coordenação Comercial / WhatsApp:** [(95) 99158-7413](https://wa.me/5595991587413)
- **Central de Atendimento:** `/suporte`

---
<p align="center">
  <strong>Nexus Política &bull; Tecnologia com Propósito Humano para Campanhas Vitoriosas</strong>
</p>
