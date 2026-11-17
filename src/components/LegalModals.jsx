import React from 'react';
import { X, ShieldCheck, FileText, AlertTriangle, Scale, CheckCircle2, Cookie } from 'lucide-react';

export function LegalModal({ isOpen, onClose, title, subtitle, icon: Icon, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-[#FAF9F6] rounded-2xl shadow-2xl overflow-hidden my-auto border border-[#C59B4E]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-[#183C32] text-white border-b border-[#C59B4E]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#245348] border border-[#C59B4E] flex items-center justify-center text-[#DFBE79] shadow-inner">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#F7F3EB]"
                style={{ fontFamily: '"Cormorant Garamond", Cinzel, serif' }}
              >
                {title}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#DFBE79] font-medium font-mono">
                {subtitle || "Concave Realty • MahaRERA Reg: A51900045781"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6 text-sm text-[#443E36] leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-[#EFE9E2] border-t border-[#DFD6CA] flex items-center justify-between text-xs text-[#6A5F52]">
          <span className="flex items-center gap-1.5 font-medium font-mono text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#183C32]" />
            <span>MahaRERA Registered Agent: A51900045781</span>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#183C32] hover:bg-[#245348] text-white font-semibold uppercase tracking-wider text-[11px] transition-colors cursor-pointer shadow-sm"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PRIVACY POLICY MODAL
   India Digital Personal Data Protection Act 2023 compliant
───────────────────────────────────────────────────────────────────────────── */
export function PrivacyPolicyModal({ isOpen, onClose }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy Policy"
      subtitle="Data Protection & Client Privacy Governance"
      icon={ShieldCheck}
    >
      <div className="space-y-5">
        <p className="font-medium text-[#183C32] text-xs">
          Last Updated: November 2025 &nbsp;|&nbsp; Concave Realty, Mumbai, Maharashtra, India
        </p>
        <p className="text-xs sm:text-sm text-[#5A5248]">
          This Privacy Policy is published in accordance with the Digital Personal Data Protection Act, 2023
          (DPDP Act) of India and governs the collection, use, and protection of personal data submitted
          through the Concave Realty website. Concave Realty is a registered real estate channel partner
          and advisory firm (MahaRERA Agent No. A51900045781), not a company or developer.
        </p>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
          <strong>Notice to Data Principals:</strong> By submitting an enquiry form on this website, you
          explicitly consent (via a consent checkbox on the form) to the collection and use of your personal
          data as described below. You may withdraw consent at any time by writing to us.
        </div>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">1. Data We Collect</h4>
          <p className="text-xs text-[#6A5F52]">We collect only the data you voluntarily provide through our enquiry / consultation booking form:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Full Name</strong> — to address you personally and assign a Relationship Manager.</li>
            <li><strong>Mobile Number</strong> — for OTP-based verification and direct callback by our advisory team.</li>
            <li><strong>Email Address</strong> — to send project brochures and consultation confirmations (with your consent).</li>
            <li><strong>Location Preference</strong> — the Mumbai micro-market you are interested in (e.g., Borivali, Kandivali, Malad, Andheri, Bandra, Lower Parel).</li>
            <li><strong>Project of Interest</strong> — the specific development(s) you have expressed interest in.</li>
            <li><strong>OTP Verification Record</strong> — a one-time password generated and verified in-browser for form authentication. No SMS is sent; the OTP is displayed on-screen.</li>
          </ul>
          <p className="text-xs text-[#6A5F52] pt-1">We do <strong>not</strong> collect payment details, Aadhaar numbers, PAN numbers, or any sensitive personal data.</p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">2. Purpose of Collection &amp; Legal Basis</h4>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Facilitate consultations:</strong> Assign your enquiry to a certified, location-specific Relationship Manager who will contact you within advisory hours (Mon–Sun, 9 AM – 8 PM IST).</li>
            <li><strong>Project updates:</strong> Send relevant property information, pricing updates, and launch alerts — only with your explicit prior consent provided at the time of form submission.</li>
            <li><strong>Developer follow-up:</strong> Where required, share your contact details with the relevant developer's sales team for direct project communication (disclosed below).</li>
          </ul>
          <p className="text-xs sm:text-sm pt-1">
            <strong>Legal basis under DPDP Act 2023:</strong> User consent — you provide explicit opt-in consent
            by checking the consent checkbox on the enquiry form before submitting. Without checking this box,
            the form cannot be submitted.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">3. Data Storage &amp; Retention</h4>
          <p className="text-xs sm:text-sm">
            Enquiry data submitted through our website is stored <strong>only in your browser's localStorage</strong>
            on your device. This is a client-side, session-based storage mechanism. We do not operate external
            servers, databases, or CRM systems that receive or store your personal data from the website form.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Data in localStorage persists on your device until you clear your browser data or we programmatically remove it.</li>
            <li>We do not transmit your form data to any third-party server or cloud database.</li>
            <li>No data is transferred outside India. All processing occurs locally in your browser (data localisation compliant).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">4. Data Sharing</h4>
          <p className="text-xs sm:text-sm">
            Your personal data is <strong>not sold, rented, or traded</strong> to any third party. The only
            disclosed sharing is:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Relevant Developer:</strong> Where you have expressed interest in a specific RERA-registered project, your name and contact number may be shared with that developer's authorised sales team for direct follow-up. This is disclosed at the point of form submission.</li>
            <li>No data is shared with marketing agencies, broker syndicates, telemarketers, or analytics platforms.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">5. Cookies &amp; Tracking</h4>
          <p className="text-xs sm:text-sm">
            This website does <strong>not use tracking cookies, analytics cookies, advertising cookies</strong>,
            or any form of cross-site tracking. We use browser localStorage solely for functional
            in-session lead management. See our separate <strong>Cookie Policy</strong> for full details.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">6. Your Rights under DPDP Act 2023</h4>
          <p className="text-xs sm:text-sm">As a Data Principal under the DPDP Act, 2023, you have the following rights:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Right to Access:</strong> Request a summary of personal data we hold about you.</li>
            <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data at any time.</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent for processing at any time, without affecting the lawfulness of processing already done.</li>
            <li><strong>Right to Nominate:</strong> Nominate another individual to exercise these rights on your behalf in the event of incapacity or death (as provided under DPDP Act, 2023).</li>
            <li><strong>Right to Grievance Redressal:</strong> Lodge a complaint with our Grievance Officer (details below) or escalate to the Data Protection Board of India once constituted.</li>
          </ul>
          <p className="text-xs sm:text-sm pt-1">
            To exercise any of these rights, email us at{' '}
            <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">
              concaverealtyindia@gmail.com
            </a>{' '}
            with the subject line "DPDP Rights Request". We will respond within <strong>72 hours</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">7. Grievance Officer / Data Protection Officer</h4>
          <ul className="list-none space-y-1 text-xs sm:text-sm">
            <li><strong>Name:</strong> Grievance Officer, Concave Realty</li>
            <li><strong>Email:</strong> <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">concaverealtyindia@gmail.com</a></li>
            <li><strong>Phone:</strong> +91 82910 90155</li>
            <li><strong>Address:</strong> Mumbai, Maharashtra, India</li>
            <li><strong>Response Time:</strong> Within 72 hours of receipt of grievance</li>
            <li><strong>Advisory Hours:</strong> Monday – Sunday, 9:00 AM – 8:00 PM IST</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">8. Changes to this Policy</h4>
          <p className="text-xs sm:text-sm">
            We may update this Privacy Policy from time to time to reflect changes in applicable law or our
            practices. The latest version will always be available on this website with the updated date
            prominently displayed.
          </p>
        </section>
      </div>
    </LegalModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TERMS & CONDITIONS MODAL
───────────────────────────────────────────────────────────────────────────── */
export function TermsConditionsModal({ isOpen, onClose }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms & Conditions"
      subtitle="Advisory Framework & Terms of Engagement"
      icon={Scale}
    >
      <div className="space-y-5">
        <p className="font-medium text-[#183C32] text-xs">
          Last Updated: November 2025 &nbsp;|&nbsp; Concave Realty, Mumbai, Maharashtra, India
        </p>
        <p className="text-xs sm:text-sm text-[#5A5248]">
          By accessing and using this website, you agree to be bound by these Terms &amp; Conditions.
          Please read them carefully before using the services offered herein. If you do not agree,
          please discontinue use of this website.
        </p>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
          <strong>Important:</strong> Concave Realty is a registered real estate advisory channel partner
          (MahaRERA Agent No. A51900045781) and is <strong>NOT</strong> a developer, promoter, builder,
          or seller of any real estate property. All transactions are between the buyer and the respective developer.
        </div>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">1. Nature of Service — Advisory &amp; Channel Partner</h4>
          <p className="text-xs sm:text-sm">
            Concave Realty operates exclusively as a real estate advisory and channel partner, duly registered
            under MahaRERA (Agent Registration No. A51900045781). Our role is to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Curate and present information about RERA-registered real estate projects to prospective buyers.</li>
            <li>Facilitate introductions between interested buyers and the developer's authorised sales teams.</li>
            <li>Provide general real estate advisory, not financial or investment advice.</li>
          </ul>
          <p className="text-xs sm:text-sm pt-1">
            Concave Realty is <strong>not</strong> a developer, promoter, or seller. We do not hold any title
            to any property listed on this website. All sale agreements are executed directly between the buyer
            and the respective developer entity.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">2. Indicative Pricing &amp; Project Availability</h4>
          <p className="text-xs sm:text-sm">
            All prices, payment schedules, floor plans, carpet areas, unit configurations, and availability
            status displayed on this website are <strong>indicative only</strong> and provided for general
            information purposes. They are subject to revision by the respective developer without prior notice.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Final pricing is determined solely by the developer and is subject to change at any time prior to execution of a formal Agreement for Sale.</li>
            <li>Promotional offers, subvention schemes, and payment plans are developer-specific and subject to their terms.</li>
            <li>Concave Realty assumes no liability for discrepancies between indicative and final pricing.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">3. Independent MahaRERA Verification</h4>
          <p className="text-xs sm:text-sm">
            Prospective buyers are strongly advised to independently verify all details of any real estate
            project on the official MahaRERA portal at{' '}
            <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#183C32] font-semibold underline">
              maharera.maharashtra.gov.in
            </a>{' '}
            before making any financial commitment. This includes verifying:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Project RERA registration status and validity.</li>
            <li>Approved floor plans, sanction plans, and carpet area certifications.</li>
            <li>Developer's compliance history and project completion timelines.</li>
            <li>Encumbrance certificates and title documents (via independent legal counsel).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">4. Artistic Impressions &amp; Renders</h4>
          <p className="text-xs sm:text-sm">
            All photographs, 3D architectural renders, virtual walkthroughs, interior visualisations, 
            and lifestyle imagery displayed on this website are <strong>artist impressions only</strong>.
            They are created for illustrative purposes and may not accurately reflect the actual finished
            product, materials, finishes, landscaping, or surrounding environment. Actual deliverables
            are governed by the Agreement for Sale executed with the developer.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">5. No Guaranteed Returns / No Investment Advice</h4>
          <p className="text-xs sm:text-sm">
            Nothing on this website constitutes financial advice, investment advice, or a guarantee of
            returns of any kind. Real estate investments are subject to market risks. Concave Realty does
            not guarantee appreciation, rental yields, or any form of financial return. Buyers are advised
            to consult independent financial advisors before making investment decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">6. Intellectual Property Rights</h4>
          <p className="text-xs sm:text-sm">
            All website content, including but not limited to branding, logo, text, editorial copy, design
            layouts, and original photographic or graphic works, is the intellectual property of Concave Realty.
            Developer-provided renders, brochures, and marketing materials remain the property of the respective
            developer. Unauthorised reproduction, distribution, or use of any content without prior written
            consent is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">7. Limitation of Liability</h4>
          <p className="text-xs sm:text-sm">
            Concave Realty's liability is strictly limited to the advisory services it provides as a channel
            partner. We shall not be liable for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Any loss arising from reliance on indicative prices, availability, or project details displayed on this website.</li>
            <li>Delays, defaults, or disputes between the buyer and the developer.</li>
            <li>Any indirect, consequential, or incidental loss or damage of any nature.</li>
            <li>Errors or omissions in developer-provided information reproduced on this website in good faith.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">8. Force Majeure</h4>
          <p className="text-xs sm:text-sm">
            Concave Realty shall not be held liable for any failure or delay in performance of its advisory
            obligations due to circumstances beyond its reasonable control, including but not limited to natural
            disasters, acts of government, pandemics, civil unrest, nationwide internet outages, or any other
            event constituting force majeure under applicable Indian law.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">9. Governing Law &amp; Jurisdiction</h4>
          <p className="text-xs sm:text-sm">
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of India.
            Any disputes arising from or in connection with the use of this website or the services of
            Concave Realty shall be subject to the exclusive jurisdiction of the competent courts in
            <strong> Mumbai, Maharashtra, India</strong>.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">10. Contact Us</h4>
          <ul className="list-none space-y-1 text-xs sm:text-sm">
            <li><strong>Email:</strong> <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">concaverealtyindia@gmail.com</a></li>
            <li><strong>Phone:</strong> +91 82910 90155</li>
            <li><strong>Advisory Hours:</strong> Monday – Sunday, 9:00 AM – 8:00 PM IST</li>
            <li><strong>Address:</strong> Mumbai, Maharashtra, India</li>
          </ul>
        </section>
      </div>
    </LegalModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DISCLAIMER MODAL
───────────────────────────────────────────────────────────────────────────── */
export function DisclaimerModal({ isOpen, onClose }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Disclaimer & MahaRERA Disclosure"
      subtitle="Regulatory Disclosures & Statutory Transparency"
      icon={AlertTriangle}
    >
      <div className="space-y-5">
        <p className="font-medium text-[#183C32] text-xs">
          Last Updated: November 2025 &nbsp;|&nbsp; Concave Realty, MahaRERA Agent No. A51900045781
        </p>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
          <strong>MahaRERA Compliance Notice:</strong> Concave Realty is a registered real estate channel
          partner under the Real Estate (Regulation and Development) Act, 2016.{' '}
          <strong>MahaRERA Agent Registration No: A51900045781.</strong> All projects promoted by us are
          individually registered under MahaRERA. Buyers are advised to verify details independently at{' '}
          <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="underline font-semibold text-amber-900">
            maharera.maharashtra.gov.in
          </a>.
        </div>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">1. Not an Official Offer for Sale</h4>
          <p className="text-xs sm:text-sm">
            The content published on this website — including project descriptions, pricing, floor plans,
            specifications, and lifestyle imagery — does <strong>not</strong> constitute a formal offer for
            sale, agreement for sale, prospectus, or legally binding contract of any nature. Any sale of
            real estate is governed exclusively by the written Agreement for Sale executed between the
            purchaser and the designated developer entity, in compliance with RERA and applicable law.
            Concave Realty, as a channel partner, is not a party to any such sale agreement.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">2. Artistic Impressions &amp; Developer Renders</h4>
          <p className="text-xs sm:text-sm">
            All photographs, 3D architectural visualisations, computer-generated imagery (CGI), simulated
            virtual walkthroughs, interior furniture and fixture arrangements, and panoramic skyline or
            landscape imagery displayed on this website are <strong>artistic impressions and developer-provided renders only</strong>.
            They are conceptual representations for marketing purposes. Actual finished apartments, building
            elevations, materials, textures, landscaping, amenities, and surrounding environments may differ
            from what is depicted, subject to approvals from competent municipal and statutory authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">3. Pricing Disclaimer</h4>
          <p className="text-xs sm:text-sm">
            All prices mentioned on this website are indicative only and are subject to change without notice.
            Final pricing, payment schedules, and applicable taxes (GST, stamp duty, registration charges)
            are determined by the respective developer and the prevailing government regulations. Please contact
            our advisory team or the developer's sales office for current, confirmed pricing before making
            any financial commitment.
          </p>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <strong>Note:</strong> Prices are subject to revision by developers at any time. Concave Realty
            bears no responsibility for price variations between the time of enquiry and booking.
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">4. MahaRERA Registered Projects — RERA Numbers</h4>
          <p className="text-xs sm:text-sm text-[#5A5248] pb-1">
            The following are sample RERA registrations for featured projects. All 43+ projects listed on
            this portal are individually registered under MahaRERA. Buyers must verify current registration
            status independently on the official portal.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
              <thead className="bg-[#183C32] text-white">
                <tr>
                  <th className="p-2.5">Development Name</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">MahaRERA Registration No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr className="bg-emerald-50/70 text-[#183C32] font-semibold">
                  <td className="p-2.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Concave Realty (Channel Partner)</span>
                  </td>
                  <td className="p-2.5">Mumbai, Maharashtra</td>
                  <td className="p-2.5 font-mono text-emerald-900 font-bold">A51900045781</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">Kalpataru Advay</td>
                  <td className="p-2.5">Borivali West, Mumbai</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">P51800077381</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">Godrej Skyshore</td>
                  <td className="p-2.5">Versova, Mumbai</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">P51800054522</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">Godrej Reserve</td>
                  <td className="p-2.5">Kandivali East, Mumbai</td>
                  <td className="p-2.5 font-mono text-emerald-800 font-bold">P51800054420</td>
                </tr>
                <tr>
                  <td className="p-2.5 italic text-[#6A5F52]" colSpan={3}>
                    + 39 additional RERA-registered projects available on this portal. Each project's
                    RERA number is available on its individual listing page. Verify all at{' '}
                    <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#183C32] font-semibold underline">
                      maharera.maharashtra.gov.in
                    </a>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">5. No Guaranteed Returns</h4>
          <p className="text-xs sm:text-sm">
            Nothing on this website should be construed as a promise, projection, or guarantee of financial
            returns, rental yields, or capital appreciation. Real estate investment involves risks and
            prospective buyers should conduct independent due diligence and consult financial advisors
            before making any investment decision.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">6. Official MahaRERA Portal</h4>
          <p className="text-xs sm:text-sm">
            For independent verification of project registrations, developer credentials, quarterly progress
            reports, and complaint status, buyers are directed to the official MahaRERA website:{' '}
            <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#183C32] font-bold underline">
              maharera.maharashtra.gov.in
            </a>
          </p>
        </section>
      </div>
    </LegalModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COOKIE POLICY MODAL (NEW)
───────────────────────────────────────────────────────────────────────────── */
export function CookiePolicyModal({ isOpen, onClose }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cookie Policy"
      subtitle="Transparency on Data Storage & Browser Usage"
      icon={Cookie}
    >
      <div className="space-y-5">
        <p className="font-medium text-[#183C32] text-xs">
          Last Updated: November 2025 &nbsp;|&nbsp; Concave Realty, Mumbai, Maharashtra, India
        </p>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex gap-2 items-start">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-700" />
          <span>
            <strong>Good news:</strong> This website does <strong>not use tracking cookies, advertising cookies,
            or analytics cookies</strong> of any kind. No cookie consent banner is required because we do not
            set any tracking or non-essential cookies.
          </span>
        </div>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">1. No Tracking Cookies</h4>
          <p className="text-xs sm:text-sm">
            Concave Realty's website is built with a privacy-first approach. We do <strong>not</strong> use:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Google Analytics or any analytics platform</li>
            <li>Facebook Pixel or Meta tracking</li>
            <li>Google Ads / DoubleClick advertising cookies</li>
            <li>Any cross-site tracking or fingerprinting technologies</li>
            <li>Session cookies set by us for user tracking</li>
          </ul>
          <p className="text-xs sm:text-sm pt-1">
            Because we do not set any tracking or non-essential cookies ourselves, no cookie consent
            banner or pop-up is legally required under applicable Indian law or international best practice
            frameworks for this website.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">2. Browser localStorage (Not a Cookie)</h4>
          <p className="text-xs sm:text-sm">
            For functional purposes, this website uses your browser's <strong>localStorage</strong> — a
            standard web storage mechanism that is <strong>not a cookie</strong> and works differently:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>localStorage data is stored only on <strong>your device</strong>, not transmitted to our servers.</li>
            <li>It does <strong>not</strong> track you across different websites.</li>
            <li>It is not accessible to third-party websites.</li>
            <li>It is used solely to retain your enquiry form submission details within the current browser session for in-page lead management (e.g., to avoid re-entering your details if you navigate the site).</li>
          </ul>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs mt-2">
            <strong>What is stored in localStorage?</strong> If you submit an enquiry form, your name,
            contact number, email, location preference, and project interest are saved locally in your
            browser's localStorage. This data is not sent to any external server.
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">3. Third-Party Services &amp; Potential Browser Activity</h4>
          <p className="text-xs sm:text-sm">
            While we do not set tracking cookies ourselves, the following third-party services embedded in
            this website may interact with your browser in limited ways:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Google Fonts (fonts.googleapis.com):</strong> Our website loads typefaces from Google's
              CDN for visual design. Google may cache fonts in your browser. No personal data is shared with
              Google through this process, and no tracking cookies are set by Google Fonts.
            </li>
            <li>
              <strong>Google Maps (Embedded Iframe):</strong> Project detail pages may include an embedded
              Google Maps iframe to show project location. When you interact with or view this iframe, Google
              may set its own cookies in your browser as part of Google's standard Maps service. We do not
              control Google's cookie behaviour. You can review Google's privacy policy at{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="text-[#183C32] font-semibold underline">
                policies.google.com/privacy
              </a>.
            </li>
            <li>
              <strong>Virtual Tour (pixeldo.com):</strong> Some project listings include an embedded virtual
              tour hosted by Pixeldo. When you interact with this iframe, Pixeldo's servers may serve the
              virtual tour content. We recommend reviewing Pixeldo's privacy practices if you have concerns.
            </li>
          </ul>
          <p className="text-xs sm:text-sm pt-1 text-[#6A5F52]">
            These third-party services are embedded to enhance your browsing experience. Concave Realty is
            not responsible for cookies or data collection performed by these third-party platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">4. How to Clear localStorage &amp; Browser Data</h4>
          <p className="text-xs sm:text-sm">
            You can clear all localStorage data stored by this website at any time through your browser settings:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Clear browsing data → Cached images and files / Site data</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Firefox:</strong> Options → Privacy &amp; Security → Cookies and Site Data → Clear Data</li>
            <li><strong>Edge:</strong> Settings → Privacy, search, and services → Clear browsing data</li>
          </ul>
          <p className="text-xs sm:text-sm pt-1">
            Clearing browser data will remove any locally stored enquiry form information associated with
            this website.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">5. Summary</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
              <thead className="bg-[#183C32] text-white">
                <tr>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Used?</th>
                  <th className="p-2.5">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td className="p-2.5">Tracking / Analytics Cookies</td>
                  <td className="p-2.5 text-red-600 font-bold">No</td>
                  <td className="p-2.5">Not applicable</td>
                </tr>
                <tr>
                  <td className="p-2.5">Advertising Cookies</td>
                  <td className="p-2.5 text-red-600 font-bold">No</td>
                  <td className="p-2.5">Not applicable</td>
                </tr>
                <tr>
                  <td className="p-2.5">Browser localStorage</td>
                  <td className="p-2.5 text-emerald-700 font-bold">Yes</td>
                  <td className="p-2.5">Functional — in-session enquiry form data only</td>
                </tr>
                <tr>
                  <td className="p-2.5">Google Fonts (CDN cache)</td>
                  <td className="p-2.5 text-amber-600 font-bold">3rd party</td>
                  <td className="p-2.5">Font delivery — no personal data</td>
                </tr>
                <tr>
                  <td className="p-2.5">Google Maps iframe</td>
                  <td className="p-2.5 text-amber-600 font-bold">3rd party</td>
                  <td className="p-2.5">Project location display — Google's own cookies</td>
                </tr>
                <tr>
                  <td className="p-2.5">Pixeldo Virtual Tour</td>
                  <td className="p-2.5 text-amber-600 font-bold">3rd party</td>
                  <td className="p-2.5">Virtual walkthrough delivery</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">6. Contact Us</h4>
          <p className="text-xs sm:text-sm">
            For any questions about this Cookie Policy or our data practices, please contact:
          </p>
          <ul className="list-none space-y-1 text-xs sm:text-sm">
            <li><strong>Email:</strong> <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">concaverealtyindia@gmail.com</a></li>
            <li><strong>Phone:</strong> +91 82910 90155</li>
            <li><strong>Advisory Hours:</strong> Monday – Sunday, 9:00 AM – 8:00 PM IST</li>
          </ul>
        </section>
      </div>
    </LegalModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SMART ODR MODAL
───────────────────────────────────────────────────────────────────────────── */
export function SmartODRModal({ isOpen, onClose }) {
  return (
    <LegalModal
      isOpen={isOpen}
      onClose={onClose}
      title="SMART ODR Compliance"
      subtitle="Online Dispute Resolution & Grievance Redressal"
      icon={Scale}
    >
      <div className="space-y-5">
        <p className="font-medium text-[#183C32] text-xs">
          Last Updated: November 2025 &nbsp;|&nbsp; Concave Realty, MahaRERA Agent No. A51900045781
        </p>

        <p className="text-xs sm:text-sm text-[#5A5248]">
          In alignment with consumer grievance redressal frameworks applicable to real estate advisory
          services, Concave Realty supports transparency and timely resolution of client concerns through
          the following structured escalation matrix.
        </p>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
          <strong>SMART ODR (Online Dispute Resolution):</strong> As a MahaRERA-registered agent, Concave
          Realty is committed to fair and timely grievance resolution. Unresolved disputes may be escalated
          to the SMART ODR portal at{' '}
          <a href="https://smartodr.in" target="_blank" rel="noreferrer" className="underline font-semibold">
            smartodr.in
          </a>.
        </div>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">Client Escalation Matrix</h4>
          <ol className="list-decimal pl-5 space-y-3 text-xs sm:text-sm">
            <li>
              <strong>Level 1 — Primary Relationship Officer:</strong>
              <p className="mt-1 text-[#5A5248]">
                Contact your designated Relationship Manager directly via phone or WhatsApp at{' '}
                <strong>+91 82910 90155</strong> during advisory hours (Monday – Sunday, 9:00 AM – 8:00 PM IST).
                Most queries are resolved at this stage.
              </p>
            </li>
            <li>
              <strong>Level 2 — Grievance Officer / Data Protection Officer:</strong>
              <p className="mt-1 text-[#5A5248]">
                For unresolved matters, escalate in writing to our Grievance Officer at{' '}
                <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">
                  concaverealtyindia@gmail.com
                </a>{' '}
                with the subject line "Grievance — [Your Name]". We acknowledge all grievances within
                <strong> 72 hours</strong> and aim to resolve them within <strong>15 business days</strong>.
              </p>
            </li>
            <li>
              <strong>Level 3 — MahaRERA Complaint:</strong>
              <p className="mt-1 text-[#5A5248]">
                For complaints specifically related to a RERA-registered project (developer conduct, project
                delays, false representations), buyers may lodge a complaint directly with MahaRERA at{' '}
                <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noreferrer" className="text-[#183C32] font-semibold underline">
                  maharera.maharashtra.gov.in
                </a>. As a registered channel partner, Concave Realty will cooperate fully with any
                MahaRERA inquiry.
              </p>
            </li>
            <li>
              <strong>Level 4 — SMART ODR Portal:</strong>
              <p className="mt-1 text-[#5A5248]">
                If a matter remains unresolved after 30 days from the date of formal grievance submission,
                it may be submitted to the SMART Online Dispute Resolution portal at{' '}
                <a href="https://smartodr.in" target="_blank" rel="noreferrer" className="text-[#183C32] font-semibold underline">
                  smartodr.in
                </a>{' '}
                for independent mediation and arbitration.
              </p>
            </li>
          </ol>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">Grievance Officer Contact Details</h4>
          <ul className="list-none space-y-1 text-xs sm:text-sm">
            <li><strong>Role:</strong> Grievance Officer &amp; Data Protection Officer</li>
            <li><strong>Organisation:</strong> Concave Realty (MahaRERA Agent No. A51900045781)</li>
            <li><strong>Email:</strong> <a href="mailto:concaverealtyindia@gmail.com" className="text-[#183C32] font-semibold underline">concaverealtyindia@gmail.com</a></li>
            <li><strong>Phone:</strong> +91 82910 90155</li>
            <li><strong>Address:</strong> Mumbai, Maharashtra, India</li>
            <li><strong>Response SLA:</strong> Acknowledgement within 72 hours; resolution within 15 business days</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h4 className="font-bold text-[#183C32] text-base">Scope of Grievance Redressal</h4>
          <p className="text-xs sm:text-sm text-[#5A5248]">
            Concave Realty's grievance redressal covers matters within our role as a channel partner — including
            mis-communication of project details, data privacy complaints, and conduct of advisory staff.
            Complaints regarding developer conduct, construction quality, possession delays, or financial
            disputes with the developer should be directed to MahaRERA or appropriate consumer forums.
          </p>
        </section>
      </div>
    </LegalModal>
  );
}
