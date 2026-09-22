import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ActorType,
  ServiceItem,
  BarberWorkingHours,
  WorkingDaySchedule,
  Appointment,
  AppointmentStatus,
  PaymentMethod,
  NotificationLog,
  BatchCancellationRecord,
  ToleranceAuditRecord
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_BARBER_SCHEDULES,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TOLERANCE_AUDIT
} from '../mockData';

// Helper to convert "HH:MM" to minutes from start of day
export const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes to "HH:MM"
export const minutesToTime = (totalMinutes: number): string => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// RNF-03: Mínimo 8 caracteres, maiúscula, minúscula, número e caractere especial
export const validatePasswordPolicy = (password: string): { valid: boolean; message: string } => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'A senha deve ter no mínimo 8 caracteres.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter ao menos uma letra maiúscula.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'A senha deve conter ao menos uma letra minúscula.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'A senha deve conter ao menos um número.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'A senha deve conter ao menos um caractere especial (!@#$%^&* etc.).' };
  }
  return { valid: true, message: 'Senha válida e segura.' };
};

export interface AvailableSlot {
  time: string;
  barberId: string;
  barberName: string;
  barberAvatar?: string;
  isAvailable: boolean;
}

interface AppContextType {
  // Actors & Active Vision
  activeActorView: ActorType;
  setActiveActorView: (actor: ActorType) => void;
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  toggleUserActive: (userId: string) => { success: boolean; message: string };

  // RF-01: Criar Conta de Cliente
  registerClient: (data: {
    name: string;
    login: string;
    email?: string;
    phone?: string;
    password: string;
  }) => { success: boolean; message: string; user?: User };

  // RF-02: Autenticar Usuário
  loginUser: (loginOrChannel: string, password?: string) => { success: boolean; message: string; user?: User };

  // RF-03: Recuperar Senha
  recoverPassword: (login: string, contactChannel: string) => { success: boolean; message: string };
  resetPassword: (identifier: string) => { success: boolean; message: string };

  // RF-04: Redefinir Senha no Perfil
  changePasswordInProfile: (userId: string, currentPass: string, newPass: string) => { success: boolean; message: string };

  // RF-12: Cadastrar Cliente no Balcão
  registerWalkInClient: (data: {
    login: string;
    name: string;
    email?: string;
    phone?: string;
  }) => { success: boolean; message: string; firstAccessLink: string; user?: User };

  // Multi-perfil manual (para avaliações)
  registerUser: (data: {
    role: UserRole;
    name: string;
    login?: string;
    email: string;
    phone: string;
    password?: string;
    bio?: string;
    serviceIds?: string[];
    shift?: string;
    companyName?: string;
    adminCode?: string;
  }) => { success: boolean; message: string; user?: User };

  // Data
  services: ServiceItem[];
  barbers: User[];
  receptionists: User[];
  clients: User[];
  appointments: Appointment[];
  barberSchedules: BarberWorkingHours[];
  notifications: NotificationLog[];
  batchCancellations: BatchCancellationRecord[];
  toleranceAudit: ToleranceAuditRecord[];

  // RF-10: Consultar Disponibilidade
  getAvailableSlots: (date: string, serviceId: string, barberId?: string) => AvailableSlot[];
  isTimeSlotAvailable: (date: string, startTime: string, durationMinutes: number, barberId: string, excludeAppointmentId?: string) => boolean;

  // RF-11 & RF-13: Agendamentos
  createAppointment: (data: {
    serviceId: string;
    barberId: string;
    date: string;
    startTime: string;
    clientId?: string;
    clientLogin?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  }) => { success: boolean; message: string; appointment?: Appointment };

  // RF-15: Reagendar
  rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newBarberId: string, reason?: string) => { success: boolean; message: string };

  // RF-16: Cancelar Agendamento
  cancelAppointment: (id: string, reason?: string, cancelledByRole?: UserRole) => { success: boolean; message: string };

  // RF-17: Cancelar em Lote
  cancelBatchAppointments: (barberId: string, startDate: string, endDate: string, reason: string) => { success: boolean; message: string; affectedCount: number };

  // RF-20: Confirmar Presença
  confirmAttendance: (id: string) => { success: boolean; message: string };

  // RF-21: Finalizar Atendimento
  finishService: (id: string) => { success: boolean; message: string };

  // RF-22: Registrar Pagamento
  registerPayment: (id: string, method: PaymentMethod, amount?: number) => { success: boolean; message: string };

  // RF-06: Cadastrar Barbeiro
  addBarber: (data: { login: string; name: string; email: string; phone: string; bio: string; serviceIds: string[]; avatar?: string }) => { success: boolean; message: string; firstAccessLink: string };

  // RF-07: Cadastrar Recepcionista
  addReceptionist: (data: { login: string; name: string; email: string; phone: string }) => { success: boolean; message: string; firstAccessLink: string };

  // RF-05: Cadastrar Serviços
  addService: (data: { name: string; description: string; price: number; durationMinutes: number; barberIds: string[] }) => { success: boolean; message: string };
  updateService: (id: string, data: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // RF-08: Definir Horários de Trabalho
  updateBarberSchedule: (barberId: string, weeklySchedule: WorkingDaySchedule[], toleranceMinutes: number) => { success: boolean; message: string };

  // RF-23: Ator Tempo - Cancelamento automático por tolerância de 15 min
  runToleranceCheck: (simulatedMinutesOffset?: number) => { expiredCount: number; details: string[] };

  // RF-24: Ator Serviço E-mail/SMS - Reenvio de notificação
  resendNotification: (notificationId: string) => { success: boolean; message: string };

  // Reset geral
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeActorView, setActiveActorView] = useState<ActorType>('cliente');

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('barber_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('barber_current_user');
    if (saved) return JSON.parse(saved);
    return INITIAL_USERS[0]; // Carlos Eduardo (Cliente)
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('barber_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [barberSchedules, setBarberSchedules] = useState<BarberWorkingHours[]>(() => {
    const saved = localStorage.getItem('barber_schedules');
    return saved ? JSON.parse(saved) : INITIAL_BARBER_SCHEDULES;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('barber_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('barber_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [batchCancellations, setBatchCancellations] = useState<BatchCancellationRecord[]>(() => {
    const saved = localStorage.getItem('barber_batch_cancellations');
    return saved ? JSON.parse(saved) : [];
  });

  const [toleranceAudit, setToleranceAudit] = useState<ToleranceAuditRecord[]>(() => {
    const saved = localStorage.getItem('barber_tolerance_audit');
    return saved ? JSON.parse(saved) : INITIAL_TOLERANCE_AUDIT;
  });

  // Persistência no LocalStorage
  useEffect(() => {
    localStorage.setItem('barber_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('barber_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('barber_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('barber_schedules', JSON.stringify(barberSchedules));
  }, [barberSchedules]);

  useEffect(() => {
    localStorage.setItem('barber_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('barber_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('barber_batch_cancellations', JSON.stringify(batchCancellations));
  }, [batchCancellations]);

  useEffect(() => {
    localStorage.setItem('barber_tolerance_audit', JSON.stringify(toleranceAudit));
  }, [toleranceAudit]);

  const barbers = users.filter((u) => u.role === 'barbeiro');
  const receptionists = users.filter((u) => u.role === 'recepcionista');
  const clients = users.filter((u) => u.role === 'cliente');

  // RF-24: Ator Serviço de E-mail/SMS
  // Regra: "Quando o cliente tem e-mail cadastrado, a notificação vai por e-mail; quando tem apenas telefone, vai por SMS."
  const dispatchClientNotification = (
    client: { email?: string; phone?: string; name: string },
    type: 'CRIACAO' | 'CANCELAMENTO' | 'REAGENDAMENTO' | 'TOLERANCIA_EXPIRADA',
    title: string,
    message: string,
    appointmentId?: string
  ) => {
    const hasEmail = Boolean(client.email && client.email.trim());
    const channel: 'EMAIL' | 'SMS' = hasEmail ? 'EMAIL' : 'SMS';
    const recipient = hasEmail ? (client.email as string) : (client.phone || '(Sem Contato)');

    const newNotif: NotificationLog = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      channel,
      recipient,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ENVIADO',
      appointmentId
    };

    setNotifications((prev) => [newNotif, ...prev]);
    return newNotif;
  };

  // Reenviar notificação
  const resendNotification = (notificationId: string) => {
    const notif = notifications.find((n) => n.id === notificationId);
    if (!notif) return { success: false, message: 'Notificação não encontrada.' };

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              status: 'ENVIADO',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : n
      )
    );
    return { success: true, message: `Notificação reenviada com sucesso para ${notif.recipient} via ${notif.channel}!` };
  };

  // Alternar ator ativo no painel de navegação
  const handleSetActiveActorView = (actor: ActorType) => {
    setActiveActorView(actor);
    if (actor === 'cliente' || actor === 'recepcionista' || actor === 'barbeiro' || actor === 'administrador') {
      const targetUser = users.find((u) => u.role === actor && u.active);
      if (targetUser) {
        setCurrentUser(targetUser);
      }
    }
  };

  // Switch Role
  const switchRole = (role: UserRole) => {
    handleSetActiveActorView(role);
  };

  // Ativar / Inativar usuário (para testar RF-02 e RF-08)
  const toggleUserActive = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Usuário não encontrado.' };

    const newActive = !user.active;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, active: newActive } : u)));

    // Se o usuário atual for desativado e estiver logado, avisa
    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, active: newActive }));
    }

    return {
      success: true,
      message: `Status do usuário "${user.name}" alterado para ${newActive ? 'ATIVO' : 'INATIVO'}.`
    };
  };

  // RF-01: Criar Conta de Cliente
  const registerClient = (data: {
    name: string;
    login: string;
    email?: string;
    phone?: string;
    password: string;
  }) => {
    const { name, login, email, phone, password } = data;

    if (!name.trim()) {
      return { success: false, message: 'Por favor, informe o seu nome completo.' };
    }
    if (!login.trim()) {
      return { success: false, message: 'Por favor, defina um login de usuário único.' };
    }
    const cleanLogin = login.trim().toLowerCase();

    // Validar login único
    const loginExists = users.some((u) => u.login?.toLowerCase() === cleanLogin);
    if (loginExists) {
      return { success: false, message: 'Este login já está em uso por outro usuário. Escolha outro.' };
    }

    // Ao menos um canal de contato (e-mail ou telefone)
    const cleanEmail = email?.trim().toLowerCase() || '';
    const cleanPhone = phone?.trim() || '';
    if (!cleanEmail && !cleanPhone) {
      return { success: false, message: 'Informe ao menos um canal de contato válido (e-mail ou telefone).' };
    }

    // Política de senha RNF-03
    const passwordCheck = validatePasswordPolicy(password);
    if (!passwordCheck.valid) {
      return { success: false, message: passwordCheck.message };
    }

    const newUser: User = {
      id: `user-client-${Date.now()}`,
      login: cleanLogin,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password,
      role: 'cliente',
      active: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    dispatchClientNotification(
      newUser,
      'CRIACAO',
      'Conta Criada com Sucesso',
      `Olá ${newUser.name}! Sua conta de cliente foi criada com o login "${cleanLogin}". Seja bem-vindo à Barbearia!`
    );

    return { success: true, message: 'Conta criada com sucesso!', user: newUser };
  };

  // RF-02: Autenticar Usuário
  const loginUser = (loginOrChannel: string, password?: string) => {
    const term = loginOrChannel.trim().toLowerCase();

    // Busca por login, e-mail ou telefone
    const user = users.find(
      (u) =>
        u.login?.toLowerCase() === term ||
        u.email?.toLowerCase() === term ||
        u.phone?.replace(/\D/g, '') === term.replace(/\D/g, '')
    );

    // Critério: "Se o login ou a senha estiverem incorretos, o sistema não autentica e exibe a mensagem: 'Login ou senha inválidos'."
    if (!user) {
      return { success: false, message: 'Login ou senha inválidos' };
    }

    if (user.password && password && user.password !== password) {
      return { success: false, message: 'Login ou senha inválidos' };
    }

    // Critério: "Se o usuário estiver com o status inativo, o sistema bloqueia o acesso e exibe a mensagem: 'Usuário inativo, fale com o administrador'."
    if (!user.active) {
      return { success: false, message: 'Usuário inativo, fale com o administrador' };
    }

    setCurrentUser(user);
    handleSetActiveActorView(user.role);

    return {
      success: true,
      message: `Bem-vindo de volta, ${user.name}!`,
      user
    };
  };

  // RF-03: Recuperar Senha
  const recoverPassword = (login: string, contactChannel: string) => {
    const cleanLogin = login.trim().toLowerCase();
    const cleanChannel = contactChannel.trim().toLowerCase();

    // Critério: "O sistema deve solicitar o login e ao menos um canal de contato (e-mail ou telefone). Se nenhum canal for informado, o sistema não avança."
    if (!cleanLogin) {
      return { success: false, message: 'Por favor, informe seu login de acesso.' };
    }
    if (!cleanChannel) {
      return { success: false, message: 'Informe ao menos um canal de contato (e-mail ou telefone).' };
    }

    const user = users.find((u) => u.login?.toLowerCase() === cleanLogin);

    // Critério: "Se os dados informados não correspondem, nada é enviado."
    if (!user) {
      return {
        success: true,
        message: 'Se os dados informados correspondem a uma conta cadastrada, um link de recuperação foi enviado.'
      };
    }

    const emailMatches = user.email && user.email.toLowerCase() === cleanChannel;
    const phoneMatches = user.phone && user.phone.replace(/\D/g, '') === cleanChannel.replace(/\D/g, '');

    if (!emailMatches && !phoneMatches) {
      // Não corresponde: nada é enviado
      return {
        success: true,
        message: 'Se os dados informados correspondem a uma conta cadastrada, um link de recuperação foi enviado.'
      };
    }

    // Enviar link seguro pelo canal correspondente
    const recoveryLink = `https://barbearia.app/redefinir-senha?token=rec_${Date.now()}`;
    const channelType = emailMatches ? 'EMAIL' : 'SMS';
    const recipient = emailMatches ? user.email : user.phone;

    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      type: 'REAGENDAMENTO', // Recuperação de credencial
      channel: channelType,
      recipient,
      title: 'Recuperação de Senha - Link de Redefinição',
      message: `Olá ${user.name}, acesse o link para criar uma nova senha: ${recoveryLink}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ENVIADO'
    };

    setNotifications((prev) => [notif, ...prev]);

    return {
      success: true,
      message: `Link de recuperação enviado com sucesso via ${channelType} para ${recipient}!`
    };
  };

  // Alias prático para redefinição por e-mail ou telefone
  const resetPassword = (identifier: string) => {
    const term = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email?.toLowerCase() === term ||
        u.login?.toLowerCase() === term ||
        u.phone?.replace(/\D/g, '') === term.replace(/\D/g, '')
    );
    if (!user) {
      return {
        success: true,
        message: 'Se os dados informados correspondem a uma conta cadastrada, um link de recuperação foi enviado.'
      };
    }
    return recoverPassword(user.login, user.email || user.phone);
  };

  // RF-04: Redefinir Senha no Perfil
  const changePasswordInProfile = (userId: string, currentPass: string, newPass: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return { success: false, message: 'Usuário não encontrado.' };

    if (user.password && user.password !== currentPass) {
      return { success: false, message: 'A senha atual informada está incorreta.' };
    }

    const validation = validatePasswordPolicy(newPass);
    if (!validation.valid) {
      return { success: false, message: validation.message };
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, password: newPass, firstAccessPending: false }
          : u
      )
    );

    if (currentUser.id === userId) {
      setCurrentUser((prev) => ({ ...prev, password: newPass, firstAccessPending: false }));
    }

    return {
      success: true,
      message: 'Senha alterada com sucesso! Suas outras sessões foram encerradas com segurança.'
    };
  };

  // RF-12: Cadastrar Cliente no Balcão (Recepcionista)
  const registerWalkInClient = (data: {
    login: string;
    name: string;
    email?: string;
    phone?: string;
  }) => {
    const { login, name, email, phone } = data;

    if (!name.trim()) return { success: false, message: 'Informe o nome completo do cliente.', firstAccessLink: '' };
    if (!login.trim()) return { success: false, message: 'Informe o login do cliente.', firstAccessLink: '' };

    const cleanLogin = login.trim().toLowerCase();
    const loginExists = users.some((u) => u.login?.toLowerCase() === cleanLogin);
    if (loginExists) {
      return { success: false, message: 'Este login já está cadastrado para outro cliente.', firstAccessLink: '' };
    }

    const cleanEmail = email?.trim().toLowerCase() || '';
    const cleanPhone = phone?.trim() || '';
    if (!cleanEmail && !cleanPhone) {
      return { success: false, message: 'Informe ao menos um canal de contato (e-mail ou telefone).', firstAccessLink: '' };
    }

    const firstAccessLink = `https://barbearia.app/primeiro-acesso?token=cli_${Date.now()}`;

    const newClient: User = {
      id: `user-client-${Date.now()}`,
      login: cleanLogin,
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      role: 'cliente',
      active: true,
      firstAccessPending: true, // Senha fica indefinida até que ele crie pelo link
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    setUsers((prev) => [...prev, newClient]);

    dispatchClientNotification(
      newClient,
      'CRIACAO',
      'Bem-vindo! Crie sua senha de acesso',
      `Olá ${newClient.name}, seu cadastro no balcão foi realizado com o login "${cleanLogin}". Crie sua senha no link: ${firstAccessLink}`
    );

    return {
      success: true,
      message: `Cliente ${newClient.name} cadastrado no balcão com sucesso! Já está disponível para agendamentos.`,
      firstAccessLink,
      user: newClient
    };
  };

  // Multi-perfil manual (para avaliações)
  const registerUser = (data: {
    role: UserRole;
    name: string;
    login?: string;
    email: string;
    phone: string;
    password?: string;
    bio?: string;
    serviceIds?: string[];
    shift?: string;
    companyName?: string;
    adminCode?: string;
  }) => {
    const { role, name, login, email, phone, password } = data;
    if (!name.trim()) {
      return { success: false, message: 'Nome é obrigatório.' };
    }
    const cleanLogin = (login || email.split('@')[0] || name.toLowerCase().replace(/\s+/g, '.')).trim().toLowerCase();
    if (users.some((u) => u.login?.toLowerCase() === cleanLogin)) {
      return { success: false, message: 'Este login já está em uso.' };
    }

    const newId = `user-${role}-${Date.now()}`;
    const newUser: User = {
      id: newId,
      login: cleanLogin,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      active: true,
      password: password || 'Navalha@2026',
      bio: data.bio?.trim(),
      shift: data.shift?.trim(),
      companyName: data.companyName?.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    if (role === 'barbeiro') {
      const selectedServiceIds = data.serviceIds && data.serviceIds.length > 0 ? data.serviceIds : services.map((s) => s.id);
      setServices((prev) =>
        prev.map((s) => {
          if (selectedServiceIds.includes(s.id) && !s.barberIds.includes(newId)) {
            return { ...s, barberIds: [...s.barberIds, newId] };
          }
          return s;
        })
      );

      const defaultSchedule = INITIAL_BARBER_SCHEDULES[0].weeklySchedule;
      setBarberSchedules((prev) => [
        ...prev,
        {
          barberId: newId,
          toleranceMinutes: 15,
          weeklySchedule: JSON.parse(JSON.stringify(defaultSchedule))
        }
      ]);
    }

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    return { success: true, message: 'Usuário cadastrado com sucesso!', user: newUser };
  };

  // RF-10: Checagem de disponibilidade de horário
  const isTimeSlotAvailable = (
    date: string,
    startTime: string,
    durationMinutes: number,
    barberId: string,
    excludeAppointmentId?: string
  ): boolean => {
    const slotStartMin = timeToMinutes(startTime);
    const slotEndMin = slotStartMin + durationMinutes;

    const dateObj = new Date(`${date}T12:00:00`);
    const dayOfWeek = dateObj.getDay();

    const scheduleObj = barberSchedules.find((s) => s.barberId === barberId);
    const daySchedule = scheduleObj?.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.active) {
      return false;
    }

    const workStartMin = timeToMinutes(daySchedule.startTime);
    const workEndMin = timeToMinutes(daySchedule.endTime);

    if (slotStartMin < workStartMin || slotEndMin > workEndMin) {
      return false;
    }

    if (daySchedule.breakStart && daySchedule.breakEnd) {
      const breakStartMin = timeToMinutes(daySchedule.breakStart);
      const breakEndMin = timeToMinutes(daySchedule.breakEnd);
      const overlapWithBreak = Math.max(slotStartMin, breakStartMin) < Math.min(slotEndMin, breakEndMin);
      if (overlapWithBreak) return false;
    }

    // Não colide com agendamentos ativos
    const activeStatuses: AppointmentStatus[] = ['AGENDADO', 'CONFIRMADO', 'REALIZADO'];
    const conflicting = appointments.some((apt) => {
      if (apt.id === excludeAppointmentId) return false;
      if (apt.barberId !== barberId || apt.date !== date) return false;
      if (!activeStatuses.includes(apt.status)) return false;

      const aptStartMin = timeToMinutes(apt.startTime);
      const aptEndMin = timeToMinutes(apt.endTime);
      return Math.max(slotStartMin, aptStartMin) < Math.min(slotEndMin, aptEndMin);
    });

    return !conflicting;
  };

  // RF-10: Consultar disponibilidade filtrando por serviço e profissional
  const getAvailableSlots = (date: string, serviceId: string, barberId?: string): AvailableSlot[] => {
    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService) return [];

    const duration = selectedService.durationMinutes;
    const candidateBarbers = barberId
      ? barbers.filter((b) => b.id === barberId && selectedService.barberIds.includes(b.id) && b.active)
      : barbers.filter((b) => selectedService.barberIds.includes(b.id) && b.active);

    const availableSlots: AvailableSlot[] = [];
    const dateObj = new Date(`${date}T12:00:00`);
    const dayOfWeek = dateObj.getDay();

    candidateBarbers.forEach((barber) => {
      const scheduleObj = barberSchedules.find((s) => s.barberId === barber.id);
      const daySchedule = scheduleObj?.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

      if (!daySchedule || !daySchedule.active) return;

      const workStartMin = timeToMinutes(daySchedule.startTime);
      const workEndMin = timeToMinutes(daySchedule.endTime);

      const step = 30; // intervalos de 30 min
      for (let timeMin = workStartMin; timeMin + duration <= workEndMin; timeMin += step) {
        const timeStr = minutesToTime(timeMin);
        const free = isTimeSlotAvailable(date, timeStr, duration, barber.id);

        if (free) {
          availableSlots.push({
            time: timeStr,
            barberId: barber.id,
            barberName: barber.name,
            barberAvatar: barber.avatar,
            isAvailable: true
          });
        }
      }
    });

    // Ordenar cronologicamente
    availableSlots.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
    return availableSlots;
  };

  // RF-11 & RF-13: Criar Agendamento (conclui em status AGENDADO)
  const createAppointment = (data: {
    serviceId: string;
    barberId: string;
    date: string;
    startTime: string;
    clientId?: string;
    clientLogin?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  }) => {
    const service = services.find((s) => s.id === data.serviceId);
    if (!service) return { success: false, message: 'Serviço não encontrado.' };

    const barber = users.find((u) => u.id === data.barberId && u.role === 'barbeiro');
    if (!barber) return { success: false, message: 'Profissional não encontrado.' };

    const available = isTimeSlotAvailable(data.date, data.startTime, service.durationMinutes, data.barberId);
    if (!available) {
      return {
        success: false,
        message: 'O horário selecionado acabou de ser ocupado. Escolha outro horário disponível.'
      };
    }

    const startMin = timeToMinutes(data.startTime);
    const endMin = startMin + service.durationMinutes;
    const endTime = minutesToTime(endMin);

    // Identificar cliente
    let client: User | undefined;
    if (data.clientId) {
      client = users.find((u) => u.id === data.clientId);
    } else if (data.clientLogin) {
      client = users.find((u) => u.login?.toLowerCase() === data.clientLogin?.toLowerCase());
    } else {
      client = currentUser.role === 'cliente' ? currentUser : undefined;
    }

    const clientName = data.clientName || client?.name || 'Cliente';
    const clientEmail = data.clientEmail || client?.email || '';
    const clientPhone = data.clientPhone || client?.phone || '';
    const clientLogin = client?.login || data.clientLogin || '';

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: client?.id || `client-${Date.now()}`,
      clientLogin,
      clientName,
      clientEmail,
      clientPhone,
      barberId: data.barberId,
      serviceId: data.serviceId,
      date: data.date,
      startTime: data.startTime,
      endTime,
      status: 'AGENDADO', // Conforme especificação: status inicial é sempre AGENDADO
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // RF-24: Notificar cliente
    dispatchClientNotification(
      { email: clientEmail, phone: clientPhone, name: clientName },
      'CRIACAO',
      'Agendamento Realizado',
      `Olá ${clientName}! Seu agendamento para ${service.name} no dia ${data.date} às ${data.startTime} com ${barber.name} foi criado com sucesso (Status: AGENDADO).`,
      newAppointment.id
    );

    return {
      success: true,
      message: 'Agendamento realizado com sucesso!',
      appointment: newAppointment
    };
  };

  // RF-15: Reagendar
  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newStartTime: string,
    newBarberId: string,
    reason?: string
  ) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (apt.status !== 'AGENDADO' && apt.status !== 'CONFIRMADO') {
      return { success: false, message: 'Apenas agendamentos em status AGENDADO ou CONFIRMADO podem ser reagendados.' };
    }

    const service = services.find((s) => s.id === apt.serviceId);
    if (!service) return { success: false, message: 'Serviço não encontrado.' };

    const barber = users.find((u) => u.id === newBarberId);
    if (!barber) return { success: false, message: 'Profissional não encontrado.' };

    const free = isTimeSlotAvailable(newDate, newStartTime, service.durationMinutes, newBarberId, apt.id);
    if (!free) {
      return { success: false, message: 'O horário selecionado não está mais disponível para este profissional.' };
    }

    const startMin = timeToMinutes(newStartTime);
    const endMin = startMin + service.durationMinutes;
    const newEndTime = minutesToTime(endMin);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              barberId: newBarberId,
              status: 'AGENDADO', // Volta para AGENDADO
              rescheduleReason: reason?.trim() || 'Reagendado pelo usuário',
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    // RF-24: Notificar cliente
    dispatchClientNotification(
      { email: apt.clientEmail, phone: apt.clientPhone, name: apt.clientName },
      'REAGENDAMENTO',
      'Agendamento Reagendado',
      `Olá ${apt.clientName}! Seu agendamento de ${service.name} foi alterado para ${newDate} às ${newStartTime} com ${barber.name}.`,
      apt.id
    );

    return { success: true, message: 'Agendamento reagendado com sucesso!' };
  };

  // RF-16: Cancelar Agendamento
  const cancelAppointment = (id: string, reason?: string, cancelledByRole?: UserRole) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (apt.status !== 'AGENDADO' && apt.status !== 'CONFIRMADO') {
      return { success: false, message: 'Apenas agendamentos em status AGENDADO ou CONFIRMADO podem ser cancelados.' };
    }

    const role = cancelledByRole || currentUser.role;

    // Se recepcionista, motivo é obrigatório
    if (role === 'recepcionista' && (!reason || !reason.trim())) {
      return { success: false, message: 'O motivo do cancelamento é obrigatório para a recepcionista.' };
    }

    const finalReason = reason?.trim() || (role === 'cliente' ? 'Cancelado a pedido do cliente' : 'Cancelado pela barbearia');
    const cancellerName = currentUser.name || (role === 'cliente' ? apt.clientName : 'Recepção');

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'CANCELADO',
              cancellationReason: finalReason,
              cancelledByRole: role,
              cancelledBy: cancellerName,
              cancelledAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    const service = services.find((s) => s.id === apt.serviceId);

    // RF-24: Notificar cliente
    dispatchClientNotification(
      { email: apt.clientEmail, phone: apt.clientPhone, name: apt.clientName },
      'CANCELAMENTO',
      'Agendamento Cancelado',
      `Olá ${apt.clientName}, seu agendamento de ${service?.name || 'serviço'} do dia ${apt.date} às ${apt.startTime} foi cancelado. Motivo: ${finalReason}.`,
      apt.id
    );

    return { success: true, message: 'Agendamento cancelado com sucesso.' };
  };

  // RF-17: Cancelar em Lote (Recepcionista)
  const cancelBatchAppointments = (barberId: string, startDate: string, endDate: string, reason: string) => {
    if (!reason.trim()) {
      return { success: false, message: 'O motivo do cancelamento em lote é obrigatório.', affectedCount: 0 };
    }

    const barber = users.find((u) => u.id === barberId);
    if (!barber) return { success: false, message: 'Barbeiro não encontrado.', affectedCount: 0 };

    const affectedApts = appointments.filter((a) => {
      if (a.barberId !== barberId) return false;
      if (a.status !== 'AGENDADO' && a.status !== 'CONFIRMADO') return false;
      return a.date >= startDate && a.date <= endDate;
    });

    if (affectedApts.length === 0) {
      return {
        success: true,
        message: 'Nenhum agendamento futuro ativo encontrado para este barbeiro no período selecionado.',
        affectedCount: 0
      };
    }

    const batchId = `batch-${Date.now()}`;
    const affectedIds = affectedApts.map((a) => a.id);

    setAppointments((prev) =>
      prev.map((a) => {
        if (affectedIds.includes(a.id)) {
          return {
            ...a,
            status: 'CANCELADO',
            cancellationReason: `Cancelamento em Lote: ${reason.trim()}`,
            cancelledByRole: 'recepcionista',
            cancelledBy: currentUser.name,
            cancelledAt: new Date().toISOString(),
            batchCancellationId: batchId,
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      })
    );

    // RF-24: Notificar cada cliente afetado
    affectedApts.forEach((apt) => {
      dispatchClientNotification(
        { email: apt.clientEmail, phone: apt.clientPhone, name: apt.clientName },
        'CANCELAMENTO',
        'Aviso de Cancelamento de Horário',
        `Olá ${apt.clientName}, devido a imprevisto com o profissional ${barber.name} (${reason.trim()}), seu agendamento em ${apt.date} às ${apt.startTime} foi cancelado. Por favor, acesse o sistema para reagendar sem custo.`,
        apt.id
      );
    });

    const batchRecord: BatchCancellationRecord = {
      id: batchId,
      barberId,
      barberName: barber.name,
      startDate,
      endDate,
      reason: reason.trim(),
      cancelledCount: affectedApts.length,
      createdAt: new Date().toISOString(),
      affectedAppointmentIds: affectedIds
    };

    setBatchCancellations((prev) => [batchRecord, ...prev]);

    return {
      success: true,
      message: `${affectedApts.length} agendamento(s) cancelado(s) em lote e clientes notificados!`,
      affectedCount: affectedApts.length
    };
  };

  // RF-20: Confirmar Presença (Recepcionista)
  const confirmAttendance = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (apt.status === 'CONFIRMADO') {
      return { success: false, message: 'A presença deste cliente já foi confirmada anteriormente.' };
    }

    if (apt.status !== 'AGENDADO') {
      return { success: false, message: `Não é possível confirmar presença para agendamento com status "${apt.status}".` };
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'CONFIRMADO',
              confirmedBy: currentUser.name,
              confirmedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    return { success: true, message: `Presença de ${apt.clientName} confirmada com sucesso!` };
  };

  // RF-21: Finalizar Atendimento (Barbeiro)
  const finishService = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (apt.status === 'AGENDADO') {
      return {
        success: false,
        message: 'Atendimento só pode ser finalizado após a confirmação de presença na recepção (status deve ser CONFIRMADO).'
      };
    }

    if (apt.status === 'REALIZADO' || apt.status === 'PAGO') {
      return { success: false, message: 'Este atendimento já foi finalizado anteriormente.' };
    }

    if (apt.status !== 'CONFIRMADO') {
      return { success: false, message: `Não é possível finalizar um agendamento com status "${apt.status}".` };
    }

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'REALIZADO',
              completedBy: currentUser.name,
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    return {
      success: true,
      message: `Atendimento de ${apt.clientName} concluído com sucesso! Liberado para pagamento na recepção.`
    };
  };

  // RF-22: Registrar Pagamento (Recepcionista)
  const registerPayment = (id: string, method: PaymentMethod, _customAmount?: number) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (apt.status === 'PAGO') {
      return { success: false, message: 'O pagamento deste agendamento já foi registrado anteriormente.' };
    }

    if (apt.status !== 'REALIZADO') {
      return {
        success: false,
        message: 'Apenas atendimentos já concluídos pelo profissional (status REALIZADO) podem receber pagamento.'
      };
    }

    const service = services.find((s) => s.id === apt.serviceId);
    // Valor é o pré-definido do serviço, sem edição pelo recepcionista
    const exactAmount = service ? service.price : (apt.paymentAmount || 50.0);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'PAGO',
              paymentMethod: method,
              paymentAmount: exactAmount,
              paidAt: new Date().toISOString(),
              paidBy: currentUser.name,
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    dispatchClientNotification(
      { email: apt.clientEmail, phone: apt.clientPhone, name: apt.clientName },
      'REAGENDAMENTO',
      'Comprovante de Pagamento',
      `Obrigado ${apt.clientName}! Confirmamos o recebimento de R$ ${exactAmount.toFixed(2)} via ${method}. Até a próxima!`
    );

    return {
      success: true,
      message: `Pagamento de R$ ${exactAmount.toFixed(2)} (${method}) registrado com sucesso!`
    };
  };

  // RF-06: Cadastrar Barbeiro (Admin)
  const addBarber = (data: {
    login: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    serviceIds: string[];
    avatar?: string;
  }) => {
    if (!data.name.trim()) return { success: false, message: 'Nome do barbeiro é obrigatório.', firstAccessLink: '' };
    if (!data.login.trim()) return { success: false, message: 'Login do barbeiro é obrigatório.', firstAccessLink: '' };

    const cleanLogin = data.login.trim().toLowerCase();
    if (users.some((u) => u.login?.toLowerCase() === cleanLogin)) {
      return { success: false, message: 'Já existe um usuário com este login.', firstAccessLink: '' };
    }

    if (!data.serviceIds || data.serviceIds.length === 0) {
      return { success: false, message: 'Selecione ao menos 1 serviço que este profissional está apto a realizar.', firstAccessLink: '' };
    }

    const newBarberId = `user-barber-${Date.now()}`;
    const firstAccessLink = `https://barbearia.app/primeiro-acesso?token=barber_${Date.now()}`;

    const newBarber: User = {
      id: newBarberId,
      login: cleanLogin,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'barbeiro',
      bio: data.bio.trim(),
      active: true,
      firstAccessPending: true,
      serviceIds: data.serviceIds,
      avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`
    };

    setUsers((prev) => [...prev, newBarber]);

    setServices((prev) =>
      prev.map((s) => {
        if (data.serviceIds.includes(s.id) && !s.barberIds.includes(newBarberId)) {
          return { ...s, barberIds: [...s.barberIds, newBarberId] };
        }
        return s;
      })
    );

    const defaultSchedule = INITIAL_BARBER_SCHEDULES[0].weeklySchedule;
    setBarberSchedules((prev) => [
      ...prev,
      {
        barberId: newBarberId,
        toleranceMinutes: 15,
        weeklySchedule: JSON.parse(JSON.stringify(defaultSchedule))
      }
    ]);

    dispatchClientNotification(
      newBarber,
      'CRIACAO',
      'Cadastro de Barbeiro - Primeiro Acesso',
      `Olá ${newBarber.name}! Você foi cadastrado como barbeiro (Login: ${cleanLogin}). Defina sua senha no link: ${firstAccessLink}`
    );

    return {
      success: true,
      message: `Barbeiro ${data.name} cadastrado com sucesso! Link de primeiro acesso gerado.`,
      firstAccessLink
    };
  };

  // RF-07: Cadastrar Recepcionista (Admin)
  const addReceptionist = (data: { login: string; name: string; email: string; phone: string }) => {
    if (!data.name.trim()) return { success: false, message: 'Nome da recepcionista é obrigatório.', firstAccessLink: '' };
    if (!data.login.trim()) return { success: false, message: 'Login é obrigatório.', firstAccessLink: '' };

    const cleanLogin = data.login.trim().toLowerCase();
    if (users.some((u) => u.login?.toLowerCase() === cleanLogin)) {
      return { success: false, message: 'Já existe um usuário com este login.', firstAccessLink: '' };
    }

    const firstAccessLink = `https://barbearia.app/primeiro-acesso?token=rec_${Date.now()}`;

    const newReceptionist: User = {
      id: `user-rec-${Date.now()}`,
      login: cleanLogin,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'recepcionista',
      active: true,
      firstAccessPending: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`
    };

    setUsers((prev) => [...prev, newReceptionist]);

    dispatchClientNotification(
      newReceptionist,
      'CRIACAO',
      'Cadastro de Recepcionista - Primeiro Acesso',
      `Olá ${newReceptionist.name}! Você foi cadastrada como recepcionista (Login: ${cleanLogin}). Defina sua senha no link: ${firstAccessLink}`
    );

    return {
      success: true,
      message: `Recepcionista ${data.name} cadastrada com sucesso! Link de primeiro acesso gerado.`,
      firstAccessLink
    };
  };

  // RF-05: Cadastrar Serviços (Admin)
  const addService = (data: {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    barberIds: string[];
  }) => {
    if (!data.name.trim() || data.price <= 0 || data.durationMinutes <= 0) {
      return { success: false, message: 'Preencha nome, preço positivo e estimativa de duração válidos.' };
    }

    const nameExists = services.some((s) => s.name.toLowerCase() === data.name.trim().toLowerCase());
    if (nameExists) {
      return { success: false, message: 'Já existe um serviço cadastrado com este nome.' };
    }

    const newService: ServiceItem = {
      id: `serv-${Date.now()}`,
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      durationMinutes: data.durationMinutes,
      barberIds: data.barberIds.length > 0 ? data.barberIds : barbers.map((b) => b.id)
    };

    setServices((prev) => [...prev, newService]);
    return { success: true, message: `Serviço "${newService.name}" cadastrado com sucesso!` };
  };

  const updateService = (id: string, data: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // RF-08: Definir Horários de Trabalho (Admin)
  const updateBarberSchedule = (barberId: string, weeklySchedule: WorkingDaySchedule[], toleranceMinutes: number) => {
    const barber = users.find((u) => u.id === barberId);
    if (!barber) return { success: false, message: 'Barbeiro não encontrado.' };

    if (!barber.active) {
      return { success: false, message: 'Não é possível definir horários de trabalho para um barbeiro inativo.' };
    }

    // Validar horário de término posterior ao início
    for (const day of weeklySchedule) {
      if (day.active) {
        const startMin = timeToMinutes(day.startTime);
        const endMin = timeToMinutes(day.endTime);
        if (endMin <= startMin) {
          return { success: false, message: 'O horário de término deve ser estritamente posterior ao horário de início em todos os dias ativos.' };
        }
      }
    }

    setBarberSchedules((prev) => {
      const idx = prev.findIndex((s) => s.barberId === barberId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { barberId, weeklySchedule, toleranceMinutes };
        return next;
      }
      return [...prev, { barberId, weeklySchedule, toleranceMinutes }];
    });

    return { success: true, message: `Jornada de trabalho de ${barber.name} atualizada com sucesso!` };
  };

  // RF-23: Ator: Tempo — Cancelar Automaticamente Após a Tolerância de 15 min
  const runToleranceCheck = (simulatedMinutesOffset: number = 0) => {
    const today = new Date().toISOString().split('T')[0];
    const realMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    const evaluatedTimeMinutes = realMinutes + simulatedMinutesOffset;
    const evaluatedTimeStr = minutesToTime(evaluatedTimeMinutes % 1440);

    let expiredCount = 0;
    const detailsList: string[] = [];
    const newAuditRecords: ToleranceAuditRecord[] = [];

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.date !== today) return apt;

        const aptStartMin = timeToMinutes(apt.startTime);
        const diffMinutes = evaluatedTimeMinutes - aptStartMin;

        // Se o status for CONFIRMADO, REALIZADO ou PAGO, é imune
        if (apt.status === 'CONFIRMADO') {
          if (diffMinutes > 15) {
            newAuditRecords.push({
              id: `tol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              appointmentId: apt.id,
              clientName: apt.clientName,
              serviceName: services.find((s) => s.id === apt.serviceId)?.name || 'Serviço',
              barberName: users.find((u) => u.id === apt.barberId)?.name || 'Barbeiro',
              scheduledTime: apt.startTime,
              evaluatedAt: evaluatedTimeStr,
              minutesOverdue: diffMinutes,
              action: 'IGNORADO_PRESENCA_CONFIRMADA',
              details: `Presença confirmada pela recepção às ${apt.confirmedAt ? new Date(apt.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'tempo hábil'}. Imune à tolerância.`
            });
          }
          return apt;
        }

        // Se o status for AGENDADO e já passou 15 minutos do horário de início
        if (apt.status === 'AGENDADO' && diffMinutes > 15) {
          expiredCount++;
          const reason = 'não comparecimento';

          detailsList.push(
            `Agendamento de ${apt.clientName} às ${apt.startTime} cancelado por não comparecimento (+${diffMinutes} min sem confirmação).`
          );

          newAuditRecords.push({
            id: `tol-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            appointmentId: apt.id,
            clientName: apt.clientName,
            serviceName: services.find((s) => s.id === apt.serviceId)?.name || 'Serviço',
            barberName: users.find((u) => u.id === apt.barberId)?.name || 'Barbeiro',
            scheduledTime: apt.startTime,
            evaluatedAt: evaluatedTimeStr,
            minutesOverdue: diffMinutes,
            action: 'CANCELADO_POR_TOLERANCIA',
            details: `Sem confirmação de presença após 15 minutos do início (${diffMinutes} min de atraso). Status alterado para CANCELADO por "não comparecimento".`
          });

          // Notificar o cliente (RF-24)
          dispatchClientNotification(
            { email: apt.clientEmail, phone: apt.clientPhone, name: apt.clientName },
            'TOLERANCIA_EXPIRADA',
            'Cancelamento por Não Comparecimento',
            `Olá ${apt.clientName}, o período de tolerância de 15 minutos para seu agendamento de hoje às ${apt.startTime} expirou sem registro de presença. O horário foi cancelado por não comparecimento.`,
            apt.id
          );

          return {
            ...apt,
            status: 'CANCELADO' as AppointmentStatus,
            cancellationReason: reason,
            cancelledByRole: 'tempo',
            cancelledBy: 'Rotina de Tolerância (Ator Tempo)',
            cancelledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }

        return apt;
      })
    );

    if (newAuditRecords.length > 0) {
      setToleranceAudit((prev) => [...newAuditRecords, ...prev]);
    }

    return { expiredCount, details: detailsList };
  };

  // Reset demo
  const resetAllData = () => {
    localStorage.removeItem('barber_users');
    localStorage.removeItem('barber_current_user');
    localStorage.removeItem('barber_services');
    localStorage.removeItem('barber_schedules');
    localStorage.removeItem('barber_appointments');
    localStorage.removeItem('barber_notifications');
    localStorage.removeItem('barber_batch_cancellations');
    localStorage.removeItem('barber_tolerance_audit');

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setServices(INITIAL_SERVICES);
    setBarberSchedules(INITIAL_BARBER_SCHEDULES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBatchCancellations([]);
    setToleranceAudit(INITIAL_TOLERANCE_AUDIT);
    setActiveActorView('cliente');
  };

  return (
    <AppContext.Provider
      value={{
        activeActorView,
        setActiveActorView: handleSetActiveActorView,
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        toggleUserActive,
        registerClient,
        loginUser,
        recoverPassword,
        resetPassword,
        changePasswordInProfile,
        registerWalkInClient,
        registerUser,
        services,
        barbers,
        receptionists,
        clients,
        appointments,
        barberSchedules,
        notifications,
        batchCancellations,
        toleranceAudit,
        getAvailableSlots,
        isTimeSlotAvailable,
        createAppointment,
        rescheduleAppointment,
        cancelAppointment,
        cancelBatchAppointments,
        confirmAttendance,
        finishService,
        registerPayment,
        addBarber,
        addReceptionist,
        addService,
        updateService,
        deleteService,
        updateBarberSchedule,
        runToleranceCheck,
        resendNotification,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
