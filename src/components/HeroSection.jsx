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
  Compass,
  ChevronDown
} from 'lucide-react';

export function HeroSection({ onSearch, onExplore, onOpenTour, onOpenEnquiry }) {
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
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          poster="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
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

        {/* Main Title & User Slogan */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight drop-shadow-md gold-shine-text">
            CONCAVE REALTY
          </h1>
          <p className="font-serif italic text-2xl sm:text-3xl font-light drop-shadow gold-shine-text">
            Where Legacy Meets Luxury
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="pt-6 flex justify-center">
          <button
            onClick={onExplore}
            className="text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors flex items-center gap-1 font-light"
          >
            <span>Explore Developments</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>

      </div>

    </section>
  );
}
