export type UserRole = 'admin' | 'finance' | 'teknisi' | 'operator';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token: string;
  access_token?: string | null;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface UserRead {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: string;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  total_items: number;
  total_pages: number;
  current_page: number;
  size: number;
}

// ---------------------------------------------------------------------------
// Dashboard (hanya hari ini, WIB)
// ---------------------------------------------------------------------------

export interface RevenueTodayResponse {
  date: string;
  total_revenue: number;
  total_transactions: number;
}

export interface RevenueByShiftItem {
  exit_shift_id: string | null;
  total_revenue: number;
  total_transactions: number;
}

export interface RevenueByShiftResponse {
  date: string;
  shifts: RevenueByShiftItem[];
}

export interface VehicleDistributionItem {
  vehicle_type_id: string;
  vehicle_type_name?: string | null;
  total_vehicles: number;
  percentage: number;
}

export interface VehicleDistributionResponse {
  date: string;
  total_vehicles: number;
  distribution: VehicleDistributionItem[];
}

export interface PaymentDistributionItem {
  payment_method: string;
  total_transactions: number;
  total_amount: number;
  percentage: number;
}

export interface PaymentDistributionResponse {
  date: string;
  total_transactions: number;
  total_amount: number;
  distribution: PaymentDistributionItem[];
}

export interface ExecutiveInsightResponse {
  date: string;
  revenue_today: number;
  revenue_yesterday: number;
  revenue_growth_percentage: number;
  highest_revenue_shift_id: string | null;
  total_pending_tickets: number;
}

// ---------------------------------------------------------------------------
// Laporan transaksi
// ---------------------------------------------------------------------------

export type ParkingStatus = 'Parked' | 'Completed' | 'Void';

export interface TransactionReportParams {
  page?: number;
  size?: number;
  search?: string;
  start_date?: string;
  end_date?: string;
  status?: ParkingStatus;
  shift_id?: string;
}

export interface TransactionReportItem {
  id: string;
  ticket_number: string | null;
  police_number: string | null;
  vehicle_type_id: string;
  vehicle_type_name?: string | null;
  entry_time: string;
  exit_time: string | null;
  entry_shift_id: string | null;
  exit_shift_id: string | null;
  status_parking: ParkingStatus;
  total_fee: number;
  exit_operator_name?: string | null;
  payment_method?: string | null;
}

export interface TransactionReportResponse {
  items: TransactionReportItem[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Tiket gantung
// ---------------------------------------------------------------------------

export interface PendingTicketParams {
  page?: number;
  size?: number;
  search?: string;
  entry_date?: string;
  shift_id?: string;
}

export interface PendingTicketItem {
  id: string;
  ticket_number: string | null;
  police_number: string | null;
  vehicle_type_id: string;
  vehicle_type_name?: string | null;
  entry_time: string;
  entry_shift_id: string | null;
  status_parking: ParkingStatus;
  payment_status: string | null;
  entry_gate_name?: string | null;
}

export interface PendingTicketResponse {
  items: PendingTicketItem[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Laporan pendapatan
// ---------------------------------------------------------------------------

export interface RevenueSummary {
  total_revenue: number;
  total_transactions: number;
}

export interface RevenueDailyItem {
  date: string;
  total_revenue: number;
  total_transactions: number;
}

export interface PaymentMethodBreakdownItem {
  method: string;
  total_transactions: number;
  total_amount: number;
  percentage: number;
}

export interface RevenueReportParams {
  start_date?: string;
  end_date?: string;
}

export interface RevenueReportResponse {
  summary: RevenueSummary;
  items: RevenueDailyItem[];
  payment_methods: PaymentMethodBreakdownItem[];
}

// ---------------------------------------------------------------------------
// Ringkasan kendaraan
// ---------------------------------------------------------------------------

export interface VehicleReportParams {
  start_date?: string;
  end_date?: string;
}

export interface VehicleReportItem {
  vehicle_type_id: string;
  vehicle_type_name: string;
  total_vehicles: number;
  total_revenue: number;
}

export interface VehicleReportResponse {
  summary: RevenueSummary;
  items: VehicleReportItem[];
}

// ---------------------------------------------------------------------------
// Kinerja operator
// ---------------------------------------------------------------------------

export interface OperatorPerformanceParams {
  start_date?: string;
  end_date?: string;
}

export interface OperatorPerformanceItem {
  operator_id: string;
  operator_name: string;
  total_sessions: number;
  total_transactions: number;
  total_revenue: number;
  avg_transaction_value: number;
}

export interface OperatorPerformanceResponse {
  items: OperatorPerformanceItem[];
}

// ---------------------------------------------------------------------------
// Laporan member
// ---------------------------------------------------------------------------

export type MemberStatus = 'active' | 'inactive' | 'blocked';

export interface MemberReportParams {
  page?: number;
  size?: number;
  search?: string;
  status?: MemberStatus;
}

export interface MemberReportVehicleItem {
  police_number: string;
  vehicle_type_name?: string | null;
}

export interface MemberReportPlanItem {
  name: string;
  price: number;
  status: string;
}

export interface MemberReportItem {
  id: string;
  member_code: string;
  name: string;
  status: MemberStatus;
  created_at: string;
  vehicles: MemberReportVehicleItem[];
  plan: MemberReportPlanItem | null;
}

export interface MemberReportResponse {
  items: MemberReportItem[];
  pagination: PaginationMeta;
}

// ---------------------------------------------------------------------------
// Laporan akses gate
// ---------------------------------------------------------------------------

export interface GateEventReportParams {
  page?: number;
  size?: number;
  gate?: string;
  source?: string;
  start_date?: string;
  end_date?: string;
}

export interface GateEventReportItem {
  id: string;
  ts: string;
  gate_code: string | null;
  source: string;
  method: string | null;
  ticket_number: string | null;
  detail: string | null;
}

export interface GateEventReportResponse {
  items: GateEventReportItem[];
  pagination: PaginationMeta;
}
