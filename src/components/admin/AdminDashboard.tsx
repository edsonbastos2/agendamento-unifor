import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, User, WorkingDaySchedule } from '../../types';
import {
  Scissors,
  Users,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

interface AdminDashboardProps {
  activeSubTab: 'servicos' | 'barbeiros' | 'recepcao';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSubTab }) => {
  const {
    services,
    barbers,
    receptionists,
    addService,
    deleteService,
    addBarber,
    addReceptionist,
    barberSchedules,
    updateBarberSchedule
  } = useApp();

  const [currentTab, setCurrentTab] = useState<'servicos' | 'barbeiros' | 'recepcao'>(activeSubTab);

  // New Service Modal (RF-08)
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(50);
  const [serviceDuration, setServiceDuration] = useState<number>(30);
  const [serviceBarbers, setServiceBarbers] = useState<string[]>([]);

  // New Barber Modal (RF-06)
  const [showBarberModal, setShowBarberModal] = useState(false);
  const [barberName, setBarberName] = useState('');
  const [barberEmail, setBarberEmail] = useState('');
  const [barberPhone, setBarberPhone] = useState('');
  const [barberBio, setBarberBio] = useState('');
  const [barberSelectedServices, setBarberSelectedServices] = useState<string[]>([]);
  const [barberSuccessLink, setBarberSuccessLink] = useState<string | null>(null);

  // New Receptionist Modal (RF-07)
  const [showRecModal, setShowRecModal] = useState(false);
  const [recName, setRecName] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [recPhone, setRecPhone] = useState('');
  const [recSuccessLink, setRecSuccessLink] = useState<string | null>(null);

  // Working Hours Modal (RF-17)
  const [scheduleBarberId, setScheduleBarberId] = useState<string | null>(null);
  const [tempSchedule, setTempSchedule] = useState<WorkingDaySchedule[]>([]);
  const [toleranceMin, setToleranceMin] = useState<number>(15);

  const [feedback, setFeedback] = useState<string | null>(null);

  const daysLabels = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  // Handle Service Creation (RF-08)
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addService({
      name: serviceName,
      description: serviceDesc,
      price: servicePrice,
      durationMinutes: serviceDuration,
      barberIds: serviceBarbers
    });

    if (res.success) {
      setFeedback(res.message);
      setShowServiceModal(false);
      setServiceName('');
      setServiceDesc('');
      setServicePrice(50);
      setServiceDuration(30);
      setServiceBarbers([]);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Handle Barber Creation (RF-06)
  const handleCreateBarber = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addBarber({
      name: barberName,
      email: barberEmail,
      phone: barberPhone,
      bio: barberBio,
      serviceIds: barberSelectedServices
    });

    if (res.success) {
      setBarberSuccessLink(res.firstAccessLink);
      setBarberName('');
      setBarberEmail('');
      setBarberPhone('');
      setBarberBio('');
      setBarberSelectedServices([]);
    }
  };

  // Handle Receptionist Creation (RF-07)
  const handleCreateReceptionist = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addReceptionist({
      name: recName,
      email: recEmail,
      phone: recPhone
    });

    if (res.success) {
      setRecSuccessLink(res.firstAccessLink);
      setRecName('');
      setRecEmail('');
      setRecPhone('');
    }
  };

  // Open Working Hours Modal (RF-17)
  const handleOpenScheduleModal = (barberId: string) => {
    const sched = barberSchedules.find((s) => s.barberId === barberId);
    if (sched) {
      setTempSchedule(JSON.parse(JSON.stringify(sched.weeklySchedule)));
      setToleranceMin(sched.toleranceMinutes || 15);
    }
    setScheduleBarberId(barberId);
  };

  // Save Working Hours (RF-17)
  const handleSaveSchedule = () => {
    if (!scheduleBarberId) return;
    updateBarberSchedule(scheduleBarberId, tempSchedule, toleranceMin);
    setScheduleBarberId(null);
    setFeedback('Jornada de trabalho e tolerância do barbeiro atualizadas com sucesso!');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100">Painel do Administrador</h2>
          <p className="text-sm text-stone-400 mt-1">
            Gestão completa de serviços, equipe de barbeiros, recepcionistas e jornadas de trabalho.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-2xl border border-stone-800">
          <button
            id="admin-subtab-services"
            onClick={() => setCurrentTab('servicos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'servicos' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Serviços
          </button>
          <button
            id="admin-subtab-barbers"
            onClick={() => setCurrentTab('barbeiros')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'barbeiros' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Barbeiros & Horários
          </button>
          <button
            id="admin-subtab-reception"
            onClick={() => setCurrentTab('recepcao')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'recepcao' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Recepcionistas
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. SERVIÇOS (RF-08) */}
      {currentTab === 'servicos' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              Serviços Cadastrados ({services.length})
            </h3>
            <button
              id="btn-admin-add-service"
              onClick={() => {
                setServiceBarbers(barbers.map((b) => b.id));
                setShowServiceModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Novo Serviço
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                id={`admin-service-card-${srv.id}`}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-stone-100 text-base">{srv.name}</h4>
                    <span className="px-2.5 py-1 rounded-lg bg-stone-950 font-extrabold text-amber-400 text-sm border border-stone-800">
                      R$ {srv.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 leading-relaxed">{srv.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Duração: {srv.durationMinutes} min
                    </span>
                    <span>{srv.barberIds.length} barbeiro(s) aptos</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => deleteService(srv.id)}
                      className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-stone-800"
                      title="Excluir serviço"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BARBEIROS E JORNADAS (RF-06, RF-17) */}
      {currentTab === 'barbeiros' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Barbeiros da Equipe ({barbers.length})
            </h3>
            <button
              id="btn-admin-add-barber"
              onClick={() => {
                setBarberSuccessLink(null);
                setShowBarberModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Barbeiro
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map((b) => {
              const sched = barberSchedules.find((s) => s.barberId === b.id);
              const activeDays = sched?.weeklySchedule.filter((d) => d.active).length || 0;

              return (
                <div
                  key={b.id}
                  id={`admin-barber-card-${b.id}`}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    {b.avatar ? (
                      <img
                        src={b.avatar}
                        alt={b.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center font-bold text-stone-400 shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-100 text-sm sm:text-base">{b.name}</h4>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="Ativo"></span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">{b.email}</p>
                      <p className="text-xs text-stone-500">{b.phone}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 mt-3 line-clamp-2 leading-relaxed">
                    {b.bio || 'Sem descrição cadastrada.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between text-xs">
                    <span className="text-stone-400">
                      Escala: <strong className="text-stone-200">{activeDays} dias/semana</strong>
                    </span>

                    <button
                      id={`btn-manage-schedule-${b.id}`}
                      onClick={() => handleOpenScheduleModal(b.id)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 font-semibold border border-stone-700 flex items-center gap-1"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Definir Jornada
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. RECEPCIONISTAS */}
      {currentTab === 'recepcao' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Recepcionistas ({receptionists.length})
            </h3>
            <button
              id="btn-admin-add-receptionist"
              onClick={() => {
                setRecSuccessLink(null);
                setShowRecModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              Cadastrar Recepcionista
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {receptionists.map((rec) => (
              <div
                key={rec.id}
                id={`admin-rec-card-${rec.id}`}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all flex items-start gap-3"
              >
                {rec.avatar ? (
                  <img
                    src={rec.avatar}
                    alt={rec.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-700 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center font-bold text-stone-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-100 text-sm sm:text-base">{rec.name}</h4>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Ativa
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    {rec.email}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    {rec.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR SERVIÇO */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-100 mb-1">Cadastrar Serviço</h3>
            <p className="text-xs text-stone-400 mb-4">
              Informe nome, descrição, preço, duração e associe os barbeiros aptos a executá-lo.
            </p>

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  id="input-service-name"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Ex: Barboterapia Especial com Ozônio"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Descrição</label>
                <textarea
                  id="input-service-desc"
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Descrição detalhada do procedimento..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    id="input-service-price"
                    required
                    step="1"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Duração Estimada (min) *</label>
                  <input
                    type="number"
                    id="input-service-duration"
                    required
                    step="5"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(parseInt(e.target.value, 10) || 15)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Barbeiros Aptos a Executar</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto p-1">
                  {barbers.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={serviceBarbers.includes(b.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setServiceBarbers([...serviceBarbers, b.id]);
                          } else {
                            setServiceBarbers(serviceBarbers.filter((id) => id !== b.id));
                          }
                        }}
                        className="rounded text-amber-500 focus:ring-0"
                      />
                      <span className="text-stone-300">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-add-service"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  Cadastrar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR BARBEIRO */}
      {showBarberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-100 mb-1">Cadastrar Novo Barbeiro</h3>
            <p className="text-xs text-stone-400 mb-4">
              O sistema gera um link de primeiro acesso para que o barbeiro defina sua própria senha, sem que o administrador tenha conhecimento dela.
            </p>

            {barberSuccessLink ? (
              <div className="space-y-4 p-4 rounded-2xl bg-stone-950 border border-emerald-500/40">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  Barbeiro cadastrado com sucesso!
                </div>
                <p className="text-xs text-stone-300">
                  Link de primeiro acesso gerado para envio ao profissional:
                </p>
                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] font-mono text-amber-400 break-all">
                  {barberSuccessLink}
                </div>
                <button
                  onClick={() => setShowBarberModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateBarber} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    id="input-barber-name"
                    required
                    value={barberName}
                    onChange={(e) => setBarberName(e.target.value)}
                    placeholder="Ex: Gabriel 'Fade' Santos"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">E-mail *</label>
                    <input
                      type="email"
                      id="input-barber-email"
                      required
                      value={barberEmail}
                      onChange={(e) => setBarberEmail(e.target.value)}
                      placeholder="gabriel@barbearia.com"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                    />
                  </div>
                  <div>
                    <label className="text-stone-300 font-semibold block mb-1">Telefone *</label>
                    <input
                      type="text"
                      id="input-barber-phone"
                      required
                      value={barberPhone}
                      onChange={(e) => setBarberPhone(e.target.value)}
                      placeholder="(11) 98888-7777"
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Descrição / Especialidades</label>
                  <textarea
                    id="input-barber-bio"
                    rows={2}
                    value={barberBio}
                    onChange={(e) => setBarberBio(e.target.value)}
                    placeholder="Especialista em degrade na navalha e barboterapia..."
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 resize-none"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Serviços que está apto a executar</label>
                  <div className="space-y-1 max-h-28 overflow-y-auto p-1">
                    {services.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-stone-300">
                        <input
                          type="checkbox"
                          checked={barberSelectedServices.includes(s.id)}
                          onChange={(e) => {
                            if (e.target.checked) setBarberSelectedServices([...barberSelectedServices, s.id]);
                            else setBarberSelectedServices(barberSelectedServices.filter((id) => id !== s.id));
                          }}
                        />
                        <span>{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowBarberModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="btn-confirm-add-barber"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                  >
                    Cadastrar e Gerar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR RECEPCIONISTA */}
      {showRecModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <h3 className="font-bold text-lg text-stone-100 mb-1">Cadastrar Recepcionista</h3>
            <p className="text-xs text-stone-400 mb-4">
              Cadastro com link de primeiro acesso para definição confidencial de senha.
            </p>

            {recSuccessLink ? (
              <div className="space-y-4 p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Recepcionista cadastrada!
                </div>
                <p className="text-stone-300">Link seguro de primeiro acesso:</p>
                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 font-mono text-amber-400 break-all">
                  {recSuccessLink}
                </div>
                <button
                  onClick={() => setShowRecModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateReceptionist} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    id="input-rec-name"
                    required
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="Ex: Beatriz Lima"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">E-mail *</label>
                  <input
                    type="email"
                    id="input-rec-email"
                    required
                    value={recEmail}
                    onChange={(e) => setRecEmail(e.target.value)}
                    placeholder="beatriz@barbearia.com"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>
                <div>
                  <label className="text-stone-300 font-semibold block mb-1">Telefone *</label>
                  <input
                    type="text"
                    id="input-rec-phone"
                    required
                    value={recPhone}
                    onChange={(e) => setRecPhone(e.target.value)}
                    placeholder="(11) 97777-6666"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowRecModal(false)}
                    className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    id="btn-confirm-add-rec"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                  >
                    Cadastrar Recepcionista
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL DEFINIR HORÁRIOS DE TRABALHO */}
      {scheduleBarberId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg text-stone-100 mb-1">
              Definir Horários de Trabalho
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Configure a jornada semanal contratada para{' '}
              <strong className="text-amber-400">
                {barbers.find((b) => b.id === scheduleBarberId)?.name}
              </strong>
              .
            </p>

            <div className="mb-4 p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-300">
                Tolerância para atrasos antes do cancelamento automático:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={toleranceMin}
                  onChange={(e) => setToleranceMin(parseInt(e.target.value, 10) || 15)}
                  className="w-16 px-2 py-1 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-bold text-center"
                />
                <span className="text-stone-400">minutos</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {tempSchedule.map((day, idx) => (
                <div
                  key={day.dayOfWeek}
                  className={`p-3 rounded-2xl border transition-all text-xs flex flex-wrap items-center justify-between gap-3 ${
                    day.active ? 'bg-stone-950 border-stone-800' : 'bg-stone-950/40 border-stone-900 opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-2 font-bold text-stone-200 w-32">
                    <input
                      type="checkbox"
                      checked={day.active}
                      onChange={(e) => {
                        const updated = [...tempSchedule];
                        updated[idx].active = e.target.checked;
                        setTempSchedule(updated);
                      }}
                      className="rounded text-amber-500"
                    />
                    {daysLabels[day.dayOfWeek]}
                  </label>

                  {day.active ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Turno:</span>
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => {
                            const updated = [...tempSchedule];
                            updated[idx].startTime = e.target.value;
                            setTempSchedule(updated);
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-stone-200"
                        />
                        <span className="text-stone-500">até</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => {
                            const updated = [...tempSchedule];
                            updated[idx].endTime = e.target.value;
                            setTempSchedule(updated);
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-stone-200"
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500">Almoço:</span>
                        <input
                          type="time"
                          value={day.breakStart}
                          onChange={(e) => {
                            const updated = [...tempSchedule];
                            updated[idx].breakStart = e.target.value;
                            setTempSchedule(updated);
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-stone-200"
                        />
                        <span className="text-stone-500">às</span>
                        <input
                          type="time"
                          value={day.breakEnd}
                          onChange={(e) => {
                            const updated = [...tempSchedule];
                            updated[idx].breakEnd = e.target.value;
                            setTempSchedule(updated);
                          }}
                          className="bg-stone-900 border border-stone-800 rounded px-1.5 py-0.5 text-stone-200"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-stone-600 italic">Dia de folga</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setScheduleBarberId(null)}
                className="px-4 py-2 rounded-xl border border-stone-700 text-stone-300 text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-save-barber-schedule"
                onClick={handleSaveSchedule}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
              >
                Salvar Horários de Trabalho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
