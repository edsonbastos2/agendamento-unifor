import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getRelativeDate } from '../../mockData';
import { AlertTriangle, Calendar, User, XCircle, CheckCircle2, History } from 'lucide-react';

interface BatchCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BatchCancelModal: React.FC<BatchCancelModalProps> = ({ isOpen, onClose }) => {
  const { barbers, appointments, cancelBatchAppointments, batchCancellations } = useApp();

  const [selectedBarberId, setSelectedBarberId] = useState<string>(barbers[0]?.id || '');
  const [startDate, setStartDate] = useState<string>(getRelativeDate(0));
  const [endDate, setEndDate] = useState<string>(getRelativeDate(1));
  const [reason, setReason] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  // Preview affected appointments in real-time
  const affectedPreview = appointments.filter((a) => {
    if (a.barberId !== selectedBarberId) return false;
    if (a.status !== 'AGENDADO' && a.status !== 'CONFIRMADO') return false;
    return a.date >= startDate && a.date <= endDate;
  });

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!reason.trim()) {
      setFeedback({ type: 'error', message: 'O motivo do cancelamento em lote é obrigatório.' });
      return;
    }

    const res = cancelBatchAppointments(selectedBarberId, startDate, endDate, reason);
    if (res.success) {
      setFeedback({
        type: 'success',
        message: `${res.affectedCount} agendamento(s) cancelados em lote com sucesso. Todos os clientes afetados receberam notificações automáticas.`
      });
      setReason('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-100">Cancelamento em Lote</h3>
              <p className="text-xs text-stone-400">
                Cancele agendamentos futuros de um profissional por motivo de folga médica ou imprevisto.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {feedback && (
          <div
            className={`my-4 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 my-4">
          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              Profissional / Barbeiro
            </label>
            <select
              id="select-batch-barber"
              value={selectedBarberId}
              onChange={(e) => setSelectedBarberId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-medium focus:outline-none focus:border-rose-500"
            >
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Data Início</label>
              <input
                type="date"
                id="input-batch-start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">Data Fim</label>
              <input
                type="date"
                id="input-batch-end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 block mb-1">
              Motivo do Cancelamento em Lote <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              id="input-batch-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Atestado médico urgente do profissional"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Real-time Impact Preview */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-300">
                Agendamentos que serão afetados ({affectedPreview.length})
              </span>
              <span className="text-[11px] text-stone-500">{selectedBarber?.name}</span>
            </div>

            {affectedPreview.length === 0 ? (
              <p className="text-xs text-stone-500 italic">
                Nenhum agendamento ativo encontrado para este barbeiro no período informado.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {affectedPreview.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-2 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-stone-200">{apt.clientName}</span>
                      <span className="text-stone-400 ml-2">({apt.clientPhone})</span>
                    </div>
                    <span className="text-amber-400 font-medium">
                      {apt.date} às {apt.startTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-medium"
            >
              Fechar
            </button>
            <button
              type="submit"
              id="btn-confirm-batch-cancel"
              disabled={affectedPreview.length === 0 || !reason.trim()}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold shadow-lg transition-all"
            >
              Cancelar {affectedPreview.length} Agendamento(s) em Lote
            </button>
          </div>
        </form>

        {/* Previous Batch Cancellations Log (RF-12 requirement: disponibilizando agendamentos afetados para posterior consulta) */}
        {batchCancellations.length > 0 && (
          <div className="mt-6 pt-4 border-t border-stone-800">
            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              Histórico de Cancelamentos em Lote Anteriores
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {batchCancellations.map((batch) => (
                <div
                  key={batch.id}
                  className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-stone-200">
                      {batch.barberName} ({batch.cancelledCount} cancelados)
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Período: {batch.startDate} até {batch.endDate} • Motivo: {batch.reason}
                    </p>
                  </div>
                  <span className="text-[10px] text-stone-500">
                    {new Date(batch.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
