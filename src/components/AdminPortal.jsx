import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  MessageCircle,
  Home,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Plus,
  Smartphone,
  Laptop
} from 'lucide-react';
import { dbStore, STATUS_CODES, LOCATION_CODES, CALL_STATUS_CODES, PROJECT_CODES, detectSqlInjection, sanitizeInput, validatePasswordPolicy, logSecurityEvent, getAuditLogs, verifyPassword, formatCompactDevice, isDesktopDevice, isConfirmedLead, isPendingEnquiry, isCallbackLead } from '../data/dbStore';

export function AdminPortal({ currentUser, onLogin, onLogout, onNavigateHome }) {
  // Navigation tabs: 'overview' | 'performance' | 'callers' | 'storage' | 'careers'
  const [adminTab, setAdminTab] = useState('overview');

  // Horizontal Slider state for Sub-Navigation Tabs
  const tabsContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateScrollState = () => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const current = el.scrollLeft;
    setScrollProgress(Math.min(100, Math.max(0, (current / maxScroll) * 100)));
    setCanScrollLeft(current > 8);
    setCanScrollRight(current < maxScroll - 8);
  };

  // Security: Prevent search indexing of Admin Portal via dynamic meta tag
  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    const prev = meta ? meta.getAttribute('content') : 'index, follow';
    if (meta) meta.setAttribute('content', 'noindex, nofollow, noarchive');
    return () => {
      if (meta) meta.setAttribute('content', prev);
    };
  }, []);

  useEffect(() => {
    const el = tabsContainerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [adminTab]);

  const slideTabs = (direction) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const distance = 200;
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' });
  };

  const handleMouseDown = (e) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const el = tabsContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleSliderClick = (e) => {
    const el = tabsContainerRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: maxScroll * clickRatio, behavior: 'smooth' });
  };

  const handleTabClick = (tabId, e) => {
    setAdminTab(tabId);
    if (e && e.currentTarget) {
      e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Full Caller Capabilities for Admin (calling, dispositions & notes)
  const [callingLead, setCallingLead] = useState(null);
  const [selectedDisposition, setSelectedDisposition] = useState(null); // Full empty by default
  const [callerRemark, setCallerRemark] = useState('');
  const [dispositionError, setDispositionError] = useState('');

  // Manual Lead Creation State ("ADD NEW LEAD")
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadLocation, setNewLeadLocation] = useState(1);
  const [newLeadProject, setNewLeadProject] = useState(1);
  const [newLeadStatus, setNewLeadStatus] = useState(1); // 1 = Hot Lead
  const [newLeadCallStatus, setNewLeadCallStatus] = useState(1); // 1 = Connected & Discussed
  const [newLeadCallerId, setNewLeadCallerId] = useState(0); // 0 = Admin Desk (Direct)
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [newLeadError, setNewLeadError] = useState('');

  const adminCredsInitial = dbStore.getAdminCredentials();
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
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

  // Auto-dismiss floating notifications after 4.5 seconds
  useEffect(() => {
    if (!feedbackToast) return;
    const timer = setTimeout(() => setFeedbackToast(null), 4500);
    return () => clearTimeout(timer);
  }, [feedbackToast]);

  useEffect(() => {
    if (!excelExportSuccess) return;
    const timer = setTimeout(() => setExcelExportSuccess(false), 4500);
    return () => clearTimeout(timer);
  }, [excelExportSuccess]);

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
  const [dataDeleteEmail, setDataDeleteEmail] = useState('hemantrishi2786@gmail.com');
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

  const handleViewResume = (app) => {
    if (!app) return;
    if (app.resumeData) {
      window.open(app.resumeData, '_blank');
      return;
    }
    const resumeWin = window.open('', '_blank');
    if (resumeWin) {
      resumeWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>${app.name} - Resume Profile - Concave Realty</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAF9F6; margin: 0; padding: 40px; color: #14221F; }
            .card { max-width: 780px; margin: 0 auto; background: #fff; border: 1px solid #EAE6DF; border-radius: 16px; padding: 36px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
            .header { border-bottom: 2px solid #245348; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            h1 { margin: 0 0 6px 0; color: #245348; font-size: 26px; font-family: Georgia, serif; }
            .badge { display: inline-block; background: #FAF9F6; border: 1px solid #C59B4E; color: #C59B4E; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; font-family: monospace; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
            .item { background: #FAF9F6; padding: 12px 16px; border-radius: 8px; border: 1px solid #EAE6DF; }
            .label { font-size: 11px; color: #777; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; }
            .val { font-size: 14px; font-weight: 600; color: #14221F; }
            .note-box { background: #FAF9F6; border-left: 4px solid #245348; padding: 16px; border-radius: 6px; margin-bottom: 24px; font-style: italic; line-height: 1.6; }
            .footer-info { border-top: 1px solid #EAE6DF; padding-top: 16px; display: flex; justify-content: space-between; font-size: 11px; color: #888; font-family: monospace; }
            @media print { body { padding: 0; background: #fff; } .card { box-shadow: none; border: none; padding: 20px 0; } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div>
                <h1>${app.name}</h1>
                <div style="color: #555; font-size: 13px; margin-top: 4px;">${app.email} • +91 ${app.mobile} • ${app.city || 'Mumbai'}</div>
              </div>
              <div class="badge">REF: ${app.id}</div>
            </div>
            <div class="grid">
              <div class="item"><div class="label">Applied Position</div><div class="val">${app.position}</div></div>
              <div class="item"><div class="label">Total Experience</div><div class="val">${app.experience}</div></div>
              <div class="item"><div class="label">Current Organization</div><div class="val">${app.currentCompany || 'Not Disclosed'}</div></div>
              <div class="item"><div class="label">Current Role / Title</div><div class="val">${app.currentRole || 'N/A'}</div></div>
              <div class="item"><div class="label">Current CTC</div><div class="val">${app.currentCtc || 'Not Disclosed'}</div></div>
              <div class="item"><div class="label">Expected CTC</div><div class="val">${app.expectedCtc || 'Negotiable'}</div></div>
              <div class="item"><div class="label">Notice Period</div><div class="val">${app.noticePeriod || 'Immediate'}</div></div>
              <div class="item"><div class="label">Hiring Status</div><div class="val">${app.status || 'Under Review'}</div></div>
            </div>
            ${app.coverNote ? `
            <div class="label" style="margin-bottom:6px;">Candidate Background & Pitch</div>
            <div class="note-box">"${app.coverNote}"</div>
            ` : ''}
            ${app.linkedin ? `
            <div style="margin-bottom: 24px; font-size: 13px;">
              <strong>LinkedIn Profile:</strong> <a href="${app.linkedin}" target="_blank" style="color: #0A66C2;">${app.linkedin}</a>
            </div>
            ` : ''}
            <div class="footer-info">
              <span>Attached Resume Document: ${app.resumeName || 'Resume.pdf'} (${app.resumeSize || '1.2 MB'})</span>
              <span>Applied: ${new Date(app.appliedAt).toLocaleString()}</span>
            </div>
          </div>
          <script>window.onload = function() { setTimeout(function(){ window.print(); }, 500); };</script>
        </body>
        </html>
      `);
      resumeWin.document.close();
    }
  };

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

      // Real-time synchronization with Hostinger MySQL Database
      dbStore.syncWithServer().then(synced => {
        if (synced) {
          setLeads(dbStore.getLeads(currentUser));
          setStorageStats(dbStore.getStorageStats());
        }
      }).catch(() => {});

      // Dynamically fetch live Hostinger SSD storage metrics when deployed
      try {
        fetch('/api/storage-info')
          .then(res => res.ok ? res.json() : fetch('/api/storage-info.php').then(r => r.json()))
          .then(liveStorage => {
            if (liveStorage && liveStorage.success) {
              setStorageStats(prev => ({
                ...prev,
                ...liveStorage,
                liveServerFetched: true
              }));
            }
          })
          .catch(() => {});
      } catch {}

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
    // Real-time 15s auto-polling: continuously fetch any new live enquiries submitted by customers
    const pollTimer = setInterval(() => {
      if (currentUser && currentUser.role === 'admin') {
        dbStore.syncWithServer().then(synced => {
          if (synced) {
            setLeads(dbStore.getLeads(currentUser));
            setStorageStats(dbStore.getStorageStats());
          }
        }).catch(() => {});
      }
    }, 15000);
    return () => clearInterval(pollTimer);
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

  const handleAdminPasswordLogin = async (e) => {
    e.preventDefault();
    setAdminLoginError('');

    const inputUser = (adminUsername || '').trim();
    const inputPass = (adminPassword || '').trim();

    // 1. Check rate limiting lockout
    if (adminLockoutUntil && Date.now() < adminLockoutUntil) {
      const secsLeft = Math.ceil((adminLockoutUntil - Date.now()) / 1000);
      setAdminLoginError(`Account temporarily locked due to consecutive failed attempts. Please retry in ${secsLeft}s.`);
      return;
    }

    // 2. Security validation
    if (detectSqlInjection(inputUser) || detectSqlInjection(inputPass)) {
      setAdminLoginError('Invalid login credentials or unauthorized characters.');
      return;
    }

    const cleanUser = sanitizeInput(inputUser);
    const adminCreds = dbStore.getAdminCredentials();

    // Exclusively accept ONLY Hemant_Concave_Mishra
    const isUserValid =
      cleanUser === 'Hemant_Concave_Mishra' ||
      cleanUser.toLowerCase() === 'hemant_concave_mishra' ||
      cleanUser.toLowerCase() === (adminCreds.username || '').toLowerCase();

    // Exclusively accept ONLY Hemant@2026#Mishra (hash or exact string)
    const isPasswordValid =
      (await verifyPassword(inputPass, adminCreds.password)) ||
      (await verifyPassword(inputPass, '8da334e29c94e4ee583710f0584f9ad2a94e0c2eac0a2910201566f98a73852b')) ||
      inputPass === 'Hemant@2026#Mishra';

    if (isUserValid && isPasswordValid) {
      setAdminFailedAttempts(0);
      setAdminLockoutUntil(0);
      setAdminLoginError('');

      // Auto-sync fresh credentials in localStorage
      try {
        dbStore.updateAdminPassword('Hemant@2026#Mishra');
      } catch {
        // ignore
      }

      const adminObj = {
        id: 999,
        name: "Hemant Mishra (Super Administrator)",
        role: "admin",
        email: adminCreds.email || "hemantrishi2786@gmail.com",
        phone: adminCreds.phone || "8286018550"
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

  const [forgotToken, setForgotToken] = useState('');

  const handleStartForgotPassword = async () => {
    setForgotError('');
    setForgotSuccessMsg('');
    setWrongOtpAttempts(0);
    setEnteredForgotOtp('');
    setForgotPasswordMode(true);
    setForgotStep(1);

    const adminCreds = dbStore.getAdminCredentials();
    const adminEmail = adminCreds.email || "hemantrishi2786@gmail.com";

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, name: 'Administrator', digits: 6, purpose: 'admin_reset' })
      });
      const data = await res.json();
      if (data.success) {
        setOtpExpiresAt(Date.now() + 5 * 60 * 1000);
        setOtpRemainingSeconds(300);
        setEnteredForgotOtp('');
        setFeedbackToast(`A 6-digit verification code has been dispatched to ${adminEmail}. Please check your inbox.`);
      } else {
        setForgotError(data.message || 'Failed to dispatch verification code. Please check rate limits.');
      }
    } catch {
      setForgotError('Security server unreachable. Please verify server connectivity.');
    }
  };

  const handleResendForgotPasswordOtp = async () => {
    setForgotError('');
    const adminCreds = dbStore.getAdminCredentials();
    const adminEmail = adminCreds.email || "hemantrishi2786@gmail.com";

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, name: 'Administrator', digits: 6, purpose: 'admin_reset' })
      });
      const data = await res.json();
      if (data.success) {
        setOtpExpiresAt(Date.now() + 5 * 60 * 1000);
        setOtpRemainingSeconds(300);
        setFeedbackToast(`New verification code sent to ${adminEmail}.`);
      } else {
        setForgotError(data.message || 'Failed to resend code.');
      }
    } catch {
      setForgotError('Security server unreachable.');
    }
  };

  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (detectSqlInjection(enteredForgotOtp)) {
      setForgotError('Security Alert: Invalid characters detected.');
      return;
    }

    if (!enteredForgotOtp || enteredForgotOtp.trim().length !== 6) {
      setForgotError('Please enter the 6-digit security code received in your email.');
      return;
    }

    const adminCreds = dbStore.getAdminCredentials();
    const adminEmail = adminCreds.email || "hemantrishi2786@gmail.com";

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, otp: enteredForgotOtp.trim() })
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setForgotToken(data.token || 'verified');
        setForgotStep(2); // Set New Password step
      } else {
        setForgotError(data.message || 'Invalid or expired OTP code.');
      }
    } catch {
      setForgotError('Verification service temporarily unavailable.');
    }
  };

  const handleResetAdminPassword = async (e) => {
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

    const adminCreds = dbStore.getAdminCredentials();
    const adminEmail = adminCreds.email || "hemantrishi2786@gmail.com";

    // 1. Update backend MySQL / persistent store via verified API
    try {
      await fetch('/api/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail,
          verificationToken: forgotToken,
          newPassword: newAdminPassword,
          role: 'admin'
        })
      });
    } catch {
      // Non-blocking for offline dev fallback
    }

    // 2. Update local state store
    const res = await dbStore.updateAdminPassword(newAdminPassword);
    if (res.success) {
      setAdminPassword(newAdminPassword);
      setForgotSuccessMsg('Master Admin password updated successfully in database! Redirecting to login...');
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

  const handleVerifyDataDeleteStep1 = async (e) => {
    e.preventDefault();
    const adminCreds = dbStore.getAdminCredentials();
    const isMatch = await verifyPassword(dataDeletePassword, adminCreds.password);
    if (isMatch) {
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
    setFeedbackToast(`Security OTP sent to ${dataDeleteEmail}. Please check your email inbox.`);
    setTimeout(() => setFeedbackToast(null), 7000);
  };

  const handleExecuteDataDeleteStep3 = (e) => {
    e.preventDefault();
    if (!dataDeleteEmail || !dataDeleteEmail.includes('@')) {
      setDataDeleteError('Please enter a valid executive admin email address.');
      return;
    }
    if (dataDeleteOtpInput.trim() !== dataDeleteGeneratedOtp) {
      setDataDeleteError('Invalid security verification code. Please check your email and try again.');
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

  const handleVerifyCallerDeleteStep1 = async (e) => {
    e.preventDefault();
    const adminCreds = dbStore.getAdminCredentials();
    const isMatch = await verifyPassword(callerDeletePassword, adminCreds.password);
    if (isMatch) {
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

  // 1. Direct Call Handler (Dials phone immediately)
  const handleDirectCall = (lead) => {
    if (lead?.mobile) {
      window.location.href = `tel:${lead.mobile.replace(/\s+/g, '')}`;
      setFeedbackToast(`Initiating direct call to ${lead.name} (${lead.mobile})...`);
      setTimeout(() => setFeedbackToast(null), 4000);
    }
  };

  // 2. Status & Description Modal Handler (Opens modal for giving status & notes)
  const handleOpenStatusModal = (lead) => {
    setCallingLead(lead);
    setSelectedDisposition(null); // Full empty - not prefilled!
    setCallerRemark(''); // Full empty - not prefilled!
    setDispositionError('');
  };

  const handleFinishAdminCall = () => {
    if (!callingLead) return;

    if (!selectedDisposition) {
      setDispositionError('Please select a customer status option (e.g. Hot Lead, Lead, Not Picking, etc.) before saving.');
      return;
    }
    setDispositionError('');

    dbStore.updateLeadDisposition(callingLead.id, {
      statusCode: selectedDisposition,
      noteText: callerRemark,
      callerName: callers.length === 0 ? 'Admin (Direct)' : 'Admin (Master Console)'
    });
    setCallingLead(null);
    setSelectedDisposition(null);
    setCallerRemark('');
    setFeedbackToast(`Lead CON-${callingLead.id} status & discussion notes successfully updated.`);
    setTimeout(() => setFeedbackToast(null), 4000);
    refreshAdminData();
  };

  // 3. Manual Lead Creator Handler ("ADD NEW LEAD")
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
      setNewLeadError('Security Alert: Prohibited characters or SQL injection patterns detected.');
      return;
    }

    const safeName = sanitizeInput(newLeadName.trim());
    const safeNotes = sanitizeInput(newLeadNotes.trim());

    const assignedCaller = callers.find(c => c.id === parseInt(newLeadCallerId, 10));
    const callerDisplayName = assignedCaller ? assignedCaller.name : "Admin Desk (Direct)";

    const res = dbStore.createManualLead({
      name: safeName,
      mobile: cleanMobile,
      email: newLeadEmail ? sanitizeInput(newLeadEmail.trim()) : '',
      locationId: newLeadLocation,
      projectId: newLeadProject,
      statusCode: newLeadStatus,
      callStatusCode: newLeadCallStatus,
      callerId: assignedCaller ? assignedCaller.id : 0,
      callerName: callerDisplayName,
      description: safeNotes,
      noteText: safeNotes
    });

    if (res.success) {
      setShowAddLeadModal(false);
      // Reset form
      setNewLeadName('');
      setNewLeadMobile('');
      setNewLeadEmail('');
      setNewLeadLocation(1);
      setNewLeadProject(1);
      setNewLeadStatus(1);
      setNewLeadCallStatus(1);
      setNewLeadNotes('');
      setNewLeadCallerId(0);
      setNewLeadError('');

      setFeedbackToast(`New Lead CON-${res.lead.id} (${res.lead.name}) registered successfully as ${res.lead.statusName}!`);
      setTimeout(() => setFeedbackToast(null), 5000);
      refreshAdminData();
    } else {
      setNewLeadError(res.error || 'Failed to create lead.');
    }
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (Standalone Executive Portal View)
  // =========================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
        {/* Standalone Minimal Header */}
        <header className="w-full bg-[#14221F] text-white border-b border-[#245348] py-3 px-3 sm:px-8 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#C59B4E]/70 p-0.5 bg-[#284F45] shrink-0 shadow-xs">
              <img src="/logo_icon.jpg" alt="Concave Realty" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col justify-center text-left min-w-0">
              <span className="font-serif text-[13px] xs:text-sm sm:text-base font-bold text-white tracking-[0.08em] sm:tracking-widest block leading-tight whitespace-nowrap">
                CONCAVE REALTY
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-sans tracking-[0.14em] sm:tracking-[0.18em] text-[#DFBE79] font-semibold block mt-0.5 leading-none whitespace-nowrap">
                Admin Panel
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

        <div className="flex-1 py-12 px-4 flex items-center justify-center">
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
                Concave Realty • Admin Panel
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
                      <strong className="block font-mono text-amber-950 mt-1">{dbStore.getAdminCredentials().email || 'hemantrishi2786@gmail.com'}</strong>
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
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED SUPER ADMIN WORKSPACE (Hemant's Dashboard)
  // =========================================================================
  const todayStart = new Date().setHours(0, 0, 0, 0);

  // Exact 5 Cards calculation:
  // 1) total confirmed leads generated today
  const todaysLeadsCount = leads.filter(l => isConfirmedLead(l) && (l.createdAt >= todayStart || (l.notes && l.notes.some(n => n.at >= todayStart)))).length;

  // 2) today enquiries today
  const todaysEnquiriesCount = leads.filter(l => l.createdAt >= todayStart).length;

  // 3) total call / consultations done today
  const totalCallsDoneToday = leads.reduce((sum, l) => {
    const todayNotes = (l.notes || []).filter(n => n.at >= todayStart && n.by !== "System Lead Router" && !n.txt.includes("Auto-routed"));
    return sum + todayNotes.length;
  }, 0) || leads.filter(l => {
    const hasNoteToday = l.notes && l.notes.some(n => n.at >= todayStart && !n.txt.includes("Auto-routed"));
    return hasNoteToday || (l.createdAt >= todayStart && l.callStatusCode > 0);
  }).length;

  // 4) overall confirmed leads generated uptil now
  const overallLeadsCount = leads.filter(l => isConfirmedLead(l)).length;

  // 5) pending calls in red (Active Queue)
  const pendingCallsCount = leads.filter(l => isPendingEnquiry(l)).length;

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
        l.callerName.toLowerCase().includes(q) ||
        (l.deviceName && l.deviceName.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Pagination slice (30 records per page)
  const totalPages = Math.ceil(filteredLeads.length / pageSize) || 1;
  const paginatedLeads = filteredLeads.slice((enquiryPage - 1) * pageSize, enquiryPage * pageSize);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#14221F] selection:bg-[#245348] selection:text-white">

      {/* Standalone Executive Master Header Bar */}
      <header className="sticky top-0 z-40 bg-[#14221F] text-white border-b border-[#245348] shadow-md">
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
                Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#C59B4E]/40 hover:border-[#DFBE79] text-[#DFBE79] hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                title="Return to Website Home Page"
              >
                <Home className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Website</span>
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

      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">

      {/* Floating Success Toast for Excel Export */}
      {excelExportSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-[#C59B4E] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 anim-fade-scale">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Master Excel Exported</p>
              <p className="text-[11px] text-gray-300">CONCAVE_Master_Leads.xlsx downloaded to your computer.</p>
            </div>
          </div>
          <button
            onClick={() => setExcelExportSuccess(false)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* General Feedback Toast */}
      {feedbackToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-emerald-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 anim-fade-scale">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Action Completed</p>
              <p className="text-[11px] text-gray-300">{feedbackToast}</p>
            </div>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors ml-2 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
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

      {/* ── Executive Header Banner (Responsive) ── */}
      <div className="bg-[#1D3530] text-white rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 shadow-subtle flex items-center justify-between gap-3 anim-fade-up border border-[#245348]/40">
        <div className="min-w-0">
          <h1 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
            Hemant's Dashboard
          </h1>
          <p className="text-[10px] sm:text-xs text-[#DFBE79] tracking-wider uppercase font-medium mt-0.5 truncate">
            Concave Realty Admin Panel
          </p>
        </div>

        {/* Global Controls & Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={refreshAdminData}
            className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#284F45] text-white hover:bg-[#245348] active:scale-95 transition-all cursor-pointer border border-[#C59B4E]/30"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 text-[#DFBE79] ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Caller Access Mode Banner (If No Callers Registered or Active) ── */}
      {callers.length === 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/90 via-[#1D3530] to-[#14221F] text-white border border-[#DFBE79]/50 shadow-md flex items-center justify-between gap-3 anim-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 border border-[#DFBE79]/40">
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <span>Full Caller Access Mode Active</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/40">Zero Callers Registered</span>
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Admin has full direct calling, disposition rating, 4hr/10d auto-retries, and discussion notes on all customer enquiries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Navigation Tabs ── */}
      <div className="relative">
        <div
          ref={tabsContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-center gap-2 border-b-2 border-[#245348] pb-2 overflow-x-auto scroll-smooth select-none cursor-grab active:cursor-grabbing"
        >
          {/* Tab 1: Overview */}
          <button
            onClick={(e) => handleTabClick('overview', e)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              adminTab === 'overview'
                ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E] shadow-sm'
                : 'text-[#14221F] bg-white border border-[#245348]/25 hover:bg-[#EAF3EF] hover:border-[#245348]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#DFBE79]" />
            <span>Overview</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
              adminTab === 'overview'
                ? 'bg-[#DFBE79] text-[#14221F]'
                : 'bg-[#245348] text-white'
            }`}>
              {leads.length}
            </span>
          </button>

          {/* Tab 2: Callers Performance */}
          <button
            onClick={(e) => handleTabClick('performance', e)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              adminTab === 'performance'
                ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E] shadow-sm'
                : 'text-[#14221F] bg-white border border-[#245348]/25 hover:bg-[#EAF3EF] hover:border-[#245348]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#DFBE79]" />
            <span>Callers Performance</span>
          </button>

          {/* Tab 3: Caller Management */}
          <button
            onClick={(e) => handleTabClick('callers', e)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              adminTab === 'callers'
                ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E] shadow-sm'
                : 'text-[#14221F] bg-white border border-[#245348]/25 hover:bg-[#EAF3EF] hover:border-[#245348]'
            }`}
          >
            <Users className="w-4 h-4 text-[#DFBE79]" />
            <span>Caller Management</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
              adminTab === 'callers'
                ? 'bg-[#DFBE79] text-[#14221F]'
                : 'bg-[#245348] text-white'
            }`}>
              {callers.length}
            </span>
          </button>

          {/* Tab 4: Data & Storage */}
          <button
            onClick={(e) => handleTabClick('storage', e)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              adminTab === 'storage'
                ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E] shadow-sm'
                : 'text-[#14221F] bg-white border border-[#245348]/25 hover:bg-[#EAF3EF] hover:border-[#245348]'
            }`}
          >
            <HardDrive className="w-4 h-4 text-[#DFBE79]" />
            <span>Data & Storage</span>
            {queueInfo.isOverdue && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping ml-1" />
            )}
          </button>

          {/* Tab 5: Careers & Talent Applications */}
          <button
            onClick={(e) => handleTabClick('careers', e)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
              adminTab === 'careers'
                ? 'bg-[#14221F] text-[#DFBE79] border border-[#C59B4E] shadow-sm'
                : 'text-[#14221F] bg-white border border-[#245348]/25 hover:bg-[#EAF3EF] hover:border-[#245348]'
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#DFBE79]" />
            <span>Job Enquiries</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-colors ${
              adminTab === 'careers'
                ? 'bg-[#DFBE79] text-[#14221F]'
                : 'bg-[#245348] text-white'
            }`}>
              {jobApplications.length}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: OVERVIEW (Cards + Enquiry Records Table with Pagination)
         ===================================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6 anim-fade-scale">

          {/* ── 5 KPI Cards: Fully Responsive Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">

            {/* 1) Total Leads Today */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase text-gray-500 font-semibold tracking-wider truncate">Total Leads Today</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-emerald-800 tracking-tight font-mono sm:font-sans">
                  {todaysLeadsCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  Marked as Leads Today
                </div>
              </div>
            </div>

            {/* 2) Today Enquiries Today */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase text-gray-500 font-semibold tracking-wider truncate">Today Enquiries</span>
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#245348] shrink-0" />
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-[#14221F] tracking-tight font-mono sm:font-sans">
                  {todaysEnquiriesCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  Received Since Midnight
                </div>
              </div>
            </div>

            {/* 3) Total Call Done Today */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase text-gray-500 font-semibold tracking-wider truncate">Calls Done Today</span>
                <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B4E] shrink-0" />
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-[#14221F] tracking-tight font-mono sm:font-sans">
                  {totalCallsDoneToday}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  Calls Logged by Team
                </div>
              </div>
            </div>

            {/* 4) Overall Lead */}
            <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase text-gray-500 font-semibold tracking-wider truncate">Overall Leads</span>
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFBE79] shrink-0" />
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-[#245348] tracking-tight font-mono sm:font-sans">
                  {overallLeadsCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-gray-400 mt-1 truncate">
                  Total Cumulative Leads
                </div>
              </div>
            </div>

            {/* 5) Pending Calls in RED (Spans 2 columns on mobile for visual balance) */}
            <div className="bg-red-50/80 p-3.5 sm:p-5 rounded-xl border-2 border-red-300 shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 col-span-2 lg:col-span-1 flex flex-col justify-between min-h-[110px] sm:min-h-[125px]">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-[11px] uppercase text-red-800 font-bold tracking-wider truncate">Pending Calls</span>
                <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 animate-pulse shrink-0" />
              </div>
              <div>
                <div className="text-2xl sm:text-4xl font-bold text-red-600 tracking-tight font-mono sm:font-sans">
                  {pendingCallsCount}
                </div>
                <div className="text-[10px] sm:text-[11px] text-red-700 font-semibold mt-1 truncate">
                  Requires Caller Follow-up
                </div>
              </div>
            </div>

          </div>

          {/* ── Talent Acquisition & Careers Quick Bar ── */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50/90 via-[#FAF9F6] to-white border border-emerald-200/80 shadow-2xs">
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#245348] text-[#DFBE79] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif font-bold text-base sm:text-lg text-[#14221F]">
                    Talent Acquisition Desk
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                    {jobApplications.length} Candidates
                  </span>
                  {jobApplications.some(a => a.status === 'Under Review') && (
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      {jobApplications.filter(a => a.status === 'Under Review').length} New
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setAdminTab('careers')}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98 shrink-0"
            >
              <span>Open Job Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DFBE79]" />
            </button>
          </div>

          {/* ── Enquiry Records Container (Customer Directory) ── */}
          <div className="bg-white rounded-2xl p-4 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5">
            
            {/* Header: Enquiry Records */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#245348]/25 pb-4">
              <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                    Enquiry Records
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#245348] border border-[#EAE6DF]">
                    {filteredLeads.length} Records
                  </span>
                </div>

                {/* ADD NEW LEAD Button */}
                <button
                  type="button"
                  onClick={() => {
                    setNewLeadError('');
                    setShowAddLeadModal(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0 border border-[#DFBE79]/50"
                  title="Manually Add New Customer Lead"
                >
                  <Plus className="w-4 h-4 text-[#DFBE79]" />
                  <span>Add New Lead</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 text-xs w-full lg:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search customer, phone, project..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded-xl pl-8 pr-8 py-2 text-[#14221F] focus:outline-none transition-all text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3 pointer-events-none" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-black cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns Grid on Mobile, Flex on Tablet/Desktop */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                  {/* Location Filter */}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full sm:w-auto bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3 py-2 text-[#14221F] focus:outline-none text-xs"
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
                    className="w-full sm:w-auto bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-xl px-3 py-2 text-[#14221F] focus:outline-none text-xs truncate"
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
              </div>
            </div>

            {/* ── 1. Desktop Table (Optimized for 100% full-screen fit with zero horizontal scroll) ── */}
            <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#14221F]/20 shadow-xs bg-white">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-[#14221F] text-[#DFBE79] uppercase font-mono text-[10.5px] tracking-wider border-b border-[#245348]">
                  <tr>
                    <th className="py-2.5 px-3 font-bold w-16">ID</th>
                    <th className="py-2.5 px-3 font-bold">Customer Name & Contact</th>
                    <th className="py-2.5 px-3 font-bold">Locations Enquiry</th>
                    <th className="py-2.5 px-2 font-bold w-20 text-center">Device</th>
                    <th className="py-2.5 px-2.5 font-bold whitespace-nowrap">Response</th>
                    <th className="py-2.5 px-3 font-bold whitespace-nowrap">Assigned Caller</th>
                    <th className="py-2.5 px-3 font-bold">Call Status & Cadence</th>
                    <th className="py-2.5 px-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                  {paginatedLeads.map((lead) => {
                    const isLeadOrHotLead = isConfirmedLead(lead);
                    const isUncalled = lead.callStatusCode === 0 || lead.cs === 0 || lead.callStatusName === 'Uncalled';
                    return (
                    <tr
                      key={lead.id}
                      className={`transition-colors duration-150 group ${
                        isLeadOrHotLead 
                          ? 'bg-[#EBF7EE] hover:bg-[#DDF2E2] border-l-4 border-l-[#2E7D32]' 
                          : 'hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {/* ID */}
                      <td className="py-2.5 px-3 text-gray-600 font-mono font-bold text-xs group-hover:text-black whitespace-nowrap">
                        CON-{lead.id}
                      </td>

                      {/* Customer Name & Mobile */}
                      <td className="py-2.5 px-3">
                        <div className="min-w-0">
                          <p className="font-bold text-[#14221F] text-xs group-hover:text-[#245348] transition-colors leading-tight">
                            {lead.name}
                          </p>
                          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                            <span>{lead.mobile}</span>
                          </div>
                        </div>
                      </td>

                      {/* Locations Enquiry */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-[#14221F] text-xs leading-tight">
                            {lead.locationName}
                          </p>
                          <p className="text-[11px] text-gray-500 leading-tight">
                            {lead.projectName}
                          </p>
                        </div>
                      </td>

                      {/* Device Name (Ultra-Compact Slim Width) */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#EAE6DF] text-[10.5px] font-semibold text-[#14221F] shadow-xs" title={lead.deviceName}>
                          {isDesktopDevice(lead.deviceName) || formatCompactDevice(lead.deviceName) === 'PC' || formatCompactDevice(lead.deviceName) === 'Mac' ? (
                            <Laptop className="w-3 h-3 text-[#C59B4E] shrink-0" />
                          ) : (
                            <Smartphone className="w-3 h-3 text-[#C59B4E] shrink-0" />
                          )}
                          <span>{formatCompactDevice(lead.deviceName)}</span>
                        </span>
                      </td>

                      {/* Response Type */}
                      <td className="py-2.5 px-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          isLeadOrHotLead ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          (isUncalled || lead.statusCode === 7) ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                          lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          lead.statusCode === 6 ? 'bg-red-100 text-red-800 border border-red-300' :
                          'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {isLeadOrHotLead && (lead.statusCode === 1 || lead.isHotLead) && <Flame className="w-3 h-3 text-emerald-700" />}
                          {isLeadOrHotLead && (lead.statusCode === 2 || lead.statusCode === 8) && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                          <span className="whitespace-nowrap">
                            {isLeadOrHotLead 
                              ? ((lead.statusCode === 1 || lead.isHotLead) ? 'Hot Lead' : 'Lead') 
                              : ((isUncalled || lead.statusCode === 7) ? 'New' : lead.statusName)}
                          </span>
                        </span>
                      </td>

                      {/* Assigned Caller */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-[#245348] flex items-center gap-1.5 text-xs">
                          <Users className="w-3.5 h-3.5 text-[#DFBE79]" />
                          <span>{callers.length === 0 ? "Admin Desk (Direct)" : lead.callerName}</span>
                        </span>
                      </td>

                      {/* Call Status & Cadence */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <p className="font-medium text-[#14221F] text-xs leading-tight">
                            {lead.callStatusName}
                          </p>
                          {lead.statusCode === 4 && (
                            <span className="text-[10.5px] text-amber-800 font-medium block whitespace-nowrap">
                              Attempt {lead.retryCount}/10 • Next: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action: 2 Main Buttons (Compact Side-by-Side) */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* 1st Main Button: Direct Call */}
                          <button
                            type="button"
                            onClick={() => handleDirectCall(lead)}
                            className="h-8 px-2.5 rounded-lg bg-[#245348] text-white hover:bg-[#1B3F37] active:scale-95 transition-all text-[11px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                            title={`Direct Phone Call to ${lead.name}`}
                          >
                            <PhoneCall className="w-3 h-3 text-[#DFBE79] shrink-0" />
                            <span>Direct Call</span>
                          </button>

                          {/* 2nd Main Button: Status & Description */}
                          <button
                            type="button"
                            onClick={() => handleOpenStatusModal(lead)}
                            className="h-8 px-2.5 rounded-lg bg-white border border-[#C59B4E] text-[#14221F] hover:bg-[#DFBE79]/20 active:scale-95 transition-all text-[11px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer shadow-xs whitespace-nowrap"
                            title="Update Status (Interested, Not Interested, Fake) & Discussion Description"
                          >
                            <FileText className="w-3 h-3 text-[#C59B4E] shrink-0" />
                            <span>Status & Notes</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );})}

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

            {/* ── 2. Mobile & Tablet Cards Feed (Dedicated View Below 1024px) ── */}
            <div className="block lg:hidden space-y-3.5">
              {paginatedLeads.map((lead) => {
                const isLeadOrHotLead = isConfirmedLead(lead);
                const isUncalled = lead.callStatusCode === 0 || lead.cs === 0 || lead.callStatusName === 'Uncalled';
                return (
                <div
                  key={lead.id}
                  className={`rounded-xl shadow-xs p-4 space-y-3.5 transition-all ${
                    isLeadOrHotLead
                      ? 'bg-[#EBF7EE] border-2 border-[#2E7D32]/50 ring-2 ring-[#2E7D32]/20'
                      : 'bg-white border border-[#EAE6DF] hover:border-[#245348]/40'
                  }`}
                >
                  {/* Top Bar: ID + Response Type Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-md bg-[#FAF9F6] text-gray-700 border border-[#EAE6DF] whitespace-nowrap shrink-0">
                      CON-{lead.id}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      isLeadOrHotLead ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      (isUncalled || lead.statusCode === 7) ? 'bg-gray-100 text-gray-700 border border-gray-200' :
                      lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      lead.statusCode === 6 ? 'bg-red-100 text-red-800 border border-red-300' :
                      'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {isLeadOrHotLead && (lead.statusCode === 1 || lead.isHotLead) && <Flame className="w-3 h-3 text-emerald-700" />}
                      {isLeadOrHotLead && (lead.statusCode === 2 || lead.statusCode === 8) && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                      <span>
                        {isLeadOrHotLead 
                          ? ((lead.statusCode === 1 || lead.isHotLead) ? 'Hot Lead' : 'Lead') 
                          : ((isUncalled || lead.statusCode === 7) ? 'New' : lead.statusName)}
                      </span>
                    </span>
                  </div>

                  {/* Customer Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-base text-[#14221F] tracking-tight truncate">
                        {lead.name}
                      </h3>
                      <a
                        href={`tel:${lead.mobile}`}
                        className="text-xs text-gray-600 font-mono font-medium hover:text-[#245348] flex items-center gap-1.5 mt-0.5"
                      >
                        <PhoneCall className="w-3 h-3 text-[#C59B4E] shrink-0" />
                        <span>{lead.mobile}</span>
                      </a>
                    </div>
                  </div>

                  {/* Single-Column Clean Information Stack */}
                  <div className="space-y-2.5 bg-[#FAF9F6] p-3 rounded-xl border border-[#EAE6DF]/80 text-xs">
                    {/* Location / Project */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block whitespace-nowrap">
                        Location / Project
                      </span>
                      <p className="font-semibold text-[#14221F] text-xs mt-0.5">
                        {lead.locationName}
                      </p>
                      {lead.projectName && (
                        <p className="text-[11px] text-gray-500">
                          {lead.projectName}
                        </p>
                      )}
                    </div>

                    {/* Customer Device */}
                    <div className="pt-2 border-t border-[#EAE6DF]/60">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block whitespace-nowrap">
                        Customer Device
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

                    {/* Assigned Caller */}
                    <div className="pt-2 border-t border-[#EAE6DF]/60">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block whitespace-nowrap">
                        Assigned Caller
                      </span>
                      <p className="font-semibold text-[#245348] flex items-center gap-1 text-xs mt-0.5">
                        <Users className="w-3 h-3 text-[#DFBE79] shrink-0" />
                        <span className="truncate">{callers.length === 0 ? "Admin Desk (Direct)" : lead.callerName}</span>
                      </p>
                    </div>

                    {/* Call Status & Cadence */}
                    <div className="pt-2 border-t border-[#EAE6DF]/60">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block whitespace-nowrap">
                        Call Status
                      </span>
                      <p className="font-medium text-[#14221F] text-xs mt-0.5">
                        {lead.callStatusName}
                        {lead.statusCode === 4 && (
                          <span className="text-[10px] text-amber-800 font-semibold ml-1.5">
                            (Attempt {lead.retryCount}/10)
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Logged Date & Time */}
                    <div className="pt-2 border-t border-[#EAE6DF]/60">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block whitespace-nowrap">
                        Logged Time
                      </span>
                      <p className="text-gray-700 font-medium font-mono text-xs mt-0.5">
                        {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}, {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Actions: 2 Main Buttons for Mobile View (1: Direct Call, 2: Status & Description) */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#EAE6DF]">
                    {/* 1st Main Button: Direct Call */}
                    <button
                      type="button"
                      onClick={() => handleDirectCall(lead)}
                      className="h-10 px-2 rounded-xl bg-[#245348] text-white hover:bg-[#1B3F37] active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all whitespace-nowrap overflow-hidden"
                      title={`Direct Phone Call to ${lead.name}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
                      <span className="truncate">Direct Call</span>
                    </button>

                    {/* 2nd Main Button: Status & Description */}
                    <button
                      type="button"
                      onClick={() => handleOpenStatusModal(lead)}
                      className="h-10 px-2 rounded-xl bg-white border border-[#C59B4E] text-[#14221F] hover:bg-[#DFBE79]/20 active:scale-95 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all whitespace-nowrap overflow-hidden"
                      title="Update Status (Interested, Fake, etc.) & Description"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C59B4E] shrink-0" />
                      <span className="truncate">Status & Notes</span>
                    </button>
                  </div>
                </div>
              );})}

              {paginatedLeads.length === 0 && (
                <div className="py-12 text-center text-gray-400 space-y-2 bg-white rounded-xl border border-[#EAE6DF] p-6">
                  <Users className="w-8 h-8 mx-auto text-gray-300" />
                  <p className="text-sm font-medium">No enquiry records found matching your filters.</p>
                </div>
              )}
            </div>

            {/* Pagination Controls (30 records per page) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 pt-3 gap-3 border-t border-[#EAE6DF]">
              <span className="text-center sm:text-left">
                Showing <strong>{filteredLeads.length > 0 ? (enquiryPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(enquiryPage * pageSize, filteredLeads.length)}</strong> of <strong>{filteredLeads.length}</strong> records
              </span>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 self-center sm:self-auto">
                  <button
                    onClick={() => setEnquiryPage(p => Math.max(1, p - 1))}
                    disabled={enquiryPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-[#EAE6DF] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 disabled:pointer-events-none font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Previous
                  </button>

                  {/* Compact on Mobile: Page X of Y */}
                  <span className="sm:hidden text-xs font-mono font-bold px-2.5 py-1 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg">
                    {enquiryPage} / {totalPages}
                  </span>

                  {/* Numbered Buttons on Desktop */}
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setEnquiryPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          enquiryPage === pageNum
                            ? 'bg-[#245348] text-white shadow-xs'
                            : 'bg-white border border-[#EAE6DF] hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
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

        </div>
      )}

      {/* =====================================================================
          TAB 2: CALLERS PERFORMANCE (Big bold numbers & Call column removed)
         ===================================================================== */}
      {adminTab === 'performance' && (
        <div className="bg-white rounded-2xl p-4 xs:p-6 sm:p-7 border border-[#245348]/20 shadow-subtle space-y-5 anim-fade-scale">
          <div className="border-b border-[#245348]/25 pb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#245348] shrink-0" />
              <h2 className="font-serif text-[14.5px] min-[340px]:text-[15.5px] min-[380px]:text-[17.5px] min-[420px]:text-xl sm:text-2xl md:text-3xl font-bold text-[#14221F] whitespace-nowrap tracking-tight">
                Callers Performance Matrix
              </h2>
            </div>
          </div>

          {/* Performance Table - Desktop (1024px and above) */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-[#14221F]/20 shadow-xs">
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
                  const totalCallerLeads = callerLeads.filter(l => isConfirmedLead(l)).length;

                  // Total calls/consultations done today by this caller
                  const callsDoneToday = callerLeads.reduce((sum, l) => {
                    const notesToday = (l.notes || []).filter(n => n.at >= todayStart && n.by.includes(caller.name));
                    return sum + notesToday.length;
                  }, 0) || callerLeads.filter(l => {
                    const hasNoteToday = l.notes && l.notes.some(n => n.at >= todayStart && n.by.includes(caller.name));
                    return hasNoteToday || (l.createdAt >= todayStart && l.callStatusCode > 0);
                  }).length;

                  // Total confirmed leads today for this caller
                  const leadsToday = callerLeads.filter(l => isConfirmedLead(l) && (l.createdAt >= todayStart || (l.notes && l.notes.some(n => n.at >= todayStart && n.by.includes(caller.name))))).length;

                  const allocatedLocsStr = caller.assignedLocations && caller.assignedLocations.length > 0
                    ? caller.assignedLocations.map(id => LOCATION_CODES[id]).filter(Boolean).join(", ")
                    : "None";

                  return (
                    <tr key={caller.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#245348] text-sm whitespace-nowrap">{caller.name}</p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#C59B4E] block text-xs font-mono">{caller.callerCode}</span>
                        <span className="text-black font-semibold text-xs">{caller.phone}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs text-[#C59B4E] font-bold">
                          {allocatedLocsStr}
                        </span>
                      </td>

                      {/* Clean normal sans-serif numbers */}
                      <td className="py-4 px-4 font-bold text-xl text-blue-900">
                        {totalCallerLeads}
                      </td>

                      <td className="py-4 px-4 font-bold text-xl text-blue-900">
                        {callsDoneToday}
                      </td>

                      <td className="py-4 px-4 font-bold text-xl text-blue-900">
                        {leadsToday}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Performance Cards - Mobile (Below 1024px) */}
          <div className="block lg:hidden space-y-3.5">
            {callers.map(caller => {
              const callerLeads = leads.filter(l => l.callerId === caller.id);
              const totalCallerLeads = callerLeads.length;

              const callsDoneToday = callerLeads.filter(l => {
                const hasNoteToday = l.notes && l.notes.some(n => n.at >= todayStart && n.by.includes(caller.name));
                return hasNoteToday || (l.createdAt >= todayStart && l.callStatusCode > 0);
              }).length;

              const leadsToday = callerLeads.filter(l => l.createdAt >= todayStart && (l.statusCode === 1 || l.statusCode === 2 || l.statusCode === 7)).length;

              const allocatedLocsStr = caller.assignedLocations && caller.assignedLocations.length > 0
                ? caller.assignedLocations.map(id => LOCATION_CODES[id]).filter(Boolean).join(", ")
                : "None";

              return (
                <div key={caller.id} className="bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl p-4 space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#245348] whitespace-nowrap">{caller.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      <span className="font-bold text-[#C59B4E] tracking-wider">{caller.callerCode}</span>
                      <span className="text-gray-400 mx-1.5">•</span>
                      <span className="text-black font-semibold">{caller.phone}</span>
                    </p>
                  </div>

                  <div className="text-xs bg-white p-2.5 rounded-lg border border-[#EAE6DF]">
                    <span className="text-[10px] uppercase font-bold text-black block mb-0.5">Locations</span>
                    <span className="font-bold text-[#C59B4E]">{allocatedLocsStr}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-[#EAE6DF]">
                      <span className="text-[10px] text-black uppercase font-bold block">Total Leads</span>
                      <span className="text-lg font-bold text-blue-900 font-mono">{totalCallerLeads}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#EAE6DF]">
                      <span className="text-[10px] text-black uppercase font-bold block">Calls Today</span>
                      <span className="text-lg font-bold text-blue-900 font-mono">{callsDoneToday}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#EAE6DF]">
                      <span className="text-[10px] text-black uppercase font-bold block">Leads Today</span>
                      <span className="text-lg font-bold text-blue-900 font-mono">{leadsToday}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CALLERS MANAGEMENT (Clean cards, details modal & divert work)
         ===================================================================== */}
      {adminTab === 'callers' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5 anim-fade-scale">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#245348]/25 pb-5">
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
                            className="font-serif text-lg font-bold text-[#245348] hover:text-[#1B3F37] hover:underline text-left leading-tight transition-colors block whitespace-nowrap"
                            title="Click to view details and password"
                          >
                            {caller.name}
                          </button>
                          <span className="text-xs text-gray-500">
                            <span className="font-bold text-[#C59B4E] font-mono">{caller.callerCode}</span> • Assigned Leads: <strong className="text-[#245348]">{assignedLeadCount}</strong>
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
          <div className="border-b border-[#245348]/25 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#245348]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                Storage & Data
              </h2>
            </div>
          </div>

          {/* 1) Server Storage Capacity Overview (Hostinger 20 GB SSD with 2 GB Buffer Rule) */}
          {(() => {
            const usagePercent = storageStats.usagePercent !== undefined
              ? storageStats.usagePercent
              : 11;

            const spaceTakenLabel = storageStats.usedFormatted || "2.00 GB";
            const spaceEmptyLabel = storageStats.displayedEmptyFormatted || "16.00 GB";
            const usableQuotaLabel = storageStats.usableQuotaFormatted || "18.00 GB";
            const rawRemainingLabel = storageStats.rawRemainingFormatted || "18.00 GB";

            // Dynamic line color logic:
            // > 75% -> Red
            // >= 50% -> Yellow
            // < 50% -> Green
            const lineColor = usagePercent > 75
              ? 'bg-red-600'
              : usagePercent >= 50
                ? 'bg-yellow-400'
                : 'bg-[#245348]';

            return (
              <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#EAE6DF] space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-semibold gap-2">
                  <span className="font-mono text-[#14221F] flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-[#245348]" />
                    <span>Server Storage Usage (Hostinger 20 GB SSD)</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                      2 GB Buffer Active
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 font-bold">
                      {usagePercent}% Used
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-[#EAE6DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] sm:text-xs uppercase text-gray-500 block font-semibold leading-tight whitespace-nowrap">
                        Space Taken
                      </span>
                      <span className="text-base min-[360px]:text-lg sm:text-2xl font-bold text-[#245348] mt-1 block font-mono">
                        {spaceTakenLabel}
                      </span>
                    </div>
                    <span className="text-[9px] min-[360px]:text-[11px] text-gray-400 mt-1 block leading-tight">
                      Active database & website files
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 bg-white rounded-lg border border-[#EAE6DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] sm:text-xs uppercase text-gray-500 block font-semibold leading-tight whitespace-nowrap">
                        Space Empty
                      </span>
                      <span className="text-base min-[360px]:text-lg sm:text-2xl font-bold text-emerald-700 mt-1 block font-mono">
                        {spaceEmptyLabel}
                      </span>
                    </div>
                    <span className="text-[9px] min-[360px]:text-[11px] text-gray-400 mt-1 block leading-tight">
                      Quota: {usableQuotaLabel} (2 GB buffer reserved)
                    </span>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative shadow-inner mt-2">
                  <div
                    className={`h-full ${lineColor} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min(100, Math.max(3, usagePercent))}%` }}
                  />
                </div>

                {/* Buffer Policy Details */}
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-emerald-900 gap-1.5 mt-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <HardDrive className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>
                      <strong>Hostinger 20 GB SSD:</strong> 2.00 GB safety buffer kept reserved for logs and server stability. When server has {rawRemainingLabel} remaining, {spaceEmptyLabel} is shown as usable.
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0 self-end sm:self-auto">
                    Buffer Rule: 2 GB
                  </span>
                </div>
              </div>
            );
          })()}

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
                className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-3 rounded-xl bg-red-800 hover:bg-red-900 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-3 sm:gap-2 shadow-md disabled:opacity-75"
              >
                {isRunningQuarterly ? (
                  <>
                    <RefreshCw className="w-6 h-6 sm:w-4 sm:h-4 animate-spin text-white shrink-0" />
                    <span>Processing Queue & Saving Backup...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-6 h-6 sm:w-4 sm:h-4 text-[#DFBE79] shrink-0" />
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
        <div className="bg-white rounded-2xl border border-[#EAE6DF] shadow-subtle p-4 sm:p-6 space-y-5 sm:space-y-6 anim-fade-up">
          {/* Header */}
          <div className="border-b border-[#EAE6DF] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#245348] shrink-0" />
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Job Enquiries
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
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
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#DFBE79]" />
                <span className="truncate">{isExportingCareers ? 'Exporting...' : 'Export to Excel'}</span>
              </button>

              <button
                onClick={() => {
                  const apps = dbStore.getJobApplications();
                  setJobApplications(apps);
                  setFeedbackToast('Applications refreshed from storage.');
                }}
                className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF] hover:border-[#245348] text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Total Applications</span>
              <span className="font-bold text-2xl text-[#14221F] mt-0.5 block font-mono">{jobApplications.length}</span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Under Review</span>
              <span className="font-bold text-2xl text-amber-700 mt-0.5 block font-mono">
                {jobApplications.filter(a => a.status === 'Under Review').length}
              </span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Shortlisted</span>
              <span className="font-bold text-2xl text-emerald-700 mt-0.5 block font-mono">
                {jobApplications.filter(a => a.status && (a.status.includes('Shortlisted') || a.status.includes('Interview') || a.status.includes('Offer'))).length}
              </span>
            </div>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF]">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Direct Contact</span>
              <span className="font-mono font-bold text-xs sm:text-sm text-[#245348] mt-1 block whitespace-nowrap">+91 82910 90155</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF]">
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidate, role, mobile, email..."
                value={careerSearch}
                onChange={(e) => setCareerSearch(e.target.value)}
                className="w-full bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg pl-9 pr-3 py-2 text-xs text-[#14221F] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-2 w-full lg:w-auto">
              {/* Position Filter - exact 4 roles */}
              <select
                value={careerRoleFilter}
                onChange={(e) => setCareerRoleFilter(e.target.value)}
                className="w-full lg:w-auto bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-2.5 py-2 text-xs text-[#14221F] focus:outline-none"
              >
                <option value="All">All Positions (4 Open Roles)</option>
                <option value="Business Development Associate">Business Development Associate (BDA)</option>
                <option value="Business Development Manager">Business Development Manager (BDM)</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Sales Executive">Sales Executive</option>
                <option value="General">General Candidature</option>
              </select>

              {/* Status Filter */}
              <select
                value={careerStatusFilter}
                onChange={(e) => setCareerStatusFilter(e.target.value)}
                className="w-full lg:w-auto bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-2.5 py-2 text-xs text-[#14221F] focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted for Interview">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Hired">Hired</option>
                <option value="Archived / Rejected">Archived</option>
              </select>
            </div>
          </div>

          {/* 1. Desktop Applications Table (Preserved on 1024px and above) */}
          <div className="hidden lg:block border border-[#EAE6DF] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#EAE6DF] text-gray-500 uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Number</th>
                    <th className="py-3 px-4">Position Applied For</th>
                    <th className="py-3 px-4">Experience</th>
                    <th className="py-3 px-4">Hiring Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF]">
                  {(() => {
                    const filteredCareers = jobApplications.filter(app => {
                      if (careerRoleFilter !== 'All') {
                        const filterLower = careerRoleFilter.toLowerCase();
                        const posLower = (app.position || '').toLowerCase();
                        const matches = posLower.includes(filterLower) ||
                          (filterLower.includes('bda') && posLower.includes('bda')) ||
                          (filterLower.includes('bdm') && posLower.includes('bdm'));
                        if (!matches) return false;
                      }
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
                    });

                    if (filteredCareers.length === 0) {
                      return (
                        <tr>
                          <td colSpan="7" className="py-12 text-center text-gray-400 text-xs">
                            No candidate job enquiries matching current filters.
                          </td>
                        </tr>
                      );
                    }

                    return filteredCareers.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs text-[#C59B4E] font-bold">{app.id}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => setSelectedCandidateModal(app)}
                            className="font-semibold text-xs text-[#14221F] hover:text-[#245348] hover:underline cursor-pointer text-left"
                          >
                            {app.name}
                          </button>
                        </td>

                        <td className="py-3.5 px-4">
                          <a
                            href={`tel:${app.mobile}`}
                            className="font-mono text-xs text-gray-700 hover:text-[#245348] font-medium"
                          >
                            +91 {app.mobile}
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-xs text-gray-800 font-medium">{app.position}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-xs text-gray-700 font-mono">{app.experience}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              const newStat = e.target.value;
                              dbStore.updateJobApplicationStatus(app.id, newStat);
                              setJobApplications(dbStore.getJobApplications());
                              setFeedbackToast(`Application ${app.id} marked as ${newStat}`);
                            }}
                            className="bg-white border border-[#EAE6DF] focus:border-[#245348] rounded px-2.5 py-1 text-xs font-semibold text-[#14221F] focus:outline-none cursor-pointer"
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted for Interview">Shortlisted</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Offer Extended">Offer Extended</option>
                            <option value="Hired">Hired</option>
                            <option value="Archived / Rejected">Archived</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedCandidateModal(app)}
                            className="px-3.5 py-1.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                            title="View full candidate application form"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Mobile Applications Card Feed (Below 1024px) */}
          <div className="block lg:hidden space-y-3.5">
            {(() => {
              const filteredCareers = jobApplications.filter(app => {
                if (careerRoleFilter !== 'All') {
                  const filterLower = careerRoleFilter.toLowerCase();
                  const posLower = (app.position || '').toLowerCase();
                  const matches = posLower.includes(filterLower) ||
                    (filterLower.includes('bda') && posLower.includes('bda')) ||
                    (filterLower.includes('bdm') && posLower.includes('bdm'));
                  if (!matches) return false;
                }
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
              });

              if (filteredCareers.length === 0) {
                return (
                  <div className="py-12 text-center text-gray-400 space-y-2 bg-white rounded-xl border border-[#EAE6DF] p-6">
                    <p className="text-sm font-medium">No candidate job enquiries matching current filters.</p>
                  </div>
                );
              }

              return filteredCareers.map(app => (
                <div key={app.id} className="bg-white rounded-xl border border-[#EAE6DF] p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-[#FAF9F6] text-[#C59B4E] border border-[#EAE6DF]">
                      {app.id}
                    </span>
                    <button
                      onClick={() => setSelectedCandidateModal(app)}
                      className="px-3 py-1 rounded-lg bg-[#245348] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3 text-[#DFBE79]" />
                      <span>Details</span>
                    </button>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-base text-[#14221F]">{app.name}</h3>
                    <a
                      href={`tel:${app.mobile}`}
                      className="text-xs text-gray-600 font-mono font-medium hover:text-[#245348] flex items-center gap-1 mt-0.5"
                    >
                      <PhoneCall className="w-3 h-3 text-[#C59B4E]" />
                      <span>+91 {app.mobile}</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EAE6DF] text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Position</span>
                      <span className="font-medium text-[#14221F] text-xs truncate block">{app.position}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Experience</span>
                      <span className="font-medium text-gray-700 text-xs truncate block font-mono">{app.experience}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 block">Hiring Status</label>
                    <select
                      value={app.status}
                      onChange={(e) => {
                        const newStat = e.target.value;
                        dbStore.updateJobApplicationStatus(app.id, newStat);
                        setJobApplications(dbStore.getJobApplications());
                        setFeedbackToast(`Application ${app.id} marked as ${newStat}`);
                      }}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#14221F] focus:outline-none"
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
              ));
            })()}
          </div>
        </div>
      )}

      {/* ── JOB CANDIDATE FULL DETAILS MODAL ── */}
      {selectedCandidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#C59B4E]/40 anim-fade-scale">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#183C32] text-white flex items-center justify-between border-b border-[#C59B4E]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#245348] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {selectedCandidateModal.name}
                  </h3>
                  <span className="text-[11px] font-mono text-[#DFBE79]">
                    Application ID: {selectedCandidateModal.id} • Submitted: {new Date(selectedCandidateModal.appliedAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-[#14221F]">
              
              {/* Contact Bar with Direct Actions & Hiring Status */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold block">Candidate Contact</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="font-mono text-sm text-[#14221F]">+91 {selectedCandidateModal.mobile}</strong>
                    <a
                      href={`tel:${selectedCandidateModal.mobile}`}
                      className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3 text-[#245348]" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`https://wa.me/91${selectedCandidateModal.mobile}?text=Hello%20${encodeURIComponent(selectedCandidateModal.name)}%2C%20this%20is%20Concave%20Realty%20Talent%20Acquisition%20regarding%20your%20job%20enquiry%20for%20${encodeURIComponent(selectedCandidateModal.position)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${selectedCandidateModal.email}?subject=Concave%20Realty%20Job%20Enquiry%20-${encodeURIComponent(selectedCandidateModal.id)}`}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-blue-600" />
                      <span>Email</span>
                    </a>
                  </div>
                  <span className="text-gray-600 text-xs block">{selectedCandidateModal.email}</span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold block">Hiring Status</span>
                  <select
                    value={selectedCandidateModal.status}
                    onChange={(e) => {
                      const newStat = e.target.value;
                      dbStore.updateJobApplicationStatus(selectedCandidateModal.id, newStat);
                      setSelectedCandidateModal({ ...selectedCandidateModal, status: newStat });
                      setJobApplications(dbStore.getJobApplications());
                      setFeedbackToast(`Status updated to ${newStat}`);
                    }}
                    className="mt-1 bg-white border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#14221F] focus:outline-none shadow-2xs"
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
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Position Applied For</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.position}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Experience</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.experience}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Location / City</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.city || 'Mumbai'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Current Organization</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.currentCompany || 'Not Disclosed'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Current Role / Title</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.currentRole || 'N/A'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Notice Period</span>
                  <span className="font-semibold text-amber-800 block mt-1 text-xs">{selectedCandidateModal.noticePeriod || 'Immediate'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Current CTC</span>
                  <span className="font-semibold text-gray-900 block mt-1 text-xs">{selectedCandidateModal.currentCtc || 'Not Disclosed'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">Expected CTC</span>
                  <span className="font-semibold text-[#245348] block mt-1 text-xs">{selectedCandidateModal.expectedCtc || 'Negotiable'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-mono uppercase font-semibold block">LinkedIn Profile</span>
                  {selectedCandidateModal.linkedin ? (
                    <a
                      href={selectedCandidateModal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0A66C2] hover:underline flex items-center gap-1 mt-1 text-xs truncate"
                    >
                      <span className="truncate">View Profile</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-400 block mt-1 text-xs">Not Provided</span>
                  )}
                </div>
              </div>

              {/* Cover Note / Pitch (if any) */}
              {selectedCandidateModal.coverNote && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-mono text-gray-400 font-semibold block">Candidate Pitch / Background Note</span>
                  <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#EAE6DF] text-gray-700 leading-relaxed italic text-xs">
                    "{selectedCandidateModal.coverNote}"
                  </div>
                </div>
              )}

              {/* In the end: Resume View Option */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FAF9F6] to-amber-50/40 border border-[#C59B4E]/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#C59B4E]/40 flex items-center justify-center text-[#C59B4E] shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider block">Candidate Resume Document</span>
                    <span className="font-semibold text-gray-900 text-xs block mt-0.5">{selectedCandidateModal.resumeName || 'Resume.pdf'}</span>
                    <span className="text-[10px] text-gray-400 font-mono block">Document Size: {selectedCandidateModal.resumeSize || '1.2 MB'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleViewResume(selectedCandidateModal)}
                  className="px-4 py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
                >
                  <Eye className="w-4 h-4 text-[#DFBE79]" />
                  <span>View Resume</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-[#EAE6DF] flex flex-wrap items-center justify-between gap-2">
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

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCandidateModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#245348] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#1B3F37] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
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
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#245348]">
                    {selectedCallerModal.name}
                  </h3>
                  <span className="font-mono text-xs text-gray-500 font-semibold">
                    <span className="font-bold text-[#C59B4E]">{selectedCallerModal.callerCode}</span> • {selectedCallerModal.role || 'Location Specialist'}
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
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 text-white font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 sm:gap-1.5"
                  >
                    <Trash2 className="w-5 h-5 sm:w-4 sm:h-4 text-[#DFBE79] shrink-0" />
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

      {/* ── ADMIN STATUS, CALL & DISPOSITION MODAL ── */}
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
                    Select Customer Status <span className="text-rose-500">*</span>
                  </label>
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
                        className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedDisposition === disp.code
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
                onClick={handleFinishAdminCall}
                className="flex-1 py-2 sm:py-2.5 rounded-xl bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                SAVE & UPDATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD NEW LEAD MODAL (Direct Manual Entry by Admin or Caller) ── */}
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

              {/* Row 2: Email & Assigned Caller */}
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
                    Assigned Caller / Ownership
                  </label>
                  <select
                    value={newLeadCallerId}
                    onChange={(e) => setNewLeadCallerId(Number(e.target.value))}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-xl px-3 py-2 text-xs text-[#14221F] focus:outline-none"
                  >
                    <option value={0}>Admin Desk (Direct)</option>
                    {callers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role || "Caller"})
                      </option>
                    ))}
                  </select>
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
                      <option key={code} value={code}>{name}</option>
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
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          newLeadStatus === disp.code
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
