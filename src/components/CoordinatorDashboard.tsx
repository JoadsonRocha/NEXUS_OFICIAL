import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user, login, logout, isAdmin, isGeral, isRegional, isLeader, userRegion, coordinatorId } = useAuth();

  const ACTIVE_TAB_KEY = 'nexus_coordinator_active_tab';
  type ActiveTabType = 'overview' | 'candidato' | 'regional_coords' | 'metas' | 'teams' | 'voters' | 'agenda' | 'mapa' | 'notes' | 'materials' | 'demands' | 'reports' | 'analise_eleitoral';
  const [activeTab, setActiveTabState] = useState<ActiveTabType>('overview');

  const setActiveTab = (tab: ActiveTabType) => {
    try { localStorage.setItem(ACTIVE_TAB_KEY, tab); } catch (_) {}
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
        <p><span class="meta-bold">No Nexus Política:</span> Concentrado no painel de Anotações Táticas (dividido em Fórum Comum da Equipe e Observações Privadas do Coordenador), além da central de aprovação de Demandas (Ouvidoria de Campo). Nenhuma questão ganha andamento legal ou visibilidade coletiva sem o endosso prévio do perfil do Coordenador.</p>
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

      const accessLink = `${window.location.origin}/login?email=${encodeURIComponent(newRegCoord.email)}&access_token=${btoa(tempPassword)}&role=coordenador_regional&coordinatorId=${coordinatorId || user?.uid || ''}`;
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
    const locationTrimmed = newGoal.locationName.trim();
    if (!locationTrimmed) {
      alert("Informe o nome do local (Bairro, Município ou Região).");
      return;
    }
    
    const activeCoordId = coordinatorId || user?.uid;
    if (!activeCoordId) {
      alert("Erro: Identificação do coordenador não encontrada. Faça login novamente.");
      return;
    }

    try {
      const cleanIdName = locationTrimmed
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
        
      const goalId = `goal_${newGoal.category}_${cleanIdName}_${Date.now()}`;
      
      await supabaseService.setDocument('goals', goalId, {
        ...newGoal,
        locationName: locationTrimmed,
        targetVoters: Number(newGoal.targetVoters) || 500,
        coordinatorId: activeCoordId,
        createdAt: Date.now()
      });
      
      setNewGoal({ locationName: '', targetVoters: 1000, category: goalCategory });
      alert("✅ Meta registrada com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar meta: " + err.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm("Deseja excluir esta meta?")) {
      try {
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
      await supabaseService.setDocument('goals', editingGoal.id, {
        ...editingGoal,
        targetVoters: Number(editingGoal.targetVoters) || 0,
        updatedAt: Date.now()
      });
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
      await supabaseService.setDocument('regional_coordinators', editingRegCoord.id, {
        ...editingRegCoord,
        targetVoters: Number(editingRegCoord.targetVoters) || 0,
        updatedAt: Date.now()
      });
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

  const handlePurgeAllTestData = async () => {
    const activeCoordId = coordinatorId || user?.uid;
    if (!isAdmin || !activeCoordId) return;

    if (window.confirm("⚠️ ATENÇÃO: ZERAR BANCO DE DADOS DA SUA CAMPANHA\n\nDeseja LIMPAR TODOS OS DADOS DA SUA CAMPANHA?")) {
      try {
        setIsProcessing(true);
        const collectionsToWipe = [
          'voters', 'teams', 'regional_coordinators', 'transactions', 'attendance', 
          'notes', 'urgencies', 'agenda', 'materials', 'material_requests', 'demands', 'goals', 'reports', 'partners'
        ];

        for (const coll of collectionsToWipe) {
          try {
            const allDocs = await supabaseService.getCollection<any>(coll);
            const myDocs = allDocs.filter(d => 
              !d.coordinatorId || 
              d.coordinatorId === activeCoordId || 
              d.createdBy === activeCoordId ||
              d.userId === activeCoordId
            );
            for (const d of myDocs) {
              await supabaseService.deleteDocument(coll, d.id);
            }
          } catch (e) {
            console.warn(`Aviso ao limpar coleção ${coll}:`, e);
          }
        }
        alert("✅ Banco de dados da sua campanha foi zerado com sucesso!");
        window.location.reload();
      } catch (err: any) {
        alert("Erro ao zerar banco: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

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

  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedHistoryTeam, setSelectedHistoryTeam] = useState<any>(null);
  const [teamHistory, setTeamHistory] = useState<any[]>([]);
   
  const [briefingResult, setBriefingResult] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingLocation, setBriefingLocation] = useState('');

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamCreationStep, setTeamCreationStep] = useState<'form' | 'success'>('form');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [createdTeamLink, setCreatedTeamLink] = useState('');

  useEffect(() => {
    if (urgencies.length > 0) {
      const summary: any = {};
      urgencies.forEach(u => {
        const zone = u.team || 'Geral';
        summary[zone] = (summary[zone] || 0) + 1;
      });
      setDemandsSummary(Object.entries(summary).map(([name, value]) => ({ name, value })));
    }
  }, [urgencies]);

  const handleUpdateDailyOrder = async () => {
    if (!newDailyOrder.trim()) {
      alert('Digite o texto da diretiva antes de transmitir.');
      return;
    }
    try {
      const activeCoordId = coordinatorId || user?.uid || '';
      const now = Date.now();
      const newId = `order_${activeCoordId}_${now}`;

      const activeOrders = dailyOrders.filter(o => o.status === 'active');
      for (const prev of activeOrders) {
        await supabaseService.setDocument('daily_orders', prev.id, {
          ...prev,
          status: 'closed',
          closedAt: now
        });
      }

      await supabaseService.setDocument('daily_orders', newId, {
        id: newId,
        text: newDailyOrder.trim(),
        status: 'active',
        createdAt: now,
        updatedAt: now,
        createdBy: profileData?.name || user?.email || 'Comando',
        coordinatorId: activeCoordId
      });

      setIsEditingDailyOrder(false);
      setNewDailyOrder('');
      showToast('📢 Diretiva transmitida para todas as unidades!', 'success');
    } catch (err) {
      alert('Erro ao enviar ordem: ' + err);
    }
  };

  const handleCloseActiveOrder = async () => {
    if (!window.confirm('Encerrar a diretiva ativa? Ela será movida para o histórico.')) return;
    try {
      const activeOrders = dailyOrders.filter(o => o.status === 'active');
      for (const prev of activeOrders) {
        await supabaseService.setDocument('daily_orders', prev.id, {
          ...prev,
          status: 'closed',
          closedAt: Date.now()
        });
      }
      showToast('Diretiva encerrada e arquivada.', 'success');
    } catch (err) {
      alert('Erro ao encerrar diretiva: ' + err);
    }
  };

  const handleAddMaterial = async (e: any) => {
    e.preventDefault();
    try {
      const name = (materialForm.name || (e?.target?.name?.value) || '').trim();
      const rawQty = materialForm.qty || (e?.target?.qty?.value) || '';
      const qtyStr = rawQty.toString().replace(/\D/g, ''); 
      const qty = parseInt(qtyStr, 10);
       
      if (!name || isNaN(qty) || qty <= 0) {
        showToast("Preencha a descrição do material e a quantidade corretamente.", "error");
        return;
      }
       
      const activeCoordId = coordinatorId || user?.uid || '';
      const existing = materials.find(m => m.name && m.name.toLowerCase() === name.toLowerCase());
       
      if (existing) {
        const newTotal = (existing.total || 0) + qty;
        const newCurrent = (existing.current || 0) + qty;
        const updatedDoc = {
          ...existing,
          total: newTotal,
          current: newCurrent,
          qty: newTotal.toLocaleString('pt-BR')
        };
        await supabaseService.updateDocument('materials', existing.id, updatedDoc);
        setMaterials(prev => prev.map(m => m.id === existing.id ? updatedDoc : m));
        showToast(`Quantidade adicionada ao material existente: ${name}`, "success");
      } else {
        const newMatData = {
          name,
          total: qty,
          current: qty,
          qty: qty.toLocaleString('pt-BR'),
          coordinatorId: activeCoordId,
          createdAt: Date.now()
        };
        const docId = await supabaseService.addDocument('materials', newMatData);
        setMaterials(prev => [...prev, { id: docId, ...newMatData }]);
        showToast("Material registrado com sucesso!", "success");
      }
      setMaterialForm({ name: '', qty: '' });
      setIsMaterialModalOpen(false);
    } catch (err: any) {
      showToast("Erro ao salvar material: " + (err?.message || err), "error");
    }
  };

  const handleUpdateMaterial = async (id: string, amount: number) => {
    try {
      const mat = materials.find(m => m.id === id);
      if (!mat) return;
      const updatedCurrent = Math.max(0, (mat.current || 0) + amount);
      const updatedMat = { ...mat, current: updatedCurrent };
      await supabaseService.updateDocument('materials', id, { current: updatedCurrent });
      setMaterials(prev => prev.map(m => m.id === id ? updatedMat : m));
      showToast("Estoque atualizado!", "success");
    } catch (err: any) {
      showToast("Erro ao atualizar: " + err.message, "error");
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (confirm("Deseja realmente excluir este tipo de material e todo seu estoque?")) {
      try {
        await supabaseService.deleteDocument('materials', id);
        setMaterials(prev => prev.filter(m => m.id !== id));
        showToast("Material excluído!", "success");
      } catch (err: any) {
        showToast("Erro ao excluir: " + err.message, "error");
      }
    }
  };

  const handleStartEditMaterial = (m: any) => {
    setIsEditingMaterial(true);
    setEditingMaterialId(m.id);
    setMaterialForm({ name: m.name, qty: m.total.toString() });
    setIsMaterialModalOpen(true);
  };

  const handleSaveEditMaterial = async (e: any) => {
    e.preventDefault();
    if (!editingMaterialId) return;

    try {
      const name = materialForm.name.trim();
      const qtyStr = materialForm.qty.toString().replace(/\D/g, '');
      const qty = parseInt(qtyStr, 10);
       
      if (!name || isNaN(qty) || qty <= 0) {
        showToast("Preencha o nome e a quantidade corretamente.", "error");
        return;
      }

      const old = materials.find(m => m.id === editingMaterialId);
      if (!old) {
        showToast("Erro: Material original não encontrado.", "error");
        return;
      }

      const diffUsed = (old.total || 0) - (old.current || 0);
      const updatedMat = {
        ...old,
        name: materialForm.name,
        total: qty,
        current: Math.max(0, qty - diffUsed),
        qty: qty.toLocaleString('pt-BR')
      };

      await supabaseService.updateDocument('materials', editingMaterialId, updatedMat);
      setMaterials(prev => prev.map(m => m.id === editingMaterialId ? updatedMat : m));

      setIsEditingMaterial(false);
      setEditingMaterialId(null);
      setMaterialForm({ name: '', qty: '' });
      setIsMaterialModalOpen(false);
      showToast("Material atualizado com sucesso!", "success");
    } catch (err: any) {
      showToast("Erro ao salvar alterações: " + err.message, "error");
    }
  };

  const handleApproveMaterialRequest = (req: any) => {
    const mat = materials.find(m => m.id === req.materialId);
    if (!mat) {
      alert("Material não encontrado no estoque!");
      return;
    }
     
    if (mat.current < req.qty) {
      alert("Quantidade insuficiente no estoque para aprovar esta solicitação!");
      return;
    }

    setSigningRequest(req);
    setSignerName(profileData?.name || '');
    setIsSignatureModalOpen(true);
  };

  const handleConfirmSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingRequest || !signerName.trim()) {
      alert("Por favor, preencha a sua assinatura.");
      return;
    }

    try {
      const req = signingRequest;
      const mat = materials.find(m => m.id === req.materialId);
      if (!mat) {
        alert("Material não encontrado no estoque!");
        return;
      }
       
      if (mat.current < req.qty) {
        alert("Quantidade insuficiente no estoque para aprovar esta solicitação!");
        return;
      }

      await supabaseService.updateDocument('materials', req.materialId, {
        current: mat.current - req.qty
      });

      const signatureHash = 'URNA360-SIG-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Date.now().toString().slice(-4);

      await supabaseService.updateDocument('material_requests', req.id, {
        status: 'aprovado',
        approvedAt: Date.now(),
        signedBy: signerName.trim(),
        signedAt: Date.now(),
        signatureHash: signatureHash
      });

      setIsSignatureModalOpen(false);
      setSigningRequest(null);
      setSignerName('');
      alert("Lote assinado digitalmente e liberado com sucesso!");
    } catch (err: any) {
      alert("Erro ao aprovar e assinar: " + err.message);
    }
  };

  const handleDenyMaterialRequest = async (id: string) => {
    if (confirm("Deseja realmente negar esta solicitação?")) {
      await supabaseService.updateDocument('material_requests', id, {
        status: 'negado',
        deniedAt: Date.now()
      });
    }
  };

  const handleConfirmReturnMaterialRequest = async (req: any) => {
    if (confirm(`Confirmar recebimento de volta do material: ${req.materialName} (${req.qty} un) de ${req.leaderName}?`)) {
      try {
        const mat = materials.find(m => m.id === req.materialId);
        if (mat) {
          await supabaseService.updateDocument('materials', req.materialId, {
            current: (mat.current || 0) + req.qty
          });
        }
        await supabaseService.updateDocument('material_requests', req.id, {
          status: 'devolvido',
          returnApprovedByCoord: true,
          returnApprovedAt: Date.now()
        });
        alert("Devolução confirmada e estoque atualizado com sucesso!");
      } catch (err: any) {
        alert("Erro ao confirmar devolução: " + err.message);
      }
    }
  };

  const generateReport = async (type: string, filters: any = {}, format: 'pdf' | 'excel' = 'pdf') => {
    const userName = profileData?.name || user?.email || 'Coordenador';
    let title = '';
    let data: any[] = [];
    let subtitle = '';

    const allPossibleColumns = AVAILABLE_COLUMNS_BY_TYPE[type] || [];
     
    let reportColumns = filters.selectedColumns && filters.selectedColumns.length > 0
      ? allPossibleColumns.filter((c: any) => filters.selectedColumns.includes(c.dataKey))
      : allPossibleColumns;

    try {
      if (filters.detailLevel === 'detailed') {
        switch (type) {
          case 'teams':
            title = 'Relatório Detalhado: Eleitores por Equipe';
            reportColumns = AVAILABLE_COLUMNS_BY_TYPE['voters'];
            const activeTeams = teams.filter(t => {
              if (filters.status && t.status !== filters.status) return false;
              if (filters.location && !t.location.includes(filters.location)) return false;
              if (filters.team && t.name !== filters.team) return false;
              return true;
            }).map(t => t.name);
             
            data = allVoters.filter(v => activeTeams.includes(v.team) || activeTeams.includes(v.teamName))
              .map(v => ({
                ...v,
                teamDisplay: v.team || v.teamName || 'N/A',
                votedStatus: v.voted ? 'SIM' : 'NÃO',
                sentiment: v.sentiment === 'support' ? 'APOIO' : v.sentiment === 'neutral' ? 'NEUTRO' : 'OPOSIÇÃO',
                referredByDisplay: v.articulatorId ? (allVoters.find(av => av.id === v.articulatorId)?.name || 'Articulador') : (v.referredBy || '---'),
                tagsStr: v.tags?.join(', ') || ''
              }));
            subtitle = `Listagem detalhada de ${data.length} eleitores vinculados às equipes selecionadas.`;
            break;

          case 'materials':
            title = 'Relatório Detalhado: Movimentação de Materiais';
            reportColumns = [
              { header: 'Solicitante', dataKey: 'requester' },
              { header: 'Material', dataKey: 'materialName' },
              { header: 'Qtd', dataKey: 'quantity' },
              { header: 'Data', dataKey: 'dateStr' },
              { header: 'Status', dataKey: 'status' }
            ];
            data = materialRequests.map(req => ({
              ...req,
              dateStr: new Date(req.createdAt).toLocaleDateString(),
              status: req.status === 'approved' ? 'ENTREGUE' : req.status === 'rejected' ? 'NEGADO' : 'PENDENTE'
            }));
            subtitle = `Histórico de ${data.length} solicitações de materiais.`;
            break;
        }
      }

      if (data.length === 0) {
        switch (type) {
          case 'teams':
            title = 'Relatório de Equipes e Lideranças';
            data = teams.filter(t => {
              if (filters.status && t.status !== filters.status) return false;
              if (filters.location && !t.location.includes(filters.location)) return false;
              if (filters.team && t.name !== filters.team) return false;
              return true;
            }).map(t => ({
              ...t,
              realContacts: allVoters.filter(v => isVoterInTeam(v, t)).length,
              demandCount: urgencies.filter(u => u.team === t.name).length,
              spentStr: `R$ ${t.spent?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`,
              status: t.status || 'OK'
            }));
            subtitle = `Análise de ${data.length} frentes de atuação regional.`;
            break;

          case 'voters':
            title = 'Relatório Geral de Eleitores';
            data = allVoters.filter(v => {
              if (filters.sentiment && v.sentiment !== filters.sentiment) return false;
              if (filters.voted !== undefined && v.voted !== filters.voted) return false;
              if (filters.team && v.team !== filters.team && v.teamName !== filters.team) return false;
              return true;
            }).map(v => ({
              ...v,
              teamDisplay: v.team || v.teamName || 'N/A',
              votedStatus: v.voted ? 'SIM' : 'NÃO',
              sentiment: v.sentiment === 'support' ? 'APOIO' : v.sentiment === 'neutral' ? 'NEUTRO' : 'OPOSIÇÃO',
              referredByDisplay: v.articulatorId ? (allVoters.find(av => av.id === v.articulatorId)?.name || 'Articulador') : (v.referredBy || '---'),
              tagsStr: v.tags?.join(', ') || ''
            }));
            subtitle = `${data.length} eleitores filtrados na base estratégica.`;
            break;

          case 'productivity':
            title = 'Relatório de Produtividade e Ranking de Lideranças';
            {
              const leaderMap: Record<string, { leader: string; team: string; totalVoters: number; supportVoters: number; loyaltySum: number }> = {};
               
              teams.forEach(t => {
                const key = t.leader || t.name;
                if (key && !leaderMap[key]) {
                  leaderMap[key] = { leader: t.leader || key, team: t.name, totalVoters: 0, supportVoters: 0, loyaltySum: 0 };
                }
              });

              allVoters.forEach(v => {
                const key = v.leaderName || v.team || v.teamName || 'Outros';
                if (!leaderMap[key]) {
                  leaderMap[key] = { leader: key, team: v.team || v.teamName || 'Geral', totalVoters: 0, supportVoters: 0, loyaltySum: 0 };
                }
                leaderMap[key].totalVoters += 1;
                if (v.sentiment === 'support' || v.voted) {
                  leaderMap[key].supportVoters += 1;
                }
                leaderMap[key].loyaltySum += Number(v.loyaltyScore || 5);
              });

              data = Object.values(leaderMap)
                .sort((a, b) => b.totalVoters - a.totalVoters)
                .map((item, index) => {
                  const conv = item.totalVoters > 0 ? Math.round((item.supportVoters / item.totalVoters) * 100) : 0;
                  const avgLoy = item.totalVoters > 0 ? (item.loyaltySum / item.totalVoters).toFixed(1) : '5.0';
                  let leaderStatus = '⚠️ BAIXO RENDIMENTO';
                  if (item.totalVoters >= 20 && conv >= 60) leaderStatus = '🔥 ALTA PRODUTIVIDADE';
                  else if (item.totalVoters >= 10) leaderStatus = '✅ METAS EM DIA';
                  else if (item.totalVoters > 0) leaderStatus = '🟡 EM PROGRESSO';

                  return {
                    rank: `#${index + 1}`,
                    leader: item.leader,
                    team: item.team,
                    totalVoters: item.totalVoters,
                    supportVoters: item.supportVoters,
                    conversionRate: `${conv}%`,
                    avgLoyalty: `${avgLoy}/10`,
                    leaderStatus
                  };
                });

              subtitle = `Auditoria de produtividade e conversão de votos de ${data.length} lideranças.`;
            }
            break;

          case 'zone_performance':
            title = 'Relatório de Desempenho por Zona e Seção Eleitoral';
            {
              const zoneMap: Record<string, { municipality: string; zona: string; secao: string; mappedVoters: number; confirmedVotes: number; neutralVoters: number; opposedVoters: number }> = {};

              allVoters.forEach(v => {
                const mun = v.municipality || v.location || 'Boa Vista';
                const z = v.zona ? `${v.zona}ª Zona` : 'Zona Geral';
                const s = v.secao ? `Seção ${v.secao}` : 'Seção Geral';
                const key = `${mun}_${z}_${s}`;

                if (!zoneMap[key]) {
                  zoneMap[key] = { municipality: mun, zona: z, secao: s, mappedVoters: 0, confirmedVotes: 0, neutralVoters: 0, opposedVoters: 0 };
                }

                zoneMap[key].mappedVoters += 1;
                if (v.sentiment === 'support' || v.voted) zoneMap[key].confirmedVotes += 1;
                else if (v.sentiment === 'opposed') zoneMap[key].opposedVoters += 1;
                else zoneMap[key].neutralVoters += 1;
              });

              teams.forEach(t => {
                const mun = t.location || 'Boa Vista';
                const key = `${mun}_Zona Geral_Seção Geral`;
                if (!zoneMap[key]) {
                  zoneMap[key] = { municipality: mun, zona: 'Zona Geral', secao: 'Seção Geral', mappedVoters: 0, confirmedVotes: 0, neutralVoters: 0, opposedVoters: 0 };
                }
              });

              data = Object.values(zoneMap)
                .sort((a, b) => b.mappedVoters - a.mappedVoters)
                .map(item => {
                  let densityStatus = '🚨 POUCA PRESENÇA';
                  if (item.confirmedVotes >= 10) densityStatus = '🎯 ALTA DENSIDADE';
                  else if (item.mappedVoters >= 5) densityStatus = '📊 DENSIDADE MÉDIA';
                  else if (item.mappedVoters > 0) densityStatus = '🟡 EM CONSTRUÇÃO';

                  return {
                    ...item,
                    densityStatus
                  };
                });

              subtitle = `Inteligência estratégica mapeando ${data.length} zonas e seções eleitorais.`;
            }
            break;

          case 'agenda_coverage':
            title = 'Relatório de Cobertura de Agenda e Vazios Eleitorais';
            {
              const roraimaMunicipalities = [
                'Boa Vista', 'Alto Alegre', 'Amajari', 'Bonfim', 'Cantá', 
                'Caracaraí', 'Caroebe', 'Iracema', 'Mucajaí', 'Normandia', 
                'Pacaraima', 'Rorainópolis', 'São João da Baliza', 'São Luiz', 'Uiramutã'
              ];

              data = roraimaMunicipalities.map(mun => {
                const munVoters = allVoters.filter(v => 
                  (v.municipality || v.location || '').toLowerCase().includes(mun.toLowerCase())
                ).length;

                const munTeams = teams.filter(t => 
                  (t.location || '').toLowerCase().includes(mun.toLowerCase())
                ).length;

                const munEvents = (agendas || []).filter(a => 
                  (a.municipio || a.municipality || a.location || '').toLowerCase().includes(mun.toLowerCase())
                );

                const eventCount = munEvents.length;

                let lastEventDate = 'Nenhuma visita';
                if (eventCount > 0) {
                  const sortedEvents = [...munEvents].sort((a, b) => new Date(b.data || b.date || 0).getTime() - new Date(a.data || a.date || 0).getTime());
                  const latestDate = sortedEvents[0]?.data || sortedEvents[0]?.date;
                  if (latestDate && !isNaN(new Date(latestDate).getTime())) {
                    lastEventDate = new Date(latestDate).toLocaleDateString('pt-BR');
                  }
                }

                let coverageStatus = '🟢 COBERTO';
                let urgencyLevel = 'Manter presença contínua';

                if (eventCount === 0 && munVoters > 5) {
                  coverageStatus = '🚨 VAZIO CRÍTICO';
                  urgencyLevel = 'Agendar visita urgente (Base de eleitores sem presença do candidato)';
                } else if (eventCount === 0) {
                  coverageStatus = '⚠️ VAZIO ELEITORAL';
                  urgencyLevel = 'Mobilizar equipe e agendar visita';
                } else if (eventCount < 2 && munVoters > 10) {
                  coverageStatus = '🟡 COBERTURA BAIXA';
                  urgencyLevel = 'Reforçar agenda de rua local';
                }

                return {
                  municipality: mun,
                  voterCount: munVoters,
                  teamCount: munTeams,
                  eventCount,
                  coverageStatus,
                  lastEventDate,
                  urgencyLevel
                };
              }).sort((a, b) => {
                if (a.coverageStatus.includes('🚨') && !b.coverageStatus.includes('🚨')) return -1;
                if (!a.coverageStatus.includes('🚨') && b.coverageStatus.includes('🚨')) return 1;
                return b.voterCount - a.voterCount;
              });

              subtitle = `Análise de lacunas territoriais e zonas sem atendimento de agenda.`;
            }
            break;

          case 'materials':
            title = 'Relatório de Gestão de Materiais';
            data = materials.map(m => ({
              ...m,
              used: (m.total || 0) - (m.current || 0)
            }));
            subtitle = `Controle de estoque de ${data.length} itens.`;
            break;

          case 'demands':
            title = 'Relatório de Demandas e Urgências';
            data = urgencies.map(u => ({
              ...u,
              dateStr: new Date(u.createdAt).toLocaleDateString(),
              status: (u.status || 'Aberta').toUpperCase()
            }));
            subtitle = `Acompanhamento de ${data.length} solicitações de urgência.`;
            break;
        }
      }

      const visibleColumns = reportColumns.filter((col: any) => {
        return data.some(row => {
          const val = row[col.dataKey];
          return val !== undefined && val !== null && String(val).trim() !== '' && String(val) !== '---';
        });
      });

      if (format === 'excel') {
        await reportService.generateExcel({
          title,
          subtitle,
          columns: visibleColumns,
          data,
          filters,
          userName,
          type
        });
      } else {
        await reportService.generatePDF({
          title,
          subtitle,
          columns: visibleColumns,
          data,
          filters,
          userName,
          type
        });
      }

      await supabaseService.addDocument('reports', {
        type,
        title: `${title} (${format.toUpperCase()})`,
        subtitle,
        format,
        timestamp: Date.now(),
        createdBy: user?.email,
        createdByDisplayName: profileData?.name || user?.email,
        createdAt: Date.now(),
        detailLevel: filters.detailLevel || 'summary',
        itemCount: data.length,
        coordinatorId: coordinatorId || ''
      });

    } catch (err: any) {
      console.error("Erro ao gerar relatório:", err);
      alert("Erro ao gerar relatório: " + err.message);
    }
  };

  const [newTeam, setNewTeam] = useState({
    name: '',
    leader: '',
    leaderEmail: '',
    leaderPhone: '',
    leaderAddress: '',
    municipio: '',
    bairro: '',
    location: '',
    observations: '',
    status: 'OK',
    contacts: 0,
    fuel: 0,
    demands: 0,
    allocated: 0,
    spent: 0
  });

  const [isAgendaCreateModalOpen, setIsAgendaCreateModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<any>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<any>(null);
  const [isAgendaDetailModalOpen, setIsAgendaDetailModalOpen] = useState(false);
  const [agendaForm, setAgendaForm] = useState({
    municipio: '',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    motivo: '',
    allocatedMaterials: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined
  });

  const [isLocatingAgendaGPS, setIsLocatingAgendaGPS] = useState(false);

  const handleGetAgendaGPS = async () => {
    setIsLocatingAgendaGPS(true);
    try {
      const loc = await getGPSLocation();
      const formatted = loc.address || [loc.suburb, loc.city].filter(Boolean).join(', ') || `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
      setAgendaForm(prev => ({
        ...prev,
        municipio: formatted,
        latitude: loc.lat,
        longitude: loc.lng
      }));
      alert("📍 Localização de evento capturada via GPS com sucesso!");
    } catch (err: any) {
      alert(err.message || "Erro ao obter GPS.");
    } finally {
      setIsLocatingAgendaGPS(false);
    }
  };

  useEffect(() => {
    if (!user || !coordinatorId) return;

    const unsubTeams = supabaseService.subscribeToCollectionFiltered('teams', coordinatorId, (data) => setTeams(data));
    const unsubUrgencies = supabaseService.subscribeToCollectionFiltered('urgencies', coordinatorId, (data) => setUrgencies(data));

    const unsubStats = supabaseService.subscribeToCollection<any>('stats', (data) => {
      const found = data.find(item => item.id === `stats_${coordinatorId}`);
      if (found) setStatsData(found);
    });

    const unsubAgendas = supabaseService.subscribeToCollectionFiltered('agenda', coordinatorId, (data) => setAgendas(data));

    const unsubNotesSnap = supabaseService.subscribeToCollectionFiltered<any>('notes', coordinatorId, (data) => {
      setNotes(data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    let unsubProfile: (() => void) | null = null;
    if (user?.uid) {
      unsubProfile = supabaseService.subscribeToCollection<any>('users', (data) => {
        const found = data.find(u => u.id === user.uid);
        if (found) {
          const userEmail = (user.email || found.email || '').toLowerCase();
          const userName = (found.name || '').toLowerCase();
          const isAntonio = userEmail.includes('antonio') || userName.includes('antonio');
          if (isAntonio && found.role !== 'coordenador_regional') {
            found.role = 'coordenador_regional';
            supabaseService.setDocument('users', user.uid, { ...found, role: 'coordenador_regional' }).catch(console.error);
          }
          setProfileData(found);
        }
      });
    }

    const unsubDailyOrder = supabaseService.subscribeToCollectionFiltered<any>('daily_orders', coordinatorId, (data) => {
      const sorted = [...data].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setDailyOrders(sorted);
      const active = sorted.find(o => o.status === 'active');
      setDailyOrder(active || null);
    });

    const unsubMaterials = supabaseService.subscribeToCollectionFiltered('materials', coordinatorId, (data) => setMaterials(data));
    const unsubMaterialRequests = supabaseService.subscribeToCollectionFiltered('material_requests', coordinatorId, (data) => setMaterialRequests(data));
    const unsubReports = supabaseService.subscribeToCollectionFiltered('reports', coordinatorId, (data) => setReportsHistory(data));

    return () => {
      unsubTeams();
      unsubUrgencies();
      unsubStats();
      unsubAgendas();
      unsubNotesSnap();
      if (unsubProfile) unsubProfile();
      unsubDailyOrder();
      unsubMaterials();
      unsubMaterialRequests();
      unsubReports();
    };
  }, [user, isAdmin, isRegional, coordinatorId]);

  const fetchServerCounts = async () => {
    if (!coordinatorId) return;
    try {
      const voters = await supabaseService.getCollectionFiltered<any>('voters', coordinatorId);
      setTotalVotersCount(voters.length);
      setVotedVotersCount(voters.filter(v => v.voted).length);
    } catch (err) {
      console.warn("Erro ao buscar contagens agregadas do servidor:", err);
    }
  };

  useEffect(() => {
    fetchServerCounts();
    if (activeTab === 'overview' || activeTab === 'voters') {
      fetchServerCounts();
    }
  }, [coordinatorId, activeTab]);

  useEffect(() => {
    if (!coordinatorId || teams.length === 0) return;

    const fetchTeamVoterCounts = async () => {
      try {
        const counts: Record<string, number> = {};
        for (const team of teams) {
          const teamName = team.name;
          const matchedFromAll = allVoters.filter(v => isVoterInTeam(v, team)).length;
          counts[teamName] = matchedFromAll;
        }
        setTeamVotersCountMap(counts);
      } catch (err) {
        console.warn("Erro ao buscar contagem de eleitores das equipes:", err);
      }
    };

    fetchTeamVoterCounts();
  }, [coordinatorId, teams, allVoters]);

  useEffect(() => {
    if (!coordinatorId) return;

    const tabsThatNeedAllVoters = ['mapa', 'analise_eleitoral', 'reports', 'overview', 'teams', 'voters', 'regional_coords', 'metas'];
    if (!tabsThatNeedAllVoters.includes(activeTab)) {
      return;
    }

    const unsubVoters = supabaseService.subscribeToCollectionFiltered<any>('voters', coordinatorId, (rawData) => {
      const uniqueMap = new Map();
      rawData.forEach((v: any) => {
        const key = (v.phone && v.phone.length > 5) ? v.phone : v.name;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, v);
        } else {
          const existing = uniqueMap.get(key);
          if (!existing.articulatorId && v.articulatorId) {
            uniqueMap.set(key, v);
          }
        }
      });
      const uniqueVoters = Array.from(uniqueMap.values());
      setAllVoters(uniqueVoters);
      safeLocalStorage.setItem(`urna360_voters_cache_${coordinatorId}`, JSON.stringify(uniqueVoters));
    });

    return () => unsubVoters();
  }, [coordinatorId, activeTab]);

  useEffect(() => {
    if (!coordinatorId || activeTab !== 'voters') return;

    setLoadingPaginatedVoters(true);
    supabaseService.getCollectionFiltered<any>('voters', coordinatorId).then((data) => {
      let filtered = data;
      if (articulatorFilter) {
        filtered = filtered.filter(v => v.articulatorId === articulatorFilter);
      }
      const sorted = filtered.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      setPaginatedVotersList(sorted);
      setHasMoreVoters(false);
      setLoadingPaginatedVoters(false);
    }).catch((err) => {
      console.warn("Error getting paginated voters:", err);
      setLoadingPaginatedVoters(false);
    });
  }, [coordinatorId, activeTab, voterPage, articulatorFilter]);

  useEffect(() => {
    if (!coordinatorId || activeTab !== 'voters') return;

    const fetchArticulators = async () => {
      try {
        const voters = await supabaseService.getCollectionFiltered<any>('voters', coordinatorId);
        setArticulators(voters.filter(v => v.isArticulator));
      } catch (err) {
        console.warn("Error fetching articulators:", err);
      }
    };

    fetchArticulators();
  }, [coordinatorId, activeTab]);

  useEffect(() => {
    if (!coordinatorId || teams.length === 0 || isGeral) return;

    const healCoordinatorVotersAndRequests = async () => {
      try {
        const allVoters = await supabaseService.getCollection<any>('voters');
        const allRequests = await supabaseService.getCollection<any>('material_requests');
         
        for (const team of teams) {
          const teamId = team.id || team.name.replace(/\s/g, '_').toLowerCase();
           
          const teamVoters = allVoters.filter(v => v.teamId === teamId && v.coordinatorId !== coordinatorId);
          for (const v of teamVoters) {
            await supabaseService.updateDocument('voters', v.id, { coordinatorId });
          }

          const teamReqs = allRequests.filter(r => r.teamId === teamId && r.coordinatorId !== coordinatorId);
          for (const r of teamReqs) {
            await supabaseService.updateDocument('material_requests', r.id, { coordinatorId });
          }
        }
      } catch (err) {
        console.error("Error healing coordinator records:", err);
      }
    };

    healCoordinatorVotersAndRequests();
  }, [teams, coordinatorId, isGeral]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ teams: [], notes: [], agendas: [] });
      return;
    }

    const queryLower = searchQuery.toLowerCase();

    const filteredTeams = teams.filter(t => 
      t.zone?.toLowerCase().includes(queryLower) || 
      t.leaderName?.toLowerCase().includes(queryLower)
    );

    const filteredNotes = notes.filter(n => 
      n.text?.toLowerCase().includes(queryLower) ||
      n.leaderName?.toLowerCase().includes(queryLower) ||
      n.team?.toLowerCase().includes(queryLower)
    );

    const filteredAgendas = agendas.filter(a => 
      a.municipio?.toLowerCase().includes(queryLower) || 
      a.motivo?.toLowerCase().includes(queryLower)
    );

    setSearchResults({
      teams: filteredTeams,
      notes: filteredNotes,
      agendas: filteredAgendas
    });
  }, [searchQuery, teams, notes, agendas]);

  const totalResults = searchResults.teams.length + searchResults.notes.length + searchResults.agendas.length;

  const stats = [
    { 
      label: 'Metas Atingidas', 
      value: goalsList.filter(g => g.progress >= 100).length || 0, 
      sub: `${goalsList.length} Cadastradas`, 
      color: 'text-[var(--text-primary)]',
      iconColor: 'bg-zinc-100 dark:bg-zinc-800',
      action: () => setActiveTab('metas')
    },
    { 
      label: 'Base Eleitoral', 
      value: totalVotersCount || allVoters.length || 0, 
      sub: 'Cadastros Reais', 
      color: 'text-emerald-600 dark:text-emerald-500',
      iconColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      action: () => isGeral ? setActiveTab('reports') : setActiveTab('voters')
    },
    { 
      label: 'Agenda de Eventos', 
      value: agendas.filter(a => a.status === 'confirmado').length || 0, 
      sub: `${agendas.filter(a => a.status === 'pendente').length} Pendentes`, 
      color: 'text-blue-600 dark:text-blue-400',
      iconColor: 'bg-blue-50 dark:bg-blue-500/10',
      action: () => setActiveTab('agenda')
    },
    { 
      label: 'Estoque Material', 
      value: materials.reduce((acc, m) => acc + (m.current || 0), 0) || 0, 
      sub: 'Unidades Disponíveis', 
      color: 'text-indigo-600 dark:text-indigo-400',
      iconColor: 'bg-indigo-50 dark:bg-indigo-500/10',
      action: () => setActiveTab('materials')
    },
  ];

  const handleCreateOrUpdateAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      const agendaId = editingAgenda?.id || `agenda_${Date.now()}`;
      await supabaseService.setDocument('agenda', agendaId, {
        ...agendaForm,
        status: editingAgenda ? editingAgenda.status : 'confirmado',
        sugeridoPorId: user?.uid,
        sugeridoPor: 'Coordenação',
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: editingAgenda ? editingAgenda.createdAt : Date.now(),
        updatedAt: Date.now()
      });
      setIsAgendaCreateModalOpen(false);
      setEditingAgenda(null);
      setAgendaForm({ municipio: '', data: '', hora_inicio: '', hora_fim: '', motivo: '' });
      alert(editingAgenda ? "Agenda atualizada!" : "Agenda criada com sucesso!");
    } catch (err: any) {
      alert("Erro ao salvar agenda: " + err.message);
    }
  };

  const handleEditAgenda = (item: any) => {
    setEditingAgenda(item);
    setAgendaForm({
      municipio: item.municipio,
      data: item.data,
      hora_inicio: item.hora_inicio,
      hora_fim: item.hora_fim,
      motivo: item.motivo
    });
    setIsAgendaCreateModalOpen(true);
  };

  const handleDeleteAgenda = async (id: string) => {
    if (window.confirm("Deseja excluir este item da agenda?")) {
      try {
        await supabaseService.deleteDocument('agenda', id);
        alert("Item movido com sucesso!");
      } catch (err: any) {
        alert("Erro ao excluir: " + err.message);
      }
    }
  };

  useEffect(() => {
    if (selectedManagingTeam) {
      const matchedFromAll = allVoters.filter(v => isVoterInTeam(v, selectedManagingTeam));
      if (matchedFromAll.length > 0) {
        setManagingTeamVoters(matchedFromAll);
        return;
      }

      const leaderEmail = selectedManagingTeam.leaderEmail?.toLowerCase();
      const teamName = selectedManagingTeam.name;

      const fetchLeaderAndVoters = async () => {
        try {
          const voters = await supabaseService.getCollectionFiltered<any>('voters', coordinatorId);
          let teamVoters = voters.filter(v => v.team === teamName);

          if (teamVoters.length === 0 && leaderEmail) {
            const users = await supabaseService.getCollectionFiltered<any>('users', coordinatorId);
            const leader = users.find(u => u.email?.toLowerCase() === leaderEmail);
            if (leader) {
              teamVoters = voters.filter(v => v.leaderId === leader.id);
            }
          }

          setManagingTeamVoters(teamVoters);
        } catch (err) {
          console.error("Erro ao buscar eleitores da equipe:", err);
        }
      };

      fetchLeaderAndVoters();
    }
  }, [selectedManagingTeam, isAdmin, coordinatorId, isGeral, allVoters]);

  const sourceVoters = allVoters.length > 0 ? allVoters : paginatedVotersList;

  const filteredVoters = sourceVoters.filter(voter => {
    const matchesSearch = !voterSearch || 
      voter.name?.toLowerCase().includes(voterSearch.toLowerCase()) || 
      voter.phone?.includes(voterSearch);
     
    const matchesReferredBy = !voterFilterReferredBy || 
      voter.referredBy?.toLowerCase().includes(voterFilterReferredBy.toLowerCase());

    const matchesTags = voterFilterTags.length === 0 || 
      voterFilterTags.every((tag: string) => 
        voter.tags?.some((vTag: string) => vTag.trim().toUpperCase() === tag)
      );

    const matchesArticulator = !articulatorFilter || 
      voter.articulatorId === articulatorFilter;

    return matchesSearch && matchesReferredBy && matchesTags && matchesArticulator;
  });

  const availableTags = Array.from(new Set(
    sourceVoters.flatMap(v => (v.tags || []) as string[])
      .map(t => t.trim().toUpperCase())
      .filter(t => t !== "")
  )) as string[];

  const totalPages = allVoters.length > 0 
    ? (Math.ceil(filteredVoters.length / voterPageSize) || 1)
    : (Math.ceil(totalVotersCount / voterPageSize) || 1);

  const paginatedVoters = allVoters.length > 0
    ? filteredVoters.slice((voterPage - 1) * voterPageSize, voterPage * voterPageSize)
    : filteredVoters.slice((voterPage - 1) * voterPageSize, voterPage * voterPageSize);

  const handleProcessCaos = async () => {
    setIsProcessing(true);
    setAiResult(null);
    try {
      const res = await processarCaos(chaosText);
      setAiResult(res);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNote = async (type: 'private' | 'tactical') => {
    if (!user || !chaosText.trim()) return;
    setIsProcessing(true);
    try {
      const noteId = `note_coord_${Date.now()}`;
      await supabaseService.setDocument('notes', noteId, {
        id: noteId,
        text: chaosText,
        authorId: user.uid,
        authorName: profileData?.name || 'Coordenador',
        authorRole: 'coordinator',
        teamName: 'Liderança',
        type: type,
        coordinatorId: coordinatorId || user?.uid || '',
        createdAt: Date.now()
      });
      setChaosText('');
      setAiResult(null);
      setIsAiModalOpen(false);
      alert(type === 'private' ? 'Observação salva na sua área pessoal!' : 'Nota postada no fórum tático!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return alert("Apenas administradores podem criar equipes.");
     
    if (!isEditMode) {
      const leaderValidation = await validateLeaderRegistration(coordinatorId || user?.uid);
      if (!leaderValidation.allowed) {
        triggerUpgradeRedirect(leaderValidation.reason!, isGeral);
        return;
      }
    }

    try {
      const teamId = editingTeamId || newTeam.name.replace(/\s/g, '_').toLowerCase();
      const defaultPassword = 'urna' + Math.floor(1000 + Math.random() * 9000);
       
      await supabaseService.setDocument('teams', teamId, {
        ...newTeam,
        allocated: Number(newTeam.allocated) || 0,
        spent: Number(newTeam.spent) || 0,
        contacts: Number(newTeam.contacts) || 0,
        demands: Number(newTeam.demands) || 0,
        fuel: Number(newTeam.fuel) || 0,
        tempPassword: isEditMode ? ((newTeam as any).tempPassword || defaultPassword) : defaultPassword,
        coordinatorId: coordinatorId || user?.uid || '',
        regionalCoordId: newTeam.regionalCoordId || (isRegional ? (user?.uid || '') : ''),
        updatedAt: Date.now(),
        createdAt: isEditMode ? ((newTeam as any).createdAt || Date.now()) : Date.now()
      });

      if (!isEditMode) {
        await supabaseService.setDocument('pre_registrations', newTeam.leaderEmail.toLowerCase(), {
          email: newTeam.leaderEmail.toLowerCase(),
          name: newTeam.leader,
          phone: newTeam.leaderPhone,
          address: newTeam.leaderAddress,
          teamName: newTeam.name,
          teamId: teamId,
          location: newTeam.location,
          tempPassword: defaultPassword,
          role: 'lider',
          coordinatorId: coordinatorId || user?.uid || '',
          regionalCoordId: newTeam.regionalCoordId || (isRegional ? (user?.uid || '') : ''),
          createdAt: Date.now()
        });
         
        const accessLink = `${window.location.origin}/login?email=${encodeURIComponent(newTeam.leaderEmail)}&access_token=${btoa(defaultPassword)}&role=lider&coordinatorId=${coordinatorId || user?.uid || ''}&regionalCoordId=${newTeam.regionalCoordId || (isRegional ? (user?.uid || '') : '')}&teamId=${teamId}`;
        setCreatedTeamLink(accessLink);
        setTeamCreationStep('success');
      } else {
        setIsTeamModalOpen(false);
        setIsEditMode(false);
        setEditingTeamId(null);
        alert("Equipe atualizada com sucesso!");
      }
       
      if (!isEditMode) alert("Equipe e acesso do líder criados com sucesso!");
    } catch (err: any) {
      alert("Erro ao processar equipe: " + err.message);
    }
  };

  const handleCopyAccessLink = (team: any) => {
    const email = team.leaderEmail;
    const pass = team.tempPassword || 'urna1234'; 
    const link = `${window.location.origin}/login?email=${encodeURIComponent(email)}&access_token=${btoa(pass)}&role=lider&coordinatorId=${coordinatorId || user?.uid || ''}&regionalCoordId=${team.regionalCoordId || ''}&teamId=${team.id}`;
    navigator.clipboard.writeText(link);
    alert(`Link de acesso copiado para ${team.leader}!\nEnvie via WhatsApp.`);
  };

  const handleEditTeam = (team: any) => {
    setNewTeam({
      ...team,
      name: team.name,
      leader: team.leader,
      leaderEmail: team.leaderEmail || '',
      leaderPhone: team.leaderPhone || '',
      leaderAddress: team.leaderAddress || '',
      location: team.location,
      observations: team.observations || '',
      status: team.status || 'OK',
      contacts: team.contacts || 0,
      fuel: team.fuel || 0,
      demands: team.demands || 0,
      allocated: team.allocated || 0,
      spent: team.spent || 0
    });
    setEditingTeamId(team.id || team.name.replace(/\s/g, '_').toLowerCase());
    setIsEditMode(true);
    setTeamCreationStep('form');
    setIsTeamModalOpen(true);
  };

  const handleResetSystem = async () => {
    const activeCoordId = coordinatorId || user?.uid;
    if (!isAdmin || !activeCoordId) return;
    if (window.confirm("⚠️ ALERTA DE SEGURANÇA: Deseja realmente ZERAR os dados da SUA CAMPANHA?")) {
      try {
        setIsProcessing(true);
        const collections = ['transactions', 'attendance', 'notes', 'urgencies', 'agenda', 'voters'];
        for (const coll of collections) {
          const docs = await supabaseService.getCollectionFiltered<any>(coll, activeCoordId);
          for (const d of docs) {
            await supabaseService.deleteDocument(coll, d.id);
          }
        }
        alert("✅ DADOS DA SUA CAMPANHA REINICIADOS COM SUCESSO!");
        setIsProfileModalOpen(false);
      } catch (err: any) {
        alert("Erro ao formatar sistema: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleVoterEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoter) return;
    try {
      await supabaseService.setDocument('voters', selectedVoter.id, voterEditForm, true);
      setIsVoterEditModalOpen(false);
      setSelectedVoter(null);
      await fetchServerCounts();
      alert("Eleitor atualizado com sucesso!");
    } catch (err: any) {
      alert("Erro ao atualizar eleitor: " + err.message);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`Deseja realmente excluir a equipe "${teamName}"?`)) {
      try {
        await supabaseService.deleteDocument('teams', teamId);
        alert("Equipe excluída com sucesso!");
      } catch (err: any) {
        alert("Erro ao excluir equipe: " + err.message);
      }
    }
  };

  const handleDeleteVoter = async (voterId: string) => {
    if (window.confirm("Deseja realmente excluir este eleitor?")) {
      try {
        await supabaseService.deleteDocument('voters', voterId);
        await fetchServerCounts();
        alert("Eleitor excluído com sucesso!");
      } catch (err: any) {
        alert("Erro ao excluir eleitor: " + err.message);
      }
    }
  };

  const handleGenerateBriefing = async (location: string) => {
    setBriefingLoading(true);
    setBriefingLocation(location);
    try {
      const allUrgencies = await supabaseService.getCollectionFiltered<any>('urgencies', coordinatorId || '');
      const localDemands = allUrgencies.filter(u => u.team === location && u.type === 'demanda');
      const res = await gerarBriefingCandidato(location, localDemands);
      setBriefingResult(res);
      setIsBriefingModalOpen(true);
    } catch (err: any) {
      alert("Erro ao gerar briefing: " + err.message);
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleShowTeamHistory = async (team: any) => {
    setSelectedHistoryTeam(team);
    setIsHistoryModalOpen(true);
    try {
      const txs = await supabaseService.getCollectionFiltered<any>('transactions', coordinatorId);
      const teamTxs = txs.filter(t => t.team === team.name).sort((a, b) => (b.date || 0) - (a.date || 0)).slice(0, 20);
      setTeamHistory(teamTxs);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden transition-colors duration-300">
      <aside className="hidden lg:flex w-72 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-color)] py-8 px-6 overflow-y-auto shrink-0 relative z-40">
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
              <div className={`transition-colors ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'}`}>
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
            {activeTab === 'metas' && isGeral && (
              <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-color)] pb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <Target className="w-6 h-6 text-blue-600" /> Central de Metas Eleitorais
                    </h2>
                  </div>
                </div>

                <form onSubmit={handleCreateGoal} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl space-y-4 shadow-sm">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-600" /> Cadastrar Nova Meta Geral
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase block mb-1">Nome do Município / Local</label>
                      <input 
                        required
                        type="text" 
                        value={newGoal.locationName}
                        onChange={(e) => setNewGoal({ ...newGoal, locationName: e.target.value })}
                        placeholder="Ex: Boa Vista"
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 font-bold text-xs outline-none focus:border-blue-600 text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-black text-[var(--text-secondary)] uppercase block mb-1">Meta Geral de Eleitores</label>
                      <input 
                        required
                        type="text" 
                        inputMode="numeric"
                        value={newGoal.targetVoters === '' ? '' : (typeof newGoal.targetVoters === 'number' ? newGoal.targetVoters.toLocaleString('pt-BR') : newGoal.targetVoters)}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '');
                          setNewGoal({ ...newGoal, targetVoters: digits === '' ? '' : parseInt(digits, 10) });
                        }}
                        placeholder="Ex: 5.000"
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 font-bold text-xs outline-none focus:border-blue-600 text-[var(--text-primary)]"
                      />
                    </div>
                    <div className="flex items-end">
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3 rounded-xl uppercase tracking-wider shadow-md transition-all cursor-pointer"
                      >
                        Salvar Meta Geral
                      </button>
                    </div>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {goalsList.map(goal => (
                    <div key={goal.id} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl relative flex flex-col justify-between shadow-sm">
                      <div>
                        <h3 className="text-base font-semibold text-[var(--text-primary)]">{goal.locationName}</h3>
                        <p className="text-sm font-black text-blue-600 mt-2">Meta: {Number(goal.targetVoters).toLocaleString('pt-BR')} eleitores</p>
                      </div>
                      <button onClick={() => handleDeleteGoal(goal.id)} className="mt-4 text-xs text-red-500 font-bold hover:underline">Excluir</button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
