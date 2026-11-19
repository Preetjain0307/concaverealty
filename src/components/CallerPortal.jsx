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
  Home
} from 'lucide-react';
import { dbStore, STATUS_CODES, CALL_STATUS_CODES, LOCATION_CODES, verifyPassword } from '../data/dbStore';

export function CallerPortal({ currentUser, onLogin, onLogout, onNavigateHome }) {
  const [callers, setCallers] = useState([]);
  const [loginMethod, setLoginMethod] = useState('credentials'); // 'credentials' or 'otp'
  
  // Credentials login state
  const [callerCode, setCallerCode] = useState('');
  const [password, setPassword] = useState('');

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
  // VIEW 1: LOGIN SCREEN (Standalone Executive Portal View)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        {/* Standalone Minimal Header */}
        <header className="w-full bg-[#14221F] text-white border-b border-[#245348] py-3.5 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C59B4E] bg-[#245348] p-0.5 shrink-0">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-bold text-white tracking-widest block leading-none">
                CONCAVE REALTY
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#DFBE79]">
                Caller Operations Portal
              </span>
            </div>
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
        <div className="w-full max-w-4xl bg-white border border-[#EAE6DF] rounded-2xl shadow-luxury-light overflow-hidden grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Form Panel (Light, aesthetic, minimal) */}
          <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C59B4E] block">
                CONCAVE SALES DESK
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#14221F]">
                Caller Workspace
              </h2>
              <p className="text-xs text-gray-500">
                Log in to view leads routed specifically to your assigned territory.
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#EAE6DF] text-xs">
              <button
                onClick={() => setLoginMethod('credentials')}
                className={`flex-1 py-1.5 rounded font-medium transition-all ${
                  loginMethod === 'credentials' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                ID & Password
              </button>
              <button
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-1.5 rounded font-medium transition-all ${
                  loginMethod === 'otp' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {forgotPasswordMode ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-[#EAE6DF]">
                  <span className="font-bold text-[#14221F] text-sm">Reset Caller Password</span>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordMode(false);
                      setForgotError('');
                      setForgotSuccess('');
                    }}
                    className="text-[11px] text-gray-500 hover:text-black underline cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>

                {forgotError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {forgotError}
                  </div>
                )}

                {forgotSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    {forgotSuccess}
                  </div>
                )}

                {forgotStep === 1 && (
                  <form onSubmit={handleStartForgot} className="space-y-3">
                    <p className="text-gray-500 leading-relaxed text-[11px]">
                      Enter your Caller ID. We will dispatch a 6-digit security verification code to your registered email address.
                    </p>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-medium">Caller ID</label>
                      <input
                        type="text"
                        required
                        value={forgotCallerCode}
                        onChange={(e) => setForgotCallerCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CALLER-101"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Sending Verification Code...' : 'Send Verification Code'}
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyForgotOtp} className="space-y-3">
                    <p className="text-gray-500 leading-relaxed text-[11px]">
                      A 6-digit verification code has been dispatched to your registered email ({forgotCallerEmail}).
                    </p>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-medium">Enter 6-Digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-center text-base font-mono tracking-widest text-[#14221F]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Verifying...' : 'Verify Security Code'}
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleResetCallerPassword} className="space-y-3">
                    <p className="text-gray-500 leading-relaxed text-[11px]">
                      Code verified! Set your new password. It will be securely hashed and updated in the database.
                    </p>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-medium">New Password</label>
                      <input
                        type="password"
                        required
                        value={newCallerPassword}
                        onChange={(e) => setNewCallerPassword(e.target.value)}
                        placeholder="Min 8 characters (Upper, Lower, Number, Special)"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-600 font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={confirmCallerPassword}
                        onChange={(e) => setConfirmCallerPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Updating Database...' : 'Update Password in Database'}
                    </button>
                  </form>
                )}
              </div>
            ) : loginMethod === 'credentials' ? (
              <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {loginError}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Caller ID</label>
                  <input
                    type="text"
                    required
                    value={callerCode}
                    onChange={(e) => setCallerCode(e.target.value)}
                    placeholder="CALLER-101"
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-600 font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordMode(true);
                        setForgotStep(1);
                        setForgotCallerCode(callerCode || '');
                        setForgotError('');
                        setForgotSuccess('');
                      }}
                      className="text-[10px] text-[#284F45] hover:text-[#1D3530] hover:underline font-semibold cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                  />
                </div>

                {/* Requested "Sign in" button color: #245348 */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                  Sign In
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Mobile Number</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={otpMobile}
                      onChange={(e) => setOtpMobile(e.target.value)}
                      className="flex-1 bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 bg-[#284F45] text-white rounded font-medium"
                    >
                      {otpSent ? 'Resend' : 'Send OTP'}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                {otpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <p className="text-gray-500 text-[11px]">
                      A 6-digit security code has been dispatched to your authorized email address.
                    </p>

                    <input
                      type="text"
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-center text-base font-mono tracking-widest text-[#14221F]"
                      required
                    />

                    {/* Requested "Sign in" button: #245348 */}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                    >
                      Sign In with OTP
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Security Notice */}
            <div className="pt-3 border-t border-[#EAE6DF] space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                🔒 Enterprise Access Control:
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Authorized advisory personnel only. All access attempts, IP addresses, and caller interactions are logged in compliance with MahaRERA records.
              </p>
            </div>
          </div>

          {/* Right-side "Welcome back" panel: User requested #284F45 */}
          <div className="bg-[#284F45] text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C59B4E] p-0.5 bg-white/10">
                <img src="/logo_icon.jpg" alt="Concave" className="w-full h-full object-cover rounded-full" />
              </div>
              
              <h3 className="font-serif text-3xl font-bold">
                Welcome Back
              </h3>
              
              <p className="font-serif italic text-base text-[#DFBE79]">
                “Where Legacy Meets Luxury”
              </p>

              <p className="text-xs text-gray-200 font-light leading-relaxed pt-2">
                Automated location routing instantly pairs every buyer inquiry with local territory specialists across Mumbai micro-markets.
              </p>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>Automated 4-hour & 10-day retry engine</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>Integrated direct web dialer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>Single-click call disposition logging</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              CONCAVE REALTY • CALLER OPERATIONS V2.0
            </div>
          </div>

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
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white">

      {/* Standalone Executive Caller Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14221F] text-white border-b border-[#245348] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C59B4E] bg-[#245348] p-0.5 shrink-0 shadow-xs">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-bold text-white tracking-widest block leading-none">
                CONCAVE REALTY
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#DFBE79]">
                Caller Operations Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                className="px-3 py-1.5 rounded-lg border border-[#C59B4E]/40 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Website</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
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
              <span className="text-[10px] text-gray-300 font-mono">Territories:</span>
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
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Territory Leads</span>
          <span className="text-2xl font-bold font-serif text-[#14221F] mt-1 block">{leads.length}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Pending Retries (4h / 10d)</span>
          <span className="text-2xl font-bold font-serif text-amber-600 mt-1 block">{pendingRetriesCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Hot Leads Identified</span>
          <span className="text-2xl font-bold font-serif text-emerald-700 mt-1 block">{hotLeadsCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Web Calling System</span>
          <span className="text-xs font-semibold text-[#245348] mt-2 block">
            ● Direct Web Dialer Ready
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 rounded font-medium transition-all ${
              activeTab === 'active' ? 'bg-[#245348] text-white' : 'bg-white text-gray-600 border border-[#EAE6DF]'
            }`}
          >
            Active Territory Queue ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('retries')}
            className={`px-3.5 py-1.5 rounded font-medium transition-all ${
              activeTab === 'retries' ? 'bg-amber-600 text-white font-bold' : 'bg-white text-amber-700 border border-amber-200'
            }`}
          >
            Not Picking Up Retries ({pendingRetriesCount})
          </button>
          <button
            onClick={() => setActiveTab('hot')}
            className={`px-3.5 py-1.5 rounded font-medium transition-all ${
              activeTab === 'hot' ? 'bg-emerald-700 text-white font-bold' : 'bg-white text-emerald-700 border border-emerald-200'
            }`}
          >
            Hot Leads ({hotLeadsCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded font-medium transition-all ${
              activeTab === 'all' ? 'bg-[#245348] text-white' : 'bg-white text-gray-600 border border-[#EAE6DF]'
            }`}
          >
            All History
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

                  {/* Direct Call Button (User requested #245348 - Single One-Click Action) */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleStartCall(lead)}
                      className="px-4 py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] active:scale-95 text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      title="Direct Call & Rate Disposition"
                    >
                      <PhoneCall className="w-4 h-4 text-[#DFBE79]" />
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

            {/* Rate Disposition */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Call Disposition / Rating:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { code: 1, label: "Hot Lead (1)", desc: "Ready to book" },
                  { code: 2, label: "Interested (2)", desc: "Schedule visit" },
                  { code: 4, label: "Not Picking (4)", desc: "Auto 4h/10d retry" },
                  { code: 3, label: "Okay (3)", desc: "Follow up" },
                  { code: 5, label: "Not Interested", desc: "No interest" },
                  { code: 6, label: "Fake / Spam", desc: "Invalid" },
                ].map(disp => (
                  <button
                    key={disp.code}
                    type="button"
                    onClick={() => setSelectedDisposition(disp.code)}
                    className={`p-2 rounded border text-left transition-all ${
                      selectedDisposition === disp.code
                        ? 'bg-[#245348] text-white border-[#245348]'
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
    </div>
  );
}
