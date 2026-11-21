import React, { useState, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  IndianRupee, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Compass
} from 'lucide-react';

export function HeroSection({ onSearch, onOpenTour, onOpenEnquiry }) {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [propertyType, setPropertyType] = useState('All');
  const [budgetRange, setBudgetRange] = useState('All');
  
  // Video player controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({
      location: selectedLocation,
      propertyType,
      budget: budgetRange
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#051912]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-cover scale-[1.08] filter brightness-[0.7] contrast-[1.05]"
        >
          <source 
            src="/videos/concave-luxury-realestate.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Subtle Luxury Gradient Overlay (Clean & Aesthetic) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      </div>

      {/* Hero Typography & Search */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">

        {/* Main Title & User Slogan with smooth entrance animation */}
        <div className="space-y-2 sm:space-y-3 px-2 anim-hero-entrance">
          <h1 className="font-serif text-3xl sm:text-6xl md:text-7xl font-bold tracking-tight drop-shadow-md gold-shine-text leading-tight">
            CONCAVE REALTY
          </h1>
          <p className="font-serif italic text-base sm:text-2xl md:text-3xl font-light drop-shadow gold-shine-text">
            Where Legacy Meets Luxury
          </p>
        </div>

      </div>

    </section>
  );
}
