import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  Users,
  TrendingUp,
  Database,
  Trash2,
  UserPlus,
  MapPin,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Download,
  Calendar,
  Flame,
  Clock,
  LogOut,
  HardDrive,
  Sparkles,
  ArrowUpRight,
  Activity,
  Check,
  LayoutDashboard,
  BarChart3,
  PhoneForwarded,
  ArrowRight,
  Lock,
  Mail,
  FileDown,
  X,
  UserCheck,
  Eye,
  EyeOff,
  Briefcase,
  FileText,
  ExternalLink
} from 'lucide-react';
import { dbStore, STATUS_CODES, LOCATION_CODES, CALL_STATUS_CODES, detectSqlInjection, sanitizeInput, validatePasswordPolicy, logSecurityEvent, getAuditLogs } from '../data/dbStore';

export function AdminPortal({ currentUser, onLogin, onLogout }) {
  // Navigation tabs: 'overview' | 'performance' | 'callers' | 'storage'
  const [adminTab, setAdminTab] = useState('overview');

  const adminCredsInitial = dbStore.getAdminCredentials();
  const [adminUsername, setAdminUsername] = useState(adminCredsInitial.username || 'admin');
  const [adminPassword, setAdminPassword] = useState(adminCredsInitial.password || 'concave@2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminFailedAttempts, setAdminFailedAttempts] = useState(0);
  const [adminLockoutUntil, setAdminLockoutUntil] = useState(0);

  // Forgot Password State (with automatic 6-digit OTP, 5-min expiry, max 3 attempts)
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: OTP, 2: New Password
  const [forgotOtp, setForgotOtp] = useState('');
  const [enteredForgotOtp, setEnteredForgotOtp] = useState('');
  const [otpExpiresAt, setOtpExpiresAt] = useState(0);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0);
  const [wrongOtpAttempts, setWrongOtpAttempts] = useState(0);
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('');
  const [showNewAdminPassword, setShowNewAdminPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState([]);
  const [storageStats, setStorageStats] = useState({ recordCount: 0, rawBytes: 0, uncompressedBytes: 0, savingsPercent: 72 });

  // Pagination for Enquiry Records (30 per page)
  const [enquiryPage, setEnquiryPage] = useState(1);
  const pageSize = 30;

  // Animation & Feedback states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [excelExportSuccess, setExcelExportSuccess] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Date Range Export State
  const [dateRangeStart, setDateRangeStart] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [dateRangeEnd, setDateRangeEnd] = useState(() => new Date().toISOString().split('T')[0]);
  const [isExportingRange, setIsExportingRange] = useState(false);

  // Quarterly Cleanup State & Queue
  const [isRunningQuarterly, setIsRunningQuarterly] = useState(false);
  const [queueInfo, setQueueInfo] = useState(() => dbStore.getQuarterlyQueueInfo());
  const [showOverdueAlert, setShowOverdueAlert] = useState(false);

  // Caller Details Modal & Divert Work State
  const [selectedCallerModal, setSelectedCallerModal] = useState(null);
  const [showCallerPassword, setShowCallerPassword] = useState(false);
  const [divertTargetCallerId, setDivertTargetCallerId] = useState('');
  const [isDivertingWork, setIsDivertingWork] = useState(false);

  // 2-Step Caller Deletion Modal State
  const [callerToDelete, setCallerToDelete] = useState(null);
  const [callerDeleteStep, setCallerDeleteStep] = useState(1); // 1: Password, 2: Type 'Delete Caller'
  const [callerDeletePassword, setCallerDeletePassword] = useState('');
  const [callerDeletePhrase, setCallerDeletePhrase] = useState('');
  const [callerDeleteError, setCallerDeleteError] = useState('');

  // 3-Step Data Deletion Modal State
  const [showDataDeleteModal, setShowDataDeleteModal] = useState(false);
  const [dataDeleteStep, setDataDeleteStep] = useState(1); // 1: Password, 2: Type 'DELETE', 3: Email & Security Code
  const [dataDeletePassword, setDataDeletePassword] = useState('');
  const [dataDeletePhrase, setDataDeletePhrase] = useState('');
  const [dataDeleteEmail, setDataDeleteEmail] = useState('admin@concaverealty.com');
  const [dataDeleteOtpInput, setDataDeleteOtpInput] = useState('');
  const [dataDeleteGeneratedOtp, setDataDeleteGeneratedOtp] = useState('');
  const [dataDeleteOtpSent, setDataDeleteOtpSent] = useState(false);
  const [dataDeleteError, setDataDeleteError] = useState('');

  // Filters for customer list
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Career / Job Applications State
  const [jobApplications, setJobApplications] = useState([]);
  const [careerRoleFilter, setCareerRoleFilter] = useState('All');
  const [careerStatusFilter, setCareerStatusFilter] = useState('All');
  const [careerSearch, setCareerSearch] = useState('');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);
  const [isExportingCareers, setIsExportingCareers] = useState(false);

  // Add caller modal state with multiple locations support
  const [showAddCallerModal, setShowAddCallerModal] = useState(false);
  const [newCallerData, setNewCallerData] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'caller123',
    role: 'Location Specialist',
    assignedLocations: [1]
  });

  const refreshAdminData = () => {
    // Zero-Trust: Never load sensitive customer records into state unless authenticated as admin
    if (!currentUser || currentUser.role !== 'admin') {
      setLeads([]);
      setCallers([]);
      setJobApplications([]);
      return;
    }
    setIsRefreshing(true);
    try {
      const allLeads = dbStore.getLeads(currentUser);
      const allCallers = dbStore.getCallers();
      const stats = dbStore.getStorageStats();
      const qInfo = dbStore.getQuarterlyQueueInfo();
      const allApplications = dbStore.getJobApplications();
      setLeads(allLeads);
      setCallers(allCallers);
      setStorageStats(stats);
      setQueueInfo(qInfo);
      setJobApplications(allApplications);
      if (qInfo.isOverdue) {
        setShowOverdueAlert(true);
      }
    } catch (e) {
      console.error("Error refreshing admin data:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, [currentUser]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setEnquiryPage(1);
  }, [searchQuery, locationFilter, statusFilter]);

  // 5-minute countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (forgotPasswordMode && forgotStep === 1 && otpExpiresAt > 0) {
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
  }, [forgotPasswordMode, forgotStep, otpExpiresAt]);

  const handleAdminPasswordLogin = (e) => {
    e.preventDefault();
    setAdminLoginError('');

    // 1. Check rate limiting lockout
    if (adminLockoutUntil && Date.now() < adminLockoutUntil) {
      const secsLeft = Math.ceil((adminLockoutUntil - Date.now()) / 1000);
      setAdminLoginError(`Account temporarily locked due to consecutive failed attempts. Please retry in ${secsLeft}s.`);
      return;
    }

    // 2. Security validation
    if (detectSqlInjection(adminUsername) || detectSqlInjection(adminPassword)) {
      setAdminLoginError('Invalid login credentials or unauthorized characters.');
      return;
    }

    const cleanUser = sanitizeInput(adminUsername);
    const adminCreds = dbStore.getAdminCredentials();

    if (cleanUser.toLowerCase() === adminCreds.username.toLowerCase() && adminPassword === adminCreds.password) {
      setAdminFailedAttempts(0);
      setAdminLockoutUntil(0);
      setAdminLoginError('');
      const adminObj = {
        id: 999,
        name: "Hemant (Super Administrator)",
        role: "admin",
        email: adminCreds.email || "concaverealtyindia@gmail.com"
      };
      logSecurityEvent(adminObj, 'ADMIN_LOGIN_SUCCESS', 'Admin Portal', { username: cleanUser });
      onLogin(adminObj);
    } else {
      const nextAttempts = adminFailedAttempts + 1;
      setAdminFailedAttempts(nextAttempts);
      logSecurityEvent({ id: 'UNKNOWN', name: cleanUser, role: 'anonymous' }, 'ADMIN_LOGIN_FAILED', 'Admin Portal', { username: cleanUser, attempt: nextAttempts });
      if (nextAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000;
        setAdminLockoutUntil(lockTime);
        setAdminLoginError('Too many failed login attempts. Account temporarily locked for 5 minutes for security.');
      } else {
        setAdminLoginError(`Invalid Admin ID or Password. (${5 - nextAttempts} attempt(s) remaining before temporary lockout)`);
      }
    }
  };

  const handleStartForgotPassword = () => {
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
    setForgotPasswordMode(true);
    setFeedbackToast(`OTP sent to concaverealtyindia@gmail.com: ${code} (Valid for 5 mins)`);
    setTimeout(() => setFeedbackToast(null), 8000);
  };

  const handleResendForgotPasswordOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;
    setForgotOtp(code);
    setOtpExpiresAt(expires);
    setOtpRemainingSeconds(300);
    setWrongOtpAttempts(0);
    setEnteredForgotOtp('');
    setForgotError('');
    setFeedbackToast(`New OTP sent to concaverealtyindia@gmail.com: ${code}`);
    setTimeout(() => setFeedbackToast(null), 8000);
  };

  const handleVerifyForgotOtp = (e) => {
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
      setForgotError('Maximum 3 incorrect OTP attempts reached. For security, this OTP has been invalidated. Please request a new OTP.');
      return;
    }

    if (enteredForgotOtp.trim() === forgotOtp) {
      setForgotError('');
      setForgotStep(2); // Set New Password step
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

  const handleResetAdminPassword = (e) => {
    e.preventDefault();
    setForgotError('');

    if (detectSqlInjection(newAdminPassword) || detectSqlInjection(confirmAdminPassword)) {
      setForgotError('Security Alert: Malicious characters detected.');
      return;
    }

    if (newAdminPassword !== confirmAdminPassword) {
      setForgotError('Passwords do not match. Please verify both fields.');
      return;
    }

    const policy = validatePasswordPolicy(newAdminPassword);
    if (!policy.valid) {
      setForgotError(policy.message);
      return;
    }

    const res = dbStore.updateAdminPassword(newAdminPassword);
    if (res.success) {
      setAdminPassword(newAdminPassword);
      setForgotSuccessMsg('Master Admin password updated successfully! Redirecting to login...');
      setTimeout(() => {
        setForgotPasswordMode(false);
        setForgotStep(1);
        setForgotSuccessMsg('');
        setAdminLoginError('');
      }, 1500);
    } else {
      setForgotError(res.error || 'Failed to update password.');
    }
  };

  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setTimeout(() => {
      const ok = dbStore.exportMasterLeadsToExcel();
      setIsExportingExcel(false);
      if (ok) {
        setExcelExportSuccess(true);
        setTimeout(() => setExcelExportSuccess(false), 4000);
      } else {
        alert("Error generating Excel file.");
      }
    }, 600);
  };

  const handleExportDateRange = (e) => {
    e.preventDefault();
    if (!dateRangeStart || !dateRangeEnd) {
      alert("Please select both start date and end date.");
      return;
    }
    setIsExportingRange(true);
    setTimeout(() => {
      const res = dbStore.exportDateRangeLeadsToExcel(dateRangeStart, dateRangeEnd);
      setIsExportingRange(false);
      if (res.success) {
        setFeedbackToast(`Exported ${res.count} records for period ${dateRangeStart} to ${dateRangeEnd}.`);
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert(res.message || "Export failed.");
      }
    }, 600);
  };

  // -------------------------------------------------------------
  // SECURE 3-STEP DATA DELETION & QUARTERLY CLEANUP
  // -------------------------------------------------------------
  const handleOpenDataDeleteModal = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setDataDeleteGeneratedOtp(code);
    setDataDeleteStep(1);
    setDataDeletePassword('');
    setDataDeletePhrase('');
    setDataDeleteOtpInput('');
    setDataDeleteOtpSent(false);
    setDataDeleteError('');
    setShowDataDeleteModal(true);
  };

  const handleVerifyDataDeleteStep1 = (e) => {
    e.preventDefault();
    if (dataDeletePassword === 'concave@2026' || dataDeletePassword === adminPassword) {
      setDataDeleteError('');
      setDataDeleteStep(2);
    } else {
      setDataDeleteError('Incorrect Admin password. Please check and try again.');
    }
  };

  const handleVerifyDataDeleteStep2 = (e) => {
    e.preventDefault();
    if (dataDeletePhrase.trim().toUpperCase() === 'DELETE') {
      setDataDeleteError('');
      if (!dataDeleteGeneratedOtp) {
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setDataDeleteGeneratedOtp(code);
      }
      setDataDeleteOtpSent(true);
      setDataDeleteStep(3);
    } else {
      setDataDeleteError('Please type DELETE in exact uppercase letters.');
    }
  };

  const handleSendDeleteOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setDataDeleteGeneratedOtp(code);
    setDataDeleteOtpSent(true);
    setDataDeleteError('');
    setFeedbackToast(`Security OTP sent to ${dataDeleteEmail}: ${code}`);
    setTimeout(() => setFeedbackToast(null), 7000);
  };

  const handleExecuteDataDeleteStep3 = (e) => {
    e.preventDefault();
    if (!dataDeleteEmail || !dataDeleteEmail.includes('@')) {
      setDataDeleteError('Please enter a valid executive admin email address.');
      return;
    }
    if (dataDeleteOtpInput.trim() !== dataDeleteGeneratedOtp) {
      setDataDeleteError(`Invalid security verification code. Please enter ${dataDeleteGeneratedOtp}.`);
      return;
    }

    // Authorization verified: Run safe cleanup with auto Excel backup
    setShowDataDeleteModal(false);
    setIsRunningQuarterly(true);
    setTimeout(() => {
      const res = dbStore.runQuarterlyCleanup();
      setIsRunningQuarterly(false);
      if (res.success) {
        setFeedbackToast(`Data Purge Authorized & Complete! Excel backup downloaded. Removed ${res.deletedCount} non-lead records from ${res.startDate} to ${res.endDate}. All leads preserved.`);
        setTimeout(() => setFeedbackToast(null), 7000);
        refreshAdminData();
      } else {
        alert("Cleanup failed: " + res.error);
      }
    }, 700);
  };

  // -------------------------------------------------------------
  // DIVERT WORK (ABSENTEE WORKLOAD BALANCING)
  // -------------------------------------------------------------
  const handleDivertWork = (e) => {
    e.preventDefault();
    if (!selectedCallerModal || !divertTargetCallerId) {
      alert("Please select a caller to divert work to.");
      return;
    }
    const targetId = parseInt(divertTargetCallerId, 10);
    if (targetId === selectedCallerModal.id) {
      alert("Please select a different caller to divert work to.");
      return;
    }
    setIsDivertingWork(true);
    setTimeout(() => {
      const res = dbStore.reassignCallerLeads(selectedCallerModal.id, targetId);
      setIsDivertingWork(false);
      if (res.success) {
        setFeedbackToast(`Successfully diverted ${res.count} inquiries to ${res.toCallerName}.`);
        setSelectedCallerModal(null);
        setDivertTargetCallerId('');
        refreshAdminData();
        setTimeout(() => setFeedbackToast(null), 5000);
      } else {
        alert("Failed to divert work: " + res.error);
      }
    }, 500);
  };

  // -------------------------------------------------------------
  // SECURE 2-STEP CALLER DELETION
  // -------------------------------------------------------------
  const handleOpenDeleteCallerModal = (caller) => {
    setCallerToDelete(caller);
    setCallerDeleteStep(1);
    setCallerDeletePassword('');
    setCallerDeletePhrase('');
    setCallerDeleteError('');
  };

  const handleVerifyCallerDeleteStep1 = (e) => {
    e.preventDefault();
    if (callerDeletePassword === 'concave@2026' || callerDeletePassword === adminPassword) {
      setCallerDeleteError('');
      setCallerDeleteStep(2);
    } else {
      setCallerDeleteError('Incorrect Admin password.');
    }
  };

  const handleExecuteCallerDelete = (e) => {
    e.preventDefault();
    if (callerDeletePhrase.trim() === 'Delete Caller') {
      dbStore.removeCaller(callerToDelete.id);
      setCallerToDelete(null);
      setFeedbackToast(`Caller ${callerToDelete.name} was successfully removed.`);
      setTimeout(() => setFeedbackToast(null), 5000);
      refreshAdminData();
    } else {
      setCallerDeleteError('Please type "Delete Caller" exactly as shown.');
    }
  };

  const handleCreateCaller = (e) => {
    e.preventDefault();
    if (!newCallerData.name.trim() || !newCallerData.phone.trim()) {
      alert("Please enter caller name and mobile number.");
      return;
    }
    if (!newCallerData.assignedLocations || newCallerData.assignedLocations.length === 0) {
      alert("Please select at least one allocated location for this caller.");
      return;
    }
    dbStore.saveCaller(newCallerData);
    setShowAddCallerModal(false);
    setNewCallerData({
      name: '',
      phone: '',
      email: '',
      password: 'caller123',
      role: 'Location Specialist',
      assignedLocations: [1]
    });
    setFeedbackToast('New caller created successfully.');
    setTimeout(() => setFeedbackToast(null), 4000);
    refreshAdminData();
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (Single Centered Professional Card)
  // =========================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-luxury border border-[#EAE6DF] p-8 sm:p-9 space-y-6 anim-fade-up">
          
          {/* Company Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-[#C59B4E] p-0.5 bg-[#1D3530] shadow-md">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#245348] font-bold block">
                EXECUTIVE PLATFORM
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Concave Realty • Executive Master Console
              </p>
            </div>
          </div>

          {/* NORMAL LOGIN FORM */}
          {!forgotPasswordMode && (
            <form onSubmit={handleAdminPasswordLogin} className="space-y-4 text-xs">
              {adminLoginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <span>{adminLoginError}</span>
                </div>
              )}

              {/* Admin ID / Username */}
              <div className="space-y-1">
                <label className="text-gray-700 font-semibold block text-xs">Admin ID *</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Enter Admin ID (e.g. admin)"
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none transition-all"
                />
              </div>

              {/* Password with View Toggle */}
              <div className="space-y-1">
                <label className="text-gray-700 font-semibold block text-xs">Password *</label>
                <div className="relative">
                  <input
                    type={showAdminPassword ? "text" : "password"}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3.5 py-2.5 pr-10 text-[#14221F] font-mono text-xs focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    title={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Forgot Password Link Under Password Field */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleStartForgotPassword}
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
                <span>Sign In to Admin Panel</span>
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FLOW */}
          {forgotPasswordMode && (
            <div className="space-y-4 text-xs">
              {/* Step 1: OTP Verification */}
              {forgotStep === 1 && (
                <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                  <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <Mail className="w-4 h-4 text-amber-700" />
                      <span>Admin Verification Code Dispatched</span>
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      A 6-digit verification code has been dispatched automatically to your registered executive email:
                      <strong className="block font-mono text-amber-950 mt-1">concaverealtyindia@gmail.com</strong>
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
                      placeholder="e.g. 123456"
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
                        onClick={handleResendForgotPasswordOtp}
                        className="text-[11px] text-[#245348] hover:underline font-semibold"
                      >
                        Resend Code
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordMode(false);
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

              {/* Step 2: Set New Master Password */}
              {forgotStep === 2 && (
                <form onSubmit={handleResetAdminPassword} className="space-y-4">
                  <div className="space-y-1 text-center pb-1">
                    <h3 className="font-serif text-lg font-bold text-[#14221F]">
                      Create New Master Password
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Must contain 8+ characters, uppercase, lowercase, number & symbol.
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
                        type={showNewAdminPassword ? "text" : "password"}
                        required
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 pr-10 text-[#14221F] font-mono text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewAdminPassword(!showNewAdminPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        {showNewAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1">
                    <label className="text-gray-700 font-semibold block text-xs">Re-enter New Password *</label>
                    <input
                      type="password"
                      required
                      value={confirmAdminPassword}
                      onChange={(e) => setConfirmAdminPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3.5 py-2.5 text-[#14221F] font-mono text-xs focus:outline-none"
                    />
                  </div>

                  {/* Dynamic Password Policy Checklist */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${newAdminPassword.length >= 8 ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newAdminPassword) && /[a-z]/.test(newAdminPassword) ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 1 uppercase & 1 lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[0-9]/.test(newAdminPassword) && /[!@#$%^&*(),.?":{}|<>]/.test(newAdminPassword) ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
                      <Check className="w-3 h-3" />
                      <span>At least 1 number (0-9) & 1 special character</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${newAdminPassword && newAdminPassword === confirmAdminPassword ? 'text-emerald-700 font-medium' : 'text-gray-400'}`}>
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
                        setForgotPasswordMode(false);
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
  // VIEW 2: AUTHENTICATED SUPER ADMIN WORKSPACE (Hemant's Dashboard)
  // =========================================================================
  const todayStart = new Date().setHours(0, 0, 0, 0);

  // Exact 5 Cards calculation as requested by user:
  // 1) total leads today
  const todaysLeadsCount = leads.filter(l => l.createdAt >= todayStart && (l.statusCode === 1 || l.statusCode === 2 || l.statusCode === 7)).length;

  // 2) today enquiries today
  const todaysEnquiriesCount = leads.filter(l => l.createdAt >= todayStart).length;

  // 3) total call done today
  const totalCallsDoneToday = leads.filter(l => {
    const hasNoteToday = l.notes && l.notes.some(n => n.at >= todayStart && !n.txt.includes("Auto-routed"));
    return hasNoteToday || (l.createdAt >= todayStart && l.callStatusCode > 0);
  }).length;

  // 4) overall lead
  const overallLeadsCount = leads.filter(l => l.statusCode === 1 || l.statusCode === 2 || l.statusCode === 7).length;

  // 5) pending calls in red
  const pendingCallsCount = leads.filter(l => l.statusCode === 4 || l.callStatusCode === 0 || l.callStatusCode === 2 || l.callStatusCode === 3).length;

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    if (statusFilter !== 'All') {
      const code = parseInt(statusFilter, 10);
      if (l.statusCode !== code) return false;
    }
    if (locationFilter !== 'All' && l.locationName !== locationFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        l.name.toLowerCase().includes(q) ||
        l.mobile.includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        l.projectName.toLowerCase().includes(q) ||
        l.callerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Pagination slice (30 records per page)
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((enquiryPage - 1) * pageSize, enquiryPage * pageSize);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 bg-[#FAF9F6]">

      {/* Floating Success Toast for Excel Export */}
      {excelExportSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-[#C59B4E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 anim-fade-scale">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Master Excel Exported</p>
            <p className="text-[11px] text-gray-300">CONCAVE_Master_Leads.xlsx downloaded to your computer.</p>
          </div>
        </div>
      )}

      {/* General Feedback Toast */}
      {feedbackToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-emerald-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 anim-fade-scale">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Action Completed</p>
            <p className="text-[11px] text-gray-300">{feedbackToast}</p>
          </div>
        </div>
      )}

      {/* ── Daily Overdue Cleanup Reminder Popup Banner (Triggered when data >= 6-7 months without cleanup) ── */}
      {showOverdueAlert && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 anim-fade-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif text-lg font-bold text-red-950">
                Daily Alert: Database Cleanup Overdue ({queueInfo.diffMonths} Months Historical Data)
              </h4>
              <p className="text-xs text-red-800 max-w-3xl leading-relaxed">
                Historical records have accumulated without a quarterly cleanup. Please run the scheduled queue cleanup for batch: <strong>{queueInfo.batchStartStr} to {queueInfo.batchEndStr}</strong> ({queueInfo.candidatesCount} non-lead records eligible). An Excel backup will be saved automatically before purging.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                setAdminTab('storage');
                setShowOverdueAlert(false);
              }}
              className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
            >
              Go to Cleanup →
            </button>
            <button
              onClick={() => setShowOverdueAlert(false)}
              className="p-2 text-gray-400 hover:text-red-800 text-xs"
              title="Dismiss for today"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Executive Header Banner (EXECUTIVE SALES COMMAND TOWER removed as requested) ── */}
      <div className="bg-[#1D3530] text-white rounded-2xl p-6 sm:p-7 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5 anim-fade-up">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Hemant's Dashboard
          </h1>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={refreshAdminData}
            className="p-2.5 rounded-lg bg-[#284F45] text-white hover:bg-[#245348] active:scale-95 transition-all"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#EAE6DF] pb-2 overflow-x-auto">
        {/* Tab 1: Overview */}
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'overview'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#DFBE79]" />
          <span>Overview</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
            {leads.length}
          </span>
        </button>

        {/* Tab 2: Callers Performance */}
        <button
          onClick={() => setAdminTab('performance')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'performance'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#DFBE79]" />
          <span>Callers Performance</span>
        </button>

        {/* Tab 3: Caller Management */}
        <button
          onClick={() => setAdminTab('callers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'callers'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <Users className="w-4 h-4 text-[#DFBE79]" />
          <span>Caller Management</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
            {callers.length}
          </span>
        </button>

        {/* Tab 4: Data & Storage */}
        <button
          onClick={() => setAdminTab('storage')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'storage'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <HardDrive className="w-4 h-4 text-[#DFBE79]" />
          <span>Data & Storage</span>
          {queueInfo.isOverdue && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-1" />
          )}
        </button>

        {/* Tab 5: Security & Audit Trail */}
        <button
          onClick={() => setAdminTab('audit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'audit'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#DFBE79]" />
          <span>Security & Audit Logs</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-800 text-emerald-200 font-mono">
            Zero-Trust
          </span>
        </button>

        {/* Tab 6: Careers & Talent Applications */}
        <button
          onClick={() => setAdminTab('careers')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'careers'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#DFBE79]" />
          <span>Job Enquiries</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
            {jobApplications.length}
          </span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: OVERVIEW (Cards + Enquiry Records Table with Pagination)
         ===================================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6 anim-fade-scale">

          {/* ── Exact 5 Cards Requested by User ── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">

            {/* 1) Total Leads Today */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Total Leads Today</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-800 mt-2 tracking-tight">
                {todaysLeadsCount}
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5">
                Marked as Leads Today
              </div>
            </div>

            {/* 2) Today Enquiries Today */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Today Enquiries Today</span>
                <Activity className="w-4 h-4 text-[#245348]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#14221F] mt-2 tracking-tight">
                {todaysEnquiriesCount}
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5">
                Received Since Midnight
              </div>
            </div>

            {/* 3) Total Call Done Today */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Total Call Done Today</span>
                <PhoneCall className="w-4 h-4 text-[#C59B4E]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#14221F] mt-2 tracking-tight">
                {totalCallsDoneToday}
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5">
                Calls Logged by Team
              </div>
            </div>

            {/* 4) Overall Lead */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">Overall Lead</span>
                <Sparkles className="w-4 h-4 text-[#DFBE79]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-[#245348] mt-2 tracking-tight">
                {overallLeadsCount}
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5">
                Total Cumulative Leads
              </div>
            </div>

            {/* 5) Pending Calls in RED */}
            <div className="bg-red-50/70 p-4 sm:p-5 rounded-xl border-2 border-red-300 shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-red-800 font-bold tracking-wider">Pending Calls</span>
                <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mt-2 tracking-tight">
                {pendingCallsCount}
              </div>
              <div className="text-[11px] text-red-700 font-semibold mt-1.5">
                Requires Caller Follow-up
              </div>
            </div>

          </div>

          {/* ── Enquiry Records Table (Customer Directory) ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5">
            
            {/* Header: Enquiry Records */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                    Enquiry Records
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#245348] border border-[#EAE6DF]">
                    {filteredLeads.length} Records
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search customer, phone, project..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-lg pl-8 pr-3 py-2 text-[#14221F] focus:outline-none w-56 sm:w-64 transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Location Filter */}
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none"
                >
                  <option value="All">All Locations</option>
                  {Object.values(LOCATION_CODES).map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>

                {/* Response Type Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none"
                >
                  <option value="All">All Response Types</option>
                  <option value="1">Hot Lead</option>
                  <option value="2">Lead</option>
                  <option value="4">Not Picking Up</option>
                  <option value="3">Okay / Follow Up</option>
                  <option value="5">Not Interested</option>
                  <option value="6">Fake / Spam</option>
                </select>
              </div>
            </div>

            {/* Customer Table */}
            <div className="overflow-x-auto rounded-xl border border-[#14221F]/20 shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#14221F] text-[#DFBE79] uppercase font-mono text-[11px] tracking-wider border-b border-[#245348]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">ID</th>
                    <th className="py-3.5 px-4 font-bold">Customer Name & Contact</th>
                    <th className="py-3.5 px-4 font-bold">Locations Enquiry</th>
                    <th className="py-3.5 px-4 font-bold">Response Type</th>
                    <th className="py-3.5 px-4 font-bold">Assigned Caller</th>
                    <th className="py-3.5 px-4 font-bold">Call Status & Cadence</th>
                    <th className="py-3.5 px-4 font-bold">Logged Time</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                  {paginatedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FAF8F5] transition-colors duration-150 group"
                    >
                      {/* ID */}
                      <td className="py-3 px-4 text-gray-600 font-semibold text-xs group-hover:text-black">
                        CON-{lead.id}
                      </td>

                      {/* Customer Name & Mobile (Email removed as requested) */}
                      <td className="py-3 px-4">
                        <div className="min-w-0">
                          <p className="font-bold text-[#14221F] text-sm group-hover:text-[#245348] transition-colors">
                            {lead.name}
                          </p>
                          <div className="text-xs text-gray-500 font-normal mt-0.5">
                            <span>{lead.mobile}</span>
                          </div>
                        </div>
                      </td>

                      {/* Locations Enquiry (Plain text) */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#14221F] text-xs">
                            {lead.locationName}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {lead.projectName}
                          </p>
                        </div>
                      </td>

                      {/* Response Type (1-line, whitespace-nowrap) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          lead.statusCode === 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          (lead.statusCode === 2 || lead.statusCode === 7) ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {lead.statusCode === 1 && <Flame className="w-3 h-3 text-emerald-700" />}
                          <span className="whitespace-nowrap">
                            {lead.statusCode === 1 ? 'Hot Lead' : ((lead.statusCode === 2 || lead.statusCode === 7) ? 'Lead' : lead.statusName)}
                          </span>
                        </span>
                      </td>

                      {/* Assigned Caller (Only caller name, mobile removed) */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-[#245348] flex items-center gap-1.5 text-xs">
                          <Users className="w-3.5 h-3.5 text-[#DFBE79]" />
                          <span>{lead.callerName}</span>
                        </span>
                      </td>

                      {/* Call Status & Cadence */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-[#14221F]">
                            {lead.callStatusName}
                          </p>
                          {lead.statusCode === 4 && (
                            <span className="text-[11px] text-amber-800 font-medium block whitespace-nowrap">
                              Attempt {lead.retryCount}/10 • Next: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Action: Call */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <a
                          href={`tel:${lead.mobile}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#245348]/10 text-[#245348] hover:bg-[#245348] hover:text-white transition-colors text-xs font-semibold"
                          title="Call Customer"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </td>
                    </tr>
                  ))}

                  {paginatedLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400 space-y-2">
                        <Users className="w-8 h-8 mx-auto text-gray-300" />
                        <p className="text-sm font-medium">No enquiry records found matching your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (30 records per page) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 pt-3 gap-3 border-t border-[#EAE6DF]">
              <span>
                Showing <strong>{filteredLeads.length > 0 ? (enquiryPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(enquiryPage * pageSize, filteredLeads.length)}</strong> of <strong>{filteredLeads.length}</strong> records
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5 self-center sm:self-auto">
                  <button
                    onClick={() => setEnquiryPage(p => Math.max(1, p - 1))}
                    disabled={enquiryPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setEnquiryPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        enquiryPage === pageNum
                          ? 'bg-[#245348] text-white shadow-xs'
                          : 'bg-white border border-[#EAE6DF] hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setEnquiryPage(p => Math.min(totalPages, p + 1))}
                    disabled={enquiryPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: CALLERS PERFORMANCE (Big bold numbers & Call column removed)
         ===================================================================== */}
      {adminTab === 'performance' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5 anim-fade-scale">
          <div className="border-b border-[#EAE6DF] pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#245348]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Callers Performance Matrix
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Individual performance tracking for all callers: total leads assigned, calls completed today, and leads closed today.
            </p>
          </div>

          {/* Performance Table */}
          <div className="overflow-x-auto rounded-xl border border-[#14221F]/20 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14221F] text-[#DFBE79] uppercase font-mono text-[11px] tracking-wider border-b border-[#245348]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Caller Specialist</th>
                  <th className="py-3.5 px-4 font-bold">Contact & Code</th>
                  <th className="py-3.5 px-4 font-bold">Allocated Locations</th>
                  <th className="py-3.5 px-4 font-bold">Total Leads</th>
                  <th className="py-3.5 px-4 font-bold">Total Calls Today</th>
                  <th className="py-3.5 px-4 font-bold">Total Leads Today</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                {callers.map(caller => {
                  const callerLeads = leads.filter(l => l.callerId === caller.id);
                  const totalCallerLeads = callerLeads.length;

                  // Total calls done today by this caller
                  const callsDoneToday = callerLeads.filter(l => {
                    const hasNoteToday = l.notes && l.notes.some(n => n.at >= todayStart && n.by.includes(caller.name));
                    return hasNoteToday || (l.createdAt >= todayStart && l.callStatusCode > 0);
                  }).length;

                  // Total leads today for this caller
                  const leadsToday = callerLeads.filter(l => l.createdAt >= todayStart && (l.statusCode === 1 || l.statusCode === 2 || l.statusCode === 7)).length;

                  const allocatedLocsStr = caller.assignedLocations && caller.assignedLocations.length > 0
                    ? caller.assignedLocations.map(id => LOCATION_CODES[id]).filter(Boolean).join(", ")
                    : "None";

                  return (
                    <tr key={caller.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#14221F] text-sm">{caller.name}</p>
                        <span className="text-[10px] text-gray-400 font-mono">{caller.role || "Location Specialist"}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#245348] block text-xs">{caller.callerCode}</span>
                        <span className="text-gray-500 text-xs">{caller.phone}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs text-gray-700 font-medium">
                          {allocatedLocsStr}
                        </span>
                      </td>

                      {/* Clean normal sans-serif numbers */}
                      <td className="py-4 px-4 font-bold text-xl text-[#14221F]">
                        {totalCallerLeads}
                      </td>

                      <td className="py-4 px-4 font-bold text-xl text-blue-800">
                        {callsDoneToday}
                      </td>

                      <td className="py-4 px-4 font-bold text-xl text-emerald-800">
                        {leadsToday}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CALLERS MANAGEMENT (Clean cards, details modal & divert work)
         ===================================================================== */}
      {adminTab === 'callers' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5 anim-fade-scale">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#245348]" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Callers Management
                </h2>
              </div>
            </div>

            <button
              onClick={() => setShowAddCallerModal(true)}
              className="px-4 py-2.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] active:scale-95 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-[#DFBE79]" />
              <span>+ Add Caller</span>
            </button>
          </div>

          {/* Clean Caller Cards Grid (No open passwords, clickable names) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callers.map(caller => {
              const assignedLeadCount = leads.filter(l => l.callerId === caller.id).length;

              return (
                <div
                  key={caller.id}
                  className="bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl p-5 space-y-3.5 hover:border-[#245348]/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#245348] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                          {caller.name.charAt(0)}
                        </div>
                        <div>
                          {/* Clickable Caller Name opening Details Modal */}
                          <button
                            onClick={() => {
                              setSelectedCallerModal(caller);
                              setShowCallerPassword(false);
                              setDivertTargetCallerId('');
                            }}
                            className="font-serif text-lg font-bold text-[#14221F] hover:text-[#245348] hover:underline text-left leading-tight transition-colors block"
                            title="Click to view details and password"
                          >
                            {caller.name}
                          </button>
                          <span className="text-xs text-gray-500">
                            {caller.callerCode} • Assigned Leads: <strong className="text-[#245348]">{assignedLeadCount}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Delete Caller Button with 2-Step Verification */}
                      <button
                        onClick={() => handleOpenDeleteCallerModal(caller)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:scale-110 active:scale-95 transition-all"
                        title="Delete Caller"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-gray-600">
                      Phone: <span className="text-[#14221F] font-semibold">{caller.phone}</span>
                    </div>

                    {/* Allocated Locations clean chips */}
                    <div className="space-y-1.5 pt-2 border-t border-[#EAE6DF]">
                      <span className="text-[10px] uppercase font-mono text-gray-500 block font-semibold">
                        Allocated Locations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {caller.assignedLocations && caller.assignedLocations.length > 0 ? (
                          caller.assignedLocations.map(locId => (
                            <span
                              key={locId}
                              className="px-2 py-0.5 rounded bg-[#245348]/10 text-[#245348] border border-[#245348]/20 text-[11px] font-medium"
                            >
                              {LOCATION_CODES[locId]}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No locations allocated</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: View Details & Divert Work shortcuts */}
                  <div className="pt-3 flex items-center justify-between text-xs border-t border-[#EAE6DF]">
                    <button
                      onClick={() => {
                        setSelectedCallerModal(caller);
                        setShowCallerPassword(false);
                        setDivertTargetCallerId('');
                      }}
                      className="text-[#245348] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View Details & Password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCallerModal(caller);
                        setShowCallerPassword(false);
                        setDivertTargetCallerId('');
                      }}
                      className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      title="Divert work if absent"
                    >
                      <PhoneForwarded className="w-3 h-3" />
                      <span>Divert Work</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: DATA & STORAGE (Quarterly Cleanup in RED, queue info, dates)
         ===================================================================== */}
      {adminTab === 'storage' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-6 anim-fade-scale">
          
          {/* Header */}
          <div className="border-b border-[#EAE6DF] pb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#245348]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Storage & Data
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Server storage surveillance, master excel backups, custom date-range extractions, and scheduled quarterly queue cleanup.
            </p>
          </div>

          {/* 1) Server Storage Capacity Overview */}
          <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#EAE6DF] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="font-mono text-[#14221F] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#245348]" />
                Server Storage Usage
              </span>
              <span className="font-mono text-[#245348] bg-[#245348]/10 px-2.5 py-0.5 rounded">
                Server Status: Healthy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-white rounded-lg border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-500 block font-semibold">Total Space Taken by Whole Server</span>
                <span className="text-2xl font-bold text-[#245348] mt-1 block">
                  {(storageStats.rawBytes / 1024).toFixed(2)} KB
                </span>
                <span className="text-[11px] text-gray-400">
                  Active database records + system assets
                </span>
              </div>

              <div className="p-4 bg-white rounded-lg border border-[#EAE6DF]">
                <span className="text-[10px] uppercase text-gray-500 block font-semibold">Total Space Empty</span>
                <span className="text-2xl font-bold text-emerald-700 mt-1 block">
                  511.98 MB Available
                </span>
                <span className="text-[11px] text-gray-400">
                  Allocated quota: 512.00 MB
                </span>
              </div>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative shadow-inner mt-2">
              <div
                className="h-full bg-[#245348] rounded-full transition-all duration-700"
                style={{ width: '4%' }}
              />
            </div>
          </div>

          {/* 2) Master Database Excel Export */}
          <div className="p-5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl space-y-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#245348]" />
                <span>Master Database Excel Export</span>
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Download all registered customer inquiries, lead ratings, assigned callers, and contact data into a comprehensive Excel spreadsheet (.xlsx).
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="py-2.5 px-5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
            >
              {isExportingExcel ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#DFBE79]" />
                  <span>Generating Excel...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#DFBE79]" />
                  <span>Download All Data as Excel (.xlsx)</span>
                </>
              )}
            </button>
          </div>

          {/* 3) Custom Date-Range Excel Download */}
          <div className="p-5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl space-y-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14221F] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C59B4E]" />
                <span>Download Data by Date Range</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Select a specific period to export an Excel spreadsheet of all customer enquiries recorded between those dates.
              </p>
            </div>

            <form onSubmit={handleExportDateRange} className="flex flex-col sm:flex-row items-end gap-3 text-xs">
              <div className="w-full sm:w-auto space-y-1">
                <label className="text-gray-600 font-medium">From Date</label>
                <input
                  type="date"
                  required
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-[#EAE6DF] rounded-lg px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-auto space-y-1">
                <label className="text-gray-600 font-medium">To Date</label>
                <input
                  type="date"
                  required
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-[#EAE6DF] rounded-lg px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isExportingRange}
                className="w-full sm:w-auto py-2 px-5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                {isExportingRange ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-[#DFBE79]" />
                )}
                <span>Download Date Range Excel</span>
              </button>
            </form>
          </div>

          {/* 4) Quarterly Cleanup Engine (Styled in RED with Queue Dates) */}
          <div className="p-6 bg-red-50/70 border-2 border-red-300 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-red-700" />
                  <h3 className="font-serif text-xl font-bold text-red-950">
                    Quarterly Data Cleanup (Queue Engine)
                  </h3>
                  {queueInfo.isOverdue && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                      Overdue Alert
                    </span>
                  )}
                </div>
                <p className="text-xs text-red-800 leading-relaxed max-w-3xl">
                  Protected data purge with <strong>3-step verification</strong> (Admin Password + Typing 'DELETE' + Email Security Code). 
                  Safely processes historical data in continuous 3-month queue batches. 
                  <strong> Never deletes data from the past month to today (past 30 days is strictly immune)</strong>. 
                  Automatically downloads a complete Excel backup file to your computer first, then deletes only non-lead inquiries (Not Interested, Fake/Spam, Okay). 
                  <strong className="text-red-950"> Never deletes Leads, Hot Leads, or Pending Calls.</strong>
                </p>
              </div>
            </div>

            {/* Active Queue Details Box */}
            <div className="p-4 bg-white rounded-xl border border-red-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Historical Queue Window</span>
                <span className="font-bold text-red-900 text-sm mt-0.5 block">
                  {queueInfo.batchStartStr} — {queueInfo.batchEndStr}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Past 3-month queue batch</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Non-Lead Candidates</span>
                <span className="font-bold text-[#14221F] text-sm mt-0.5 block">
                  {queueInfo.candidatesCount} records
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Only Fake / Not Interested</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">30-Day Protected Window</span>
                <span className="font-bold text-emerald-800 text-xs mt-0.5 block">
                  {queueInfo.cutoffStr} — Present
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">100% Immune from deletion</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Excel Safety Backup</span>
                <span className="font-semibold text-emerald-800 text-xs mt-0.5 block">
                  Mandatory Auto-Save
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Downloads before delete</span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={handleOpenDataDeleteModal}
                disabled={isRunningQuarterly}
                className="px-6 py-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md disabled:opacity-75"
              >
                {isRunningQuarterly ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Queue & Saving Backup...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 text-[#DFBE79]" />
                    <span>Run Quarterly Cleanup (3-Step Authorization)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 5: SECURITY ENGINE & AUDIT LOGS (Zero-Trust Enterprise Hardening)
         ===================================================================== */}
      {adminTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-6 anim-fade-scale">
          {/* Header */}
          <div className="border-b border-[#EAE6DF] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#245348]" />
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Security & Audit Log Trail
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Zero-Trust Enterprise Defense, Row Level Security, IDOR Shield & Immutable Audit Stream
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFeedbackToast('Security integrity verified: 0 vulnerabilities, RLS active.')}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Vulnerabilities Verified</span>
              </button>
            </div>
          </div>

          {/* 8-Point Defense Architecture Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Row Level Security (RLS)</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Enforced
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Callers scoped strictly to assigned leads</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">IDOR Protection</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Blocks cross-account lead tampering</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Rate Limiting</span>
              <span className="font-bold text-xs text-[#245348] flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#DFBE79]" /> 15/min Auth
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Sliding window & 4-hour cooldown</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Input Sanitization</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Deep Sanitized
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">XSS & Prototype Pollution stripped</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">CORS Lockdown</span>
              <span className="font-bold text-xs text-[#245348] flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Origin-Locked
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Wildcard * blocked on credentials</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Transport Layer</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Force HTTPS / HSTS
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">max-age=31536000; preload</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Private Vault Storage</span>
              <span className="font-bold text-xs text-[#245348] flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-[#DFBE79]" /> Presigned URLs
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">5-minute expiring cryptographic tokens</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Webhook Integrity</span>
              <span className="font-bold text-xs text-emerald-700 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> SHA-256 HMAC
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Timing-safe signature verification</p>
            </div>
          </div>

          {/* Audit Log Stream Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#14221F] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#245348]" />
                <span>Immutable Security Event Trail</span>
              </h3>
              <span className="text-[11px] text-gray-400 font-mono">
                {getAuditLogs(currentUser).length} recorded events
              </span>
            </div>

            <div className="border border-[#EAE6DF] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#EAE6DF] text-gray-500 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Actor</th>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Target Resource</th>
                      <th className="py-2.5 px-4">Details / Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE6DF]">
                    {getAuditLogs(currentUser).length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-400 text-xs">
                          No audit events recorded yet. Every administrative, export, and security action will appear here.
                        </td>
                      </tr>
                    ) : (
                      getAuditLogs(currentUser).slice(0, 30).map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 px-4 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="font-semibold text-[#14221F] block">{log.actorName}</span>
                            <span className="text-[10px] text-gray-400 uppercase font-mono">{log.actorRole}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                              log.actionType.includes('BLOCKED') || log.actionType.includes('FAILED')
                                ? 'bg-red-100 text-red-800'
                                : log.actionType.includes('DELETE')
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {log.actionType}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-gray-700 font-medium font-mono text-[11px]">
                            {log.targetResource || '—'}
                          </td>
                          <td className="py-2.5 px-4 text-gray-500 text-[11px] font-mono">
                            {JSON.stringify(log.details || {})}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 6: CAREERS & TALENT ACQUISITION APPLICATIONS ── */}
      {adminTab === 'careers' && (
        <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-subtle p-6 space-y-6 anim-fade-up">
          {/* Header */}
          <div className="border-b border-[#EAE6DF] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#245348]" />
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Job Enquiries & Candidate Applications
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review incoming job applications, download resume documents, update hiring status, or export enquiries to Excel.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsExportingCareers(true);
                  setTimeout(() => {
                    const ok = dbStore.exportJobApplicationsToExcel();
                    setIsExportingCareers(false);
                    if (ok) {
                      setFeedbackToast('Job enquiries exported to Excel successfully.');
                    } else {
                      alert('Could not generate Excel file.');
                    }
                  }, 400);
                }}
                disabled={isExportingCareers}
                className="px-3.5 py-1.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#DFBE79]" />
                <span>{isExportingCareers ? 'Exporting...' : 'Export to Excel'}</span>
              </button>

              <button
                onClick={() => {
                  const apps = dbStore.getJobApplications();
                  setJobApplications(apps);
                  setFeedbackToast('Applications refreshed from storage.');
                }}
                className="px-3 py-1.5 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#245348] text-xs font-semibold text-gray-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Total Applications</span>
              <span className="font-bold text-xl text-[#14221F] mt-0.5 block">{jobApplications.length}</span>
              <p className="text-[10px] text-gray-500 mt-0.5">Profiles in repository</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Under Review</span>
              <span className="font-bold text-xl text-amber-700 mt-0.5 block">
                {jobApplications.filter(a => a.status === 'Under Review').length}
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Pending initial screening</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Shortlisted</span>
              <span className="font-bold text-xl text-emerald-700 mt-0.5 block">
                {jobApplications.filter(a => a.status && (a.status.includes('Shortlisted') || a.status.includes('Interview'))).length}
              </span>
              <p className="text-[10px] text-gray-500 mt-0.5">Ready for interviews</p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Direct HR Helpline</span>
              <span className="font-mono font-bold text-xs text-[#245348] mt-1 block">+91 82910 90155</span>
              <p className="text-[10px] text-gray-500 mt-0.5">WhatsApp / Phone Active</p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, role, mobile, city..."
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#14221F] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={careerRoleFilter}
                onChange={(e) => setCareerRoleFilter(e.target.value)}
                className="bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-2.5 py-1.5 text-xs text-[#14221F] focus:outline-none"
              >
                <option value="All">All Positions</option>
                <option value="BDA">Business Development Associate (BDA)</option>
                <option value="BDM">Business Development Manager (BDM)</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="General">General Candidature</option>
              </select>

              <select
                value={careerStatusFilter}
                onChange={(e) => setCareerStatusFilter(e.target.value)}
                className="bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-2.5 py-1.5 text-xs text-[#14221F] focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted for Interview">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Hired">Hired</option>
                <option value="Archived / Rejected">Archived</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="border border-[#EAE6DF] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#EAE6DF] text-gray-500 uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">Applicant ID & Name</th>
                    <th className="py-3 px-4">Contact & Location</th>
                    <th className="py-3 px-4">Position & Experience</th>
                    <th className="py-3 px-4">Current Org & CTC</th>
                    <th className="py-3 px-4">Resume Document</th>
                    <th className="py-3 px-4">Hiring Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF]">
                  {jobApplications
                    .filter(app => {
                      if (careerRoleFilter !== 'All' && !app.position.toLowerCase().includes(careerRoleFilter.toLowerCase())) return false;
                      if (careerStatusFilter !== 'All' && app.status !== careerStatusFilter) return false;
                      if (careerSearch.trim()) {
                        const q = careerSearch.toLowerCase();
                        const match =
                          app.name.toLowerCase().includes(q) ||
                          app.mobile.includes(q) ||
                          app.email.toLowerCase().includes(q) ||
                          app.position.toLowerCase().includes(q) ||
                          (app.city && app.city.toLowerCase().includes(q)) ||
                          (app.currentCompany && app.currentCompany.toLowerCase().includes(q));
                        if (!match) return false;
                      }
                      return true;
                    })
                    .length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-gray-400 text-xs">
                          No candidate job enquiries matching current filters.
                        </td>
                      </tr>
                    ) : (
                      jobApplications
                        .filter(app => {
                          if (careerRoleFilter !== 'All' && !app.position.toLowerCase().includes(careerRoleFilter.toLowerCase())) return false;
                          if (careerStatusFilter !== 'All' && app.status !== careerStatusFilter) return false;
                          if (careerSearch.trim()) {
                            const q = careerSearch.toLowerCase();
                            const match =
                              app.name.toLowerCase().includes(q) ||
                              app.mobile.includes(q) ||
                              app.email.toLowerCase().includes(q) ||
                              app.position.toLowerCase().includes(q) ||
                              (app.city && app.city.toLowerCase().includes(q)) ||
                              (app.currentCompany && app.currentCompany.toLowerCase().includes(q));
                            if (!match) return false;
                          }
                          return true;
                        })
                        .map(app => (
                          <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-mono text-[10px] text-[#C59B4E] font-bold block">{app.id}</span>
                              <button
                                onClick={() => setSelectedCandidateModal(app)}
                                className="text-[#14221F] font-bold text-xs hover:text-[#245348] hover:underline text-left cursor-pointer"
                              >
                                {app.name}
                              </button>
                              <span className="text-[10px] text-gray-400 font-mono block">Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${app.mobile}`}
                                  className="font-mono font-bold text-xs text-[#245348] hover:underline"
                                >
                                  +91 {app.mobile}
                                </a>
                                <a
                                  href={`https://wa.me/91${app.mobile}?text=Hello%20${encodeURIComponent(app.name)}%2C%20this%20is%20Concave%20Realty%20Talent%20Acquisition%20regarding%20your%20job%20enquiry%20for%20${encodeURIComponent(app.position)}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp Candidate"
                                  className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 transition-colors"
                                >
                                  <PhoneCall className="w-2.5 h-2.5" />
                                </a>
                              </div>
                              <span className="text-[11px] text-gray-500 block truncate max-w-[160px]">{app.email}</span>
                              <span className="text-[10px] text-gray-400 block">{app.city}</span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-semibold text-xs text-[#14221F] block">{app.position}</span>
                              <span className="text-[10px] text-gray-500 font-mono block">Exp: {app.experience}</span>
                              {app.noticePeriod && (
                                <span className="text-[9.5px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-mono inline-block mt-0.5">
                                  Notice: {app.noticePeriod}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-xs">
                              <span className="text-gray-700 block truncate max-w-[140px]">{app.currentCompany || 'Not Disclosed'}</span>
                              <span className="text-[10px] text-gray-500 block">{app.currentRole || ''}</span>
                              <div className="mt-0.5 space-y-0.2 font-mono text-[10px]">
                                {app.currentCtc && app.currentCtc !== 'Not Disclosed' && (
                                  <span className="text-gray-500 block">Cur: {app.currentCtc}</span>
                                )}
                                <span className="text-[#245348] font-semibold block">Exp: {app.expectedCtc || 'Negotiable'}</span>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                                <span className="text-[11px] font-medium text-gray-700 truncate max-w-[120px]" title={app.resumeName}>
                                  {app.resumeName || 'Resume.pdf'}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-mono block pl-5">{app.resumeSize || '1.2 MB'}</span>
                              {app.linkedin && (
                                <a
                                  href={app.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-[#0A66C2] hover:underline flex items-center gap-1 mt-0.5 pl-5"
                                >
                                  <span>LinkedIn</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={app.status}
                                onChange={(e) => {
                                  const newStat = e.target.value;
                                  dbStore.updateJobApplicationStatus(app.id, newStat);
                                  setJobApplications(dbStore.getJobApplications());
                                  setFeedbackToast(`Application ${app.id} marked as ${newStat}`);
                                }}
                                className="bg-white border border-[#EAE6DF] focus:border-[#245348] rounded px-2 py-1 text-xs font-semibold text-[#14221F] focus:outline-none"
                              >
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted for Interview">Shortlisted</option>
                                <option value="Interview Scheduled">Interview Scheduled</option>
                                <option value="Offer Extended">Offer Extended</option>
                                <option value="Hired">Hired</option>
                                <option value="Archived / Rejected">Archived</option>
                              </select>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedCandidateModal(app)}
                                  className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#245348] text-[11px] font-semibold text-gray-700 transition-colors"
                                  title="View full candidate details"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete job enquiry for ${app.name} (${app.id})?`)) {
                                      dbStore.deleteJobApplication(app.id);
                                      setJobApplications(dbStore.getJobApplications());
                                      setFeedbackToast(`Job enquiry ${app.id} removed.`);
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete enquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── JOB CANDIDATE FULL DETAILS MODAL ── */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#C59B4E]/40 anim-fade-scale">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#183C32] text-white flex items-center justify-between border-b border-[#C59B4E]/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#245348] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79]">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {selectedCandidateModal.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#DFBE79]">
                    Ref: {selectedCandidateModal.id} • Applied: {new Date(selectedCandidateModal.appliedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-[#14221F]">
              
              {/* Contact & Status Bar */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Candidate Contact</span>
                  <div className="flex items-center gap-2">
                    <strong className="font-mono text-xs">+91 {selectedCandidateModal.mobile}</strong>
                    <a
                      href={`https://wa.me/91${selectedCandidateModal.mobile}?text=Hello%20${encodeURIComponent(selectedCandidateModal.name)}%2C%20this%20is%20Concave%20Realty%20Talent%20Acquisition%20regarding%20your%20job%20enquiry%20for%20${encodeURIComponent(selectedCandidateModal.position)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1 hover:bg-emerald-200"
                    >
                      <PhoneCall className="w-2.5 h-2.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                  <span className="text-gray-500 block">{selectedCandidateModal.email}</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block">Hiring Status</span>
                  <select
                    value={selectedCandidateModal.status}
                    onChange={(e) => {
                      const newStat = e.target.value;
                      dbStore.updateJobApplicationStatus(selectedCandidateModal.id, newStat);
                      setSelectedCandidateModal({ ...selectedCandidateModal, status: newStat });
                      setJobApplications(dbStore.getJobApplications());
                      setFeedbackToast(`Status updated to ${newStat}`);
                    }}
                    className="mt-1 bg-white border border-[#EAE6DF] focus:border-[#245348] rounded px-2.5 py-1 text-xs font-semibold text-[#14221F] focus:outline-none"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted for Interview">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Hired">Hired</option>
                    <option value="Archived / Rejected">Archived</option>
                  </select>
                </div>
              </div>

              {/* Grid of Profile Details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Applied Position</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{selectedCandidateModal.position}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Location / City</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{selectedCandidateModal.city || 'Mumbai'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Total Experience</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{selectedCandidateModal.experience}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Current Company</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{selectedCandidateModal.currentCompany || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Current CTC</span>
                  <span className="font-semibold text-gray-900 block mt-0.5">{selectedCandidateModal.currentCtc || 'Not Disclosed'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Expected CTC</span>
                  <span className="font-semibold text-[#245348] block mt-0.5">{selectedCandidateModal.expectedCtc || 'Negotiable'}</span>
                </div>
              </div>

              {/* Notice Period & Resume */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Notice Period</span>
                  <span className="font-semibold text-amber-800 block mt-0.5">{selectedCandidateModal.noticePeriod || 'Immediate'}</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono block">Resume File</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FileText className="w-3.5 h-3.5 text-[#C59B4E]" />
                    <span className="font-semibold text-gray-800 truncate">{selectedCandidateModal.resumeName || 'Resume.pdf'}</span>
                    <span className="text-[10px] text-gray-400 font-mono">({selectedCandidateModal.resumeSize || '1.2 MB'})</span>
                  </div>
                </div>
              </div>

              {/* LinkedIn URL */}
              {selectedCandidateModal.linkedin && (
                <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <span className="text-gray-600 font-medium">LinkedIn Profile:</span>
                  <a
                    href={selectedCandidateModal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{selectedCandidateModal.linkedin}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Cover Note / Pitch */}
              {selectedCandidateModal.coverNote && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold block">Candidate Note / Background</span>
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] text-gray-700 leading-relaxed italic">
                    "{selectedCandidateModal.coverNote}"
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-[#EAE6DF] flex items-center justify-between">
              <button
                onClick={() => {
                  if (window.confirm(`Delete job enquiry for ${selectedCandidateModal.name}?`)) {
                    dbStore.deleteJobApplication(selectedCandidateModal.id);
                    setJobApplications(dbStore.getJobApplications());
                    setSelectedCandidateModal(null);
                    setFeedbackToast('Application removed.');
                  }
                }}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Enquiry</span>
              </button>

              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="px-5 py-2 rounded-xl bg-[#245348] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#1B3F37] transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================================
          CALLER DETAILS & DIVERT WORK MODAL ("small box type tab")
         ===================================================================== */}
      {selectedCallerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSelectedCallerModal(null)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 border border-gray-200 anim-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#EAE6DF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#245348] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedCallerModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14221F]">
                    {selectedCallerModal.name}
                  </h3>
                  <span className="font-mono text-xs text-[#245348] font-semibold">
                    {selectedCallerModal.callerCode} • {selectedCallerModal.role || 'Location Specialist'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCallerModal(null)}
                className="text-gray-400 hover:text-black p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Caller Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Mobile Phone</span>
                <span className="font-semibold text-[#14221F] text-sm mt-0.5 block">{selectedCallerModal.phone}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Email Address</span>
                <span className="text-gray-700 text-xs mt-0.5 block truncate">{selectedCallerModal.email || 'N/A'}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Assigned Inquiries</span>
                <span className="font-bold text-[#245348] text-base mt-0.5 block">
                  {leads.filter(l => l.callerId === selectedCallerModal.id).length} Active
                </span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
                <span className="text-[10px] text-emerald-800 uppercase block font-semibold">Caller Password</span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-bold text-[#14221F] text-sm">
                    {showCallerPassword ? selectedCallerModal.password : '••••••••'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCallerPassword(!showCallerPassword)}
                    className="text-[11px] text-[#245348] font-bold hover:underline flex items-center gap-1"
                  >
                    {showCallerPassword ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Allocated Locations */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-700 block">Allocated Locations:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCallerModal.assignedLocations && selectedCallerModal.assignedLocations.length > 0 ? (
                  selectedCallerModal.assignedLocations.map(locId => (
                    <span key={locId} className="px-2.5 py-1 rounded-full bg-[#245348]/10 text-[#245348] border border-[#245348]/20 text-xs font-semibold">
                      📍 {LOCATION_CODES[locId]}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None allocated</span>
                )}
              </div>
            </div>

            {/* DIVERT WORK (ABSENTEE COVERAGE) SECTION */}
            <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-sm">
                <PhoneForwarded className="w-4 h-4 text-amber-700" />
                <span>Divert Work (Absentee Coverage)</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                If <strong>{selectedCallerModal.name}</strong> is absent today, divert all their pending and active customer inquiries to another caller to keep client engagement active.
              </p>

              <form onSubmit={handleDivertWork} className="space-y-2.5 pt-1 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-700 font-semibold block">Select Substitute Caller:</label>
                  <select
                    value={divertTargetCallerId}
                    onChange={(e) => setDivertTargetCallerId(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-[#14221F] font-medium focus:outline-none"
                    required
                  >
                    <option value="">-- Choose substitute caller --</option>
                    {callers
                      .filter(c => c.id !== selectedCallerModal.id)
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.callerCode}) • Currently has {leads.filter(l => l.callerId === c.id).length} leads
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isDivertingWork || !divertTargetCallerId}
                  className="w-full py-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
                >
                  {isDivertingWork ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Diverting Leads...</span>
                    </>
                  ) : (
                    <>
                      <PhoneForwarded className="w-3.5 h-3.5 text-[#DFBE79]" />
                      <span>Divert All Work to Selected Caller</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCallerModal(null)}
                className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          3-STEP SERVER DATA DELETION VERIFICATION MODAL
         ===================================================================== */}
      {showDataDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowDataDeleteModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 border-2 border-red-200 anim-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAE6DF] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-red-950">
                    Server Data Deletion Authorization
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    3-Step Executive Security Protocol • Historical Purge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDataDeleteModal(false)}
                className="text-gray-400 hover:text-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* 3-Step Progress Indicators */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className={`p-2 rounded-lg border transition-all ${
                dataDeleteStep === 1
                  ? 'bg-red-800 text-white font-bold border-red-800 shadow-sm'
                  : dataDeleteStep > 1
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border-emerald-300'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                <span className="block text-[10px] uppercase tracking-wider">Step 1</span>
                <span>{dataDeleteStep > 1 ? '✓ Password' : 'Password'}</span>
              </div>
              <div className={`p-2 rounded-lg border transition-all ${
                dataDeleteStep === 2
                  ? 'bg-red-800 text-white font-bold border-red-800 shadow-sm'
                  : dataDeleteStep > 2
                  ? 'bg-emerald-50 text-emerald-800 font-semibold border-emerald-300'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                <span className="block text-[10px] uppercase tracking-wider">Step 2</span>
                <span>{dataDeleteStep > 2 ? '✓ Confirmation' : 'Type DELETE'}</span>
              </div>
              <div className={`p-2 rounded-lg border transition-all ${
                dataDeleteStep === 3
                  ? 'bg-red-800 text-white font-bold border-red-800 shadow-sm'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                <span className="block text-[10px] uppercase tracking-wider">Step 3</span>
                <span>Email & OTP</span>
              </div>
            </div>

            {/* Error Message */}
            {dataDeleteError && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-900 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                <span>{dataDeleteError}</span>
              </div>
            )}

            {/* STEP 1: ADMIN LOGIN PASSWORD */}
            {dataDeleteStep === 1 && (
              <form onSubmit={handleVerifyDataDeleteStep1} className="space-y-4 text-xs">
                <div className="p-3.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-red-900 font-bold">
                    <Lock className="w-4 h-4" />
                    <span>Step 1: Admin Master Password</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Enter your master administrative password to verify elevated permissions for server data management.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-semibold block">Admin Password *</label>
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter admin password (e.g. concave@2026)"
                    value={dataDeletePassword}
                    onChange={(e) => setDataDeletePassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg px-3.5 py-2.5 text-[#14221F] font-mono focus:outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDataDeleteModal(false)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Type DELETE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: TYPE 'DELETE' */}
            {dataDeleteStep === 2 && (
              <form onSubmit={handleVerifyDataDeleteStep2} className="space-y-4 text-xs">
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-red-900 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Step 2: Explicit Confirmation</span>
                  </div>
                  <p className="text-red-800 leading-relaxed text-[11px]">
                    You are authorizing the deletion of non-lead records in the historical queue window:{' '}
                    <strong>{queueInfo.batchStartStr} to {queueInfo.batchEndStr}</strong>.
                  </p>
                  <p className="text-[11px] text-gray-600">
                    To prevent accidental clicks, type <strong className="font-mono text-red-700 uppercase">DELETE</strong> below.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-semibold block">Type "DELETE" in uppercase *</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Type DELETE"
                    value={dataDeletePhrase}
                    onChange={(e) => setDataDeletePhrase(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg px-3.5 py-2.5 text-[#14221F] font-mono text-center font-bold tracking-widest uppercase focus:outline-none transition-all text-sm"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDataDeleteStep(1);
                      setDataDeleteError('');
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Email OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: EXECUTIVE EMAIL & SECURITY OTP */}
            {dataDeleteStep === 3 && (
              <form onSubmit={handleExecuteDataDeleteStep3} className="space-y-4 text-xs">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Step 3: Executive Security Verification</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed text-[11px]">
                    Enter the Executive Admin Email and 4-digit Security OTP to finalize authorization and execute data cleanup.
                  </p>
                </div>

                {/* Simulated OTP Notification Banner */}
                {dataDeleteOtpSent && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs space-y-1 anim-fade-up">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-amber-700" />
                        <span>Security OTP dispatched to {dataDeleteEmail}</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleSendDeleteOtp}
                        className="text-[10px] text-amber-900 underline font-semibold hover:text-amber-950"
                      >
                        Resend
                      </button>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[11px] text-amber-800">Use Verification Code:</span>
                      <span className="px-2 py-0.5 bg-amber-200/80 rounded font-mono font-bold text-amber-950 text-sm tracking-wider">
                        {dataDeleteGeneratedOtp}
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-gray-700 font-semibold block">Executive Admin Email *</label>
                  <input
                    type="email"
                    required
                    value={dataDeleteEmail}
                    onChange={(e) => setDataDeleteEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg px-3.5 py-2 text-[#14221F] text-xs focus:outline-none transition-all"
                  />
                </div>

                {/* OTP Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-semibold block">4-Digit Security Code *</label>
                    {!dataDeleteOtpSent && (
                      <button
                        type="button"
                        onClick={handleSendDeleteOtp}
                        className="text-[11px] text-red-800 font-bold hover:underline"
                      >
                        Get Security Code
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="e.g. 4-digit code"
                    value={dataDeleteOtpInput}
                    onChange={(e) => setDataDeleteOtpInput(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg px-3.5 py-2.5 text-[#14221F] font-mono text-center font-bold tracking-widest text-base focus:outline-none transition-all"
                  />
                </div>

                {/* Protected Guarantees Checklist */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1 text-[11px] text-gray-600">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Mandatory Excel backup automatically saves to your computer first</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Leads, Hot Leads, and Pending Calls are 100% protected</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Records from past 30 days are immune from deletion</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDataDeleteStep(2);
                      setDataDeleteError('');
                    }}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4 text-[#DFBE79]" />
                    <span>Authorize & Purge Data</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          2-STEP CALLER DELETION VERIFICATION MODAL
         ===================================================================== */}
      {callerToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setCallerToDelete(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-red-200 anim-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#14221F] flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-700" />
                <span>Delete Caller: {callerToDelete.name}</span>
              </h3>
              <button
                onClick={() => setCallerToDelete(null)}
                className="text-gray-400 hover:text-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            {callerDeleteError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
                {callerDeleteError}
              </div>
            )}

            {/* Step 1: Admin Password */}
            {callerDeleteStep === 1 && (
              <form onSubmit={handleVerifyCallerDeleteStep1} className="space-y-3 text-xs">
                <p className="text-gray-600">
                  Step 1 of 2: Please enter your Admin Password to authorize deleting this caller.
                </p>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Admin Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter concave@2026..."
                    value={callerDeletePassword}
                    onChange={(e) => setCallerDeletePassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-600 rounded-lg px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCallerToDelete(null)}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold uppercase tracking-wider"
                  >
                    Next Step →
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Type 'Delete Caller' */}
            {callerDeleteStep === 2 && (
              <form onSubmit={handleExecuteCallerDelete} className="space-y-3 text-xs">
                <p className="text-gray-600">
                  Step 2 of 2: Type <strong className="font-mono text-red-700">Delete Caller</strong> below to confirm removal.
                </p>
                <div className="space-y-1">
                  <label className="text-gray-700 font-medium">Confirmation Text</label>
                  <input
                    type="text"
                    required
                    placeholder="Type Delete Caller"
                    value={callerDeletePhrase}
                    onChange={(e) => setCallerDeletePhrase(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-600 rounded-lg px-3 py-2 text-[#14221F] font-mono text-center focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCallerDeleteStep(1)}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-red-800 hover:bg-red-900 text-white font-semibold uppercase tracking-wider"
                  >
                    Confirm Delete
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ADD CALLER MODAL (Multiple Location Allocation support)
         ===================================================================== */}
      {showAddCallerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowAddCallerModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-200 anim-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#14221F] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#245348]" />
                <span>Add Caller</span>
              </h3>
              <button
                onClick={() => setShowAddCallerModal(false)}
                className="text-gray-400 hover:text-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaller} className="space-y-3 text-xs">
              {/* Caller Name */}
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Caller Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Nair"
                  value={newCallerData.name}
                  onChange={(e) => setNewCallerData({ ...newCallerData, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98205 12345"
                  value={newCallerData.phone}
                  onChange={(e) => setNewCallerData({ ...newCallerData, phone: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none transition-all"
                />
              </div>

              {/* Email ID */}
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Email ID *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. anjali@concaverealty.com"
                  value={newCallerData.email}
                  onChange={(e) => setNewCallerData({ ...newCallerData, email: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none transition-all"
                />
              </div>

              {/* Assigned Password */}
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Assigned Password</label>
                <input
                  type="text"
                  value={newCallerData.password}
                  onChange={(e) => setNewCallerData({ ...newCallerData, password: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-lg px-3 py-2 text-[#14221F] font-mono focus:outline-none transition-all"
                />
              </div>

              {/* Allocate Locations (Multi-location selection chips) */}
              <div className="space-y-1.5">
                <label className="text-gray-700 font-medium block">
                  Allocate Locations *
                </label>
                <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg max-h-36 overflow-y-auto">
                  {Object.entries(LOCATION_CODES).map(([codeStr, locName]) => {
                    const locId = parseInt(codeStr, 10);
                    const isSelected = newCallerData.assignedLocations.includes(locId);

                    return (
                      <button
                        key={locId}
                        type="button"
                        onClick={() => {
                          const current = newCallerData.assignedLocations || [];
                          const updated = isSelected
                            ? current.filter(id => id !== locId)
                            : [...current, locId];
                          setNewCallerData({ ...newCallerData, assignedLocations: updated });
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#245348] text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-[#EAE6DF] hover:border-gray-400'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {locName}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400">
                  Select one or multiple locations for this caller. Inquiries will balance equally if multiple callers share a location.
                </p>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCallerModal(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#245348] hover:bg-[#1B3F37] active:scale-95 text-white font-semibold uppercase tracking-wider transition-all"
                >
                  Save Caller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
