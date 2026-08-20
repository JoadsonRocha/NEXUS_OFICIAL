import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Send, 
  Users, 
  Crown, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  BarChart3, 
  Zap, 
  Calculator, 
  Globe, 
  MessageSquare, 
  ChevronRight,
  X,
  FileText,
  Lock,
  Scale,
  HeartHandshake,
  TrendingUp,
  Award,
  Check,
  Star
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { ASAAS_PLAN_LINKS, COMMERCIAL_WHATSAPP_NUMBER } from '../config/asaasConfig';
import { trackAdsConversion } from '../utils/gtag';

interface SalesLandingPageProps {
  onAccessSystem: () => void;
}

export const SalesLandingPage: React.FC<SalesLandingPageProps> = ({ onAccessSystem }) => {
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'refund' | 'tse' | null>(null);
  const [leadersCount, setLeadersCount] = useState(20);
  const [votersPerLeader, setVotersPerLeader] = useState(75);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const estimatedVotes = leadersCount * votersPerLeader;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center p-1 shadow-sm">
            <img src={logoImg} alt="Nexus Política" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-sm md:text-base text-slate-100 tracking-tight hidden sm:inline">
            NEXUS <span className="text-blue-500">POLÍTICA</span>
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={`https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20o%20Nexus%20Pol%C3%ADtica%20para%20minha%20campanha.`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/25 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Falar com Consultor</span>
            <span className="sm:hidden">Consultor</span>
          </a>

          <button
            onClick={onAccessSystem}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
          >
            <span>Acessar Painel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 md:px-8 py-12 md:py-20 max-w-6xl mx-auto text-center space-y-7 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[650px] h-96 md:h-[650px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Badge de Destaque */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          Feito por quem conhece o dia a dia real da política
        </div>

        {/* Logotipo Central */}
        <div className="flex justify-center pt-1 pb-1">
          <div className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl shadow-blue-600/10 border border-slate-200 inline-flex items-center justify-center transition-all hover:scale-105 overflow-hidden">
            <img 
              src={logoImg} 
              onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = 'true'; t.src = '/logo.png'; } }} 
              alt="Nexus Política" 
              className="h-24 sm:h-36 md:h-44 w-auto object-contain scale-110 transform p-1" 
            />
          </div>
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          Campanha que vence é campanha que <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">conhece o eleitor pelo nome</span>
        </h1>

        {/* Subtítulo Humanizado */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          Abandone as anotações perdidas em cadernos e as promessas soltas. Dê à sua equipe uma ferramenta simples e acolhedora para organizar lideranças nos bairros, conversar no WhatsApp com respeito e garantir que cada apoio vire voto no dia da eleição.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onAccessSystem}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Começar Gratuitamente
          </button>

          <a
            href="#planos"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all"
          >
            Conhecer Planos e Preços
          </a>
        </div>

        {/* Destaques Rápidos */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase mb-1">
              <Check className="w-4 h-4" /> 100% Gratuito
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Disparos de WhatsApp direto pelo wa.me sem taxas extras
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase mb-1">
              <Users className="w-4 h-4" /> Equipe Alinhada
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Coordenador Geral, Líderes Regionais e Mobilizadores
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase mb-1">
              <Smartphone className="w-4 h-4" /> Fácil de Usar
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Não precisa baixar nada na loja: funciona no navegador
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase mb-1">
              <MapPin className="w-4 h-4" /> Inteligência Real
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Mapa de calor da sua cidade com metas claras por bairro
            </div>
          </div>
        </div>
      </section>

      {/* COMPARAÇÃO: O JEITO ANTIGO VS. O JEITO NEXUS */}
      <section className="px-4 md:px-8 py-16 bg-[#0f172a]/50 border-y border-white/10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-blue-400 tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              A DIFERENÇA NA PRÁTICA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              A certeza de que sua equipe está no caminho da vitória
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Veja a diferença entre fazer campanha no escuro e liderar com organização tática.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O Jeito Antigo */}
            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-black text-sm uppercase">
                <X className="w-5 h-5" /> Sem o Nexus Política
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Cadernos de anotações perdidos e planilhas desatualizadas no computador.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>O candidato não sabe quantos votos reais cada liderança está trazendo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Eleitores cadastrados que nunca mais recebem uma mensagem ou ligação.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Combustível e materiais distribuídos sem controle de quem realmente está na rua.</span>
                </li>
              </ul>
            </div>

            {/* O Jeito Nexus */}
            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4 shadow-lg shadow-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-sm uppercase">
                <CheckCircle2 className="w-5 h-5" /> Com o Nexus Política
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Tudo no celular:</strong> Líderes cadastram apoiadores no portão de cada casa em segundos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Transparência total:</strong> O Coordenador acompanha o mapa da cidade e o alcance em tempo real.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Acolhimento contínuo:</strong> Mensagens no WhatsApp chamando cada eleitor pelo seu próprio nome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Motivação de equipe:</strong> Metas claras e reconhecimento para quem faz a campanha acontecer.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 NÍVEIS DE COORDENAÇÃO */}
      <section className="px-4 md:px-8 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase text-amber-400 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            A FORÇA DA SUA EQUIPE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Cada pessoa com seu papel, unidas pelo mesmo objetivo
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Uma estrutura simples e transparente que valoriza o trabalho de quem está no comando e de quem está na rua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Nível 1: Coordenador Geral */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-amber-500/40 flex flex-col justify-between space-y-5 shadow-lg shadow-amber-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
                  Comando Estratégico
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-amber-300">1. Coordenador Geral</h3>
                <p className="text-xs text-amber-400/80 font-medium mt-0.5">Visão Global da Campanha</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                Define os objetivos globais da eleição, acompanha o mapa de calor de apoio em toda a cidade, publica as orientações diárias na <strong>Ordem do Dia</strong> e cuida da logística da campanha.
              </p>
            </div>
          </div>

          {/* Nível 2: Coordenador Regional */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-blue-500/40 flex flex-col justify-between space-y-5 shadow-lg shadow-blue-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold text-[10px] uppercase tracking-wider">
                  Articulação Local
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-blue-300">2. Coordenadores Regionais</h3>
                <p className="text-xs text-blue-400/80 font-medium mt-0.5">Liderança de Zonas e Bairros</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                Cuidam de uma região específica, cadastram os líderes de equipe da sua comunidade, distribuem os materiais e garantem que as metas do seu bairro sejam atingidas com sucesso.
              </p>
            </div>
          </div>

          {/* Nível 3: Líderes de Equipe */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-emerald-500/40 flex flex-col justify-between space-y-5 shadow-lg shadow-emerald-500/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] uppercase tracking-wider">
                  Contato com a População
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-emerald-300">3. Líderes de Equipe</h3>
                <p className="text-xs text-emerald-400/80 font-medium mt-0.5">Mobilizadores de Rua e Famílias</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                Conversam diretamente com os vizinhos, amigos e eleitores. Cadastram as pessoas pelo celular e mantêm o contato ativo no WhatsApp com carinho até o dia da votação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULADORA DE ALCANCE ELEITORAL */}
      <section className="px-4 md:px-8 py-16 max-w-5xl mx-auto space-y-8">
        <div className="p-6 md:p-10 rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#090d16] border border-blue-500/30 space-y-8 shadow-2xl">
          
          <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-wider">
            <Calculator className="w-5 h-5" />
            Simulador de Mobilização de Equipe
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-100">
              Quantos eleitores sua equipe pode alcançar?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Mova os controles abaixo e veja a dimensão do que sua campanha pode construir com organização:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Controles */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Líderes de Equipe / Bairro:</span>
                  <span className="text-blue-400 font-black text-sm">{leadersCount} líderes</span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="100" 
                  value={leadersCount} 
                  onChange={(e) => setLeadersCount(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-[#1e293b] rounded-lg h-2 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Eleitores de confiança por Líder:</span>
                  <span className="text-emerald-400 font-black text-sm">{votersPerLeader} eleitores</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  step="5" 
                  value={votersPerLeader} 
                  onChange={(e) => setVotersPerLeader(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-[#1e293b] rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Resultado Estimado */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 flex flex-col justify-center text-center space-y-3 shadow-inner">
              <span className="text-xs uppercase font-black tracking-widest text-slate-400">
                Eleitores Conectados Diretamente
              </span>
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {estimatedVotes.toLocaleString('pt-BR')} Votos
              </div>
              <p className="text-[11px] text-slate-400">
                Apoiadores cadastrados, com nome, telefone e bairro mapeados para contato direto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANOS E VALORES */}
      <section id="planos" className="px-4 md:px-8 py-16 bg-[#0f172a]/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              INVESTIMENTO TRANSPARENTE
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              Escolha a licença ideal para o tamanho da sua campanha
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Todas as ferramentas e recursos estão <strong className="text-emerald-400">100% liberados em todos os planos</strong>. O que muda é apenas o volume de eleitores e equipes da sua operação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            
            {/* Plano 0: Grátis */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-emerald-500/40 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Teste Prático</span>
                <h3 className="text-xl font-black text-slate-100">Plano Grátis</h3>
                <div className="text-3xl font-black text-emerald-400">
                  R$ 0 <span className="text-xs text-slate-400 font-normal">/sem custo</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 font-medium">
                  Ideal para você e seu coordenador testarem o painel e cadastrarem a primeira equipe.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 7 Eleitores Cadastrados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 2 Líderes de Equipe
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 2 Coordenadores Regionais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Acesso ao Mapa e Metas
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onAccessSystem}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center block transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Começar no Plano Grátis
              </button>
            </div>
            
            {/* Plano 1: Start Tático */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Até 2.500 Eleitores</span>
                <h3 className="text-xl font-black text-slate-100">Plano Start</h3>
                <div className="text-3xl font-black text-slate-100">
                  R$ 379 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090d16] border border-white/10 text-[11px] text-slate-300 font-medium">
                  Excelente para pré-campanhas de vereador e mobilizações locais em fase inicial.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 2.500 Eleitores
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 25 Líderes de Bairro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mensagens WhatsApp wa.me grátis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Gestão de demandas da comunidade
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.startTatico.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Start%20T%C3%A1tico%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.startTatico}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(379)}
                className="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-100 font-bold text-xs text-center block transition-all active:scale-95 border border-white/10"
              >
                Contratar Plano Start
              </a>
            </div>

            {/* Plano 2: Comando Tático */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-900/40 to-[#0f172a] border-2 border-blue-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-blue-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                Mais Escolhido
              </div>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Até 10.000 Eleitores</span>
                <h3 className="text-xl font-black text-slate-100">Plano Comando</h3>
                <div className="text-3xl font-black text-slate-100">
                  R$ 679 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200 font-medium">
                  Estrutura robusta para campanhas com presença forte e muitos líderes em campo.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 10.000 Eleitores
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 100 Líderes de Equipe
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mapa de calor e análise por seção
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Suporte com consultor dedicado
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.comandoTatico.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Comando%20T%C3%A1tico%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.comandoTatico}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(679)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center block shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                Garantir Licença Comando
              </a>
            </div>

            {/* Plano 3: Domínio Total */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Capacidade Total</span>
                <h3 className="text-xl font-black text-slate-100">Plano Ilimitado</h3>
                <div className="text-3xl font-black text-white">
                  R$ 850 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 font-medium">
                  Para grandes campanhas majoritárias, prefeituras, deputados e grandes coligações.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Eleitores Ilimitados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Líderes e Equipes Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Todas as funcionalidades liberadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Relatórios contábeis para o TSE
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.dominioTotal.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Dom%C3%ADnio%20Total%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.dominioTotal}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(850)}
                className="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-100 font-bold text-xs text-center block transition-all active:scale-95 border border-white/10"
              >
                Contratar Plano Ilimitado
              </a>
            </div>

          </div>

          {/* GARANTIA DE 7 DIAS */}
          <div className="mt-10 bg-[#0f172a] border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 max-w-4xl mx-auto shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 shrink-0">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-100 flex items-center gap-2 flex-wrap">
                  Garantia de Confiança de 7 Dias 
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Art. 49 do Código de Defesa do Consumidor
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Experimente o Nexus Política com sua equipe por 7 dias. Se você achar que o sistema não atendeu perfeitamente sua campanha, devolvemos 100% do valor pago via PIX ou cartão, sem perguntas ou burocracia.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLegalModal('refund')}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Termos de Garantia
            </button>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="px-4 md:px-8 py-16 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">Dúvidas Frequentes</h2>
          <p className="text-xs sm:text-sm text-slate-400">Respostas claras para perguntas que você ou sua equipe possam ter</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Minha equipe de líderes vai conseguir usar sem dificuldades?",
              a: "Sim! O sistema foi desenvolvido com botões grandes, textos simples e navegação intuitiva. Qualquer pessoa que sabe mandar uma mensagem no WhatsApp consegue cadastrar eleitores e acompanhar suas tarefas no Nexus Política."
            },
            {
              q: "Preciso baixar algum aplicativo pesado no celular?",
              a: "Não precisa baixar nada na Play Store ou App Store. O Nexus Política funciona direto no navegador de internet do celular (Chrome, Safari, etc.) e quase não gasta memória nem plano de dados."
            },
            {
              q: "Como funciona a mensagem de WhatsApp sem pagar mensalidade extra?",
              a: "O sistema monta a mensagem personalizada com o nome e o bairro do eleitor. Ao clicar em enviar, o WhatsApp oficial do seu próprio celular abre na conversa com a mensagem pronta para enviar. É 100% seguro, gratuito e não corre risco de bloqueio de número."
            },
            {
              q: "Os dados dos meus eleitores e da minha campanha ficam seguros?",
              a: "Completamente seguros. O Nexus Política utiliza servidores em nuvem com criptografia de ponta e isolamento total por campanha. Ninguém de fora tem acesso aos dados dos seus eleitores."
            },
            {
              q: "Posso emitir Nota Fiscal para prestação de contas no TSE?",
              a: "Sim! A contratação do sistema gera Nota Fiscal oficial no CNPJ da sua campanha ou no CPF do candidato, pronta para ser anexada na prestação de contas eleitoral (SPCE)."
            },
            {
              q: "Como funciona a garantia de 7 dias?",
              a: "Se durante os primeiros 7 dias de uso você achar que o sistema não ajudou sua equipe, basta nos enviar uma mensagem no WhatsApp que reembolsamos 100% do valor pago na hora via PIX ou estorno de cartão."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-xs">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-3 hover:bg-[#1e293b]/60 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 text-blue-400 transition-transform ${faqOpen === idx ? 'rotate-90' : ''}`} />
              </button>
              {faqOpen === idx && (
                <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 px-4 text-center text-xs text-slate-500 space-y-4 bg-[#090d16]">
        <p className="font-semibold text-slate-300">Nexus Política &bull; Tecnologia com Propósito Humano para Campanhas Vitoriosas</p>
        
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[11px] font-medium text-slate-400">
          <button 
            onClick={() => setShowLegalModal('refund')} 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantia de 7 Dias (CDC)
          </button>
          <button 
            onClick={() => setShowLegalModal('terms')} 
            className="hover:text-blue-400 transition-colors flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Termos de Uso e LGPD
          </button>
          <button 
            onClick={() => setShowLegalModal('tse')} 
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer shadow-xs"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" /> Prestação de Contas (TSE)
          </button>
        </div>

        <p className="text-[10px] text-slate-600 max-w-2xl mx-auto leading-relaxed">
          O Nexus Política é uma plataforma de gestão e organização de campanhas. Garantia incondicional de 7 dias protegida pelo Art. 49 do Código de Defesa do Consumidor e total conformidade com a LGPD (Lei nº 13.709/2018).
        </p>
      </footer>

      {/* MODAL DE TERMOS LEGAIS E POLÍTICA DE REEMBOLSO */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0f172a] border border-white/10 max-w-3xl w-full rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* CABEÇALHO */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="font-black text-slate-100 text-base">Termos Legais, LGPD & Garantia de 7 Dias</h3>
                  <p className="text-[11px] text-slate-400">Transparência jurídica e conformidade eleitoral do Nexus Política</p>
                </div>
              </div>
              <button onClick={() => setShowLegalModal(null)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1e293b] transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ABAS */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
              <button
                onClick={() => setShowLegalModal('refund')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  showLegalModal === 'refund' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> 1. Reembolso (7 Dias CDC)
              </button>

              <button
                onClick={() => setShowLegalModal('terms')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  showLegalModal === 'terms' 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                <FileText className="w-4 h-4" /> 2. Termos de Uso & LGPD
              </button>

              <button
                onClick={() => setShowLegalModal('tse')}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  showLegalModal === 'tse' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
                }`}
              >
                <Scale className="w-4 h-4" /> 3. Prestação de Contas (TSE)
              </button>
            </div>

            {/* CONTEÚDO */}
            <div className="text-xs text-slate-300 space-y-4 leading-relaxed">
              {showLegalModal === 'refund' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2">
                    <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Garantia Incondicional de 7 Dias — Art. 49 do CDC
                    </h4>
                    <p className="text-slate-300">
                      Você tem até <strong>7 (sete) dias corridos</strong> após a contratação para testar todas as funcionalidades com sua equipe. Se decidir cancelar por qualquer motivo, devolvemos 100% do valor pago.
                    </p>
                  </div>

                  <div className="space-y-2 text-slate-300">
                    <p><strong>Como solicitar:</strong> Basta enviar uma mensagem no WhatsApp com o e-mail cadastrado. O estorno é processado na mesma hora pelo gateway de pagamento Asaas via PIX ou estorno de cartão.</p>
                  </div>
                </div>
              )}

              {showLegalModal === 'terms' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl space-y-2">
                    <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      Privacidade dos Dados e Conformidade com a LGPD
                    </h4>
                    <p className="text-slate-300">
                      Os dados da sua campanha são seus. O Nexus Política não compartilha, não aluga e não comercializa nenhuma informação com terceiros.
                    </p>
                  </div>
                </div>
              )}

              {showLegalModal === 'tse' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-2">
                    <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <Scale className="w-4 h-4 text-amber-400" />
                      Prestação de Contas Eleitoral (TSE / SPCE)
                    </h4>
                    <p className="text-slate-300">
                      A contratação gera Nota Fiscal de Serviços no CNPJ da Campanha ou CPF do Candidato, em total conformidade com as regras de prestação de contas do TSE.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end">
              <button
                onClick={() => setShowLegalModal(null)}
                className="px-5 py-2 bg-[#1e293b] hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
