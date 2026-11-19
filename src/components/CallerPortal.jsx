import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  User, 
  MapPin, 
  Building2, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  Filter, 
  Search, 
  Flame, 
  ThumbsUp, 
  ThumbsDown, 
  Ban, 
  Sparkles,
  LogOut,
  RefreshCw,
  ArrowRight,
  Home,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Check,
  Copy,
  Radio,
  Zap,
  TrendingUp,
  RotateCcw,
  Users,
  X,
  Phone
} from 'lucide-react';
import { dbStore, STATUS_CODES, CALL_STATUS_CODES, LOCATION_CODES, verifyPassword } from '../data/dbStore';

export function CallerPortal({ currentUser, onLogin, onLogout, onNavigateHome }) {
  const [callers, setCallers] = useState([]);
  const [loginMethod, setLoginMethod] = useState('credentials'); // 'credentials' or 'otp'
  
  // Credentials login state
  const [callerCode, setCallerCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP login state
  const [otpMobile, setOtpMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Self-Service Password Reset via Registered Email OTP
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter ID, 2: Enter OTP, 3: Set Password
  const [forgotCallerCode, setForgotCallerCode] = useState('');
  const [forgotCallerEmail, setForgotCallerEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotToken, setForgotToken] = useState('');
  const [newCallerPassword, setNewCallerPassword] = useState('');
  const [confirmCallerPassword, setConfirmCallerPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Portal view state
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'retries', 'hot', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLeadId, setCopiedLeadId] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  // Direct Call Dialer Modal State
  const [callingLead, setCallingLead] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState(1);
  const [callerRemark, setCallerRemark] = useState('');

  // Real-time clock for executive console feel
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyPhone = (leadId, phone) => {
    if (!phone) return;
    try {
      navigator.clipboard.writeText(phone.replace(/\s+/g, ''));
      setCopiedLeadId(leadId);
      setTimeout(() => setCopiedLeadId(null), 2000);
    } catch {
      // fallback
    }
  };

  const refreshData = () => {
    try {
      const allCallers = dbStore.getCallers();
      setCallers(allCallers);

      if (currentUser && currentUser.id) {
        const callerLeads = dbStore.getLeadsForCaller(currentUser.id);
        setLeads(callerLeads);
      }
    } catch (err) {
      console.error("Error refreshing caller data:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Call timer simulation
  useEffect(() => {
    let interval = null;
    if (callActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  // Login Handlers
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!callerCode.trim() || !password) {
      setLoginError("Please enter both Caller ID and password.");
      return;
    }

    let found = null;
    for (const c of callers) {
      if (c.callerCode.toUpperCase() === callerCode.trim().toUpperCase()) {
        const isMatch = await verifyPassword(password, c.password);
        if (isMatch) {
          found = c;
          break;
        }
      }
    }

    if (found) {
      onLogin({ ...found, role: 'caller' });
    } else {
      setLoginError("Invalid Caller ID or Password. Please contact administration.");
    }
  };

  const handleSendOtp = async () => {
    setLoginError('');
    const cleanMobile = otpMobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setLoginError("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    const found = callers.find(c => c.phone.replace(/\D/g, '') === cleanMobile);
    if (!found) {
      setLoginError("Mobile number is not registered for any active caller account.");
      return;
    }

    setOtpLoading(true);
    try {
      // Dispatch real email OTP to the registered advisor email
      const targetEmail = found.email || 'concaverealtyindia@gmail.com';
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, name: found.name, digits: 6, purpose: 'caller_auth' })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
      } else {
        setLoginError(data.message || "Failed to dispatch verification code.");
      }
    } catch {
      setLoginError("Authentication server unreachable. Please use ID & Password.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError('');

    const cleanMobile = otpMobile.replace(/\D/g, '');
    const found = callers.find(c => c.phone.replace(/\D/g, '') === cleanMobile);
    if (!found) {
      setLoginError("Caller account not found.");
      return;
    }

    const targetEmail = found.email || 'concaverealtyindia@gmail.com';
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, otp: enteredOtp.trim() })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        onLogin({ ...found, role: 'caller' });
      } else {
        setLoginError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch {
      setLoginError("Verification service temporarily unavailable.");
    }
  };

  // Caller Forgot Password Handlers
  const handleStartForgot = async (e) => {
    e.preventDefault();
    setForgotError('');
    const code = forgotCallerCode.trim().toUpperCase();
    if (!code) {
      setForgotError('Please enter your Caller ID (e.g. CALLER-101).');
      return;
    }
    const found = callers.find(c => c.callerCode.toUpperCase() === code);
    if (!found) {
      setForgotError('Caller ID not found in system.');
      return;
    }
    const email = found.email || 'concaverealtyindia@gmail.com';
    setForgotCallerEmail(email);
    setForgotLoading(true);

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: found.name, digits: 6, purpose: 'caller_reset' })
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep(2);
      } else {
        setForgotError(data.message || 'Failed to dispatch verification code.');
      }
    } catch {
      setForgotError('Security server unreachable. Please try again.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit code received in your email.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotCallerEmail, otp: forgotOtp.trim() })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setForgotToken(data.token || 'verified');
        setForgotStep(3);
      } else {
        setForgotError(data.message || 'Invalid or expired verification code.');
      }
    } catch {
      setForgotError('Verification service temporarily unavailable.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetCallerPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (newCallerPassword !== confirmCallerPassword) {
      setForgotError('Passwords do not match. Please verify.');
      return;
    }
    if (newCallerPassword.length < 8) {
      setForgotError('Password must be at least 8 characters long.');
      return;
    }

    setForgotLoading(true);
    try {
      // 1. Update on server MySQL / persistent store
      await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotCallerEmail,
          verificationToken: forgotToken,
          newPassword: newCallerPassword,
          role: 'caller',
          callerCode: forgotCallerCode.trim().toUpperCase()
        })
      });

      // 2. Update local state store
      await dbStore.updateCallerPassword(forgotCallerCode.trim().toUpperCase(), newCallerPassword);
      setForgotSuccess('Password updated successfully in database! You may now sign in.');
      setTimeout(() => {
        setForgotPasswordMode(false);
        setForgotStep(1);
        setForgotSuccess('');
        setPassword(newCallerPassword);
        setCallerCode(forgotCallerCode.trim().toUpperCase());
      }, 1500);
    } catch {
      setForgotError('Failed to update password. Please contact administrator.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleStartCall = (lead) => {
    if (lead?.mobile) {
      window.location.href = `tel:${lead.mobile.replace(/\s+/g, '')}`;
    }
    setCallingLead(lead);
    setCallActive(true);
    setSelectedDisposition(lead.statusCode || 1);
    setCallerRemark('');
  };

  const handleFinishCall = () => {
    if (!callingLead) return;

    dbStore.updateLeadDisposition(callingLead.id, {
      statusCode: selectedDisposition,
      noteText: callerRemark,
      callerName: currentUser.name
    });

    setCallActive(false);
    setCallingLead(null);
    setCallerRemark('');
    refreshData();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayedLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.mobile.includes(searchQuery) ||
      l.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'retries') return l.statusCode === 4 && l.callStatusCode !== 5;
    if (activeTab === 'hot') return l.statusCode === 1;
    if (activeTab === 'active') return l.statusCode !== 6 && l.callStatusCode !== 5;
    return true;
  });

  // =========================================================================
  // VIEW 1: LOGIN SCREEN (Standalone Executive Portal View - Matched with Admin)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        {/* Standalone Header */}
        <header className="px-6 py-4 border-b border-[#14221F]/15 bg-[#14221F] text-white flex items-center justify-between shadow-subtle shrink-0">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C59B4E]" />
            <span className="font-serif text-lg font-bold tracking-wider">CONCAVE REALTY • CALLER PANEL</span>
          </div>
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="px-3 py-1.5 rounded-lg border border-[#C59B4E]/40 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to Website</span>
            </button>
          )}
        </header>

        <div className="flex-1 py-12 px-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-luxury border border-[#EAE6DF] p-8 sm:p-9 space-y-6 anim-fade-up">
            
            {/* Company Logo & Header */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#C59B4E] p-0.5 bg-[#1D3530] shadow-md">
                <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#245348] font-bold block">
                  CALLER PANEL
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Caller Panel
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Concave Realty • Sales & Territory Outreach Console
                </p>
              </div>
            </div>

            {/* NORMAL LOGIN FORM */}
            {!forgotPasswordMode && (
              <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Caller ID */}
                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold block text-xs">Caller ID *</label>
                  <input
                    type="text"
                    required
                    value={callerCode}
                    onChange={(e) => setCallerCode(e.target.value)}
                    placeholder="Enter Caller ID (e.g. CALLER-101)"
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none transition-all"
                  />
                </div>

                {/* Password with View Toggle */}
                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold block text-xs">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 pr-10 text-[#14221F] font-mono text-xs focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Forgot Password Link Under Password Field */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setForgotStep(1);
                        setForgotCallerCode(callerCode || '');
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-[11px] text-[#245348] hover:text-[#C59B4E] font-medium transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-[#DFBE79]" />
                  <span>Sign In to Caller Panel</span>
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {forgotPasswordMode && (
              <div className="space-y-4 text-xs">
                {/* Step 1: Enter Caller ID */}
                {forgotStep === 1 && (
                  <form onSubmit={handleStartForgot} className="space-y-4">
                    <div className="space-y-1 text-center pb-1">
                      <h3 className="font-serif text-lg font-bold text-[#14221F]">
                        Reset Caller Password
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Enter your Caller ID to receive a secure 6-digit verification code.
                      </p>
                    </div>

                    {forgotError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block text-xs">Caller ID *</label>
                      <input
                        type="text"
                        required
                        value={forgotCallerCode}
                        onChange={(e) => setForgotCallerCode(e.target.value)}
                        placeholder="e.g. CALLER-101"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {forgotLoading ? 'Sending Verification Code...' : 'Send Verification Code'}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordMode(false);
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        className="text-[11px] text-gray-500 hover:text-black font-medium cursor-pointer"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Verify OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                    <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
                      <span className="font-bold flex items-center gap-1.5 text-amber-900">
                        <Mail className="w-4 h-4 text-amber-700" />
                        <span>Verification Code Dispatched</span>
                      </span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        A 6-digit verification code has been dispatched to your registered email:
                        <strong className="block font-mono text-amber-950 mt-1">{forgotCallerEmail}</strong>
                      </p>
                    </div>

                    {forgotError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block text-xs">Enter 6-Digit OTP *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        autoFocus
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 123456"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-center font-bold tracking-widest text-lg focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {forgotLoading ? 'Verifying...' : 'Verify OTP Code'}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordMode(false);
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        className="text-[11px] text-gray-500 hover:text-black font-medium cursor-pointer"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Create New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetCallerPassword} className="space-y-4">
                    <div className="space-y-1 text-center pb-1">
                      <h3 className="font-serif text-lg font-bold text-[#14221F]">
                        Create New Password
                      </h3>
                      <p className="text-[11px] text-gray-500">
                        Code verified! Enter your new password below.
                      </p>
                    </div>

                    {forgotError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    {forgotSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <span>{forgotSuccess}</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block text-xs">New Password *</label>
                      <input
                        type="password"
                        required
                        value={newCallerPassword}
                        onChange={(e) => setNewCallerPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-700 font-semibold block text-xs">Confirm New Password *</label>
                      <input
                        type="password"
                        required
                        value={confirmCallerPassword}
                        onChange={(e) => setConfirmCallerPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none"
                      />
                    </div>

                    {/* Password Policy Checklist */}
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[11px]">
                      <div className={`flex items-center gap-1.5 ${newCallerPassword.length >= 8 ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3 h-3" />
                        <span>Minimum 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${newCallerPassword && newCallerPassword === confirmCallerPassword ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                        <Check className="w-3 h-3" />
                        <span>Passwords match</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {forgotLoading ? 'Updating Database...' : 'Confirm & Update Password'}
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordMode(false);
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        className="text-[11px] text-gray-500 hover:text-black font-medium cursor-pointer"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED CALLER WORKSPACE (Standalone Clean Environment)
  // =========================================================================
  const pendingRetriesCount = leads.filter(l => l.statusCode === 4 && l.callStatusCode !== 5).length;
  const hotLeadsCount = leads.filter(l => l.statusCode === 1).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white pb-16">

      {/* Standalone Executive Caller Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14221F] text-white border-b border-[#245348] shadow-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C59B4E] bg-[#245348] p-0.5 shrink-0 shadow-md">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-bold text-white tracking-widest block leading-none">
                CONCAVE REALTY
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#DFBE79] font-bold">
                Caller Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Telephony & Clock Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-semibold text-[11px]">TELEPHONY ACTIVE</span>
              {currentTime && (
                <span className="text-[#DFBE79] border-l border-white/10 pl-2 text-[11px] font-bold">
                  {currentTime}
                </span>
              )}
            </div>

            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-3 py-1.5 rounded-lg border border-[#C59B4E]/50 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Website</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Upper Agent Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14221F] via-[#1D3530] to-[#0E1A17] text-white rounded-2xl p-6 sm:p-7 shadow-luxury-lg border border-[#245348] flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle Luxury Ambient Glows */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#C59B4E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-72 h-72 bg-[#245348]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4 sm:gap-5">
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[#284F45] to-[#14221F] border-2 border-[#C59B4E] flex items-center justify-center text-[#DFBE79] flex-shrink-0 shadow-lg">
            <Headphones className="w-7 h-7 sm:w-8 sm:h-8" />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#14221F] rounded-full animate-pulse shadow-md" title="Agent Online" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">{currentUser.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE & DIALING
              </span>
            </div>
            <p className="text-xs text-[#DFBE79] font-medium tracking-wide">
              {currentUser.callerCode} • {currentUser.role}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-gray-300 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C59B4E]" /> Assigned Territories:
              </span>
              {currentUser.assignedLocations && currentUser.assignedLocations.map(lid => (
                <span key={lid} className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#284F45] text-white border border-[#C59B4E]/40 shadow-xs">
                  {LOCATION_CODES[lid]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Right: System Heartbeat & Quick Actions */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-gray-300 uppercase tracking-wider">Web Dialer Engine</div>
              <div className="text-xs font-bold text-[#DFBE79] flex items-center gap-1">
                ● Telephony Connected
              </div>
            </div>
          </div>

          <button
            onClick={refreshData}
            className="p-3 rounded-xl bg-[#284F45] hover:bg-[#245348] text-white border border-[#C59B4E]/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
            title="Refresh Leads Queue"
          >
            <RefreshCw className="w-4 h-4 text-[#DFBE79] group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10 shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* High-Impact Attention-Grabbing KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Territory Leads */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#EAE6DF] border-t-4 border-t-[#245348] shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-black font-bold tracking-wide block">Territory Leads</span>
            <div className="w-8 h-8 rounded-full bg-[#1D3530]/10 text-[#245348] flex items-center justify-center group-hover:bg-[#245348] group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-bold font-serif text-[#14221F] mt-2 block">{leads.length}</span>
          <p className="text-[11px] text-gray-500 mt-1 font-medium">Assigned in your territory queue</p>
        </div>

        {/* Card 2: Pending Retries (4h / 10d) */}
        <div className="bg-gradient-to-b from-amber-50/40 to-white p-5 rounded-2xl border-2 border-amber-200 border-t-4 border-t-amber-500 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-black font-bold tracking-wide block">Pending Retries (4h / 10d)</span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-amber-600 block">{pendingRetriesCount}</span>
            {pendingRetriesCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse border border-amber-300">
                ⚡ Action Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-amber-800/80 mt-1 font-medium">Auto-cadence 4h timer & 10d log</p>
        </div>

        {/* Card 3: Hot Leads Identified */}
        <div className="bg-gradient-to-b from-emerald-50/40 to-white p-5 rounded-2xl border-2 border-emerald-200 border-t-4 border-t-emerald-600 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-black font-bold tracking-wide block">Hot Leads Identified</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Flame className="w-4 h-4 text-emerald-600 group-hover:text-white" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-bold font-serif text-emerald-700 block">{hotLeadsCount}</span>
            {hotLeadsCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                🔥 High Priority
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-800/80 mt-1 font-medium">High conversion & booking ready</p>
        </div>

        {/* Card 4: Web Calling System */}
        <div className="bg-white p-5 rounded-2xl border-2 border-[#EAE6DF] border-t-4 border-t-[#C59B4E] shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-black font-bold tracking-wide block">Web Calling System</span>
            <div className="w-8 h-8 rounded-full bg-[#C59B4E]/15 text-[#C59B4E] flex items-center justify-center group-hover:bg-[#C59B4E] group-hover:text-[#14221F] transition-colors">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#245348] mt-3 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            ● Direct Web Dialer Ready
          </span>
          <p className="text-[11px] text-gray-500 mt-2 font-medium">1-Click web dialer & disposition log</p>
        </div>
      </div>

      {/* Filter Tabs & Real-Time Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE6DF] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'active' 
                ? 'bg-[#245348] text-white shadow-md' 
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100 border border-[#EAE6DF]'
            }`}
          >
            <span>Active Queue</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'active' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'bg-gray-200 text-gray-700'}`}>
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('retries')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'retries' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'bg-amber-50/80 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retries Due (4h / 10d)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'retries' ? 'bg-white text-amber-900 font-bold' : 'bg-amber-200 text-amber-900 font-bold'}`}>
              {pendingRetriesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hot')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'hot' 
                ? 'bg-emerald-700 text-white shadow-md' 
                : 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hot Leads</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'hot' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'bg-emerald-200 text-emerald-900 font-bold'}`}>
              {hotLeadsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-[#14221F] text-white shadow-md' 
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100 border border-[#EAE6DF]'
            }`}
          >
            All History
          </button>
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client, phone, project or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF9F6] border-2 border-[#EAE6DF] focus:border-[#245348] focus:bg-white rounded-xl pl-10 pr-9 py-2 text-xs text-[#14221F] font-medium focus:outline-none transition-all placeholder:text-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Attention-Grabbing Leads List */}
      <div className="space-y-4">
        {displayedLeads.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-[#EAE6DF] text-gray-400 space-y-3 shadow-subtle">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-gray-600">No leads matching current filters or search query.</p>
            <p className="text-xs text-gray-400">Try adjusting your filters or clearing the search query.</p>
          </div>
        ) : (
          displayedLeads.map((lead) => {
            const isNotPicking = lead.statusCode === 4;
            const isHot = lead.statusCode === 1;

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border-2 transition-all duration-300 shadow-luxury hover:shadow-luxury-lg hover:-translate-y-0.5 relative overflow-hidden ${
                  isHot 
                    ? 'border-l-[6px] border-l-emerald-500 border-emerald-200 bg-gradient-to-r from-emerald-50/20 via-white to-white' 
                    : isNotPicking 
                    ? 'border-l-[6px] border-l-amber-500 border-amber-200 bg-gradient-to-r from-amber-50/20 via-white to-white' 
                    : 'border-l-[6px] border-l-[#C59B4E] border-[#EAE6DF]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="space-y-3 flex-1">
                    {/* Header Row: Initials Avatar + Name + Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#14221F] text-[#DFBE79] border-2 border-[#C59B4E] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
                        {lead.name ? lead.name.split(' ').map(n=>n[0]).join('').slice(0, 2).toUpperCase() : 'LE'}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#14221F] bg-[#FAF9F6] px-2.5 py-0.5 rounded-md border border-[#EAE6DF]">
                            CON-{lead.id}
                          </span>
                          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#14221F] tracking-wide">
                            {lead.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#284F45] text-white flex items-center gap-1 shadow-xs">
                            <MapPin className="w-3 h-3 text-[#DFBE79]" />
                            {lead.locationName}
                          </span>
                          {isHot && (
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                              <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                              HOT LEAD • HIGH CONVERSION
                            </span>
                          )}
                          {isNotPicking && (
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs animate-pulse">
                              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                              NOT PICKING UP • RETRY DUE
                            </span>
                          )}
                          {!isHot && !isNotPicking && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200 uppercase tracking-wider">
                              {lead.statusName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Strip: Phone + Copy + Project + Timestamp */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-600 pt-1">
                      {/* Phone Number with Click-to-Copy */}
                      <button
                        onClick={() => handleCopyPhone(lead.id, lead.mobile)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F6] hover:bg-emerald-50 border border-[#EAE6DF] hover:border-emerald-300 text-[#14221F] font-mono font-bold text-xs transition-all cursor-pointer shadow-xs group"
                        title="Click to copy phone number"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#245348] group-hover:text-emerald-700" />
                        <span>{lead.mobile}</span>
                        {copiedLeadId === lead.id ? (
                          <span className="text-emerald-700 font-sans font-bold flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copied!
                          </span>
                        ) : (
                          <Copy className="w-3 h-3 text-gray-400 group-hover:text-emerald-600" />
                        )}
                      </button>

                      {lead.email && (
                        <span className="font-mono text-gray-600 flex items-center gap-1 bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-[#EAE6DF]">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {lead.email}
                        </span>
                      )}

                      <span className="font-semibold text-[#14221F] flex items-center gap-1 bg-[#FAF9F6] px-2.5 py-1 rounded-lg border border-[#EAE6DF]">
                        <Building2 className="w-3 h-3 text-[#C59B4E]" />
                        {lead.projectName}
                      </span>

                      <span className="text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {new Date(lead.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Highlighted Requirement Box (Attention-Grabbing) */}
                    {lead.description && (
                      <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl p-3.5 space-y-1 shadow-xs">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#245348] uppercase tracking-wider font-mono">
                          <Sparkles className="w-3.5 h-3.5 text-[#C59B4E]" /> Client Requirement & Criteria:
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed pl-3 border-l-2 border-[#C59B4E]">
                          {lead.description}
                        </p>
                      </div>
                    )}

                    {/* Automated 4h / 10d Retry Cadence Highlight */}
                    {isNotPicking && (
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/60 border border-amber-300 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse shadow-xs">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <strong className="font-bold text-amber-950">Retry Cadence: Attempt {lead.retryCount} of 10</strong>
                            <p className="text-[11px] text-amber-800 font-medium">
                              {lead.retryCount === 1 ? "4-Hour Fast Re-dial (First follow-up cadence)" : "24-Hour Daily Recurring Cadence"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs bg-white/90 px-3 py-1.5 rounded-lg border border-amber-300 font-bold text-amber-900 self-start sm:self-auto shadow-xs">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Next Due: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleString() : 'Scheduled Today'}</span>
                        </div>
                      </div>
                    )}

                    {/* Caller Notes History */}
                    {lead.notes && lead.notes.length > 0 && (
                      <div className="text-xs text-gray-600 flex items-start gap-2 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EAE6DF]">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C59B4E] mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-[#245348]">{lead.notes[0].by}:</strong>{" "}
                          <span>{lead.notes[0].txt}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* HERO DIRECT CALL BUTTON (Attention-Grabbing One-Click Dial) */}
                  <div className="flex lg:flex-col items-center justify-end shrink-0 gap-2">
                    <button
                      onClick={() => handleStartCall(lead)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#245348] via-[#1D3530] to-[#14221F] hover:from-[#1D3530] hover:to-[#0A1412] active:scale-95 text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2.5 shadow-[0_6px_20px_rgba(36,83,72,0.35)] hover:shadow-[0_8px_25px_rgba(197,155,78,0.5)] border border-[#C59B4E]/60 cursor-pointer group"
                      title="Direct Call & Log Disposition"
                    >
                      <div className="w-7 h-7 rounded-full bg-[#C59B4E]/25 border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] group-hover:bg-[#C59B4E] group-hover:text-[#14221F] transition-colors shadow-xs">
                        <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                      <span className="font-serif tracking-widest text-sm">DIRECT CALL</span>
                      <ArrowRight className="w-4 h-4 text-[#DFBE79] group-hover:translate-x-1 transition-transform" />
                    </button>
                    <span className="hidden lg:block text-[10px] font-mono text-gray-400 text-center">
                      1-Click Web Dialer
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modern Luxury In-Call & Disposition Modal */}
      {callingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md anim-fade-up">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 border-2 border-[#C59B4E]/40 relative overflow-hidden">
            {/* Top Dialing Visualizer */}
            <div className="text-center space-y-2 pb-4 border-b border-[#EAE6DF] relative">
              <div className="relative w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#245348] to-[#14221F] text-[#DFBE79] border-2 border-[#C59B4E] flex items-center justify-center mb-1 shadow-lg">
                <PhoneCall className="w-7 h-7 animate-bounce" />
                <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#245348] font-bold block">
                  ACTIVE WEB CALL
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#14221F]">
                  Calling {callingLead.name}
                </h3>
              </div>
              <p className="font-mono text-xs font-semibold text-gray-600 flex items-center justify-center gap-2">
                <span>{callingLead.mobile}</span>
                <span>•</span>
                <span>{callingLead.locationName}</span>
                <span>•</span>
                <span className="text-[#C59B4E]">{callingLead.projectName}</span>
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-mono font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                CALL DURATION: {formatTime(callDuration)}
              </div>
            </div>

            {/* Rate Disposition / Call Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#14221F] uppercase font-mono tracking-wider block">
                Select Call Disposition / Rating:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  { code: 1, label: "🔥 Hot Lead (1)", desc: "Ready to book / token", color: "hover:border-emerald-500" },
                  { code: 2, label: "🌟 Interested (2)", desc: "VIP site visit schedule", color: "hover:border-blue-500" },
                  { code: 4, label: "⏳ Not Picking (4)", desc: "Auto 4h/10d retry engine", color: "hover:border-amber-500" },
                  { code: 3, label: "📞 Call Back (3)", desc: "Requested later talk", color: "hover:border-purple-500" },
                  { code: 5, label: "✕ Not Interested (5)", desc: "No current intent", color: "hover:border-gray-500" },
                  { code: 6, label: "🚫 Fake / Spam (6)", desc: "Invalid enquiry", color: "hover:border-red-500" },
                ].map(disp => (
                  <button
                    key={disp.code}
                    type="button"
                    onClick={() => setSelectedDisposition(disp.code)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedDisposition === disp.code
                        ? 'bg-[#245348] text-white border-[#245348] shadow-md scale-[1.02]'
                        : `bg-[#FAF9F6] border-[#EAE6DF] text-gray-700 ${disp.color}`
                    }`}
                  >
                    <div className="font-bold text-xs">{disp.label}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedDisposition === disp.code ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {disp.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Clickable Remark Chips */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">
                Quick Discussion Remarks (Click to add):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Site visit scheduled for weekend",
                  "Sent brochure & floor plans on WhatsApp",
                  "Rung 4 times, no answer. Scheduled 4h retry",
                  "Looking for 3 BHK high floor unit",
                  "Callback requested tomorrow afternoon"
                ].map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCallerRemark(prev => prev ? `${prev}. ${tag}` : tag)}
                    className="text-[10px] font-medium bg-[#FAF9F6] hover:bg-[#245348] hover:text-white text-gray-700 border border-[#EAE6DF] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Caller Remarks Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                Caller Discussion Notes:
              </label>
              <textarea
                rows={2}
                value={callerRemark}
                onChange={(e) => setCallerRemark(e.target.value)}
                placeholder="e.g., Spoke with client. Looking for deck unit with sea view, token ready next week."
                className="w-full bg-[#FAF9F6] border-2 border-[#EAE6DF] focus:border-[#245348] focus:bg-white rounded-xl p-2.5 text-xs text-[#14221F] focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCallingLead(null)}
                className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel Call
              </button>
              <button
                type="button"
                onClick={handleFinishCall}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#245348] to-[#14221F] hover:from-[#1D3530] hover:to-[#0B1513] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer border border-[#C59B4E]/40"
              >
                Save Disposition
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
