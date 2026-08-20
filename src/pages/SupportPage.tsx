import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Headphones, 
  MessageSquare, 
  Mail, 
  Clock, 
  FileText, 
  HelpCircle, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  MapPin, 
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMMERCIAL_WHATSAPP_NUMBER } from '../config/asaasConfig';
import { supabaseService } from '../lib/supabaseService';
import { useAuth } from '../lib/SupabaseProvider';

export function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('todos');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form State
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('duvida_geral');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const SUPPORT_EMAIL = 'inicialinovacoestecnologicas@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Por favor, preencha nome, e-mail e a descrição da sua solicitação.");
      return;
    }

    try {
      setIsSubmitting(true);
      const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      const ticketData = {
        id: ticketId,
        name,
        email,
        phone,
        category,
        subject: subject || 'Dúvida ou Suporte da Campanha',
        message,
        userId: user?.uid || null,
        coordinatorId: user?.coordinatorId || user?.uid || 'public',
        status: 'aberto',
        createdAt: Date.now()
      };

      await supabaseService.setDocument('support_tickets', ticketId, ticketData);
      setSubmittedSuccess(true);
    } catch (err: any) {
      alert("Erro ao enviar chamado: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá, Suporte Nexus Política!\n\n*Nome:* ${name || 'Usuário'}\n*E-mail:* ${email || 'Não informado'}\n*Assunto:* ${subject || 'Dúvida/Suporte'}\n\n*Mensagem:* ${message || 'Gostaria de falar com o suporte técnico da plataforma.'}`
    );
    window.open(`https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  const FAQ_ITEMS = [
    {
      category: 'acesso',
      q: 'Como convidar e enviar o link de acesso para os Líderes de Equipe?',
      a: 'No painel do Coordenador Geral ou Regional, vá na aba "Equipes & Líderes", cadastre o líder com nome, e-mail e telefone. O sistema gera automaticamente um link exclusivo de convite com senha temporária. Basta clicar em "Copiar Link" e enviar no WhatsApp do líder.'
    },
    {
      category: 'acesso',
      q: 'Um operador esqueceu a senha ou não consegue entrar. Como proceder?',
      a: 'Na tela de login inicial (/login), clique no botão "Esqueceu a senha?". O operador digita o e-mail cadastrado e recebe na hora o link seguro de redefinição de senha da plataforma.'
    },
    {
      category: 'metas',
      q: 'Como funcionam as metas de votação por bairro ou município?',
      a: 'Na aba "Metas de Votação", você define o objetivo de apoiadores para cada bairro ou região. O sistema vincula automaticamente os líderes que atuam naquela área e atualiza a barra de progresso em tempo real a cada eleitor cadastrado.'
    },
    {
      category: 'whatsapp',
      q: 'O envio de WhatsApp gera algum custo por mensagem enviada?',
      a: 'Não! O Nexus Política utiliza o protocolo oficial wa.me do WhatsApp. O sistema pré-formata a mensagem com o nome e o bairro do eleitor, e abre o próprio WhatsApp do celular ou computador do operador. É 100% gratuito e seguro.'
    },
    {
      category: 'mapa',
      q: 'Como visualizar a concentração de eleitores no Mapa de Calor?',
      a: 'Na aba "Mapa Tático", o sistema exibe os círculos de calor sobre os bairros e cidades onde sua campanha tem mais apoiadores cadastrados, facilitando a escolha de trajetos de carreatas, caminhadas e reuniões.'
    },
    {
      category: 'logistica',
      q: 'Como gerenciar a entrega de santinhos, bandeiras e combustível?',
      a: 'Na aba "Materiais & Logística", você cadastra o estoque do comitê (ex: santinhos, adesivos, bandeiras) e autoriza entregas para cada líder, mantendo o histórico de retiradas registrado digitalmente.'
    },
    {
      category: 'tse',
      q: 'Como obter a Nota Fiscal para prestação de contas eleitorais no TSE?',
      a: 'Ao contratar a assinatura via Asaas, a Nota Fiscal de Prestação de Serviços de Software é emitida com o CNPJ do Comitê ou CPF do Candidato e enviada diretamente para o seu e-mail, válida para o sistema SPCE do TSE.'
    }
  ];

  const filteredFaqs = activeFaqCategory === 'todos' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(f => f.category === activeFaqCategory);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-300 pb-20">
      
      {/* HEADER DA PÁGINA */}
      <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0f172a] border border-white/10 text-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-xs active:scale-95 flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300">Central de Atendimento & Suporte</span>
          </div>
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <section className="px-4 md:px-8 pt-10 pb-8 max-w-6xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
          <Headphones className="w-4 h-4 text-emerald-400" />
          Plantão Eleitoral & Suporte Técnico Especializado
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
          Como podemos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">ajudar sua campanha</span> hoje?
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Tire dúvidas, abra chamados técnicos ou fale diretamente com nossos consultores de campanha no WhatsApp.
        </p>
      </section>

      <main className="px-4 md:px-8 max-w-6xl mx-auto space-y-12">
        
        {/* CARDS DE ATENDIMENTO RÁPIDO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: WhatsApp Plantão */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-emerald-500/30 flex flex-col justify-between space-y-4 shadow-lg shadow-emerald-950/10">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-100">WhatsApp Plantão</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Atendimento rápido e direto com consultores especialistas em campanhas eleitorais.
              </p>
            </div>

            <a
              href={`https://wa.me/${COMMERCIAL_WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20no%20Nexus%20Pol%C3%ADtica.`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Card 2: E-mail Oficial */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-100">E-mail de Suporte</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Para solicitações formais, sugestões técnicas, notas fiscais e prestação de contas.
              </p>
              <div className="p-2.5 rounded-xl bg-[#090d16] border border-white/10 text-[11px] text-blue-300 font-mono break-all flex items-center justify-between">
                <span>{SUPPORT_EMAIL}</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copiar e-mail"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Suporte%20Nexus%20Pol%C3%ADtica`}
              className="w-full py-3 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10"
            >
              <Mail className="w-4 h-4" />
              Enviar E-mail
            </a>
          </div>

          {/* Card 3: Horário de Plantão */}
          <div className="p-6 rounded-3xl bg-[#0f172a] border border-white/10 flex flex-col justify-between space-y-4 shadow-md">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-100">Horário de Atendimento</h3>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Segunda a Sábado:</strong> 08h às 20h</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Reta Final de Campanha:</strong> Plantão estendido 24h</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Dia "D" da Votação:</strong> Monitoramento contínuo</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300 font-medium text-center">
              🛡️ Resposta média em menos de 15 minutos no WhatsApp
            </div>
          </div>

        </div>

        {/* SEÇÃO: FORMULÁRIO DE CHAMADO TÉCNICO & FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUNA ESQUERDA: FORMULÁRIO DE CHAMADO */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0f172a] border border-white/10 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-500" />
                Abrir Chamado de Suporte
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Envie sua dúvida ou solicitação técnica para nossa equipe:
              </p>
            </div>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-black text-slate-100 text-base">Chamado Registrado com Sucesso!</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Nossa equipe técnica recebeu sua mensagem e entrará em contato pelo seu e-mail ou WhatsApp.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Enviar Outro Chamado
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Seu Nome Completo:</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">E-mail Cadastrado:</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@gmail.com"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">WhatsApp / Telefone:</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(95) 99999-9999"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Assunto / Categoria:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full"
                  >
                    <option value="duvida_geral">Dúvida Geral sobre o Sistema</option>
                    <option value="acesso_senhas">Acessos, Senhas e Convite de Líderes</option>
                    <option value="metas_equipes">Metas de Bairro e Equipes de Rua</option>
                    <option value="mapa_tre">Mapa de Calor e Dados do TRE</option>
                    <option value="financeiro_nf">Financeiro, Planos e Nota Fiscal</option>
                    <option value="sugestao">Sugestão de Nova Funcionalidade</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">Descrição da Solicitação:</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Descreva detalhadamente o que você precisa ou a dúvida da sua equipe..."
                    className="w-full"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-600/25 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrar Chamado'}
                    <Send className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenDirectWhatsApp}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Enviar pelo Zap
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* COLUNA DIREITA: BASE DE CONHECIMENTO & PERGUNTAS FREQUENTES */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <h2 className="text-xl font-black text-slate-100 tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                Base de Conhecimento Rápida
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Encontre respostas imediatas para as dúvidas mais comuns de campanha:
              </p>
            </div>

            {/* FILTRO DE CATEGORIAS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {[
                { id: 'todos', label: 'Todos os Tópicos' },
                { id: 'acesso', label: 'Acessos & Convites' },
                { id: 'metas', label: 'Metas & Equipes' },
                { id: 'whatsapp', label: 'WhatsApp wa.me' },
                { id: 'mapa', label: 'Mapas & Dados' },
                { id: 'tse', label: 'Notas & TSE' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFaqCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeFaqCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#0f172a] text-slate-400 hover:text-slate-100 border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* LISTA DE ITENS FAQ */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-[#0f172a] border border-white/10 rounded-2xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-200 flex items-center justify-between gap-3 hover:bg-[#1e293b]/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight className={`w-4 h-4 text-blue-400 transition-transform ${openFaqIndex === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 pb-4 text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
