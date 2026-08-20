import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface SystemLoadingScreenProps {
  message?: string;
  submessage?: string;
  fullscreen?: boolean;
}

const DEFAULT_MESSAGES = [
  'Inicializando ambiente seguro...',
  'Sincronizando dados em tempo real...',
  'Validando credenciais de acesso...',
  'Preparando painel de inteligência...'
];

export const SystemLoadingScreen: React.FC<SystemLoadingScreenProps> = ({
  message,
  submessage,
  fullscreen = true
}) => {
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  useEffect(() => {
    if (message) return; // Se uma mensagem fixa foi passada, não rotaciona
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [message]);

  const activeMessage = message || DEFAULT_MESSAGES[currentMsgIndex];

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden select-none ${
        fullscreen ? 'fixed inset-0 z-50 min-h-screen w-screen bg-[#070a13]' : 'w-full h-full min-h-[400px] bg-[#070a13]'
      }`}
    >
      {/* Dynamic Background Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-blue-600/15 via-indigo-500/10 to-cyan-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Content Box */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Logo Container with Orbit Ring */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-3xl blur-xl opacity-75 animate-pulse" />
          
          {/* Glassmorphic Logo Card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-2xl backdrop-blur-xl flex items-center justify-center p-3 overflow-hidden group"
          >
            {/* Shimmer sweep over logo box */}
            <motion.div
              initial={{ x: '-150%' }}
              animate={{ x: '150%' }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', repeatDelay: 1.5 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />

            <img
              src={logoImg}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fallback) {
                  t.dataset.fallback = 'true';
                  t.src = '/logo.png';
                }
              }}
              alt="Nexus Política"
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* Brand Titles */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5 mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3 h-3 text-blue-400 animate-spin-slow" />
            Nexus Política
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Inteligência & Gestão
          </h1>
        </motion.div>

        {/* Modern Sleek Progress Indicator */}
        <div className="w-full max-w-[240px] mb-6">
          <div className="relative h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            />
          </div>
        </div>

        {/* Dynamic Context Status Message */}
        <div className="h-6 flex items-center justify-center mb-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeMessage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-xs sm:text-sm text-zinc-300 font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping inline-block" />
              {activeMessage}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Security & System Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium tracking-wide"
        >
          <Lock className="w-3 h-3 text-emerald-500/80" />
          <span>Ambiente Seguro • Conexão Criptografada</span>
        </motion.div>
      </div>
    </div>
  );
};
