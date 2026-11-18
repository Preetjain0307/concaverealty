import React, { useEffect, useRef } from 'react';
import {
  Scale,
  Globe,
  Gem,
  ShieldCheck,
  MapPin,
  Search,
  Handshake,
  Users,
  Cpu,
  Building2,
} from 'lucide-react';

const LUXURY_BANDS = [
  {
    id: 'about-us',
    index: '01',
    eyebrow: 'ABOUT US',
    headingLine1: 'Where Every Address Begins a',
    headingLine2: 'Legacy',
    description:
      "MahaRERA-registered real estate advisors in Mumbai. We assist homebuyers and NRI investors with verified apartments, sky residences, and under-construction properties across Mumbai's prime neighborhoods.",
    image: '/about/aboutus.jpg',
    imageAlt: 'Concave Realty Mumbai luxury residential towers',
    badgeText: 'MahaRERA: A51900045781 • Mumbai',
    badgePosition: 'left',
    imagePosition: 'left',
    flipBg: false,
    pillars: [
      {
        Icon: Scale,
        title: 'MahaRERA Registered Advisory',
        subtitle: 'Statutory compliance, verified project registrations & RERA disclosures (Reg: A51900045781).',
      },
      {
        Icon: Globe,
        title: 'Global NRI & Expat Desk',
        subtitle: 'Dedicated advisory desk for NRI and overseas buyers acquiring property in Mumbai.',
      },
      {
        Icon: Gem,
        title: 'Curated Residential Portfolio',
        subtitle: 'Access to sea-facing residences, premium towers & landmark developments.',
      },
      {
        Icon: ShieldCheck,
        title: 'Long-Term Lifestyle Advisory',
        subtitle: 'Guidance tailored to your family aspirations and residential living preferences.',
      },
    ],
  },
  {
    id: 'our-mission',
    index: '02',
    eyebrow: 'OUR MISSION',
    headingLine1: 'Making Every Property Journey',
    headingLine2: 'Exceptional',
    description:
      'To make property search and acquisition seamless, transparent, and enjoyable for everyone — helping individuals and families find their ideal home with end-to-end RERA-compliant support.',
    image: '/about/mission.jpg',
    imageAlt: 'Concave Realty Mission - Luxury residential tower at sunset',
    badgeText: 'Prime Architecture • RERA Compliant',
    badgePosition: 'center',
    imagePosition: 'right',
    flipBg: true,
    pillars: [
      {
        Icon: Search,
        title: 'Frictionless Acquisition',
        subtitle: 'Smooth guidance from project shortlisting to site visits and registration.',
      },
      {
        Icon: Handshake,
        title: 'Uncompromising Transparency',
        subtitle: 'Direct developer pricing, clear payment schedules & honest consultation.',
      },
      {
        Icon: ShieldCheck,
        title: 'RERA Compliance Checks',
        subtitle: 'Verification of project registration, sanction numbers & official disclosures.',
      },
      {
        Icon: Users,
        title: 'Family-Centric Guidance',
        subtitle: 'Neighborhoods selected to match your lifestyle, commuting & schooling needs.',
      },
    ],
  },
  {
    id: 'our-vision',
    index: '03',
    eyebrow: 'OUR VISION',
    headingLine1: 'Shaping The Future Of',
    headingLine2: 'Luxury Living',
    description:
      "To be a dependable real estate advisory partner in Mumbai — leveraging technology and honest practices to help homebuyers and investors discover verified properties.",
    image: '/about/vision.jpg',
    imageAlt: 'Concave Realty Vision - Mumbai luxury skyscraper skyline',
    badgeText: 'Prime Architecture • RERA Compliant',
    badgePosition: 'left',
    imagePosition: 'left',
    flipBg: false,
    pillars: [
      {
        Icon: Cpu,
        title: 'Technology-Driven Discovery',
        subtitle: 'Interactive project catalogs and digital tours for a modern property search.',
      },
      {
        Icon: Building2,
        title: 'Reputed Developer Projects',
        subtitle: "Developments by Mumbai's leading and established real estate brands.",
      },
      {
        Icon: Globe,
        title: 'High Professional Standards',
        subtitle: 'Ethical advisory and transparent communication in every interaction.',
      },
      {
        Icon: Gem,
        title: 'Enduring Living Value',
        subtitle: 'Helping you select homes built for lasting satisfaction and quality.',
      },
    ],
  },
];

/**
 * Reusable editorial luxury section band shared by About Us (01), Our Mission (02), and Our Vision (03).
 */
const LuxuryEditorialBand = ({ section, wrapRef, imageRef, textRef, isFirst, isLast }) => {
  const isImageLeft = section.imagePosition === 'left';

  return (
    <section
      id={section.id}
      className={`w-full relative overflow-hidden bg-[#F4ECE0] py-16 sm:py-24 px-6 sm:px-12 lg:px-20 ${
        isFirst ? 'border-t border-[#DACDBA]' : 'border-t border-[#DACDBA]/60'
      } ${isLast ? 'border-b border-[#DACDBA] shadow-sm' : ''}`}
    >
      {/* Matte Champagne Silk Waves & Subtle Architectural Skyline Background */}
      <div
        className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat ${
          section.flipBg ? 'scale-x-[-1]' : ''
        }`}
        style={{ backgroundImage: 'url("/about/about-bg.jpg")' }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        {/* Property Image Column (~42% width on desktop) */}
        <div
          ref={wrapRef}
          className={`about-frame-wrap lg:col-span-5 relative group ${
            isImageLeft ? '' : 'order-1 lg:order-2'
          }`}
        >
          <div
            className="about-corner-tl absolute -top-3.5 -left-3.5 w-12 h-12 border-t-[1.5px] border-l-[1.5px] border-[#B78A3F]/85 rounded-tl-xl z-10 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="about-corner-br absolute -bottom-3.5 -right-3.5 w-12 h-12 border-b-[1.5px] border-r-[1.5px] border-[#B78A3F]/85 rounded-br-xl z-10 pointer-events-none"
            aria-hidden="true"
          />

          <div className="p-[2px] rounded-[16px] bg-gradient-to-br from-[#F6E4B8] via-[#CFA962] to-[#EBD296] shadow-[0_22px_50px_-14px_rgba(24,60,50,0.26)]">
            <div
              ref={imageRef}
              className="lodha-frame relative w-full h-[360px] sm:h-[440px] lg:h-[490px] !rounded-[14px] overflow-hidden !bg-gradient-to-br !from-[#FAF3E6] !via-[#EFE2CB] !to-[#F5EBD8]"
            >
              <img
                src={section.image}
                alt={section.imageAlt}
                className="lodha-frame-img"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#183C32]/40 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Dark Forest-Green Pill Overlay */}
          <div
            className="absolute bottom-4 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-none bg-[#183C32]/95 backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-[#B78A3F]/65 text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium text-[#F7F3EB] shadow-lg flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 z-10 truncate"
          >
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B78A3F] shrink-0" strokeWidth={2} />
            <span className="truncate">{section.badgeText}</span>
          </div>
        </div>

        {/* Editorial Content Column */}
        <div
          ref={textRef}
          className={`lg:col-span-7 space-y-6 lodha-text-block ${
            isImageLeft ? '' : 'order-2 lg:order-1'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span className="text-xs font-mono font-bold text-[#B78A3F] tracking-wider px-2.5 py-1 rounded-md border border-[#B78A3F]/35 bg-[#F7F3EB] shadow-xs">
              {section.index}
            </span>
            <div className="h-[1px] w-14 bg-[#B78A3F]/70" />
            <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#B78A3F]">
              {section.eyebrow}
            </span>
          </div>

          <h2
            className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[#183C32] tracking-tight leading-[1.12]"
            style={{
              fontFamily: '"Cormorant Garamond", Cinzel, serif',
              fontVariantCaps: 'small-caps',
            }}
          >
            {section.headingLine1}
            <br className="hidden lg:inline" /> {section.headingLine2}
          </h2>

          <div className="border-l-2 border-[#B78A3F] pl-5 py-0.5">
            <p className="text-[15px] sm:text-base leading-[1.78] text-[#554B3E] font-normal">
              {section.description}
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 auto-rows-fr gap-4">
            {section.pillars.map(({ Icon, title, subtitle }, cardIdx) => (
              <div
                key={title}
                style={{ '--stagger-delay': `${0.35 + cardIdx * 0.14}s` }}
                className="about-stagger-card h-full bg-[#F7F3EB]/95 backdrop-blur-sm rounded-[14px] p-4 border border-[#DFD2BE] shadow-[0_8px_22px_rgba(92,78,58,0.09)] hover:border-[#B78A3F]/65 hover:shadow-[0_14px_28px_rgba(92,78,58,0.14)] flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-full bg-[#EFE4D0] border border-[#B78A3F]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#B78A3F]" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] sm:text-sm font-bold text-[#183C32] tracking-tight leading-snug">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#6A5F52] mt-0.5 leading-snug">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * About Us (01), Our Mission (02), and Our Vision (03) editorial showcase for Concave Realty.
 */
export const AboutUs = () => {
  const bandWrapRefs = useRef([]);
  const bandImageRefs = useRef([]);
  const bandTextRefs = useRef([]);

  useEffect(() => {
    // Fallback if IntersectionObserver is unsupported in older environments
    if (!('IntersectionObserver' in window)) {
      bandWrapRefs.current.forEach((el) => el?.classList.add('is-revealed'));
      bandImageRefs.current.forEach((el) => el?.classList.add('is-revealed'));
      bandTextRefs.current.forEach((el) => el?.classList.add('is-revealed'));
      return;
    }

    const pairs = LUXURY_BANDS.map((_, idx) => ({
      triggers: [bandImageRefs.current[idx], bandTextRefs.current[idx]].filter(Boolean),
      targets: [
        bandWrapRefs.current[idx],
        bandImageRefs.current[idx],
        bandTextRefs.current[idx],
      ],
    }));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = pairs.find((p) => p.triggers.includes(entry.target));
            if (match) {
              match.targets.forEach((t) => t?.classList.add('is-revealed'));
              // Keep permanently revealed — unobserve so it stays visible forever!
              match.triggers.forEach((trig) => {
                if (trig) observer.unobserve(trig);
              });
            }
          }
        });
      },
      {
        threshold: 0.08, // Start revealing smoothly as soon as 8% enters screen
        rootMargin: '0px 0px -40px 0px',
      }
    );

    // Initial check: if already in viewport on mount, reveal immediately
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    pairs.forEach(({ triggers, targets }) => {
      const alreadyInView = triggers.some((trig) => {
        if (!trig) return false;
        const rect = trig.getBoundingClientRect();
        return rect.top < windowHeight && rect.bottom > 0;
      });
      if (alreadyInView) {
        targets.forEach((t) => t?.classList.add('is-revealed'));
      } else {
        triggers.forEach((trigger) => {
          if (trigger) observer.observe(trigger);
        });
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-white w-full overflow-x-hidden">
      {LUXURY_BANDS.map((section, idx) => (
        <LuxuryEditorialBand
          key={section.id}
          section={section}
          isFirst={idx === 0}
          isLast={idx === LUXURY_BANDS.length - 1}
          wrapRef={(el) => {
            bandWrapRefs.current[idx] = el;
          }}
          imageRef={(el) => {
            bandImageRefs.current[idx] = el;
          }}
          textRef={(el) => {
            bandTextRefs.current[idx] = el;
          }}
        />
      ))}
    </div>
  );
};

export default AboutUs;
