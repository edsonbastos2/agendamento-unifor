import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Scissors,
  Bell,
  User,
  Calendar,
  Clock,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  HelpCircle,
  FileText,
  RotateCcw
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'reset') => void;
  onOpenNotifications: () => void;
  onOpenRequirementsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onOpenNotifications,
  onOpenRequirementsModal
}) => {
  const { currentUser, switchRole, notifications, resetAllData } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels: Record<UserRole, { label: string; badgeColor: string; roleDesc: string }> = {
    cliente: {
      label: 'Cliente',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      roleDesc: 'Agendar, reagendar e cancelar horários'
    },
    recepcionista: {
      label: 'Recepcionista',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      roleDesc: 'Confirmar presença, pagamentos e gerenciar lotes'
    },
    barbeiro: {
      label: 'Barbeiro',
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      roleDesc: 'Agenda do dia e finalização de atendimentos'
    },
    administrador: {
      label: 'Administrador',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      roleDesc: 'Gestão de barbeiros, serviços e jornadas'
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    // Set default tab based on role
    if (newRole === 'cliente') setActiveTab('agendar');
    else if (newRole === 'recepcionista') setActiveTab('recepcao');
    else if (newRole === 'barbeiro') setActiveTab('agenda-barbeiro');
    else if (newRole === 'administrador') setActiveTab('admin-servicos');
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
      {/* Top Banner with Quick Role Testing Bar */}
      <div className="bg-stone-950/80 px-4 py-1.5 border-b border-stone-800/60 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-stone-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-stone-300">Modo de Avaliação Multi-Ator:</span>
          <span className="hidden sm:inline text-stone-400">Alterne instantaneamente entre os 4 atores do caso de uso:</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {(['cliente', 'recepcionista', 'barbeiro', 'administrador'] as UserRole[]).map((role) => {
            const isActive = currentUser.role === role;
            return (
              <button
                key={role}
                id={`btn-role-switch-${role}`}
                onClick={() => handleRoleChange(role)}
                className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                    : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                }`}
                title={`Alternar para visão de ${roleLabels[role].label}`}
              >
                {roleLabels[role].label}
              </button>
            );
          })}

          <button
            id="btn-open-requirements"
            onClick={onOpenRequirementsModal}
            className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700"
            title="Ver Diagrama de Caso de Uso e Requisitos Atendidos"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Requisitos & Diagrama</span>
          </button>

          <button
            id="btn-reset-demo"
            onClick={() => {
              if (confirm('Deseja restaurar os dados de demonstração originais?')) {
                resetAllData();
              }
            }}
            className="p-1 rounded text-stone-500 hover:text-stone-300"
            title="Resetar dados mock"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
              <Scissors className="w-5 h-5 text-stone-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-100">
                  NAVALHA & ARTE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Barbearia
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Agendamento em tempo real & Gestão completa
              </p>
            </div>
          </div>

          {/* Navigation Links based on Role */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-950/50 p-1 rounded-xl border border-stone-800">
            {currentUser.role === 'cliente' && (
              <>
                <button
                  id="tab-client-book"
                  onClick={() => setActiveTab('agendar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'agendar'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Novo Agendamento
                </button>
                <button
                  id="tab-client-my-bookings"
                  onClick={() => setActiveTab('meus-agendamentos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'meus-agendamentos'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Meus Agendamentos
                </button>
              </>
            )}

            {currentUser.role === 'recepcionista' && (
              <>
                <button
                  id="tab-rec-dashboard"
                  onClick={() => setActiveTab('recepcao')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'recepcao'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Painel de Atendimentos
                </button>
                <button
                  id="tab-rec-new-appointment"
                  onClick={() => setActiveTab('recepcao-novo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'recepcao-novo'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Agendar para Cliente
                </button>
                <button
                  id="tab-rec-batch-cancel"
                  onClick={() => setActiveTab('recepcao-lote')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'recepcao-lote'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Cancelamento em Lote
                </button>
              </>
            )}

            {currentUser.role === 'barbeiro' && (
              <>
                <button
                  id="tab-barber-today"
                  onClick={() => setActiveTab('agenda-barbeiro')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'agenda-barbeiro'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Agenda do Dia
                </button>
              </>
            )}

            {currentUser.role === 'administrador' && (
              <>
                <button
                  id="tab-admin-services"
                  onClick={() => setActiveTab('admin-servicos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'admin-servicos'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Serviços
                </button>
                <button
                  id="tab-admin-barbers"
                  onClick={() => setActiveTab('admin-barbeiros')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'admin-barbeiros'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Barbeiros & Jornadas
                </button>
                <button
                  id="tab-admin-reception"
                  onClick={() => setActiveTab('admin-recepcao')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'admin-recepcao'
                      ? 'bg-amber-500 text-stone-950 shadow'
                      : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Recepcionistas
                </button>
              </>
            )}
          </nav>

          {/* Right Actions: Notifications & User Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Bell (RF-19) */}
            <button
              id="btn-notifications-drawer"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition-colors border border-stone-700/60"
              title="Central de Notificações (SMS & E-mail)"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-stone-900 shadow">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>

            {/* Current User Card */}
            <div className="relative">
              <button
                id="btn-user-profile-menu"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 transition-all text-left"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-stone-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-stone-700 flex items-center justify-center text-stone-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden sm:block leading-tight">
                  <p className="text-xs font-semibold text-stone-100 max-w-[120px] truncate">
                    {currentUser.name}
                  </p>
                  <span
                    className={`inline-block text-[10px] px-1.5 py-0.2 rounded border ${roleLabels[currentUser.role].badgeColor}`}
                  >
                    {roleLabels[currentUser.role].label}
                  </span>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 border-b border-stone-800/80">
                    <p className="text-xs text-stone-400">Conectado como</p>
                    <p className="text-sm font-bold text-stone-100 truncate">{currentUser.name}</p>
                    <p className="text-xs text-stone-400 truncate">{currentUser.email}</p>
                    <div className="mt-2">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md border ${roleLabels[currentUser.role].badgeColor}`}
                      >
                        Perfil: {roleLabels[currentUser.role].label}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuthModal('login');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      Entrar com outra conta (RF-03)
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuthModal('register');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Criar nova conta de cliente (RF-01)
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuthModal('reset');
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4 text-stone-400" />
                      Redefinir senha (RF-02)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-800/80 text-xs">
          {currentUser.role === 'cliente' && (
            <>
              <button
                onClick={() => setActiveTab('agendar')}
                className={`py-1 px-3 rounded-lg font-medium ${
                  activeTab === 'agendar' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Agendar
              </button>
              <button
                onClick={() => setActiveTab('meus-agendamentos')}
                className={`py-1 px-3 rounded-lg font-medium ${
                  activeTab === 'meus-agendamentos' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Meus Agendamentos
              </button>
            </>
          )}

          {currentUser.role === 'recepcionista' && (
            <>
              <button
                onClick={() => setActiveTab('recepcao')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'recepcao' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Atendimentos
              </button>
              <button
                onClick={() => setActiveTab('recepcao-novo')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'recepcao-novo' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Novo Agendamento
              </button>
              <button
                onClick={() => setActiveTab('recepcao-lote')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'recepcao-lote' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Lote
              </button>
            </>
          )}

          {currentUser.role === 'barbeiro' && (
            <button
              onClick={() => setActiveTab('agenda-barbeiro')}
              className="py-1 px-3 rounded-lg font-bold text-amber-400"
            >
              Agenda do Dia
            </button>
          )}

          {currentUser.role === 'administrador' && (
            <>
              <button
                onClick={() => setActiveTab('admin-servicos')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'admin-servicos' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Serviços
              </button>
              <button
                onClick={() => setActiveTab('admin-barbeiros')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'admin-barbeiros' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Barbeiros
              </button>
              <button
                onClick={() => setActiveTab('admin-recepcao')}
                className={`py-1 px-2 rounded-lg font-medium ${
                  activeTab === 'admin-recepcao' ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                Recepção
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
