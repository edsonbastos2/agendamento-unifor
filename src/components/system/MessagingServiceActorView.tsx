import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationLog } from '../../types';
import {
  Mail,
  MessageSquare,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Inbox,
  Filter,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';

export const MessagingServiceActorView: React.FC = () => {
  const { notifications, resendNotification, clients } = useApp();

  const [channelFilter, setChannelFilter] = useState<'ALL' | 'EMAIL' | 'SMS'>('ALL');
  const [selectedNotif, setSelectedNotif] = useState<NotificationLog | null>(notifications[0] || null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredNotifications = notifications.filter((n) => {
    if (channelFilter === 'EMAIL') return n.channel === 'EMAIL';
    if (channelFilter === 'SMS') return n.channel === 'SMS';
    return true;
  });

  const handleResend = (id: string) => {
    const res = resendNotification(id);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const emailCount = notifications.filter((n) => n.channel === 'EMAIL').length;
  const smsCount = notifications.filter((n) => n.channel === 'SMS').length;

  return (
    <div className="space-y-6">
      {/* Header do Ator */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-500/5">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Ator do Sistema
                </span>
                <span className="text-xs text-stone-400">Requisito RF-24</span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-1">Ator: Serviço de E-mail/SMS</h1>
              <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                Serviço responsável por despachar, rotear canais e rastrear mensagens disparadas a cada criação, cancelamento, reagendamento ou tolerância de atendimento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2 text-center">
              <div className="text-xs text-stone-400 uppercase font-semibold">Total E-mails</div>
              <div className="text-xl font-bold text-sky-400 font-mono">{emailCount}</div>
            </div>
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2 text-center">
              <div className="text-xs text-stone-400 uppercase font-semibold">Total SMS</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{smsCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Regra de Negócio de Roteamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Canal Prioritário: E-mail</h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Conforme o critério de aceitação de <strong className="text-stone-200">RF-24</strong>, quando o cliente possui e-mail cadastrado, a notificação é roteada e entregue preferencialmente por <strong className="text-sky-300">E-mail</strong>.
            </p>
          </div>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Canal Alternativo: SMS</h3>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Quando o cliente possui apenas telefone cadastrado (como em cadastros rápidos no balcão sem e-mail), a notificação é despachada por <strong className="text-emerald-300">SMS</strong>.
            </p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {feedback}
        </div>
      )}

      {/* Grid Principal: Fila de Despacho & Simulador Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fila de Mensagens (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-stone-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white">Fila de Mensagens Despachadas</h2>
            </div>

            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 text-xs">
              <button
                onClick={() => setChannelFilter('ALL')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  channelFilter === 'ALL' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Todos ({notifications.length})
              </button>
              <button
                onClick={() => setChannelFilter('EMAIL')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  channelFilter === 'EMAIL' ? 'bg-sky-500/20 text-sky-300' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                E-mail ({emailCount})
              </button>
              <button
                onClick={() => setChannelFilter('SMS')}
                className={`px-2.5 py-1 rounded font-medium cursor-pointer transition-colors ${
                  channelFilter === 'SMS' ? 'bg-emerald-500/20 text-emerald-300' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                SMS ({smsCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-stone-800 overflow-y-auto max-h-[560px]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs">
                Nenhuma notificação enviada no canal selecionado.
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const isSelected = selectedNotif?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotif(notif)}
                    className={`p-4 cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-sky-500/10 border-l-4 border-sky-500' : 'hover:bg-stone-800/40'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        notif.channel === 'EMAIL'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {notif.channel === 'EMAIL' ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold text-white truncate">{notif.title}</div>
                        <span className="text-[11px] font-mono text-stone-400 shrink-0">{notif.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase border ${
                            notif.channel === 'EMAIL'
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          }`}
                        >
                          {notif.channel}
                        </span>
                        <span className="text-xs text-stone-300 truncate font-mono">{notif.recipient}</span>
                      </div>

                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{notif.message}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResend(notif.id);
                      }}
                      title="Simular reenvio (Critério RF-24: nova tentativa)"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Simulador Visual do Dispositivo (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Pré-visualização do Cliente</span>
              {selectedNotif && (
                <span className="text-[11px] text-sky-400 font-mono">Canal: {selectedNotif.channel}</span>
              )}
            </h3>

            {selectedNotif ? (
              selectedNotif.channel === 'SMS' ? (
                /* Smartphone Mockup */
                <div className="bg-stone-950 border border-stone-800 rounded-3xl p-4 shadow-2xl relative">
                  {/* Speaker bar */}
                  <div className="w-16 h-1 bg-stone-800 rounded-full mx-auto mb-3" />

                  <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3 mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      NA
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Barbearia Navalha & Arte</div>
                      <div className="text-[10px] text-stone-400 font-mono">{selectedNotif.recipient}</div>
                    </div>
                  </div>

                  <div className="space-y-3 py-3 min-h-[180px]">
                    <div className="text-center text-[10px] text-stone-500 uppercase font-mono">
                      Hoje às {selectedNotif.timestamp}
                    </div>

                    <div className="bg-emerald-600/90 text-white rounded-2xl rounded-tl-sm p-3.5 text-xs shadow-md max-w-[85%]">
                      <div className="font-bold text-[11px] mb-1">{selectedNotif.title}</div>
                      <p className="leading-relaxed">{selectedNotif.message}</p>
                      <div className="text-right text-[10px] text-emerald-200 mt-1 font-mono flex items-center justify-end gap-1">
                        <span>{selectedNotif.timestamp}</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Status: <strong className="text-emerald-400 font-mono">Entregue (SMS)</strong></span>
                    <button
                      onClick={() => handleResend(selectedNotif.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reenviar
                    </button>
                  </div>
                </div>
              ) : (
                /* E-mail Client Mockup */
                <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 shadow-2xl">
                  <div className="border-b border-stone-800 pb-3 mb-3">
                    <div className="text-xs font-bold text-white">{selectedNotif.title}</div>
                    <div className="text-[11px] text-stone-400 mt-1 flex items-center justify-between font-mono">
                      <span>Para: {selectedNotif.recipient}</span>
                      <span>{selectedNotif.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono">
                      De: notificacoes@barbearianavalha.com.br
                    </div>
                  </div>

                  <div className="bg-stone-900 border border-stone-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Barbearia Navalha & Arte Central</span>
                    </div>

                    <p className="text-xs text-stone-200 leading-relaxed">
                      {selectedNotif.message}
                    </p>

                    <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                      Caso precise gerenciar seu horário, acesse nossa plataforma web a qualquer momento.
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-400">
                    <span>Protocolo: <strong className="font-mono text-stone-300">{selectedNotif.id}</strong></span>
                    <button
                      onClick={() => handleResend(selectedNotif.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reenviar
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="p-8 text-center text-stone-500 text-xs">
                Selecione uma mensagem da fila para pré-visualizar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
