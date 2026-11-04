import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function SplashIntro({ onFinish }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10.0);
  const [closing, setClosing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const finishTriggered = useRef(false);

  // Trigger smooth exit to homepage
  const triggerFinish = () => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;
    setClosing(true);
    setTimeout(() => {
      onFinish();
    }, 600); // 600ms graceful fade transition to homepage
  };

  const handleSkip = () => {
    triggerFinish();
  };

  // Video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    const dur = videoRef.current.duration || 10.0;
    if (dur && !isNaN(dur)) setDuration(dur);

    // If approaching final 0.3s of video, trigger smooth transition
    if (curr >= dur - 0.35) {
      triggerFinish();
    }
  };

  const handleEnded = () => {
    triggerFinish();
  };

  // Autoplay handler and fallback ticker
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultPlaybackRate = 1.35;
      video.playbackRate = 1.35;
      video.muted = true;
      video.playsInline = true;
      video
        .play()
        .then(() => setHasStarted(true))
        .catch(() => {
          // Autoplay was blocked by browser policy; continue with fallback timer
          setHasStarted(true);
        });
    }

    // Fallback ticker in case video is stalled or blocked
    const startTime = Date.now();
    const interval = setInterval(() => {
      if (!video || video.paused) {
        const elapsed = ((Date.now() - startTime) / 1000) * 1.35;
        setCurrentTime(elapsed);
        if (elapsed >= 10.0) {
          clearInterval(interval);
          triggerFinish();
        }
      }
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Compute blur and overlay based on playback progress
  // Video duration is ~10.0s. Blur introduces gradually from 5.0s to 8.5s.
  const blurStart = 5.0;
  const blurEnd = 8.5;
  const blurProgress = Math.min(1, Math.max(0, (currentTime - blurStart) / (blurEnd - blurStart)));

  // Blur increases from 0px up to 14px progressively towards the end
  const blurAmount = (blurProgress * 14).toFixed(1);

  // Warm brand overlay (#E8D8C3) fades in as blur increases (0 -> 0.80)
  const overlayOpacity = (blurProgress * 0.80).toFixed(2);

  // Logo appears at currentTime >= 5.8s
  const showLogo = currentTime >= 5.8;

  // Typography appears at currentTime >= 6.8s
  const showText = currentTime >= 6.8;

  // Overall loading bar percentage
  const loadPercentage = Math.min(100, Math.max(5, (currentTime / (duration || 10.0)) * 100));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#E8D8C3] text-[#1D3530] text-center select-none transition-all duration-700 ease-out ${
        closing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ── Background Video ── */}
      <video
        ref={videoRef}
        src="/videos/loading-apartment.mp4"
        poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={(e) => { e.currentTarget.playbackRate = 1.35; }}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
        style={{
          filter: `blur(${blurAmount}px)`,
          transform: `scale(${1 + (blurProgress > 0 ? 0.05 * blurProgress : 0)})`,
        }}
      />

      {/* ── Progressive Warm Brand Overlay (#E8D8C3) ── */}
      <div
        className="absolute inset-0 bg-[#E8D8C3] transition-opacity duration-500 ease-out pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* ── Subtle Top Skip Button ── */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-2 text-xs text-[#1D3530] hover:text-[#1D3530] px-4 py-1.5 rounded-full border border-[#1D3530]/30 hover:border-[#1D3530] bg-[#E8D8C3]/80 hover:bg-[#E8D8C3] backdrop-blur-md shadow-sm transition-all font-medium"
        >
          <span>Enter Portfolio</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#1D3530]" />
        </button>
      </div>

      {/* ── Center Content: Animated Brand Emblem & Typography ── */}
      <div className="relative z-20 flex flex-col items-center max-w-xl mx-auto px-4 space-y-6">
        
        {/* Animated Brand Emblem — appears smoothly over blurred video */}
        <div
          className={`relative group transition-all duration-1000 ease-out transform ${
            showLogo
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-b from-[#C59B4E] via-[#1D3530] to-[#C59B4E] shadow-2xl flex items-center justify-center overflow-hidden border border-[#1D3530]/20 bg-[#E8D8C3]">
            <img
              src="/logo_icon.jpg"
              alt="Concave Realty Logo"
              className="w-full h-full object-cover rounded-full filter drop-shadow-md transition-transform duration-1000 ease-out transform group-hover:scale-105"
            />
          </div>
        </div>

        {/* Brand Name Typography — synchronized with blurred ending */}
        <div
          className={`space-y-1.5 transition-all duration-1000 ease-out delay-150 transform ${
            showText
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="text-[#1D3530] text-[11px] uppercase tracking-[0.3em] font-medium opacity-80">
            LUXURY RESIDENTIAL PORTFOLIO
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-widest font-bold text-[#1D3530] drop-shadow-sm">
            CONCAVE REALTY
          </h1>

          <p className="font-serif italic text-xl md:text-2xl text-[#1D3530] tracking-wide font-normal pt-1 opacity-90">
            “Where Legacy Meets Luxury”
          </p>
        </div>

        {/* Loading Progress Bar — synchronized with playback */}
        <div
          className={`w-64 md:w-72 space-y-2 pt-2 transition-all duration-700 ease-out ${
            showLogo ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full bg-[#1D3530]/20 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1D3530] rounded-full transition-all duration-150 ease-linear"
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-center text-[10px] text-[#1D3530] font-mono tracking-widest font-medium opacity-80">
            <span>CURATING DEVELOPMENTS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
