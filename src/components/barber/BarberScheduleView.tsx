import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../mockData';
import { Appointment } from '../../types';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Scissors,
  DollarSign,
  Phone,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const BarberScheduleView: React.FC = () => {
  const {
    currentUser,
    appointments,
    services,
    barbers,
    barberSchedules,
    finishService
  } = useApp();

  // If currentUser is a barber, use their ID; otherwise fallback to first barber
  const activeBarber =
    currentUser.role === 'barbeiro'
      ? currentUser
      : barbers.find((b) => b.id === 'user-barber-1') || barbers[0];

  const [selectedDate, setSelectedDate] = useState<string>(getRelativeDate(0));
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // Appointments for this barber on selected date
  const barberDayAppointments = appointments.filter(
    (a) => a.barberId === activeBarber?.id && a.date === selectedDate
  );

  // Barber's schedule for this day of week
  const dateObj = new Date(`${selectedDate}T12:00:00`);
  const dayOfWeek = dateObj.getDay();
  const scheduleObj = barberSchedules.find((s) => s.barberId === activeBarber?.id);
  const daySchedule = scheduleObj?.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

  const isWorkingDay = daySchedule?.active;

  const handleFinish = (id: string, clientName: string) => {
    const res = finishService(id);
    if (res.success) {
      setSuccessFeedback(`Atendimento de ${clientName} marcado como Concluído (REALIZADO). Liberado para a recepção.`);
      setTimeout(() => setSuccessFeedback(null), 4000);
    }
  };

  // Day stats
  const scheduledCount = barberDayAppointments.filter((a) => ['AGENDADO', 'CONFIRMADO'].includes(a.status)).length;
  const finishedCount = barberDayAppointments.filter((a) => ['REALIZADO', 'PAGO'].includes(a.status)).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Barber Header & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {activeBarber?.avatar ? (
            <img
              src={activeBarber.avatar}
              alt={activeBarber.name}
              className="w-12 h-12 rounded-2xl object-cover border border-stone-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Scissors className="w-6 h-6" />
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
              Agenda do Barbeiro: {activeBarber?.name}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Acompanhamento de horários marcados e finalização de atendimentos em tempo real.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              const d = new Date(`${selectedDate}T12:00:00`);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-stone-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            id="barber-date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold text-stone-200 focus:outline-none px-2"
          />

          <button
            onClick={() => {
              const d = new Date(`${selectedDate}T12:00:00`);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-stone-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(getRelativeDate(0))}
            className="px-2.5 py-1 rounded-xl bg-amber-500 text-stone-950 text-xs font-bold"
          >
            Hoje
          </button>
        </div>
      </div>

      {successFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{successFeedback}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Jornada Contratada</span>
          <span className="text-sm font-bold text-stone-200">
            {isWorkingDay
              ? `${daySchedule.startTime} às ${daySchedule.endTime} (Almoço: ${daySchedule.breakStart}-${daySchedule.breakEnd})`
              : 'Folga Contratual'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center sm:text-left">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Clientes Previstos</span>
          <span className="text-2xl font-black text-amber-400">{scheduledCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-center sm:text-left">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">Atendimentos Concluídos</span>
          <span className="text-2xl font-black text-emerald-400">{finishedCount}</span>
        </div>
      </div>

      {/* Daily Appointments Schedule */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6">
        <h3 className="font-bold text-base text-stone-100 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Grade de Atendimentos em {selectedDate}
        </h3>

        {barberDayAppointments.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-800 rounded-2xl">
            <Calendar className="w-10 h-10 text-stone-600 mx-auto mb-2" />
            <p className="text-stone-300 font-semibold text-sm">
              Nenhum cliente agendado para este dia até o momento.
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Os horários estão abertos na plataforma para reservas em tempo real pelos clientes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {barberDayAppointments
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((apt) => {
                const service = services.find((s) => s.id === apt.serviceId);
                const isReadyToFinish = apt.status === 'CONFIRMADO' || apt.status === 'AGENDADO';
                const isFinished = apt.status === 'REALIZADO' || apt.status === 'PAGO';

                return (
                  <div
                    key={apt.id}
                    id={`barber-apt-row-${apt.id}`}
                    className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isFinished
                        ? 'bg-stone-950/60 border-stone-800/80 opacity-80'
                        : apt.status === 'CONFIRMADO'
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 py-2 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center justify-center font-bold text-amber-400 shrink-0">
                        <span className="text-xs">{apt.startTime}</span>
                        <span className="text-[10px] text-stone-500">{apt.endTime}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${
                              apt.status === 'CONFIRMADO'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : apt.status === 'REALIZADO'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                : apt.status === 'PAGO'
                                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                                : apt.status === 'CANCELADO'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {apt.status === 'CONFIRMADO'
                              ? 'Cliente na Barbearia (Confirmado)'
                              : apt.status === 'REALIZADO'
                              ? 'Atendimento Finalizado (Aguardando Pagamento)'
                              : apt.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-stone-100 text-sm sm:text-base">
                          {apt.clientName}
                        </h4>
                        <p className="text-xs text-stone-400 mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="text-amber-300 font-semibold">{service?.name}</span>
                          <span>•</span>
                          <span>{service?.durationMinutes} minutos</span>
                          <span>•</span>
                          <span>Tel: {apt.clientPhone}</span>
                        </p>
                      </div>
                    </div>

                    {/* Barber Action Button: Finalizar Atendimento */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isReadyToFinish && (
                        <button
                          id={`btn-finish-service-${apt.id}`}
                          onClick={() => handleFinish(apt.id, apt.clientName)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md"
                          title="Finalizar atendimento e liberar para pagamento na recepção"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Finalizar Atendimento
                        </button>
                      )}

                      {apt.status === 'REALIZADO' && (
                        <span className="text-xs text-sky-400 font-semibold flex items-center gap-1 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          Concluído • Recepção cobrando
                        </span>
                      )}

                      {apt.status === 'PAGO' && (
                        <span className="text-xs text-teal-400 font-semibold flex items-center gap-1 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/30">
                          <DollarSign className="w-4 h-4" />
                          Atendimento Pago
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
