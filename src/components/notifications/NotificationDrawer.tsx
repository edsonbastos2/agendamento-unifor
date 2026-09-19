import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, MessageSquare, Mail, X, CheckCheck, Clock, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications } = useApp();
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'SMS' | 'EMAIL'>('ALL');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (channelFilter === 'ALL') return true;
    return n.channel === channelFilter;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-stone-900 border-l border-stone-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100">Notificações do Sistema (RF-19)</h3>
              <p className="text-[11px] text-stone-400">Disparos automáticos por SMS e E-mail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 bg-stone-950/60 border-b border-stone-800/80 flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setChannelFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              channelFilter === 'ALL'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setChannelFilter('SMS')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              channelFilter === 'SMS'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            SMS
          </button>
          <button
            onClick={() => setChannelFilter('EMAIL')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
              channelFilter === 'EMAIL'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mail className="w-3 h-3" />
            E-mail
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-xs">
              Nenhuma notificação registrada neste canal.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/90 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      item.channel === 'SMS'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {item.channel === 'SMS' ? (
                      <MessageSquare className="w-2.5 h-2.5" />
                    ) : (
                      <Mail className="w-2.5 h-2.5" />
                    )}
                    {item.channel}
                  </span>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <h4 className="font-bold text-stone-200">{item.title}</h4>
                  <span className="text-[10px] text-stone-400 font-mono">{item.recipient}</span>
                </div>

                <p className="text-stone-400 leading-relaxed text-[11px] bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                  {item.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 text-[11px] text-stone-500 text-center">
          Notificações automáticas em conformidade com o requisito RF-19.
        </div>
      </div>
    </div>
  );
};
