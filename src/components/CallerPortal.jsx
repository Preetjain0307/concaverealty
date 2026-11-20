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
  Phone,
  Plus,
  FileText,
  Smartphone,
  Laptop,
  ArrowUpDown,
  Inbox
} from 'lucide-react';
import { dbStore, STATUS_CODES, CALL_STATUS_CODES, LOCATION_CODES, PROJECT_CODES, detectSqlInjection, sanitizeInput, verifyPassword, formatCompactDevice, isDesktopDevice, isConfirmedLead, isPendingEnquiry, isCallbackLead } from '../data/dbStore';

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
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'callback', 'leads', 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [selectedResponseFilter, setSelectedResponseFilter] = useState('All');
  const [sortBy, setSortBy] = useState('smart'); // 'smart', 'newest', 'oldest', 'priority', 'callback', 'name'
  const [enquiryPage, setEnquiryPage] = useState(1);
  const pageSize = 25;
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [copiedLeadId, setCopiedLeadId] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  // Auto-dismiss floating notifications after 4.5 seconds
  useEffect(() => {
    if (!feedbackToast) return;
    const timer = setTimeout(() => setFeedbackToast(null), 4500);
    return () => clearTimeout(timer);
  }, [feedbackToast]);

  // Direct Call Dialer Modal State
  const [callingLead, setCallingLead] = useState(null);
  const [selectedDisposition, setSelectedDisposition] = useState(null); // Null by default - full empty, not prefilled
  const [callerRemark, setCallerRemark] = useState('');
  const [dispositionError, setDispositionError] = useState('');

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

  // Security: Prevent search indexing of Caller Portal via dynamic meta tag
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    const prev = meta ? meta.getAttribute('content') : 'index, follow';
    if (meta) meta.setAttribute('content', 'noindex, nofollow, noarchive');
    return () => {
      if (meta) meta.setAttribute('content', prev);
    };
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

  // Manual Lead Creation State ("ADD NEW LEAD")
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadLocation, setNewLeadLocation] = useState(1);
  const [newLeadProject, setNewLeadProject] = useState(1);
  const [newLeadStatus, setNewLeadStatus] = useState(1); // 1 = Hot Lead
  const [newLeadCallStatus, setNewLeadCallStatus] = useState(1); // 1 = Connected & Discussed
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [newLeadError, setNewLeadError] = useState('');

  const refreshData = () => {
    try {
      const allCallers = dbStore.getCallers();
      setCallers(allCallers);

      if (currentUser && currentUser.id) {
        const callerLeads = dbStore.getLeadsForCaller(currentUser.id);
        setLeads(callerLeads);

        // Real-time server sync
        dbStore.syncWithServer().then(synced => {
          if (synced && currentUser && currentUser.id) {
            setLeads(dbStore.getLeadsForCaller(currentUser.id));
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Error refreshing caller data:", err);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Login Handlers
  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!callerCode.trim() || !password) {
      setLoginError("Please enter both Caller ID and password.");
      return;
    }

    if (detectSqlInjection(callerCode) || detectSqlInjection(password)) {
      setLoginError("Security Warning: Prohibited special characters detected in credentials.");
      return;
    }

    let found = null;
    for (const c of callers) {
      if (c.callerCode === callerCode.trim()) {
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
      setLoginError("Invalid Caller ID or Password. Both fields are case-sensitive.");
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
        setEnteredOtp('');
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
    const code = forgotCallerCode.trim();
    if (!code) {
      setForgotError('Please enter your Caller ID (e.g. Callerpreet).');
      return;
    }
    const found = callers.find(c => c.callerCode === code);
    if (!found) {
      setForgotError('Caller ID not found in system (IDs are case-sensitive).');
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
        setForgotOtp('');
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
    if (detectSqlInjection(forgotOtp)) {
      setForgotError('Security Warning: Prohibited special characters detected.');
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
    if (detectSqlInjection(newCallerPassword) || detectSqlInjection(confirmCallerPassword)) {
      setForgotError('Security Warning: Prohibited special characters detected in password.');
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
          callerCode: forgotCallerCode.trim()
        })
      });

      // 2. Update local state store
      await dbStore.updateCallerPassword(forgotCallerCode.trim(), newCallerPassword);
      setForgotSuccess('Password updated successfully in database! You may now sign in.');
      setTimeout(() => {
        setForgotPasswordMode(false);
        setForgotStep(1);
        setForgotSuccess('');
        setPassword(newCallerPassword);
        setCallerCode(forgotCallerCode.trim());
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
  };

  const handleFinishCall = () => {
    if (!callingLead) return;

    if (!selectedDisposition) {
      setDispositionError('Please select a customer status option (e.g. Hot Lead, Lead, Not Picking, etc.) before saving.');
      return;
    }
    setDispositionError('');

    dbStore.updateLeadDisposition(callingLead.id, {
      statusCode: selectedDisposition,
      noteText: callerRemark,
      callerName: currentUser ? currentUser.name : 'Caller Desk'
    });

    let destinationMsg = 'All History';
    if (selectedDisposition === 1 || selectedDisposition === 2) {
      destinationMsg = 'Leads tab & All History';
    } else if (selectedDisposition === 3 || selectedDisposition === 4) {
      destinationMsg = 'Callback tab & All History';
    }
    const statusLabel = STATUS_CODES[selectedDisposition] || 'Updated';
    setFeedbackToast(`CON-${callingLead.id} updated to "${statusLabel}" → Moved to ${destinationMsg}.`);
    setTimeout(() => setFeedbackToast(null), 4000);

    setCallingLead(null);
    setSelectedDisposition(null);
    setCallerRemark('');
    refreshData();
  };

  const handleOpenDisposition = (lead) => {
    setCallingLead(lead);
    setSelectedDisposition(lead.statusCode || 1);
    const latestNote = lead.notes && lead.notes.length > 0 ? lead.notes[0].txt : '';
    setCallerRemark(latestNote || '');
    setSelectedDisposition(null); // Full empty - not prefilled!
    setCallerRemark(''); // Full empty - not prefilled!
    setDispositionError('');
  };

  // Manual Lead Creator Handler ("ADD NEW LEAD")
  const handleCreateManualLead = (e) => {
    e.preventDefault();
    setNewLeadError('');

    const cleanMobile = newLeadMobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      setNewLeadError('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }
    if (!newLeadName.trim() || newLeadName.trim().length < 2) {
      setNewLeadError('Please enter customer full name (minimum 2 characters).');
      return;
    }

    if (detectSqlInjection(newLeadName) || detectSqlInjection(newLeadNotes) || (newLeadEmail && detectSqlInjection(newLeadEmail))) {
      setNewLeadError('Security Alert: Prohibited characters or SQL patterns detected.');
      return;
    }

    const safeName = sanitizeInput(newLeadName.trim());
    const safeNotes = sanitizeInput(newLeadNotes.trim());

    const res = dbStore.createManualLead({
      name: safeName,
      mobile: cleanMobile,
      email: newLeadEmail ? sanitizeInput(newLeadEmail.trim()) : '',
      locationId: newLeadLocation,
      projectId: newLeadProject,
      statusCode: newLeadStatus,
      callStatusCode: newLeadCallStatus,
      callerId: currentUser ? currentUser.id : 0,
      callerName: currentUser ? currentUser.name : "Caller Desk",
      description: safeNotes,
      noteText: safeNotes
    });

    if (res.success) {
      setShowAddLeadModal(false);
      // Reset form
      setNewLeadName('');
      setNewLeadMobile('');
      setNewLeadEmail('');
      setNewLeadLocation(currentUser?.assignedLocations?.[0] || 1);
      setNewLeadProject(1);
      setNewLeadStatus(1);
      setNewLeadCallStatus(1);
      setNewLeadNotes('');
      setNewLeadError('');
      setFeedbackToast(`New Lead CON-${res.lead?.id || ''} added to your queue.`);
      setTimeout(() => setFeedbackToast(null), 3500);
      refreshData();
    } else {
      setNewLeadError(res.error || 'Failed to create lead.');
    }
  };

  const displayedLeads = leads.filter(l => {
    // 1. Search Query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      l.name.toLowerCase().includes(q) ||
      l.mobile.includes(q) ||
      (l.locationName && l.locationName.toLowerCase().includes(q)) ||
      (l.projectName && l.projectName.toLowerCase().includes(q)) ||
      (l.deviceName && l.deviceName.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // 2. Dropdown Location filter
    if (selectedLocationFilter !== 'All' && String(l.location) !== String(selectedLocationFilter)) {
      return false;
    }

    // 3. Dropdown Response filter
    if (selectedResponseFilter !== 'All' && String(l.statusCode) !== String(selectedResponseFilter)) {
      return false;
    }

    // 4. Tab Filter (active queue, callback, leads, all history)
    if (activeTab === 'active') {
      return isPendingEnquiry(l);
    }
    if (activeTab === 'callback') {
      return isCallbackLead(l);
    }
    if (activeTab === 'leads') {
      return isConfirmedLead(l);
    }
    return true; // 'all'
  });

  // Intelligent Multi-Mode Sorting
  const sortedLeads = [...displayedLeads].sort((a, b) => {
    const tsA = a.createdAt || a.ts || 0;
    const tsB = b.createdAt || b.ts || 0;

    if (sortBy === 'newest') {
      return tsB - tsA;
    }
    if (sortBy === 'oldest') {
      return tsA - tsB;
    }
    if (sortBy === 'priority') {
      // Hot Leads (1) > Leads (2) > Follow up (3) > Retries (4) > New (7)
      const priorityOrder = { 1: 1, 2: 2, 3: 3, 4: 4, 7: 5, 5: 6, 6: 7 };
      const pa = priorityOrder[a.statusCode] || 99;
      const pb = priorityOrder[b.statusCode] || 99;
      if (pa !== pb) return pa - pb;
      return tsB - tsA;
    }
    if (sortBy === 'callback') {
      const naA = a.nextAttemptAt || Infinity;
      const naB = b.nextAttemptAt || Infinity;
      if (naA !== naB) return naA - naB;
      return tsB - tsA;
    }
    if (sortBy === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    }

    // Default 'smart' sort: tab-optimized
    if (activeTab === 'active') {
      // Pending enquiries: newest incoming web enquiries first
      return tsB - tsA;
    }
    if (activeTab === 'callback') {
      // Upcoming / overdue callbacks first
      const naA = a.nextAttemptAt || (tsA ? tsA + 86400000 : Infinity);
      const naB = b.nextAttemptAt || (tsB ? tsB + 86400000 : Infinity);
      if (naA !== naB) return naA - naB;
      return tsB - tsA;
    }
    if (activeTab === 'leads') {
      // Hot Leads (1) pinned at top, then Leads (2), then newest
      if (a.statusCode === 1 && b.statusCode !== 1) return -1;
      if (b.statusCode === 1 && a.statusCode !== 1) return 1;
      return tsB - tsA;
    }

    // All history: chronological newest first
    return tsB - tsA;
  });

  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = sortedLeads.slice((enquiryPage - 1) * pageSize, enquiryPage * pageSize);

  // =========================================================================
  // VIEW 1: LOGIN SCREEN (Standalone Executive Portal View - Matched with Admin)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        {/* Standalone Header (Branding + Return to Website) */}
        <header className="w-full bg-[#14221F] text-white border-b border-[#245348] py-3 px-3 sm:px-8 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#C59B4E]/70 p-0.5 bg-[#284F45] shrink-0 shadow-xs">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col justify-center text-left min-w-0">
              <span className="font-serif text-[13px] xs:text-sm sm:text-base font-bold text-white tracking-[0.08em] sm:tracking-[0.1em] block leading-tight whitespace-nowrap">
                CONCAVE REALTY
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.14em] sm:tracking-[0.18em] text-[#DFBE79] font-semibold block mt-0.5 leading-none whitespace-nowrap">
                Caller Panel
              </span>
            </div>
          </div>
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-[#C59B4E]/40 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap shadow-xs"
            >
              <Home className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Return to Website</span>
              <span className="sm:hidden">Website</span>
            </button>
          )}
        </header>

        <div className="flex-1 py-6 sm:py-12 px-3 sm:px-4 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-luxury border border-[#EAE6DF] p-6 sm:p-9 space-y-5 sm:space-y-6 anim-fade-up">

            {/* Company Logo & Header */}
            <div className="text-center space-y-2.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full overflow-hidden border-2 border-[#C59B4E] p-0.5 bg-[#1D3530] shadow-md">
                <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#245348] font-bold block">
                  CALLER PANEL
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Caller Login
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Concave Realty • Sales & Location Outreach Console
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
                    placeholder="e.g. Callerpreet"
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
                        placeholder="e.g. Callerpreet"
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
  // 4 Filter Tabs Counts
  const activeQueueCount = leads.filter(l => isPendingEnquiry(l)).length;
  const callbackCount = leads.filter(l => isCallbackLead(l)).length;
  const leadsCount = leads.filter(l => isConfirmedLead(l)).length;
  const allHistoryCount = leads.length;

  // 1. Pending Enquiries: Total number of records in Active Queue
  const pendingCallsCount = activeQueueCount;

  // 2. Total Lead: Total confirmed leads generated uptil now
  const totalLeadsCount = leadsCount;

  // Today's Timestamp Threshold (midnight today)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayTs = startOfToday.getTime();

  // 3. Today's Total Calls: Total count of consultations and status assignments done today
  const todaysTotalCallsCount = leads.reduce((sum, l) => {
    const todayNotes = (l.notes || []).filter(n => n.at && n.at >= startOfTodayTs && n.by !== "System Lead Router");
    return sum + todayNotes.length;
  }, 0) || leads.filter(l => {
    const hasNoteToday = l.notes && l.notes.some(n => n.at && n.at >= startOfTodayTs && n.by !== "System Lead Router");
    const isCalledToday = l.callStatusCode > 0 && l.createdAt && l.createdAt >= startOfTodayTs;
    return hasNoteToday || isCalledToday;
  }).length;

  // 4. Today's Total Lead: Total confirmed leads generated today
  const todaysTotalLeadsCount = leads.filter(l => {
    if (!isConfirmedLead(l)) return false;
    const createdToday = l.createdAt && l.createdAt >= startOfTodayTs;
    const noteToday = l.notes && l.notes.some(n => n.at && n.at >= startOfTodayTs);
    return createdToday || noteToday;
  }).length;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white pb-16">

      {/* Standalone Executive Caller Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14221F] text-white border-b border-[#245348] shadow-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#C59B4E]/70 p-0.5 bg-[#284F45] shrink-0 shadow-xs">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-[15px] sm:text-lg font-bold text-white tracking-[0.1em] block leading-tight whitespace-nowrap">
                CONCAVE REALTY
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase font-sans tracking-[0.18em] text-[#DFBE79] font-semibold block mt-0.5 leading-none">
                Caller Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
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

      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">

        {/* Upper Agent Hero Banner - Compact Height */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#14221F] via-[#1D3530] to-[#0E1A17] text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-luxury-md border border-[#245348] flex items-center justify-between gap-3">
          {/* Subtle Luxury Ambient Glows */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#C59B4E]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-40 h-40 bg-[#245348]/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#284F45] to-[#14221F] border-2 border-[#C59B4E] flex items-center justify-center text-[#DFBE79] flex-shrink-0 shadow-md">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#14221F] rounded-full animate-pulse shadow-md" title="Agent Online" />
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="font-serif text-base sm:text-xl font-bold text-white tracking-wide truncate">{currentUser.name}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs">
                <span className="text-[#DFBE79] font-mono font-medium tracking-wide">{currentUser.callerCode}</span>
                {currentUser.assignedLocations && currentUser.assignedLocations.length > 0 && (
                  <>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300 font-mono text-[10px] sm:text-[11px] inline-flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 text-[#C59B4E]" />
                      {(currentUser.assignedLocations || [])
                        .map(lid => LOCATION_CODES[lid])
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hero Right: Quick Refresh Action */}
          <div className="relative z-10 flex items-center shrink-0">
            <button
              onClick={refreshData}
              className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#284F45] hover:bg-[#245348] text-white border border-[#C59B4E]/30 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
              title="Refresh Leads Queue"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFBE79] group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* 4 Cards: Pending Enquiries (Active Queue), Total Lead (Uptil Now), Today's Total Calls (Consultations Today), Today's Total Lead (Generated Today) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Card 1: Pending Enquiries (Active Queue) */}
          <div className="bg-gradient-to-b from-amber-50/40 to-white p-3 sm:p-4 rounded-xl border border-amber-200 border-t-[3px] border-t-amber-500 shadow-luxury-xs hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase font-mono text-black font-bold tracking-wide block truncate">Pending Enquiries</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-600 block leading-none">{pendingCallsCount}</span>
              {pendingCallsCount > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 animate-pulse border border-amber-300 shrink-0">
                  ⚡ Active Queue
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  ✓ Queue Clear
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-800/80 mt-1 font-medium truncate">Total pending in Active Queue</p>
          </div>

          {/* Card 2: Total Lead (Confirmed Leads Generated Uptil Now) */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-[#EAE6DF] border-t-[3px] border-t-[#245348] shadow-luxury-xs hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase font-mono text-black font-bold tracking-wide block truncate">Total Lead</span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1D3530]/10 text-[#245348] flex items-center justify-center group-hover:bg-[#245348] group-hover:text-white transition-colors shrink-0">
                <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-[#14221F] block leading-none">{totalLeadsCount}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                Uptil Now
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 font-medium truncate">Total confirmed leads generated</p>
          </div>

          {/* Card 3: Today's Total Calls (Consultations & Status Assigned Today) */}
          <div className="bg-gradient-to-b from-blue-50/40 to-white p-3 sm:p-4 rounded-xl border border-blue-200 border-t-[3px] border-t-blue-600 shadow-luxury-xs hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between gap-1 min-h-[28px] sm:min-h-0">
              <span className="text-[10px] sm:text-xs uppercase font-mono text-black font-bold tracking-tight sm:tracking-wide block leading-tight">
                Today's<br className="sm:hidden" /> Total Calls
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-blue-700 block leading-none">{todaysTotalCallsCount}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                Today
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-blue-800/80 mt-1 font-medium truncate">Consultations & status assigned</p>
          </div>

          {/* Card 4: Today's Total Lead (Total Confirmed Leads Generated Today) */}
          <div className="bg-gradient-to-b from-emerald-50/40 to-white p-3 sm:p-4 rounded-xl border border-emerald-200 border-t-[3px] border-t-emerald-600 shadow-luxury-xs hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-start justify-between gap-1 min-h-[28px] sm:min-h-0">
              <span className="text-[10px] sm:text-xs uppercase font-mono text-black font-bold tracking-tight sm:tracking-wide block leading-tight">
                Today's<br className="sm:hidden" /> Total Lead
              </span>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 group-hover:text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1 sm:mt-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 block leading-none">{todaysTotalLeadsCount}</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                Today
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-emerald-800/80 mt-1 font-medium truncate">Total lead generated today</p>
          </div>
        </div>

        {/* ── Enquiry Records Container (Table & Records Console) ── */}
        <div className="bg-white rounded-2xl p-4 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5">
          {/* Header: Enquiry Records + Search + Dropdown Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 border-b border-[#245348]/25 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 w-full lg:w-auto">
              <div className="flex items-center justify-between sm:justify-start gap-2.5 min-w-0">
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#14221F] tracking-wide whitespace-nowrap">
                  Enquiry Records
                </h2>
                <span className="text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF9F6] text-[#245348] border border-[#EAE6DF] whitespace-nowrap shrink-0">
                  {leads.length} Records
                </span>
              </div>

              {/* ADD NEW LEAD Button */}
              <button
                type="button"
                onClick={() => {
                  setNewLeadLocation(currentUser?.assignedLocations?.[0] || 1);
                  setNewLeadError('');
                  setShowAddLeadModal(true);
                }}
                className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0 border border-[#DFBE79]/50"
                title="Manually Add New Customer Lead"
              >
                <Plus className="w-3.5 h-3.5 text-[#DFBE79]" />
                <span>Add Lead</span>
              </button>
            </div>

            {/* Search Bar & Dropdown Filters (Locations & Responses) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
              {/* Search Input - Full width on mobile, fixed width on tablet/desktop */}
              <div className="relative w-full sm:w-60 lg:w-64">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search customer, phone, project..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setEnquiryPage(1);
                  }}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:bg-white rounded-xl pl-8 pr-7 py-2 text-xs text-[#14221F] placeholder:text-gray-400 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Dropdown Filters: 2 Equal Columns on Mobile, Flex on Desktop */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                {/* Location Dropdown Filter */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedLocationFilter}
                    onChange={(e) => {
                      setSelectedLocationFilter(e.target.value);
                      setEnquiryPage(1);
                    }}
                    className="w-full sm:w-auto bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-2.5 py-2 text-xs text-[#14221F] font-semibold focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Locations</option>
                    {Object.entries(LOCATION_CODES).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Response Type Dropdown Filter */}
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedResponseFilter}
                    onChange={(e) => {
                      setSelectedResponseFilter(e.target.value);
                      setEnquiryPage(1);
                    }}
                    className="w-full sm:w-auto bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-2.5 py-2 text-xs text-[#14221F] font-semibold focus:outline-none cursor-pointer truncate"
                  >
                    <option value="All">All Responses</option>
                    <option value="1">Hot Lead</option>
                    <option value="2">Lead</option>
                    <option value="4">Not Picking Up</option>
                    <option value="3">Okay / Follow Up</option>
                    <option value="5">Not Interested</option>
                    <option value="6">Fake / Spam</option>
                  </select>
                </div>

                {/* Smart Sort Dropdown */}
                <div className="relative col-span-2 sm:col-auto w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setEnquiryPage(1);
                    }}
                    className="w-full sm:w-auto bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-2.5 py-2 text-xs text-[#14221F] font-semibold focus:outline-none cursor-pointer truncate"
                    title="Sort Order"
                  >
                    <option value="smart">⚡ Smart Sort</option>
                    <option value="newest">🕒 Newest First</option>
                    <option value="oldest">⏳ Oldest First</option>
                    <option value="priority">🔥 Hot Leads First</option>
                    <option value="callback">📞 Next Callback Due</option>
                    <option value="name">🔤 Name (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Filter Tabs: Horizontal Scroll on Mobile, Flex on Tablet/Desktop */}
          <div className="flex overflow-x-auto sm:flex-wrap gap-2 text-xs pt-1 pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => { setActiveTab('active'); setEnquiryPage(1); }}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer shrink-0 ${activeTab === 'active'
                ? 'bg-[#245348] text-white shadow-md'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100 border border-[#EAE6DF]'
                }`}
            >
              <span className="truncate">Active Queue</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${activeTab === 'active' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'bg-gray-200 text-gray-700'}`}>
                {activeQueueCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('callback'); setEnquiryPage(1); }}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer shrink-0 ${activeTab === 'callback'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-amber-50/80 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Callback</span>
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${activeTab === 'callback' ? 'bg-white text-amber-900 font-bold' : 'bg-amber-200 text-amber-900 font-bold'}`}>
                {callbackCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('leads'); setEnquiryPage(1); }}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer shrink-0 ${activeTab === 'leads'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
            >
              <span className="flex items-center gap-1.5 truncate">
                <Flame className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Leads</span>
              </span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${activeTab === 'leads' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'bg-emerald-200 text-emerald-900 font-bold'}`}>
                {leadsCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('all'); setEnquiryPage(1); }}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center justify-between sm:justify-start gap-1.5 cursor-pointer shrink-0 ${activeTab === 'all'
                ? 'bg-[#14221F] text-white shadow-md'
                : 'bg-[#FAF9F6] text-gray-700 hover:bg-gray-100 border border-[#EAE6DF]'
                }`}
            >
              <span className="truncate">All History</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${activeTab === 'all' ? 'bg-white/20 text-white font-bold' : 'bg-gray-200 text-gray-700'}`}>
                {allHistoryCount}
              </span>
            </button>
          </div>

          {/* Active Tab Explanation & Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-gray-600 bg-[#FAF9F6] px-3.5 py-2 rounded-xl border border-[#EAE6DF] gap-1 sm:gap-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-[#14221F] shrink-0">
                {activeTab === 'active' && '⏳ Active Queue:'}
                {activeTab === 'callback' && '📞 Callback Cadence:'}
                {activeTab === 'leads' && '🔥 Confirmed Leads:'}
                {activeTab === 'all' && '📋 All History:'}
              </span>
              <span className="truncate sm:whitespace-normal">
                {activeTab === 'active' && 'Fresh enquiries pending first call. After status assignment, records automatically move to Leads, Callback, or All History.'}
                {activeTab === 'callback' && 'Scheduled client callbacks and daily retry cadence for unanswered lines.'}
                {activeTab === 'leads' && 'Confirmed Hot Leads & interested prospects ready for site visits and closures.'}
                {activeTab === 'all' && 'Complete historical record of all enquiries, calls, and status updates.'}
              </span>
            </div>
            <span className="font-mono font-bold text-gray-700 shrink-0 self-end sm:self-auto">
              {sortedLeads.length} {sortedLeads.length === 1 ? 'Record' : 'Records'}
            </span>
          </div>

          {/* ── 1. Desktop Table (Matching Admin Portal) ── */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#14221F]/20 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14221F] text-[#DFBE79] uppercase font-mono text-[11px] tracking-wider border-b border-[#245348]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer Name & Contact</th>
                  <th className="py-3.5 px-4 font-bold">Locations Enquiry</th>
                  <th className="py-3.5 px-2 font-bold w-20 text-center">Device</th>
                  <th className="py-3.5 px-4 font-bold">Response Type</th>
                  <th className="py-3.5 px-4 font-bold">Call Status & Cadence</th>
                  <th className="py-3.5 px-4 font-bold">Logged Time</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`transition-colors duration-150 group ${isConfirmedLead(lead)
                      ? 'bg-[#EBF7EE] border-l-4 border-l-[#2E7D32] hover:bg-[#E2F3E6]'
                      : 'hover:bg-[#FAF8F5]'
                      }`}
                  >
                    {/* ID */}
                    <td className="py-3.5 px-4 text-gray-600 font-mono font-bold text-xs group-hover:text-black">
                      CON-{lead.id}
                    </td>

                    {/* Customer Name & Mobile */}
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <p className="font-bold text-[#14221F] text-sm group-hover:text-[#245348] transition-colors">
                          {lead.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono mt-0.5">
                          <span>{lead.mobile}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(lead.id, lead.mobile)}
                            className="text-gray-400 hover:text-emerald-700 transition-colors p-0.5 cursor-pointer"
                            title="Copy Phone Number"
                          >
                            {copiedLeadId === lead.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Locations Enquiry */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-[#14221F] text-xs">
                          {lead.locationName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {lead.projectName}
                        </p>
                      </div>
                    </td>

                    {/* Device Used */}
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF9F6] border border-[#EAE6DF] font-mono text-[10.5px] font-semibold text-gray-700">
                        {isDesktopDevice(lead.deviceName) || formatCompactDevice(lead.deviceName) === 'PC' || formatCompactDevice(lead.deviceName) === 'Mac' ? (
                          <Laptop className="w-3 h-3 text-[#C59B4E] shrink-0" />
                        ) : (
                          <Smartphone className="w-3 h-3 text-[#C59B4E] shrink-0" />
                        )}
                        <span>{formatCompactDevice(lead.deviceName)}</span>
                      </span>
                    </td>

                    {/* Response Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isConfirmedLead(lead) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {lead.statusCode === 1 ? (
                            <>
                              <Flame className="w-3 h-3 text-emerald-700" />
                              <span>Hot Lead</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Lead</span>
                            </>
                          )}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          lead.statusCode === 3 ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                              lead.statusCode === 6 ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                                'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}>
                          <span>{lead.callStatusCode === 0 ? 'New' : (lead.statusCode === 7 ? 'New' : lead.statusName)}</span>
                        </span>
                      )}
                    </td>

                    {/* Call Status & Cadence */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <p className="font-medium text-[#14221F]">
                          {lead.callStatusName}
                        </p>
                        {lead.statusCode === 4 && (
                          <span className="text-[11px] text-amber-800 font-medium block whitespace-nowrap">
                            Attempt {lead.retryCount || 1}/10 • Next: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled Today'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Action: 2 Buttons (1. Status & Notes, 2. Direct Call) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-2">
                        {/* 1st Button: Direct Call */}
                        <button
                          type="button"
                          onClick={() => handleStartCall(lead)}
                          className="h-9 px-3.5 rounded-xl bg-[#245348] text-white hover:bg-[#1B3F37] active:scale-95 transition-all text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                          title={`Direct Call to ${lead.name}`}
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
                          <span>Direct Call</span>
                        </button>

                        {/* 2nd Button: Status & Description */}
                        <button
                          type="button"
                          onClick={() => handleOpenDisposition(lead)}
                          className="h-9 px-3.5 rounded-xl bg-white border border-[#C59B4E] text-[#14221F] hover:bg-[#DFBE79]/20 active:scale-95 transition-all text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                          title="Update Status (Interested, Hot Lead, Not Picking, etc.) & Description Notes"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                          <span>Status & Notes</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedLeads.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      {activeTab === 'active' ? (
                        <div className="max-w-md mx-auto space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 shadow-xs">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-bold text-gray-900">Active Queue is Clear!</p>
                          <p className="text-xs text-gray-500">
                            All pending incoming enquiries have been called and assigned a status. New enquiries from the website will appear here automatically.
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => { setActiveTab('callback'); setEnquiryPage(1); }}
                              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                              Check Callbacks ({callbackCount})
                            </button>
                            <button
                              type="button"
                              onClick={() => { setActiveTab('leads'); setEnquiryPage(1); }}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              View Leads ({leadsCount})
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Users className="w-8 h-8 mx-auto text-gray-300" />
                          <p className="text-sm font-medium">No enquiry records found matching your filters.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── 2. Mobile & Tablet Cards Feed (Dedicated View Below 1024px) ── */}
          <div className="block lg:hidden space-y-3.5">
            {paginatedLeads.map((lead) => (
              <div
                key={lead.id}
                className={`rounded-xl border shadow-xs p-4 space-y-3.5 transition-all ${isConfirmedLead(lead)
                  ? 'bg-[#EBF7EE] border-[#A5D6A7] border-l-4 border-l-[#2E7D32]'
                  : 'bg-white border-[#EAE6DF] hover:border-[#245348]/40'
                  }`}
              >
                {/* Top Bar: ID + Response Type Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-[#FAF9F6] text-gray-700 border border-[#EAE6DF] whitespace-nowrap shrink-0">
                    CON-{lead.id}
                  </span>
                  {isConfirmedLead(lead) ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {lead.statusCode === 1 ? (
                        <>
                          <Flame className="w-3 h-3 text-emerald-700" />
                          <span>Hot Lead</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Lead</span>
                        </>
                      )}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      lead.statusCode === 3 ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          lead.statusCode === 6 ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                            'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                      <span>{lead.callStatusCode === 0 ? 'New' : (lead.statusCode === 7 ? 'New' : lead.statusName)}</span>
                    </span>
                  )}
                </div>

                {/* Customer Name & Phone */}
                <div>
                  <p className="font-bold text-[#14221F] text-base leading-snug">
                    {lead.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`tel:${lead.mobile.replace(/\s+/g, '')}`}
                      className="font-mono text-xs font-semibold text-[#245348] hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C59B4E]" />
                      <span>{lead.mobile}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(lead.id, lead.mobile)}
                      className="text-gray-400 hover:text-emerald-700 transition-colors p-1 cursor-pointer"
                      title="Copy Phone"
                    >
                      {copiedLeadId === lead.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Location & Project Details */}
                <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#EAE6DF] space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      LOCATION / PROJECT
                    </span>
                    <p className="font-bold text-[#14221F] text-xs mt-0.5">
                      {lead.locationName}
                    </p>
                    <p className="text-[11px] text-gray-600">
                      {lead.projectName}
                    </p>
                  </div>

                  <div className="border-t border-[#EAE6DF]/60 pt-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      DEVICE USED
                    </span>
                    <p className="font-semibold text-[#14221F] text-xs mt-0.5 flex items-center gap-1.5">
                      {isDesktopDevice(lead.deviceName) || formatCompactDevice(lead.deviceName) === 'PC' || formatCompactDevice(lead.deviceName) === 'Mac' ? (
                        <Laptop className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                      )}
                      <span>{lead.deviceName || 'Mobile Device'}</span>
                    </p>
                  </div>

                  <div className="border-t border-[#EAE6DF]/60 pt-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      CALL STATUS
                    </span>
                    <p className="font-semibold text-[#14221F] text-xs mt-0.5">
                      {lead.callStatusName}
                    </p>
                    {lead.statusCode === 4 && (
                      <span className="text-[11px] text-amber-800 font-medium block mt-0.5">
                        Attempt {lead.retryCount || 1}/10 • Next: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Scheduled Today'}
                      </span>
                    )}
                  </div>

                  <div className="border-t border-[#EAE6DF]/60 pt-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                      LOGGED TIME
                    </span>
                    <p className="font-mono text-gray-600 text-xs mt-0.5">
                      {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{', '}
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Latest Notes History (Excludes automated System Lead Router box) */}
                {(() => {
                  const callerNotes = (lead.notes || []).filter(
                    n => n.by !== "System Lead Router" &&
                         !n.txt?.includes("System Lead Router") &&
                         !n.txt?.includes("Auto-assigned") &&
                         !n.txt?.includes("New enquiry received")
                  );
                  if (callerNotes.length === 0) return null;
                  return (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <span className="font-bold text-[#245348]">{callerNotes[0].by}:</span> {callerNotes[0].txt}
                    </div>
                  );
                })()}

                {/* Equal-sized Action Buttons (Direct Call + Status & Notes) */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleStartCall(lead)}
                    className="h-10 px-2 rounded-xl bg-[#245348] text-white hover:bg-[#1B3F37] active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all whitespace-nowrap overflow-hidden"
                    title="Direct Call Customer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
                    <span className="truncate">Direct Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenDisposition(lead)}
                    className="h-10 px-2 rounded-xl bg-white border border-[#C59B4E] text-[#14221F] hover:bg-[#DFBE79]/20 active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all whitespace-nowrap overflow-hidden"
                    title="Update Status & Description"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                    <span className="truncate">Status & Notes</span>
                  </button>
                </div>
              </div>
            ))}

            {paginatedLeads.length === 0 && (
              <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-[#EAE6DF] p-6">
                {activeTab === 'active' ? (
                  <div className="max-w-sm mx-auto space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">Active Queue is Clear!</p>
                    <p className="text-xs text-gray-500">
                      All pending incoming enquiries have been called and assigned a status.
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setActiveTab('callback'); setEnquiryPage(1); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        Callbacks ({callbackCount})
                      </button>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('leads'); setEnquiryPage(1); }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        Leads ({leadsCount})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Users className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-sm font-medium">No enquiry records found matching your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 pt-3 gap-3 border-t border-[#EAE6DF]">
            <span className="text-center sm:text-left">
              Showing <strong>{sortedLeads.length > 0 ? (enquiryPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(enquiryPage * pageSize, sortedLeads.length)}</strong> of <strong>{sortedLeads.length}</strong> records
            </span>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 self-center sm:self-auto">
                <button
                  type="button"
                  onClick={() => setEnquiryPage(p => Math.max(1, p - 1))}
                  disabled={enquiryPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEnquiryPage(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${enquiryPage === num
                        ? 'bg-[#245348] text-white shadow-xs'
                        : 'bg-white border border-[#EAE6DF] hover:bg-[#FAF9F6] text-gray-700'
                        }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setEnquiryPage(p => Math.min(totalPages, p + 1))}
                  disabled={enquiryPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Status & Description Modal (Direct Call / Status Update) ── */}
        {callingLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-6 border border-[#245348]/30 anim-fade-scale my-auto relative max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="text-center relative pb-3 border-b border-[#EAE6DF] shrink-0">
                <button
                  type="button"
                  onClick={() => setCallingLead(null)}
                  className="absolute right-0 top-0 text-gray-400 hover:text-black p-1 text-base cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-[#245348] flex items-center justify-center mb-1 shadow-xs">
                  <FileText className="w-5 h-5 text-[#245348]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#14221F]">
                  Update Status & Description
                </h3>
                <p className="font-mono text-xs text-gray-700 mt-0.5">
                  {callingLead.name} • <a href={`tel:${callingLead.mobile}`} className="text-[#245348] font-bold underline hover:text-[#1B3F37]">{callingLead.mobile}</a>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-gray-500 mt-1">
                  <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#EAE6DF] font-mono font-bold whitespace-nowrap shrink-0">CON-{callingLead.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="font-medium text-gray-700 text-center">{callingLead.locationName} ({callingLead.projectName})</span>
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto space-y-3.5 py-3 pr-1 text-left">
                {dispositionError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{dispositionError}</span>
                  </div>
                )}

                {/* Status Selection Options with Scroll Feature */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-800 block">
                      Select Customer Status:
                      Select Customer Status <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Scrollable status options</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {selectedDisposition ? 'Status chosen' : 'Required • Choose status'}
                    </span>
                  </div>
                  <div className="max-h-44 sm:max-h-52 overflow-y-auto pr-1 rounded-xl border border-[#EAE6DF] p-2 bg-[#FAF9F6]/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { code: 1, label: "Hot Lead", desc: "High interest / urgent" },
                        { code: 2, label: "Lead (Interested)", desc: "Wants site visit / brochure" },
                        { code: 3, label: "Okay / Follow up", desc: "Deciding / callback" },
                        { code: 4, label: "Not Picking", desc: "Auto 4h/10d retry cadence" },
                        { code: 5, label: "Not Interested", desc: "Client declined" },
                        { code: 6, label: "Fake / Spam", desc: "Invalid enquiry" },
                      ].map(disp => (
                        <button
                          key={disp.code}
                          type="button"
                          onClick={() => {
                            setSelectedDisposition(disp.code);
                            setDispositionError('');
                          }}
                          className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${selectedDisposition === disp.code
                            ? 'bg-[#245348] text-white border-[#245348] shadow-xs ring-2 ring-[#DFBE79]'
                            : 'bg-white border-[#EAE6DF] text-gray-700 hover:border-[#245348]'
                            }`}
                        >
                          <div className="font-bold text-[11px] sm:text-xs">{disp.label}</div>
                          <div className={`text-[9px] sm:text-[10px] mt-0.5 ${selectedDisposition === disp.code ? 'text-gray-200' : 'text-gray-500'}`}>{disp.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Discussion Description & Remarks */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-800 font-semibold block">Discussion Description & Client Notes:</label>
                  <textarea
                    rows={3}
                    value={callerRemark}
                    onChange={(e) => setCallerRemark(e.target.value)}
                    placeholder="Enter client discussion summary, requirements, budget, feedback, preferred visit date/time, etc."
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl p-2.5 sm:p-3 text-xs text-[#14221F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pinned Action Buttons Footer */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-[#EAE6DF] shrink-0 mt-1">
                <button
                  type="button"
                  onClick={() => setCallingLead(null)}
                  className="flex-1 py-2 sm:py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFinishCall}
                  className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  SAVE & UPDATE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Feedback Toast Notification */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#14221F] text-[#DFBE79] px-4 py-3 rounded-xl shadow-2xl border border-[#C59B4E] flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-white">{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2 cursor-pointer"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── ADD NEW LEAD MODAL (Manual Entry by Caller) ── */}
        {showAddLeadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-5 sm:p-7 space-y-4 border border-[#245348]/30 my-auto anim-fade-scale">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#EAE6DF] pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#245348] text-[#DFBE79] flex items-center justify-center shadow-xs">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14221F]">
                      Add New Customer Lead
                    </h3>
                    <p className="text-xs text-gray-500 font-sans">
                      Register manual enquiry, offline phone call, or walk-in consultation
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-gray-400 hover:text-black p-1 text-base cursor-pointer rounded-lg hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Error Message */}
              {newLeadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                  {newLeadError}
                </div>
              )}

              <form onSubmit={handleCreateManualLead} className="space-y-4">
                {/* Row 1: Customer Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-xs font-mono font-bold text-gray-500">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newLeadMobile}
                        onChange={(e) => setNewLeadMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98200 12345"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl pl-11 pr-3 py-2 text-xs font-mono text-[#14221F] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Email & Assigned Caller (Auto assigned to logged in caller) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={newLeadEmail}
                      onChange={(e) => setNewLeadEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Assigned Caller
                    </label>
                    <div className="w-full bg-gray-100 border border-[#EAE6DF] rounded-xl px-3 py-2 text-xs text-[#14221F] font-semibold flex items-center justify-between">
                      <span>{currentUser?.name || "Caller"}</span>
                      <span className="text-[10px] text-[#245348] font-mono font-bold bg-[#FAF9F6] px-2 py-0.5 rounded border border-[#EAE6DF]">
                        {currentUser?.callerCode || "CALLER"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 3: Location Enquiry & Project */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Location Enquiry <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newLeadLocation}
                      onChange={(e) => setNewLeadLocation(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                    >
                      {Object.entries(LOCATION_CODES).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-800">
                      Project Interested <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newLeadProject}
                      onChange={(e) => setNewLeadProject(Number(e.target.value))}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                    >
                      {Object.entries(PROJECT_CODES).map(([code, name]) => (
                        <option key={code} value={code}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 4: Response Type / Lead Rating */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-gray-800 block">
                      Response Type / Rating:
                    </label>
                    <span className="text-[10px] text-gray-400 font-medium">Scrollable status options</span>
                  </div>
                  <div className="max-h-40 sm:max-h-48 overflow-y-auto pr-1 rounded-xl border border-[#EAE6DF] p-2 bg-[#FAF9F6]/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { code: 1, label: "Hot Lead", desc: "High interest / urgent" },
                        { code: 2, label: "Lead (Interested)", desc: "Wants site visit / brochure" },
                        { code: 3, label: "Okay / Follow up", desc: "Deciding / callback" },
                        { code: 4, label: "Not Picking", desc: "Auto 4h/10d retry cadence" },
                        { code: 5, label: "Not Interested", desc: "Client declined" },
                        { code: 6, label: "Fake / Spam", desc: "Invalid enquiry" },
                      ].map(disp => (
                        <button
                          key={disp.code}
                          type="button"
                          onClick={() => setNewLeadStatus(disp.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${newLeadStatus === disp.code
                            ? 'bg-[#245348] text-white border-[#245348] shadow-xs ring-2 ring-[#DFBE79]'
                            : 'bg-white border-[#EAE6DF] text-gray-700 hover:border-[#245348]'
                            }`}
                        >
                          <div className="font-bold text-xs">{disp.label}</div>
                          <div className={`text-[10px] mt-0.5 ${newLeadStatus === disp.code ? 'text-gray-200' : 'text-gray-500'}`}>{disp.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 5: Call Status & Cadence */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-800">
                    Call Status & Cadence:
                  </label>
                  <select
                    value={newLeadCallStatus}
                    onChange={(e) => setNewLeadCallStatus(Number(e.target.value))}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                  >
                    <option value={1}>Connected & Discussed</option>
                    <option value={6}>Call Back Scheduled</option>
                    <option value={0}>Uncalled (Fresh Entry)</option>
                    <option value={2}>Not Answered (Pending Retry)</option>
                    <option value={7}>Line Busy (Pending Retry)</option>
                  </select>
                </div>

                {/* Row 6: Discussion Description & Client Notes */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-800 font-semibold">
                    Discussion Description & Client Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={newLeadNotes}
                    onChange={(e) => setNewLeadNotes(e.target.value)}
                    placeholder="Enter offline discussion summary, budget, preferred configuration (e.g. 3 BHK Sea View), visit timing, etc."
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl p-3 text-xs text-[#14221F] focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLeadModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#DFBE79]" />
                    <span>Save & Register Lead</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
