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
            src="https://assets.mixkit.co/videos/preview/mixkit-modern-building-with-glass-facade-43405-large.mp4" 
            type="video/mp4" 
          />
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-luxurious-hotel-building-with-a-pool-42544-large.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Subtle Luxury Gradient Overlay (Clean & Aesthetic) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
      </div>

      {/* Video Audio & Playback Controls Floating Bar */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white">
        <button 
          onClick={togglePlay}
          className="hover:text-[#C59B4E] transition-colors"
          title={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>
        <span className="h-3 w-px bg-white/20" />
        <button 
          onClick={toggleMute}
          className="hover:text-[#C59B4E] transition-colors"
          title={isMuted ? "Unmute sound" : "Mute sound"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#C59B4E]" />}
        </button>
      </div>

      {/* Hero Typography & Search */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
        
        {/* Subtle Luxury Subtitle */}
        <div className="text-xs uppercase tracking-[0.35em] text-[#DFBE79] font-medium">
          MUMBAI’S PREMIER RESIDENTIAL DESTINATIONS
        </div>

        {/* Main Title & User Slogan */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-md">
            Concave Realty
          </h1>
          <p className="font-serif italic text-2xl sm:text-3xl text-gray-200 font-light drop-shadow">
            “Where Legacy Meets Luxury”
          </p>
        </div>

        <p className="max-w-xl mx-auto text-sm text-gray-200 font-light leading-relaxed">
          Crafting extraordinary living environments with Godrej Properties, Kalpataru Limited, and bespoke luxury developments.
        </p>

        {/* Clean, Refined Search Bar on Light Floating Glass */}
        <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-luxury-light text-left border border-white">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            
            {/* Location selector */}
            <div className="space-y-0.5 sm:border-r border-gray-200 pr-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-transparent text-xs text-[#14221F] font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Locations</option>
                <option value="Borivali West">Borivali West (Advay)</option>
                <option value="Versova">Versova (Skyshore)</option>
                <option value="Goregaon">Goregaon</option>
                <option value="Bhayander">Bhayander</option>
                <option value="Mira Road">Mira Road</option>
                <option value="Kandivali">Kandivali East</option>
                <option value="Worli">Worli</option>
                <option value="Bandra">Bandra</option>
                <option value="Lower Parel">Lower Parel</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="space-y-0.5 sm:border-r border-gray-200 pr-2">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                Residences
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-transparent text-xs text-[#14221F] font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Configurations</option>
                <option value="3 BHK">3 BHK Luxury</option>
                <option value="4 BHK">4 BHK Royal</option>
                <option value="Sky Bungalow">Sky Bungalow</option>
                <option value="Jodi Option">Jodi Option</option>
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-0.5">
              <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                Price Bracket
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full bg-transparent text-xs text-[#14221F] font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Budgets</option>
                <option value="1-3">₹1 Cr - ₹3 Cr</option>
                <option value="3-7">₹3 Cr - ₹7 Cr</option>
                <option value="7-15">₹7 Cr - ₹15 Cr</option>
                <option value="15+">₹15 Cr+ (Ultra High-End)</option>
              </select>
            </div>

            {/* Button using requested color: #245348 */}
            <div>
              <button
                type="submit"
                className="w-full h-10 rounded bg-[#245348] hover:bg-[#1B3F37] text-white text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

          </form>
        </div>

        {/* Scroll indicator */}
        <div className="pt-4 flex justify-center">
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
