import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Shield,
  Check,
  Clock,
  Calendar,
  Building2,
  HelpCircle
} from 'lucide-react';

interface LoginViewProps {
  onSuccess?: (role: UserRole) => void;
  onBackToApp?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess, onBackToApp }) => {
  const { loginUser, registerUser, resetPassword, services, currentUser, switchRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state (Multi-Role)
  const [selectedRole, setSelectedRole] = useState<UserRole>('cliente');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);

  // Role-specific fields
  const [regShift, setRegShift] = useState('Integral (09h às 19h)');
  const [regBio, setRegBio] = useState('');
  const [regSelectedServiceIds, setRegSelectedServiceIds] = useState<string[]>([]);
  const [regCompanyName, setRegCompanyName] = useState('Navalha & Arte Barbearia Central');
  const [regAdminCode, setRegAdminCode] = useState('ADMIN2026');

  // Reset password state
  const [resetIdentifier, setResetIdentifier] = useState('');

  // UI status
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check caps lock
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-stone-800' };
    if (pass.length < 6) return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    if (pass.length >= 8 && hasLetters && hasNumbers && hasSpecial) {
      return { score: 3, label: 'Forte', color: 'bg-emerald-500' };
    }
    if (pass.length >= 6 && (hasLetters || hasNumbers)) {
      return { score: 2, label: 'Média', color: 'bg-amber-500' };
    }
    return { score: 1, label: 'Fraca', color: 'bg-rose-500' };
  };

  const passwordStrength = getPasswordStrength(regPassword);

  // Demo user profiles for realistic 1-click evaluation
  const demoAccounts = [
    {
      role: 'cliente' as UserRole,
      name: 'Carlos Eduardo Oliveira',
      email: 'carlos.eduardo@email.com',
      roleLabel: 'Cliente',
      icon: UserIcon,
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Agendamento rápido em tempo real, escolha de barbeiro e lembretes por SMS',
      viewHighlights: ['Wizard de Agendamento (4 etapas)', 'Meus Agendamentos (Futuros e Histórico)', 'Cancelamento com motivo']
    },
    {
      role: 'recepcionista' as UserRole,
      name: 'Juliana Mendes',
      email: 'juliana.recepcao@barbearia.com',
      roleLabel: 'Recepcionista',
      icon: Briefcase,
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Operação de balcão, check-in de presença, pagamentos e cancelamentos em lote',
      viewHighlights: ['Quadro de Atendimentos do Dia', 'Check-in e Registro de Pagamento (PIX/Cartão)', 'Cancelamento em Lote com notificação']
    },
    {
      role: 'barbeiro' as UserRole,
      name: 'Rodrigo "Navalha" Silva',
      email: 'rodrigo.barbeiro@barbearia.com',
      roleLabel: 'Barbeiro',
      icon: Scissors,
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: 'Agenda diária própria, ordem cronológica e finalização de atendimentos',
      viewHighlights: ['Agenda e Linha do Tempo', 'Status em Tempo Real (Aguardando/Em Cadeira)', 'Finalizar Atendimento com 1 clique']
    },
    {
      role: 'administrador' as UserRole,
      name: 'Fernando Costa (Proprietário)',
      email: 'admin@barbearia.com',
      roleLabel: 'Administrador',
      icon: Shield,
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: 'Gestão de catálogo de serviços, equipe de barbeiros, jornadas e relatórios',
      viewHighlights: ['Catálogo de Serviços e Preços', 'Gestão de Barbeiros e Tolerâncias', 'Indicadores de Desempenho e No-show']
    }
  ];

  const handleQuickLogin = (email: string) => {
    setIsLoading(true);
    setFeedback(null);
    setTimeout(() => {
      const res = loginUser(email, 'demo123');
      setIsLoading(false);
      if (res.success && res.user) {
        setFeedback({
          type: 'success',
          message: `Autenticado com sucesso como ${res.user.name} (${res.user.role})!`
        });
        if (onSuccess) {
          setTimeout(() => onSuccess(res.user!.role), 600);
        }
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 450);
  };

  const handleFillCredentials = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('••••••••');
    setFeedback({
      type: 'success',
      message: `Credenciais de teste preenchidas para ${email}. Clique em "Entrar no Sistema".`
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!loginEmail.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, digite seu e-mail ou telefone cadastrado.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = loginUser(loginEmail, loginPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        setFeedback({
          type: 'success',
          message: `Bem-vindo de volta, ${res.user.name}! Acessando visão de ${res.user.role}...`
        });
        if (onSuccess) {
          setTimeout(() => onSuccess(res.user!.role), 700);
        }
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'Credenciais inválidas. Verifique seu e-mail ou utilize uma das contas de teste.'
        });
      }
    }, 550);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    if (!regPassword || regPassword.length < 6) {
      setFeedback({ type: 'error', message: 'A senha de acesso deve possuir no mínimo 6 caracteres.' });
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setFeedback({ type: 'error', message: 'A confirmação de senha não confere com a senha digitada.' });
      return;
    }

    if (!regTermsAccepted) {
      setFeedback({ type: 'error', message: 'É necessário concordar com os Termos de Uso e Política de Privacidade.' });
      return;
    }

    if (selectedRole === 'administrador' && regAdminCode.trim() !== 'ADMIN2026') {
      setFeedback({
        type: 'error',
        message: 'Chave de autorização administrativa inválida. Utilize a chave de demonstração "ADMIN2026".'
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = registerUser({
        role: selectedRole,
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        bio: selectedRole === 'barbeiro' ? regBio : undefined,
        serviceIds: selectedRole === 'barbeiro' ? regSelectedServiceIds : undefined,
        shift: selectedRole === 'recepcionista' ? regShift : undefined,
        companyName: selectedRole === 'administrador' ? regCompanyName : undefined,
        adminCode: selectedRole === 'administrador' ? regAdminCode : undefined
      });

      setIsLoading(false);

      if (res.success && res.user) {
        setFeedback({
          type: 'success',
          message: `Conta criada com sucesso! Você agora está conectado como ${res.user.name} (${selectedRole}).`
        });
        if (onSuccess) {
          setTimeout(() => onSuccess(res.user!.role), 800);
        }
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 600);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!resetIdentifier.trim()) {
      setFeedback({ type: 'error', message: 'Informe seu e-mail ou número de telefone celular cadastrado.' });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = resetPassword(resetIdentifier);
      setIsLoading(false);
      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 500);
  };

  const toggleServiceSelection = (serviceId: string) => {
    setRegSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-stone-900/70 border border-stone-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Sistema</span>
          </button>
          <span className="text-stone-700">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-stone-300 font-medium">Portal de Autenticação & Gestão RBAC</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 text-stone-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Conexão Segura SSL 256-Bit</span>
          </div>
          <span className="text-stone-700 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-stone-400">Ambiente de Demonstração e Produção</span>
        </div>
      </div>

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: BRANDING, ARCHITECTURE, & ROLE PREVIEWS (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand Presentation Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Scissors className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-stone-100 font-serif">
                  NAVALHA & ARTE
                </h1>
                <p className="text-xs text-amber-400/90 font-medium tracking-wide">
                  PORTAL UNIFICADO DE AGENDAMENTO & GESTÃO
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed mb-6">
              Plataforma completa de barbearia com quatro perfis especializados. Cada perfil possui
              uma visão sob medida para garantir eficiência máxima desde o agendamento do cliente até
              o balcão, a cadeira do barbeiro e o painel executivo.
            </p>

            {/* Quick Overview of the 4 User Roles */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                As 4 Visões Especializadas do Sistema
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const isCurrentRole = currentUser.role === account.role;
                  return (
                    <div
                      key={account.role}
                      className={`p-3 rounded-xl border text-xs transition-all ${
                        isCurrentRole
                          ? 'bg-amber-500/10 border-amber-500/40 text-stone-100'
                          : 'bg-stone-950/60 border-stone-800/80 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${account.badgeClass}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-stone-200">Visão do {account.roleLabel}</span>
                            {isCurrentRole && (
                              <span className="ml-2 text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-bold">
                                Ativo agora
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            switchRole(account.role);
                            if (onSuccess) onSuccess(account.role);
                          }}
                          className="text-[11px] font-semibold text-amber-400 hover:underline hover:text-amber-300 transition-colors"
                        >
                          Ver Visão →
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-400 leading-normal pl-8">
                        {account.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="mt-6 pt-5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Segurança LGPD & Autenticação
              </span>
              <span>Versão 2.6 Enterprise</span>
            </div>
          </div>

          {/* Quick Access Card for Evaluation */}
          <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-stone-100">Acesso Rápido para Avaliação</h2>
                <p className="text-xs text-stone-400">
                  Clique em um perfil para testar imediatamente ou preencher credenciais
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <div
                  key={acc.email}
                  className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                >
                  <div className="mb-2">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-1.5 ${acc.badgeClass}`}
                    >
                      {acc.roleLabel}
                    </span>
                    <p className="text-xs font-semibold text-stone-200 truncate">{acc.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{acc.email}</p>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t border-stone-900">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(acc.email)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-stone-950 text-[11px] font-bold transition-all text-center"
                      title="Entrar diretamente com este perfil"
                    >
                      Entrar Direto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillCredentials(acc.email)}
                      className="py-1.5 px-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium transition-all"
                      title="Preencher no formulário de login"
                    >
                      Preencher
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE AUTHENTICATION CARD (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            {/* Top Navigation Tabs: Entrar / Criar Conta / Recuperar */}
            <div className="flex border-b border-stone-800 pb-4 mb-6">
              <div className="flex gap-1.5 p-1 bg-stone-950 rounded-2xl border border-stone-800 w-full">
                <button
                  type="button"
                  id="tab-mode-login"
                  onClick={() => {
                    setMode('login');
                    setFeedback(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'login'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Acessar Conta</span>
                </button>

                <button
                  type="button"
                  id="tab-mode-register"
                  onClick={() => {
                    setMode('register');
                    setFeedback(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'register'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Criar Conta (por Perfil)</span>
                </button>

                <button
                  type="button"
                  id="tab-mode-reset"
                  onClick={() => {
                    setMode('reset');
                    setFeedback(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    mode === 'reset'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Recuperar Senha</span>
                  <span className="sm:hidden">Recuperar</span>
                </button>
              </div>
            </div>

            {/* Currently Active User Notification Banner */}
            {currentUser && (
              <div className="mb-5 p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <span className="text-stone-300">
                    Sessão ativa:{' '}
                    <strong className="text-amber-400">{currentUser.name}</strong> ({currentUser.role})
                  </span>
                </div>
                {onBackToApp && (
                  <button
                    onClick={onBackToApp}
                    className="text-amber-400 hover:underline text-xs font-semibold"
                  >
                    Ir para o painel →
                  </button>
                )}
              </div>
            )}

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`mb-6 p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                )}
                <span className="leading-relaxed font-medium">{feedback.message}</span>
              </div>
            )}

            {/* ============================================================ */}
            {/* MODE 1: ENTRAR / LOGIN */}
            {/* ============================================================ */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-100">Entrar na Barbearia</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Digite seu e-mail ou telefone cadastrado para acessar a sua visão do sistema
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-stone-300 block">E-mail ou Telefone / Celular</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-email"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="ex: carlos.eduardo@email.com ou (11) 98765-4321"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-stone-300">Senha de Acesso</label>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-stone-400 hover:text-amber-400 text-[11px] transition-colors"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Digite sua senha de acesso"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {capsLockActive && (
                    <p className="text-[11px] text-amber-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      Aviso: Tecla Caps Lock ativada.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-400 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-900 w-4 h-4"
                    />
                    <span>Lembrar meu acesso neste dispositivo</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-submit-login"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Autenticando credenciais...</span>
                  ) : (
                    <>
                      <span>Entrar no Sistema</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Social Login Options for Maximum Realism */}
                <div className="pt-4 border-t border-stone-800/80 space-y-3">
                  <p className="text-center text-[11px] text-stone-500">Ou entre com login unificado</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('carlos.eduardo@email.com')}
                      className="py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <span className="text-stone-100 font-bold">G</span>
                      <span>Google Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin@barbearia.com')}
                      className="py-2.5 px-3 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>SSO Corporativo</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 text-center border-t border-stone-800/80">
                  <p className="text-xs text-stone-400">
                    Ainda não possui conta?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-bold text-amber-400 hover:underline"
                    >
                      Cadastre-se com seu perfil
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ============================================================ */}
            {/* MODE 2: CRIAR CONTA (PARA CADA PERFIL DE USUÁRIO) */}
            {/* ============================================================ */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-100">Criar Nova Conta no Sistema</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Selecione o perfil desejado para configurar as permissões e a visão correspondente
                  </p>
                </div>

                {/* ROLE SELECTOR CARDS (Cliente, Recepcionista, Barbeiro, Administrador) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300 block">
                    Selecione seu Perfil de Usuário:
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Cliente */}
                    <button
                      type="button"
                      id="role-select-cliente"
                      onClick={() => setSelectedRole('cliente')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'cliente'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-md ring-1 ring-blue-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <UserIcon className="w-4 h-4 text-blue-400" />
                        {selectedRole === 'cliente' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <span className="font-bold text-xs text-stone-200 block">Cliente</span>
                      <span className="text-[10px] text-stone-400 leading-tight mt-0.5">Agendar serviços</span>
                    </button>

                    {/* Recepcionista */}
                    <button
                      type="button"
                      id="role-select-recepcionista"
                      onClick={() => setSelectedRole('recepcionista')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'recepcionista'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Briefcase className="w-4 h-4 text-emerald-400" />
                        {selectedRole === 'recepcionista' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="font-bold text-xs text-stone-200 block">Recepção</span>
                      <span className="text-[10px] text-stone-400 leading-tight mt-0.5">Balcão e caixa</span>
                    </button>

                    {/* Barbeiro */}
                    <button
                      type="button"
                      id="role-select-barbeiro"
                      onClick={() => setSelectedRole('barbeiro')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'barbeiro'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md ring-1 ring-amber-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Scissors className="w-4 h-4 text-amber-400" />
                        {selectedRole === 'barbeiro' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <span className="font-bold text-xs text-stone-200 block">Barbeiro</span>
                      <span className="text-[10px] text-stone-400 leading-tight mt-0.5">Agenda própria</span>
                    </button>

                    {/* Administrador */}
                    <button
                      type="button"
                      id="role-select-administrador"
                      onClick={() => setSelectedRole('administrador')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === 'administrador'
                          ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Shield className="w-4 h-4 text-rose-400" />
                        {selectedRole === 'administrador' && <Check className="w-3.5 h-3.5 text-rose-400" />}
                      </div>
                      <span className="font-bold text-xs text-stone-200 block">Admin</span>
                      <span className="text-[10px] text-stone-400 leading-tight mt-0.5">Gestão total</span>
                    </button>
                  </div>

                  {/* Profile Description Banner */}
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs text-stone-300 flex items-center gap-2.5">
                    {selectedRole === 'cliente' && (
                      <>
                        <UserIcon className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>
                          <strong>Perfil Cliente:</strong> Acesso ao catálogo, escolha de profissional, agendamento interativo e histórico com notificações.
                        </span>
                      </>
                    )}
                    {selectedRole === 'recepcionista' && (
                      <>
                        <Briefcase className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          <strong>Perfil Recepcionista:</strong> Painel de balcão, check-in de chegada, pagamento com cálculo de troco e cancelamento em lote.
                        </span>
                      </>
                    )}
                    {selectedRole === 'barbeiro' && (
                      <>
                        <Scissors className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>Perfil Barbeiro:</strong> Agenda pessoal do dia, horários de atendimento, tempo de pausa e finalização de serviços em 1 clique.
                        </span>
                      </>
                    )}
                    {selectedRole === 'administrador' && (
                      <>
                        <Shield className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>
                          <strong>Perfil Administrador:</strong> Gestão de serviços, jornadas de trabalho, tolerância a atrasos e métricas financeiras.
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* COMMON FIELDS: NOME, EMAIL, TELEFONE */}
                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-stone-300 block">
                    {selectedRole === 'barbeiro' ? 'Nome Completo ou Nome Profissional *' : 'Nome Completo *'}
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reg-name"
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={
                        selectedRole === 'cliente'
                          ? 'ex: Gabriel Santos'
                          : selectedRole === 'barbeiro'
                          ? 'ex: Rodrigo Navalheiro'
                          : selectedRole === 'recepcionista'
                          ? 'ex: Camila Souza'
                          : 'ex: Leonardo Costa'
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-stone-300 block">
                      {selectedRole === 'administrador' || selectedRole === 'recepcionista'
                        ? 'E-mail Corporativo *'
                        : 'E-mail de Contato *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="ex: usuario@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-stone-300 block">Telefone / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-reg-phone"
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="ex: (11) 98765-4321"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ROLE-SPECIFIC FIELDS */}

                {/* 1. SE RECEPCIONISTA: Turno */}
                {selectedRole === 'recepcionista' && (
                  <div className="space-y-1.5 text-xs p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                    <label className="font-semibold text-stone-300 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      Turno de Trabalho na Recepção
                    </label>
                    <select
                      id="input-reg-shift"
                      value={regShift}
                      onChange={(e) => setRegShift(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-emerald-500 outline-none"
                    >
                      <option value="Manhã (08:00 às 14:00)">Manhã (08:00 às 14:00)</option>
                      <option value="Tarde (13:00 às 20:00)">Tarde (13:00 às 20:00)</option>
                      <option value="Integral (09:00 às 19:00)">Integral (09:00 às 19:00)</option>
                      <option value="Sábados / Plantão">Sábados / Plantão</option>
                    </select>
                  </div>
                )}

                {/* 2. SE BARBEIRO: Bio & Serviços que realiza */}
                {selectedRole === 'barbeiro' && (
                  <div className="space-y-3 text-xs p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-300 block">
                        Mini-Bio / Apresentação Profissional
                      </label>
                      <textarea
                        id="input-reg-bio"
                        value={regBio}
                        onChange={(e) => setRegBio(e.target.value)}
                        placeholder="ex: Especialista em degradê na navalha, barba com toalha quente e visagismo há 5 anos."
                        rows={2}
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-amber-500 outline-none resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-300 block flex items-center justify-between">
                        <span>Especialidades / Serviços que realiza:</span>
                        <span className="text-[10px] text-stone-500">Selecione ao menos 1</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                        {services.map((svc) => {
                          const isSelected = regSelectedServiceIds.includes(svc.id);
                          return (
                            <button
                              key={svc.id}
                              type="button"
                              onClick={() => toggleServiceSelection(svc.id)}
                              className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between transition-colors ${
                                isSelected
                                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                              }`}
                            >
                              <span className="truncate">{svc.name}</span>
                              <span className="text-[10px] ml-1 shrink-0">
                                {isSelected ? '✓' : '+'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. SE ADMINISTRADOR: Barbearia & Chave de Autorização */}
                {selectedRole === 'administrador' && (
                  <div className="space-y-3 text-xs p-3.5 rounded-2xl bg-stone-950/60 border border-stone-800">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-stone-300 block flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-rose-400" />
                        Nome da Unidade / Razão Social
                      </label>
                      <input
                        id="input-reg-company"
                        type="text"
                        value={regCompanyName}
                        onChange={(e) => setRegCompanyName(e.target.value)}
                        placeholder="ex: Barbearia Navalha & Arte Matriz"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-rose-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-stone-300 block">
                          Chave Mestre de Autorização Admin *
                        </label>
                        <span className="text-[10px] text-amber-400 font-mono">
                          Dica de teste: ADMIN2026
                        </span>
                      </div>
                      <input
                        id="input-reg-admin-code"
                        type="text"
                        value={regAdminCode}
                        onChange={(e) => setRegAdminCode(e.target.value)}
                        placeholder="Chave de segurança de instalação"
                        className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs focus:border-rose-500 outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* SENHA & CONFIRMAÇÃO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-stone-300 block">Senha de Acesso *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-reg-password"
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {regPassword && (
                      <div className="pt-1 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-stone-800 rounded-full overflow-hidden flex gap-0.5">
                          <div
                            className={`h-full ${passwordStrength.color} ${
                              passwordStrength.score >= 1 ? 'w-1/3' : 'w-0'
                            }`}
                          ></div>
                          <div
                            className={`h-full ${passwordStrength.color} ${
                              passwordStrength.score >= 2 ? 'w-1/3' : 'w-0'
                            }`}
                          ></div>
                          <div
                            className={`h-full ${passwordStrength.color} ${
                              passwordStrength.score >= 3 ? 'w-1/3' : 'w-0'
                            }`}
                          ></div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold">
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-semibold text-stone-300 block">Confirmar Senha *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="input-reg-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repita a mesma senha"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Termos de uso */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-400 select-none">
                    <input
                      type="checkbox"
                      checked={regTermsAccepted}
                      onChange={(e) => setRegTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-500 focus:ring-offset-stone-900 w-4 h-4"
                    />
                    <span>
                      Declaro que li e concordo com os Termos de Uso e Política de Privacidade da Barbearia Navalha & Arte, autorizando o envio de notificações e lembretes operacionais via SMS/E-mail.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-submit-register"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Cadastrando conta de {selectedRole}...</span>
                  ) : (
                    <>
                      <span>Criar Conta de {selectedRole.toUpperCase()}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-4 text-center border-t border-stone-800/80">
                  <p className="text-xs text-stone-400">
                    Já possui acesso?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-amber-400 hover:underline"
                    >
                      Acessar com credenciais
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ============================================================ */}
            {/* MODE 3: RECUPERAR SENHA (RESET PASSWORD) */}
            {/* ============================================================ */}
            {mode === 'reset' && (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-100">Recuperação Segura de Senha</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    O sistema gerará um token de acesso temporário enviado diretamente por SMS ou E-mail
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-stone-300 block">E-mail ou Telefone Cadastrado *</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-reset-identifier"
                      type="text"
                      value={resetIdentifier}
                      onChange={(e) => setResetIdentifier(e.target.value)}
                      placeholder="ex: carlos.eduardo@email.com ou (11) 98765-4321"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800/80 text-xs text-stone-400 space-y-2">
                  <p className="font-semibold text-stone-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    Como funciona o fluxo de redefinição?
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
                    <li>Disparo instantâneo de link com token criptografado para o canal registrado.</li>
                    <li>Você pode inspecionar o disparo em tempo real no Simulador de Notificações.</li>
                    <li>O link permite cadastrar sua nova senha sem expor seus dados anteriores.</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  id="btn-submit-reset"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <span>Processando envio seguro...</span>
                  ) : (
                    <>
                      <span>Enviar Link de Recuperação</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-4 text-center border-t border-stone-800/80">
                  <p className="text-xs text-stone-400">
                    Lembrou da senha?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-amber-400 hover:underline"
                    >
                      Voltar ao login
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
