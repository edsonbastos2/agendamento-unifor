import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Lock, Mail, Phone, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'reset';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const { loginUser, registerClient, resetPassword, users } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetIdentifier, setResetIdentifier] = useState('');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = loginUser(email, password);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(onClose, 1000);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = registerClient(name, email, phone, password);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(onClose, 1200);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const res = resetPassword(resetIdentifier);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="font-bold text-lg text-stone-100">
              {mode === 'login' && 'Autenticar Usuário (RF-03)'}
              {mode === 'register' && 'Criar Conta de Cliente (RF-01)'}
              {mode === 'reset' && 'Redefinir Senha (RF-02)'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Acesso seguro e restrito por perfil de usuário
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`my-3.5 p-3 rounded-2xl text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 1. LOGIN (RF-03) */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 my-4 text-xs">
            <div>
              <label className="text-stone-300 font-semibold block mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="auth-input-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-stone-300 font-semibold">Senha</label>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback(null);
                    setMode('reset');
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="auth-input-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="auth-btn-submit-login"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg mt-2"
            >
              Entrar no Sistema
            </button>

            <div className="text-center pt-3 border-t border-stone-800 text-stone-400 text-xs">
              Não tem uma conta ainda?{' '}
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setMode('register');
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                Criar conta de cliente
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER (RF-01) */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 my-4 text-xs">
            <div>
              <label className="text-stone-300 font-semibold block mb-1">Nome Completo *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="reg-input-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome e Sobrenome"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">E-mail *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="reg-input-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">Telefone / Celular *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="reg-input-phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">Senha *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  id="reg-input-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="reg-btn-submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg mt-2"
            >
              Criar Minha Conta (RF-01)
            </button>

            <div className="text-center pt-3 border-t border-stone-800 text-stone-400 text-xs">
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setMode('login');
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* 3. RESET PASSWORD (RF-02) */}
        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-3.5 my-4 text-xs">
            <p className="text-stone-400 text-xs leading-relaxed">
              O sistema enviará um link de recuperação para o e-mail ou telefone cadastrado (RF-02).
            </p>

            <div>
              <label className="text-stone-300 font-semibold block mb-1">
                E-mail ou Telefone Cadastrado *
              </label>
              <input
                type="text"
                id="reset-input-identifier"
                required
                value={resetIdentifier}
                onChange={(e) => setResetIdentifier(e.target.value)}
                placeholder="email@exemplo.com ou (11) 98765-4321"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              id="reset-btn-submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg mt-2"
            >
              Enviar Link de Recuperação (RF-02)
            </button>

            <div className="text-center pt-3 border-t border-stone-800 text-stone-400 text-xs">
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setMode('login');
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                ← Voltar para o login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
