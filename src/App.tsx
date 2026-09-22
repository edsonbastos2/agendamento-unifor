import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BookingWizard } from './components/client/BookingWizard';
import { MyBookings } from './components/client/MyBookings';
import { ReceptionDashboard } from './components/reception/ReceptionDashboard';
import { BatchCancelModal } from './components/reception/BatchCancelModal';
import { BarberScheduleView } from './components/barber/BarberScheduleView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { LoginView } from './components/auth/LoginView';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { SystemTimeActorView } from './components/system/SystemTimeActorView';
import { MessagingServiceActorView } from './components/system/MessagingServiceActorView';
import { UserRole } from './types';

function MainApp() {
  const { currentUser, switchRole } = useApp();

  const [activeTab, setActiveTab] = useState<string>('agendar');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'reset' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBatchCancelModal, setShowBatchCancelModal] = useState(false);

  // Sync tab with user role if mismatch occurs, except when deliberately on special screens
  useEffect(() => {
    if (activeTab === 'login' || activeTab === 'ator-tempo' || activeTab === 'ator-notificacao') return;

    if (currentUser.role === 'cliente') {
      if (!['agendar', 'meus-agendamentos'].includes(activeTab)) {
        setActiveTab('agendar');
      }
    } else if (currentUser.role === 'recepcionista') {
      if (!['recepcao', 'recepcao-novo', 'recepcao-lote'].includes(activeTab)) {
        setActiveTab('recepcao');
      }
    } else if (currentUser.role === 'barbeiro') {
      if (activeTab !== 'agenda-barbeiro') {
        setActiveTab('agenda-barbeiro');
      }
    } else if (currentUser.role === 'administrador') {
      if (!['admin-servicos', 'admin-barbeiros', 'admin-recepcao'].includes(activeTab)) {
        setActiveTab('admin-servicos');
      }
    }
  }, [currentUser.role, activeTab]);

  const handleLoginSuccess = (role: UserRole) => {
    if (role === 'cliente') setActiveTab('agendar');
    else if (role === 'recepcionista') setActiveTab('recepcao');
    else if (role === 'barbeiro') setActiveTab('agenda-barbeiro');
    else if (role === 'administrador') setActiveTab('admin-servicos');
  };

  const handleBackToApp = () => {
    if (currentUser.role === 'cliente') setActiveTab('agendar');
    else if (currentUser.role === 'recepcionista') setActiveTab('recepcao');
    else if (currentUser.role === 'barbeiro') setActiveTab('agenda-barbeiro');
    else if (currentUser.role === 'administrador') setActiveTab('admin-servicos');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Dynamic Multi-Actor Header with quick role switching */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={(mode) => setAuthModalMode(mode)}
        onOpenNotifications={() => setShowNotifications(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* DEDICATED LOGIN SCREEN VIEW */}
        {activeTab === 'login' && (
          <LoginView
            onSuccess={handleLoginSuccess}
            onBackToApp={handleBackToApp}
          />
        )}

        {/* SYSTEM ACTOR VIEWS (RF-23 & RF-24) */}
        {activeTab === 'ator-tempo' && <SystemTimeActorView />}
        {activeTab === 'ator-notificacao' && <MessagingServiceActorView />}

        {/* CLIENT ROLE VIEWS */}
        {activeTab !== 'login' && activeTab !== 'ator-tempo' && activeTab !== 'ator-notificacao' && currentUser.role === 'cliente' && (
          <>
            {activeTab === 'agendar' && (
              <BookingWizard
                onBookingComplete={() => setActiveTab('meus-agendamentos')}
              />
            )}
            {activeTab === 'meus-agendamentos' && (
              <MyBookings onNewBookingClick={() => setActiveTab('agendar')} />
            )}
          </>
        )}

        {/* RECEPTIONIST ROLE VIEWS */}
        {activeTab !== 'login' && activeTab !== 'ator-tempo' && activeTab !== 'ator-notificacao' && currentUser.role === 'recepcionista' && (
          <>
            {(activeTab === 'recepcao' || activeTab === 'recepcao-lote') && (
              <ReceptionDashboard
                onNewAppointmentClick={() => setActiveTab('recepcao-novo')}
                onBatchCancelClick={() => setShowBatchCancelModal(true)}
              />
            )}
            {activeTab === 'recepcao-novo' && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setActiveTab('recepcao')}
                    className="text-xs font-semibold text-amber-400 hover:underline"
                  >
                    ← Voltar para o Painel da Recepção
                  </button>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-stone-900 border border-stone-800 text-stone-300 font-medium">
                    Atendimento de Balcão / Telefone
                  </span>
                </div>
                <BookingWizard
                  onBookingComplete={() => setActiveTab('recepcao')}
                />
              </div>
            )}
          </>
        )}

        {/* BARBER ROLE VIEWS */}
        {activeTab !== 'login' && activeTab !== 'ator-tempo' && activeTab !== 'ator-notificacao' && currentUser.role === 'barbeiro' && (
          <BarberScheduleView />
        )}

        {/* ADMINISTRATOR ROLE VIEWS */}
        {activeTab !== 'login' && activeTab !== 'ator-tempo' && activeTab !== 'ator-notificacao' && currentUser.role === 'administrador' && (
          <AdminDashboard
            activeSubTab={
              activeTab === 'admin-barbeiros'
                ? 'barbeiros'
                : activeTab === 'admin-recepcao'
                ? 'recepcao'
                : 'servicos'
            }
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900/60 border-t border-stone-800/80 py-6 px-4 sm:px-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-200">NAVALHA & ARTE</span>
            <span>•</span>
            <span>Sistema de Agendamento em Tempo Real</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('login')}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Tela de Login / Autenticação</span>
            </button>
            <span className="text-stone-700">•</span>
            <button
              onClick={() => setShowNotifications(true)}
              className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>Simulador de Notificações (SMS / E-mail)</span>
            </button>
          </div>

          <div className="text-stone-500 text-[11px]">
            © {new Date().getFullYear()} Navalha & Arte Barbearia. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {authModalMode && (
        <AuthModal
          isOpen={!!authModalMode}
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <BatchCancelModal
        isOpen={showBatchCancelModal}
        onClose={() => setShowBatchCancelModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
