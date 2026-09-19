import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  Lock,
  Mail,
  Phone,
  X,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Scissors,
  Shield,
  Check
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'reset';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const { loginUser, registerUser, resetPassword } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('cliente');
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
    const res = registerUser({
      role: selectedRole,
      name,
      email,
      phone,
      password
    });
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
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="font-bold text-lg text-stone-100">
              {mode === 'login' && 'Autenticar Usuário'}
              {mode === 'register' && `Criar Conta: ${selectedRole.toUpperCase()}`}
              {mode === 'reset' && 'Redefinir Senha'}
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
              <label className="text-stone-300 font-semibold block mb-1">E-mail ou Celular</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="auth-input-email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: cliente@email.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-stone-300 font-semibold">Senha</label>
                <button
                  type="button"
                  onClick={() => {
                    setFeedback(null);
                    setMode('reset');
                  }}
                  className="text-stone-400 hover:text-amber-400 text-[11px]"
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
                Criar conta (por perfil)
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER (Por Perfil de Usuário) */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 my-4 text-xs">
            {/* Role selector */}
            <div>
              <label className="text-stone-300 font-semibold block mb-1.5">
                Escolha o Perfil de Conta:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedRole('cliente')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedRole === 'cliente'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <User className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block">Cliente</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('recepcionista')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedRole === 'recepcionista'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block">Recepção</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('barbeiro')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedRole === 'barbeiro'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block">Barbeiro</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('administrador')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedRole === 'administrador'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 mx-auto mb-1" />
                  <span className="text-[10px] font-bold block">Admin</span>
                </button>
              </div>
            </div>

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
              <label className="text-stone-300 font-semibold block mb-1">Telefone / WhatsApp *</label>
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
                  placeholder="Mínimo de 6 dígitos"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="reg-btn-submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg mt-2"
            >
              Criar Conta de {selectedRole.toUpperCase()}
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
            <div>
              <label className="text-stone-300 font-semibold block mb-1">
                E-mail ou Celular Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="reset-input-identifier"
                  required
                  value={resetIdentifier}
                  onChange={(e) => setResetIdentifier(e.target.value)}
                  placeholder="ex: cliente@email.com ou (11) 98765-4321"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 text-[11px] leading-relaxed">
              O sistema despachará um link seguro temporário para seu número ou e-mail cadastrado
              para recuperação imediata de senha.
            </div>

            <button
              type="submit"
              id="reset-btn-submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg mt-2"
            >
              Enviar Link de Redefinição
            </button>

            <div className="text-center pt-3 border-t border-stone-800 text-stone-400 text-xs">
              Lembrou sua senha?{' '}
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setMode('login');
                }}
                className="text-amber-400 font-bold hover:underline"
              >
                Voltar para o Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
