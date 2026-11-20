import React, { useEffect, useState, useRef } from 'react';

/**
 * =========================================================================
 * 2-SECOND LUXURY BRAND LOADING SCREEN (SEAMLESS DUAL-SKYLINE CANVAS)
 * =========================================================================
 * - Warm Beige Canvas (#F4ECE0) matching About Us editorial section.
 * - Buildings on BOTH SIDES + light-shade buildings across the center horizon.
 * - 100% seamless background (zero vertical seam lines).
 * - All tab containers / pills completely removed as requested.
 * - Clean, crisp logo that smoothly recedes backward into the center horizon.
 * - Single-line typography: "CONCAVE REALTY" in Playfair Display with close tracking.
 * - Tagline: "Where Legacy Meets Luxury" bold and clearly visible in deep emerald (#14221F).
 * - Duration: strictly 2.0 seconds (2000ms) with smooth cross-fade to homepage.
 * =========================================================================
 */
export function SplashIntro({ onFinish }) {
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sunAscended, setSunAscended] = useState(false);
  const finishTriggered = useRef(false);

  // Smooth exit transition into the home page
  const triggerFinish = () => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;
    setClosing(true);
    setTimeout(() => {
      onFinish();
    }, 450); // 450ms smooth cross-fade to homepage
  };

  // Trigger receding backward right on mount
  useEffect(() => {
    const animTimer = setTimeout(() => {
      setSunAscended(true);
    }, 60);

    return () => clearTimeout(animTimer);
  }, []);

  // Strictly 2.0-second countdown
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2000; // 2.0 seconds strictly

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        triggerFinish();
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={triggerFinish}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none transition-all duration-500 ease-out cursor-pointer ${
        closing ? 'opacity-0 scale-[1.015] pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#F4ECE0' }}
      title="Click to enter Concave Realty"
    >
      {/* ── 1. Perfectly Seamless Architectural Skyline (Left, Right & Center Light Shade) ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: 'url("/about/about-bg-dual.jpg?v=3")',
          animation: 'kenBurnsSlow1 24s ease-in-out infinite',
        }}
        aria-hidden="true"
      />

      {/* ── 2. Subtle Frosted Glass Vignette at Bottom Edge (Soft Grounding) ── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F4ECE0]/85 via-transparent to-transparent" />

      {/* ── 3. Main Stage: Focused Pure Identity (No Box/Tab/Pill) ── */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 text-center max-w-2xl w-full space-y-4 sm:space-y-4.5">
        
        {/* ── The Logo Recedes Backward into the Center Horizon ── */}
        <div className="relative flex items-center justify-center">
          <div
            className="relative transition-all duration-1000 ease-out"
            style={{
              transform: sunAscended
                ? 'perspective(900px) translateZ(0px) scale(1.0) translateY(0px)'
                : 'perspective(900px) translateZ(100px) scale(1.35) translateY(24px)',
            }}
          >
            {/* Clean, Elegant Logo Housing */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-[#B78A3F] p-1 bg-white shadow-[0_8px_24px_rgba(183,138,63,0.22)] flex items-center justify-center">
              <img
                src="/logo_icon.jpg"
                alt="Concave Realty"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        </div>

        {/* ── Brand Typography: Sits Harmoniously Below the Logo ── */}
        <div
          className={`space-y-1 sm:space-y-1.5 w-full transition-all duration-700 delay-150 ${
            sunAscended ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Primary Majestic Title - Close Tracking, Single Line, Deep Solid Forest Emerald (#14221F) */}
          <div className="w-full flex items-center justify-center overflow-visible">
            <h1
              className="text-2xl xs:text-3xl sm:text-4xl md:text-[50px] font-extrabold tracking-tight sm:tracking-[0.02em] whitespace-nowrap leading-none select-none text-[#14221F] drop-shadow-sm"
              style={{
                fontFamily: '"Playfair Display", "Cinzel", serif',
              }}
            >
              CONCAVE REALTY
            </h1>
          </div>

          {/* Tagline: Bold & Clearly Legible */}
          <p
            className="text-xs xs:text-sm sm:text-base md:text-lg font-serif italic tracking-wide text-[#14221F] font-bold drop-shadow-xs"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            Where Legacy Meets Luxury
          </p>
        </div>

        {/* ── Ultra-Sleek Antique Gold Hairline Progress Bar ── */}
        <div
          className={`w-full max-w-xs mx-auto pt-2 transition-opacity duration-500 delay-250 ${
            sunAscended ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-[3px] bg-[#E3DACB] rounded-full overflow-hidden shadow-inner">
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#B78A3F] via-[#245348] to-[#00D6A3] rounded-full transition-all duration-75 ease-out shadow-[0_0_12px_rgba(183,138,63,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default SplashIntro;
