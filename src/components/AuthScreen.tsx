import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Building2,
  KeyRound,
  Fingerprint,
  Globe2,
  HelpCircle,
  X,
  ChevronRight,
  Sun,
  Moon,
  Info,
  Check,
  Briefcase,
  Users,
  Search,
  UserPlus
} from 'lucide-react';
import { AuthUser, UserRole, RegisteredUser } from '../types';
import { registerOrUpdateUser, getStoredRegisteredUsers } from '../data/mockUsers';

interface AuthScreenProps {
  onLogin: (user: AuthUser) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, darkMode, setDarkMode }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('Special Investigation Unit (SIU)');
  const [employeeId, setEmployeeId] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [registrySearch, setRegistrySearch] = useState('');

  const [registeredUsersList, setRegisteredUsersList] = useState<RegisteredUser[]>(() => getStoredRegisteredUsers());
  const registeredUsers = registeredUsersList;

  // Quick Demo Autofill Profiles
  const handleFillDemo = (demoType: 'admin' | 'adjuster' | 'manager') => {
    setError(null);
    setSuccessMsg(null);
    if (demoType === 'admin') {
      setName('Vikramaditya Sengupta');
      setEmail('v.sengupta@fraudshield.ai');
      setPassword('Shield#SIU2026');
      setRole('Admin');
      setEmployeeId('SIU-BLR-0891');
    } else if (demoType === 'adjuster') {
      setName('Pooja Nair');
      setEmail('p.nair@claims-assurance.com');
      setPassword('Adjuster#Access2026');
      setRole('Adjuster');
      setEmployeeId('ADJ-KA-4412');
    } else {
      setName('Rajesh Sharma');
      setEmail('r.sharma@general-underwriting.in');
      setPassword('Property#Risk2026');
      setRole('Admin');
      setEmployeeId('MGR-HQ-1002');
    }
  };

  // One-Click Enterprise SSO Simulation
  const handleSSOLogin = (provider: string) => {
    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      const user: AuthUser = {
        name: 'Vikramaditya Sengupta (SSO)',
        email: 'v.sengupta@fraudshield.ai',
        role: 'Admin',
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      registerOrUpdateUser({
        name: user.name,
        email: user.email,
        role: user.role,
        department: 'Special Investigation Unit (SIU)',
        city: 'Bangalore'
      });

      if (rememberMe) {
        localStorage.setItem('fs_auth_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('fs_auth_user', JSON.stringify(user));
      }
      onLogin(user);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const passScore = calculatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please enter your full legal or employee name.');
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please enter a valid corporate email address.');
      return;
    }

    if (authMode === 'register') {
      if (!password || password.length < 4) {
        setError('Please create a secure password with at least 4 characters.');
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        const registered = registerOrUpdateUser({
          name: trimmedName,
          email: trimmedEmail,
          role,
          department,
          employeeId: employeeId.trim() || undefined,
          city,
          phone: phone.trim() || undefined,
          isPendingRequest: false
        });

        // Update local directory state immediately
        const updatedList = getStoredRegisteredUsers();
        setRegisteredUsersList(updatedList);

        setSuccessMsg(`User ${trimmedName} (${trimmedEmail}) successfully registered and connected to the Central Directory!`);

        setTimeout(() => {
          const user: AuthUser = {
            name: trimmedName,
            email: trimmedEmail,
            role,
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          if (rememberMe) {
            localStorage.setItem('fs_auth_user', JSON.stringify(user));
          } else {
            sessionStorage.setItem('fs_auth_user', JSON.stringify(user));
          }

          onLogin(user);
        }, 800);
      }, 500);
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must contain at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const user: AuthUser = {
        name: trimmedName,
        email: trimmedEmail,
        role,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      registerOrUpdateUser({
        name: trimmedName,
        email: trimmedEmail,
        role,
        department: 'Special Investigation Unit (SIU)',
        city
      });
      setRegisteredUsersList(getStoredRegisteredUsers());

      if (rememberMe) {
        localStorage.setItem('fs_auth_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('fs_auth_user', JSON.stringify(user));
      }

      onLogin(user);
    }, 500);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Fraud Shield AI
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/80">
                Enterprise SIU
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              Institutional Fraud Detection & Link Analytics Gateway
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            id="auth-view-registry-btn"
            onClick={() => setShowDirectoryModal(true)}
            className="px-2.5 py-1.5 rounded-lg text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-900 shadow-xs"
            title="Check who has registered in the platform"
          >
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Registered Directory ({registeredUsers.length})</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bangalore SIU Gateway Node #04</span>
          </div>

          <button
            type="button"
            id="auth-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span className="hidden sm:inline text-xs">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* Main Container - Split View on Desktop */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Hero Column: Institutional Trust & Capabilities (Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 pr-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning & Explainable SHAP Decisioning
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Secure portal for insurance fraud intelligence and claim risk analysis.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Real-time syndicate network detection, graph link clustering, and dynamic risk scoring engineered for health, commercial property, and auto underwriters across Indian metro zones.
              </p>
            </div>

            {/* Key Live Operational Statistics */}
            <div className="grid grid-cols-3 gap-3 py-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="text-xl font-bold text-slate-900 dark:text-white">$4.82M</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Syndicate Loss Blocked</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">94.2%</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Model Precision Score</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Bangalore</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Primary Hub Active</div>
              </div>
            </div>

            {/* Institutional Compliance Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Regulatory Standards & Security Framework
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> IRDAI Fraud Monitoring Compliant
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" /> SOC-2 Type II Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Lock className="w-3.5 h-3.5 text-cyan-500" /> End-to-End Field Encryption
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Standardized Enterprise Sign-In Card */}
          <div className="col-span-1 lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              
              {/* Card Header & Tab Switcher */}
              <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {authMode === 'signin' ? 'Sign In to Investigation Portal' : 'Register User to Directory'}
                      {authMode === 'register' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          New User
                        </span>
                      )}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {authMode === 'signin' 
                        ? 'Enter your institutional credentials or single sign-on token.'
                        : 'Register your profile and connect your credentials directly to the Users Directory.'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {authMode === 'signin' ? <Lock className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-1 bg-slate-200/70 dark:bg-slate-800/70 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    id="auth-tab-signin"
                    onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
                    className={`py-2 rounded-lg transition-all text-center ${
                      authMode === 'signin'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    Enterprise Sign In
                  </button>
                  <button
                    type="button"
                    id="auth-tab-register"
                    onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
                    className={`py-2 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                      authMode === 'register'
                        ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register User</span>
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-4">
                
                {/* Single Sign-On (SSO) Fast Action (in signin mode) */}
                {authMode === 'signin' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSSOLogin('Corporate Okta')}
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      <Fingerprint className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Continue with Corporate SSO (Okta / Azure AD)</span>
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or enter work credentials</span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </div>
                )}

                {/* Notifications & Error Alerts */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                      Full Legal / Staff Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Vikramaditya Sengupta"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Corporate Email */}
                  <div className="space-y-1">
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                      Corporate Work Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. v.sengupta@fraudshield.ai"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all text-xs"
                      />
                    </div>
                  </div>

                  {/* Register Mode Specific Fields */}
                  {authMode === 'register' && (
                    <div className="space-y-3 pt-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                            Department
                          </label>
                          <select
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                          >
                            <option>Special Investigation Unit (SIU)</option>
                            <option>Claims Adjudication</option>
                            <option>Property Underwriting</option>
                            <option>Health TPA Compliance</option>
                            <option>Automotive Loss Inspection</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                            Regional Hub City
                          </label>
                          <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                          >
                            <option value="Bangalore">Bangalore (HQ Node)</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi NCR">Delhi NCR</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Pune">Pune</option>
                            <option value="Kolkata">Kolkata</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                            Employee ID <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            placeholder="e.g. SIU-BLR-0891"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                            Contact Phone <span className="text-slate-400 font-normal">(Optional)</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98800 12345"
                            className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Field (Both Sign In and Register Mode) */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                        {authMode === 'signin' ? 'Password / Security Token' : 'Create Account Password'} <span className="text-red-500">*</span>
                      </label>
                      {authMode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => { setShowForgotModal(true); setForgotSubmitted(false); }}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={authMode === 'signin' ? '••••••••••••' : 'Set a secure password (min 4 chars)'}
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-600 transition-all text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Caps Lock Warning */}
                    {capsLockActive && (
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 pt-0.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Caps Lock is ON</span>
                      </div>
                    )}

                    {/* Dynamic Password Strength Visual Indicator */}
                    {password.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex gap-1 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full flex-1 transition-all ${passScore >= 1 ? 'bg-red-500' : 'bg-transparent'}`} />
                          <div className={`h-full flex-1 transition-all ${passScore >= 2 ? 'bg-amber-500' : 'bg-transparent'}`} />
                          <div className={`h-full flex-1 transition-all ${passScore >= 3 ? 'bg-indigo-500' : 'bg-transparent'}`} />
                          <div className={`h-full flex-1 transition-all ${passScore >= 4 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Password Strength:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {passScore <= 1 ? 'Weak' : passScore === 2 ? 'Fair' : passScore === 3 ? 'Strong' : 'Enterprise Grade'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security Role Selector */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                        Role & Clearance Level
                      </label>
                      <span className="text-[10px] text-slate-400">Determines dashboard permissions</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="auth-role-admin"
                        onClick={() => setRole('Admin')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          role === 'Admin'
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">Admin / SIU Lead</span>
                          {role === 'Admin' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-1 leading-snug">
                          Threshold control, feedback loop retraining, rules tuning
                        </span>
                      </button>

                      <button
                        type="button"
                        id="auth-role-adjuster"
                        onClick={() => setRole('Adjuster')}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          role === 'Adjuster'
                            ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-600 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">Claims Adjuster</span>
                          {role === 'Adjuster' && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-1 leading-snug">
                          Claim triage queue, SHAP inspections, fraud confirmation
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 cursor-pointer text-slate-600 dark:text-slate-400">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-indigo-600 accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs">Keep session active on this workstation</span>
                    </label>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> TLS 1.3
                    </span>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    id={authMode === 'register' ? 'auth-register-user-btn' : 'auth-submit-btn'}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all disabled:opacity-75 cursor-pointer mt-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{authMode === 'register' ? 'Registering to Central Directory...' : 'Validating Session & Key...'}</span>
                      </>
                    ) : (
                      <>
                        {authMode === 'register' ? (
                          <>
                            <UserPlus className="w-4 h-4" />
                            <span>Register User & Connect to Directory</span>
                          </>
                        ) : (
                          <>
                            <span>Authenticate & Enter Console</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {/* Mode Switching Helper */}
                  <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                    {authMode === 'signin' ? (
                      <div>
                        Need to register a new investigator or team member?{' '}
                        <button
                          type="button"
                          id="switch-to-register-btn"
                          onClick={() => { setAuthMode('register'); setError(null); setSuccessMsg(null); }}
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Register User</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        Already registered in the directory?{' '}
                        <button
                          type="button"
                          id="switch-to-signin-btn"
                          onClick={() => { setAuthMode('signin'); setError(null); setSuccessMsg(null); }}
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Sign In to Console</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </form>

                {/* Quick Demo Pre-fill Toolbar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  {/* Directory Callout */}
                  <div className="p-2.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {registeredUsers.length} Staff Members Registered
                        </div>
                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                          Check everyone provisioned in the directory
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="view-who-registered-callout-btn"
                      onClick={() => setShowDirectoryModal(true)}
                      className="px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 rounded-lg transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-800 shadow-xs flex items-center gap-1"
                    >
                      <span>Check Directory</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" /> One-Click Test Accounts
                    </span>
                    <span className="text-[10px] text-slate-400">Auto-populates fields</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('admin')}
                      className="py-2 px-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">V. Sengupta (Admin)</div>
                      <div className="text-[10px] text-slate-400">SIU Lead &bull; Bangalore Hub</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFillDemo('adjuster')}
                      className="py-2 px-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-left transition-colors cursor-pointer"
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">Pooja Nair (Adjuster)</div>
                      <div className="text-[10px] text-slate-400">Senior Field Adjuster</div>
                    </button>
                  </div>
                </div>

              </div>

              {/* Card Footer Security Notice */}
              <div className="bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 px-6 py-3 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Institutional Gateway &bull; v2.4.0
                </span>
                <button
                  type="button"
                  onClick={() => alert("Fraud Shield AI Enterprise System:\nAll login attempts, claim adjudications, and status updates are cryptographically hashed in the immutable SIU audit log according to ISO 27001 guidelines.")}
                  className="hover:underline text-slate-500 dark:text-slate-400 cursor-pointer"
                >
                  Security Policy
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reset Enterprise Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-3 py-2 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">Reset Instructions Sent</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-200">{forgotEmail}</span>, a secure one-time verification token has been dispatched via your organization's identity manager.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) {
                    setForgotSubmitted(true);
                  }
                }}
                className="space-y-3 text-xs"
              >
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your registered institutional email. A password recovery link will be sent directly through your insurer's SIU directory.
                </p>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. name@fraudshield.ai"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Registered Users Directory Preview Modal */}
      {showDirectoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    Registered Users Directory
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {registeredUsers.length} Users
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Personnel and credentials currently registered in the Fraud Shield platform
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="modal-register-new-user-btn"
                  onClick={() => {
                    setShowDirectoryModal(false);
                    setAuthMode('register');
                    setError(null);
                    setSuccessMsg(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register User</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowDirectoryModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Close directory"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={registrySearch}
                onChange={(e) => setRegistrySearch(e.target.value)}
                placeholder="Search registered staff by name, email, employee ID, role, or city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[250px]">
              {registeredUsers
                .filter(u => {
                  const q = registrySearch.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.role.toLowerCase().includes(q) ||
                    (u.employeeId && u.employeeId.toLowerCase().includes(q)) ||
                    (u.department && u.department.toLowerCase().includes(q)) ||
                    (u.city && u.city.toLowerCase().includes(q))
                  );
                })
                .map(u => (
                  <div
                    key={u.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${u.avatarColor || 'bg-indigo-600'} text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0`}>
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{u.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            u.role === 'Admin'
                              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                              : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          }`}>
                            {u.role}
                          </span>
                          <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-medium ${
                            u.status === 'Active'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          }`}>
                            {u.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>{u.email}</span>
                          {u.employeeId && <span>&bull; {u.employeeId}</span>}
                          {u.city && <span>&bull; {u.city} Hub</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setName(u.name);
                          setEmail(u.email);
                          setRole(u.role);
                          setPassword('Shield#SIU2026');
                          setShowDirectoryModal(false);
                          setAuthMode('signin');
                          // Direct login
                          const authUser: AuthUser = {
                            name: u.name,
                            email: u.email,
                            role: u.role,
                            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          onLogin(authUser);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>Sign In as this User</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>All registered users are persisted in the central registry.</span>
              <button
                type="button"
                onClick={() => setShowDirectoryModal(false)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Standardized Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs py-3 px-6 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <span>&copy; 2026 Fraud Shield Technologies Inc.</span>
          <span className="hidden md:inline">&bull;</span>
          <span className="hidden md:inline">Insurance Regulatory & Claims Intelligence</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Systems Operational
          </span>
          <span>&bull;</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200">ISO 27001 Certified</span>
          <span>&bull;</span>
          <span className="hover:text-slate-700 dark:hover:text-slate-200">Support SIU Hotline</span>
        </div>
      </footer>

    </div>
  );
};
