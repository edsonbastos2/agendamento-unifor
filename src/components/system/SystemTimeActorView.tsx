import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  User,
  History,
  Info,
  Sliders,
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';

export const SystemTimeActorView: React.FC = () => {
  const {
    appointments,
    toleranceAudit,
    runToleranceCheck,
    barberSchedules,
    services,
    barbers,
    confirmAttendance
  } = useApp();

  const [simulatedMinutesOffset, setSimulatedMinutesOffset] = useState<number>(0);
  const [lastRunResult, setLastRunResult] = useState<{ expiredCount: number; details: string[] } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);

  const realNowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const currentVirtualMinutes = realNowMinutes + simulatedMinutesOffset;
  const currentVirtualTimeStr = `${Math.floor((currentVirtualMinutes % 1440) / 60)
    .toString()
    .padStart(2, '0')}:${((currentVirtualMinutes % 1440) % 60).toString().padStart(2, '0')}`;

  const handleExecuteTolerance = () => {
    const res = runToleranceCheck(simulatedMinutesOffset);
    setLastRunResult(res);
  };

  const handleFastForward = (minutes: number) => {
    const nextOffset = simulatedMinutesOffset + minutes;
    setSimulatedMinutesOffset(nextOffset);
    const res = runToleranceCheck(nextOffset);
    setLastRunResult(res);
  };

  const handleResetOffset = () => {
    setSimulatedMinutesOffset(0);
    setLastRunResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header do Ator */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/5">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Ator do Sistema
                </span>
                <span className="text-xs text-stone-400">Requisito RF-23</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">Ator: Tempo (Rotinas Automáticas)</h1>
              <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                Rotina agendada do sistema que opera continuamente em segundo plano para garantir o ciclo de vida dos atendimentos e executar o cancelamento automático após a tolerância de 15 minutos.
              </p>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-4 flex items-center gap-4 shrink-0">
            <div>
              <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Relógio Virtual</div>
              <div className="text-2xl font-black text-amber-400 font-mono tracking-tight flex items-center gap-2">
                {currentVirtualTimeStr}
                {simulatedMinutesOffset > 0 && (
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    +{simulatedMinutesOffset} min
                  </span>
                )}
              </div>
            </div>
            <div className="h-8 w-px bg-stone-800" />
            <button
              id="btn-executar-tolerancia"
              onClick={handleExecuteTolerance}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Executar Agora
            </button>
          </div>
        </div>
      </div>

      {/* Regra de Negócio Explicada */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Gatilho RF-23</h3>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Se o agendamento estiver com status <strong className="text-amber-300">AGENDADO</strong> e decorrerem <strong className="text-stone-200">15 minutos</strong> do horário de início sem confirmação de presença pela recepção, o status passa para <strong className="text-rose-400">CANCELADO</strong> com motivo <code className="text-stone-300">"não comparecimento"</code>.
          </p>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Imunidade RF-20</h3>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Agendamentos com presença confirmada pela recepção (<strong className="text-emerald-300">CONFIRMADO</strong>), atendimentos finalizados (<strong className="text-sky-300">REALIZADO</strong>) ou pagos (<strong className="text-teal-300">PAGO</strong>) <strong className="text-stone-200">nunca</strong> são cancelados pela tolerância.
          </p>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sky-400 mb-2">
            <Sliders className="w-4 h-4" />
            <h3 className="text-sm font-bold text-white">Simulador de Tempo</h3>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed mb-3">
            Avance o relógio virtual para testar a expiração automática de agendamentos no passado ou presente.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleFastForward(10)}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded border border-stone-700 cursor-pointer"
            >
              +10 min
            </button>
            <button
              onClick={() => handleFastForward(20)}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium rounded border border-amber-500/40 cursor-pointer"
            >
              +20 min (Expira)
            </button>
            <button
              onClick={() => handleFastForward(60)}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded border border-stone-700 cursor-pointer"
            >
              +1 hora
            </button>
            {simulatedMinutesOffset > 0 && (
              <button
                onClick={handleResetOffset}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Zerar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Alerta de Última Execução */}
      {lastRunResult && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            lastRunResult.expiredCount > 0
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          {lastRunResult.expiredCount > 0 ? (
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold text-sm">
              Varredura de Tolerância Concluída — Relógio Virtual: {currentVirtualTimeStr}
            </div>
            <div className="text-xs mt-1 text-stone-300">
              {lastRunResult.expiredCount > 0
                ? `${lastRunResult.expiredCount} agendamento(s) excederam a tolerância de 15 min e foram cancelados automaticamente por "não comparecimento". Clientes notificados.`
                : 'Nenhum agendamento pendente excedeu o limite de 15 minutos sem confirmação de presença.'}
            </div>
            {lastRunResult.details.length > 0 && (
              <ul className="mt-2 space-y-1 text-xs list-disc list-inside text-rose-200/90 font-mono">
                {lastRunResult.details.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Monitor em Tempo Real dos Agendamentos de Hoje */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Monitor de Tolerância de Agendamentos (Hoje)</h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {todayAppointments.length} agendamento(s) registrados hoje
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider font-semibold border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Serviço & Barbeiro</th>
                <th className="py-3 px-4">Status Atual</th>
                <th className="py-3 px-4">Minutos Atraso</th>
                <th className="py-3 px-4">Diagnóstico Temporal</th>
                <th className="py-3 px-4 text-right">Ação de Teste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-300">
              {todayAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    Nenhum agendamento agendado para a data de hoje.
                  </td>
                </tr>
              ) : (
                todayAppointments.map((apt) => {
                  const service = services.find((s) => s.id === apt.serviceId);
                  const barber = barbers.find((b) => b.id === apt.barberId);

                  const [h, m] = apt.startTime.split(':').map(Number);
                  const aptStartMin = h * 60 + m;
                  const overdueMin = currentVirtualMinutes - aptStartMin;

                  let diagnosticBadge = {
                    label: 'No Prazo',
                    bg: 'bg-stone-800 text-stone-400 border-stone-700'
                  };

                  if (apt.status === 'CONFIRMADO') {
                    diagnosticBadge = {
                      label: 'Imune (Presença Confirmada)',
                      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    };
                  } else if (apt.status === 'REALIZADO' || apt.status === 'PAGO') {
                    diagnosticBadge = {
                      label: 'Concluído',
                      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                    };
                  } else if (apt.status === 'CANCELADO') {
                    diagnosticBadge = {
                      label: apt.cancellationReason === 'não comparecimento' ? 'Cancelado por Tolerância' : 'Cancelado',
                      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    };
                  } else if (apt.status === 'AGENDADO') {
                    if (overdueMin > 15) {
                      diagnosticBadge = {
                        label: '⚠️ Tolerância Expirada (>15 min)',
                        bg: 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      };
                    } else if (overdueMin > 0) {
                      diagnosticBadge = {
                        label: `Dentro da Tolerância (${15 - overdueMin} min restantes)`,
                        bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      };
                    } else {
                      diagnosticBadge = {
                        label: `Aguardando Horário (Faltam ${Math.abs(overdueMin)} min)`,
                        bg: 'bg-stone-800 text-stone-400 border-stone-700'
                      };
                    }
                  }

                  return (
                    <tr key={apt.id} className="hover:bg-stone-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {apt.startTime} - {apt.endTime}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-200">
                        {apt.clientName}
                        {apt.clientLogin && (
                          <div className="text-[11px] text-stone-400 font-mono">@{apt.clientLogin}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-300">
                        <div>{service?.name}</div>
                        <div className="text-[11px] text-stone-400 font-sans">com {barber?.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            apt.status === 'AGENDADO'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : apt.status === 'CONFIRMADO'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : apt.status === 'REALIZADO'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : apt.status === 'PAGO'
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-300">
                        {overdueMin > 0 ? `+${overdueMin} min` : `${overdueMin} min`}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-[11px] font-medium border inline-block ${diagnosticBadge.bg}`}>
                          {diagnosticBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {apt.status === 'AGENDADO' && (
                          <button
                            onClick={() => confirmAttendance(apt.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-medium cursor-pointer transition-colors"
                            title="Confirmar presença para torná-lo imune à tolerância de 15 min"
                          >
                            Confirmar Presença (Tornar Imune)
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico de Auditoria do Ator Tempo */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Log de Auditoria do Ator Tempo</h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {toleranceAudit.length} evento(s) auditados
          </span>
        </div>

        <div className="divide-y divide-stone-800 text-xs">
          {toleranceAudit.length === 0 ? (
            <div className="p-8 text-center text-stone-500">
              Nenhuma avaliação de tolerância gravada até o momento.
            </div>
          ) : (
            toleranceAudit.slice(0, 8).map((record) => (
              <div key={record.id} className="p-4 hover:bg-stone-800/40 transition-colors flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    record.action === 'CANCELADO_POR_TOLERANCIA'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {record.action === 'CANCELADO_POR_TOLERANCIA' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-stone-200">
                      {record.clientName} — {record.serviceName} ({record.barberName})
                    </div>
                    <span className="font-mono text-stone-400 text-[11px]">
                      Avaliado às {record.evaluatedAt}
                    </span>
                  </div>

                  <p className="text-stone-300 mt-1">{record.details}</p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-400 font-mono">
                    <span>Horário Marcado: {record.scheduledTime}</span>
                    <span>•</span>
                    <span className={record.minutesOverdue > 15 ? 'text-rose-400 font-semibold' : 'text-stone-300'}>
                      Minutos decorridos: +{record.minutesOverdue} min
                    </span>
                    <span>•</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        record.action === 'CANCELADO_POR_TOLERANCIA'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {record.action}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
