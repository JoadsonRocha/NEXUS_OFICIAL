import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/SupabaseProvider';
import { supabaseService } from '../lib/supabaseService';
import { validateGeneralCoordinatorRegistration, triggerUpgradeRedirect } from '../lib/planService';
import { showToast } from '../components/GlobalToastHost';
import logoImg from '../assets/logo.png';

const sanitizeId = (id?: string | null): string => (id ? String(id).trim() : '');

export function LoginPage() {
  const { 
    login, 
    loginWithEmail, 
    signupWithEmail, 
    resetPassword
  } = useAuth();
  
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'coordenador_geral' | 'coordenador_regional' | 'lider'>('coordenador_geral');
  const [inviteParams, setInviteParams] = useState<{
    role?: string | null;
    coordinatorId?: string | null;
    regionalCoordId?: string | null;
    teamId?: string | null;
    region?: string | null;
    email?: string | null;
  }>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [acceptedLgpd, setAcceptedLgpd] = useState(false);
  const [authInfo, setAuthInfo] = useState('');
  const [showDomainGuide, setShowDomainGuide] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para o Modal de Recuperação de Senha
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [cooldownTimer, setCooldownTimer] = useState(0);

  // Timer de resfriamento para reenvio de e-mail (evita spam e rate limit)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer]);

  // Handle URL Params for Easy Access and store them safely
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const tokenParam = params.get('access_token');
    const roleParam = params.get('role');
    const coordParam = params.get('coordinatorId');
    const regCoordParam = params.get('regionalCoordId');
    const teamParam = params.get('teamId');
    const regionParam = params.get('region');
    const confirmedParam = params.get('confirmed') || params.get('email_confirmed');

    if (confirmedParam) {
      showToast('E-mail confirmado com sucesso! Faça login para continuar.', 'success');
    }

    const inviteData = {
      role: roleParam,
      coordinatorId: coordParam,
      regionalCoordId: regCoordParam,
      teamId: teamParam,
      region: regionParam,
      email: emailParam
    };

    setInviteParams(inviteData);

    if (emailParam) {
      setEmail(emailParam);
      setForgotEmail(emailParam);
    }

    if (roleParam && (roleParam === 'coordenador_regional' || roleParam === 'lider' || roleParam === 'coordenador_geral')) {
      setUserRole(roleParam as any);
    }
    
    if (tokenParam) {
      try {
        const decodedPass = atob(tokenParam);
        setPassword(decodedPass);
      } catch (e) {
        setPassword(tokenParam);
      }
    }

    if (emailParam || roleParam || coordParam) {
      try {
        sessionStorage.setItem('nexus_pending_invite', JSON.stringify(inviteData));
      } catch (e) {}
    }
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthInfo('');
    setIsLoading(true);
    const params = new URLSearchParams(window.location.search);
    const urlRole = (params.get('role') || inviteParams.role || userRole) as any;
    const urlCoordId = params.get('coordinatorId') || inviteParams.coordinatorId || '';
    const urlRegionalCoordId = params.get('regionalCoordId') || inviteParams.regionalCoordId || '';
    const urlTeamId = params.get('teamId') || inviteParams.teamId || '';
    const urlRegion = params.get('region') || inviteParams.region || '';

    try {
      // 1. Procurar pré-registro em 'pre_registrations'
      let preRegDoc = await supabaseService.getDocument('pre_registrations', email.toLowerCase()) as any;
      
      // 2. Se não encontrou, verificar na coleção de coordenadores regionais
      if (!preRegDoc) {
        try {
          const allRegs = await supabaseService.getCollection<any>('regional_coordinators');
          const foundReg = allRegs.find(rc => rc.email && rc.email.toLowerCase() === email.toLowerCase());
          if (foundReg) {
            preRegDoc = {
              ...foundReg,
              role: 'coordenador_regional'
            };
          }
        } catch (e) {}
      }

      // 3. Se não encontrou, verificar na coleção de equipes
      if (!preRegDoc) {
        try {
          const allTeams = await supabaseService.getCollection<any>('teams');
          const foundTeam = allTeams.find(t => (t.leaderEmail && t.leaderEmail.toLowerCase() === email.toLowerCase()) || (t.email && t.email.toLowerCase() === email.toLowerCase()));
          if (foundTeam) {
            preRegDoc = {
              ...foundTeam,
              name: foundTeam.leader,
              phone: foundTeam.leaderPhone,
              address: foundTeam.leaderAddress,
              role: 'lider',
              teamId: foundTeam.id,
              teamName: foundTeam.name
            };
          }
        } catch (e) {}
      }

      // Definir o papel garantido
      let effectiveRole = preRegDoc?.role || urlRole || userRole;
      if (urlRole === 'coordenador_regional' || preRegDoc?.role === 'coordenador_regional') {
        effectiveRole = 'coordenador_regional';
      }

      if (isRegistering) {
        if (!acceptedLgpd) {
          setAuthError('Por favor, aceite os Termos de Uso e Política de Privacidade para criar a conta.');
          setIsLoading(false);
          return;
        }
        
        // Impedir que cadastros abertos ganhem direitos administrativos (exceto Coordenador Geral, que inicia a campanha)
        if ((effectiveRole === 'admin' || effectiveRole === 'coordenador') && !preRegDoc) {
          setAuthError('Erro de Segurança: Não é permitido criar contas administrativas sem pré-registro autorizado no comitê.');
          setIsLoading(false);
          return;
        }

        const sanitizeId = (id: any) => (!id || id === 'null' || id === 'undefined' || String(id).trim() === '') ? undefined : id;
        
        const effectiveCoordinatorId = sanitizeId(preRegDoc?.coordinatorId) || sanitizeId(urlCoordId) || undefined;
        const effectiveRegionalCoordId = sanitizeId(preRegDoc?.regionalCoordId) || sanitizeId(urlRegionalCoordId) || undefined;
        const effectiveTeamId = sanitizeId(preRegDoc?.teamId) || sanitizeId(urlTeamId) || undefined;
        const effectiveRegion = preRegDoc?.region || urlRegion || '';

        if (effectiveRole === 'coordenador_geral') {
          const validation = await validateGeneralCoordinatorRegistration();
          if (!validation.allowed) {
            triggerUpgradeRedirect(validation.reason!, true);
            setIsLoading(false);
            return;
          }
        }
        
        const shouldForce = false;
        
        await signupWithEmail(email, password, effectiveRole, {
          name: preRegDoc?.name || email.split('@')[0],
          phone: preRegDoc?.phone || '',
          address: preRegDoc?.address || '',
          region: effectiveRegion,
          teamName: preRegDoc?.teamName || '',
          teamId: effectiveTeamId,
          coordinatorId: effectiveCoordinatorId,
          regionalCoordId: effectiveRegionalCoordId,
          forcePasswordChange: shouldForce
        });
      } else {
        try {
          await loginWithEmail(email, password);
        } catch (err: any) {
          const errStr = (err.message || '').toLowerCase();
          const errCode = (err.code || '').toLowerCase();
          
          const isCredentialIssue = errCode.includes('user-not-found') || 
                                   errCode.includes('invalid-credential') || 
                                   errStr.includes('invalid login credentials') ||
                                   errStr.includes('invalid_grant') ||
                                   errStr.includes('user not found');

          if (isCredentialIssue) {
            if (preRegDoc || effectiveRole === 'coordenador_geral') {
              setAuthInfo('Primeiro acesso detectado. Estamos criando seu ambiente seguro, aguarde...');
              
              const effectiveCoordinatorId = sanitizeId(preRegDoc?.coordinatorId) || sanitizeId(urlCoordId) || undefined;
              const effectiveRegionalCoordId = sanitizeId(preRegDoc?.regionalCoordId) || sanitizeId(urlRegionalCoordId) || undefined;
              const effectiveTeamId = sanitizeId(preRegDoc?.teamId) || sanitizeId(urlTeamId) || undefined;
              const effectiveRegion = preRegDoc?.region || urlRegion || '';
              const shouldForce = preRegDoc?.forcePasswordChange !== false && !preRegDoc?.passwordChangedAt;

              await signupWithEmail(email, password, effectiveRole, {
                name: preRegDoc?.name || email.split('@')[0],
                phone: preRegDoc?.phone || '',
                address: preRegDoc?.address || '',
                region: effectiveRegion,
                teamName: preRegDoc?.teamName || '',
                teamId: effectiveTeamId,
                coordinatorId: effectiveCoordinatorId,
                regionalCoordId: effectiveRegionalCoordId,
                forcePasswordChange: shouldForce
              });
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error caught:", err);
      const errorMsg = err.message || '';
      const errorCode = err.code || '';

      if (errorCode === 'auth/email-already-in-use' || errorMsg.includes('email-already-in-use') || errorMsg.includes('User already registered')) {
        setAuthError('Este e-mail já possui uma conta ativa. Faça o login usando sua senha cadastrada.');
      } else if (errorCode === 'auth/invalid-credential' || errorMsg.includes('invalid-credential') || errorMsg.includes('INVALID_LOGIN_CREDENTIALS')) {
        setAuthError('Chave de acesso incorreta. Verifique os dados digitados ou clique em "Esqueceu a senha?".');
      } else if (errorCode === 'auth/user-not-found' || errorMsg.includes('user-not-found')) {
        setAuthError('Operador não encontrado. Certifique-se de que seu e-mail foi cadastrado pela coordenação.');
      } else if (errorCode === 'auth/too-many-requests' || errorMsg.includes('too-many-requests') || errorMsg.includes('rate limit')) {
        setAuthError('Muitas tentativas em pouco tempo. Aguarde alguns instantes antes de tentar novamente.');
      } else if (errorMsg.includes('Email not confirmed')) {
        setAuthError('Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada e clique no link de validação.');
      } else {
        setAuthError(errorMsg || 'Erro na autenticação. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const targetEmail = (forgotEmail || email).trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setForgotError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (cooldownTimer > 0) return;

    setForgotLoading(true);

    try {
      await resetPassword(targetEmail);
      setForgotSent(true);
      setCooldownTimer(60);
      showToast(`Link de recuperação enviado para ${targetEmail}`, 'success');
    } catch (err: any) {
      console.error("Reset password error:", err);
      const msg = err.message || '';
      if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
        setForgotError('Limite de envios atingido para este e-mail. Por favor, aguarde alguns minutos antes de tentar novamente.');
      } else if (msg.includes('user not found') || msg.includes('User not found')) {
        setForgotError('Nenhum usuário cadastrado com este e-mail.');
      } else {
        setForgotError(msg || 'Erro ao enviar o e-mail de recuperação. Tente novamente.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setAuthInfo('');
    setShowDomainGuide(false);
    try {
      await login();
    } catch (err: any) {
      console.error("Google Auth error caught:", err);
      const errorMsg = err.message || '';
      const errorCode = err.code || '';
      
      if (errorCode === 'auth/cancelled-popup-request' || errorMsg.includes('cancelled-popup-request')) {
        setAuthError('Requisição de login cancelada.');
      } else if (errorCode === 'auth/popup-closed-by-user' || errorMsg.includes('popup-closed-by-user')) {
        setAuthError('Janela de autenticação fechada antes de concluir o login.');
      } else if (errorCode === 'auth/unauthorized-domain' || errorMsg.includes('unauthorized-domain')) {
        setAuthError('Domínio de visualização não autorizado no Supabase.');
        setShowDomainGuide(true);
      } else if (errorCode === 'auth/popup-blocked' || errorMsg.includes('popup-blocked')) {
        setAuthError('O popup de login foi bloqueado pelo navegador.');
      } else {
        setAuthError(errorMsg || 'Erro na autenticação com Google.');
      }
    }
  };

  const roleBadgeLabel = inviteParams.role === 'coordenador_regional' 
    ? 'Convite: Coordenação Regional' 
    : inviteParams.role === 'lider' 
    ? 'Convite: Liderança de Equipe' 
    : null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden transition-colors duration-300 selection:bg-blue-600 selection:text-white">
      {/* Dynamic Ambient Background Highlights */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>
      <div className="absolute top-1/4 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-950/5 relative z-20 backdrop-blur-md"
      >
        {/* Header / Logo */}
        <div className="text-center space-y-3.5 mb-6">
          <div className="flex justify-center items-center">
            <img 
              src={logoImg} 
              onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = 'true'; t.src = '/logo.png'; } }} 
              alt="Logo Nexus Política" 
              className="h-11 sm:h-12 w-auto max-w-[190px] object-contain drop-shadow-sm transition-all" 
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Painel Eleitoral 2026</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-primary)]">
              {isRegistering ? 'Criar uma Conta' : 'Fazer Login'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] opacity-80">
              {roleBadgeLabel ? (
                <span className="font-semibold text-blue-600 dark:text-blue-400">{roleBadgeLabel}</span>
              ) : (
                'Entre com suas credenciais para continuar'
              )}
            </p>
          </div>
        </div>
        
        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5 text-left">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] opacity-50">
                <Mail className="w-4 h-4" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!forgotEmail) setForgotEmail(e.target.value);
                }}
                required
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-xs sm:text-sm placeholder:[var(--text-secondary)] placeholder:opacity-40"
                placeholder="nome@campanha.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Senha
              </label>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotError('');
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-500 transition-colors focus:outline-none cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] opacity-50">
                <Lock className="w-4 h-4" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] pl-10 pr-10 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-xs sm:text-sm placeholder:[var(--text-secondary)] placeholder:opacity-40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-blue-600 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Info Message (Auto Registration) */}
          {authInfo && (
            <div className="space-y-2 pt-1">
              <p className="text-blue-500 text-xs font-semibold text-center bg-blue-500/10 py-2 px-3 rounded-xl border border-blue-500/20 flex items-center justify-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></span>
                {authInfo}
              </p>
            </div>
          )}

          {/* Error Message */}
          {authError && (
            <div className="space-y-2 pt-1">
              <p className="text-red-500 text-xs font-semibold text-center bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">
                {authError}
              </p>
              
              {showDomainGuide && (
                <div className="bg-blue-600/5 border border-blue-600/20 rounded-xl p-3 text-left space-y-2 text-xs">
                  <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                    Configuração de Domínio no Supabase:
                  </h4>
                  <div className="flex items-center justify-between bg-[var(--bg-tertiary)] border border-[var(--border-color)] p-2 rounded-lg gap-2">
                    <code className="text-[10px] font-mono select-all truncate text-[var(--text-primary)]">{window.location.hostname}</code>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.hostname);
                        setCopiedDomain(window.location.hostname);
                        setTimeout(() => setCopiedDomain(null), 2000);
                      }}
                      className="px-2.5 py-1 text-[9px] font-bold bg-blue-600 text-white rounded-md hover:bg-blue-500 active:scale-95 transition-all shrink-0 cursor-pointer"
                    >
                      {copiedDomain === window.location.hostname ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LGPD Checkbox for Registration */}
          {isRegistering && (
            <div className="pt-2 pb-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  required
                  checked={acceptedLgpd}
                  onChange={e => setAcceptedLgpd(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-600 cursor-pointer accent-blue-600 shrink-0"
                />
                <span className="text-[10px] text-[var(--text-secondary)] font-semibold leading-tight">
                  Concordo com os <a href="/termos" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Termos de Uso</a> e a <a href="/privacidade" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Política de Privacidade</a>.
                </span>
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || (isRegistering && !acceptedLgpd)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <span>{isRegistering ? 'Criar Conta' : 'Entrar'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-color)]"></div>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-3 tracking-widest opacity-60">
            ou acesse com
          </div>
        </div>

        {/* Google Auth Button */}
        <button 
          type="button"
          onClick={handleGoogleAuth}
          className="w-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2.5 border border-[var(--border-color)] transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          <svg className="w-4 h-4 text-blue-600 shrink-0" viewBox="0 0 24 24">
             <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
             <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
             <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
             <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Google</span>
        </button>

        {/* Footer Nav */}
        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="hover:text-blue-600 transition-colors font-medium cursor-pointer"
          >
            {isRegistering ? 'Já possui conta? Entrar' : 'Criar uma conta'}
          </button>

          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-500 font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Início</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
      
      {/* Modal Moderno de Recuperação de Senha */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForgotModal(false)}
              className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-[400px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-7 shadow-2xl shadow-blue-950/20 z-10"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded-lg transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="text-center space-y-2 mb-5">
                <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--text-primary)] tracking-tight">
                  Recuperação de Senha
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Digite seu e-mail cadastrado e enviaremos um link seguro para redefinir sua chave de acesso.
                </p>
              </div>

              {/* Success View */}
              {forgotSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 text-center py-2"
                >
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>E-mail enviado com sucesso!</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      Enviamos um link de recuperação para <strong className="text-[var(--text-primary)]">{forgotEmail}</strong>.
                    </p>
                    <div className="pt-1 text-[10px] text-[var(--text-secondary)] opacity-80 space-y-0.5 border-t border-emerald-500/20">
                      <p>💡 Dica: Verifique também a pasta de <strong>Spam / Lixo Eletrônico</strong>.</p>
                      <p>⏱️ O link possui validade temporária por segurança.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={cooldownTimer > 0 || forgotLoading}
                      onClick={handleSendResetPassword}
                      className="w-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] disabled:opacity-50 text-[var(--text-primary)] py-2.5 px-4 rounded-xl font-bold text-xs border border-[var(--border-color)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${forgotLoading ? 'animate-spin' : ''}`} />
                      <span>{cooldownTimer > 0 ? `Reenviar em ${cooldownTimer}s` : 'Reenviar E-mail'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Concluir e Voltar ao Login
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Form View */
                <form onSubmit={handleSendResetPassword} className="space-y-4 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                      E-mail Cadastrado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] opacity-50">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input 
                        type="email" 
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] pl-10 pr-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-xs sm:text-sm placeholder:[var(--text-secondary)] placeholder:opacity-40"
                        placeholder="seuemail@exemplo.com"
                      />
                    </div>
                  </div>

                  {forgotError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="w-1/3 bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] py-2.5 px-3 rounded-xl font-bold text-xs border border-[var(--border-color)] transition-colors cursor-pointer text-center"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={forgotLoading || !forgotEmail}
                      className="w-2/3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {forgotLoading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Enviar Instruções</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clean Footer Branding */}
      <p className="mt-5 text-[11px] font-medium text-[var(--text-secondary)] opacity-50 tracking-wider">
        Nexus Política • Sistema de Inteligência Eleitoral
      </p>
    </div>
  );
}
