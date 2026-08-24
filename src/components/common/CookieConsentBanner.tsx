import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings2, Check, X, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/SupabaseProvider';
import { supabaseService } from '../../lib/supabaseService';

export interface CookiePreferences {
  accepted: boolean;
  essential: boolean;
  preferences: boolean;
  analytics: boolean;
  timestamp: string;
  version: string;
  userAgent?: string;
  userId?: string;
}

const STORAGE_KEY = 'nexus_cookie_consent_v1';
const CURRENT_VERSION = '1.0';

export function getCookieConsent(): CookiePreferences | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Salva as preferências no localStorage e sincroniza com o banco de dados Supabase caso o usuário esteja autenticado.
 */
export async function saveCookieConsent(prefs: Partial<CookiePreferences>, userId?: string) {
  const fullConsent: CookiePreferences = {
    accepted: true,
    essential: true,
    preferences: prefs.preferences ?? true,
    analytics: prefs.analytics ?? true,
    timestamp: new Date().toISOString(),
    version: CURRENT_VERSION,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    userId: userId || undefined,
  };

  // 1. Grava no localStorage para leitura instantânea (0ms)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fullConsent));
  } catch (e) {
    console.warn('Erro ao salvar cookie consent no localStorage:', e);
  }

  window.dispatchEvent(new CustomEvent('nexus_cookie_consent_updated', { detail: fullConsent }));

  // 2. Se houver usuário logado, sincroniza com Supabase para auditoria LGPD
  if (userId) {
    try {
      await supabaseService.setDocument('users', userId, {
        cookieConsent: {
          accepted: fullConsent.accepted,
          essential: fullConsent.essential,
          preferences: fullConsent.preferences,
          analytics: fullConsent.analytics,
          updatedAt: fullConsent.timestamp,
          version: fullConsent.version,
        }
      });
      // Também registra na coleção de auditoria de consentimento
      await supabaseService.setDocument('user_consents', `${userId}_cookie_${Date.now()}`, {
        userId,
        type: 'cookie_consent',
        payload: fullConsent,
        createdAt: Date.now()
      });
    } catch (err) {
      console.warn('Erro ao sincronizar consentimento de cookies no Supabase:', err);
    }
  }

  return fullConsent;
}

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent('open_cookie_preferences'));
}

export function CookieConsentBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  
  // Custom preferences state
  const [prefTema, setPrefTema] = useState<boolean>(true);
  const [prefAnalytics, setPrefAnalytics] = useState<boolean>(true);

  useEffect(() => {
    // 1. Verifica no localStorage primeiro
    const localConsent = getCookieConsent();

    if (localConsent) {
      setPrefTema(localConsent.preferences);
      setPrefAnalytics(localConsent.analytics);
      
      // Se usuário está logado e ainda não sincronizou no Supabase nesta sessão, sincroniza em background
      if (user?.uid && !localConsent.userId) {
        saveCookieConsent(localConsent, user.uid).catch(() => {});
      }
      return;
    }

    // 2. Se não tem no localStorage, verifica se o usuário autenticado já possui consentimento gravado no Supabase
    if (user?.uid) {
      supabaseService.getDocument<any>('users', user.uid).then(profile => {
        if (profile?.cookieConsent?.accepted) {
          const synced: CookiePreferences = {
            accepted: true,
            essential: true,
            preferences: profile.cookieConsent.preferences ?? true,
            analytics: profile.cookieConsent.analytics ?? true,
            timestamp: profile.cookieConsent.updatedAt || new Date().toISOString(),
            version: profile.cookieConsent.version || CURRENT_VERSION,
            userId: user.uid
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
          setPrefTema(synced.preferences);
          setPrefAnalytics(synced.analytics);
          return;
        }
        // Se realmente não tem, exibe com atraso suave
        const timer = setTimeout(() => setIsVisible(true), 900);
        return () => clearTimeout(timer);
      }).catch(() => {
        const timer = setTimeout(() => setIsVisible(true), 900);
        return () => clearTimeout(timer);
      });
    } else {
      // Visitante anônimo
      const timer = setTimeout(() => setIsVisible(true), 900);
      return () => clearTimeout(timer);
    }
  }, [user?.uid]);

  useEffect(() => {
    const handleOpenModal = () => {
      const consent = getCookieConsent();
      if (consent) {
        setPrefTema(consent.preferences);
        setPrefAnalytics(consent.analytics);
      }
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener('open_cookie_preferences', handleOpenModal);
    return () => window.removeEventListener('open_cookie_preferences', handleOpenModal);
  }, []);

  const handleAcceptAll = () => {
    saveCookieConsent({ preferences: true, analytics: true }, user?.uid);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptEssentialOnly = () => {
    saveCookieConsent({ preferences: false, analytics: false }, user?.uid);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    saveCookieConsent({ preferences: prefTema, analytics: prefAnalytics }, user?.uid);
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Consentimento de Cookies"
      className="fixed bottom-3 left-3 right-3 md:left-auto md:right-5 md:bottom-5 md:max-w-md z-9999 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-950/95 backdrop-blur-md border border-white/15 rounded-2xl p-5 shadow-2xl text-slate-100 space-y-4 ring-1 ring-white/10">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <Cookie className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Privacidade & Cookies
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LGPD
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Controle suas preferências de navegação</p>
            </div>
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            title="Fechar temporariamente"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* RESUMO DO TEXTO */}
        <p className="text-xs text-slate-300 leading-relaxed">
          Utilizamos cookies essenciais para garantir login seguro e funcionamento do sistema. Você também pode permitir cookies para salvar temas e otimizar a velocidade de carregamento.
        </p>

        {/* PAINEL DE PREFERÊNCIAS EXPANDÍVEL */}
        {showPreferences && (
          <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
            {/* 1. Essenciais */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Essenciais (Obrigatórios)
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Sempre Ativo
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Necessários para autenticação segura, sessão ativa e proteção contra ataques.
              </p>
            </div>

            {/* 2. Preferências Visuais e Tema */}
            <label className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 block cursor-pointer hover:bg-white/8 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Preferências e Tema</span>
                <input
                  type="checkbox"
                  checked={prefTema}
                  onChange={(e) => setPrefTema(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 bg-slate-800 border-white/20 cursor-pointer accent-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Lembrar modo escuro/claro, filtros selecionados e preferências de visualização.
              </p>
            </label>

            {/* 3. Desempenho e Cache */}
            <label className="p-3 bg-white/5 rounded-xl border border-white/5 space-y-1 block cursor-pointer hover:bg-white/8 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Desempenho & Cache de Dados</span>
                <input
                  type="checkbox"
                  checked={prefAnalytics}
                  onChange={(e) => setPrefAnalytics(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0 bg-slate-800 border-white/20 cursor-pointer accent-blue-500"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Otimização de rotas e cache local de mapas para menor consumo de dados na rua.
              </p>
            </label>
          </div>
        )}

        {/* LINKS E BOTÕES DE AÇÃO */}
        <div className="space-y-2 pt-1">
          {showPreferences ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSaveCustom}
                className="py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Salvar Escolhas
              </button>
              <button
                onClick={handleAcceptAll}
                className="py-2 px-3 bg-white/10 hover:bg-white/15 text-slate-200 font-bold text-xs rounded-xl transition-all border border-white/10 active:scale-95 cursor-pointer"
              >
                Aceitar Todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleAcceptAll}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Aceitar Todos
              </button>

              <button
                onClick={handleAcceptEssentialOnly}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-white/10 active:scale-95 cursor-pointer"
              >
                Apenas Essenciais
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="hover:text-blue-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Settings2 className="w-3 h-3 text-slate-400" />
              {showPreferences ? 'Recolher preferências' : 'Personalizar cookies'}
              {showPreferences ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <Link
              to="/cookies"
              className="hover:text-slate-200 transition-colors flex items-center gap-0.5 underline underline-offset-2"
            >
              Ler política <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>

      </div>
    </aside>
  );
}
