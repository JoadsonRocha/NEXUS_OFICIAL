import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import { TreLocationFields } from './TreLocationFields';
import { WhatsAppDispatchModal } from './WhatsAppDispatchModal';
import { SystemManualModal } from './SystemManualModal';
import { getGPSLocation } from '../lib/geoService';
import { 
  BookOpen,
  ShieldCheck, 
  Fuel, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Mic,
  Wifi,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Camera,
  UserPlus,
  StickyNote,
  RefreshCcw,
  User,
  Brain,
  Send,
  X,
  Plus,
  Check,
  Copy,
  LogIn,
  LogOut,
  Settings,
  Upload,
  Calendar,
  Clock,
  FileText,
  FileDown,
  FileSpreadsheet,
  GanttChart,
  Trash2,
  Edit3,
  Lock,
  Phone,
  LayoutDashboard,
  Layers,
  DollarSign,
  Briefcase,
  Target,
  Wallet,
  History,
  TrendingUp,
  Printer,
  Zap,
  MessageSquare,
  Search,
  Package,
  Handshake,
  Activity,
  Sun,
  Moon,
  Loader2,
  Mail,
  Map as MapIcon,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { processarCaos, gerarBriefingCandidato, processarNotaAudio } from '../services/geminiService';
import { sugerirMetaInteligente, analisarRaioXEquipe } from '../services/groqService';
import { reportService } from '../services/reportService';
import { useAuth } from '../lib/SupabaseProvider';
import { supabaseService } from '../lib/supabaseService';
import { candidateService, CandidateInfo, DEFAULT_CANDIDATE_INFO, isRealCandidate } from '../lib/candidateService';
import { showToast } from './GlobalToastHost';
import { getSubscriptionInfo, saveSubscriptionPlan, PlanType, PLAN_CONFIGS, validateLeaderRegistration, validateRegionalRegistration, triggerUpgradeRedirect } from '../lib/planService';
import NoteCard from './NoteCard';
import RoraimaMapComponent from './RoraimaMapComponent';
import EleitoralDashboard from './EleitoralDashboard';
import PublicVoterRegister from './PublicVoterRegister';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { validarSugestaoAgenda, AgendaItem } from '../lib/agendaLogic';
import * as XLSX from 'xlsx';
import { safeLocalStorage } from '../utils/safeStorage';
import { isLocationMatchingGoal } from '../data/roraimaTreData';
import { clearTreLocationsCache } from '../lib/treDataService';

const AVAILABLE_COLUMNS_BY_TYPE: Record<string, { header: string; dataKey: string }[]> = {
  teams: [
    { header: 'Zona/Equipe', dataKey: 'name' },
    { header: 'Líder', dataKey: 'leader' },
    { header: 'Localização', dataKey: 'location' },
    { header: 'Eleitores', dataKey: 'realContacts' },
    { header: 'Demandas', dataKey: 'demandCount' },
    { header: 'Gasto Real', dataKey: 'spentStr' },
    { header: 'Status', dataKey: 'status' }
  ],
  voters: [
    { header: 'Nome', dataKey: 'name' },
    { header: 'Telefone', dataKey: 'phone' },
    { header: 'Equipe/Zona', dataKey: 'teamDisplay' },
    { header: 'Indicado por', dataKey: 'referredByDisplay' },
    { header: 'Sentimento', dataKey: 'sentiment' },
    { header: 'Votou', dataKey: 'votedStatus' },
    { header: 'Endereço', dataKey: 'address' },
    { header: 'Comunidade/Família', dataKey: 'familyCommunity' },
    { header: 'Comunidade Indígena', dataKey: 'communityName' },
    { header: 'Tuxaua', dataKey: 'tuxauaName' },
    { header: 'Score Fidelidade', dataKey: 'loyaltyScore' },
    { header: 'Observações', dataKey: 'observations' },
    { header: 'Tags', dataKey: 'tagsStr' }
  ],
  productivity: [
    { header: 'Posição', dataKey: 'rank' },
    { header: 'Liderança', dataKey: 'leader' },
    { header: 'Equipe/Zona', dataKey: 'team' },
    { header: 'Total Eleitores', dataKey: 'totalVoters' },
    { header: 'Apoios Confirmados', dataKey: 'supportVoters' },
    { header: '% Conversão', dataKey: 'conversionRate' },
    { header: 'Score Médio', dataKey: 'avgLoyalty' },
    { header: 'Status Desempenho', dataKey: 'leaderStatus' }
  ],
  zone_performance: [
    { header: 'Município', dataKey: 'municipality' },
    { header: 'Zona Eleitoral', dataKey: 'zona' },
    { header: 'Seção', dataKey: 'secao' },
    { header: 'Eleitores Mapeados', dataKey: 'mappedVoters' },
    { header: 'Votos Confirmados', dataKey: 'confirmedVotes' },
    { header: 'Neutros', dataKey: 'neutralVoters' },
    { header: 'Oposição', dataKey: 'opposedVoters' },
    { header: 'Diagnóstico', dataKey: 'densityStatus' }
  ],
  agenda_coverage: [
    { header: 'Município/Região', dataKey: 'municipality' },
    { header: 'Eleitores na Base', dataKey: 'voterCount' },
    { header: 'Equipes Ativas', dataKey: 'teamCount' },
    { header: 'Eventos/Visitas', dataKey: 'eventCount' },
    { header: 'Status Cobertura', dataKey: 'coverageStatus' },
    { header: 'Última Visita', dataKey: 'lastEventDate' },
    { header: 'Ação Recomendada', dataKey: 'urgencyLevel' }
  ],
  materials: [
    { header: 'Material', dataKey: 'name' },
    { header: 'Total', dataKey: 'total' },
    { header: 'Disponível', dataKey: 'current' },
    { header: 'Usado', dataKey: 'used' }
  ],
  demands: [
    { header: 'Título', dataKey: 'title' },
    { header: 'Equipe/Zona', dataKey: 'team' },
    { header: 'Prioridade', dataKey: 'priority' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Data', dataKey: 'dateStr' }
  ]
};

export const isVoterInTeam = (voter: any, team: any) => {
  if (!voter || !team) return false;

  if (team.id && (voter.teamId === team.id || voter.leaderId === team.id)) return true;
  if (voter.teamId && (voter.teamId === team.id || voter.teamId === team.teamId)) return true;
  if (voter.leaderId && (voter.leaderId === team.id || voter.leaderId === team.leaderId || voter.leaderId === team.createdBy)) return true;

  const teamName = (team.name || '').trim().toLowerCase();
  const voterTeam = (voter.team || '').trim().toLowerCase();
  const voterTeamName = (voter.teamName || '').trim().toLowerCase();
  if (teamName && (voterTeam === teamName || voterTeamName === teamName)) return true;

  const teamLeader = (team.leader || team.leaderName || '').trim().toLowerCase();
  const voterLeader = (voter.leaderName || '').trim().toLowerCase();
  if (teamLeader && voterLeader && teamLeader === voterLeader) return true;

  const teamLeaderEmail = (team.leaderEmail || team.email || '').trim().toLowerCase();
  const voterLeaderEmail = (voter.leaderEmail || voter.registeredBy || voter.createdBy || '').trim().toLowerCase();
  if (teamLeaderEmail && voterLeaderEmail && teamLeaderEmail === voterLeaderEmail) return true;

  return false;
};

export default function CoordinatorDashboard({ 
  theme, 
  setTheme
}: { 
  theme: 'light' | 'dark'; 
  setTheme: (t: 'light' | 'dark') => void;
}) {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, login, logout, isAdmin, isGeral, isRegional, isLeader, userRegion, coordinatorId } = useAuth();

  const ACTIVE_TAB_KEY = 'nexus_coordinator_active_tab';
  type ActiveTabType = 'overview' | 'candidato' | 'regional_coords' | 'metas' | 'teams' | 'voters' | 'agenda' | 'mapa' | 'notes' | 'materials' | 'demands' | 'reports' | 'analise_eleitoral';
  
  const resolveInitialTab = (): ActiveTabType => {
    const rawTab = params.tab || searchParams.get('tab');
    const validTabs: ActiveTabType[] = ['overview', 'candidato', 'regional_coords', 'metas', 'teams', 'voters', 'agenda', 'mapa', 'notes', 'materials', 'demands', 'reports', 'analise_eleitoral'];
    if (rawTab && validTabs.includes(rawTab as ActiveTabType)) {
      return rawTab as ActiveTabType;
    }
    try {
      const saved = localStorage.getItem(ACTIVE_TAB_KEY);
      if (saved && validTabs.includes(saved as ActiveTabType)) return saved as ActiveTabType;
    } catch (_) {}
    return 'overview';
  };

  const [activeTab, setActiveTabState] = useState<ActiveTabType>(resolveInitialTab);

  const setActiveTab = (tab: ActiveTabType) => {
    try { localStorage.setItem(ACTIVE_TAB_KEY, tab); } catch (_) {}
    setActiveTabState(tab);
    setSearchParams(prev => {
      const updated = new URLSearchParams(prev);
      updated.set('tab', tab);
      return updated;
    }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const currentTab = params.tab || searchParams.get('tab');
    if (currentTab && currentTab !== activeTab) {
      const validTabs: ActiveTabType[] = ['overview', 'candidato', 'regional_coords', 'metas', 'teams', 'voters', 'agenda', 'mapa', 'notes', 'materials', 'demands', 'reports', 'analise_eleitoral'];
      if (validTabs.includes(currentTab as ActiveTabType)) {
        setActiveTabState(currentTab as ActiveTabType);
      }
    }
  }, [params.tab, searchParams]);
  const [noteSubTab, setNoteSubTab] = useState<'tactical' | 'private'>('tactical');
  const [selectedLinkTeam, setSelectedLinkTeam] = useState('');

  const [regionalCoordinators, setRegionalCoordinators] = useState<any[]>([]);
  const [isRegionalModalOpen, setIsRegionalModalOpen] = useState(false);
  const [regCoordStep, setRegCoordStep] = useState<'form' | 'success'>('form');
  const [createdRegCoordLink, setCreatedRegCoordLink] = useState('');
  const [newRegCoord, setNewRegCoord] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    municipio: '',
    bairro: '',
    subLocations: '',
    targetVoters: 500,
  });

  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [goalCategory, setGoalCategory] = useState<'bairro' | 'municipio' | 'regiao'>('municipio');
  const [newGoal, setNewGoal] = useState({
    locationName: '',
    targetVoters: 1000,
    category: 'municipio' as 'bairro' | 'municipio' | 'regiao'
  });
  const [isGroqLoading, setIsGroqLoading] = useState(false);

  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

  const [editingRegCoord, setEditingRegCoord] = useState<any | null>(null);
  const [isEditRegCoordModalOpen, setIsEditRegCoordModalOpen] = useState(false);

  const [isShareLinkModalOpen, setIsShareLinkModalOpen] = useState(false);
  const [selectedShareTeam, setSelectedShareTeam] = useState('');

  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [teamStatusFilter, setTeamStatusFilter] = useState<'ALL' | 'ALERTA' | 'CRITICO'>('ALL');
  const [teamGroqLoading, setTeamGroqLoading] = useState<string | null>(null);

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateModalTab, setCandidateModalTab] = useState<'identificacao' | 'apresentacao' | 'publico'>('identificacao');
  const [candidateForm, setCandidateForm] = useState<CandidateInfo>(DEFAULT_CANDIDATE_INFO);
  const [candidatesList, setCandidatesList] = useState<CandidateInfo[]>([DEFAULT_CANDIDATE_INFO]);
  const [editingCandidateId, setEditingCandidateId] = useState<string | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('comando');
  const [selectedPlanStatus, setSelectedPlanStatus] = useState<'active' | 'none'>('active');
  const [isSavingCandidate, setIsSavingCandidate] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Estado para exclusão em lote de eleitores
  const [selectedVoterIds, setSelectedVoterIds] = useState<string[]>([]);

  useEffect(() => {
    const unsub = candidateService.subscribeCandidateInfo((info) => {
      setCandidateForm(info);
    }, coordinatorId);
    const unsubList = candidateService.subscribeCandidatesList((list) => {
      setCandidatesList(list);
    }, coordinatorId);
    getSubscriptionInfo(coordinatorId).then(sub => {
      setSelectedPlan(sub.plan);
      setSelectedPlanStatus(sub.status === 'active' ? 'active' : 'none');
    }).catch(err => {
      console.warn("Erro ao buscar subscrição:", err);
    });
    return () => { unsub(); unsubList(); };
  }, [coordinatorId]);

  const handleCandidatePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
     
    setIsUploadingPhoto(true);
    try {
      const publicUrl = await supabaseService.uploadImage(file, 'public_assets');
      if (publicUrl) {
        setCandidateForm(prev => ({ ...prev, photoUrl: publicUrl }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 500;
            const scaleSize = MAX_WIDTH / (img.width || 1);
            canvas.width = MAX_WIDTH;
            canvas.height = (img.height || 1) * scaleSize;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL('image/jpeg', 0.85);
            setCandidateForm(prev => ({ ...prev, photoUrl: base64 }));
          };
          img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn("Upload via Supabase Storage indisponível, aplicando compressão gráfica local:", err);
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / (img.width || 1);
          canvas.width = MAX_WIDTH;
          canvas.height = (img.height || 1) * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.85);
          setCandidateForm(prev => ({ ...prev, photoUrl: base64 }));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveCandidateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.title) {
      alert("Por favor, preencha o Nome e o Cargo do candidato.");
      return;
    }

    setIsSavingCandidate(true);
    try {
      const candidateToSave: CandidateInfo = {
        ...DEFAULT_CANDIDATE_INFO,
        ...candidateForm,
        bio: candidateForm.bio?.trim() || `Candidato oficial a ${candidateForm.title || 'cargo eletivo'} nas Eleições 2026. Compromisso com o desenvolvimento e o bem-estar de toda a população.`,
        badgeTitle: candidateForm.badgeTitle?.trim() || 'FAÇA PARTE DO NOSSO TIME! 🗳️',
        subtitle: candidateForm.subtitle?.trim() || 'Preencha o formulário e apoie nossa caminhada.',
        id: editingCandidateId || candidateForm.id || `cand_${Date.now()}`
      };
      const newList = await candidateService.saveCandidate(candidateToSave, user?.uid, coordinatorId);
      setCandidatesList(newList);
      setCandidateForm({ ...DEFAULT_CANDIDATE_INFO, id: undefined });
      setEditingCandidateId(undefined);
      setIsCandidateModalOpen(false);
      setCandidateModalTab('identificacao');
      alert("✅ Candidato oficial salvo com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar candidato: " + err.message);
    } finally {
      setIsSavingCandidate(false);
    }
  };

  const handleDownloadDoc = () => {
    const textHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Manual Inteligente do Coordenador - Nexus Política</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 40px; }
          .header { text-align: center; border-bottom: 3px solid #0578d3; padding-bottom: 20px; margin-bottom: 30px; }
          .title { color: #000000; font-size: 26px; font-weight: bold; text-transform: uppercase; margin: 0; }
          .subtitle { color: #4b5563; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
          blockquote { border-left: 4px solid #0578d3; padding-left: 20px; font-style: italic; color: #374151; background: #fafafa; padding: 15px; margin: 25px 0; }
          h2 { color: #000000; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 35px; font-size: 18px; text-transform: uppercase; }
          .meta-bold { font-weight: bold; color: #111827; }
          p { font-size: 13px; color: #374151; margin-bottom: 15px; text-align: justify; }
          .highlight-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 4px; margin-top: 15px; }
          .highlight-box p { margin: 0; color: #166534; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .footer { text-align: center; font-size: 11px; color: #9ca3af; margin-top: 60px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">Nexus Política</div>
          <div class="subtitle">Manual Inteligente do Coordenador de Campanha</div>
        </div>

        <blockquote style="font-size: 13px;">
          "A função central é cuidar, ajustar e direcionar a campanha eleitoral de um determinado candidato. O coordenador gerencia os acertos e compromissos diários de campanha. Ele é responsável por articular com parceiros no meio político, seja no âmbito estadual, municipal ou da república. O profissional realiza o gerenciamento das finanças, administrando os valores de campanha repassados pelo partido. O coordenador fatia e distribui o dinheiro para cobrir custos com cabos eleitorais, combustível, escritórios de mídia, santinhos e outros materiais. A figura do coordenador representa o homem de extrema confiança do político. A palavra desse profissional possui muito peso, sendo tratada como se fosse a palavra do próprio candidato. Todas as decisões, ideias, reuniões e resoluções de grupos dentro da campanha precisam passar pelo aval do coordenador."
        </blockquote>

        <h2>1. Direcionar e Cuidar da Campanha</h2>
        <p><span class="meta-bold">Função Clássica:</span> Cuidar, ajustar e guiar estrategicamente o progresso e o foco das frentes eleitorais urbana e rural.</p>
        <p><span class="meta-bold">No Nexus Política:</span> Por meio do Dashboard Central Unificado (aba Visão Geral), o coordenador monitora em tempo real a estatística consolidada de eleitores cadastrados, metas gerais por equipes, andamento das visitas e nível de atividade de todos os cabos eleitorais integrados.</p>
        <div class="highlight-box">
          <p>⚡ Impacto Prático vs. Método Tradicional: Substitui a dependência de telefonemas incertos e relatórios informais por métricas exatas centralizadas. O coordenador ganha poder de intervenção estratégica imediata para recalibrar frentes estagnadas.</p>
        </div>

        <h2>2. Gerenciamento de Compromissos e Acertos</h2>
        <p><span class="meta-bold">Função Clássica:</span> Gerenciar a pauta de rua, reuniões territoriais mundanas e compromissos diários do candidato, otimizando o tempo dele.</p>
        <p><span class="meta-bold">No Nexus Política:</span> Integrado na aba Mapa e Agenda, permitindo vincular compromissos locais às necessidades comunitárias. Permite cadastrar visitas regionais cruzando dados diretamente com o mapa de demandas prioritárias.</p>
        <div class="highlight-box">
          <p>⚡ Impacto Prático vs. Método Tradicional: Evita colisões e redundâncias geográficas. O candidato sobe no palanque dominando minuciosamente quais as reais queixas e demandas geológicas do bairro visitado.</p>
        </div>

        <h2>3. Articulação com Parceiros Políticos</h2>
        <p><span class="meta-bold">Função Clássica:</span> Manter contato contínuo e equilibrar parcerias estratégicas regionais, de lideranças locais a apoios estaduais.</p>
        <p><span class="meta-bold">No Nexus Política:</span> Integrado na central de Articulação (CRM de Parceiros), permitindo registrar todas as lideranças agregadas, gerenciar o status de relacionamento ("Quente", "Morno", "Frio"), histórico de encontros e monitoramento das metas de angariação particulares a cada um.</p>
        <div class="highlight-box">
          <p>⚡ Impacto Prático vs. Método Tradicional: Evita o desengajamento ou o "esfriamento" de redutos eleitorais por falta de comunicação continuada. Cada parceria tem um histórico de atendimento digitalizado indelével.</p>
        </div>

        <h2>4. Administração das Finanças e Custos de Campanha</h2>
        <p><span class="meta-bold">Função Clássica:</span> Distribuir fatias financeiras para cabos eleitorais rurais, alimentação de bases, gastos de combustível integrado e confecção de santinhos físicos.</p>
        <p><span class="meta-bold">No Nexus Política:</span> Operado através da aba Financeiro e Gestão de Materiais, permitindo destinar limites financeiros exatos a frentes de atuação específicas, autorizar injeções de recursos urgentes no Vault Digital e auditar fotos de recibos e folhas de presença de rua imediatamente.</p>
        <div class="highlight-box">
          <p>⚡ Impacto Prático vs. Método Tradicional: Elimina a famosa "caixa-preta" de rua. Toda transação exige comprovação fotográfica, mitigando desvios e cobrando o máximo de rendimento por cada centavo empregado.</p>
        </div>

        <h2>5. Representação de Confiança e Tomada de Decisão</h2>
        <p><span class="meta-bold">Função Clássica:</span> Atuar como a voz oficial com autoridade final para chancelar estratégias, pautas civis e responder resoluções internas.</p>
        <p><span class="meta-bold">No Nexus Política:</span> Concentrado no painel de Anotações Táticas (dividido em Fórum Comum da Equipe e Observações Privadas do Coordenador), além da central de aprovação de Demandas (Ouvidoria de Campo). Nenhuma questão ganha andamento legal ou visibilidade coletiva sem o endosso prévio do Coordenador.</p>
        <div class="highlight-box">
          <p>⚡ Impacto Prático vs. Método Tradicional: Blinda o comitê contra espionagem por canais públicos (WhatsApp). Centraliza e hierarquiza cronogramas estratégicos de forma unívoca.</p>
        </div>

        <div class="footer">
          <p>Documento Oficial Gerado Eletronicamente pelo Ecossistema Nexus Política.</p>
          <p>Confidencialidade de Nível Governamental e Alta Operação Militar de Campo.</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + textHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MANUAL_INTELIGENTE_DO_COORDENADOR_NEXUS_POLITICA.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
     
    doc.setTextColor(26, 26, 26);
     
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("NEXUS POLÍTICA", 14, 25);
     
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("Manual Inteligente do Coordenador de Campanha", 14, 33);
     
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1.5);
    doc.line(14, 38, 196, 38);
     
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 43, 182, 50, "F");
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(14, 43, 14, 93);
     
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(55, 65, 81);
     
    const quoteText = "A função central é cuidar, ajustar e direcionar a campanha eleitoral de um determinado candidato. O coordenador gerencia os acertos e compromissos diários de campanha. Ele é responsável por articular com parceiros no meio político, seja no âmbito estadual, municipal ou da república. O profissional realiza o gerenciamento das finanças, administrando os valores de campanha repassados pelo partido. O coordenador fatia e distribui o dinheiro para cobrir custos com cabos eleitorais, combustível, escritórios de mídia, santinhos e outros materiais. A figura do coordenador representa o homem de extrema confiança do político. A palavra desse profissional possui muito peso, sendo tratada como se fosse a palavra do próprio candidato.";
     
    const quoteLines = doc.splitTextToSize(quoteText, 172);
    doc.text(quoteLines, 19, 50);
     
    let y = 105;
     
    const drawSection = (title: string, text: string, impact: string) => {
      if (y > 230) {
        doc.addPage();
        y = 25;
      }
       
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.text(title, 14, y);
      y += 6;
       
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      const textLines = doc.splitTextToSize(text, 182);
      doc.text(textLines, 14, y);
      y += (textLines.length * 5) + 2;
       
      doc.setFillColor(240, 253, 244);
      const impactLines = doc.splitTextToSize(impact, 172);
      const boxHeight = (impactLines.length * 4.5) + 6;
       
      doc.rect(14, y, 182, boxHeight, "F");
      doc.setDrawColor(187, 247, 208);
      doc.setLineWidth(0.5);
      doc.rect(14, y, 182, boxHeight, "S");
       
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(22, 101, 52);
      doc.text(impactLines, 19, y + 5);
       
      y += boxHeight + 12;
    };
     
    drawSection(
      "1. Direcionar e Cuidar da Campanha",
      "Função Clássica: Cuidar, ajustar e guiar estrategicamente o progresso e o foco das frentes eleitorais urbana e rural. No Nexus Política: Por meio do Dashboard Central Unificado (aba Visão Geral), o coordenador monitora em tempo real a estatística consolidada de eleitores cadastrados, metas gerais por equipes, andamento das visitas e nível de atividade de todos os cabos eleitorais integrados.",
      "⚡ Impacto Prático vs. Método Tradicional: Substitui a dependência de relatórios informais por métricas exatas centralizadas. O coordenador ganha poder de intervenção estratégica imediata para recalibrar frentes estagnadas."
    );
     
    drawSection(
      "2. Gerenciamento de Compromissos e Acertos",
      "Função Clássica: Gerenciar a pauta de rua, reuniões territoriais e compromissos diários do candidato, otimizando o tempo dele. No Nexus Política: Integrado na aba Mapa e Agenda, permitindo vincular compromissos locais às necessidades comunitárias. Permite cadastrar visitas regionais cruzando dados diretamente com o mapa de demandas prioritárias.",
      "⚡ Impacto Prático vs. Método Tradicional: Evita colisões e redundâncias geográficas. O candidato sobe no palanque dominando minuciosamente quais as reais queixas e demandas do bairro visitado."
    );
     
    drawSection(
      "3. Articulação com Parceiros Políticos",
      "Função Clássica: Manter contato contínuo e equilibrar parcerias estratégicas regionalizadas, de lideranças locais a apoios estaduais. No Nexus Política: Integrado na central de Articulação (CRM de Parceiros), permitindo registrar todas as lideranças agregadas, gerenciar o status de relacionamento (Quente, Morno, Frio), histórico de encontros e monitoramento das metas particulares.",
      "⚡ Impacto Prático vs. Método Tradicional: Evita o desengajamento de redutos eleitorais por falta de comunicação. Cada parceria tem um histórico de atendimento digitalizado indelével."
    );
     
    drawSection(
      "4. Administração das Finanças e Custos de Campanha",
      "Função Clássica: Distribuir fatias financeiras para cabos eleitorais rurais, alimentação de bases, gastos de combustível e confecção de santinhos físicos. No Nexus Política: Operado através da aba Financeiro e Gestão de Materiais, permitindo destinar limites financeiros exatos a frentes de atuação específicas, autorizar injeções de recursos urgentes e auditar fotos de recibos imediatamente.",
      "⚡ Impacto Prático vs. Método Tradicional: Elimina a famosa fossa financeira de rua. Toda transação exige comprovação fotográfica, mitigando desvios e cobrando o máximo de rendimento por cada centavo empregado."
    );
     
    drawSection(
      "5. Representação de Confiança e Tomada de Decisão",
      "Função Clássica: Atuar como a voz oficial com autoridade final para chancelar estratégias, pautas civis e responder resoluções internas. No Nexus Política: Concentrado no painel de Anotações Táticas (Fórum Comum da Equipe e Observações Privadas do Coordenador), além da central de aprovação de Demandas (Ouvidoria de Campo). Nenhuma questão ganha andamento sem o endosso prévio do Coordenador.",
      "⚡ Impacto Prático vs. Método Tradicional: Blinda o comitê contra vazamento de dados em canais públicos inseguros. Centraliza e hierarquiza cronogramas estratégicos de forma segura."
    );
     
    if (y > 250) {
      doc.addPage();
      y = 30;
    }
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 8;
     
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Documento Oficial Gerado Eletronicamente pelo Ecossistema Nexus Política.", 14, y);
    doc.text("Confidencialidade de Nível Governamental e Alta Operação Militar de Campo.", 14, y + 4);
     
    doc.save("MANUAL_INTELIGENTE_DO_COORDENADOR_NEXUS_POLITICA.pdf");
  };

  const [reportsHistory, setReportsHistory] = useState<any[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [reportDetailLevel, setReportDetailLevel] = useState<'summary' | 'detailed'>('summary');
  const [reportFilters, setReportFilters] = useState<any>({});
  const [selectedReportColumns, setSelectedReportColumns] = useState<string[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [materialRequests, setMaterialRequests] = useState<any[]>([]);
  const [collapsedRequests, setCollapsedRequests] = useState<Record<string, boolean>>({});
  const [demandsSummary, setDemandsSummary] = useState<any[]>([]);
  const [dailyOrder, setDailyOrder] = useState<any>(null);
  const [dailyOrders, setDailyOrders] = useState<any[]>([]);
  const [isEditingDailyOrder, setIsEditingDailyOrder] = useState(false);
  const [newDailyOrder, setNewDailyOrder] = useState('');
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [chaosText, setChaosText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const [isEditingMaterial, setIsEditingMaterial] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialForm, setMaterialForm] = useState({ name: '', qty: '' });
   
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signingRequest, setSigningRequest] = useState<any>(null);
  const [signerName, setSignerName] = useState('');
   
  const [selectedUrgency, setSelectedUrgency] = useState<any>(null);
  const [observation, setObservation] = useState('');
  const [isUrgencyModalOpen, setIsUrgencyModalOpen] = useState(false);

  const [teams, setTeams] = useState<any[]>([]);
  const [urgencies, setUrgencies] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>(null);
  const [agendas, setAgendas] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
   
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    teams: any[],
    notes: any[],
    agendas: any[]
  }>({ teams: [], notes: [], agendas: [] });

  const [isTeamManagementOpen, setIsTeamManagementOpen] = useState(false);
  const [selectedManagingTeam, setSelectedManagingTeam] = useState<any>(null);
  const [managingTeamVoters, setManagingTeamVoters] = useState<any[]>([]);
  const [selectedVoter, setSelectedVoter] = useState<any>(null);
  const [allVoters, setAllVoters] = useState<any[]>([]);
  const [paginatedVotersList, setPaginatedVotersList] = useState<any[]>([]);
  const [loadingPaginatedVoters, setLoadingPaginatedVoters] = useState(false);
  const [hasMoreVoters, setHasMoreVoters] = useState(true);
  const [totalVotersCount, setTotalVotersCount] = useState<number>(0);
  const [votedVotersCount, setVotedVotersCount] = useState<number>(0);
  const [articulators, setArticulators] = useState<any[]>([]);
  const [teamVotersCountMap, setTeamVotersCountMap] = useState<Record<string, number>>({});
  const [voterPage, setVoterPage] = useState(1);
  const [voterPageSize, setVoterPageSize] = useState(50);
  const [voterFilterTags, setVoterFilterTags] = useState<string[]>([]);
  const [voterSearch, setVoterSearch] = useState('');
  const [voterFilterReferredBy, setVoterFilterReferredBy] = useState('');
  const [articulatorFilter, setArticulatorFilter] = useState('');

  useEffect(() => {
    if (!coordinatorId) return;
    const unsubRegs = supabaseService.subscribeToCollectionFiltered<any>('regional_coordinators', coordinatorId, (data) => setRegionalCoordinators(data));

    const unsubGoals = supabaseService.subscribeToCollectionFiltered<any>('goals', coordinatorId, (data) => setGoalsList(data));

    return () => {
      unsubRegs();
      unsubGoals();
    };
  }, [coordinatorId]);

  const handleCreateRegionalCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegCoord.name || !newRegCoord.email || !newRegCoord.region) {
      alert("Preencha o nome, e-mail e região do Coordenador Regional.");
      return;
    }
     
    const regValidation = await validateRegionalRegistration(coordinatorId || user?.uid);
    if (!regValidation.allowed) {
      triggerUpgradeRedirect(regValidation.reason!, isGeral);
      return;
    }

    try {
      setIsProcessing(true);
      const coordId = `reg_${newRegCoord.email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const tempPassword = 'nexus' + Math.floor(1000 + Math.random() * 9000);
       
      await supabaseService.setDocument('regional_coordinators', coordId, {
        ...newRegCoord,
        email: newRegCoord.email.toLowerCase(),
        subLocations: newRegCoord.subLocations || '',
        targetVoters: Number(newRegCoord.targetVoters) || 500,
        tempPassword,
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: Date.now()
      });

      await supabaseService.setDocument('pre_registrations', newRegCoord.email.toLowerCase(), {
        email: newRegCoord.email.toLowerCase(),
        name: newRegCoord.name,
        phone: newRegCoord.phone,
        region: newRegCoord.region,
        subLocations: newRegCoord.subLocations || '',
        role: 'coordenador_regional',
        tempPassword,
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: Date.now()
      });

      const accessLink = `${window.location.origin}/login?email=${encodeURIComponent(newRegCoord.email)}&access_token=${btoa(tempPassword)}&role=coordenador_regional&coordinatorId=${coordinatorId || user?.uid || ''}&region=${encodeURIComponent(newRegCoord.region || '')}`;
      
      const newCoordObj = {
        id: coordId,
        ...newRegCoord,
        email: newRegCoord.email.toLowerCase(),
        subLocations: newRegCoord.subLocations || '',
        targetVoters: Number(newRegCoord.targetVoters) || 500,
        tempPassword,
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: Date.now()
      };
      setRegionalCoordinators(prev => [newCoordObj, ...prev.filter(c => c.id !== coordId)]);

      setCreatedRegCoordLink(accessLink);
      setRegCoordStep('success');
    } catch (err: any) {
      alert("Erro ao cadastrar Coordenador Regional: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRegionalCoordinator = async (id: string, email: string) => {
    if (confirm("Deseja realmente remover este Coordenador Regional?")) {
      try {
        setRegionalCoordinators(prev => prev.filter(c => c.id !== id));
        await supabaseService.deleteDocument('regional_coordinators', id);
        if (email) {
          await supabaseService.deleteDocument('pre_registrations', email.toLowerCase());
        }
        alert("Coordenador Regional removido!");
      } catch (err: any) {
        alert("Erro ao remover: " + err.message);
      }
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.locationName) {
      alert("Informe o nome do local (Bairro, Município ou Região).");
      return;
    }
    try {
      const goalId = `goal_${newGoal.category}_${newGoal.locationName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const goalPayload = {
        id: goalId,
        ...newGoal,
        targetVoters: Number(newGoal.targetVoters) || 500,
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: Date.now()
      };
       
      setGoalsList(prev => [goalPayload, ...prev.filter(g => g.id !== goalId)]);
       
      await supabaseService.setDocument('goals', goalId, goalPayload);
      setNewGoal({ locationName: '', targetVoters: 1000, category: goalCategory });
      alert("Meta registrada com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar meta: " + err.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Deseja excluir esta meta?")) {
      try {
        setGoalsList(prev => prev.filter(g => g.id !== id));
        await supabaseService.deleteDocument('goals', id);
      } catch (err: any) {
        alert("Erro ao excluir meta: " + err.message);
      }
    }
  };

  const handleOpenEditGoal = (goal: any) => {
    setEditingGoal({ ...goal });
    setIsEditGoalModalOpen(true);
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editingGoal.locationName) return;
    try {
      setIsProcessing(true);
      const updatedPayload = {
        ...editingGoal,
        targetVoters: Number(editingGoal.targetVoters) || 0,
        updatedAt: Date.now()
      };
      setGoalsList(prev => prev.map(g => g.id === editingGoal.id ? { ...g, ...updatedPayload } : g));

      await supabaseService.setDocument('goals', editingGoal.id, updatedPayload);
      setIsEditGoalModalOpen(false);
      setEditingGoal(null);
      alert("Meta geral atualizada com sucesso!");
    } catch (err: any) {
      alert("Erro ao atualizar meta: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenEditRegCoord = (coord: any) => {
    setEditingRegCoord({ ...coord });
    setIsEditRegCoordModalOpen(true);
  };

  const handleUpdateRegionalCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegCoord || !editingRegCoord.name || !editingRegCoord.email) return;
    try {
      setIsProcessing(true);
      const updatedCoord = {
        ...editingRegCoord,
        targetVoters: Number(editingRegCoord.targetVoters) || 0,
        updatedAt: Date.now()
      };
      setRegionalCoordinators(prev => prev.map(c => c.id === editingRegCoord.id ? { ...c, ...updatedCoord } : c));

      await supabaseService.setDocument('regional_coordinators', editingRegCoord.id, updatedCoord);
      if (editingRegCoord.email) {
        await supabaseService.setDocument('pre_registrations', editingRegCoord.email.toLowerCase(), {
          email: editingRegCoord.email.toLowerCase(),
          name: editingRegCoord.name,
          phone: editingRegCoord.phone || '',
          region: editingRegCoord.region || '',
          subLocations: editingRegCoord.subLocations || '',
          role: 'coordenador_regional',
          coordinatorId: editingRegCoord.coordinatorId || coordinatorId || user?.uid || '',
          tempPassword: editingRegCoord.tempPassword || '',
          updatedAt: Date.now()
        });
      }
      setIsEditRegCoordModalOpen(false);
      setEditingRegCoord(null);
      alert("Coordenador Regional e meta atualizados com sucesso!");
    } catch (err: any) {
      alert("Erro ao atualizar Coordenador Regional: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getMatchedRegCoordsForGoal = (locationName: string) => {
    if (!locationName) return [];
    return regionalCoordinators.filter(coord => {
      return isLocationMatchingGoal(locationName, coord.region, coord.subLocations);
    });
  };

  const getMatchedTeamsForGoal = (locationName: string) => {
    if (!locationName) return [];
    return teams.filter(team => {
      return isLocationMatchingGoal(
        locationName, 
        team.region || team.name || '', 
        team.neighborhoods || team.subLocations || team.description || ''
      );
    });
  };

  // Função de Exclusão em Lote de Eleitores
  const handleBulkDeleteVoters = async () => {
    if (selectedVoterIds.length === 0) {
      alert("Selecione pelo menos um eleitor para excluir.");
      return;
    }

    if (window.confirm(`Deseja realmente excluir os ${selectedVoterIds.length} eleitores selecionados? Esta ação não pode ser desfeita.`)) {
      try {
        setIsProcessing(true);
        for (const id of selectedVoterIds) {
          await supabaseService.deleteDocument('voters', id);
        }
        setSelectedVoterIds([]);
        await fetchServerCounts();
        alert("✅ Eleitores selecionados excluídos com sucesso!");
      } catch (err: any) {
        alert("Erro ao excluir eleitores em lote: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Carregar cache local de eleitores
  useEffect(() => {
    if (coordinatorId) {
      const cached = safeLocalStorage.getItem(`urna360_voters_cache_${coordinatorId}`);
      if (cached) {
        try {
          setAllVoters(JSON.parse(cached));
        } catch (e) {
          console.warn("Erro ao carregar cache de eleitores:", e);
        }
      }
    }
  }, [coordinatorId]);

  useEffect(() => {
    setVoterPage(1);
  }, [voterSearch, voterFilterReferredBy, voterFilterTags, articulatorFilter]);

  const [currentEditTag, setCurrentEditTag] = useState('');
  const [isVoterEditModalOpen, setIsVoterEditModalOpen] = useState(false);
  const [voterEditForm, setVoterEditForm] = useState<{
    name: string;
    phone: string;
    address: string;
    observations: string;
    referredBy: string;
    tags: string[];
    loyaltyScore: number;
    familyCommunity: string;
    associatedCandidates: string;
    isArticulator: boolean;
    articulatorId: string;
    voted: boolean;
    isIndigenous: boolean;
    communityName: string;
    tuxauaName: string;
    hasDocPhoto: boolean;
    sentiment: 'support' | 'neutral' | 'opposed';
    cpf: string;
    rg: string;
    titulo: string;
    zona: string;
    secao: string;
    localVotacao: string;
  }>({ 
    name: '', 
    phone: '', 
    address: '', 
    observations: '', 
    referredBy: '', 
    tags: [],
    loyaltyScore: 3,
    familyCommunity: '',
    associatedCandidates: '',
    isArticulator: false,
    articulatorId: '',
    voted: false,
    isIndigenous: false,
    communityName: '',
    tuxauaName: '',
    hasDocPhoto: false,
    sentiment: 'neutral',
    cpf: '',
    rg: '',
    titulo: '',
    zona: '',
    secao: '',
    localVotacao: ''
  });

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden transition-colors duration-300">
      <aside className="hidden lg:flex w-72 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-color)] py-8 px-6 overflow-y-auto shrink-0 relative z-40 shadow-[2px_0_10px_rgba(0,0,0,0.02)] dark:shadow-none">
        <div className="mb-6 px-1 flex flex-col items-center gap-4">
          <img src={logoImg} alt="Logo Nexus Política" className="max-h-12 w-full max-w-[160px] object-contain transition-all" />
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar pr-1">
          {[
            { id: 'overview', label: isRegional ? 'Painel Regional' : 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'agenda', label: 'Agenda', icon: <Calendar className="w-4 h-4" /> },
            { id: 'materials', label: 'Materiais', icon: <Package className="w-4 h-4" /> },
            { id: 'metas', label: 'Metas', icon: <Target className="w-4 h-4" /> },
            ...(isGeral ? [{ id: 'regional_coords', label: 'Regionais', icon: <ShieldCheck className="w-4 h-4" /> }] : []),
            { id: 'teams', label: 'Equipes', icon: <Users className="w-4 h-4" /> },
            { id: 'voters', label: 'Eleitores', icon: <UserPlus className="w-4 h-4" /> },
            { id: 'demands', label: 'Demandas', icon: <Activity className="w-4 h-4" /> },
            { id: 'mapa', label: 'Mapa', icon: <MapIcon className="w-4 h-4" /> },
            { id: 'analise_eleitoral', label: 'Análise', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'reports', label: 'Relatórios', icon: <FileDown className="w-4 h-4" /> },
            { id: 'notes', label: 'Anotações', icon: <MessageSquare className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                activeTab === item.id 
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold shadow-sm' 
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50'
              }`}
            >
              <div className={`transition-colors ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300'}`}>
                {item.icon}
              </div>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)] overflow-hidden relative transition-colors duration-300">
        <header className="h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-6 z-30 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-sm hidden md:block">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-zinc-400" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar zonas, líderes ou demandas..."
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl py-2.5 pl-11 pr-4 text-[11px] font-black uppercase text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar pb-28">
          <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {activeTab === 'voters' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-[var(--border-color)] pb-4 md:pb-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-950 rounded-xl flex items-center justify-center shadow-lg">
                      <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)]">Base de Eleitores</h2>
                      <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">Gestão centralizada de segmentação e influência</p>
                    </div>
                  </div>
                </div>

                {/* BOTÃO DE EXCLUSÃO EM LOTE */}
                {isAdmin && selectedVoterIds.length > 0 && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700 dark:text-red-400">
                      {selectedVoterIds.length} eleitor(es) selecionado(s)
                    </span>
                    <button
                      onClick={handleBulkDeleteVoters}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Excluir Selecionados ({selectedVoterIds.length})
                    </button>
                  </div>
                )}

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 md:p-6 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500 ml-1">Pesquisar por Nome ou Telefone</label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                        <input 
                          type="text" 
                          value={voterSearch}
                          onChange={e => setVoterSearch(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-11 pr-4 text-xs font-medium text-zinc-900 dark:text-white outline-none focus:border-blue-600"
                          placeholder="Ex: João Silva ou (95) 99..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-sm overflow-x-auto min-h-[400px] custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-0">
                    <thead>
                      <tr className="bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                        <th className="p-3.5 w-10">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedVoterIds(paginatedVoters.map((v: any) => v.id));
                              } else {
                                setSelectedVoterIds([]);
                              }
                            }}
                            checked={paginatedVoters.length > 0 && selectedVoterIds.length === paginatedVoters.length}
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                          />
                        </th>
                        <th className="p-3.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Eleitor / Fidelidade</th>
                        <th className="p-3.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Articulação</th>
                        <th className="p-3.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Segmentação</th>
                        <th className="p-3.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Equipe / Líder</th>
                        <th className="p-3.5 text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {loadingPaginatedVoters ? (
                        <tr>
                          <td colSpan={6} className="p-20 text-center">
                            <RefreshCcw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                            <p className="font-black text-[var(--text-secondary)] uppercase tracking-widest text-[9px]">Buscando registros...</p>
                          </td>
                        </tr>
                      ) : paginatedVoters.length > 0 ? paginatedVoters.map((voter) => (
                        <tr key={voter.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                          <td className="p-3.5">
                            <input
                              type="checkbox"
                              checked={selectedVoterIds.includes(voter.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedVoterIds(prev => [...prev, voter.id]);
                                } else {
                                  setSelectedVoterIds(prev => prev.filter(id => id !== voter.id));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                            />
                          </td>
                          <td className="p-3.5">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-zinc-950 uppercase leading-none">{voter.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-black text-zinc-900 uppercase">{voter.referredBy || '---'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs">{voter.voted ? 'SIM' : 'NÃO'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs">{voter.team || '---'}</span>
                          </td>
                          <td className="p-4 text-right">
                             <div className="flex justify-end gap-2">
                               <button onClick={() => handleDeleteVoter(voter.id)} className="p-2 text-zinc-400 hover:text-red-600 rounded-xl">
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="p-20 text-center">
                            <Search className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                            <p className="font-black text-zinc-300 uppercase tracking-widest text-[10px]">Nenhum eleitor encontrado.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <h2 className="text-base md:text-lg font-bold text-[var(--text-primary)]">Painel de Operações</h2>
              </motion.div>
            )}

            {activeTab === 'agenda' && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Agenda de Eventos</h2>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
