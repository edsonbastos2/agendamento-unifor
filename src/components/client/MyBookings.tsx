import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Calendar,
  Clock,
  User,
  Scissors,
  AlertCircle,
  XCircle,
  RotateCcw,
  CheckCircle2,
  CalendarPlus,
  DollarSign,
  HelpCircle
} from 'lucide-react';

interface MyBookingsProps {
  onNewBookingClick: () => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ onNewBookingClick }) => {
  const {
    currentUser,
    appointments,
    services,
    barbers,
    cancelAppointment,
    rescheduleAppointment,
    getAvailableSlots
  } = useApp();

  // Filter appointments for current user or all if staff testing client view
  const userAppointments = appointments.filter(
    (apt) => apt.clientId === currentUser.id || apt.clientEmail === currentUser.email
  );

  const [activeFilter, setActiveFilter] = useState<'ativos' | 'historico'>('ativos');

  // Cancel modal state (RF-10)
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Reschedule modal state (RF-13)
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('');
  const [rescheduleBarberId, setRescheduleBarberId] = useState<string>('');
  const [rescheduleReason, setRescheduleReason] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  const activeApts = userAppointments.filter(
    (apt) => apt.status === 'AGENDADO' || apt.status === 'CONFIRMADO'
  );
  const historyApts = userAppointments.filter(
    (apt) => !['AGENDADO', 'CONFIRMADO'].includes(apt.status)
  );

  const displayList = activeFilter === 'ativos' ? activeApts : historyApts;

  const statusBadges: Record<AppointmentStatus, { label: string; bg: string; text: string; border: string }> = {
    AGENDADO: {
      label: 'Agendado',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30'
    },
    CONFIRMADO: {
      label: 'Presença Confirmada',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
    REALIZADO: {
      label: 'Atendimento Concluído',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30'
    },
    PAGO: {
      label: 'Pago',
      bg: 'bg-teal-500/10',
      text: 'text-teal-400',
      border: 'border-teal-500/30'
    },
    CANCELADO: {
      label: 'Cancelado',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30'
    }
  };

  const handleOpenCancelModal = (apt: Appointment) => {
    setCancelModalApt(apt);
    setCancelReason('');
    setCancelError(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalApt) return;
    if (!cancelReason.trim()) {
      setCancelError('Por favor, informe o motivo do cancelamento.');
      return;
    }

    const res = cancelAppointment(cancelModalApt.id, cancelReason, 'cliente');
    if (res.success) {
      setCancelModalApt(null);
    } else {
      setCancelError(res.message);
    }
  };

  const handleOpenRescheduleModal = (apt: Appointment) => {
    setRescheduleModalApt(apt);
    setRescheduleDate(apt.date);
    setRescheduleBarberId(apt.barberId);
    setRescheduleSlot('');
    setRescheduleReason('');
    setRescheduleError(null);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalApt) return;
    if (!rescheduleReason.trim()) {
      setRescheduleError('Por favor, informe o motivo do reagendamento.');
      return;
    }
    if (!rescheduleSlot) {
      setRescheduleError('Selecione um horário disponível para reagendar.');
      return;
    }

    const res = rescheduleAppointment(
      rescheduleModalApt.id,
      rescheduleDate,
      rescheduleSlot,
      rescheduleBarberId,
      rescheduleReason
    );

    if (res.success) {
      setRescheduleModalApt(null);
    } else {
      setRescheduleError(res.message);
    }
  };

  // Available slots for the reschedule modal
  const rescheduleSlots = rescheduleModalApt && rescheduleDate
    ? getAvailableSlots(rescheduleDate, rescheduleModalApt.serviceId, rescheduleBarberId)
    : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Meus Agendamentos</h2>
          <p className="text-sm text-stone-400 mt-1">
            Consulte seu histórico completo, cancele ou reagende seus horários em tempo real.
          </p>
        </div>

        <button
          id="btn-new-booking-cta"
          onClick={onNewBookingClick}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shrink-0"
        >
          <CalendarPlus className="w-4 h-4" />
          Novo Agendamento
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
        <button
          id="tab-bookings-active"
          onClick={() => setActiveFilter('ativos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'ativos'
              ? 'bg-stone-800 text-amber-400 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Próximos / Ativos
          <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-[10px] text-stone-300">
            {activeApts.length}
          </span>
        </button>

        <button
          id="tab-bookings-history"
          onClick={() => setActiveFilter('historico')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeFilter === 'historico'
              ? 'bg-stone-800 text-amber-400 border border-amber-500/40'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Histórico / Concluídos
          <span className="px-1.5 py-0.5 rounded-md bg-stone-900 text-[10px] text-stone-300">
            {historyApts.length}
          </span>
        </button>
      </div>

      {/* Appointment Cards List */}
      {displayList.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center">
          <Calendar className="w-12 h-12 text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-300">
            {activeFilter === 'ativos' ? 'Nenhum agendamento ativo no momento' : 'Nenhum histórico encontrado'}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {activeFilter === 'ativos'
              ? 'Você não possui nenhum horário marcado. Que tal agendar um corte agora mesmo?'
              : 'Seus atendimentos concluídos e cancelamentos anteriores aparecerão aqui.'}
          </p>
          {activeFilter === 'ativos' && (
            <button
              onClick={onNewBookingClick}
              className="mt-5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
            >
              Agendar Primeiro Serviço
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((apt) => {
            const service = services.find((s) => s.id === apt.serviceId);
            const barber = barbers.find((b) => b.id === apt.barberId);
            const badge = statusBadges[apt.status] || statusBadges.AGENDADO;
            const canModify = apt.status === 'AGENDADO' || apt.status === 'CONFIRMADO';

            return (
              <div
                key={apt.id}
                id={`appointment-card-${apt.id}`}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {barber?.avatar ? (
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-400 shrink-0">
                      <Scissors className="w-6 h-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs text-stone-500">ID: {apt.id}</span>
                    </div>

                    <h3 className="font-bold text-base text-stone-100">{service?.name || 'Serviço Barbearia'}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Profissional: <strong className="text-stone-200">{barber?.name || 'Barbeiro'}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-stone-300">
                      <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {apt.startTime} - {apt.endTime}
                      </span>
                      <span className="text-stone-400">
                        R$ {service?.price ? service.price.toFixed(2) : '0,00'}
                      </span>
                    </div>

                    {/* Reason details if cancelled or rescheduled */}
                    {apt.cancellationReason && (
                      <p className="text-[11px] text-rose-400 mt-2 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        <strong>Motivo do cancelamento:</strong> {apt.cancellationReason}
                      </p>
                    )}
                    {apt.rescheduleReason && (
                      <p className="text-[11px] text-amber-400 mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                        <strong>Motivo do reagendamento:</strong> {apt.rescheduleReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions for Client */}
                {canModify && (
                  <div className="flex items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800 shrink-0">
                    <button
                      id={`btn-reschedule-${apt.id}`}
                      onClick={() => handleOpenRescheduleModal(apt)}
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5"
                      title="Reagendar horário"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      Reagendar
                    </button>

                    <button
                      id={`btn-cancel-${apt.id}`}
                      onClick={() => handleOpenCancelModal(apt)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition-all flex items-center gap-1.5"
                      title="Cancelar agendamento"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CANCELAR AGENDAMENTO */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-100">Cancelar Agendamento</h3>
            </div>

            <p className="text-xs text-stone-400">
              Conforme as regras do sistema, é obrigatório informar o motivo do cancelamento para liberar o horário na agenda.
            </p>

            <div className="my-4 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
              <p>
                <strong className="text-stone-300">Data e Horário:</strong> {cancelModalApt.date} às {cancelModalApt.startTime}
              </p>
            </div>

            {cancelError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 mb-3">
                {cancelError}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-300">
                Motivo do Cancelamento <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="input-cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ex: Tive um imprevisto de trabalho / compromisso inadiável"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium"
              >
                Manter Agendamento
              </button>
              <button
                id="btn-confirm-cancel"
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL REAGENDAR */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-100">Reagendar Atendimento</h3>
            </div>

            <p className="text-xs text-stone-400">
              Escolha a nova data e horário disponível em tempo real e informe o motivo do reagendamento.
            </p>

            {rescheduleError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 my-3">
                {rescheduleError}
              </p>
            )}

            <div className="space-y-4 my-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Nova Data</label>
                <input
                  type="date"
                  id="input-reschedule-date"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleSlot('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">Profissional</label>
                <select
                  id="select-reschedule-barber"
                  value={rescheduleBarberId}
                  onChange={(e) => {
                    setRescheduleBarberId(e.target.value);
                    setRescheduleSlot('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Horários Disponíveis em Tempo Real ({rescheduleSlots.length})
                </label>
                {rescheduleSlots.length === 0 ? (
                  <p className="text-xs text-stone-500 italic p-3 bg-stone-950 rounded-xl">
                    Nenhum horário disponível para esta data e profissional. Selecione outro dia.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                    {rescheduleSlots.map((slot) => {
                      const isSel = rescheduleSlot === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          id={`btn-reschedule-slot-${slot.time}`}
                          onClick={() => setRescheduleSlot(slot.time)}
                          className={`p-2 rounded-lg text-xs font-bold border transition-all ${
                            isSel
                              ? 'bg-amber-500 text-stone-950 border-amber-500'
                              : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-amber-500/40'
                          }`}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Motivo do Reagendamento <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  id="input-reschedule-reason"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Ex: Conflito de agenda no trabalho"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setRescheduleModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-reschedule"
                disabled={!rescheduleSlot || !rescheduleReason.trim()}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-xs font-bold transition-all"
              >
                Salvar Novo Horário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
