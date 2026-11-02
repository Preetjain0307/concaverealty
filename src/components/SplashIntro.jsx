import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function SplashIntro({ onFinish }) {
  const [timeLeft, setTimeLeft] = useState(3.0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      setTimeLeft(parseFloat(remaining.toFixed(1)));

      if (elapsed >= duration) {
        clearInterval(timer);
        setClosing(true);
        setTimeout(() => {
          onFinish();
        }, 500); // 500ms smooth fade transition
      }
    }, 50);

    return () => clearInterval(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setClosing(true);
    setTimeout(() => {
      onFinish();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1D3530] text-center px-4 transition-all duration-700 ease-out select-none ${
        closing ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto space-y-6">
        
        {/* Animated Brand Emblem */}
        <div className="relative group">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full p-1 bg-gradient-to-b from-[#DFBE79] via-[#C59B4E] to-[#284F45] shadow-2xl flex items-center justify-center overflow-hidden border border-[#DFBE79]/50">
            <img
              src="/logo.jpg"
              alt="Concave Realty Logo"
              className="w-full h-full object-cover rounded-full filter drop-shadow-md transition-transform duration-1000 ease-out transform group-hover:scale-105"
            />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1.5">
          <div className="text-[#DFBE79] text-[11px] uppercase tracking-[0.3em] font-medium">
            LUXURY RESIDENTIAL PORTFOLIO
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-widest font-bold text-white drop-shadow-sm">
            CONCAVE REALTY
          </h1>

          <p className="font-serif italic text-xl md:text-2xl text-[#DFBE79] tracking-wide font-normal pt-1">
            “Where Legacy Meets Luxury”
          </p>
        </div>

        {/* 3-Second Loading Bar */}
        <div className="w-64 md:w-72 space-y-2 pt-2">
          <div className="w-full bg-[#284F45] h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C59B4E] to-[#DFBE79] rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${Math.min(100, ((3.0 - timeLeft) / 3.0) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-300 font-mono tracking-widest">
            <span>CURATING DEVELOPMENTS</span>
            <span>{Math.max(0, Math.ceil(timeLeft))}s</span>
          </div>
        </div>

        {/* Enter Sanctuary Button */}
        <button
          onClick={handleSkip}
          className="group inline-flex items-center gap-2 text-xs text-gray-300 hover:text-white px-4 py-1.5 rounded-full border border-white/20 hover:border-[#DFBE79] bg-[#284F45]/60 hover:bg-[#284F45] transition-all"
        >
          <span>Enter Portfolio</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-[#DFBE79]" />
        </button>
      </div>
    </div>
  );
}
