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
  HardDrive
} from 'lucide-react';
import { dbStore, STATUS_CODES, LOCATION_CODES, CALL_STATUS_CODES } from '../data/dbStore';

export function AdminPortal({ currentUser, onLogin, onLogout }) {
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

  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddCallerModal, setShowAddCallerModal] = useState(false);
  const [newCallerData, setNewCallerData] = useState({
    name: '',
    phone: '',
    password: 'caller123',
    role: 'Territory Specialist',
    assignedLocations: [1]
  });

  const refreshAdminData = () => {
    try {
      const allLeads = dbStore.getAllLeads();
      const allCallers = dbStore.getCallers();
      const stats = dbStore.getStorageStats();
      setLeads(allLeads);
      setCallers(allCallers);
      setStorageStats(stats);
    } catch (e) {
      console.error("Error refreshing admin data:", e);
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
    const ok = dbStore.exportMasterLeadsToExcel();
    if (ok) {
      alert("Excel file successfully exported and downloaded with full customer and lead data!");
    } else {
      alert("Error generating Excel file.");
    }
  };

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
    if (window.confirm("Execute monthly archival? This will export an Excel backup first, then purge normal non-lead inquiries strictly within the 25th-to-25th gap window. Hot leads are protected.")) {
      setArchivalRunning(true);
      setTimeout(() => {
        const result = dbStore.runMonthlyArchivalCleanup(false);
        setArchivalRunning(false);
        if (result.success) {
          alert(`Monthly Archival Completed! Excel backup downloaded. Removed ${result.deletedCount} non-lead records from ${result.windowStart} - ${result.windowEnd}. All genuine leads remain protected.`);
          refreshAdminData();
          setArchivalReport(null);
        } else {
          alert("Archival failed: " + result.error);
        }
      }, 600);
    }
  };

  // =========================================================================
  // VIEW 1: ADMIN LOGIN SCREEN (Using user's exact #284F45 panel & #245348 button)
  // =========================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white border border-[#EAE6DF] rounded-2xl shadow-luxury-light overflow-hidden grid grid-cols-1 md:grid-cols-2">

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
                Manage territory callers, export full lead data to Excel, and oversee operations.
              </p>
            </div>

            {/* Mode switch */}
            <div className="flex bg-[#FAF9F6] p-1 rounded-lg border border-[#EAE6DF] text-xs">
              <button
                onClick={() => setAdminLoginMethod('password')}
                className={`flex-1 py-1.5 rounded font-medium transition-all ${adminLoginMethod === 'password' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'
                  }`}
              >
                Password
              </button>
              <button
                onClick={() => setAdminLoginMethod('otp')}
                className={`flex-1 py-1.5 rounded font-medium transition-all ${adminLoginMethod === 'otp' ? 'bg-[#245348] text-white shadow-sm' : 'text-gray-500 hover:text-black'
                  }`}
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
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-600 font-medium">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#EAE6DF] focus:border-[#245348] rounded px-3 py-2 text-[#14221F] font-mono focus:outline-none"
                  />
                </div>

                {/* Requested "Sign in" button color: #245348 */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-sm"
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
                      className="flex-1 bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendAdminOtp}
                      className="px-3 py-2 bg-[#284F45] text-white rounded font-medium"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>

                {adminOtpSent && (
                  <form onSubmit={handleVerifyAdminOtp} className="space-y-3">
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
                      className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-center text-base font-mono tracking-widest text-[#14221F]"
                    />

                    {/* Requested "Sign in" button: #245348 */}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
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

          {/* Right-side "Welcome back" panel: User requested #284F45 */}
          <div className="bg-[#284F45] text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C59B4E] p-0.5 bg-white/10">
                <img src="/logo.jpg" alt="Concave" className="w-full h-full object-cover rounded-full" />
              </div>

              <h3 className="font-serif text-3xl font-bold">
                Super Admin Console
              </h3>

              <p className="font-serif italic text-base text-[#DFBE79]">
                “Where Legacy Meets Luxury”
              </p>

              <p className="text-xs text-gray-200 font-light leading-relaxed pt-2">
                Executive platform for territory caller management, 1-click Excel master export, space-saving compact database encoding, and month-end archival.
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
  // VIEW 2: AUTHENTICATED SUPER ADMIN WORKSPACE (Light, clean, deployment-ready)
  // =========================================================================
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const todaysLeadsCount = leads.filter(l => l.createdAt >= todayStart).length;
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
        l.projectName.toLowerCase().includes(q) ||
        l.callerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6]">

      {/* Upper Banner using user requested #1D3530 */}
      <div className="bg-[#1D3530] text-white rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-[#DFBE79]">
            EXECUTIVE SALES CONTROL TOWER
          </span>
          <h2 className="font-serif text-3xl font-bold text-white mt-1">
            Admin Command Center
          </h2>
          <p className="text-xs text-gray-300 mt-1">
            Territory lead routing, caller territory assignments, XLSX downloads & database governance.
          </p>
        </div>

        {/* 1-Click Excel Download Button using #245348 */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm border border-[#284F45]"
            title="Download full database as Excel file"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#DFBE79]" />
            <span>Download All Data as Excel (.xlsx)</span>
          </button>

          <button
            onClick={refreshAdminData}
            className="p-2.5 rounded bg-[#284F45] text-white hover:bg-[#245348] transition-colors"
            title="Refresh Database"
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Today's New Leads</span>
          <span className="text-3xl font-bold font-serif text-[#14221F] mt-1 block">{todaysLeadsCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Total Inquiries</span>
          <span className="text-3xl font-bold font-serif text-[#14221F] mt-1 block">{leads.length}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Hot Leads (Code 1)</span>
          <span className="text-3xl font-bold font-serif text-emerald-700 mt-1 block">{hotLeadsCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Pending Retries (4h / 10d)</span>
          <span className="text-3xl font-bold font-serif text-amber-600 mt-1 block">{pendingRetriesCount}</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#EAE6DF] shadow-subtle col-span-2 lg:col-span-1">
          <span className="text-[10px] uppercase font-mono text-gray-500 block">Active Territory Callers</span>
          <span className="text-3xl font-bold font-serif text-[#245348] mt-1 block">{callers.length}</span>
        </div>
      </div>

      {/* Caller Territory Assignments */}
      <div className="bg-white rounded-xl p-6 border border-[#EAE6DF] shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE6DF] pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#14221F] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#245348]" />
              <span>Caller Management & Territory Assignments</span>
            </h3>
            <p className="text-xs text-gray-500">
              Inquiries for assigned locations automatically land on that caller's screen.
            </p>
          </div>

          <button
            onClick={() => setShowAddCallerModal(true)}
            className="px-4 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
          >
            + Add New Caller
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {callers.map(caller => (
            <div key={caller.id} className="bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg font-bold text-[#14221F]">{caller.name}</h4>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-[#245348] border border-[#EAE6DF]">
                      {caller.callerCode}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">
                    Phone: {caller.phone} | Password: {caller.password}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveCaller(caller.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove Caller"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Territory Checkboxes */}
              <div className="space-y-1.5 pt-2 border-t border-[#EAE6DF]">
                <span className="text-[10px] uppercase font-mono text-gray-600 block">
                  Assigned Specialized Locations (Click to Toggle):
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
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all ${isAssigned
                          ? 'bg-[#245348] text-white shadow-sm'
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
          ))}
        </div>
      </div>

      {/* Compact Database & Month-End Archival */}
      <div className="bg-white rounded-xl p-6 border border-[#EAE6DF] shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#14221F] flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#245348]" />
              <span>Compact Storage & Month-End Archival Engine</span>
            </h3>
            <p className="text-xs text-gray-500">
              Numeric encoding saves <strong>{storageStats.savingsPercent}%</strong> storage space.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDryRunArchival}
              className="px-3.5 py-2 rounded bg-[#FAF9F6] border border-[#EAE6DF] text-[#14221F] text-xs font-semibold hover:border-black"
            >
              Preview 25th-to-25th Gap Window
            </button>
            <button
              onClick={handleExecuteArchival}
              disabled={archivalRunning}
              className="px-3.5 py-2 rounded bg-red-800 text-white text-xs font-semibold hover:bg-red-900"
            >
              {archivalRunning ? "Archiving..." : "Run Monthly Archival & Space Cleanup"}
            </button>
          </div>
        </div>

        {/* Compression Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-[#FAF9F6] p-3 rounded border border-[#EAE6DF]">
            <span className="text-[10px] text-gray-500 uppercase font-mono block">Compact Stored Size</span>
            <span className="text-base font-bold font-mono text-emerald-700 block">
              {(storageStats.rawBytes / 1024).toFixed(2)} KB (Numeric Keys & Codes)
            </span>
          </div>
          <div className="bg-[#FAF9F6] p-3 rounded border border-[#EAE6DF]">
            <span className="text-[10px] text-gray-500 uppercase font-mono block">Uncompressed Size</span>
            <span className="text-base font-bold font-mono text-gray-700 block">
              {(storageStats.uncompressedBytes / 1024).toFixed(2)} KB
            </span>
          </div>
          <div className="bg-[#FAF9F6] p-3 rounded border border-[#EAE6DF]">
            <span className="text-[10px] text-gray-500 uppercase font-mono block">Compression Ratio</span>
            <span className="text-base font-bold font-mono text-[#245348] block">
              {storageStats.savingsPercent}% Saved
            </span>
          </div>
        </div>

        {/* Archival Window Info */}
        {archivalReport && (
          <div className="p-4 rounded bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <strong>Month-End Archival Window (User's Exact 25th-to-25th Rule):</strong>
            <p>Target Window: <strong>{archivalReport.windowStart}</strong> to <strong>{archivalReport.windowEnd}</strong>.</p>
            <p>Candidates to delete (normal non-lead inquiries): <strong>{archivalReport.candidatesToDelete}</strong>. Hot leads kept forever: <strong>{archivalReport.protectedRecords}</strong>.</p>
          </div>
        )}
      </div>

      {/* Master Leads Table */}
      <div className="bg-white rounded-xl p-6 border border-[#EAE6DF] shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE6DF] pb-4">
          <h3 className="font-serif text-2xl font-bold text-[#14221F]">
            Customer Master Inquiries
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-[#FAF9F6] border border-[#EAE6DF] rounded px-2.5 py-1.5 text-[#14221F] focus:outline-none"
            >
              <option value="All">All Locations</option>
              {Object.values(LOCATION_CODES).map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAF9F6] border border-[#EAE6DF] rounded px-2.5 py-1.5 text-[#14221F] focus:outline-none"
            >
              <option value="All">All Dispositions</option>
              <option value="1">Hot Lead (Code 1)</option>
              <option value="2">Interested (Code 2)</option>
              <option value="4">Not Picking Up (Code 4)</option>
              <option value="3">Okay (Code 3)</option>
              <option value="5">Not Interested (Code 5)</option>
              <option value="6">Fake / Spam (Code 6)</option>
            </select>

            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-1.5 text-[#14221F] focus:outline-none w-44"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-[#EAE6DF]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] text-gray-700 uppercase font-mono text-[10px] border-b border-[#EAE6DF]">
              <tr>
                <th className="py-2.5 px-3">Lead ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Assigned Caller</th>
                <th className="py-2.5 px-3">Call Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE6DF] text-gray-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-gray-500">CON-{lead.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-[#14221F]">{lead.name}</td>
                  <td className="py-2.5 px-3 font-mono">{lead.mobile}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#EAE6DF] font-medium">
                      {lead.locationName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium">{lead.projectName}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.statusCode === 1 ? 'bg-emerald-100 text-emerald-800' :
                      lead.statusCode === 4 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {lead.statusName}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#245348]">{lead.callerName}</td>
                  <td className="py-2.5 px-3">
                    {lead.callStatusName} {lead.statusCode === 4 && `(Attempt ${lead.retryCount}/10)`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Caller Modal */}
      {showAddCallerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 space-y-4 border border-gray-200">
            <h3 className="font-serif text-xl font-bold text-[#14221F]">Add Territory Caller</h3>

            <form onSubmit={handleCreateCaller} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Caller Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Nair"
                  value={newCallerData.name}
                  onChange={(e) => setNewCallerData({ ...newCallerData, name: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F]"
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
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium">Assigned Password</label>
                <input
                  type="text"
                  value={newCallerData.password}
                  onChange={(e) => setNewCallerData({ ...newCallerData, password: e.target.value })}
                  className="w-full bg-[#FAF9F6] border border-[#EAE6DF] rounded px-3 py-2 text-[#14221F] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-700 font-medium block">
                  Select Specialized Territories:
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 bg-[#FAF9F6] rounded border border-[#EAE6DF]">
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
                        className={`px-2 py-1 rounded text-[10px] text-left transition-all ${isSelected ? 'bg-[#245348] text-white font-semibold' : 'text-gray-600'
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
                  className="flex-1 py-2 rounded bg-gray-100 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold uppercase tracking-wider"
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
