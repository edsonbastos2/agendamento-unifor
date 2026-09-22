export type UserRole = 'cliente' | 'recepcionista' | 'barbeiro' | 'administrador';

export type ActorType = UserRole | 'tempo' | 'notificacao';

export type AppointmentStatus = 
  | 'AGENDADO' 
  | 'CONFIRMADO' 
  | 'REALIZADO' 
  | 'PAGO' 
  | 'CANCELADO';

export type PaymentMethod = 'PIX' | 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface User {
  id: string;
  login: string; // Login único (RF-01, RF-02, RF-06, RF-07, RF-12)
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  active: boolean; // Usuário inativo gera erro específico no login (RF-02)
  bio?: string;
  shift?: string;
  companyName?: string;
  firstAccessPending?: boolean; // Profissional ou cliente de balcão precisa definir senha no 1º acesso (RF-06, RF-07, RF-12)
  password?: string; // Senha com política RNF-03
  serviceIds?: string[]; // Serviços que o barbeiro está apto a executar (RF-06)
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  barberIds: string[]; // Barbeiros aptos a executar
}

export interface WorkingDaySchedule {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  active: boolean;
  startTime: string; // '09:00'
  endTime: string;   // '19:00'
  breakStart: string; // '12:00'
  breakEnd: string;   // '13:00'
}

export interface BarberWorkingHours {
  barberId: string;
  weeklySchedule: WorkingDaySchedule[];
  toleranceMinutes: number; // tolerância para atrasos (15 min conforme RF-23)
}

export interface Appointment {
  id: string;
  clientId?: string;
  clientLogin?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // '14:00'
  endTime: string;   // '14:45'
  status: AppointmentStatus; // AGENDADO -> CONFIRMADO -> REALIZADO -> PAGO (ou CANCELADO)
  
  // Auditoria e Rastreabilidade
  cancellationReason?: string; // Obrigatório para recepcionista, opcional para cliente (RF-16, RF-23)
  cancelledByRole?: UserRole | 'tempo';
  cancelledBy?: string;
  cancelledAt?: string;
  
  confirmedBy?: string; // Recepcionista responsável pela presença (RF-20)
  confirmedAt?: string;
  
  completedBy?: string; // Barbeiro que finalizou o atendimento (RF-21)
  completedAt?: string;
  
  rescheduleReason?: string; // Opcional (RF-15)
  batchCancellationId?: string; // Registro de operação em lote (RF-17)
  
  paymentMethod?: PaymentMethod;
  paymentAmount?: number;
  paidAt?: string;
  paidBy?: string; // Recepcionista responsável pelo recebimento (RF-22)
  
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'CRIACAO' | 'CANCELAMENTO' | 'REAGENDAMENTO' | 'TOLERANCIA_EXPIRADA';
  channel: 'SMS' | 'EMAIL';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  appointmentId?: string;
  status: 'ENVIADO' | 'PENDENTE_TENTATIVA' | 'FALHA';
}

export interface BatchCancellationRecord {
  id: string;
  barberId: string;
  barberName: string;
  startDate: string;
  endDate: string;
  reason: string;
  cancelledCount: number;
  createdAt: string;
  affectedAppointmentIds: string[];
}

export interface ToleranceAuditRecord {
  id: string;
  appointmentId: string;
  clientName: string;
  serviceName: string;
  barberName: string;
  scheduledTime: string;
  evaluatedAt: string;
  minutesOverdue: number;
  action: 'CANCELADO_POR_TOLERANCIA' | 'IGNORADO_PRESENCA_CONFIRMADA' | 'DENTRO_DA_TOLERANCIA';
  details: string;
}
