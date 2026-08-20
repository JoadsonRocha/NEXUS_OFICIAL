import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, KeyRound, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../lib/supabase';
import { showToast } from '../components/GlobalToastHost';
import logoImg from '../assets/logo.png';

export default function ResetPasswordPage(): React.ReactElement {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Configuração do servidor de autenticação não encontrada.');
      setIsReady(true);
      return;
    }

    // Verificar se há parâmetros de erro na URL (ex: link expirado / token inválido do Supabase)
    const hash = window.location.hash || '';
    const search = window.location.search || '';
    const params = new URLSearchParams(hash.replace(/^#/, '') || search);
    const errorCode = params.get('error_code') || params.get('error');
    const errorDescription = params.get('error_description');

    if (errorCode === 'otp_expired' || errorCode === 'access_denied' || errorDescription?.includes('expired')) {
      setTokenExpired(true);
      setError('O link de recuperação expirou ou já foi utilizado. Solicite um novo link.');
      setIsReady(true);
      return;
    }

    // Escuta evento de recuperação de senha ou sessão ativa
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session?.user) {
        setTokenExpired(false);
        setIsReady(true);
      }
    });

    // Validar sessão atual
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        setTokenExpired(true);
        setError('Não foi possível validar a sessão de recuperação.');
      } else if (!session && !hash.includes('access_token=') && !search.includes('code=')) {
        // Se não houver sessão ativa e nenhum token na URL
        setTokenExpired(true);
        setError('Nenhuma sessão de recuperação ativa encontrada. Por favor, solicite um novo link.');
      }
      setIsReady(true);
    }).catch(() => {
      setIsReady(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('A nova senha deve conter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    const supabase = getSupabaseClient();

    if (!supabase) {
      setError('Serviço de autenticação indisponível.');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        if (updateError.message.includes('same_password') || updateError.message.includes('different from the old')) {
          setError('A nova senha deve ser diferente da senha anterior.');
        } else if (updateError.message.includes('session') || updateError.message.includes('Auth session missing')) {
          setTokenExpired(true);
          setError('Sua sessão de recuperação expirou. Por favor, solicite um novo link de redefinição.');
        } else {
          setError(updateError.message || 'Erro ao atualizar a senha.');
        }
      } else {
        setMessage('Sua senha foi redefinida com sucesso!');
        showToast('Senha alterada com sucesso! Redirecionando para o login...', 'success');
        
        // Fazer logout de segurança para limpar tokens temporários e redirecionar
        setTimeout(async () => {
          await supabase.auth.signOut().catch(() => {});
          navigate('/login');
        }, 2200);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
          Validando link de segurança...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center px-4 py-8 sm:px-6 relative overflow-hidden transition-colors duration-300 selection:bg-blue-600 selection:text-white">
      {/* Background Glows */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600"></div>
      <div className="absolute top-1/4 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[420px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-xl shadow-blue-950/5 relative z-20 backdrop-blur-md"
      >
        {/* Header / Logo */}
        <div className="text-center space-y-3 mb-6">
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
              <span>Redefinição de Senha Segura</span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-[var(--text-primary)]">
              {message ? 'Senha Atualizada!' : tokenExpired ? 'Link Expirado' : 'Criar Nova Senha'}
            </h1>
            <p className="text-xs text-[var(--text-secondary)] opacity-80">
              {message 
                ? 'Sua credencial foi alterada com sucesso.' 
                : tokenExpired 
                ? 'Este link de recuperação não é mais válido.' 
                : 'Defina uma nova senha forte para acessar sua conta.'}
            </p>
          </div>
        </div>

        {/* State: Token Expired */}
        {tokenExpired && !message && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 text-xs font-semibold flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <p>{error || 'O link de recuperação expirou ou foi invalidado por motivos de segurança.'}</p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Solicitar Novo Link no Login</span>
            </button>
          </div>
        )}

        {/* State: Success Message */}
        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center py-2"
          >
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-bold text-[var(--text-primary)]">{message}</p>
              <p className="text-xs text-[var(--text-secondary)]">Você será redirecionado para a tela de login em instantes...</p>
            </div>

            <button
              type="button"
              onClick={async () => {
                const s = getSupabaseClient();
                if (s) await s.auth.signOut().catch(() => {});
                navigate('/login');
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ir para o Login Agora</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </motion.div>
        )}

        {/* State: Reset Form */}
        {!message && !tokenExpired && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] opacity-50">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] pl-10 pr-10 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-xs sm:text-sm placeholder:[var(--text-secondary)] placeholder:opacity-40"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-blue-600 transition-colors p-1"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider block">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-secondary)] opacity-50">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-primary)] pl-10 pr-10 py-2.5 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-semibold text-xs sm:text-sm placeholder:[var(--text-secondary)] placeholder:opacity-40"
                  placeholder="Repita a nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-blue-600 transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Password Validation Hints */}
            <div className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl p-3 text-[11px] text-[var(--text-secondary)] space-y-1">
              <p className="font-bold text-[var(--text-primary)] text-[10px] uppercase tracking-wider mb-1">Requisitos de Segurança:</p>
              <div className="flex items-center gap-1.5">
                <span className={password.length >= 8 ? 'text-emerald-500 font-bold' : 'text-zinc-400'}>
                  {password.length >= 8 ? '✓' : '•'}
                </span>
                <span>Pelo menos 8 caracteres</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={password && confirmPassword && password === confirmPassword ? 'text-emerald-500 font-bold' : 'text-zinc-400'}>
                  {password && confirmPassword && password === confirmPassword ? '✓' : '•'}
                </span>
                <span>As duas senhas devem ser idênticas</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-xs font-semibold text-center bg-red-500/10 py-2 px-3 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || password.length < 8 || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white py-2.5 sm:py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Nova Senha</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-5 pt-3.5 border-t border-[var(--border-color)] text-center">
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs text-[var(--text-secondary)] hover:text-blue-600 font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o Login</span>
          </button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <p className="mt-5 text-[11px] font-medium text-[var(--text-secondary)] opacity-50 tracking-wider">
        Nexus Política • Sistema de Inteligência Eleitoral
      </p>
    </div>
  );
}
