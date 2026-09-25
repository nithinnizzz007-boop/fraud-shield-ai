import React, { useState, useEffect, useCallback } from 'react';
import { Claim, UserRole, Weights, AuditLogItem, NotificationItem, AuthUser, RegisteredUser } from './types';
import { INITIAL_CLAIMS } from './data/mockClaims';
import { getStoredRegisteredUsers, saveRegisteredUsers } from './data/mockUsers';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { MetricsBanner } from './components/MetricsBanner';
import { DashboardTab } from './components/DashboardTab';
import { IntakeTab } from './components/IntakeTab';
import { LinkAnalysisTab } from './components/LinkAnalysisTab';
import { RulesTab } from './components/RulesTab';
import { FeedbackTab } from './components/FeedbackTab';
import { AdminUsersTab } from './components/AdminUsersTab';
import { SHAPDrawer } from './components/SHAPDrawer';
import { MetricsModal } from './components/MetricsModal';
import { RetrainModal } from './components/RetrainModal';
import { BulkUploadModal } from './components/BulkUploadModal';

export default function App() {
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('fs_auth_user') || sessionStorage.getItem('fs_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // --- STATE ---
  const [claims, setClaims] = useState<Claim[]>(() => {
    try {
      const saved = localStorage.getItem('fs_claims');
      return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
    } catch {
      return INITIAL_CLAIMS;
    }
  });

  const [role, setRole] = useState<UserRole>(() => {
    return currentUser?.role || 'Admin';
  });
  const [riskThreshold, setRiskThreshold] = useState<number>(65);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Custom Weights State
  const [weights, setWeights] = useState<Weights>({
    policyAge: 35,
    ratioMultiplier: 25,
    providerHistory: 30,
    noPoliceReport: 10
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [graphFilterNode, setGraphFilterNode] = useState<string | null>(null);

  // Modals & UI States
  const [showBulkUpload, setShowBulkUpload] = useState<boolean>(false);
  const [showRetrainModal, setShowRetrainModal] = useState<boolean>(false);
  const [showMetricsModal, setShowMetricsModal] = useState<boolean>(false);
  const [retrainProgress, setRetrainProgress] = useState<number>(0);
  const [retrainComplete, setRetrainComplete] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, text: 'High risk claim CLM-1092 submitted (>85% score)', time: '10m ago', unread: true },
    { id: 2, text: 'Potential network ring flagged in South Region (GAR-402)', time: '1h ago', unread: true },
    { id: 3, text: 'Model v2.4 drift validation passed with 91.4% precision', time: '3h ago', unread: false }
  ]);
  const [showAlertsDrawer, setShowAlertsDrawer] = useState<boolean>(false);
  const [trainingData, setTrainingData] = useState<Claim[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogItem[]>([]);

  // Registered Users State for Admin Management
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    return getStoredRegisteredUsers();
  });

  const handleUpdateRegisteredUsers = (updated: RegisteredUser[]) => {
    setRegisteredUsers(updated);
    saveRegisteredUsers(updated);
  };

  // Sync to document.documentElement for Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('fs_claims', JSON.stringify(claims));
  }, [claims]);

  // Adjuster Action Handlers
  const handleUpdateStatus = useCallback((claimId: string, status: 'Confirmed Fraud' | 'Cleared') => {
    setClaims(prev => prev.map(c => {
      if (c.id === claimId) {
        const updated: Claim = { ...c, status };
        // Add to feedback training queue
        setTrainingData(td => [updated, ...td]);
        // Log to Audit Trail
        setAuditLog(al => [{
          id: Date.now(),
          claimId: c.id,
          action: `Marked as ${status}`,
          user: role,
          timestamp: new Date().toLocaleTimeString()
        }, ...al]);
        // Update selectedClaim if currently inspected
        if (selectedClaim?.id === claimId) {
          setSelectedClaim(updated);
        }
        return updated;
      }
      return c;
    }));
  }, [role, selectedClaim]);

  // Keyboard Hotkeys Support (F: Confirm Fraud, A: Clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (!selectedClaim) return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleUpdateStatus(selectedClaim.id, 'Confirmed Fraud');
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleUpdateStatus(selectedClaim.id, 'Cleared');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClaim, handleUpdateStatus]);

  // Retrain Simulation Trigger
  const startRetrain = () => {
    setShowRetrainModal(true);
    setRetrainProgress(0);
    setRetrainComplete(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        setRetrainProgress(100);
        setRetrainComplete(true);
      } else {
        setRetrainProgress(progress);
      }
    }, 350);
  };

  const handleAddClaim = (newClaim: Claim) => {
    setClaims(prev => [newClaim, ...prev]);
    // Add alert notification
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `New claim ${newClaim.id} entered for ${newClaim.claimantName} ($${newClaim.claimAmount.toLocaleString()})`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
  };

  const handleImportClaims = (newClaims: Claim[]) => {
    setClaims(prev => [...newClaims, ...prev]);
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `Bulk import: ${newClaims.length} new claims added to queue`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setRole(user.role);
    setRegisteredUsers(getStoredRegisteredUsers());
    setAuditLog(prev => [
      {
        id: Date.now(),
        claimId: 'AUTH-GATE',
        action: `User session authenticated (${user.email}) as ${user.role}`,
        user: user.role,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `Welcome ${user.name}! Session started with ${user.role} privileges`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('fs_auth_user');
    sessionStorage.removeItem('fs_auth_user');
    setCurrentUser(null);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      if (localStorage.getItem('fs_auth_user')) {
        localStorage.setItem('fs_auth_user', JSON.stringify(updated));
      } else if (sessionStorage.getItem('fs_auth_user')) {
        sessionStorage.setItem('fs_auth_user', JSON.stringify(updated));
      }
    }
  };

  // If not authenticated, display login interface
  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Adjuster Dashboard' },
    { id: 'intake', label: 'Claim Intake & Bulk Upload' },
    { id: 'linkAnalysis', label: 'Fraud Ring Link Graph' },
    { id: 'rules', label: 'Rule Engine & Weights' },
    { id: 'feedback', label: 'Feedback Loop & Retraining' },
    { id: 'adminUsers', label: 'Registered Users Directory', count: registeredUsers.length }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 text-sm font-sans flex flex-col`}>
      {/* Top Header */}
      <Header
        role={role}
        setRole={handleRoleChange}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        setNotifications={setNotifications}
        showAlertsDrawer={showAlertsDrawer}
        setShowAlertsDrawer={setShowAlertsDrawer}
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateToAdminUsers={() => setActiveTab('adminUsers')}
        registeredCount={registeredUsers.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 space-y-4 w-full flex-1">
        {/* Model Metrics Banner */}
        <MetricsBanner onOpenMetricsModal={() => setShowMetricsModal(true)} />

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 md:space-x-4 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            claims={claims}
            role={role}
            riskThreshold={riskThreshold}
            setRiskThreshold={setRiskThreshold}
            weights={weights}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterType={filterType}
            setFilterType={setFilterType}
            filterRegion={filterRegion}
            setFilterRegion={setFilterRegion}
            graphFilterNode={graphFilterNode}
            setGraphFilterNode={setGraphFilterNode}
            onSelectClaim={(claim) => setSelectedClaim(claim)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'intake' && (
          <IntakeTab
            onAddClaim={handleAddClaim}
            onOpenBulkUpload={() => setShowBulkUpload(true)}
          />
        )}

        {activeTab === 'linkAnalysis' && (
          <LinkAnalysisTab
            graphFilterNode={graphFilterNode}
            setGraphFilterNode={setGraphFilterNode}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'rules' && (
          <RulesTab
            weights={weights}
            setWeights={setWeights}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackTab
            trainingData={trainingData}
            auditLog={auditLog}
            role={role}
            onStartRetrain={startRetrain}
          />
        )}

        {activeTab === 'adminUsers' && (
          <AdminUsersTab
            users={registeredUsers}
            onUpdateUsers={handleUpdateRegisteredUsers}
            currentAdminRole={role}
            currentAdminEmail={currentUser?.email}
            onAuditAction={(action) => {
              setAuditLog(prev => [{
                id: Date.now(),
                claimId: 'USER-REGISTRY',
                action,
                user: role,
                timestamp: new Date().toLocaleTimeString()
              }, ...prev]);
            }}
          />
        )}
      </main>

      {/* SHAP Explainability Drawer */}
      {selectedClaim && (
        <SHAPDrawer
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Metrics Modal */}
      {showMetricsModal && (
        <MetricsModal onClose={() => setShowMetricsModal(false)} />
      )}

      {/* Retrain Progress Modal */}
      {showRetrainModal && (
        <RetrainModal
          progress={retrainProgress}
          isComplete={retrainComplete}
          trainingCount={trainingData.length}
          onClose={() => setShowRetrainModal(false)}
        />
      )}

      {/* Bulk CSV Upload Modal */}
      {showBulkUpload && (
        <BulkUploadModal
          onClose={() => setShowBulkUpload(false)}
          onImportClaims={handleImportClaims}
        />
      )}
    </div>
  );
}
