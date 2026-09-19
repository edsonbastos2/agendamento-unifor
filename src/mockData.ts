import { User, ServiceItem, BarberWorkingHours, Appointment, NotificationLog } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-client-1',
    name: 'Carlos Eduardo Oliveira',
    email: 'carlos.eduardo@email.com',
    phone: '(11) 98765-4321',
    role: 'cliente',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-client-2',
    name: 'Mateus Henrique Souza',
    email: 'mateus.souza@email.com',
    phone: '(11) 98112-3344',
    role: 'cliente',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-rec-1',
    name: 'Juliana Mendes',
    email: 'juliana.recepcao@barbearia.com',
    phone: '(11) 97777-8888',
    role: 'recepcionista',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-1',
    name: 'Rodrigo "Navalha" Silva',
    email: 'rodrigo.barbeiro@barbearia.com',
    phone: '(11) 99123-4567',
    role: 'barbeiro',
    active: true,
    bio: 'Mestre navalheiro especialista em degradê e barboterapia há mais de 8 anos.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-2',
    name: 'Marcos Vinicius Santos',
    email: 'marcos.barbeiro@barbearia.com',
    phone: '(11) 99234-5678',
    role: 'barbeiro',
    active: true,
    bio: 'Especialista em cortes clássicos executivos, tesoura afiada e visagismo facial.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-3',
    name: 'Lucas Pires',
    email: 'lucas.barbeiro@barbearia.com',
    phone: '(11) 99345-6789',
    role: 'barbeiro',
    active: true,
    bio: 'Jovem talento em freestyle, desenhos geométricos e coloração de cabelo/barba.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Fernando Costa (Proprietário)',
    email: 'admin@barbearia.com',
    phone: '(11) 99999-0000',
    role: 'administrador',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'serv-1',
    name: 'Corte Tradicional Masculino',
    description: 'Corte moderno ou clássico com tesoura e máquina, finalização com pomada modeladora e acabamento com lâmina descartável.',
    price: 55.0,
    durationMinutes: 30,
    barberIds: ['user-barber-1', 'user-barber-2', 'user-barber-3']
  },
  {
    id: 'serv-2',
    name: 'Barba Completa & Toalha Quente',
    description: 'Modelagem de barba com navalha, aplicação de óleos essenciais, massagem facial e toalha quente revigorante.',
    price: 45.0,
    durationMinutes: 30,
    barberIds: ['user-barber-1', 'user-barber-2']
  },
  {
    id: 'serv-3',
    name: 'Combo Completo: Cabelo + Barba VIP',
    description: 'Experiência completa incluindo corte estilizado, alinhamento de barba com vapor de ozônio e toalha aromatizada.',
    price: 90.0,
    durationMinutes: 60,
    barberIds: ['user-barber-1', 'user-barber-2', 'user-barber-3']
  },
  {
    id: 'serv-4',
    name: 'Acabamento & Pezinho na Navalha',
    description: 'Higienização, limpeza das costeletas e desenho preciso da nuca com lâmina afiada.',
    price: 25.0,
    durationMinutes: 15,
    barberIds: ['user-barber-1', 'user-barber-2', 'user-barber-3']
  },
  {
    id: 'serv-5',
    name: 'Camuflagem & Pigmentação de Barba',
    description: 'Tingimento sutil para cobrir fios brancos e preencher falhas na barba mantendo aspecto 100% natural.',
    price: 40.0,
    durationMinutes: 30,
    barberIds: ['user-barber-1', 'user-barber-3']
  },
  {
    id: 'serv-6',
    name: 'Tratamento Capilar & Revitalização',
    description: 'Lavagem esfoliante anti-oleosidade com massagem capilar e tônico estimulante anti-queda.',
    price: 50.0,
    durationMinutes: 30,
    barberIds: ['user-barber-2', 'user-barber-3']
  }
];

const DEFAULT_WEEK_SCHEDULE = [
  { dayOfWeek: 0, active: false, startTime: '09:00', endTime: '14:00', breakStart: '12:00', breakEnd: '13:00' }, // Domingo
  { dayOfWeek: 1, active: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },  // Segunda
  { dayOfWeek: 2, active: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },  // Terça
  { dayOfWeek: 3, active: true, startTime: '09:00', endTime: '19:00', breakStart: '12:00', breakEnd: '13:00' },  // Quarta
  { dayOfWeek: 4, active: true, startTime: '09:00', endTime: '20:00', breakStart: '12:30', breakEnd: '13:30' },  // Quinta
  { dayOfWeek: 5, active: true, startTime: '09:00', endTime: '20:00', breakStart: '12:30', breakEnd: '13:30' },  // Sexta
  { dayOfWeek: 6, active: true, startTime: '08:30', endTime: '18:00', breakStart: '12:00', breakEnd: '13:00' },  // Sábado
];

export const INITIAL_BARBER_SCHEDULES: BarberWorkingHours[] = [
  {
    barberId: 'user-barber-1',
    toleranceMinutes: 15,
    weeklySchedule: JSON.parse(JSON.stringify(DEFAULT_WEEK_SCHEDULE))
  },
  {
    barberId: 'user-barber-2',
    toleranceMinutes: 15,
    weeklySchedule: JSON.parse(JSON.stringify(DEFAULT_WEEK_SCHEDULE))
  },
  {
    barberId: 'user-barber-3',
    toleranceMinutes: 15,
    weeklySchedule: JSON.parse(JSON.stringify(DEFAULT_WEEK_SCHEDULE))
  }
];

// Helper to format ISO date relative to today
export function getRelativeDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientId: 'user-client-1',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-1',
    serviceId: 'serv-1',
    date: getRelativeDate(0), // Hoje
    startTime: '09:30',
    endTime: '10:00',
    status: 'REALIZADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-102',
    clientId: 'user-client-2',
    clientName: 'Mateus Henrique Souza',
    clientEmail: 'mateus.souza@email.com',
    clientPhone: '(11) 98112-3344',
    barberId: 'user-barber-1',
    serviceId: 'serv-3',
    date: getRelativeDate(0), // Hoje
    startTime: '10:30',
    endTime: '11:30',
    status: 'CONFIRMADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-103',
    clientId: 'user-client-1',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-2',
    serviceId: 'serv-2',
    date: getRelativeDate(0), // Hoje
    startTime: '14:00',
    endTime: '14:30',
    status: 'AGENDADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-104',
    clientId: 'user-client-2',
    clientName: 'Mateus Henrique Souza',
    clientEmail: 'mateus.souza@email.com',
    clientPhone: '(11) 98112-3344',
    barberId: 'user-barber-3',
    serviceId: 'serv-1',
    date: getRelativeDate(0), // Hoje
    startTime: '15:00',
    endTime: '15:30',
    status: 'AGENDADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-105',
    clientId: 'user-client-1',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-1',
    serviceId: 'serv-1',
    date: getRelativeDate(1), // Amanhã
    startTime: '10:00',
    endTime: '10:30',
    status: 'AGENDADO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-106',
    clientId: 'user-client-1',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-1',
    serviceId: 'serv-3',
    date: getRelativeDate(-1), // Ontem
    startTime: '16:00',
    endTime: '17:00',
    status: 'PAGO',
    paymentMethod: 'PIX',
    paymentAmount: 90.0,
    paidAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'apt-107',
    clientId: 'user-client-2',
    clientName: 'Mateus Henrique Souza',
    clientEmail: 'mateus.souza@email.com',
    clientPhone: '(11) 98112-3344',
    barberId: 'user-barber-2',
    serviceId: 'serv-1',
    date: getRelativeDate(-2),
    startTime: '11:00',
    endTime: '11:30',
    status: 'CANCELADO',
    cancellationReason: 'Imprevisto no trabalho do cliente.',
    cancelledByRole: 'cliente',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif-1',
    type: 'CRIACAO',
    channel: 'SMS',
    recipient: '(11) 98765-4321',
    title: 'Agendamento Confirmado',
    message: 'Olá Carlos! Seu agendamento para Corte Tradicional no dia de hoje às 09:30 com Rodrigo Navalha foi confirmado com sucesso.',
    timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'notif-2',
    type: 'LEMBRETE',
    channel: 'EMAIL',
    recipient: 'carlos.eduardo@email.com',
    title: 'Lembrete de Atendimento',
    message: 'Seu corte está chegando hoje às 14:00. Caso precise reagendar ou cancelar, use nosso aplicativo com antecedência.',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];
