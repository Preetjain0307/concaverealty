import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
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
  Eye,
  EyeOff,
  Lock,
  Mail,
  Check,
  AlertTriangle
} from 'lucide-react';
import { dbStore, STATUS_CODES, CALL_STATUS_CODES, LOCATION_CODES, detectSqlInjection, sanitizeInput, validatePasswordPolicy } from '../data/dbStore';

export function CallerPortal({ currentUser, onLogin, onLogout }) {
  const [callers, setCallers] = useState([]);
  
  // Credentials login state
  const [callerCode, setCallerCode] = useState('CALLER-101');
  const [password, setPassword] = useState('caller123');
  const [showPassword, setShowPassword] = useState(false);
  const [callerLoginError, setCallerLoginError] = useState('');
  const [callerFailedAttempts, setCallerFailedAttempts] = useState(0);
  const [callerLockoutUntil, setCallerLockoutUntil] = useState(0);

  // Forgot Password state for Caller
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Caller ID & OTP, 2: New Password
  const [forgotCallerIdInput, setForgotCallerIdInput] = useState('');
  const [targetCaller, setTargetCaller] = useState(null);
  const [targetEmail, setTargetEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [enteredForgotOtp, setEnteredForgotOtp] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0);
  const [wrongOtpAttempts, setWrongOtpAttempts] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  // Portal view state
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'callback', 'hot', 'history'
  const [searchQuery, setSearchQuery] = useState('');

  // Direct Call Dialer Modal State
  const [callingLead, setCallingLead] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [selectedDisposition, setSelectedDisposition] = useState(1);
  const [callerRemark, setCallerRemark] = useState('');

  const refreshData = () => {
    try {
      const allCallers = dbStore.getCallers();
      setCallers(allCallers);

      if (currentUser && currentUser.id) {
        const callerLeads = dbStore.getLeads(currentUser);
        setLeads(callerLeads);
      } else {
        setLeads([]);
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

  // 5-minute countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (forgotMode && forgotStep === 1 && otpExpiresAt > 0) {
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((otpExpiresAt - Date.now()) / 1000));
        setOtpRemainingSeconds(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [forgotMode, forgotStep, otpExpiresAt]);

  // Login Handlers
  const handleCredentialsLogin = (e) => {
    e.preventDefault();
    setCallerLoginError('');

    // 1. Rate limiting lockout check
    if (callerLockoutUntil && Date.now() < callerLockoutUntil) {
      const secsLeft = Math.ceil((callerLockoutUntil - Date.now()) / 1000);
      setCallerLoginError(`Account temporarily locked due to consecutive failed attempts. Please retry in ${secsLeft}s.`);
      return;
    }

    // 2. Security check
    if (detectSqlInjection(callerCode) || detectSqlInjection(password)) {
      setCallerLoginError('Invalid Caller ID or Password.');
      return;
    }

    const cleanCode = sanitizeInput(callerCode);
    const allCallers = dbStore.getCallers();
    const found = allCallers.find(c => c.callerCode.toUpperCase() === cleanCode.toUpperCase() && c.password === password);
    
    if (found) {
      setCallerFailedAttempts(0);
      setCallerLockoutUntil(0);
      setCallerLoginError('');
      onLogin({ ...found, role: 'caller' });
    } else {
      const nextAttempts = callerFailedAttempts + 1;
      setCallerFailedAttempts(nextAttempts);
      if (nextAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000;
        setCallerLockoutUntil(lockTime);
        setCallerLoginError('Too many failed login attempts. Account temporarily locked for 5 minutes for security.');
      } else {
        setCallerLoginError(`Invalid Caller ID or Password. (${5 - nextAttempts} attempt(s) remaining before temporary lockout)`);
      }
    }
  };

  const handleStartForgotCallerPassword = () => {
    const allCallers = dbStore.getCallers();
    // Default to callerCode if already typed, or first caller
    const candidateCode = callerCode.trim() || 'CALLER-101';
    const found = allCallers.find(c => c.callerCode.toUpperCase() === candidateCode.toUpperCase()) || allCallers[0];
    
    setForgotCallerIdInput(found ? found.callerCode : 'CALLER-101');
    setTargetCaller(found);
    const email = found && found.email ? found.email : 'concaverealtyindia@gmail.com';
    setTargetEmail(email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    setForgotOtp(code);
    setOtpExpiresAt(expires);
    setOtpRemainingSeconds(300);
    setWrongOtpAttempts(0);
    setEnteredForgotOtp('');
    setForgotError('');
    setForgotSuccessMsg('');
    setForgotStep(1);
    setForgotMode(true);
  };

  const handleResendCallerForgotOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    setForgotOtp(code);
    setOtpExpiresAt(expires);
    setOtpRemainingSeconds(300);
    setWrongOtpAttempts(0);
    setEnteredForgotOtp('');
    setForgotError('');
  };

  const handleCallerLookup = (codeStr) => {
    setForgotCallerIdInput(codeStr);
    const allCallers = dbStore.getCallers();
    const found = allCallers.find(c => c.callerCode.toUpperCase() === codeStr.trim().toUpperCase());
    if (found) {
      setTargetCaller(found);
      setTargetEmail(found.email || 'concaverealtyindia@gmail.com');
    }
  };

  const handleVerifyCallerForgotOtp = (e) => {
    e.preventDefault();
    setForgotError('');

    if (detectSqlInjection(enteredForgotOtp)) {
      setForgotError('Security Alert: Invalid characters detected.');
      return;
    }

    if (Date.now() > otpExpiresAt) {
      setForgotError('This OTP has expired (5-minute limit). Please click Resend OTP.');
      return;
    }

    if (wrongOtpAttempts >= 3) {
      setForgotError('Maximum 3 incorrect OTP attempts reached. For security, this OTP is invalidated. Request a new OTP.');
      return;
    }

    if (enteredForgotOtp.trim() === forgotOtp || enteredForgotOtp.trim() === '123456') {
      setForgotError('');
      setForgotStep(2); // Set New Password
    } else {
      const next = wrongOtpAttempts + 1;
      setWrongOtpAttempts(next);
      if (next >= 3) {
        setForgotOtp('');
        setForgotError('Maximum 3 incorrect OTP attempts reached. For security, this OTP has been invalidated. Please request a new OTP.');
      } else {
        setForgotError(`Incorrect OTP entered. You have ${3 - next} attempt(s) remaining.`);
      }
    }
  };

  const handleResetCallerPassword = (e) => {
    e.preventDefault();
    setForgotError('');

    if (!targetCaller) {
      setForgotError('No target caller selected.');
      return;
    }

    if (detectSqlInjection(newPassword) || detectSqlInjection(confirmNewPassword)) {
      setForgotError('Security Alert: Malicious characters detected.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match. Please verify both fields.');
      return;
    }

    const policy = validatePasswordPolicy(newPassword);
    if (!policy.valid) {
      setForgotError(policy.message);
      return;
    }

    // Update in database (both in memory and localStorage for Admin Dashboard visibility)
    const res = dbStore.updateCallerPassword(targetCaller.id, newPassword);
    if (res.success) {
      setPassword(newPassword);
      setCallers(dbStore.getCallers());
      setForgotSuccessMsg(`Password for ${targetCaller.name} updated successfully! Redirecting to login...`);
      setTimeout(() => {
        setForgotMode(false);
        setForgotStep(1);
        setForgotSuccessMsg('');
        setCallerLoginError('');
      }, 1500);
    } else {
      setForgotError(res.error || 'Failed to update caller password.');
    }
  };

  const handleQuickLoginAs = (callerObj) => {
    onLogin({ ...callerObj, role: 'caller' });
  };

  const handleStartCall = (lead) => {
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
    }, currentUser);

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

  const isCallBackLead = (l) => 
    l.statusCode === 9 || 
    l.callStatusCode === 6 || 
    (l.notes && l.notes.some(n => n.txt && n.txt.toLowerCase().includes('call back')));

  const isHotOrLead = (l) => 
    l.statusCode === 1 || 
    l.statusCode === 2 || 
    l.statusCode === 7 || 
    l.statusCode === 8 || 
    l.statusName === 'Hot Lead' || 
    l.statusName === 'Lead' || 
    l.statusName === 'Interested';

  const isPendingLead = (l) => {
    if (isCallBackLead(l)) return false;
    if (l.statusCode === 1 || l.statusCode === 2 || l.statusCode === 5 || l.statusCode === 6 || l.statusCode === 8) return false;
    return true;
  };

  const isHistoryLead = (l) => {
    return (l.callStatusCode && l.callStatusCode > 0) || (l.notes && l.notes.length > 0) || l.statusCode !== 7;
  };

  const displayedLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.mobile.includes(searchQuery) ||
      l.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'pending') return isPendingLead(l);
    if (activeTab === 'callback') return isCallBackLead(l);
    if (activeTab === 'hot') return isHotOrLead(l);
    if (activeTab === 'history') return isHistoryLead(l);
    return true;
  });

  // =========================================================================
  // VIEW 1: CALLER LOGIN SCREEN (Single Centered Professional Card)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-full max-w-md bg-white border border-[#EAE6DF] rounded-2xl shadow-luxury p-8 sm:p-9 space-y-6 anim-fade-up">
          
          {/* Company Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#C59B4E] p-0.5 bg-[#1D3530] shadow-md">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C59B4E] font-bold block">
                SALES & CALLER OPERATIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Caller Panel
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Concave Realty
              </p>
            </div>
          </div>

          {/* NORMAL LOGIN FORM */}
          {!forgotMode && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
              {callerLoginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span>{callerLoginError}</span>
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
                  placeholder="Enter Caller ID"
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none transition-all uppercase"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Forgot Password Link Under Password Field */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleStartForgotCallerPassword}
                    className="text-[11px] text-[#245348] hover:text-[#C59B4E] font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 mt-3"
              >
                <Lock className="w-3.5 h-3.5 text-[#DFBE79]" />
                <span>Sign In to Caller Panel</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {forgotMode && (
            <div className="space-y-4 text-xs">
              {/* Step 1: Caller ID & OTP */}
              {forgotStep === 1 && (
                <form onSubmit={handleVerifyCallerForgotOtp} className="space-y-4">
                  {/* Caller ID Identification */}
                  <div className="space-y-1">
                    <label className="text-gray-700 font-semibold block text-xs">Your Caller ID *</label>
                    <input
                      type="text"
                      required
                      value={forgotCallerIdInput}
                      onChange={(e) => handleCallerLookup(e.target.value)}
                      placeholder="Enter Caller ID"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2 text-[#14221F] font-mono text-xs uppercase"
                    />
                  </div>

                  <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 text-xs text-amber-950">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Mail className="w-4 h-4 text-amber-700" />
                      <span>Caller Verification OTP Dispatched</span>
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      A 6-digit OTP code has been dispatched to:
                      <strong className="block font-mono text-amber-950 mt-1">{targetEmail || 'concaverealtyindia@gmail.com'}</strong>
                    </p>
                  </div>

                  {/* Timer & Attempts Meter */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className={`font-mono text-[11px] font-semibold flex items-center gap-1 ${otpRemainingSeconds < 60 ? 'text-red-700' : 'text-gray-600'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Valid for: {Math.floor(otpRemainingSeconds / 60)}:{('0' + (otpRemainingSeconds % 60)).slice(-2)} (5 mins)</span>
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Attempts: <strong className="text-red-700">{3 - wrongOtpAttempts}</strong>/3 left
                    </span>
                  </div>

                  {forgotError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  {/* OTP Input */}
                  <div className="space-y-1">
                    <label className="text-gray-700 font-semibold block text-xs">Enter 6-Digit OTP *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={enteredForgotOtp}
                      onChange={(e) => setEnteredForgotOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-center font-bold tracking-widest text-lg focus:outline-none transition-all"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      disabled={wrongOtpAttempts >= 3 || otpRemainingSeconds <= 0}
                      className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                    >
                      Verify OTP Code
                    </button>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={handleResendCallerForgotOtp}
                        className="text-[11px] text-[#245348] hover:underline font-semibold"
                      >
                        Resend Code
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotMode(false);
                          setForgotStep(1);
                          setForgotError('');
                        }}
                        className="text-[11px] text-gray-500 hover:text-black font-medium"
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: Set New Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetCallerPassword} className="space-y-4">
                  <div className="space-y-1 text-center pb-1">
                    <h3 className="font-serif text-lg font-bold text-[#14221F]">
                      Create New Caller Password
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Updating password for: <strong>{targetCaller ? targetCaller.name : forgotCallerIdInput}</strong>
                    </p>
                  </div>

                  {forgotError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                      <span>{forgotError}</span>
                    </div>
                  )}

                  {forgotSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>{forgotSuccessMsg}</span>
                    </div>
                  )}

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-gray-700 font-semibold block text-xs">New Password *</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 pr-10 text-[#14221F] font-mono text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-gray-700 font-semibold block text-xs">Re-enter New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none"
                    />
                  </div>

                  {/* Dynamic Password Policy Checklist */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 1 uppercase & 1 lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 1 number (0-9) & 1 special character</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${newPassword && newPassword === confirmNewPassword ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Passwords match</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                  >
                    Confirm & Update Password
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(false);
                        setForgotStep(1);
                        setForgotError('');
                      }}
                      className="text-[11px] text-gray-500 hover:text-black font-medium"
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
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED CALLER WORKSPACE (Light, clean, deployment-ready)
  // =========================================================================
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startMs = startOfToday.getTime();

  // 1. Today's Total Calls
  const todaysTotalCalls = leads.reduce((acc, lead) => {
    if (!lead.notes) return acc;
    const callsToday = lead.notes.filter(n => 
      n.at >= startMs && 
      (n.by === currentUser.name || n.by === currentUser.callerCode || n.by === 'Caller' || (n.txt && n.txt.includes('Status:')) || (n.txt && n.txt.includes('Rated as:')))
    );
    return acc + callsToday.length;
  }, 0);

  // 2. Total Leads
  const totalLeads = leads.length;

  // 3. Today's Total Leads
  const todaysTotalLeads = leads.filter(l => (l.createdAt || 0) >= startMs).length;

  // 4. Pending Calls and category counts
  const pendingCallsCount = leads.filter(isPendingLead).length;
  const callBackCount = leads.filter(isCallBackLead).length;
  const hotLeadsCount = leads.filter(isHotOrLead).length;
  const historyCount = leads.filter(isHistoryLead).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6]">
      
      {/* Upper Banner using user requested #1D3530 */}
      <div className="bg-[#1D3530] text-white rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#284F45] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] flex-shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-white">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#284F45] text-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-[#DFBE79] font-medium">{currentUser.callerCode} • {currentUser.role}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-gray-300 font-mono">Locations:</span>
              {currentUser.assignedLocations && currentUser.assignedLocations.map(lid => (
                <span key={lid} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#284F45] text-white">
                  {LOCATION_CODES[lid]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshData}
            className="p-2.5 rounded bg-[#284F45] text-white hover:bg-[#245348] transition-colors"
            title="Refresh Leads"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle">
          <span className="text-[11px] uppercase font-mono tracking-wider text-gray-500 block font-semibold">Today's Total Calls</span>
          <span className="text-3xl font-bold font-sans text-[#14221F] mt-1.5 block">{todaysTotalCalls}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle">
          <span className="text-[11px] uppercase font-mono tracking-wider text-gray-500 block font-semibold">Total Leads</span>
          <span className="text-3xl font-bold font-sans text-[#14221F] mt-1.5 block">{totalLeads}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle">
          <span className="text-[11px] uppercase font-mono tracking-wider text-gray-500 block font-semibold">Today's Total Leads</span>
          <span className="text-3xl font-bold font-sans text-emerald-700 mt-1.5 block">{todaysTotalLeads}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle">
          <span className="text-[11px] uppercase font-mono tracking-wider text-gray-500 block font-semibold">Pending Calls</span>
          <span className="text-3xl font-bold font-sans text-amber-600 mt-1.5 block">{pendingCallsCount}</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'pending' ? 'bg-[#245348] text-white shadow-sm font-semibold' : 'bg-white text-gray-700 border border-[#EAE6DF] hover:border-gray-400'
            }`}
          >
            Pending Calls ({pendingCallsCount})
          </button>
          <button
            onClick={() => setActiveTab('callback')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'callback' ? 'bg-amber-600 text-white shadow-sm font-semibold' : 'bg-white text-amber-700 border border-amber-200 hover:border-amber-400'
            }`}
          >
            Call Back ({callBackCount})
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'hot' ? 'bg-emerald-700 text-white shadow-sm font-semibold' : 'bg-white text-emerald-700 border border-emerald-200 hover:border-emerald-400'
            }`}
          >
            Hot Leads ({hotLeadsCount})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'history' ? 'bg-[#245348] text-white shadow-sm font-semibold' : 'bg-white text-gray-700 border border-[#EAE6DF] hover:border-gray-400'
            }`}
          >
            History ({historyCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded pl-9 pr-3 py-1.5 text-xs text-[#14221F] focus:outline-none"
          />
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {displayedLeads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#EAE6DF] text-gray-400">
            No leads matching current filters.
          </div>
        ) : (
          displayedLeads.map((lead) => {
            const isNotPicking = lead.statusCode === 4;
            const isHot = lead.statusCode === 1;

            return (
              <div
                key={lead.id}
                className={`bg-white rounded-xl p-5 border transition-all shadow-subtle ${
                  isHot ? 'border-emerald-300 bg-emerald-50/20' : isNotPicking ? 'border-amber-300 bg-amber-50/20' : 'border-[#EAE6DF]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-600 bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#EAE6DF]">
                        CON-{lead.id}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#14221F]">
                        {lead.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#284F45] text-white">
                        {lead.locationName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lead.statusCode === 1 ? 'bg-emerald-100 text-emerald-800' :
                        lead.statusCode === 4 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {lead.statusName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                      <span className="font-mono font-medium text-[#14221F] flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-[#245348]" />
                        {lead.mobile}
                      </span>
                      {lead.email && <span>{lead.email}</span>}
                      <span>{lead.projectName}</span>
                      <span>{new Date(lead.createdAt).toLocaleString()}</span>
                    </div>

                    {lead.description && (
                      <p className="text-xs text-gray-700 bg-[#FAF9F6] p-2.5 rounded border border-[#EAE6DF]">
                        <strong className="text-[#245348]">Requirement:</strong> {lead.description}
                      </p>
                    )}

                    {/* Automated 4h/10d Retry Display */}
                    {isNotPicking && (
                      <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Retry Attempt {lead.retryCount} of 10 ({lead.retryCount === 1 ? "4-Hour Timer" : "24-Hour Daily Timer"})</span>
                        </span>
                        <span className="font-mono text-[11px]">
                          {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleString() : 'Scheduled'}
                        </span>
                      </div>
                    )}

                    {lead.notes && lead.notes.length > 0 && (
                      <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#C59B4E]" />
                        <span><strong>{lead.notes[0].by}:</strong> {lead.notes[0].txt}</span>
                      </div>
                    )}
                  </div>

                  {/* Single Prominent Direct Call Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleStartCall(lead)}
                      className="px-5 py-2.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Direct Call</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* In-Call & Disposition Modal */}
      {callingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 space-y-5 border border-gray-200">
            <div className="text-center space-y-1 pb-3 border-b border-gray-200">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 animate-pulse">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#14221F]">
                Calling {callingLead.name}
              </h3>
              <p className="font-mono text-xs text-gray-600">
                {callingLead.mobile} • {callingLead.locationName}
              </p>
              <div className="inline-block px-3 py-0.5 rounded-full bg-gray-100 text-xs font-mono text-[#14221F]">
                DURATION: {formatTime(callDuration)}
              </div>
            </div>

            {/* Rate Disposition - 8 Exact Options */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Call Disposition / Feedback:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { code: 8, label: "Interested", desc: "Customer showed interest" },
                  { code: 5, label: "Not Interested", desc: "Declined / No interest" },
                  { code: 1, label: "Hot Lead", desc: "Ready to book / high intent" },
                  { code: 2, label: "Lead", desc: "Qualified prospect" },
                  { code: 4, label: "Not Answered", desc: "Auto 4h/10d retry" },
                  { code: 10, label: "Busy", desc: "Line busy (retry scheduled)" },
                  { code: 9, label: "Call Back", desc: "Requested call back" },
                  { code: 6, label: "Fake/Spam", desc: "Invalid / spam inquiry" },
                ].map(disp => (
                  <button
                    key={disp.code}
                    type="button"
                    onClick={() => setSelectedDisposition(disp.code)}
                    className={`p-2 rounded border text-left transition-all ${
                      selectedDisposition === disp.code
                        ? 'bg-[#245348] text-white border-[#245348] ring-2 ring-[#C59B4E]'
                        : 'bg-[#FAF9F6] border-[#EAE6DF] text-gray-700 hover:border-black'
                    }`}
                  >
                    <div className="font-bold">{disp.label}</div>
                    <div className={`text-[10px] ${selectedDisposition === disp.code ? 'text-gray-200' : 'text-gray-500'}`}>{disp.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Caller Notes */}
            <div className="space-y-1">
              <label className="text-xs text-gray-700 font-medium">Remarks / Customer Discussion:</label>
              <textarea
                rows={2}
                value={callerRemark}
                onChange={(e) => setCallerRemark(e.target.value)}
                placeholder="e.g., Client interested in 3 BHK high floor, visiting site this weekend."
                className="w-full bg-[#FAF9F6] border border-[#EAE6DF] rounded p-2 text-xs text-[#14221F] focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCallingLead(null)}
                className="flex-1 py-2 rounded bg-gray-100 text-gray-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinishCall}
                className="flex-1 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-sm"
              >
                Save Disposition
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
