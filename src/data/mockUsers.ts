import { RegisteredUser } from '../types';

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'USR-001',
    name: 'Vikramaditya Sengupta',
    email: 'v.sengupta@fraudshield.ai',
    role: 'Admin',
    department: 'Special Investigation Unit (SIU)',
    employeeId: 'SIU-BLR-0891',
    status: 'Active',
    registeredAt: '2025-08-14',
    lastLogin: 'Today, 06:30 AM',
    city: 'Bangalore',
    phone: '+91 98450 12891',
    avatarColor: 'bg-indigo-600'
  },
  {
    id: 'USR-002',
    name: 'Pooja Nair',
    email: 'p.nair@claims-assurance.com',
    role: 'Adjuster',
    department: 'Claims Adjudication',
    employeeId: 'ADJ-KA-4412',
    status: 'Active',
    registeredAt: '2025-10-02',
    lastLogin: 'Today, 05:45 AM',
    city: 'Bangalore',
    phone: '+91 97412 55230',
    avatarColor: 'bg-emerald-600'
  },
  {
    id: 'USR-003',
    name: 'Rajesh Sharma',
    email: 'r.sharma@general-underwriting.in',
    role: 'Admin',
    department: 'Property Underwriting & Risk',
    employeeId: 'MGR-HQ-1002',
    status: 'Active',
    registeredAt: '2025-11-20',
    lastLogin: 'Yesterday, 04:12 PM',
    city: 'Mumbai',
    phone: '+91 98200 99411',
    avatarColor: 'bg-purple-600'
  },
  {
    id: 'USR-004',
    name: 'Ananya Deshmukh',
    email: 'a.deshmukh@health-tpa.org',
    role: 'Adjuster',
    department: 'Health TPA Compliance',
    employeeId: 'TPA-MH-7821',
    status: 'Active',
    registeredAt: '2026-01-08',
    lastLogin: '2 days ago',
    city: 'Pune',
    phone: '+91 94220 81290',
    avatarColor: 'bg-cyan-600'
  },
  {
    id: 'USR-005',
    name: 'Karthik Ramanathan',
    email: 'k.ramanathan@autoclaims.in',
    role: 'Adjuster',
    department: 'Automotive Loss Inspection',
    employeeId: 'ADJ-TN-3190',
    status: 'Active',
    registeredAt: '2026-02-15',
    lastLogin: 'Yesterday, 11:20 AM',
    city: 'Chennai',
    phone: '+91 94440 22091',
    avatarColor: 'bg-amber-600'
  },
  {
    id: 'USR-006',
    name: 'Priya Sundaram',
    email: 'p.sundaram@fraudshield.ai',
    role: 'Admin',
    department: 'Special Investigation Unit (SIU)',
    employeeId: 'SIU-BLR-0914',
    status: 'Active',
    registeredAt: '2026-03-01',
    lastLogin: '3 days ago',
    city: 'Bangalore',
    phone: '+91 98860 33410',
    avatarColor: 'bg-rose-600'
  },
  {
    id: 'USR-007',
    name: 'Amitav Mukherjee',
    email: 'a.mukherjee@east-claims.com',
    role: 'Adjuster',
    department: 'Claims Adjudication',
    employeeId: 'ADJ-WB-5582',
    status: 'Active',
    registeredAt: '2026-04-10',
    lastLogin: '1 week ago',
    city: 'Kolkata',
    phone: '+91 98300 77123',
    avatarColor: 'bg-teal-600'
  },
  {
    id: 'USR-008',
    name: 'Sneha Reddy',
    email: 's.reddy@hyderabad-audit.in',
    role: 'Adjuster',
    department: 'Commercial Property Audit',
    employeeId: 'AUD-TS-9011',
    status: 'Pending Approval',
    registeredAt: '2026-09-20',
    lastLogin: 'Pending First Sign-in',
    city: 'Hyderabad',
    phone: '+91 90001 44520',
    avatarColor: 'bg-slate-500'
  }
];

export function getStoredRegisteredUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem('fs_registered_users');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load registered users from storage', e);
  }
  return INITIAL_REGISTERED_USERS;
}

export function saveRegisteredUsers(users: RegisteredUser[]): void {
  try {
    localStorage.setItem('fs_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users', e);
  }
}

export function registerOrUpdateUser(user: {
  name: string;
  email: string;
  role: 'Admin' | 'Adjuster';
  department?: string;
  employeeId?: string;
  city?: string;
  phone?: string;
  isPendingRequest?: boolean;
}): RegisteredUser {
  const users = getStoredRegisteredUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());

  const colors = [
    'bg-indigo-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-cyan-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-teal-600',
    'bg-blue-600'
  ];

  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    const updated: RegisteredUser = {
      ...existing,
      name: user.name || existing.name,
      role: user.role || existing.role,
      department: user.department || existing.department,
      employeeId: user.employeeId || existing.employeeId,
      city: user.city || existing.city,
      phone: user.phone || existing.phone,
      lastLogin: 'Just now'
    };
    users[existingIndex] = updated;
    saveRegisteredUsers(users);
    return updated;
  } else {
    const newUser: RegisteredUser = {
      id: `USR-00${users.length + 1}`,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'Special Investigation Unit (SIU)',
      employeeId: user.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: user.isPendingRequest ? 'Pending Approval' : 'Active',
      registeredAt: new Date().toISOString().split('T')[0],
      lastLogin: user.isPendingRequest ? 'Pending First Sign-in' : 'Just now',
      city: user.city || 'Bangalore',
      phone: user.phone || '+91 98800 12345',
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };
    const updatedList = [newUser, ...users];
    saveRegisteredUsers(updatedList);
    return newUser;
  }
}
