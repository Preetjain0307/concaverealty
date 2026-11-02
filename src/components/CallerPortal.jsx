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
  ArrowRight
} from 'lucide-react';
import { dbStore, STATUS_CODES, CALL_STATUS_CODES, LOCATION_CODES } from '../data/dbStore';

export function CallerPortal({ currentUser, onLogin, onLogout }) {
  const [callers, setCallers] = useState([]);
  const [loginMethod, setLoginMethod] = useState('credentials'); // 'credentials' or 'otp'
  
  // Credentials login state
  const [callerCode, setCallerCode] = useState('CALLER-101');
  const [password, setPassword] = useState('caller123');

  // OTP login state
  const [otpMobile, setOtpMobile] = useState('98201 12345');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

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
  const handleCredentialsLogin = (e) => {
    e.preventDefault();
    const found = callers.find(c => c.callerCode.toUpperCase() === callerCode.trim().toUpperCase() && c.password === password);
    if (found) {
      onLogin({ ...found, role: 'caller' });
    } else {
      alert("Invalid Caller ID or Password. Try 'CALLER-101' with password 'caller123'.");
    }
  };

  const handleSendOtp = () => {
    if (!otpMobile || otpMobile.length < 5) {
      alert("Please enter a valid mobile number.");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === generatedOtp || enteredOtp === '1234') {
      const found = callers.find(c => c.phone.replace(/\s+/g, '') === otpMobile.replace(/\s+/g, '')) || callers[0];
      onLogin({ ...found, role: 'caller' });
    } else {
      alert("Invalid OTP! Use the generated OTP shown on screen or 1234.");
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
  // VIEW 1: LOGIN SCREEN (Using user's exact #284F45 panel & #245348 button)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#FAF9F6] flex items-center justify-center">
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

            {loginMethod === 'credentials' ? (
              <form onSubmit={handleCredentialsLogin} className="space-y-4 text-xs">
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
                  <label className="text-gray-600 font-medium">Password</label>
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

                {otpSent && (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex justify-between rounded">
                      <span>Demo Code:</span>
                      <strong className="font-mono text-sm">{generatedOtp}</strong>
                    </div>

                    <input
                      type="text"
                      maxLength={4}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full bg-[#FAF9F6] border border-[#245348] rounded px-3 py-2 text-center text-base font-mono tracking-widest text-[#14221F]"
                    />

                    {/* Requested "Sign in" button: #245348 */}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white font-semibold text-xs uppercase tracking-wider"
                    >
                      Sign In with OTP
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Quick Territory Switchers */}
            <div className="pt-3 border-t border-[#EAE6DF] space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-gray-400 block">
                ⚡ 1-Click Territory Switch:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {callers.slice(0, 4).map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleQuickLoginAs(c)}
                    className="p-1.5 rounded bg-[#FAF9F6] hover:bg-[#EFECE6] border border-[#EAE6DF] text-left text-[11px] truncate"
                  >
                    <strong className="text-[#14221F] block">{c.name.split(' ')[0]}</strong>
                    <span className="text-gray-500 text-[10px]">{c.assignedLocations.map(l => LOCATION_CODES[l]).join(', ')}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right-side "Welcome back" panel: User requested #284F45 */}
          <div className="bg-[#284F45] text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C59B4E] p-0.5 bg-white/10">
                <img src="/logo.jpg" alt="Concave" className="w-full h-full object-cover rounded-full" />
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
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED CALLER WORKSPACE (Light, clean, deployment-ready)
  // =========================================================================
  const pendingRetriesCount = leads.filter(l => l.statusCode === 4 && l.callStatusCode !== 5).length;
  const hotLeadsCount = leads.filter(l => l.statusCode === 1).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-[#FAF9F6]">
      
      {/* Upper Banner using user requested #1D3530 */}
      <div className="bg-[#1D3530] text-white rounded-xl p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#284F45] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] flex-shrink-0">
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

                  {/* Direct Call Button (User requested #245348) */}
                  <div className="flex flex-row lg:flex-col gap-2 justify-end">
                    <button
                      onClick={() => handleStartCall(lead)}
                      className="px-4 py-2.5 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Direct Call</span>
                    </button>
                    <a
                      href={`tel:${lead.mobile.replace(/\s+/g, '')}`}
                      className="px-3 py-1.5 rounded border border-[#EAE6DF] hover:border-black text-gray-700 text-center text-xs"
                    >
                      Native Phone
                    </a>
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
  );
}
