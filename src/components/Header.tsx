import React from 'react';
import { Shield, Bell, Moon, Sun, CheckCheck, LogOut, UserCheck, Users } from 'lucide-react';
import { UserRole, NotificationItem, AuthUser } from '../types';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  showAlertsDrawer: boolean;
  setShowAlertsDrawer: (val: boolean) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onNavigateToAdminUsers?: () => void;
  registeredCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  showAlertsDrawer,
  setShowAlertsDrawer,
  currentUser,
  onLogout,
  onNavigateToAdminUsers,
  registeredCount,
}) => {
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-xs">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base leading-none tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            Fraud Shield <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">v2.4 AI</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Insurance Fraud Detection & Decision System</p>
        </div>
      </div>

      {/* Global Action Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Dark Mode Toggle */}
        <button 
          id="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            id="alerts-toggle-btn"
            onClick={() => setShowAlertsDrawer(!showAlertsDrawer)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 transition-colors relative cursor-pointer"
            title="Alert Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showAlertsDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Alert Notifications ({notifications.length})
                </span>
                <button 
                  onClick={() => setNotifications(n => n.map(x => ({ ...x, unread: false })))} 
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              </div>
              <div className="space-y-2 mt-2.5 max-h-64 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className={`text-xs p-2.5 rounded-lg flex flex-col gap-1 border transition-all ${
                    n.unread 
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800'
                  }`}>
                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{n.text}</span>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700/60">
          <button 
            id="role-admin-btn"
            onClick={() => setRole('Admin')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${role === 'Admin' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Admin
          </button>
          <button 
            id="role-adjuster-btn"
            onClick={() => setRole('Adjuster')}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${role === 'Adjuster' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
          >
            Adjuster
          </button>
        </div>

        {/* Registered Users Directory Shortcut */}
        {onNavigateToAdminUsers && (
          <button
            id="admin-users-shortcut-btn"
            onClick={onNavigateToAdminUsers}
            className="p-1.5 px-2.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            title="Check who has registered in the system"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Registered Users</span>
            {typeof registeredCount === 'number' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-200/80 dark:bg-indigo-800/80 text-indigo-800 dark:text-indigo-200">
                {registeredCount}
              </span>
            )}
          </button>
        )}

        {/* User Identity Profile Card */}
        {currentUser && (
          <div className="flex items-center pl-2 border-l border-slate-200 dark:border-slate-800 space-x-2">
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 px-2.5 py-1 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center uppercase shadow-xs">
                {currentUser.name.charAt(0) || <UserCheck className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden sm:block text-left max-w-28 truncate">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate leading-tight">
                  {currentUser.email}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                id="user-logout-btn"
                onClick={onLogout}
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
                title="Sign out & Lock Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
