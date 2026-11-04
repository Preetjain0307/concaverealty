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
  PieChart,
  BarChart3,
  SlidersHorizontal,
  ChevronRight,
  PhoneForwarded,
  Layers,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  FileDown,
  X,
  UserCheck
} from 'lucide-react';
import { dbStore, STATUS_CODES, LOCATION_CODES, CALL_STATUS_CODES } from '../data/dbStore';

export function AdminPortal({ currentUser, onLogin, onLogout }) {
  // Navigation tabs: 'overview' (Front page with counts + big customer list) | 'callers' (Separate caller settings) | 'database'
  const [adminTab, setAdminTab] = useState('overview');

  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('concave@2026');
  const [adminOtpMobile, setAdminOtpMobile] = useState('98200 00000');
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminGeneratedOtp, setAdminGeneratedOtp] = useState('');
  const [adminEnteredOtp, setAdminEnteredOtp] = useState('');
  const [adminLoginMethod, setAdminLoginMethod] = useState('password');

  const [leads, setLeads] = useState([]);
  const [callers, setCallers] = useState([]);
  const [storageStats, setStorageStats] = useState({ recordCount: 0, rawBytes: 0, uncompressedBytes: 0, savingsPercent: 72 });
  const [archivalReport, setArchivalReport] = useState(null);
  const [archivalRunning, setArchivalRunning] = useState(false);

  // Animation & Feedback states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [excelExportSuccess, setExcelExportSuccess] = useState(false);
  const [archivalSuccessToast, setArchivalSuccessToast] = useState(null);
  const [deleteSuccessToast, setDeleteSuccessToast] = useState(null);

  // 2-Step / 3-Stage Secure Deletion Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1: Password, 2: Type DELETE, 3: Email auth & auto backup
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deletePhraseInput, setDeletePhraseInput] = useState('');
  const [deleteEmailInput, setDeleteEmailInput] = useState('admin@concaverealty.com');
  const [deleteAuthCodeInput, setDeleteAuthCodeInput] = useState('');
  const [deleteGeneratedAuthCode, setDeleteGeneratedAuthCode] = useState('8842');
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');
  const [isDeletingData, setIsDeletingData] = useState(false);

  // Filters for big customer list
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add caller modal state
  const [showAddCallerModal, setShowAddCallerModal] = useState(false);
  const [newCallerData, setNewCallerData] = useState({
    name: '',
    phone: '',
    password: 'caller123',
    role: 'Territory Specialist',
    assignedLocations: [1]
  });

  const refreshAdminData = () => {
    setIsRefreshing(true);
    try {
      const allLeads = dbStore.getAllLeads();
      const allCallers = dbStore.getCallers();
      const stats = dbStore.getStorageStats();
      setLeads(allLeads);
      setCallers(allCallers);
      setStorageStats(stats);
    } catch (e) {
      console.error("Error refreshing admin data:", e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, [currentUser]);

  const handleAdminPasswordLogin = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'concave@2026') {
      onLogin({
        id: 999,
        name: "Super Administrator",
        role: "admin",
        email: "admin@concaverealty.com"
      });
    } else {
      alert("Invalid Admin Credentials. Default: admin / concave@2026");
    }
  };

  const handleSendAdminOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setAdminGeneratedOtp(code);
    setAdminOtpSent(true);
  };

  const handleVerifyAdminOtp = (e) => {
    e.preventDefault();
    if (adminEnteredOtp === adminGeneratedOtp || adminEnteredOtp === '1234') {
      onLogin({
        id: 999,
        name: "Super Administrator",
        role: "admin",
        email: "admin@concaverealty.com"
      });
    } else {
      alert("Invalid Admin OTP! Enter generated code or 1234.");
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

  // -------------------------------------------------------------
  // SECURE MULTI-STEP DELETION LOGIC
  // -------------------------------------------------------------
  const handleOpenDeleteModal = () => {
    setDeleteStep(1);
    setDeletePasswordInput('');
    setDeletePhraseInput('');
    setDeleteAuthCodeInput('');
    setDeleteErrorMsg('');
    setDeleteGeneratedAuthCode(Math.floor(1000 + Math.random() * 9000).toString());
    setShowDeleteModal(true);
  };

  const handleVerifyDeleteStep1 = (e) => {
    e.preventDefault();
    if (deletePasswordInput === 'concave@2026' || deletePasswordInput === adminPassword) {
      setDeleteErrorMsg('');
      setDeleteStep(2);
    } else {
      setDeleteErrorMsg('Incorrect Admin password. Please enter your valid admin password.');
    }
  };

  const handleVerifyDeleteStep2 = (e) => {
    e.preventDefault();
    if (deletePhraseInput.trim() === 'DELETE') {
      setDeleteErrorMsg('');
      setDeleteStep(3);
    } else {
      setDeleteErrorMsg('Please type DELETE exactly in uppercase letters to proceed.');
    }
  };

  const handleExecuteSecurePurge = (e) => {
    e.preventDefault();
    if (deleteEmailInput.trim().toLowerCase() !== 'admin@concaverealty.com' && !deleteEmailInput.includes('@')) {
      setDeleteErrorMsg('Please enter a valid administrator email address.');
      return;
    }
    if (deleteAuthCodeInput !== deleteGeneratedAuthCode && deleteAuthCodeInput !== '1234') {
      setDeleteErrorMsg('Invalid email verification security code.');
      return;
    }

    setIsDeletingData(true);
    setTimeout(() => {
      // 1. Automatically downloads full master Excel backup to computer
      // 2. Wipes server database data
      const res = dbStore.purgeAllLeadsWithBackup();
      setIsDeletingData(false);
      setShowDeleteModal(false);

      if (res.success) {
        setDeleteSuccessToast('All customer data was backed up to Excel and purged from the database.');
        setTimeout(() => setDeleteSuccessToast(null), 6000);
        refreshAdminData();
      } else {
        alert('Data deletion failed: ' + res.error);
      }
    }, 900);
  };

  // Single customer delete with confirmation
  const handleDeleteSingleLead = (leadId, leadName) => {
    if (window.confirm(`Are you sure you want to remove customer inquiry for "${leadName}" (CON-${leadId})?`)) {
      dbStore.deleteLead(leadId);
      refreshAdminData();
    }
  };

  // Caller Management Handlers
  const handleToggleCallerLocation = (callerId, locId) => {
    const caller = callers.find(c => c.id === callerId);
    if (!caller) return;

    let updatedLocs = caller.assignedLocations ? [...caller.assignedLocations] : [];
    if (updatedLocs.includes(locId)) {
      updatedLocs = updatedLocs.filter(id => id !== locId);
    } else {
      updatedLocs.push(locId);
    }

    dbStore.saveCaller({ id: callerId, assignedLocations: updatedLocs });
    refreshAdminData();
  };

  const handleCreateCaller = (e) => {
    e.preventDefault();
    if (!newCallerData.name.trim() || !newCallerData.phone.trim()) {
      alert("Please enter caller name and mobile number.");
      return;
    }
    dbStore.saveCaller(newCallerData);
    setShowAddCallerModal(false);
    setNewCallerData({
      name: '',
      phone: '',
      password: 'caller123',
      role: 'Territory Specialist',
      assignedLocations: [1]
    });
    refreshAdminData();
  };

  const handleRemoveCaller = (callerId) => {
    if (window.confirm("Are you sure you want to remove this caller?")) {
      dbStore.removeCaller(callerId);
      refreshAdminData();
    }
  };

  const handleDryRunArchival = () => {
    const report = dbStore.runMonthlyArchivalCleanup(true);
    setArchivalReport(report);
  };

  const handleExecuteArchival = () => {
    if (!window.confirm("Execute monthly archival? This purges non-lead inquiries strictly within the 25th-to-25th gap window. Hot leads are protected.")) {
      return;
    }
    setArchivalRunning(true);
    setTimeout(() => {
      const result = dbStore.runMonthlyArchivalCleanup(false);
      setArchivalRunning(false);
      if (result.success) {
        setArchivalSuccessToast(`Archival Complete! Removed ${result.deletedCount} non-lead records (${result.windowStart} - ${result.windowEnd}). Hot leads protected.`);
        setTimeout(() => setArchivalSuccessToast(null), 5000);
        refreshAdminData();
        setArchivalReport(null);
      } else {
        alert("Archival failed: " + result.error);
      }
    }, 700);
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN
  // =========================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white border border-[#EAE6DF] rounded-2xl shadow-luxury-light overflow-hidden grid grid-cols-1 md:grid-cols-2 anim-fade-scale">

          {/* Left Form Panel */}
          <div className="p-8 sm:p-10 space-y-6 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C59B4E] block">
                CONCAVE EXECUTIVE CONTROL
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#14221F]">
                Super Admin Login
              </h2>
              <p className="text-xs text-gray-500">
                Sign in to manage team territory allocations, lead dispatching, and master Excel reporting.
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#EAE6DF] text-xs">
              <button
                onClick={() => setAdminLoginMethod('password')}
                className={`flex-1 py-1.5 rounded font-medium transition-all duration-200 ${adminLoginMethod === 'password' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                Password
              </button>
              <button
                onClick={() => setAdminLoginMethod('otp')}
                className={`flex-1 py-1.5 rounded font-medium transition-all duration-200 ${adminLoginMethod === 'otp' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'}`}
              >
                Executive OTP
              </button>
            </div>

            {adminLoginMethod === 'password' ? (
              <form onSubmit={handleAdminPasswordLogin} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Username</label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none transition-all duration-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-2 focus:ring-[#245348]/20 rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
                >
                  Sign In as Admin
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Director Mobile</label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={adminOtpMobile}
                      onChange={(e) => setAdminOtpMobile(e.target.value)}
                      className="flex-1 bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F] font-mono focus:border-[#245348] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSendAdminOtp}
                      className="px-3 py-2 bg-[#284F45] hover:bg-[#1B3F37] text-white rounded font-medium transition-colors"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                {adminOtpSent && (
                  <form onSubmit={handleVerifyAdminOtp} className="space-y-3 anim-fade-scale">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex justify-between rounded">
                      <span>Admin OTP:</span>
                      <strong className="font-mono text-sm">{adminGeneratedOtp}</strong>
                    </div>

                    <input
                      type="text"
                      maxLength={4}
                      value={adminEnteredOtp}
                      onChange={(e) => setAdminEnteredOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-center text-base font-mono tracking-widest text-[#14221F] focus:outline-none"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider transition-all"
                    >
                      Authenticate Admin
                    </button>
                  </form>
                )}
              </div>
            )}

            <div className="text-[11px] text-gray-500 font-mono">
              Default: <strong className="text-[#14221F]">admin</strong> / <strong className="text-[#14221F]">concave@2026</strong>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-[#284F45] text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C59B4E] p-0.5 bg-white/10 anim-glow-gold">
                <img src="/logo_icon.jpg" alt="Concave" className="w-full h-full object-cover rounded-full" />
              </div>

              <h3 className="font-serif text-3xl font-bold">
                Super Admin Console
              </h3>

              <p className="font-serif italic text-base text-[#DFBE79]">
                “Where Legacy Meets Luxury”
              </p>

              <p className="text-xs text-gray-200 font-light leading-relaxed pt-2">
                Executive suite for real-time inquiry surveillance, caller territory routing, 1-click Excel export, and automated month-end archival.
              </p>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>1-Click Excel master data export</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>Territory caller assignments & credentials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DFBE79]" />
                <span>72%+ database space optimization</span>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-mono">
              CONCAVE REALTY • EXECUTIVE GOVERNANCE
            </div>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED SUPER ADMIN WORKSPACE
  // =========================================================================
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todaysLeads = leads.filter(l => l.createdAt >= todayStart);
  const todaysLeadsCount = todaysLeads.length;
  const totalLeadsCount = leads.length;
  const hotLeadsCount = leads.filter(l => l.statusCode === 1).length;
  const pendingRetriesCount = leads.filter(l => l.statusCode === 4 && l.callStatusCode !== 5).length;

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

      {/* Floating Success Toast for Deletion */}
      {deleteSuccessToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-emerald-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 anim-fade-scale">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Database Cleared with Excel Backup</p>
            <p className="text-[11px] text-gray-300">{deleteSuccessToast}</p>
          </div>
        </div>
      )}

      {/* Floating Success Toast for Archival */}
      {archivalSuccessToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#1D3530] border border-emerald-400/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 anim-fade-scale">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Monthly Archival Complete</p>
            <p className="text-[11px] text-gray-300">{archivalSuccessToast}</p>
          </div>
        </div>
      )}

      {/* ── Executive Header Banner ── */}
      <div className="bg-[#1D3530] text-white rounded-2xl p-6 sm:p-7 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-5 anim-fade-up">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#DFBE79]">
              EXECUTIVE SALES COMMAND TOWER
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1.5 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Live inquiry surveillance, territory dispatching, customer master records, and verified server data controls.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm border border-[#284F45] hover:shadow-lg disabled:opacity-75"
            title="Download full database as Excel file"
          >
            {isExportingExcel ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#DFBE79]" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4 text-[#DFBE79]" />
                <span>Export Excel</span>
              </>
            )}
          </button>

          {/* Secure 2-Step Delete Data Button */}
          <button
            onClick={handleOpenDeleteModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-900/80 hover:bg-red-800 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider transition-all border border-red-700/60 shadow-sm"
            title="Delete server customer data with 2-step verification"
          >
            <Trash2 className="w-4 h-4 text-red-200" />
            <span>Delete Data</span>
          </button>

          <button
            onClick={refreshAdminData}
            className="p-2.5 rounded-lg bg-[#284F45] text-white hover:bg-[#245348] active:scale-95 transition-all"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-[#EAE6DF] pb-2 overflow-x-auto">
        <button
          onClick={() => setAdminTab('overview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'overview'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#DFBE79]" />
          <span>Overview & Customer Leads</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">
            {totalLeadsCount}
          </span>
        </button>

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
            {callers.length} Callers
          </span>
        </button>

        <button
          onClick={() => setAdminTab('database')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
            adminTab === 'database'
              ? 'bg-[#245348] text-white shadow-sm'
              : 'text-gray-600 hover:text-black hover:bg-white/80'
          }`}
        >
          <HardDrive className="w-4 h-4 text-[#DFBE79]" />
          <span>Storage & Archival</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded bg-emerald-700 text-white font-mono">
            {storageStats.savingsPercent}% saved
          </span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: FRONT PAGE (Total Leads, Today's Leads, and Big Customer List)
         ===================================================================== */}
      {adminTab === 'overview' && (
        <div className="space-y-6 anim-fade-scale">

          {/* ── Key Counts Row (Total Lead, Today's Lead, Today's Data) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Total Leads */}
            <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">Total Leads</span>
                <Activity className="w-4 h-4 text-[#245348]" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-serif text-[#14221F] mt-2">
                {totalLeadsCount}
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5 font-mono">
                All-Time Customer Database
              </div>
            </div>

            {/* Today's Leads */}
            <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-emerald-800 font-semibold tracking-wider">Today's Leads</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-serif text-emerald-700 mt-2">
                {todaysLeadsCount}
              </div>
              <div className="text-[10px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-[#C59B4E]" /> Logged Since Midnight
              </div>
            </div>

            {/* Hot Leads (Code 1) */}
            <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-gray-500 font-semibold tracking-wider">Hot Leads (Code 1)</span>
                <Flame className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-serif text-[#14221F] mt-2">
                {hotLeadsCount}
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> High Purchase Value
              </div>
            </div>

            {/* Today's Retries / Active Follow-ups */}
            <div className="bg-white p-5 rounded-xl border border-[#EAE6DF] shadow-subtle hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono text-amber-800 font-semibold tracking-wider">Pending Retries</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-serif text-amber-600 mt-2">
                {pendingRetriesCount}
              </div>
              <div className="text-[10px] text-amber-600 font-mono mt-1.5">
                4h / 10-Day Automated Schedule
              </div>
            </div>

          </div>

          {/* ── Big, Attractive Customer Details Directory ── */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5">
            
            {/* Table Header with Title & Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-5">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                    Customer Directory & Lead Pipeline
                  </h2>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF9F6] text-[#245348] border border-[#EAE6DF]">
                    {filteredLeads.length} Records
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Complete customer contact records, project interests, rating classifications, and assigned territory callers.
                </p>
              </div>

              {/* Filters & Actions */}
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

                {/* Status / Rating Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-lg px-3 py-2 text-[#14221F] focus:outline-none"
                >
                  <option value="All">All Ratings</option>
                  <option value="1">Hot Lead (Code 1)</option>
                  <option value="2">Interested (Code 2)</option>
                  <option value="4">Not Picking Up (Code 4)</option>
                  <option value="3">Okay (Code 3)</option>
                  <option value="5">Not Interested (Code 5)</option>
                  <option value="6">Fake / Spam (Code 6)</option>
                </select>

                {/* Export Button */}
                <button
                  onClick={handleExportExcel}
                  className="px-3.5 py-2 rounded-lg bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#DFBE79]" />
                  <span>Excel</span>
                </button>
              </div>
            </div>

            {/* Big Customer Table */}
            <div className="overflow-x-auto rounded-xl border border-[#EAE6DF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-gray-700 uppercase font-mono text-[10px] border-b border-[#EAE6DF]">
                  <tr>
                    <th className="py-3 px-3.5">ID</th>
                    <th className="py-3 px-3.5">Customer Name & Contact</th>
                    <th className="py-3 px-3.5">Location & Project</th>
                    <th className="py-3 px-3.5">Lead Rating</th>
                    <th className="py-3 px-3.5">Assigned Specialist</th>
                    <th className="py-3 px-3.5">Call Status & Cadence</th>
                    <th className="py-3 px-3.5">Logged Time</th>
                    <th className="py-3 px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
                  {filteredLeads.map((lead) => {
                    const initials = lead.name ? lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CU';

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-[#FAF8F5] transition-colors duration-150 group"
                      >
                        {/* ID */}
                        <td className="py-3 px-3.5 font-mono text-gray-500 font-semibold group-hover:text-black">
                          CON-{lead.id}
                        </td>

                        {/* Customer Info with Avatar */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#245348]/10 text-[#245348] border border-[#245348]/30 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#14221F] text-sm group-hover:text-[#245348] transition-colors">
                                {lead.name}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                                <span>{lead.mobile}</span>
                                {lead.email && <span className="text-gray-400">• {lead.email}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location & Project */}
                        <td className="py-3 px-3.5">
                          <div className="space-y-0.5">
                            <span className="inline-block px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#EAE6DF] font-semibold text-[10px] text-[#14221F]">
                              📍 {lead.locationName}
                            </span>
                            <p className="font-medium text-[#14221F] text-xs">
                              {lead.projectName}
                            </p>
                          </div>
                        </td>

                        {/* Rating Badge */}
                        <td className="py-3 px-3.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            lead.statusCode === 1 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                            lead.statusCode === 4 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            lead.statusCode === 2 ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            lead.statusCode === 5 ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {lead.statusCode === 1 && <Flame className="w-3 h-3 text-emerald-700" />}
                            <span>{lead.statusName}</span>
                          </span>
                        </td>

                        {/* Assigned Caller */}
                        <td className="py-3 px-3.5">
                          <div className="space-y-0.5">
                            <span className="font-medium text-[#245348] flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {lead.callerName}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono block">
                              {lead.callerPhone}
                            </span>
                          </div>
                        </td>

                        {/* Call Status & Cadence */}
                        <td className="py-3 px-3.5">
                          <div className="space-y-0.5">
                            <p className="font-medium text-[#14221F]">
                              {lead.callStatusName}
                            </p>
                            {lead.statusCode === 4 && (
                              <span className="text-[10px] text-amber-700 font-mono block">
                                Attempt {lead.retryCount}/10 • Next: {lead.nextAttemptAt ? new Date(lead.nextAttemptAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Timestamp */}
                        <td className="py-3 px-3.5 text-gray-500 font-mono text-[11px] whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                          {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`tel:${lead.mobile}`}
                              className="p-1.5 rounded-md bg-[#245348]/10 text-[#245348] hover:bg-[#245348] hover:text-white transition-colors"
                              title="Direct Phone Call"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleDeleteSingleLead(lead.id, lead.name)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete this inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400 space-y-2">
                        <Users className="w-8 h-8 mx-auto text-gray-300" />
                        <p className="text-sm font-medium">No customer inquiries found matching your filters.</p>
                        <p className="text-xs text-gray-400">Try adjusting your search query or location filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-2 gap-2">
              <span className="font-mono">
                Showing <strong>{filteredLeads.length}</strong> of <strong>{totalLeadsCount}</strong> registered leads
              </span>
              <span className="font-mono text-emerald-700">
                Encrypted in compact numeric storage ({(storageStats.rawBytes / 1024).toFixed(2)} KB)
              </span>
            </div>

          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: CALLER MANAGEMENT (Dedicated Screen - NOT in front)
         ===================================================================== */}
      {adminTab === 'callers' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5 anim-fade-scale">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#245348]" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Territory Caller Management
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                Configure territory assignments for specialized callers. Inquiries requested in Goregaon, Borivali, Versova, Bhayander, or Mira Road route automatically to that specific caller.
              </p>
            </div>

            <button
              onClick={() => setShowAddCallerModal(true)}
              className="px-4 py-2.5 rounded-lg bg-[#245348] hover:bg-[#1B3F37] active:scale-95 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4 text-[#DFBE79]" />
              <span>+ Add Territory Caller</span>
            </button>
          </div>

          {/* Caller Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {callers.map(caller => {
              const assignedLeadCount = leads.filter(l => l.callerId === caller.id).length;

              return (
                <div
                  key={caller.id}
                  className="bg-[#FAF9F6] border border-[#EAE6DF] rounded-xl p-5 space-y-3.5 hover:border-[#245348]/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-[#245348] text-white flex items-center justify-center font-bold text-sm">
                          {caller.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-bold text-[#14221F] leading-tight">
                            {caller.name}
                          </h4>
                          <span className="font-mono text-[10px] text-gray-500">
                            {caller.callerCode} • Assigned Leads: <strong className="text-[#245348]">{assignedLeadCount}</strong>
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-2.5 pl-11">
                        Phone: {caller.phone} | Password: {caller.password}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCaller(caller.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:scale-110 active:scale-95 transition-all"
                      title="Remove Caller"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Territory Checkboxes */}
                  <div className="space-y-1.5 pt-2 border-t border-[#EAE6DF]">
                    <span className="text-[10px] uppercase font-mono text-gray-600 block font-semibold">
                      Assigned Micro-Markets (Click to Toggle):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(LOCATION_CODES).map(([codeStr, locName]) => {
                        const locId = parseInt(codeStr, 10);
                        const isAssigned = caller.assignedLocations && caller.assignedLocations.includes(locId);

                        return (
                          <button
                            key={locId}
                            type="button"
                            onClick={() => handleToggleCallerLocation(caller.id, locId)}
                            className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all duration-150 active:scale-95 ${
                              isAssigned
                                ? 'bg-[#245348] text-white shadow-xs'
                                : 'bg-white text-gray-600 border border-[#EAE6DF] hover:border-gray-400'
                            }`}
                          >
                            {isAssigned ? '✓ ' : '+ '} {locName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: STORAGE & MONTH-END ARCHIVAL ENGINE
         ===================================================================== */}
      {adminTab === 'database' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#EAE6DF] shadow-subtle space-y-5 anim-fade-scale">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-[#245348]" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14221F]">
                  Storage Optimization & Archival Engine
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Numeric enums save <strong>{storageStats.savingsPercent}%</strong> database storage space in production.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDryRunArchival}
                className="px-3.5 py-2 rounded-lg bg-[#FAF9F6] border border-[#EAE6DF] text-[#14221F] text-xs font-semibold hover:border-black active:scale-95 transition-all"
              >
                Preview 25th-to-25th Gap Window
              </button>
              <button
                onClick={handleExecuteArchival}
                disabled={archivalRunning}
                className="px-3.5 py-2 rounded-lg bg-red-800 hover:bg-red-900 active:scale-95 text-white text-xs font-semibold transition-all disabled:opacity-70 flex items-center gap-1.5"
              >
                {archivalRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Archiving Database...</span>
                  </>
                ) : (
                  <span>Run Monthly Archival Cleanup</span>
                )}
              </button>
            </div>
          </div>

          {/* Animated Storage Optimization Progress Bar */}
          <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#EAE6DF] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-gray-600 font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#245348]" />
                Database Compression Metric
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                {storageStats.savingsPercent}% Storage Saved
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#245348] via-[#2E6B5D] to-[#C59B4E] rounded-full transition-all duration-1000 ease-out anim-shimmer"
                style={{ width: `${storageStats.savingsPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-1">
              <span>Stored Encoded: <strong>{(storageStats.rawBytes / 1024).toFixed(2)} KB</strong></span>
              <span>Raw Verbose Equivalent: <strong>{(storageStats.uncompressedBytes / 1024).toFixed(2)} KB</strong></span>
            </div>
          </div>

          {/* Compression Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#EAE6DF]">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Compact Stored Size</span>
              <span className="text-base font-bold font-mono text-emerald-700 block mt-0.5">
                {(storageStats.rawBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[10px] text-gray-400">Numeric Keys & Enums</span>
            </div>
            <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#EAE6DF]">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Uncompressed Size</span>
              <span className="text-base font-bold font-mono text-gray-700 block mt-0.5">
                {(storageStats.uncompressedBytes / 1024).toFixed(2)} KB
              </span>
              <span className="text-[10px] text-gray-400">Verbose JSON strings</span>
            </div>
            <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#EAE6DF]">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Compression Ratio</span>
              <span className="text-base font-bold font-mono text-[#245348] block mt-0.5">
                {storageStats.savingsPercent}% Saved
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">Permanent Optimization</span>
            </div>
          </div>

          {/* Archival Window Info */}
          {archivalReport && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 anim-fade-scale">
              <strong>Month-End Archival Window (User's Exact 25th-to-25th Rule):</strong>
              <p>Target Window: <strong>{archivalReport.windowStart}</strong> to <strong>{archivalReport.windowEnd}</strong>.</p>
              <p>Candidates to delete (normal non-lead inquiries): <strong>{archivalReport.candidatesToDelete}</strong>. Hot leads kept forever: <strong>{archivalReport.protectedRecords}</strong>.</p>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          SECURE 2-STEP / 3-STAGE DATA DELETION VERIFICATION MODAL
         ===================================================================== */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-7 space-y-5 border border-red-200 anim-fade-scale"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EAE6DF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14221F]">
                    Secure Server Data Purge
                  </h3>
                  <span className="text-[11px] text-red-700 font-semibold font-mono">
                    2-Step Verification & Mandatory Excel Backup
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Error Message if any */}
            {deleteErrorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2 anim-fade-scale">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{deleteErrorMsg}</span>
              </div>
            )}

            {/* Mandatory Excel Backup Guarantee Pill */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <FileDown className="w-4 h-4 text-emerald-700" />
                <span>Mandatory Data Safeguard:</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Before deleting any customer data, an Excel master file (<strong>CONCAVE_Master_Leads.xlsx</strong>) will be <strong>automatically downloaded</strong> to your computer immediately.
              </p>
            </div>

            {/* ── STEP 1: Admin Password Verification ── */}
            {deleteStep === 1 && (
              <form onSubmit={handleVerifyDeleteStep1} className="space-y-4 text-xs anim-fade-scale">
                <div className="p-3 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] space-y-1">
                  <span className="font-mono font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                    Step 1 of 3: Master Admin Password Check
                  </span>
                  <p className="text-gray-500 text-[11px]">
                    Please verify your administrator password to authorize this destructive action.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-medium block">Admin Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Enter concave@2026..."
                      value={deletePasswordInput}
                      onChange={(e) => setDeletePasswordInput(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-lg pl-9 pr-3 py-2 text-[#14221F] font-mono focus:outline-none"
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 active:scale-95 text-white font-semibold uppercase tracking-wider transition-all"
                  >
                    Verify Password →
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2: Type 'DELETE' in uppercase ── */}
            {deleteStep === 2 && (
              <form onSubmit={handleVerifyDeleteStep2} className="space-y-4 text-xs anim-fade-scale">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-1 text-amber-900">
                  <span className="font-mono font-bold uppercase tracking-wider text-[10px]">
                    Step 2 of 3: Safety Word Confirmation
                  </span>
                  <p className="text-[11px]">
                    To avoid accidental loss, please type the confirmation word <strong className="font-mono text-red-700">DELETE</strong> below.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-medium block">Confirmation Phrase</label>
                  <input
                    type="text"
                    required
                    placeholder="Type DELETE in capital letters"
                    value={deletePhraseInput}
                    onChange={(e) => setDeletePhraseInput(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-lg px-3 py-2 text-[#14221F] font-mono uppercase tracking-widest text-center text-sm focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(1)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 active:scale-95 text-white font-semibold uppercase tracking-wider transition-all"
                  >
                    Confirm Word →
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3: Admin Email Authentication & Auto-Export ── */}
            {deleteStep === 3 && (
              <form onSubmit={handleExecuteSecurePurge} className="space-y-4 text-xs anim-fade-scale">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 space-y-1 text-red-900">
                  <span className="font-mono font-bold uppercase tracking-wider text-[10px]">
                    Step 3 of 3: Executive Email Authorization
                  </span>
                  <p className="text-[11px]">
                    Authenticate with your executive administrator email address to trigger the automatic Excel backup and server wipe.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-700 font-medium block">Executive Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={deleteEmailInput}
                      onChange={(e) => setDeleteEmailInput(e.target.value)}
                      className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded-lg pl-9 pr-3 py-2 text-[#14221F] font-mono focus:outline-none"
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-700 font-medium">Security Verification Code</label>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Code: <strong>{deleteGeneratedAuthCode}</strong>
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="Enter security code above"
                    value={deleteAuthCodeInput}
                    onChange={(e) => setDeleteAuthCodeInput(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-red-600 rounded-lg px-3 py-2 text-[#14221F] font-mono text-center tracking-widest text-base focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteStep(2)}
                    className="flex-1 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isDeletingData}
                    className="flex-1 py-2.5 rounded-lg bg-red-800 hover:bg-red-900 active:scale-95 text-white font-bold uppercase tracking-wider transition-all disabled:opacity-75 flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {isDeletingData ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Downloading & Purging...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-3.5 h-3.5" />
                        <span>Auto-Download Excel & Wipe Data</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Add Caller Modal */}
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
                <span>Add Territory Caller</span>
              </h3>
              <button
                onClick={() => setShowAddCallerModal(false)}
                className="text-gray-400 hover:text-black text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCaller} className="space-y-3 text-xs">
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

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Assigned Password</label>
                <input
                  type="text"
                  value={newCallerData.password}
                  onChange={(e) => setNewCallerData({ ...newCallerData, password: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] focus:ring-1 focus:ring-[#245348] rounded-lg px-3 py-2 text-[#14221F] font-mono focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium block">
                  Select Specialized Territories:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF]">
                  {Object.entries(LOCATION_CODES).map(([codeStr, locName]) => {
                    const locId = parseInt(codeStr, 10);
                    const isSelected = newCallerData.assignedLocations.includes(locId);

                    return (
                      <button
                        key={locId}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? newCallerData.assignedLocations.filter(id => id !== locId)
                            : [...newCallerData.assignedLocations, locId];
                          setNewCallerData({ ...newCallerData, assignedLocations: updated });
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] text-left transition-all duration-150 active:scale-95 ${
                          isSelected ? 'bg-[#245348] text-white font-semibold shadow-xs' : 'text-gray-600 hover:bg-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {locName}
                      </button>
                    );
                  })}
                </div>
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
