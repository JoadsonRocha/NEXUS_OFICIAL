import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ResetPasswordPage(): JSX.Element {
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const handleRecovery = async () => {
      await supabase.auth.getSession();
      setIsReady(true);
    };

    handleRecovery();
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Senha alterada com sucesso!');
    }

    setLoading(false);
  };

  if (!isReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f8', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2>Redefinir Senha</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Digite sua nova senha abaixo.</p>
        
        {!message ? (
          <form onSubmit={handleResetPassword}>
            <input 
              type="password" 
              placeholder="Nova senha" 
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ color: 'green', marginTop: '15px', fontSize: '15px', fontWeight: 'bold' }}>{message}</p>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Ir para a Página de Login
            </button>
          </div>
        )}

        {error && <p style={{ color: 'red', marginTop: '15px', fontSize: '14px' }}>{error}</p>}
      </div>
    </div>
  );
}
