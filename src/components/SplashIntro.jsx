import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

/**
 * =========================================================================
 * FULLSCREEN INTRO VIDEO COMPONENT
 * =========================================================================
 * - Plays the intro video completely until it reaches its natural end.
 * - Transitions smoothly to the Home page upon video completion.
 * - Allows visitors to skip at any moment via the top-right "Skip" button.
 * - Allows toggling sound via the sound button.
 * 
 * HOW TO REPLACE THIS INTRO VIDEO:
 * 1. Place your new video file inside: `public/videos/`
 * 2. Name it: `intro-video.mp4` (replacing the current file).
 * 3. The player will automatically play the full duration of your new video.
 * =========================================================================
 */
export const INTRO_VIDEO_PATH = "/videos/intro-video.mp4";

export function SplashIntro({ onFinish }) {
  const videoRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const finishTriggered = useRef(false);

  // Smooth exit transition into the home page
  const triggerFinish = () => {
    if (finishTriggered.current) return;
    finishTriggered.current = true;
    setClosing(true);
    setTimeout(() => {
      onFinish();
    }, 700); // 700ms graceful cinematic cross-fade to homepage
  };

  const handleSkip = () => {
    triggerFinish();
  };

  // Triggers ONLY when the video naturally finishes playing all the way to the end
  const handleEnded = () => {
    triggerFinish();
  };

  const handleError = () => {
    // Graceful fallback if video file cannot be loaded
    console.warn("Intro video could not be loaded, transitioning to home page.");
    triggerFinish();
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  // Autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.playbackRate = 1.0; // Play at normal 100% natural video speed
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks autoplay, video will play upon first interaction
        });
      }
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black select-none transition-opacity duration-700 ease-out ${
        closing ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* ── Fullscreen Intro Video (Plays until video actually ends) ── */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover scale-[1.08]"
      >
        <source src={INTRO_VIDEO_PATH} type="video/mp4" />
        <source src="/videos/mumbai-skyline.mp4" type="video/mp4" />
        <source src="/videos/concave-luxury-realestate.mp4" type="video/mp4" />
        <source src="/videos/loading-apartment.mp4" type="video/mp4" />
      </video>

      {/* ── Top-Right Luxury Controls: Sound Toggle & Skip Button ── */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        {/* Unmute / Mute Button */}
        <button
          onClick={toggleSound}
          type="button"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 hover:border-white/40 transition-all shadow-lg cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-[#DFBE79]" />}
        </button>

        {/* Skip to Home Page Button */}
        <button
          onClick={handleSkip}
          type="button"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white px-5 py-2 rounded-full border border-white/25 hover:border-white/60 bg-black/40 hover:bg-black/75 backdrop-blur-md shadow-xl transition-all font-semibold cursor-pointer"
        >
          <span>Skip</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#DFBE79]" />
        </button>
      </div>

      {/* Subtle bottom vignette for filmic aesthetics */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
}

export default SplashIntro;
