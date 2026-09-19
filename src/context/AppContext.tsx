import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  ServiceItem,
  BarberWorkingHours,
  Appointment,
  AppointmentStatus,
  PaymentMethod,
  NotificationLog,
  BatchCancellationRecord,
  WorkingDaySchedule
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_BARBER_SCHEDULES,
  INITIAL_APPOINTMENTS,
  INITIAL_NOTIFICATIONS
} from '../mockData';

interface AvailableSlot {
  time: string;
  formatted: string;
  barberId: string;
  barberName: string;
}

interface AppContextType {
  // Auth & Roles
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  registerClient: (name: string, email: string, phone: string, password?: string) => { success: boolean; message: string; user?: User };
  registerUser: (data: {
    role: UserRole;
    name: string;
    email: string;
    phone: string;
    password?: string;
    bio?: string;
    serviceIds?: string[];
    shift?: string;
    companyName?: string;
    adminCode?: string;
  }) => { success: boolean; message: string; user?: User };
  loginUser: (email: string, password?: string) => { success: boolean; message: string; user?: User };
  resetPassword: (identifier: string) => { success: boolean; message: string };

  // Data
  services: ServiceItem[];
  barbers: User[];
  receptionists: User[];
  appointments: Appointment[];
  barberSchedules: BarberWorkingHours[];
  notifications: NotificationLog[];
  batchCancellations: BatchCancellationRecord[];

  // Availability query (RF-05, RNF-01, RNF-02, RNF-08)
  getAvailableSlots: (date: string, serviceId: string, barberId?: string) => AvailableSlot[];
  isTimeSlotAvailable: (date: string, startTime: string, durationMinutes: number, barberId: string, excludeAppointmentId?: string) => boolean;

  // Appointment Actions (RF-04, RF-10, RF-11, RF-12, RF-13, RF-14, RF-15, RF-16)
  createAppointment: (data: {
    serviceId: string;
    barberId: string;
    date: string;
    startTime: string;
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  }) => { success: boolean; message: string; appointment?: Appointment };

  cancelAppointment: (id: string, reason: string, cancelledByRole: UserRole) => { success: boolean; message: string };
  rescheduleAppointment: (id: string, newDate: string, newStartTime: string, newBarberId: string, reason: string) => { success: boolean; message: string };
  confirmAttendance: (id: string) => { success: boolean; message: string };
  finishService: (id: string) => { success: boolean; message: string };
  registerPayment: (id: string, method: PaymentMethod, amount: number) => { success: boolean; message: string };
  markNoShow: (id: string, reason?: string) => { success: boolean; message: string };
  cancelBatchAppointments: (barberId: string, startDate: string, endDate: string, reason: string) => { success: boolean; message: string; affectedCount: number };

  // Admin Management Actions (RF-06, RF-07, RF-08, RF-17)
  addBarber: (data: { name: string; email: string; phone: string; bio: string; serviceIds: string[] }) => { success: boolean; message: string; firstAccessLink: string };
  addReceptionist: (data: { name: string; email: string; phone: string }) => { success: boolean; message: string; firstAccessLink: string };
  addService: (data: { name: string; description: string; price: number; durationMinutes: number; barberIds: string[] }) => { success: boolean; message: string };
  updateService: (id: string, data: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  updateBarberSchedule: (barberId: string, weeklySchedule: WorkingDaySchedule[], toleranceMinutes: number) => void;

  // Automation / Tolerância trigger (RF-11)
  runToleranceCheck: () => { expiredCount: number };
  
  // Clear / Reset demo state
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or mock data
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

  // Sync to localStorage
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

  const barbers = users.filter((u) => u.role === 'barbeiro' && u.active);
  const receptionists = users.filter((u) => u.role === 'recepcionista' && u.active);

  // Time utilities
  const timeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Add notification log (RF-19)
  const addNotification = (
    type: NotificationLog['type'],
    channel: 'SMS' | 'EMAIL',
    recipient: string,
    title: string,
    message: string,
    appointmentId?: string
  ) => {
    const newNotif: NotificationLog = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      channel,
      recipient,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      appointmentId
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Role switching
  const switchRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role && u.active);
    if (targetUser) {
      setCurrentUser(targetUser);
    } else {
      // Fallback create default placeholder user for that role if none found
      const fallbackUser: User = {
        id: `user-${role}-${Date.now()}`,
        name: `Usuário ${role.toUpperCase()}`,
        email: `${role}@barbearia.com`,
        phone: '(11) 99999-9999',
        role,
        active: true
      };
      setUsers((prev) => [...prev, fallbackUser]);
      setCurrentUser(fallbackUser);
    }
  };

  // RF-01: Criar conta de cliente
  const registerClient = (name: string, email: string, phone: string, password?: string) => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Já existe uma conta com este e-mail cadastrado.' };
    }

    const newUser: User = {
      id: `user-client-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'cliente',
      active: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    addNotification(
      'CRIACAO',
      'SMS',
      newUser.phone,
      'Boas-vindas à Barbearia',
      `Olá ${newUser.name}, sua conta foi criada com sucesso! Aproveite para agendar seus serviços em tempo real.`
    );

    return { success: true, message: 'Conta criada com sucesso!', user: newUser };
  };

  // Criar conta para cada perfil (cliente, recepcionista, barbeiro, administrador)
  const registerUser = (data: {
    role: UserRole;
    name: string;
    email: string;
    phone: string;
    password?: string;
    bio?: string;
    serviceIds?: string[];
    shift?: string;
    companyName?: string;
    adminCode?: string;
  }) => {
    const { role, name, email, phone } = data;
    if (!name.trim() || !email.trim() || !phone.trim()) {
      return { success: false, message: 'Por favor, preencha todos os campos obrigatórios (nome, e-mail e telefone).' };
    }
    const existing = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Já existe uma conta cadastrada com este e-mail.' };
    }

    const newId = `user-${role}-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      active: true,
      bio: data.bio?.trim(),
      shift: data.shift?.trim(),
      companyName: data.companyName?.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
    };

    // Caso perfil seja Barbeiro: vincular aos serviços selecionados e criar grade semanal de horários
    if (role === 'barbeiro') {
      const selectedServiceIds =
        data.serviceIds && data.serviceIds.length > 0
          ? data.serviceIds
          : services.map((s) => s.id);

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

    const roleLabels: Record<UserRole, string> = {
      cliente: 'Cliente',
      recepcionista: 'Recepcionista',
      barbeiro: 'Barbeiro Profissional',
      administrador: 'Administrador'
    };

    addNotification(
      'CRIACAO',
      'SMS',
      newUser.phone,
      `Boas-vindas - Conta de ${roleLabels[role]}`,
      `Olá ${newUser.name}, sua conta de ${roleLabels[role]} foi ativada com sucesso na Barbearia Navalha & Arte!`
    );

    return {
      success: true,
      message: `Conta de ${roleLabels[role]} criada e ativada com sucesso!`,
      user: newUser
    };
  };

  // RF-03: Autenticar usuário
  const loginUser = (email: string, password?: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.active);
    if (!user) {
      return { success: false, message: 'Usuário não encontrado ou inativo.' };
    }
    setCurrentUser(user);
    return { success: true, message: `Bem-vindo de volta, ${user.name}!`, user };
  };

  // RF-02: Redefinir senha
  const resetPassword = (identifier: string) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === identifier.trim().toLowerCase() || u.phone.includes(identifier.trim())
    );
    if (!user) {
      return { success: false, message: 'Nenhuma conta encontrada com este e-mail ou telefone.' };
    }

    addNotification(
      'LEMBRETE',
      user.email.includes(identifier) ? 'EMAIL' : 'SMS',
      identifier,
      'Link para Redefinição de Senha',
      `Recebemos uma solicitação de redefinição de senha para sua conta (${user.name}). Acesse o link seguro para criar sua nova senha: https://barbearia.app/redefinir-senha?token=tok_${Date.now()}`
    );

    return {
      success: true,
      message: `Link de recuperação enviado com sucesso para ${identifier}. Verifique sua caixa de entrada ou SMS.`
    };
  };

  // RNF-02 & RNF-08: Check if a slot conflicts with other appointments or breaks
  const isTimeSlotAvailable = (
    date: string,
    startTime: string,
    durationMinutes: number,
    barberId: string,
    excludeAppointmentId?: string
  ): boolean => {
    const slotStartMin = timeToMinutes(startTime);
    const slotEndMin = slotStartMin + durationMinutes;

    // 1. Check schedule for day of week
    const dateObj = new Date(`${date}T12:00:00`);
    const dayOfWeek = dateObj.getDay();

    const scheduleObj = barberSchedules.find((s) => s.barberId === barberId);
    const daySchedule = scheduleObj?.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.active) {
      return false; // Day off or barber not working
    }

    const workStartMin = timeToMinutes(daySchedule.startTime);
    const workEndMin = timeToMinutes(daySchedule.endTime);

    // Beyond working hours?
    if (slotStartMin < workStartMin || slotEndMin > workEndMin) {
      return false;
    }

    // Overlaps with lunch/break?
    if (daySchedule.breakStart && daySchedule.breakEnd) {
      const breakStartMin = timeToMinutes(daySchedule.breakStart);
      const breakEndMin = timeToMinutes(daySchedule.breakEnd);

      const overlapWithBreak = Math.max(slotStartMin, breakStartMin) < Math.min(slotEndMin, breakEndMin);
      if (overlapWithBreak) {
        return false;
      }
    }

    // 2. Overlaps with existing active appointments for this barber on this date
    const activeStatuses: AppointmentStatus[] = ['AGENDADO', 'CONFIRMADO', 'REALIZADO'];
    const conflicting = appointments.some((apt) => {
      if (apt.id === excludeAppointmentId) return false;
      if (apt.barberId !== barberId || apt.date !== date) return false;
      if (!activeStatuses.includes(apt.status)) return false;

      const aptStartMin = timeToMinutes(apt.startTime);
      const aptEndMin = timeToMinutes(apt.endTime);

      // Overlap condition: max(startA, startB) < min(endA, endB)
      return Math.max(slotStartMin, aptStartMin) < Math.min(slotEndMin, aptEndMin);
    });

    return !conflicting;
  };

  // RF-05: Consultar disponibilidade em tempo real
  const getAvailableSlots = (date: string, serviceId: string, barberId?: string): AvailableSlot[] => {
    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService) return [];

    const duration = selectedService.durationMinutes;
    const candidateBarbers = barberId
      ? barbers.filter((b) => b.id === barberId && selectedService.barberIds.includes(b.id))
      : barbers.filter((b) => selectedService.barberIds.includes(b.id));

    const availableSlots: AvailableSlot[] = [];
    const dateObj = new Date(`${date}T12:00:00`);
    const dayOfWeek = dateObj.getDay();

    candidateBarbers.forEach((barber) => {
      const scheduleObj = barberSchedules.find((s) => s.barberId === barber.id);
      const daySchedule = scheduleObj?.weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);

      if (!daySchedule || !daySchedule.active) return;

      const workStartMin = timeToMinutes(daySchedule.startTime);
      const workEndMin = timeToMinutes(daySchedule.endTime);

      // Step interval: 30 minutes slots standard
      const step = 30;

      for (let timeMin = workStartMin; timeMin + duration <= workEndMin; timeMin += step) {
        const timeStr = minutesToTime(timeMin);
        if (isTimeSlotAvailable(date, timeStr, duration, barber.id)) {
          availableSlots.push({
            time: timeStr,
            formatted: timeStr,
            barberId: barber.id,
            barberName: barber.name
          });
        }
      }
    });

    // Sort chronologically
    return availableSlots.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  };

  // RF-04: Agendar serviço
  const createAppointment = (data: {
    serviceId: string;
    barberId: string;
    date: string;
    startTime: string;
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
  }) => {
    const service = services.find((s) => s.id === data.serviceId);
    const barber = users.find((u) => u.id === data.barberId);

    if (!service || !barber) {
      return { success: false, message: 'Serviço ou barbeiro inválido.' };
    }

    const available = isTimeSlotAvailable(data.date, data.startTime, service.durationMinutes, data.barberId);
    if (!available) {
      return {
        success: false,
        message: 'Desculpe, este horário acabou de ser preenchido ou conflita com outro agendamento. Por favor, selecione outro.'
      };
    }

    const startMin = timeToMinutes(data.startTime);
    const endMin = startMin + service.durationMinutes;
    const endTime = minutesToTime(endMin);

    const client = data.clientId ? users.find((u) => u.id === data.clientId) : currentUser;
    const clientName = data.clientName || client?.name || 'Cliente';
    const clientEmail = data.clientEmail || client?.email || '';
    const clientPhone = data.clientPhone || client?.phone || '';

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: client?.id || `client-${Date.now()}`,
      clientName,
      clientEmail,
      clientPhone,
      barberId: data.barberId,
      serviceId: data.serviceId,
      date: data.date,
      startTime: data.startTime,
      endTime,
      status: 'AGENDADO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);

    // RF-19: Notificar criação
    if (clientPhone) {
      addNotification(
        'CRIACAO',
        'SMS',
        clientPhone,
        'Agendamento Confirmado',
        `Olá ${clientName}! Seu agendamento para ${service.name} com ${barber.name} no dia ${data.date} às ${data.startTime} foi criado com sucesso!`,
        newAppointment.id
      );
    }
    if (clientEmail) {
      addNotification(
        'CRIACAO',
        'EMAIL',
        clientEmail,
        'Confirmação de Agendamento',
        `Olá ${clientName}, confirmamos seu agendamento para ${service.name} no dia ${data.date} das ${data.startTime} às ${endTime} com o barbeiro ${barber.name}.`,
        newAppointment.id
      );
    }

    return { success: true, message: 'Agendamento realizado com sucesso!', appointment: newAppointment };
  };

  // RF-10: Cancelar agendamento
  const cancelAppointment = (id: string, reason: string, cancelledByRole: UserRole) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (!reason.trim()) {
      return { success: false, message: 'O motivo do cancelamento é obrigatório.' };
    }

    const service = services.find((s) => s.id === apt.serviceId);
    const barber = users.find((u) => u.id === apt.barberId);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'CANCELADO',
              cancellationReason: reason.trim(),
              cancelledByRole,
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    // RF-19: Notificar cancelamento
    if (apt.clientPhone) {
      addNotification(
        'CANCELAMENTO',
        'SMS',
        apt.clientPhone,
        'Agendamento Cancelado',
        `Prezado(a) ${apt.clientName}, seu agendamento de ${service?.name || 'serviço'} do dia ${apt.date} às ${apt.startTime} foi cancelado. Motivo: "${reason}".`,
        apt.id
      );
    }

    return { success: true, message: 'Agendamento cancelado com sucesso.' };
  };

  // RF-13: Reagendar
  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newStartTime: string,
    newBarberId: string,
    reason: string
  ) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    if (!reason.trim()) {
      return { success: false, message: 'Informe o motivo do reagendamento.' };
    }

    const service = services.find((s) => s.id === apt.serviceId);
    if (!service) return { success: false, message: 'Serviço inválido.' };

    const available = isTimeSlotAvailable(newDate, newStartTime, service.durationMinutes, newBarberId, apt.id);
    if (!available) {
      return { success: false, message: 'O horário selecionado não está mais disponível para este profissional.' };
    }

    const startMin = timeToMinutes(newStartTime);
    const endMin = startMin + service.durationMinutes;
    const newEndTime = minutesToTime(endMin);

    const barber = users.find((u) => u.id === newBarberId);

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              date: newDate,
              startTime: newStartTime,
              endTime: newEndTime,
              barberId: newBarberId,
              status: 'AGENDADO',
              rescheduleReason: reason.trim(),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    // RF-19: Notificar reagendamento
    if (apt.clientPhone) {
      addNotification(
        'REAGENDAMENTO',
        'SMS',
        apt.clientPhone,
        'Agendamento Reagendado',
        `Olá ${apt.clientName}! Seu agendamento de ${service.name} foi alterado para ${newDate} às ${newStartTime} com ${barber?.name}. Motivo: ${reason}.`,
        apt.id
      );
    }

    return { success: true, message: 'Agendamento reagendado com sucesso!' };
  };

  // RF-14: Confirmar presença (Recepcionista)
  const confirmAttendance = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'CONFIRMADO',
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    return { success: true, message: `Presença de ${apt.clientName} confirmada!` };
  };

  // RF-16: Finalizar atendimento (Barbeiro)
  const finishService = (id: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'REALIZADO',
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    return { success: true, message: 'Atendimento finalizado! Liberado para pagamento na recepção.' };
  };

  // RF-15: Registrar pagamento (Recepcionista)
  const registerPayment = (id: string, method: PaymentMethod, amount: number) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'PAGO',
              paymentMethod: method,
              paymentAmount: amount,
              paidAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    if (apt.clientPhone) {
      addNotification(
        'LEMBRETE',
        'SMS',
        apt.clientPhone,
        'Pagamento Registrado',
        `Pagamento de R$ ${amount.toFixed(2)} (${method}) recebido com sucesso. Agradecemos sua preferência na Barbearia!`,
        apt.id
      );
    }

    return { success: true, message: 'Pagamento registrado com sucesso!' };
  };

  // RF-11: Marcar não compareceu
  const markNoShow = (id: string, reason?: string) => {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return { success: false, message: 'Agendamento não encontrado.' };

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'NAO_COMPARECEU',
              cancellationReason: reason || 'Tolerância de horário expirada / Não comparecimento do cliente.',
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    if (apt.clientPhone) {
      addNotification(
        'TOLERANCIA_EXPIRADA',
        'SMS',
        apt.clientPhone,
        'Agendamento Cancelado por Tolerância',
        `Olá ${apt.clientName}, o horário de tolerância para seu agendamento hoje às ${apt.startTime} expirou e ele foi marcado como não comparecimento.`,
        apt.id
      );
    }

    return { success: true, message: 'Agendamento marcado como Não Compareceu.' };
  };

  // RF-12: Cancelar em lote (Recepcionista)
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
        message: 'Nenhum agendamento futuro ativo encontrado para este barbeiro no período.',
        affectedCount: 0
      };
    }

    const affectedIds = affectedApts.map((a) => a.id);

    setAppointments((prev) =>
      prev.map((a) => {
        if (affectedIds.includes(a.id)) {
          return {
            ...a,
            status: 'CANCELADO',
            cancellationReason: `Cancelamento em Lote: ${reason.trim()}`,
            cancelledByRole: 'recepcionista',
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      })
    );

    // Notify each affected client (RF-19)
    affectedApts.forEach((apt) => {
      if (apt.clientPhone) {
        addNotification(
          'CANCELAMENTO',
          'SMS',
          apt.clientPhone,
          'Agendamento Cancelado em Lote',
          `Prezado(a) ${apt.clientName}, lamentamos informar que devido a imprevisto com o profissional ${barber.name} (${reason}), seu agendamento em ${apt.date} às ${apt.startTime} foi cancelado. Acesse nosso sistema para reagendar gratuitamente.`,
          apt.id
        );
      }
    });

    const batchRecord: BatchCancellationRecord = {
      id: `batch-${Date.now()}`,
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
      message: `${affectedApts.length} agendamento(s) cancelado(s) em lote e clientes notificados.`,
      affectedCount: affectedApts.length
    };
  };

  // RF-06: Cadastrar barbeiro (Admin)
  const addBarber = (data: { name: string; email: string; phone: string; bio: string; serviceIds: string[] }) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Já existe um usuário com este e-mail.', firstAccessLink: '' };
    }

    const newBarberId = `user-barber-${Date.now()}`;
    const firstAccessLink = `https://barbearia.app/primeiro-acesso?token=auth_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const newBarber: User = {
      id: newBarberId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'barbeiro',
      bio: data.bio.trim(),
      active: true,
      firstAccessPending: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`
    };

    setUsers((prev) => [...prev, newBarber]);

    // Associate with selected services (RF-08)
    setServices((prev) =>
      prev.map((s) => {
        if (data.serviceIds.includes(s.id) && !s.barberIds.includes(newBarberId)) {
          return { ...s, barberIds: [...s.barberIds, newBarberId] };
        }
        return s;
      })
    );

    // Create default schedule for new barber (RF-17)
    const defaultSchedule = INITIAL_BARBER_SCHEDULES[0].weeklySchedule;
    setBarberSchedules((prev) => [
      ...prev,
      {
        barberId: newBarberId,
        toleranceMinutes: 15,
        weeklySchedule: JSON.parse(JSON.stringify(defaultSchedule))
      }
    ]);

    addNotification(
      'LEMBRETE',
      'EMAIL',
      newBarber.email,
      'Primeiro Acesso - Barbearia',
      `Olá ${newBarber.name}! Você foi cadastrado como barbeiro. Defina sua senha através do link seguro: ${firstAccessLink}`
    );

    return {
      success: true,
      message: `Barbeiro ${data.name} cadastrado com sucesso! Link de primeiro acesso gerado.`,
      firstAccessLink
    };
  };

  // RF-07: Cadastrar recepcionista (Admin)
  const addReceptionist = (data: { name: string; email: string; phone: string }) => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Já existe um usuário com este e-mail.', firstAccessLink: '' };
    }

    const firstAccessLink = `https://barbearia.app/primeiro-acesso?token=rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

    const newReceptionist: User = {
      id: `user-rec-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      role: 'recepcionista',
      active: true,
      firstAccessPending: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`
    };

    setUsers((prev) => [...prev, newReceptionist]);

    addNotification(
      'LEMBRETE',
      'EMAIL',
      newReceptionist.email,
      'Primeiro Acesso - Recepção Barbearia',
      `Olá ${newReceptionist.name}! Você foi cadastrada como recepcionista. Defina sua senha no link: ${firstAccessLink}`
    );

    return {
      success: true,
      message: `Recepcionista ${data.name} cadastrada com sucesso! Link de primeiro acesso gerado.`,
      firstAccessLink
    };
  };

  // RF-08: Cadastrar serviços (Admin)
  const addService = (data: {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    barberIds: string[];
  }) => {
    if (!data.name.trim() || data.price <= 0 || data.durationMinutes <= 0) {
      return { success: false, message: 'Preencha nome, preço e duração válidos.' };
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
    return { success: true, message: `Serviço "${newService.name}" criado com sucesso!` };
  };

  const updateService = (id: string, data: Partial<ServiceItem>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  // RF-17: Definir horários de trabalho (Admin)
  const updateBarberSchedule = (barberId: string, weeklySchedule: WorkingDaySchedule[], toleranceMinutes: number) => {
    setBarberSchedules((prev) => {
      const idx = prev.findIndex((s) => s.barberId === barberId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { barberId, weeklySchedule, toleranceMinutes };
        return next;
      }
      return [...prev, { barberId, weeklySchedule, toleranceMinutes }];
    });
  };

  // RF-11: Simulação do cancelamento automático após tolerância
  const runToleranceCheck = () => {
    const today = new Date().toISOString().split('T')[0];
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

    let expiredCount = 0;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.date === today && apt.status === 'AGENDADO') {
          const barberSched = barberSchedules.find((s) => s.barberId === apt.barberId);
          const tolerance = barberSched?.toleranceMinutes || 15;
          const aptStartMin = timeToMinutes(apt.startTime);

          // If current time passed aptStart + tolerance
          if (nowMinutes > aptStartMin + tolerance) {
            expiredCount++;
            if (apt.clientPhone) {
              addNotification(
                'TOLERANCIA_EXPIRADA',
                'SMS',
                apt.clientPhone,
                'Agendamento Cancelado por Tolerância',
                `Seu agendamento de hoje às ${apt.startTime} excedeu o limite de tolerância (${tolerance} min) e foi cancelado automaticamente.`,
                apt.id
              );
            }
            return {
              ...apt,
              status: 'NAO_COMPARECEU' as AppointmentStatus,
              cancellationReason: `Cancelamento automático do sistema: tolerância de ${tolerance} minutos excedida.`,
              updatedAt: new Date().toISOString()
            };
          }
        }
        return apt;
      })
    );

    return { expiredCount };
  };

  // Reset to initial state
  const resetAllData = () => {
    localStorage.removeItem('barber_users');
    localStorage.removeItem('barber_current_user');
    localStorage.removeItem('barber_services');
    localStorage.removeItem('barber_schedules');
    localStorage.removeItem('barber_appointments');
    localStorage.removeItem('barber_notifications');
    localStorage.removeItem('barber_batch_cancellations');

    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setServices(INITIAL_SERVICES);
    setBarberSchedules(INITIAL_BARBER_SCHEDULES);
    setAppointments(INITIAL_APPOINTMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setBatchCancellations([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        registerClient,
        registerUser,
        loginUser,
        resetPassword,
        services,
        barbers,
        receptionists,
        appointments,
        barberSchedules,
        notifications,
        batchCancellations,
        getAvailableSlots,
        isTimeSlotAvailable,
        createAppointment,
        cancelAppointment,
        rescheduleAppointment,
        confirmAttendance,
        finishService,
        registerPayment,
        markNoShow,
        cancelBatchAppointments,
        addBarber,
        addReceptionist,
        addService,
        updateService,
        deleteService,
        updateBarberSchedule,
        runToleranceCheck,
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
