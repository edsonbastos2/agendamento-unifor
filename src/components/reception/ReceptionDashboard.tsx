import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, AppointmentStatus, PaymentMethod } from '../../types';
import { getRelativeDate } from '../../mockData';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Search,
  Filter,
  CreditCard,
  Banknote,
  QrCode,
  Users,
  Timer
} from 'lucide-react';

interface ReceptionDashboardProps {
  onNewAppointmentClick: () => void;
  onBatchCancelClick: () => void;
}

export const ReceptionDashboard: React.FC<ReceptionDashboardProps> = ({
  onNewAppointmentClick,
  onBatchCancelClick
}) => {
  const {
    appointments,
    services,
    barbers,
    confirmAttendance,
    finishService,
    registerPayment,
    cancelAppointment,
    markNoShow,
    rescheduleAppointment,
    getAvailableSlots,
    runToleranceCheck
  } = useApp();

  const [filterDate, setFilterDate] = useState<string>(getRelativeDate(0));
  const [filterBarber, setFilterBarber] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Payment Modal State (RF-15)
  const [paymentModalApt, setPaymentModalApt] = useState<Appointment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Cancel Modal State (RF-10)
  const [cancelModalApt, setCancelModalApt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Reschedule Modal State (RF-13)
  const [rescheduleModalApt, setRescheduleModalApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleBarberId, setRescheduleBarberId] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Tolerance check feedback
  const [toleranceMsg, setToleranceMsg] = useState<string | null>(null);

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (filterDate && apt.date !== filterDate) return false;
    if (filterBarber !== 'all' && apt.barberId !== filterBarber) return false;
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchPhone = apt.clientPhone.includes(q);
      if (!matchName && !matchPhone) return false;
    }
    return true;
  });

  // Daily statistics
  const dayApts = appointments.filter((a) => a.date === filterDate);
  const countAgendado = dayApts.filter((a) => a.status === 'AGENDADO').length;
  const countConfirmado = dayApts.filter((a) => a.status === 'CONFIRMADO').length;
  const countRealizado = dayApts.filter((a) => a.status === 'REALIZADO').length;
  const countPago = dayApts.filter((a) => a.status === 'PAGO').length;
  const countCancelado = dayApts.filter((a) => a.status === 'CANCELADO' || a.status === 'NAO_COMPARECEU').length;

  const handleOpenPayment = (apt: Appointment) => {
    const s = services.find((srv) => srv.id === apt.serviceId);
    setPaymentModalApt(apt);
    setPaymentAmount(s?.price || 0);
    setPaymentMethod('PIX');
  };

  const handleConfirmPayment = () => {
    if (!paymentModalApt) return;
    registerPayment(paymentModalApt.id, paymentMethod, paymentAmount);
    setPaymentModalApt(null);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalApt || !cancelReason.trim()) return;
    cancelAppointment(cancelModalApt.id, cancelReason, 'recepcionista');
    setCancelModalApt(null);
    setCancelReason('');
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleModalApt || !rescheduleSlot || !rescheduleReason.trim()) return;
    rescheduleAppointment(
      rescheduleModalApt.id,
      rescheduleDate,
      rescheduleSlot,
      rescheduleBarberId,
      rescheduleReason
    );
    setRescheduleModalApt(null);
  };

  const handleCheckTolerance = () => {
    const { expiredCount } = runToleranceCheck();
    if (expiredCount > 0) {
      setToleranceMsg(`${expiredCount} agendamento(s) com tolerância expirada foram cancelados e notificados.`);
    } else {
      setToleranceMsg('Nenhum agendamento ultrapassou a tolerância neste momento.');
    }
    setTimeout(() => setToleranceMsg(null), 4000);
  };

  const statusConfig: Record<AppointmentStatus, { label: string; badge: string }> = {
    AGENDADO: { label: 'Agendado', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    CONFIRMADO: { label: 'Presença Confirmada', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    REALIZADO: { label: 'Realizado (Aguardando Pagamento)', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    PAGO: { label: 'Pago', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    CANCELADO: { label: 'Cancelado', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    NAO_COMPARECEU: { label: 'Não Compareceu', badge: 'bg-stone-800 text-stone-400 border-stone-700' }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Painel da Recepção</h2>
          <p className="text-sm text-stone-400 mt-1">
            Gestão operacional dos atendimentos, confirmação de presença, pagamentos e controle do fluxo da barbearia.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-rec-check-tolerance"
            onClick={handleCheckTolerance}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5"
            title="Verificar tolerância de atraso"
          >
            <Timer className="w-4 h-4 text-amber-400" />
            Checar Tolerâncias
          </button>

          <button
            id="btn-rec-batch-cancel-open"
            onClick={onBatchCancelClick}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-all flex items-center gap-1.5"
            title="Cancelar atendimentos em lote"
          >
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Cancelar em Lote
          </button>

          <button
            id="btn-rec-new-appointment-open"
            onClick={onNewAppointmentClick}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg"
          >
            <Users className="w-4 h-4" />
            Novo Agendamento Balcão
          </button>
        </div>
      </div>

      {toleranceMsg && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{toleranceMsg}</span>
        </div>
      )}

      {/* Metrics of Selected Date */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Agendados</span>
          <span className="text-xl font-black text-amber-400">{countAgendado}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Presenças</span>
          <span className="text-xl font-black text-emerald-400">{countConfirmado}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Concluídos</span>
          <span className="text-xl font-black text-sky-400">{countRealizado}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Pagos</span>
          <span className="text-xl font-black text-teal-400">{countPago}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Cancel/Falta</span>
          <span className="text-xl font-black text-rose-400">{countCancelado}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Date quick toggle */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setFilterDate(getRelativeDate(0))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filterDate === getRelativeDate(0) ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setFilterDate(getRelativeDate(1))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                filterDate === getRelativeDate(1) ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
              }`}
            >
              Amanhã
            </button>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-xs text-stone-300 font-semibold px-2 py-1 rounded focus:outline-none"
            />
          </div>

          {/* Barber filter */}
          <select
            id="filter-reception-barber"
            value={filterBarber}
            onChange={(e) => setFilterBarber(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Barbeiros</option>
            {barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="filter-reception-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="all">Todos os Status</option>
            <option value="AGENDADO">AGENDADO</option>
            <option value="CONFIRMADO">CONFIRMADO</option>
            <option value="REALIZADO">REALIZADO</option>
            <option value="PAGO">PAGO</option>
            <option value="CANCELADO">CANCELADO</option>
            <option value="NAO_COMPARECEU">NAO_COMPARECEU</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="search-reception-client"
            placeholder="Buscar por cliente ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Appointments List / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-12 text-center">
          <Calendar className="w-10 h-10 text-stone-600 mx-auto mb-2" />
          <p className="text-stone-300 font-semibold text-sm">Nenhum atendimento encontrado para os filtros selecionados.</p>
          <p className="text-xs text-stone-500 mt-1">Alterne a data ou limpe os filtros de busca.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const service = services.find((s) => s.id === apt.serviceId);
            const barber = barbers.find((b) => b.id === apt.barberId);
            const st = statusConfig[apt.status] || statusConfig.AGENDADO;

            return (
              <div
                key={apt.id}
                id={`reception-row-${apt.id}`}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-4 hover:border-stone-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center justify-center font-bold shrink-0">
                    <span className="text-xs text-amber-400">{apt.startTime}</span>
                    <span className="text-[10px] text-stone-500">{apt.endTime}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${st.badge}`}>
                        {st.label}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">Barbeiro: {barber?.name}</span>
                    </div>

                    <h4 className="font-bold text-sm sm:text-base text-stone-100">{apt.clientName}</h4>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-3">
                      <span>Tel: {apt.clientPhone}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-medium">
                        {service?.name} (R$ {service?.price.toFixed(2)})
                      </span>
                    </p>

                    {apt.cancellationReason && (
                      <p className="text-[11px] text-rose-400 mt-1.5">
                        <strong>Motivo cancelamento:</strong> {apt.cancellationReason}
                      </p>
                    )}
                    {apt.paidAt && (
                      <p className="text-[11px] text-teal-400 mt-1.5 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pago via {apt.paymentMethod} (R$ {apt.paymentAmount?.toFixed(2)})
                      </p>
                    )}
                  </div>
                </div>

                {/* Status Action Buttons for Receptionist */}
                <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-800 shrink-0">
                  {apt.status === 'AGENDADO' && (
                    <button
                      id={`btn-confirm-attendance-${apt.id}`}
                      onClick={() => confirmAttendance(apt.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1"
                      title="Confirmar que o cliente chegou à barbearia"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmar Presença
                    </button>
                  )}

                  {apt.status === 'REALIZADO' && (
                    <button
                      id={`btn-register-payment-${apt.id}`}
                      onClick={() => handleOpenPayment(apt)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md"
                      title="Registrar recebimento de pagamento"
                    >
                      <DollarSign className="w-4 h-4" />
                      Registrar Pagamento
                    </button>
                  )}

                  {apt.status === 'AGENDADO' && (
                    <button
                      id={`btn-mark-no-show-${apt.id}`}
                      onClick={() => markNoShow(apt.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs font-medium transition-all"
                      title="Cliente não compareceu após tolerância"
                    >
                      Não Compareceu
                    </button>
                  )}

                  {['AGENDADO', 'CONFIRMADO'].includes(apt.status) && (
                    <button
                      id={`btn-rec-reschedule-${apt.id}`}
                      onClick={() => {
                        setRescheduleModalApt(apt);
                        setRescheduleDate(apt.date);
                        setRescheduleBarberId(apt.barberId);
                        setRescheduleSlot('');
                        setRescheduleReason('');
                      }}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                      title="Reagendar horário"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  )}

                  {['AGENDADO', 'CONFIRMADO'].includes(apt.status) && (
                    <button
                      id={`btn-rec-cancel-${apt.id}`}
                      onClick={() => {
                        setCancelModalApt(apt);
                        setCancelReason('');
                      }}
                      className="p-2 rounded-xl bg-stone-800 hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 text-xs"
                      title="Cancelar atendimento"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-teal-400 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-100">Registrar Pagamento</h3>
            </div>

            <p className="text-xs text-stone-400">
              O barbeiro concluiu o atendimento. Registre a forma de pagamento informada pelo cliente.
            </p>

            <div className="my-4 p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1.5 text-xs">
              <p>
                <strong className="text-stone-400">Cliente:</strong> {paymentModalApt.clientName}
              </p>
              <p>
                <strong className="text-stone-400">Serviço Realizado:</strong>{' '}
                {services.find((s) => s.id === paymentModalApt.serviceId)?.name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Forma de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'PIX', label: 'PIX', icon: QrCode },
                    { id: 'DINHEIRO', label: 'Dinheiro', icon: Banknote },
                    { id: 'CARTAO_CREDITO', label: 'Cartão Crédito', icon: CreditCard },
                    { id: 'CARTAO_DEBITO', label: 'Cartão Débito', icon: CreditCard }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSel = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        id={`payment-method-${m.id}`}
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                          isSel
                            ? 'bg-teal-500/20 text-teal-300 border-teal-500'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Valor Pago (R$)
                </label>
                <input
                  type="number"
                  step="0.50"
                  id="input-payment-amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 font-bold text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                onClick={() => setPaymentModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                id="btn-confirm-payment-final"
                onClick={handleConfirmPayment}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 text-xs font-extrabold transition-all"
              >
                Confirmar Pagamento e Finalizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL MODAL FOR RECEPTIONIST */}
      {cancelModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <XCircle className="w-6 h-6" />
              <h3 className="font-bold text-lg text-stone-100">Cancelar Agendamento</h3>
            </div>
            <p className="text-xs text-stone-400">
              Informe o motivo do cancelamento para registrar no histórico e liberar o horário na agenda do barbeiro.
            </p>
            <div className="my-3 space-y-1">
              <textarea
                id="input-reception-cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Motivo (ex: Cliente solicitou cancelamento por telefone)"
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2.5 mt-4">
              <button
                onClick={() => setCancelModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 text-xs"
              >
                Voltar
              </button>
              <button
                id="btn-reception-confirm-cancel"
                disabled={!cancelReason.trim()}
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL FOR RECEPTIONIST */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="font-bold text-lg text-stone-100">Reagendar Atendimento</h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">Nova Data</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => {
                    setRescheduleDate(e.target.value);
                    setRescheduleSlot('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Barbeiro</label>
                <select
                  value={rescheduleBarberId}
                  onChange={(e) => {
                    setRescheduleBarberId(e.target.value);
                    setRescheduleSlot('');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                >
                  {barbers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Novo Horário Disponível</label>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                  {getAvailableSlots(rescheduleDate, rescheduleModalApt.serviceId, rescheduleBarberId).map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setRescheduleSlot(slot.time)}
                      className={`p-2 rounded-lg text-xs font-bold border ${
                        rescheduleSlot === slot.time
                          ? 'bg-amber-500 text-stone-950 border-amber-500'
                          : 'bg-stone-950 border-stone-800 text-stone-300'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Motivo do Reagendamento *</label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="Ex: Cliente pediu mudança de turno"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                onClick={() => setRescheduleModalApt(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 text-xs"
              >
                Voltar
              </button>
              <button
                disabled={!rescheduleSlot || !rescheduleReason.trim()}
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 text-xs font-bold"
              >
                Confirmar Reagendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
