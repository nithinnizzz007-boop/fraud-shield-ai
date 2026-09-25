export interface SHAPFactor {
  factor: string;
  weight: number;
  impact: 'positive' | 'negative';
}

export interface TimelineEvent {
  date: string;
  title: string;
  detail: string;
}

export interface Claim {
  id: string;
  claimantName: string;
  age: number;
  policyNumber: string;
  premiumAmount: number;
  coverageType: string;
  claimAmount: number;
  claimType: 'auto' | 'health' | 'property';
  incidentDate: string;
  reportDate: string;
  incidentTime?: string;
  policeReport: boolean;
  witnesses?: number;
  providerId: string | null;
  region: string; // Indian zone: 'South', 'North', 'West', 'East'
  city?: string; // e.g. 'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'
  area?: string; // e.g. 'Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Electronic City'
  facilityName?: string; // Hospital / Clinic / Tech Park / Warehouse
  diagnosisOrLoss?: string; // Specific clinical condition or property damage
  status: 'Pending' | 'Confirmed Fraud' | 'Cleared';
  providerHistoryCount: number;
  policyStartDate: string;
  isOutlier: boolean;
  shapFactors: SHAPFactor[];
  timeline: TimelineEvent[];
}

export interface Weights {
  policyAge: number;
  ratioMultiplier: number;
  providerHistory: number;
  noPoliceReport: number;
}

export interface AuditLogItem {
  id: number;
  claimId: string;
  action: string;
  user: string;
  timestamp: string;
}

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

export interface RiskBucket {
  label: string;
  color: string;
}

export type UserRole = 'Admin' | 'Adjuster';

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  loginTime: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  employeeId: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  registeredAt: string;
  lastLogin: string;
  city?: string;
  phone?: string;
  avatarColor?: string;
}
