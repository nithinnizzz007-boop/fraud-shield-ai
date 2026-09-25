import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Building,
  MapPin,
  Phone,
  MoreVertical,
  Check,
  UserCheck,
  Lock,
  RefreshCw,
  AlertTriangle,
  X,
  Sparkles
} from 'lucide-react';
import { RegisteredUser, UserRole } from '../types';
import { saveRegisteredUsers } from '../data/mockUsers';

interface AdminUsersTabProps {
  users: RegisteredUser[];
  onUpdateUsers: (updatedUsers: RegisteredUser[]) => void;
  currentAdminRole: UserRole;
  currentAdminEmail?: string;
  onAuditAction?: (action: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUsers,
  currentAdminRole,
  currentAdminEmail,
  onAuditAction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Admin' | 'Adjuster'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Pending Approval' | 'Suspended'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [highlightedUserId, setHighlightedUserId] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Adjuster');
  const [newDept, setNewDept] = useState('Special Investigation Unit (SIU)');
  const [newEmployeeId, setNewEmployeeId] = useState('');
  const [newCity, setNewCity] = useState('Bangalore');
  const [newPhone, setNewPhone] = useState('+91 ');
  const [formError, setFormError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Statistics
  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const adjusterCount = users.filter(u => u.role === 'Adjuster').length;
  const pendingCount = users.filter(u => u.status === 'Pending Approval').length;
  const blrCount = users.filter(u => (u.city || '').toLowerCase().includes('bangalore')).length;

  // Filtered List
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.employeeId.toLowerCase().includes(q) ||
        user.department.toLowerCase().includes(q) ||
        (user.city || '').toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesCity = cityFilter === 'all' || user.city === cityFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesCity;
    });
  }, [users, searchQuery, roleFilter, statusFilter, cityFilter]);

  // Actions
  const handleApprove = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'Active' as const, lastLogin: 'Approved by Admin' };
      }
      return u;
    });
    onUpdateUsers(updated);
    setSuccessNotice(`User approved and granted active credentials.`);
    onAuditAction?.(`Approved registration for user ID ${userId}`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleToggleRole = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextRole: UserRole = u.role === 'Admin' ? 'Adjuster' : 'Admin';
        return { ...u, role: nextRole };
      }
      return u;
    });
    onUpdateUsers(updated);
    setSuccessNotice(`User role updated successfully.`);
    onAuditAction?.(`Changed role for user ID ${userId}`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleToggleStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus as 'Active' | 'Suspended' };
      }
      return u;
    });
    onUpdateUsers(updated);
    setSuccessNotice(`Account status updated.`);
    onAuditAction?.(`Toggled status for user ID ${userId}`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.email === currentAdminEmail) {
      alert("Security Constraint: You cannot delete your own active admin account.");
      return;
    }
    if (confirm(`Are you sure you want to revoke and delete access for ${target.name} (${target.email})?`)) {
      const updated = users.filter(u => u.id !== userId);
      onUpdateUsers(updated);
      setSuccessNotice(`Account for ${target.name} revoked.`);
      onAuditAction?.(`Revoked user access for ${target.email}`);
      setTimeout(() => setSuccessNotice(null), 3500);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim();

    if (!trimmedName) {
      setFormError('Name is required.');
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setFormError('A valid corporate email address is required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      setFormError('A user with this email address already exists in the registry.');
      return;
    }

    const colors = [
      'bg-indigo-600',
      'bg-emerald-600',
      'bg-purple-600',
      'bg-cyan-600',
      'bg-amber-600',
      'bg-rose-600'
    ];

    const newUser: RegisteredUser = {
      id: `USR-00${users.length + 1}`,
      name: trimmedName,
      email: trimmedEmail,
      role: newRole,
      department: newDept,
      employeeId: newEmployeeId.trim() || `SIU-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      registeredAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Provisioned Just Now',
      city: newCity,
      phone: newPhone.trim() || undefined,
      avatarColor: colors[Math.floor(Math.random() * colors.length)]
    };

    const updatedList = [newUser, ...users];
    onUpdateUsers(updatedList);
    saveRegisteredUsers(updatedList);

    // Reset filters so the newly registered user is immediately visible at the top
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCityFilter('all');
    setHighlightedUserId(newUser.id);
    setTimeout(() => setHighlightedUserId(null), 6000);

    setSuccessNotice(`User ${trimmedName} (${trimmedEmail}) successfully registered in the Directory and granted ${newRole} credentials.`);
    onAuditAction?.(`Registered new user ${trimmedEmail} (${newRole}) into directory`);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewEmployeeId('');
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Department', 'Employee ID', 'City', 'Status', 'Registered Date', 'Last Active'];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${u.name}"`,
      u.email,
      u.role,
      `"${u.department}"`,
      u.employeeId,
      u.city || '',
      u.status,
      u.registeredAt,
      `"${u.lastLogin}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FraudShield_Registered_Users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner / Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-2.5 rounded-xl text-white shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Registered Users & Staff Directory
              </h2>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                currentAdminRole === 'Admin'
                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}>
                {currentAdminRole === 'Admin' ? 'Admin Full Access' : 'Team Directory View'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
              Inspect all registered personnel, claims adjusters, SIU investigators, and administrators in the Fraud Shield platform. Review roles, contact details, regional hub assignments, and activity timestamps.
            </p>
            {currentAdminRole !== 'Admin' && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1 font-medium">
                <span>Tip: Switch to "Admin" using the role toggle in the top header to approve pending requests, provision accounts, or edit roles.</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="export-users-btn"
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="add-user-modal-btn"
            onClick={() => { setShowAddModal(true); setFormError(null); }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register User</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Access Restriction Notice if user is non-admin */}
      {currentAdminRole !== 'Admin' && (
        <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Read-Only Adjuster Mode:</strong> You are browsing the directory with standard Adjuster clearance. Modification of roles, approvals, and credential revocation requires Admin / SIU clearance.
          </span>
        </div>
      )}

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Registered</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-baseline gap-1.5">
            {totalCount}
            <span className="text-[10px] text-slate-400 font-normal">users</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Active SIU Admins</div>
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
            {adminCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Claims Adjusters</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {adjusterCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pending Requests</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
            {pendingCount}
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Bangalore Hub Staff</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {blrCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by staff name, work email, employee ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 text-xs">
                Clear
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin Only</option>
              <option value="Adjuster">Adjuster Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Suspended">Suspended</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

        </div>
      </div>

      {/* Registered Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="p-3.5">Staff Member & ID</th>
                <th className="p-3.5">Contact & Corporate Email</th>
                <th className="p-3.5">Role & Clearance</th>
                <th className="p-3.5">Department & Hub</th>
                <th className="p-3.5">Registration & Login</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-medium text-slate-600 dark:text-slate-300">No registered staff members found matching your search and filter criteria.</p>
                    <button
                      type="button"
                      onClick={() => { setShowAddModal(true); setFormError(null); }}
                      className="mt-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Register User Now</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.email.toLowerCase() === (currentAdminEmail || '').toLowerCase();
                  const isJustRegistered = u.id === highlightedUserId;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-all duration-300 ${
                        isJustRegistered
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/60 ring-2 ring-emerald-500/50'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      
                      {/* Name & ID */}
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${u.avatarColor || 'bg-indigo-600'} text-white font-bold flex items-center justify-center text-xs shadow-xs uppercase shrink-0`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold">
                                  YOU
                                </span>
                              )}
                              {isJustRegistered && (
                                <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold flex items-center gap-1 animate-pulse">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Just Registered</span>
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {u.employeeId} &bull; {u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="p-3.5">
                        <div className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Role & Clearance */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10.5px] font-bold border ${
                          u.role === 'Admin'
                            ? 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            : 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        }`}>
                          <Shield className="w-3 h-3" />
                          {u.role === 'Admin' ? 'Admin / SIU Lead' : 'Claims Adjuster'}
                        </span>
                      </td>

                      {/* Department & Hub */}
                      <td className="p-3.5">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">{u.department}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                          <span>{u.city || 'Bangalore'} Hub</span>
                        </div>
                      </td>

                      {/* Registration & Login */}
                      <td className="p-3.5">
                        <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                          Joined: <span className="font-semibold text-slate-800 dark:text-slate-200">{u.registeredAt}</span>
                        </div>
                        <div className="text-[10.5px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{u.lastLogin}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : u.status === 'Pending Approval'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'Active' ? 'bg-emerald-500' : u.status === 'Pending Approval' ? 'bg-amber-500' : 'bg-red-500'
                          }`} />
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                        {u.status === 'Pending Approval' ? (
                          <button
                            onClick={() => handleApprove(u.id)}
                            disabled={currentAdminRole !== 'Admin'}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                          >
                            Approve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleRole(u.id)}
                            disabled={currentAdminRole !== 'Admin' || isCurrent}
                            title={isCurrent ? "Cannot change own active role" : "Toggle Admin / Adjuster role"}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-medium transition-colors disabled:opacity-40 cursor-pointer"
                          >
                            {u.role === 'Admin' ? 'Demote to Adj' : 'Promote to Admin'}
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          disabled={currentAdminRole !== 'Admin' || isCurrent}
                          title={u.status === 'Active' ? 'Suspend account' : 'Reactivate account'}
                          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors disabled:opacity-40 cursor-pointer ${
                            u.status === 'Active'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={currentAdminRole !== 'Admin' || isCurrent}
                          title="Revoke & delete account"
                          className="px-2 py-1 bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-md text-[11px] font-medium transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Revoke
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Register User to Directory</h3>
                  <p className="text-[11px] text-slate-500">Provision and link new investigator credentials directly into the registered roster</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. a.mahindra@fraudshield.ai"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Role & Clearance</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Adjuster">Claims Adjuster</option>
                    <option value="Admin">Admin / SIU Lead</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Hub City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Pune">Pune</option>
                    <option value="Kolkata">Kolkata</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option>Special Investigation Unit (SIU)</option>
                    <option>Claims Adjudication</option>
                    <option>Property Underwriting & Risk</option>
                    <option>Health TPA Compliance</option>
                    <option>Automotive Loss Inspection</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Employee ID</label>
                  <input
                    type="text"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    placeholder="e.g. SIU-BLR-1140"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Official Mobile / Contact</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-register-user-btn"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register User to Directory</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
