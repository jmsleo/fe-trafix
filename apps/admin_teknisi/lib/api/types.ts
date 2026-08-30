export type UserRole = 'admin' | 'finance' | 'teknisi' | 'operator';
export type UserStatus = 'active' | 'inactive';
export type VehicleStatus = 'active' | 'inactive';
export type MemberStatus = 'active' | 'inactive' | 'blocked';
export type ShiftStatus = 'active' | 'inactive';
export type SignageStatus = 'active' | 'inactive';
export type SignageContentType = 'text' | 'image' | 'video';
export type BackupStatus = 'running' | 'completed' | 'failed';
export type OperatorShiftAssignmentStatus = 'active' | 'inactive';
export type MemberSubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type FeeCategory = 'flat' | 'progresif';
export type ActiveStatus = 'active' | 'inactive';

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface SearchStatusParams extends PaginationParams {
  search?: string | null;
  status?: ActiveStatus | null;
}

export interface DateRangeParams extends PaginationParams {
  search?: string | null;
  date_from?: string | null;
  date_to?: string | null;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface UserBrief {
  id: string;
  name: string;
  username: string;
}

export interface UserRead {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  name: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  password: string;
}

export interface UserUpdate {
  name?: string | null;
  username?: string | null;
  password?: string | null;
  role?: UserRole | null;
  status?: UserStatus | null;
}

export interface PasswordReset {
  password: string;
}

export interface UserListParams extends SearchStatusParams {
  role?: UserRole | null;
}

export type UserPage = Page<UserRead>;

// ---------------------------------------------------------------------------
// Parking Rate
// ---------------------------------------------------------------------------

export interface ParkingRateCreate {
  name: string;
  vehicle_type_id: string;
  base_price: number;
  fee_category?: FeeCategory;
  grace_period_minutes?: number | null;
  ticket_charge?: number | null;
  stay_charge?: number | null;
  status?: ActiveStatus;
}

export interface ParkingRateUpdate {
  name?: string | null;
  vehicle_type_id?: string | null;
  base_price?: number | null;
  fee_category?: FeeCategory | null;
  grace_period_minutes?: number | null;
  ticket_charge?: number | null;
  stay_charge?: number | null;
  status?: ActiveStatus | null;
}

export interface ParkingRateStatusUpdate {
  status: ActiveStatus;
}

export interface ParkingRateRead {
  id: string;
  name: string;
  vehicle_type_id: string;
  base_price: number;
  fee_category?: FeeCategory;
  grace_period_minutes?: number | null;
  ticket_charge?: number | null;
  stay_charge?: number | null;
  status?: ActiveStatus;
  created_at: string;
  updated_at: string;
}

export type ParkingRatePage = Page<ParkingRateRead>;

// ---------------------------------------------------------------------------
// Vehicle Type
// ---------------------------------------------------------------------------

export interface VehicleTypeBrief {
  id: string;
  code: string;
  name: string;
  price: number | null;
  status: VehicleStatus;
}

export interface VehicleTypeCreate {
  code: string;
  name: string;
  price?: number | null;
  status: VehicleStatus;
}

export interface VehicleTypeUpdate {
  code?: string | null;
  name?: string | null;
  price?: number | null;
  status?: VehicleStatus | null;
}

export interface VehicleTypeRead {
  id: string;
  code: string;
  name: string;
  price: number | null;
  status: VehicleStatus;
  created_at: string;
  updated_at: string;
}

export type VehicleTypePage = Page<VehicleTypeRead>;

// ---------------------------------------------------------------------------
// Member
// ---------------------------------------------------------------------------

export interface MemberBrief {
  id: string;
  member_code: string;
  card_number?: string | null;
  name: string;
  status: MemberStatus;
}

export interface MemberCreate {
  name: string;
  email?: string | null;
  phone_number?: string | null;
  card_number?: string | null;
  status: MemberStatus;
  created_by?: string | null;
  police_number?: string | null;
  vehicle_type_id?: string | null;
  plan_id?: string | null;
}

export interface MemberUpdate {
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  card_number?: string | null;
  status?: MemberStatus | null;
  created_by?: string | null;
}

export interface MemberRead {
  id: string;
  member_code: string;
  card_number?: string | null;
  name: string;
  email?: string | null;
  phone_number?: string | null;
  status: MemberStatus;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
  vehicles?: MemberVehicleBrief[];
  subscriptions?: MemberSubscriptionBrief[];
}

export interface MemberListParams extends PaginationParams {
  search?: string | null;
  status?: MemberStatus | null;
}

export type MemberPage = Page<MemberRead>;

// ---------------------------------------------------------------------------
// Member Vehicle
// ---------------------------------------------------------------------------

export interface MemberVehicleTypeBrief {
  id: string;
  code: string;
  name: string;
}

export interface MemberVehicleBrief {
  id: string;
  police_number: string;
  vehicle_type: MemberVehicleTypeBrief;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Subscription Plan
// ---------------------------------------------------------------------------

export interface PlanBrief {
  id: string;
  name: string;
  duration_in_days: number;
  price: number;
  is_active: boolean;
}

export interface SubscriptionPlanCreate {
  name: string;
  duration_in_days: number;
  price: number;
  vehicle_type_id: string;
  is_active?: boolean;
}

export interface SubscriptionPlanUpdate {
  name?: string | null;
  duration_in_days?: number | null;
  price?: number | null;
  vehicle_type_id?: string | null;
  is_active?: boolean | null;
}

export interface SubscriptionPlanStatusUpdate {
  is_active: boolean;
}

export interface SubscriptionPlanRead {
  id: string;
  name: string;
  duration_in_days: number;
  price: number;
  vehicle_type_id: string;
  vehicle_type: { id: string; code: string; name: string };
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanListParams extends PaginationParams {
  search?: string | null;
  is_active?: boolean | null;
}

export type SubscriptionPlanPage = Page<SubscriptionPlanRead>;

// ---------------------------------------------------------------------------
// Member Subscription
// ---------------------------------------------------------------------------

export interface MemberSubscriptionBrief {
  id: string;
  plan: PlanBrief;
  start_date: string;
  end_date: string;
  status: string;
}

export interface MemberSubscriptionCreate {
  member_id: string;
  plan_id: string;
  start_date?: string | null;
}

export interface MemberSubscriptionRead {
  id: string;
  member_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  status: MemberSubscriptionStatus;
  member: MemberBrief;
  plan: PlanBrief;
  created_at: string;
  updated_at: string;
}

export interface MemberSubscriptionListParams extends PaginationParams {
  member_id?: string | null;
  plan_id?: string | null;
}

export type MemberSubscriptionPage = Page<MemberSubscriptionRead>;

// ---------------------------------------------------------------------------
// Shift
// ---------------------------------------------------------------------------

export interface ShiftBrief {
  id: string;
  name: string;
  start_time: string;
  finish_time: string;
  crosses_midnight: boolean;
}

export interface ShiftCreate {
  name: string;
  start_time: string;
  finish_time: string;
  crosses_midnight?: boolean;
  status: ShiftStatus;
}

export interface ShiftUpdate {
  name?: string | null;
  start_time?: string | null;
  finish_time?: string | null;
  crosses_midnight?: boolean | null;
  status?: ShiftStatus | null;
}

export interface ShiftRead {
  id: string;
  name: string;
  start_time: string;
  finish_time: string;
  crosses_midnight?: boolean;
  status: ShiftStatus;
  created_at: string;
  updated_at: string;
}

export type ShiftPage = Page<ShiftRead>;

// ---------------------------------------------------------------------------
// Operator Shift Assignment
// ---------------------------------------------------------------------------

export interface OperatorBrief {
  id: string;
  name: string;
  username: string;
}

export interface OperatorShiftAssignmentCreate {
  operator_id: string;
  shift_id: string;
}

export interface OperatorShiftAssignmentRead {
  id: string;
  operator_id: string;
  shift_id: string;
  status: OperatorShiftAssignmentStatus;
  operator: OperatorBrief;
  shift: ShiftBrief;
  created_at: string;
  updated_at: string;
}

export interface OperatorShiftAssignmentListParams extends PaginationParams {
  operator_id?: string | null;
}

export type OperatorShiftAssignmentPage = Page<OperatorShiftAssignmentRead>;

// ---------------------------------------------------------------------------
// Signage
// ---------------------------------------------------------------------------

export interface SignageBrief {
  id: string;
  name: string;
  code: string;
  status: SignageStatus;
}

export interface SignageCreate {
  name: string;
  code: string;
  location?: string | null;
  status?: SignageStatus;
}

export interface SignageUpdate {
  name?: string | null;
  code?: string | null;
  location?: string | null;
  status?: SignageStatus | null;
}

export interface SignageStatusUpdate {
  status: SignageStatus;
}

export interface SignageRead {
  id: string;
  name: string;
  code: string;
  location?: string | null;
  status?: SignageStatus;
  created_at: string;
  updated_at: string;
}

export type SignagePage = Page<SignageRead>;

// ---------------------------------------------------------------------------
// Signage Content
// ---------------------------------------------------------------------------

export interface SignageContentBrief {
  id: string;
  title: string;
  content_type: SignageContentType;
  is_active: boolean;
}

export interface SignageContentCreate {
  title: string;
  content_type?: SignageContentType;
  is_active?: boolean;
  body: string;
}

export interface SignageContentUpdate {
  title?: string | null;
  content_type?: SignageContentType | null;
  body?: string | null;
  is_active?: boolean | null;
  broadcast_start?: string | null;
  broadcast_end?: string | null;
}

export interface SignageContentStatusUpdate {
  is_active: boolean;
}

export interface SignageContentRead {
  id: string;
  title: string;
  content_type?: SignageContentType;
  is_active?: boolean;
  body?: string;
  file_path?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | null;
  broadcast_start?: string | null;
  broadcast_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignageContentListParams extends PaginationParams {
  search?: string | null;
  content_type?: SignageContentType | null;
  is_active?: boolean | null;
}

export type SignageContentPage = Page<SignageContentRead>;

// ---------------------------------------------------------------------------
// Signage Assignment
// ---------------------------------------------------------------------------

export interface SignageAssignmentCreate {
  signage_id: string;
  content_id: string;
  is_active?: boolean;
}

export interface SignageAssignmentStatusUpdate {
  is_active: boolean;
}

export interface SignageAssignmentRead {
  id: string;
  signage_id: string;
  content_id: string;
  is_active: boolean;
  signage: SignageBrief;
  content: SignageContentBrief;
  created_at: string;
  updated_at: string;
}

export interface SignageAssignmentListParams extends PaginationParams {
  signage_id?: string | null;
  content_id?: string | null;
  is_active?: boolean | null;
}

export type SignageAssignmentPage = Page<SignageAssignmentRead>;

// ---------------------------------------------------------------------------
// Signage Schedule
// ---------------------------------------------------------------------------

export interface SignageScheduleCreate {
  signage_id: string;
  content_id: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export interface SignageScheduleUpdate {
  signage_id?: string | null;
  content_id?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_active?: boolean | null;
}

export interface SignageScheduleStatusUpdate {
  is_active: boolean;
}

export interface SignageScheduleRead {
  id: string;
  signage_id: string;
  content_id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  signage: SignageBrief;
  content: SignageContentBrief;
  created_at: string;
  updated_at: string;
}

export interface SignageScheduleListParams extends PaginationParams {
  signage_id?: string | null;
  content_id?: string | null;
  is_active?: boolean | null;
}

export type SignageSchedulePage = Page<SignageScheduleRead>;

// ---------------------------------------------------------------------------
// Backup
// ---------------------------------------------------------------------------

export interface BackupRead {
  id: string;
  filename: string;
  format: string;
  size_bytes: number;
  progress?: number;
  status: BackupStatus;
  error_message: string | null;
  created_by: string | null;
  last_restored_at: string | null;
  last_restored_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackupListParams extends PaginationParams {
  search?: string | null;
  status?: BackupStatus | null;
}

export type BackupPage = Page<BackupRead>;

export interface BackupRestoreRequest {
  confirm?: boolean;
}

export interface AutoBackupConfig {
  enabled: boolean;
  time: string;
  timezone: string;
}

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export interface AuditLogRead {
  id: string;
  user_id?: string | null;
  role?: string | null;
  module: string;
  action: string;
  description?: string | null;
  created_at: string;
  user?: UserBrief | null;
}

export interface AuditLogListParams extends DateRangeParams {
  module?: string | null;
  action?: string | null;
  role?: string | null;
  user_id?: string | null;
}

export type AuditLogPage = Page<AuditLogRead>;

export interface AuditCleanupConfig {
  enabled: boolean;
  weekday: number;
  time: string;
  timezone: string;
}

// ---------------------------------------------------------------------------
// Gate
// ---------------------------------------------------------------------------

export type GateType = 'gate_in' | 'gate_out';
export type GateStatus = 'online' | 'offline';

export interface GateCreate {
  name: string;
  gate_code?: string | null;
  type: GateType;
  status: GateStatus;
}

export interface GateUpdate {
  name?: string | null;
  gate_code?: string | null;
  type?: GateType | null;
  status?: GateStatus | null;
}

export interface GateRead {
  id: string;
  name: string;
  gate_code?: string | null;
  type: GateType;
  status: GateStatus;
  created_at: string;
  updated_at: string;
}

export interface GateListParams extends PaginationParams {
  search?: string | null;
  type?: GateType | null;
}

export type GatePage = Page<GateRead>;

// ---------------------------------------------------------------------------
// Gate health (live monitoring)
// ---------------------------------------------------------------------------

export interface GateHealthEntry {
  gate_code: string;
  is_online: boolean;
  connection_type: 'mqtt' | 'tcp' | 'both' | string;
  last_heartbeat_at?: number | null;
  last_input_at?: number | null;
  sensor_states: Record<string, boolean>;
  relay_states: Record<string, boolean>;
  firmware_version?: string | null;
  total_heartbeats: number;
  total_inputs: number;
}

// ---------------------------------------------------------------------------
// Device
// ---------------------------------------------------------------------------

export type DeviceStatus = 'online' | 'offline' | 'trouble';
export type DeviceKind = 'controller' | 'lpr' | 'camera' | 'reader' | 'signage' | 'other';

export interface DeviceCreate {
  gate_id: string;
  name: string;
  type: string;
  ip_address: string;
  config?: Record<string, unknown> | null;
  status?: DeviceStatus;
}

export interface DeviceUpdate {
  gate_id?: string | null;
  name?: string | null;
  type?: string | null;
  ip_address?: string | null;
  config?: Record<string, unknown> | null;
  status?: DeviceStatus | null;
}

export interface DeviceRead {
  id: string;
  gate_id: string;
  name: string;
  type: string;
  ip_address: string;
  config?: Record<string, unknown> | null;
  status: DeviceStatus;
  last_heartbeat?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceListParams extends PaginationParams {
  search?: string | null;
  type?: string | null;
  gate_id?: string | null;
}

export type DevicePage = Page<DeviceRead>;

// ---------------------------------------------------------------------------
// Monitoring: consolidated live device list
// ---------------------------------------------------------------------------

export interface DeviceMonitorItem {
  id: string;
  name: string;
  type: string;
  kind: DeviceKind;
  ip_address: string;
  gate_id: string;
  gate_code?: string | null;
  gate_name?: string | null;
  config: Record<string, unknown>;
  status: DeviceStatus;
  last_heartbeat?: string | null;
  registry: Record<string, unknown>;
  connection_type?: string;
  sensors?: Record<string, boolean>;
  relays?: Record<string, boolean>;
  firmware?: string | null;
  signage_status?: string;
  probe?: { reachable: boolean; latency_ms?: number | null; status_code?: number | null; detail?: string } | null;
}

export interface DeviceMonitorListParams extends PaginationParams {
  search?: string | null;
  type?: string | null;
  kind?: DeviceKind | null;
  gate_code?: string | null;
  status?: DeviceStatus | null;
  probe?: boolean;
}

export interface DeviceMonitorPage {
  items: DeviceMonitorItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  last_updated: string;
}

export interface MonitoringSnapshot {
  devices: DeviceMonitorPage;
  mqtt: MonitoringMqtt;
}

// ---------------------------------------------------------------------------
// System / MQTT
// ---------------------------------------------------------------------------

export interface MqttStatus {
  connected: boolean;
  host?: string;
  port?: number;
  uptime_seconds?: number | null;
  reconnect_count?: number;
  disconnect_count?: number;
  last_connect_at?: number | null;
  last_disconnect_at?: number | null;
}

export interface TcpConnectionInfo {
  gate_code: string;
  host: string;
  port: number;
  connected: boolean;
  last_rx_at?: number;
  heartbeat_fail_streak?: number;
}

export interface TcpStatus {
  enabled: boolean;
  connected_gates: number;
  total_gates: number;
  connections: TcpConnectionInfo[];
}

export interface SystemHealth {
  status: string;
  uptime_seconds: number;
  mqtt: MqttStatus;
  tcp: { connected_gates: number; total_gates: number };
  gates_online?: number;
  gates_offline?: number;
  gates_total?: number;
}

export interface MonitoringMqtt {
  mqtt: MqttStatus;
  tcp: TcpStatus;
}

export interface MqttConfig {
  host: string;
  port: number;
  keepalive: number;
  username?: string | null;
  password?: string | null;
  client_id_prefix: string;
}

export type MqttConfigUpdate = MqttConfig;

// ---------------------------------------------------------------------------
// Monitoring: signage display, reader events, device log
// ---------------------------------------------------------------------------

export interface SignageDisplayStatus {
  gate_code: string;
  status: string;
  plate_number?: string;
  transaction_code?: string;
  ads_count: number;
  media_count: number;
  has_idle_image: boolean;
  last_updated: string;
}

export interface ReaderEvent {
  id: string;
  ts: string;
  gate?: string | null;
  source: string;
  detail?: string | null;
}

export interface ReaderEventPage {
  events: ReaderEvent[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DeviceLogEntry {
  id: string;
  ts: string;
  gate?: string | null;
  source: string;
  method?: string | null;
  ticket_number?: string | null;
  detail?: string | null;
}

export interface DeviceLogPage {
  events: DeviceLogEntry[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DeviceLogParams extends PaginationParams {
  gate?: string | null;
  source?: string | null;
  method?: string | null;
  date_from?: string | null;
  date_to?: string | null;
}

// ---------------------------------------------------------------------------
// Test connection / restart
// ---------------------------------------------------------------------------

export interface TestResult {
  device_id: string;
  name: string;
  type: string;
  kind: DeviceKind;
  status: DeviceStatus;
  reachable: boolean;
  detail?: string;
  latency_ms?: number | null;
  status_code?: number | null;
}

export type RestartResultStatus = 'restarted' | 'failed' | 'not_supported';

export interface RestartResult {
  device_id: string;
  name: string;
  type: string;
  kind: DeviceKind;
  status: RestartResultStatus;
  detail?: string;
}
