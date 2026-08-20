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
  Star,
  Map,
  Package,
  Calendar,
  Layers,
  Database,
  Share2,
  DollarSign,
  Radio,
  FileSpreadsheet
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
      
      {/* HEADER SUPERIOR COM LOGO COMPACTA NO CANTO ESQUERDO */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-white/95 px-2.5 py-1 rounded-xl shadow-md border border-white/20 flex items-center justify-center">
            <img 
              src={logoImg} 
              onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = 'true'; t.src = '/logo.png'; } }}
              alt="Nexus Política" 
              className="h-7 md:h-8 w-auto object-contain" 
            />
          </div>
          <div className="hidden sm:block text-left">
            <span className="font-black text-sm md:text-base text-slate-100 tracking-tight block leading-tight">
              NEXUS <span className="text-blue-500">POLÍTICA</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Gestão & Inteligência Eleitoral
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={`https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20o%20Nexus%20Pol%C3%ADtica.`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/25 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Falar com Consultor</span>
            <span className="sm:hidden">WhatsApp</span>
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
      <section className="relative px-4 md:px-8 pt-12 pb-16 md:pt-16 md:pb-20 max-w-6xl mx-auto text-center space-y-6 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 md:w-[650px] h-96 md:h-[650px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Badge de Destaque */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
          <HeartHandshake className="w-4 h-4 text-emerald-400" />
          A Plataforma Completa de Inteligência, Mobilização e Controle de Votos
        </div>

        {/* Título Principal */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          Transforme apoio de rua em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">votos confirmados</span> na urna
        </h1>

        {/* Subtítulo Humanizado */}
        <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
          O <strong>Nexus Política</strong> é o centro de comando completo para candidatos e coordenadores que querem liderar com organização. Conecte sua coordenação geral, seus líderes de bairro e seus apoiadores em um sistema leve, rápido e 100% no celular.
        </p>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onAccessSystem}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Entrar no Sistema Gratuitamente
          </button>

          <a
            href="#funcionalidades"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-white/10 font-bold text-xs sm:text-sm transition-all"
          >
            Ver Todas as Funcionalidades
          </a>
        </div>

        {/* Destaques Rápidos */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase mb-1">
              <Check className="w-4 h-4" /> WhatsApp wa.me
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Mensagens personalizadas com o nome do eleitor sem pagar taxas
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase mb-1">
              <Users className="w-4 h-4" /> 3 Níveis de Acesso
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Coordenador Geral, Regionais e Líderes de Equipe alinhados
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase mb-1">
              <Smartphone className="w-4 h-4" /> 100% Web & Leve
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Não precisa instalar app na Play Store: roda liso no navegador
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0f172a]/80 border border-white/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase mb-1">
              <MapPin className="w-4 h-4" /> Mapa de Calor
            </div>
            <div className="text-xs text-slate-300 font-medium leading-tight">
              Metas por bairro e histórico do TRE por local de votação
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO: O QUE É O NEXUS POLÍTICA (EXPLICAÇÃO CLARA) */}
      <section className="px-4 md:px-8 py-16 bg-[#0f172a]/50 border-y border-white/10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black uppercase text-blue-400 tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              ENTENDA O PROJETO
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
              O que é e como o Nexus Política faz sua campanha vencer?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
              Uma plataforma pensada para resolver a dor número 1 de qualquer campanha: <strong>o controle e acompanhamento real de eleitores</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                1
              </div>
              <h3 className="font-bold text-slate-100 text-base">Chega de Promessas no Vazio</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Muitas lideranças dizem que têm 500 votos, mas na hora da urna nada aparece. No Nexus, cada líder registra seus apoiadores com nome, telefone e bairro, gerando transparência e confiança mútua.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                2
              </div>
              <h3 className="font-bold text-slate-100 text-base">Contato Direto e Respeitoso</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O eleitor cadastrado não é esquecido. Com apenas um clique, o líder ou coordenador abre a conversa oficial de WhatsApp com mensagem personalizada para acolher, informar e convidar.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                3
              </div>
              <h3 className="font-bold text-slate-100 text-base">Inteligência Tática na Tomada de Decisão</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                O Coordenador Geral enxerga onde a campanha está forte e onde precisa reforçar visitas, carros de som, caminhadas e distribuição de materiais através do mapa de calor em tempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRINCIPAL: TODAS AS FUNCIONALIDADES DETALHADAS */}
      <section id="funcionalidades" className="px-4 md:px-8 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ARSENAL COMPLETO DE FERRAMENTAS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Todas as Funcionalidades que Sua Campanha Precisa
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Do planejamento estratégico no comitê central até a abordagem de porta em porta na rua:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Mapa de Calor */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-blue-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Mapa de Calor da Cidade</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Visualize geograficamente onde estão concentrados seus eleitores e apoiadores por bairro, zona eleitoral e município, direcionando caminhadas e eventos.
            </p>
          </div>

          {/* Card 2: WhatsApp wa.me */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-emerald-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Disparos de WhatsApp sem Taxas</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Envio de mensagens pré-formatadas diretamente pelo WhatsApp oficial do celular de cada operador, chamando o eleitor pelo nome com 100% de taxa de entrega.
            </p>
          </div>

          {/* Card 3: 3 Níveis de Hierarquia */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-amber-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Gestão em 3 Níveis de Comando</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Permissões automáticas para <strong>Coordenador Geral</strong>, <strong>Coordenadores Regionais</strong> e <strong>Líderes de Equipe</strong>, mantendo tudo sob controle.
            </p>
          </div>

          {/* Card 4: Metas em Tempo Real */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-indigo-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Metas e Progresso em Tempo Real</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Defina metas de votos por bairro e acompanhe o percentual alcançado com atualização instantânea (0ms) a cada novo apoiador cadastrado na rua.
            </p>
          </div>

          {/* Card 5: Dados Históricos do TRE */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-purple-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Importação de Dados do TRE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carregue os dados de eleições anteriores e saiba exatamente em quais seções e colégios eleitorais o candidato teve mais votos no passado.
            </p>
          </div>

          {/* Card 6: Logística & Materiais */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-blue-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Logística de Materiais & Combustível</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Controle a entrega de santinhos, bandeiras, adesivos e cotas de combustível para cada equipe com prestação de contas digital.
            </p>
          </div>

          {/* Card 7: Ordem do Dia */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-amber-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Ordem do Dia & Mural Tático</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transmita as diretrizes, recados urgentes e orientações de campanha do dia para que todos os líderes falem a mesma língua nas ruas.
            </p>
          </div>

          {/* Card 8: Link Público de Apoio */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-emerald-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Link de Autocadastro de Apoiadores</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compartilhe seu link exclusivo no Instagram, Facebook e WhatsApp para que os próprios eleitores se cadastrem no time do candidato.
            </p>
          </div>

          {/* Card 9: Financeiro & TSE */}
          <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 hover:border-indigo-500/50 transition-all space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Controle Financeiro & SPCE/TSE</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Gestão de entradas, saídas, comprovantes e emissão de relatórios contábeis para facilitar a prestação de contas no sistema oficial do TSE.
            </p>
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
            
            {/* Plano 0: Degustação 14 Dias Grátis */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-emerald-500/40 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">14 Dias Grátis</span>
                <h3 className="text-xl font-black text-slate-100">Degustação de Campo</h3>
                <div className="text-3xl font-black text-emerald-400">
                  R$ 0 <span className="text-xs text-slate-400 font-normal">/14 dias de teste</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 font-medium">
                  Teste o sistema completo na rua com sua coordenação e líderes antes de investir.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 100 Eleitores Cadastrados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 5 Líderes de Equipe
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 2 Coordenadores Regionais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Mapa de Calor & Metas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> WhatsApp wa.me sem taxas
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={onAccessSystem}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center block transition-all active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                Testar 14 Dias Grátis
              </button>
            </div>
            
            {/* Plano 1: Municipal Tático */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vereador & Prefeituras</span>
                <h3 className="text-xl font-black text-slate-100">Plano Municipal</h3>
                <div className="text-3xl font-black text-slate-100">
                  R$ 397,97 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090d16] border border-white/10 text-[11px] text-slate-300 font-medium">
                  Excelente para campanhas municipais de vereador, bairros e cidades do interior.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 5.000 Eleitores Cadastrados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 50 Líderes de Equipe
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 10 Coordenadores Regionais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Metas por Bairro & Demandas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Disparo WhatsApp wa.me grátis
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.startTatico.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Municipal%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.startTatico}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(397.97)}
                className="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-100 font-bold text-xs text-center block transition-all active:scale-95 border border-white/10"
              >
                Contratar Plano Municipal
              </a>
            </div>

            {/* Plano 2: Estadual Estratégico (Destaque) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-900/40 to-[#0f172a] border-2 border-blue-500 relative flex flex-col justify-between space-y-6 shadow-2xl shadow-blue-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
                Mais Escolhido
              </div>

              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Dep. Estadual & Capitais</span>
                <h3 className="text-xl font-black text-slate-100">Plano Estadual</h3>
                <div className="text-3xl font-black text-slate-100">
                  R$ 697,97 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200 font-medium">
                  Estrutura de alta capacidade para campanhas estaduais com polos em vários municípios.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Até 30.000 Eleitores Cadastrados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 250 Líderes de Equipe
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Até 50 Coordenadores Regionais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Cruzamento Histórico do TRE
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Gestão de Combustível & Logística
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.comandoTatico.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Estadual%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.comandoTatico}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(697.97)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs text-center block shadow-lg shadow-blue-600/30 transition-all active:scale-95"
              >
                Garantir Plano Estadual
              </a>
            </div>

            {/* Plano 3: Nacional Soberano */}
            <div className="p-6 rounded-2xl bg-[#0f172a] border border-amber-500/40 flex flex-col justify-between space-y-6 shadow-md">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Dep. Federal & Majoritárias</span>
                <h3 className="text-xl font-black text-slate-100">Plano Nacional</h3>
                <div className="text-3xl font-black text-white">
                  R$ 1.497,97 <span className="text-xs text-slate-400 font-normal">/mês</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-200 font-medium">
                  Para operações de grande porte, chapas majoritárias, federais e partidos.
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2 font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Eleitores Cadastrados Ilimitados
                  </li>
                  <li className="flex items-center gap-2 font-bold text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Líderes e Regionais Ilimitados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Relatórios SPCE para o TSE
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Servidor Dedicado & Alta Performance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Consultor Estratégico Exclusivo
                  </li>
                </ul>
              </div>

              <a
                href={ASAAS_PLAN_LINKS.dominioTotal.includes("SEU_LINK") ? `https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Quero%20contratar%20o%20Plano%20Nacional%20do%20Nexus%20Pol%C3%ADtica.` : ASAAS_PLAN_LINKS.dominioTotal}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackAdsConversion(1497.97)}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs text-center block transition-all active:scale-95 shadow-lg shadow-amber-600/20"
              >
                Contratar Plano Nacional
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
          <a
            href="/suporte"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] px-3.5 py-1.5 rounded-xl border border-white/10 cursor-pointer shadow-xs text-slate-300"
          >
            <Headphones className="w-3.5 h-3.5 text-emerald-400" /> Central de Suporte
          </a>
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
