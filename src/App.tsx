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
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { RequirementsMatrixModal } from './components/common/RequirementsMatrixModal';
import { UserRole } from './types';

function MainApp() {
  const { currentUser, switchRole } = useApp();

  const [activeTab, setActiveTab] = useState<string>('agendar');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'reset' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequirementsModal, setShowRequirementsModal] = useState(false);
  const [showBatchCancelModal, setShowBatchCancelModal] = useState(false);

  // Sync tab with user role if mismatch occurs
  useEffect(() => {
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
  }, [currentUser.role]);

  const handleSwitchRoleAndTab = (role: UserRole, tab: string) => {
    switchRole(role);
    setActiveTab(tab);
    if (tab === 'recepcao-lote') {
      setShowBatchCancelModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Dynamic Multi-Actor Header with quick role switching */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={(mode) => setAuthModalMode(mode)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenRequirementsModal={() => setShowRequirementsModal(true)}
      />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* CLIENT ROLE VIEWS */}
        {currentUser.role === 'cliente' && (
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
        {currentUser.role === 'recepcionista' && (
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
        {currentUser.role === 'barbeiro' && (
          <BarberScheduleView />
        )}

        {/* ADMINISTRATOR ROLE VIEWS */}
        {currentUser.role === 'administrador' && (
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
              onClick={() => setShowRequirementsModal(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              Ver Casos de Uso & Requisitos (IEEE 830)
            </button>
            <span>•</span>
            <button
              onClick={() => setShowNotifications(true)}
              className="text-stone-300 hover:text-stone-100"
            >
              Simulador SMS/E-mail (RF-19)
            </button>
          </div>

          <div className="text-stone-400 text-[11px]">
            Conformidade total com requisitos funcionais RF-01 a RF-19
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

      <RequirementsMatrixModal
        isOpen={showRequirementsModal}
        onClose={() => setShowRequirementsModal(false)}
        onSwitchRoleAndTab={handleSwitchRoleAndTab}
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
