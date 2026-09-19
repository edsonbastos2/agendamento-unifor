export type UserRole = 'cliente' | 'recepcionista' | 'barbeiro' | 'administrador';

export type AppointmentStatus = 
  | 'AGENDADO' 
  | 'CONFIRMADO' 
  | 'REALIZADO' 
  | 'PAGO' 
  | 'CANCELADO' 
  | 'NAO_COMPARECEU';

export type PaymentMethod = 'PIX' | 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  bio?: string;
  firstAccessPending?: boolean;
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
  toleranceMinutes: number; // tolerância para atrasos (ex: 15 min)
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  barberId: string;
  serviceId: string;
  date: string; // 'YYYY-MM-DD'
  startTime: string; // '14:00'
  endTime: string;   // '14:45'
  status: AppointmentStatus;
  cancellationReason?: string;
  cancelledByRole?: UserRole;
  rescheduleReason?: string;
  paymentMethod?: PaymentMethod;
  paymentAmount?: number;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationLog {
  id: string;
  type: 'CRIACAO' | 'CANCELAMENTO' | 'REAGENDAMENTO' | 'LEMBRETE' | 'TOLERANCIA_EXPIRADA';
  channel: 'SMS' | 'EMAIL';
  recipient: string;
  title: string;
  message: string;
  timestamp: string;
  appointmentId?: string;
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
