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

export type UserRole = 'admin' | 'finance' | 'teknisi' | 'operator';

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

export interface ShiftRef {
  id: string;
  name: string;
  start_time: string;
  finish_time: string;
  crosses_midnight: boolean;
  status: string;
}

export interface GateRef {
  id: string;
  name: string;
  gate_code: string;
  type: string;
  status: string;
}

export interface VehicleTypeRef {
  id: string;
  code: string;
  name: string;
  base_price: number | null;
  wire_id: number | null;
  status: string;
}

export interface PosRefs {
  shifts: ShiftRef[];
  gates: GateRef[];
  vehicle_types: VehicleTypeRef[];
}

export interface OperatorBrief {
  id: string;
  name: string;
  username: string;
}

export interface ShiftBrief {
  id: string;
  name: string;
  start_time: string;
  finish_time: string;
  crosses_midnight: boolean;
}

export interface GateBrief {
  id: string;
  name: string;
  gate_code: string;
  type: string;
  status: string;
}

export interface OperatorSession {
  id: string;
  user_id: string;
  shift_id: string;
  gate_id: string;
  login_time: string;
  logout_time?: string | null;
  status: string;
  user: OperatorBrief;
  shift: ShiftBrief;
  gate: GateBrief;
  created_at: string;
  updated_at: string;
}

export interface SessionStartRequest {
  shift_id: string;
  // Optional: the backend resolves the single configured exit gate.
  gate_id?: string;
}

export interface PosQuoteRequest {
  transaction_code?: string | null;
  police_number?: string | null;
  lost_ticket?: boolean;
  vehicle_id?: number | null;
  // An admin-managed vehicle class; wins over the legacy wire id.
  vehicle_type_id?: string | null;
  // Price a manual ticket even though no transaction exists yet.
  manual?: boolean;
  // Payment method chosen by the cashier (TUNAI / QRIS / E-MONEY).
  payment_method?: string | null;
}

export interface PosQuoteData {
  status: string;
  transaction_code?: string | null;
  total: number;
  duration: string;
  police_number?: string | null;
  plate_out?: string | null;
  plate_match?: boolean | null;
  member: boolean;
  name?: string | null;
  time_checkin?: string | null;
  time_checkout?: string | null;
  breakdown: string;
  vehicle_id?: number | null;
  message?: string | null;
}

export interface PosSettleData {
  transaction_code?: string | null;
  vehicle_id?: number | null;
  time_checkin?: string | null;
  time_checkout?: string | null;
  duration?: string | null;
  total?: number | null;
  cam_in?: string | null;
  cam_out?: string | null;
  payment_status?: string | null;
  police_number?: string | null;
  admin_id?: number | null;
  shift_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  discount?: string | null;
}

export interface PosActionData {
  status: string;
  transaction_code?: string | null;
  message?: string | null;
  blocks_printed?: number;
  refunded?: number;
  total?: number | null;
}

export interface PosQuoteResponse {
  status: 'success' | 'notfound' | string;
  data?: PosQuoteData;
  message?: string;
}

export interface PosSettleResponse {
  status: 'success' | 'notfound' | 'already_paid' | string;
  data?: PosSettleData;
  message?: string;
}

export interface PosActionResponse {
  status: string;
  data?: PosActionData;
  message?: string;
}

export interface PosVoidRequest {
  transaction_code: string;
  reason?: string;
}

export interface PosPrintRequest {
  transaction_code: string;
  gate?: string | null;
}

export interface PosManualRequest {
  police_number: string;
  vehicle_id?: number | null;
  vehicle_type_id?: string | null;
  total?: number | null;
  payment_method?: string | null;
}