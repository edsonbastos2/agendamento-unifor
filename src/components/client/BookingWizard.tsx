import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../mockData';
import {
  Scissors,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';

interface BookingWizardProps {
  onSuccess?: () => void;
  onBookingComplete?: () => void;
  preselectedServiceId?: string;
  isStaffBooking?: boolean;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  onSuccess,
  onBookingComplete,
  preselectedServiceId,
  isStaffBooking = false
}) => {
  const handleCompleteCallback = () => {
    if (onBookingComplete) onBookingComplete();
    if (onSuccess) onSuccess();
  };
  const { services, barbers, getAvailableSlots, createAppointment, currentUser } = useApp();

  // Wizard state (Steps 1 to 4 - RNF-06)
  const [step, setStep] = useState<number>(preselectedServiceId ? 2 : 1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (services[0]?.id ?? '')
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(0));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ time: string; barberId: string; barberName: string } | null>(null);

  // Client info for Staff booking or guest
  const [clientName, setClientName] = useState(currentUser.role === 'cliente' ? currentUser.name : '');
  const [clientPhone, setClientPhone] = useState(currentUser.role === 'cliente' ? currentUser.phone : '');
  const [clientEmail, setClientEmail] = useState(currentUser.role === 'cliente' ? currentUser.email : '');

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const eligibleBarbers = barbers.filter((b) => selectedService?.barberIds.includes(b.id));

  // 14 next days for date picker
  const upcomingDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('pt-BR', { month: 'short' });
      dates.push({ iso, weekday, dayNum, month, isToday: i === 0 });
    }
    return dates;
  }, []);

  // Compute available slots in real-time (RF-05, RNF-01, RNF-02, RNF-08)
  const availableSlots = useMemo(() => {
    if (!selectedServiceId || !selectedDate) return [];
    const barberFilter = selectedBarberId === 'any' ? undefined : selectedBarberId;
    return getAvailableSlots(selectedDate, selectedServiceId, barberFilter);
  }, [selectedDate, selectedServiceId, selectedBarberId, getAvailableSlots]);

  const handleConfirm = () => {
    if (!selectedTimeSlot || !selectedService) return;

    setErrorMessage(null);

    const result = createAppointment({
      serviceId: selectedService.id,
      barberId: selectedTimeSlot.barberId,
      date: selectedDate,
      startTime: selectedTimeSlot.time,
      clientId: currentUser.role === 'cliente' ? currentUser.id : undefined,
      clientName: clientName.trim() || currentUser.name,
      clientPhone: clientPhone.trim() || currentUser.phone,
      clientEmail: clientEmail.trim() || currentUser.email
    });

    if (result.success) {
      setBookingSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 1800);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  const resetWizard = () => {
    setBookingSuccess(false);
    setStep(1);
    setSelectedTimeSlot(null);
    setErrorMessage(null);
  };

  if (bookingSuccess) {
    return (
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-stone-100">Agendamento Realizado!</h3>
        <p className="text-sm text-stone-400 mt-2">
          Seu horário foi reservado em tempo real e confirmado no sistema.
        </p>

        <div className="mt-6 bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left space-y-2 text-sm">
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-400">Serviço:</span>
            <span className="font-semibold text-stone-100">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-400">Barbeiro:</span>
            <span className="font-semibold text-stone-100">{selectedTimeSlot?.barberName}</span>
          </div>
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-400">Data & Horário:</span>
            <span className="font-semibold text-amber-400">
              {selectedDate} às {selectedTimeSlot?.time}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Valor Estimado:</span>
            <span className="font-bold text-stone-100">R$ {selectedService?.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            id="btn-go-to-bookings"
            onClick={handleCompleteCallback}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-md"
          >
            Ver Agendamentos
          </button>
          <button
            id="btn-new-booking-again"
            onClick={resetWizard}
            className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-medium text-sm transition-all"
          >
            Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator (RNF-06: 4 Steps) */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-800 -z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {[
            { num: 1, label: 'Serviço' },
            { num: 2, label: 'Profissional' },
            { num: 3, label: 'Data & Hora' },
            { num: 4, label: 'Confirmação' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center z-10">
              <button
                id={`wizard-step-indicator-${s.num}`}
                onClick={() => {
                  if (s.num < step) setStep(s.num);
                }}
                disabled={s.num > step}
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num
                    ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 shadow-lg'
                    : step > s.num
                    ? 'bg-emerald-500 text-stone-950'
                    : 'bg-stone-800 text-stone-500 border border-stone-700'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </button>
              <span
                className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${
                  step === s.num ? 'text-amber-400 font-bold' : 'text-stone-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Selecionar Serviço (RF-05) */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Selecione o Serviço Desejado</h2>
            <p className="text-sm text-stone-400 mt-1">
              Escolha o tratamento que deseja realizar. Todos os valores e durações são informados com transparência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700 hover:bg-stone-850'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-stone-100">{service.name}</h3>
                      <span className="px-2.5 py-1 rounded-lg bg-stone-800 font-extrabold text-amber-400 text-sm whitespace-nowrap border border-stone-700">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Estimativa: {service.durationMinutes} minutos
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-amber-400' : 'text-stone-500'
                      }`}
                    >
                      {isSelected ? '✓ Selecionado' : 'Selecionar'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              id="btn-step1-next"
              disabled={!selectedServiceId}
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
            >
              Continuar para Barbeiro
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Escolher Barbeiro (RF-05) */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar para Serviços
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Escolha o Profissional</h2>
            <p className="text-sm text-stone-400 mt-1">
              Serviço selecionado: <strong className="text-amber-400">{selectedService?.name}</strong> ({selectedService?.durationMinutes} min - R$ {selectedService?.price.toFixed(2)})
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Any barber option */}
            <div
              id="barber-card-any"
              onClick={() => setSelectedBarberId('any')}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedBarberId === 'any'
                  ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                  : 'bg-stone-900 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-100">Qualquer Profissional</h3>
                  <p className="text-[11px] text-stone-400">Maior disponibilidade de horários</p>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-4 leading-relaxed">
                Recomendado para quem precisa de atendimento rápido no primeiro horário disponível.
              </p>
            </div>

            {/* Individual barbers apt for this service */}
            {eligibleBarbers.map((barber) => {
              const isSelected = selectedBarberId === barber.id;
              return (
                <div
                  key={barber.id}
                  id={`barber-card-${barber.id}`}
                  onClick={() => setSelectedBarberId(barber.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {barber.avatar ? (
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-stone-400 font-bold">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-sm text-stone-100">{barber.name}</h3>
                      <span className="text-[11px] text-emerald-400 font-medium">Disponível</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 mt-3 line-clamp-3 leading-relaxed">
                    {barber.bio || 'Barbeiro especialista pronto para lhe atender com excelência.'}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-medium transition-all"
            >
              Voltar
            </button>
            <button
              id="btn-step2-next"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
            >
              Ver Horários Disponíveis
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Data & Horários em Tempo Real (RF-05, RNF-01, RNF-02, RNF-08) */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar para Barbeiros
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Escolha a Data e o Horário</h2>
            <p className="text-sm text-stone-400 mt-1">
              Consulta de disponibilidade em tempo real. Horários já ocupados são ocultados automaticamente para evitar conflitos (RNF-08).
            </p>
          </div>

          {/* Date Selector (Horizontal slider) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Selecione o Dia
            </label>
            <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {upcomingDates.map((item) => {
                const isSelected = selectedDate === item.iso;
                return (
                  <button
                    key={item.iso}
                    id={`date-btn-${item.iso}`}
                    onClick={() => {
                      setSelectedDate(item.iso);
                      setSelectedTimeSlot(null); // reset selected slot on date change
                    }}
                    className={`shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-lg font-bold ring-2 ring-amber-500/30'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-stone-950' : 'text-stone-400'}`}>
                      {item.isToday ? 'Hoje' : item.weekday}
                    </span>
                    <span className="text-lg font-extrabold my-0.5">{item.dayNum}</span>
                    <span className={`text-[10px] capitalize ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                      {item.month}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Time Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Horários Livres em {selectedDate} ({availableSlots.length} disponíveis)
              </label>
              <span className="text-xs text-stone-500">Duração: {selectedService?.durationMinutes} min</span>
            </div>

            {availableSlots.length === 0 ? (
              <div className="bg-stone-900 border border-dashed border-stone-800 rounded-2xl p-8 text-center">
                <Calendar className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                <p className="text-stone-300 font-medium text-sm">Nenhum horário disponível para esta data.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Experimente selecionar outro dia no calendário acima ou escolher outro barbeiro.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                {availableSlots.map((slot) => {
                  const isSelected =
                    selectedTimeSlot?.time === slot.time && selectedTimeSlot?.barberId === slot.barberId;
                  return (
                    <button
                      key={`${slot.barberId}-${slot.time}`}
                      id={`time-slot-${slot.time}-${slot.barberId}`}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-200 hover:bg-stone-800 hover:border-amber-500/40'
                      }`}
                    >
                      <span className="text-sm font-extrabold">{slot.time}</span>
                      {selectedBarberId === 'any' && (
                        <span
                          className={`text-[9px] truncate max-w-full mt-0.5 ${
                            isSelected ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {slot.barberName.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-medium transition-all"
            >
              Voltar
            </button>
            <button
              id="btn-step3-next"
              disabled={!selectedTimeSlot}
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-stone-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
            >
              Avançar para Confirmação
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmação & Resumo (RF-04, RF-19) */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <button
              onClick={() => setStep(3)}
              className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> Voltar para Horários
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Confirmação do Agendamento</h2>
            <p className="text-sm text-stone-400 mt-1">
              Revise os dados antes de confirmar. Uma confirmação será enviada automaticamente para seu contato.
            </p>
          </div>

          {/* Appointment Summary Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Serviço Selecionado
                </span>
                <h3 className="text-lg font-bold text-stone-100">{selectedService?.name}</h3>
                <p className="text-xs text-stone-400 mt-0.5">Duração estimada: {selectedService?.durationMinutes} minutos</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400">Total a pagar no local</span>
                <p className="text-xl font-black text-amber-400">R$ {selectedService?.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80">
                <span className="text-xs text-stone-500 block">Profissional Responsável</span>
                <span className="font-semibold text-stone-200">{selectedTimeSlot?.barberName}</span>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800/80">
                <span className="text-xs text-stone-500 block">Data e Horário</span>
                <span className="font-semibold text-amber-400">
                  {selectedDate} às {selectedTimeSlot?.time}
                </span>
              </div>
            </div>

            {/* Client Info Inputs (Allows editing for reception or guest) */}
            <div className="pt-2 border-t border-stone-800">
              <span className="text-xs font-semibold text-stone-300 block mb-3">
                Dados para Contato e Notificações (SMS / E-mail)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    id="input-booking-name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    id="input-booking-phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-400 mb-1">E-mail</label>
                  <input
                    type="email"
                    id="input-booking-email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-sm font-medium transition-all"
            >
              Voltar
            </button>
            <button
              id="btn-confirm-booking-final"
              onClick={handleConfirm}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm transition-all flex items-center gap-2 shadow-xl hover:shadow-amber-500/20"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirmar Agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
