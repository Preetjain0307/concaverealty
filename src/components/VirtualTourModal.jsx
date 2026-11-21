import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ExternalLink,
  Compass,
  ShieldCheck,
  RefreshCw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  PhoneCall,
  Navigation
} from 'lucide-react';

export function VirtualTourModal({ isOpen, onClose, project, onOpenEnquiry }) {
  if (!isOpen || !project) return null;

  const hasOfficialTour = Boolean(project.virtualTourUrl);
  const tourUrl = project.virtualTourUrl || "https://view.pixeldo.com/KalpataruAdvay/";

  const [activeTab, setActiveTab] = useState(hasOfficialTour ? 'official' : 'panorama');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Auto-dismiss loading spinner after 2.5 seconds to prevent getting stuck on mobile
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
      setActiveTab(hasOfficialTour ? 'official' : 'panorama');
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, project?.id, hasOfficialTour]);

  // 360° Interactive Canvas Simulator state
  const canvasRef = useRef(null);
  const [rotationYaw, setRotationYaw] = useState(0); // 0 to 360 deg
  const [pitch, setPitch] = useState(0); // -25 to +25 deg
  const [zoomLevel, setZoomLevel] = useState(1);
  const [skyTheme, setSkyTheme] = useState('sunset'); // 'day' | 'sunset' | 'night'
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Draw 360° panoramic canvas scene
  useEffect(() => {
    if (activeTab !== 'panorama') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const render = () => {
      const width = canvas.width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.height = canvas.parentElement?.clientHeight || 500;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Sky Background Gradient based on skyTheme
      let skyGradient;
      if (skyTheme === 'day') {
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#1E4D6B');
        skyGradient.addColorStop(0.4, '#4B88A2');
        skyGradient.addColorStop(0.75, '#C9E4E7');
        skyGradient.addColorStop(1, '#EFE8D8');
      } else if (skyTheme === 'sunset') {
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#181C30');
        skyGradient.addColorStop(0.3, '#4A2846');
        skyGradient.addColorStop(0.55, '#A34838');
        skyGradient.addColorStop(0.75, '#DF7A32');
        skyGradient.addColorStop(0.9, '#F4B251');
        skyGradient.addColorStop(1, '#2E221E');
      } else {
        // night
        skyGradient = ctx.createLinearGradient(0, 0, 0, height);
        skyGradient.addColorStop(0, '#04090C');
        skyGradient.addColorStop(0.4, '#0A1820');
        skyGradient.addColorStop(0.75, '#132832');
        skyGradient.addColorStop(1, '#1A2F2B');
      }
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, width, height);

      // Horizon line position adjusted by pitch
      const horizonY = height * 0.58 + pitch * 3.5;

      // Draw distant stars or golden sun
      if (skyTheme === 'night') {
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 40; i++) {
          const starX = ((i * 73 + rotationYaw * 1.5) % width + width) % width;
          const starY = (i * 37) % (horizonY * 0.7);
          ctx.beginPath();
          ctx.arc(starX, starY, (i % 3 === 0 ? 1.5 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (skyTheme === 'sunset') {
        // Glowing sun sinking into horizon
        const sunX = (((rotationYaw * 2.2 + 200) % width) + width) % width;
        const sunGradient = ctx.createRadialGradient(sunX, horizonY - 20, 5, sunX, horizonY - 20, 85);
        sunGradient.addColorStop(0, 'rgba(255, 230, 160, 0.95)');
        sunGradient.addColorStop(0.3, 'rgba(255, 140, 60, 0.6)');
        sunGradient.addColorStop(1, 'rgba(255, 100, 40, 0)');
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(sunX, horizonY - 20, 85, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Sea / Ground plane
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      if (skyTheme === 'night') {
        groundGrad.addColorStop(0, '#0A1714');
        groundGrad.addColorStop(1, '#050D0A');
      } else if (skyTheme === 'sunset') {
        groundGrad.addColorStop(0, '#2D1F18');
        groundGrad.addColorStop(0.3, '#1B2A26');
        groundGrad.addColorStop(1, '#0B1713');
      } else {
        groundGrad.addColorStop(0, '#2B5357');
        groundGrad.addColorStop(0.5, '#1E3C3E');
        groundGrad.addColorStop(1, '#0F2321');
      }
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Draw 360° Repeating City Skyline Silhouette based on rotationYaw
      const numBuildings = 36;
      const totalSkylineWidth = width * 2;
      const offset = (rotationYaw * (totalSkylineWidth / 360)) % totalSkylineWidth;

      for (let pass = -1; pass <= 2; pass++) {
        const startX = pass * totalSkylineWidth - offset;
        ctx.fillStyle = skyTheme === 'night' ? '#091512' : (skyTheme === 'sunset' ? '#171318' : '#14292B');

        for (let b = 0; b < numBuildings; b++) {
          const bw = 24 + ((b * 13) % 28);
          const bh = 45 + ((b * 31 + (b % 5) * 40) % 170) * (zoomLevel * 0.85);
          const bx = startX + (b * (totalSkylineWidth / numBuildings));

          ctx.fillRect(bx, horizonY - bh, bw, bh);

          // If night or sunset, draw lit window grids on towers
          if (skyTheme === 'night' || skyTheme === 'sunset') {
            ctx.fillStyle = (b % 2 === 0) ? '#FFE699' : '#DFBE79';
            for (let wy = horizonY - bh + 8; wy < horizonY - 10; wy += 14) {
              for (let wx = bx + 4; wx < bx + bw - 4; wx += 7) {
                if (((wx * 7 + wy * 13) % 10) > 4) {
                  ctx.fillRect(wx, wy, 2.5, 3.5);
                }
              }
            }
            ctx.fillStyle = skyTheme === 'night' ? '#091512' : '#171318';
          }
        }
      }

      // Draw Luxury High-Rise Glass Balcony & Railing in the foreground
      ctx.save();
      // Glass balcony reflection
      const balconyY = height * 0.76;
      ctx.fillStyle = 'rgba(20, 44, 37, 0.45)';
      ctx.fillRect(0, balconyY, width, height - balconyY);

      // Sleek gold railing handrail
      ctx.strokeStyle = '#DFBE79';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, balconyY);
      ctx.lineTo(width, balconyY);
      ctx.stroke();

      // Vertical glass panel dividers
      ctx.strokeStyle = 'rgba(223, 190, 121, 0.35)';
      ctx.lineWidth = 1.5;
      for (let rx = 20; rx < width; rx += 80) {
        ctx.beginPath();
        ctx.moveTo(rx, balconyY);
        ctx.lineTo(rx, height);
        ctx.stroke();
      }

      // Project Horizon Badge in Sky
      ctx.fillStyle = 'rgba(10, 26, 21, 0.75)';
      ctx.strokeStyle = '#DFBE79';
      ctx.lineWidth = 1;
      const badgeW = Math.min(320, width - 40);
      const badgeH = 46;
      const badgeX = (width - badgeW) / 2;
      const badgeY = 24;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 13px serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${project.name} • Horizon Observatory`, width / 2, badgeY + 20);

      ctx.fillStyle = '#DFBE79';
      ctx.font = '10px monospace';
      ctx.fillText(`Elevation: Level 42 • Yaw: ${Math.round(rotationYaw)}° • ${project.locality || project.location}`, width / 2, badgeY + 36);

      ctx.restore();
    };

    render();
  }, [activeTab, rotationYaw, pitch, zoomLevel, skyTheme, project]);

  // Touch and Mouse drag rotation handlers for 360° Canvas
  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastMousePos.current = {
      x: e.clientX || e.touches?.[0]?.clientX || 0,
      y: e.clientY || e.touches?.[0]?.clientY || 0
    };
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const curX = e.clientX || e.touches?.[0]?.clientX || 0;
    const curY = e.clientY || e.touches?.[0]?.clientY || 0;

    const deltaX = curX - lastMousePos.current.x;
    const deltaY = curY - lastMousePos.current.y;

    setRotationYaw((prev) => {
      const next = (prev - deltaX * 0.45) % 360;
      return next < 0 ? next + 360 : next;
    });

    setPitch((prev) => Math.max(-20, Math.min(20, prev + deltaY * 0.2)));

    lastMousePos.current = { x: curX, y: curY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-5 bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl h-[94vh] sm:h-[90vh] bg-[#051912] border-2 border-[#C59B4E]/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 bg-[#07241B] border-b border-[#C59B4E]/30 gap-3">
          {/* Project Details */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#051912] border border-[#DFBE79] flex items-center justify-center text-[#DFBE79] shrink-0 shadow-inner">
              <Compass
                className="w-4 h-4 transition-transform duration-300"
                style={{ transform: `rotate(${rotationYaw}deg)` }}
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif text-sm sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span className="truncate">{project.name}</span>
                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#114937] text-emerald-300 border border-emerald-400/40 shrink-0 font-semibold">
                  360° IMMERSIVE
                </span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#DFBE79] truncate">
                {project.builder} • {project.locality || project.location}, {project.city || 'Mumbai'}
                {project.rera && <span className="ml-2 font-mono text-[10px] text-gray-300 hidden sm:inline">• RERA: {project.rera}</span>}
              </p>
            </div>
          </div>

          {/* Action Tabs & Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {hasOfficialTour && (
              <div className="hidden xs:flex items-center bg-[#051912] p-0.5 rounded-lg border border-[#C59B4E]/40">
                <button
                  type="button"
                  onClick={() => setActiveTab('official')}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold transition-all ${
                    activeTab === 'official' ? 'bg-[#245348] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Developer 360°
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('panorama')}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold transition-all ${
                    activeTab === 'panorama' ? 'bg-[#245348] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Horizon Sphere
                </button>
              </div>
            )}

            {/* Direct Fullscreen Button */}
            <a
              href={tourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#DFBE79] to-[#C59B4E] hover:brightness-110 text-[#14221F] text-[10.5px] sm:text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
              title="Launch 360° in dedicated full window for gyroscope support"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Direct Full Screen</span>
              <span className="sm:hidden">Full Window</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-[#051912] text-gray-300 hover:text-white border border-white/10 hover:border-[#DFBE79] transition-colors cursor-pointer"
              aria-label="Close 360 virtual tour"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle Switch if official tour available */}
        {hasOfficialTour && (
          <div className="xs:hidden flex items-center justify-center bg-[#07241B] px-3 py-1.5 border-b border-[#C59B4E]/20 gap-2 text-xs">
            <span className="text-[10px] text-gray-400 font-mono">Mode:</span>
            <button
              type="button"
              onClick={() => setActiveTab('official')}
              className={`px-3 py-0.5 rounded-full text-[10.5px] font-mono font-bold transition-all ${
                activeTab === 'official' ? 'bg-[#C59B4E] text-[#14221F]' : 'bg-[#051912] text-gray-300'
              }`}
            >
              Developer Walkthrough
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('panorama')}
              className={`px-3 py-0.5 rounded-full text-[10.5px] font-mono font-bold transition-all ${
                activeTab === 'panorama' ? 'bg-[#C59B4E] text-[#14221F]' : 'bg-[#051912] text-gray-300'
              }`}
            >
              360° Horizon
            </button>
          </div>
        )}

        {/* Main 360 Workspace */}
        <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center select-none">
          {activeTab === 'official' ? (
            <>
              {/* Loading Overlay */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07241B] text-center p-6 space-y-3.5">
                  <div className="relative w-14 h-14 rounded-full border-2 border-[#DFBE79]/20 border-t-[#DFBE79] animate-spin flex items-center justify-center shadow-lg">
                    <Compass className="w-7 h-7 text-[#DFBE79]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-base sm:text-lg text-white font-bold tracking-wide">
                      Connecting 360° Virtual Walkthrough
                    </h4>
                    <p className="text-xs text-gray-300 font-mono">
                      Streaming real-time 360° panoramas for {project.name}...
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <a
                      href={tourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#DFBE79] to-[#C59B4E] text-[#14221F] text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                    >
                      <span>Open Direct Fullscreen (Gyroscope)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('panorama')}
                      className="px-3.5 py-2 rounded-xl bg-[#051912] border border-[#DFBE79]/40 text-[#DFBE79] text-xs font-semibold"
                    >
                      Switch to Horizon Sphere
                    </button>
                  </div>
                </div>
              )}

              {/* Fallback Error Overlay */}
              {hasError && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#051912] text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#114937]/50 border border-[#DFBE79] flex items-center justify-center text-[#DFBE79]">
                    <Compass className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <h4 className="font-serif text-xl text-white font-bold">
                      {project.name} 360° Virtual Tour
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      For motion tracking and full 360° gyroscope support, launch the virtual tour directly in a native browser window.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={tourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBE79] to-[#C59B4E] text-[#14221F] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      <span>Launch Fullscreen 360°</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('panorama')}
                      className="px-4 py-3 rounded-xl bg-[#245348] text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Open Horizon Sphere
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Iframe */}
              <iframe
                key={tourUrl}
                src={tourUrl}
                title={`${project.name} 360° Virtual Tour by Pixeldo`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsLoading(false)}
                onError={() => setHasError(true)}
              />
            </>
          ) : (
            /* Interactive 360° Panoramic Horizon Canvas Simulator */
            <div
              className="relative w-full h-full cursor-grab active:cursor-grabbing touch-none select-none flex items-center justify-center"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            >
              <canvas ref={canvasRef} className="w-full h-full block" />

              {/* Visual Drag / Swipe Instruction Pill */}
              <div className="pointer-events-none absolute bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-20 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#DFBE79]/50 text-[11px] font-mono text-[#FFFDF7] flex items-center gap-2 shadow-lg whitespace-nowrap">
                <RotateCw className="w-3.5 h-3.5 text-[#DFBE79] animate-spin" style={{ animationDuration: '6s' }} />
                <span>Drag left / right to rotate 360° • Up / Down to tilt</span>
              </div>

              {/* Right Side Horizon Simulator Floating Controls */}
              <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
                {/* Sky Lighting Controls */}
                <div className="bg-[#051912]/85 backdrop-blur-md border border-[#C59B4E]/50 rounded-xl p-1 flex flex-col gap-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => setSkyTheme('day')}
                    className={`p-2 rounded-lg text-xs transition-all ${
                      skyTheme === 'day' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Daylight Skyline"
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkyTheme('sunset')}
                    className={`p-2 rounded-lg text-xs transition-all ${
                      skyTheme === 'sunset' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Sunset Golden Hour"
                  >
                    <Sunset className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkyTheme('night')}
                    className={`p-2 rounded-lg text-xs transition-all ${
                      skyTheme === 'night' ? 'bg-[#DFBE79] text-[#14221F] font-bold' : 'text-gray-300 hover:text-white'
                    }`}
                    title="Night Cityscape"
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="bg-[#051912]/85 backdrop-blur-md border border-[#C59B4E]/50 rounded-xl p-1 flex flex-col gap-1 shadow-md">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                    className="p-2 rounded-lg text-gray-300 hover:text-[#DFBE79] transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
                    className="p-2 rounded-lg text-gray-300 hover:text-[#DFBE79] transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Left Compass HUD */}
              <div className="absolute left-3 bottom-14 sm:bottom-4 z-20 bg-[#051912]/85 backdrop-blur-md border border-[#C59B4E]/50 px-3 py-1.5 rounded-xl text-white font-mono text-[10.5px] flex items-center gap-2 shadow-md">
                <Compass className="w-4 h-4 text-[#DFBE79]" style={{ transform: `rotate(${rotationYaw}deg)` }} />
                <span>
                  Bearing: <strong className="text-[#DFBE79]">{Math.round(rotationYaw)}°</strong>{' '}
                  {rotationYaw < 45 || rotationYaw >= 315 ? '(North)' : rotationYaw < 135 ? '(East)' : rotationYaw < 225 ? '(South)' : '(West)'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar: Advisory Action & Status */}
        <div className="px-3.5 sm:px-6 py-2.5 bg-[#07241B] border-t border-[#C59B4E]/30 flex items-center justify-between text-xs text-gray-300 flex-wrap gap-2.5">
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DFBE79] shrink-0" />
            <span className="truncate">
              {activeTab === 'official'
                ? 'Official Developer Virtualization • Pixeldo 360°'
                : '360° Horizon Observatory • Concave Realty Luxury Suite'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEnquiry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEnquiry({
                    projectName: project.name,
                    location: project.location,
                    configuration: 'Private 360° Guided Walkthrough',
                    project
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#245348] hover:bg-[#1B3F37] border border-[#DFBE79]/50 text-[#DFBE79] hover:text-white text-[11px] font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Book Guided Private Walkthrough</span>
              </button>
            )}
            <span className="font-mono text-[10.5px] sm:text-[11px] text-[#DFBE79] hidden md:inline">
              Drag & Rotate in 360°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
