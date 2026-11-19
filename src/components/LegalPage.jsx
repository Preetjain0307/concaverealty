import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Scale,
  Cookie,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Lock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2
} from 'lucide-react';

export function LegalPage({ initialTab = 'terms', onNavigateHome, onSelectDocument }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    window.location.hash = tabKey;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onSelectDocument) {
      onSelectDocument(tabKey);
    }
  };

  const tabs = [
    {
      id: 'terms',
      title: 'Terms & Conditions',
      navLabel: 'Terms & Conditions',
      shortTitle: 'Terms of Engagement',
      icon: Scale,
      badge: 'Advisory Framework'
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      navLabel: 'Privacy Policy',
      shortTitle: 'DPDP Data Protection',
      icon: Lock,
      badge: 'DPDP Act, 2023'
    },
    {
      id: 'disclaimer',
      title: 'Regulatory Disclaimer',
      navLabel: 'MahaRERA Disclaimer',
      shortTitle: 'MahaRERA Disclosures',
      icon: AlertTriangle,
      badge: 'Statutory Transparency'
    },
    {
      id: 'cookies',
      title: 'Cookie & Data Policy',
      navLabel: 'Cookie Policy',
      shortTitle: 'Browser Storage',
      icon: Cookie,
      badge: 'Storage Governance'
    }
  ];

  const currentDoc = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#C59B4E] selection:text-[#14221F] font-sans antialiased">
      
      {/* ============================================================== */}
      {/* 1. TOP STATUTORY HEADER & NAVIGATION BAR                       */}
      {/* ============================================================== */}
      <header className="pt-20 sm:pt-24 pb-4 sm:pb-6 bg-[#14221F] text-white border-b border-[#C59B4E]/30 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 bg-[#C59B4E]/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 w-80 h-80 bg-[#245348]/20 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          
          {/* Top Row: Back to Home Action */}
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#1D3530] hover:bg-[#284F45] text-[#DFBE79] hover:text-white border border-[#C59B4E]/40 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-xs cursor-pointer group active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Title & Statutory Identification */}
          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1D3530] text-[#DFBE79] border border-[#C59B4E]/40 font-semibold uppercase">
                <ShieldCheck className="w-3 h-3 text-[#DFBE79]" />
                <span>Statutory Governance</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 font-semibold">
                MahaRERA: A51900045781
              </span>
            </div>

            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans leading-tight">
              {currentDoc.title}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-2xl font-sans">
              Official regulatory framework of <strong>Concave Realty</strong>, operating exclusively as a licensed real estate advisory channel partner in Mumbai, Maharashtra.
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] font-mono text-[#DFBE79]/90 pt-1">
              <span>Updated: Nov 2025</span>
              <span>•</span>
              <span>Jurisdiction: Mumbai, Maharashtra</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Active Version: 2.4</span>
            </div>
          </div>

          {/* Clean Segmented Document Navigation Bar */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#DFBE79] text-[#14221F] font-bold shadow-md ring-1 ring-[#DFBE79]/50'
                        : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.navLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. CORPORATE EDITORIAL DOCUMENT CONTENT CONTAINER              */}
      {/* ============================================================== */}
      <main className="max-w-4xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        <article className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4.5 xs:p-6 sm:p-8 md:p-10 space-y-8 sm:space-y-9 text-xs xs:text-sm sm:text-[14.5px] leading-relaxed text-[#334155] font-sans">
          
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 1: TERMS & CONDITIONS                                      */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'terms' && (
            <div className="space-y-6 sm:space-y-7">
              
              {/* Executive Notice Callout */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-l-[#C59B4E] border border-slate-200/60 space-y-1.5 shadow-2xs">
                <strong className="text-[#0F172A] font-bold text-xs xs:text-sm sm:text-base font-sans block">
                  Mandatory Statutory Notice — RERA Section 10
                </strong>
                <p className="text-[#475569] leading-relaxed text-xs xs:text-sm">
                  Concave Realty operates exclusively as a registered real estate advisory channel partner holding <strong>MahaRERA Registration No. A51900045781</strong>. Concave Realty is <strong>NOT</strong> a real estate developer, promoter, builder, or owner of any property displayed on this website.
                </p>
              </div>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  1. Preamble &amp; Acceptance of Terms
                </h2>
                <p>
                  These Terms of Engagement constitute a legally binding electronic contract between the prospective purchaser/client (“You”, “User”) and <strong>Concave Realty</strong> (“Firm”, “We”, “Our”). By accessing, viewing, exploring, or interacting with this website (including submitting enquiries, requesting project brochures, or scheduling site viewings), you unconditionally accept these Terms in full. If you disagree with any part of these Terms, you must discontinue using this portal immediately.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  2. Advisory Scope &amp; Channel Partner Role
                </h2>
                <p>
                  Concave Realty provides verified real estate advisory and facilitation services under Section 10 of the Real Estate (Regulation and Development) Act, 2016. Our scope includes:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li>Presenting accurate information regarding RERA-registered luxury residential and commercial developments across Mumbai.</li>
                  <li>Facilitating scheduled appointments, relationship meetings, and authorized site inspections with developer sales teams.</li>
                  <li>Providing market insights, project comparisons, and guidance on payment plan structures.</li>
                </ul>
                <p className="text-[#64748B] pt-1">
                  At no point does Concave Realty act as a developer, principal vendor, or title holder. All sale agreements, allotment letters, and conveyance deeds are executed directly between the purchaser and the designated developer entity.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  3. Indicative Pricing &amp; Project Availability
                </h2>
                <p>
                  All property prices, payment schemes, carpet area measurements, floor configurations, and unit availability displayed on this portal are <strong>indicative only</strong> and subject to revision by the respective developer without prior notice.
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li>Final prices are determined solely by the developer and confirmed via an official Cost Sheet.</li>
                  <li>Statutory taxes (GST, Stamp Duty, Registration Fees) are charged as per actual prevailing Maharashtra government notifications at the time of execution.</li>
                  <li>Promotional schemes or subvention benefits are governed solely by developer agreements.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  4. Mandatory Independent MahaRERA Due Diligence
                </h2>
                <p>
                  Prospective buyers are advised to independently verify all project credentials on the official MahaRERA portal (<a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#14221F] underline font-bold">maharera.maharashtra.gov.in</a>) prior to making any financial commitment. This includes verifying:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li>Project registration validity and promoter disclosures.</li>
                  <li>Sanctioned architectural plans, commencement certificates, and carpet area certificates.</li>
                  <li>Title encumbrance reports and developer completion milestones.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  5. Architectural Renders &amp; Visual Impressions
                </h2>
                <p>
                  All visual assets on this platform—including 3D renders, walkthroughs, show apartment imagery, and landscape depictions—are <strong>artist impressions only</strong>. Actual deliverables are strictly governed by the registered Agreement for Sale executed with the developer.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  6. Limitation of Liability
                </h2>
                <p>
                  To the fullest extent permissible by law, Concave Realty and its associates shall not be liable for any direct, indirect, or consequential loss arising from reliance on indicative pricing, developer construction delays, contractual disputes, or cancellations between the purchaser and developer.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  7. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with this portal or our advisory services shall be subject to the exclusive jurisdiction of the competent Courts in <strong>Mumbai, Maharashtra, India</strong>.
                </p>
              </section>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 2: PRIVACY POLICY                                          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 sm:space-y-7">
              
              {/* Executive Notice Callout */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-l-[#C59B4E] border border-slate-200/60 space-y-1.5 shadow-2xs">
                <strong className="text-[#0F172A] font-bold text-xs xs:text-sm sm:text-base font-sans block">
                  Digital Personal Data Protection Act, 2023 (DPDP) Compliance
                </strong>
                <p className="text-[#475569] leading-relaxed text-xs xs:text-sm">
                  Concave Realty acts as a designated <strong>Data Fiduciary</strong> in accordance with the DPDP Act, 2023 and SPDI Rules. We collect and process client data solely on the lawful ground of explicit, informed consent for verified real estate advisory.
                </p>
              </div>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  1. Data Fiduciary Identity
                </h2>
                <p>
                  <strong>Data Fiduciary:</strong> Concave Realty, licensed real estate advisory channel partner (MahaRERA Reg. No. A51900045781), operating across Mumbai, Maharashtra.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  2. Categories of Personal Data Collected
                </h2>
                <p>
                  We strictly collect only data that you voluntarily provide to facilitate property consultations:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li><strong>Contact Details:</strong> Full Name, Mobile Number, Email Address.</li>
                  <li><strong>Advisory Preferences:</strong> Target micro-market, budget range, and property configuration.</li>
                  <li><strong>Security Verification:</strong> Time-stamped One-Time Password (OTP) verification records to authenticate valid human enquiries.</li>
                  <li><strong>Career Candidates:</strong> Resume, work history, and contact coordinates submitted via our Careers Portal.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  3. Lawful Ground &amp; Purpose of Processing
                </h2>
                <p>
                  Data is processed strictly based on your affirmative consent for:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li>Connecting you with dedicated Senior Relationship Managers for advisory calls.</li>
                  <li>Transmitting requested project brochures, payment schedules, and floor plans.</li>
                  <li>Scheduling authorized site visits and developer sales meetings at your request.</li>
                </ul>
                <p className="font-semibold text-[#14221F] pt-1">
                  We NEVER sell, rent, monetize, or trade client personal data with third-party marketing syndicates.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  4. Rights of Data Principals (Clients)
                </h2>
                <p>
                  Under the DPDP Act 2023, you enjoy statutory rights:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li><strong>Right to Access:</strong> Request a summary of personal data held by us.</li>
                  <li><strong>Right to Correction &amp; Erasure:</strong> Request the correction of inaccurate data or deletion of your records.</li>
                  <li><strong>Right to Withdraw Consent:</strong> Revoke communication consent at any time.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  5. Designated Grievance Officer
                </h2>
                <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs sm:text-sm">
                  <div><strong>Designation:</strong> Data Protection &amp; Grievance Officer</div>
                  <div><strong>Firm:</strong> Concave Realty (MahaRERA: A51900045781)</div>
                  <div><strong>Jurisdiction:</strong> Mumbai, Maharashtra, India</div>
                  <div><strong>Email:</strong> <a href="mailto:concaverealtyindia@gmail.com" className="text-[#14221F] underline font-bold">concaverealtyindia@gmail.com</a></div>
                  <div><strong>Phone:</strong> <a href="tel:+918291090155" className="text-[#14221F] underline font-bold">+91 82910 90155</a></div>
                  <div className="text-[11px] text-[#64748B] pt-1 font-mono">Statutory Response SLA: Acknowledged within 48 hours; resolved within 30 days.</div>
                </div>
              </section>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 3: REGULATORY DISCLAIMER                                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-6 sm:space-y-7">
              
              {/* Executive Notice Callout */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-l-[#C59B4E] border border-slate-200/60 space-y-1.5 shadow-2xs">
                <strong className="text-[#0F172A] font-bold text-xs xs:text-sm sm:text-base font-sans block">
                  MahaRERA Statutory Transparency Notice
                </strong>
                <p className="text-[#475569] leading-relaxed text-xs xs:text-sm">
                  Concave Realty is a registered real estate channel partner under the Real Estate (Regulation and Development) Act, 2016 holding <strong>MahaRERA Agent Registration No. A51900045781</strong>. This portal is an advisory marketing platform and not the official website of any single developer.
                </p>
              </div>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  1. Non-Offer for Sale Notice
                </h2>
                <p>
                  The information published on this website—including pricing ranges, floor configurations, location highlights, and lifestyle imagery—does <strong>not</strong> constitute a formal legal offer, prospectus, or binding contract. All property sales are executed exclusively between the purchaser and the designated developer in compliance with RERA regulations.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  2. Verified Project RERA Identifiers
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  In compliance with statutory transparency directives, verified MahaRERA identifiers for featured Mumbai developments are detailed below:
                </p>

                {/* Mobile-Optimized Clean Cards (Zero Horizontal Overflow on Mobile) */}
                <div className="sm:hidden space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-emerald-950 font-bold">Concave Realty</strong>
                      <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Agent</span>
                    </div>
                    <p className="text-emerald-900 text-[11px]">Licensed Advisory Channel Partner • Mumbai</p>
                    <div className="font-mono font-bold text-emerald-950 text-xs pt-0.5">MahaRERA: A51900045781</div>
                  </div>

                  {[
                    { name: 'Kalpataru Advay', loc: 'Borivali West, Mumbai', rera: 'P51800077381' },
                    { name: 'Godrej Skyshore', loc: 'Versova, Mumbai', rera: 'P51800054522' },
                    { name: 'Godrej Reserve', loc: 'Kandivali East, Mumbai', rera: 'P51800054420' },
                    { name: 'Lodha Altus', loc: 'Borivali West, Mumbai', rera: 'P51800055174' },
                  ].map((proj) => (
                    <div key={proj.name} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs shadow-2xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-[#0F172A] font-bold">{proj.name}</strong>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-semibold">Active</span>
                      </div>
                      <p className="text-[#64748B] text-[11px]">{proj.loc}</p>
                      <div className="font-mono font-bold text-[#14221F] text-xs pt-0.5">RERA: {proj.rera}</div>
                    </div>
                  ))}

                  <p className="text-[11px] text-[#64748B] font-mono italic pt-1">
                    * All 43+ curated projects carry active MahaRERA registrations. Verify all at <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#14221F] underline font-bold">maharera.maharashtra.gov.in</a>.
                  </p>
                </div>

                {/* Desktop Clean Corporate Table (sm: and above) */}
                <div className="hidden sm:block overflow-hidden border border-[#E2E8F0] rounded-xl shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#14221F] text-[#DFBE79] font-mono text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Development Name</th>
                        <th className="p-3.5">Micro-Market</th>
                        <th className="p-3.5">MahaRERA Registration</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white text-[#0F172A]">
                      <tr className="bg-emerald-50/70 font-semibold">
                        <td className="p-3.5 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Concave Realty (Channel Partner)</span>
                        </td>
                        <td className="p-3.5">Mumbai, Maharashtra</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-950">A51900045781</td>
                        <td className="p-3.5 text-emerald-800 font-bold">Registered Agent</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold">Kalpataru Advay</td>
                        <td className="p-3.5 text-[#64748B]">Borivali West, Mumbai</td>
                        <td className="p-3.5 font-mono font-bold text-[#14221F]">P51800077381</td>
                        <td className="p-3.5 text-emerald-700 font-medium">Verified Active</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold">Godrej Skyshore</td>
                        <td className="p-3.5 text-[#64748B]">Versova, Mumbai</td>
                        <td className="p-3.5 font-mono font-bold text-[#14221F]">P51800054522</td>
                        <td className="p-3.5 text-emerald-700 font-medium">Verified Active</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold">Godrej Reserve</td>
                        <td className="p-3.5 text-[#64748B]">Kandivali East, Mumbai</td>
                        <td className="p-3.5 font-mono font-bold text-[#14221F]">P51800054420</td>
                        <td className="p-3.5 text-emerald-700 font-medium">Verified Active</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-semibold">Lodha Altus</td>
                        <td className="p-3.5 text-[#64748B]">Borivali West, Mumbai</td>
                        <td className="p-3.5 font-mono font-bold text-[#14221F]">P51800055174</td>
                        <td className="p-3.5 text-emerald-700 font-medium">Verified Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  3. Official MahaRERA Public Verification Portal
                </h2>
                <p>
                  To independently verify any real estate project's sanctioned layouts, commencement certificates, legal title reports, or quarterly compliance filings, clients are directed to the official MahaRERA authority website:{' '}
                  <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#14221F] font-bold underline">
                    maharera.maharashtra.gov.in
                  </a>.
                </p>
              </section>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* TAB 4: COOKIE & BROWSER DATA POLICY                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {activeTab === 'cookies' && (
            <div className="space-y-6 sm:space-y-7">
              
              {/* Executive Notice Callout */}
              <div className="p-3.5 xs:p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border-l-4 border-l-[#C59B4E] border border-slate-200/60 space-y-1.5 shadow-2xs">
                <strong className="text-[#0F172A] font-bold text-xs xs:text-sm sm:text-base font-sans block">
                  Transparent Browser Storage Policy
                </strong>
                <p className="text-[#475569] leading-relaxed text-xs xs:text-sm">
                  Concave Realty deploys a <strong>minimalist storage architecture</strong>. We do NOT use invasive cross-site advertising trackers or sell browsing data to third-party ad brokers.
                </p>
              </div>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  1. Nature of Cookies &amp; Browser Storage
                </h2>
                <p>
                  Cookies and local storage are small text tokens stored in your browser to maintain essential user session state, remember your preferred micro-market selections, and authenticate security OTP verification requests.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  2. Categories of Storage Utilized
                </h2>
                <div className="space-y-3 pt-1">
                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <strong className="text-[#0F172A] block font-bold text-xs xs:text-sm">Strictly Essential Storage (Core Security)</strong>
                    <p className="text-[#64748B] text-xs leading-relaxed">
                      Required for anti-bot CSRF protection, temporary OTP state validation, and page routing. These tokens do not store personal profiles and cannot be disabled.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                    <strong className="text-[#0F172A] block font-bold text-xs xs:text-sm">Functional Preferences (User Experience)</strong>
                    <p className="text-[#64748B] text-xs leading-relaxed">
                      Remembers your cookie banner acknowledgement (`concave_cookie_acknowledged`) and selected location filter (`Borivali`, `Kandivali`, etc.) so you do not receive redundant prompts.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-sm xs:text-base sm:text-lg font-bold text-[#0F172A] font-sans tracking-tight">
                  3. Managing Browser Storage
                </h2>
                <p>
                  You can delete or block stored cookies at any time via your browser preferences:
                </p>
                <ul className="space-y-1.5 pl-4 sm:pl-5 list-disc marker:text-[#C59B4E]">
                  <li><strong>Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies.</li>
                  <li><strong>Apple Safari:</strong> Settings → Safari → Advanced → Privacy.</li>
                  <li><strong>Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Cookies.</li>
                  <li><strong>Microsoft Edge:</strong> Settings → Cookies and Site Permissions.</li>
                </ul>
              </section>

            </div>
          )}

          {/* ============================================================== */}
          {/* BOTTOM ACTIONS: RETURN HOME & STATUTORY SIGN-OFF               */}
          {/* ============================================================== */}
          <div className="pt-6 sm:pt-8 border-t border-[#E2E8F0] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onNavigateHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#14221F] hover:bg-[#1D3530] text-[#DFBE79] hover:text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-[#C59B4E]/40 shadow-xs transition-all cursor-pointer group active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Home</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] text-center sm:text-right">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Concave Realty • MahaRERA: <strong className="text-[#0F172A]">A51900045781</strong></span>
              </div>
            </div>

            {/* Corporate Governance Sign-Off Footer */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] sm:text-xs text-[#64748B] text-center space-y-1 font-mono">
              <p className="font-semibold text-[#0F172A]">Concave Realty • Real Estate Advisory Channel Partner</p>
              <p>Advisory &amp; Facilitation Services • Mumbai, Maharashtra</p>
              <p>
                Official Desk:{' '}
                <a href="mailto:concaverealtyindia@gmail.com" className="text-[#14221F] underline font-bold">
                  concaverealtyindia@gmail.com
                </a>{' '}
                •{' '}
                <a href="tel:+918291090155" className="text-[#14221F] underline font-bold">
                  +91 82910 90155
                </a>
              </p>
            </div>
          </div>

        </article>

      </main>

    </div>
  );
}

export default LegalPage;
