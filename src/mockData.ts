import { User, ServiceItem, BarberWorkingHours, Appointment, NotificationLog, ToleranceAuditRecord } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-client-1',
    login: 'carlos.eduardo',
    name: 'Carlos Eduardo Oliveira',
    email: 'carlos.eduardo@email.com',
    phone: '(11) 98765-4321',
    role: 'cliente',
    active: true,
    password: 'Cliente@2026',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-client-2',
    login: 'mateus.souza',
    name: 'Mateus Henrique Souza',
    email: 'mateus.souza@email.com',
    phone: '(11) 98112-3344',
    role: 'cliente',
    active: true,
    password: 'Cliente@2026',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-rec-1',
    login: 'juliana.recepcao',
    name: 'Juliana Mendes',
    email: 'juliana.recepcao@barbearia.com',
    phone: '(11) 97777-8888',
    role: 'recepcionista',
    active: true,
    password: 'Recepcao@2026',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-1',
    login: 'rodrigo.navalha',
    name: 'Rodrigo "Navalha" Silva',
    email: 'rodrigo.barbeiro@barbearia.com',
    phone: '(11) 99123-4567',
    role: 'barbeiro',
    active: true,
    password: 'Barbeiro@2026',
    bio: 'Mestre navalheiro especialista em degradê e barboterapia há mais de 8 anos.',
    serviceIds: ['serv-1', 'serv-2', 'serv-3', 'serv-4', 'serv-5'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-2',
    login: 'marcos.vinicius',
    name: 'Marcos Vinicius Santos',
    email: 'marcos.barbeiro@barbearia.com',
    phone: '(11) 99234-5678',
    role: 'barbeiro',
    active: true,
    password: 'Barbeiro@2026',
    bio: 'Especialista em cortes clássicos executivos, tesoura afiada e visagismo facial.',
    serviceIds: ['serv-1', 'serv-2', 'serv-3', 'serv-4', 'serv-6'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-barber-3',
    login: 'lucas.pires',
    name: 'Lucas Pires',
    email: 'lucas.barbeiro@barbearia.com',
    phone: '(11) 99345-6789',
    role: 'barbeiro',
    active: true,
    password: 'Barbeiro@2026',
    bio: 'Jovem talento em freestyle, desenhos geométricos e coloração de cabelo/barba.',
    serviceIds: ['serv-1', 'serv-3', 'serv-4', 'serv-5', 'serv-6'],
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-admin-1',
    login: 'admin',
    name: 'Fernando Costa (Proprietário)',
    email: 'admin@barbearia.com',
    phone: '(11) 99999-0000',
    role: 'administrador',
    active: true,
    password: 'Admin@2026',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-inactive-1',
    login: 'andre.inativo',
    name: 'André Soares (Inativo)',
    email: 'andre.inativo@barbearia.com',
    phone: '(11) 98888-0000',
    role: 'barbeiro',
    active: false, // Testa RF-02 e RF-08
    password: 'Inativo@2026',
    bio: 'Barbeiro com contrato temporariamente suspenso.',
    serviceIds: ['serv-1'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
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
    clientLogin: 'carlos.eduardo',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-1',
    serviceId: 'serv-1',
    date: getRelativeDate(0), // Hoje
    startTime: '09:30',
    endTime: '10:00',
    status: 'REALIZADO',
    confirmedBy: 'Juliana Mendes',
    confirmedAt: new Date(Date.now() - 7200000).toISOString(),
    completedBy: 'Rodrigo "Navalha" Silva',
    completedAt: new Date(Date.now() - 5400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-102',
    clientId: 'user-client-2',
    clientLogin: 'mateus.souza',
    clientName: 'Mateus Henrique Souza',
    clientEmail: 'mateus.souza@email.com',
    clientPhone: '(11) 98112-3344',
    barberId: 'user-barber-1',
    serviceId: 'serv-3',
    date: getRelativeDate(0), // Hoje
    startTime: '10:30',
    endTime: '11:30',
    status: 'CONFIRMADO',
    confirmedBy: 'Juliana Mendes',
    confirmedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apt-103',
    clientId: 'user-client-1',
    clientLogin: 'carlos.eduardo',
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
    clientLogin: 'mateus.souza',
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
    clientLogin: 'carlos.eduardo',
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
    clientLogin: 'carlos.eduardo',
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
    paidBy: 'Juliana Mendes',
    confirmedBy: 'Juliana Mendes',
    completedBy: 'Rodrigo "Navalha" Silva',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'apt-107',
    clientId: 'user-client-2',
    clientLogin: 'mateus.souza',
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
    cancelledBy: 'Mateus Henrique Souza',
    cancelledAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'apt-108',
    clientId: 'user-client-1',
    clientLogin: 'carlos.eduardo',
    clientName: 'Carlos Eduardo Oliveira',
    clientEmail: 'carlos.eduardo@email.com',
    clientPhone: '(11) 98765-4321',
    barberId: 'user-barber-2',
    serviceId: 'serv-2',
    date: getRelativeDate(0),
    startTime: '08:00',
    endTime: '08:30',
    status: 'CANCELADO',
    cancellationReason: 'não comparecimento', // RF-23
    cancelledByRole: 'tempo',
    cancelledBy: 'Rotina de Tolerância (Ator Tempo)',
    cancelledAt: new Date(Date.now() - 14400000).toISOString(),
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString()
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'notif-1',
    type: 'CRIACAO',
    channel: 'EMAIL',
    recipient: 'carlos.eduardo@email.com',
    title: 'Agendamento Criado com Sucesso',
    message: 'Olá Carlos Eduardo! Seu agendamento para Corte Tradicional no dia de hoje às 09:30 com Rodrigo Navalha foi criado com sucesso (Status: AGENDADO).',
    timestamp: new Date(Date.now() - 7200000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'ENVIADO',
    appointmentId: 'apt-101'
  },
  {
    id: 'notif-2',
    type: 'TOLERANCIA_EXPIRADA',
    channel: 'EMAIL',
    recipient: 'carlos.eduardo@email.com',
    title: 'Agendamento Cancelado por Não Comparecimento',
    message: 'Seu agendamento das 08:00 expirou o período de tolerância de 15 minutos sem registro de presença. Conforme a política de atendimento, o horário foi cancelado por não comparecimento.',
    timestamp: new Date(Date.now() - 14400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'ENVIADO',
    appointmentId: 'apt-108'
  },
  {
    id: 'notif-3',
    type: 'CRIACAO',
    channel: 'SMS',
    recipient: '(11) 98112-3344',
    title: 'Agendamento Criado',
    message: 'Mateus, seu agendamento para Barba Completa foi confirmado para hoje às 10:30 com Rodrigo Navalha. Tolerância de 15min.',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'ENVIADO',
    appointmentId: 'apt-102'
  }
];

export const INITIAL_TOLERANCE_AUDIT: ToleranceAuditRecord[] = [
  {
    id: 'tol-001',
    appointmentId: 'apt-108',
    clientName: 'Carlos Eduardo Oliveira',
    serviceName: 'Barba Completa & Toalha Quente',
    barberName: 'Marcos Vinicius Santos',
    scheduledTime: '08:00',
    evaluatedAt: '08:16:02',
    minutesOverdue: 16,
    action: 'CANCELADO_POR_TOLERANCIA',
    details: 'Status era AGENDADO. Sem confirmação de presença pela recepção após 15 minutos do horário de início. Cancelado por "não comparecimento" e notificação enviada (RF-23).'
  },
  {
    id: 'tol-002',
    appointmentId: 'apt-101',
    clientName: 'Carlos Eduardo Oliveira',
    serviceName: 'Corte Tradicional Masculino',
    barberName: 'Rodrigo "Navalha" Silva',
    scheduledTime: '09:30',
    evaluatedAt: '09:47:00',
    minutesOverdue: 17,
    action: 'IGNORADO_PRESENCA_CONFIRMADA',
    details: 'Presença já havia sido confirmada pela recepção (status CONFIRMADO). Não sofre ação da rotina de tolerância (Critério RF-20/RF-23).'
  }
];
