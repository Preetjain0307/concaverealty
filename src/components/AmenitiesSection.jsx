import React, { useState, useMemo } from 'react';
import { 
  Waves, 
  Dumbbell, 
  Trees, 
  Gamepad2, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  Lock, 
  Eye, 
  ArrowRight,
  Trophy,
  Film,
  CheckCircle2,
  PhoneCall,
  Flame,
  Compass
} from 'lucide-react';

const FALLBACK_AMENITY_IMG = '/amenities/theme_clubhouse_pool.jpg';

// =========================================================
// 1. TOP HERO BANNER MARQUEE (AUTHENTIC ULTRA-LUXURY AMENITIES)
// =========================================================
const HERO_MARQUEE_AMENITIES = [
  {
    title: "Double-Height Residents' Club",
    category: "Private Social Salon",
    image: "/amenities/theme_residents_lounge.jpg"
  },
  {
    title: "Zen Yoga & Finnish Sauna Suite",
    category: "Holistic Wellness",
    image: "/amenities/theme_wellness_spa.jpg"
  },
  {
    title: "Mediterranean Villa Clubhouse",
    category: "Resort Living",
    image: "/amenities/theme_clubhouse_pool.jpg"
  },
  {
    title: "Rooftop Sky Horizon Infinity Pool",
    category: "Skyline Icon",
    image: "/amenities/infinity_pool.jpg"
  },
  {
    title: "Grand Celebratory Ballroom",
    category: "Royal Celebrations",
    image: "/amenities/banquet_hall.jpg"
  },
  {
    title: "High-Performance Technogym Arena",
    category: "Pro Conditioning",
    image: "/amenities/gymnasium.jpg"
  },
  {
    title: "Scandinavian Wooden Treehouse",
    category: "Adventure Wonderland",
    image: "/amenities/kids_play_v2.jpg"
  },
  {
    title: "Cantilevered Sky Observation Deck",
    category: "Level 50+ Living",
    image: "/amenities/sky_deck.jpg"
  },
  {
    title: "Private Dolby Atmos Preview Cinema",
    category: "Private Screening",
    image: "/amenities/private_theatre.jpg"
  },
  {
    title: "Botanical Fragrance Zen Gardens",
    category: "Nature Sanctuary",
    image: "/amenities/gardens.jpg"
  }
];

// Duplicated for continuous seamless marquee scroll
const MARQUEE_ITEMS = [...HERO_MARQUEE_AMENITIES, ...HERO_MARQUEE_AMENITIES];

// =========================================================
// 2. INTERACTIVE AMENITY CATEGORIES (MATCHING EXPLORE LOCATION)
// =========================================================
const AMENITY_CATEGORIES = [
  {
    id: "All",
    name: "All Amenities",
    count: 25,
    tag: "Master Portfolio",
    subtitle: "All 9 categories",
    icon: Sparkles
  },
  {
    id: "Aquatics & Pools",
    name: "Aquatics & Pools",
    count: 4,
    tag: "Infinity & Lap",
    subtitle: "Olympic & horizon pools",
    icon: Waves
  },
  {
    id: "Clubhouse & Leisure",
    name: "Clubhouse & Leisure",
    count: 3,
    tag: "Private Clubs",
    subtitle: "Lounges & co-working",
    icon: Building2
  },
  {
    id: "Wellness & Spa",
    name: "Wellness & Spa",
    count: 3,
    tag: "Sanctuaries",
    subtitle: "Sauna, steam & yoga",
    icon: Trees
  },
  {
    id: "Fitness & Health",
    name: "Fitness & Health",
    count: 3,
    tag: "Pro Fitness",
    subtitle: "Technogym & Pilates",
    icon: Dumbbell
  },
  {
    id: "Sports & Recreation",
    name: "Sports & Recreation",
    count: 3,
    tag: "Championship",
    subtitle: "Squash, turf & snooker",
    icon: Trophy
  },
  {
    id: "Sky & Rooftop Living",
    name: "Sky & Rooftop Living",
    count: 2,
    tag: "Skyline Icon",
    subtitle: "Observatory & firepit",
    icon: Eye
  },
  {
    id: "Entertainment & Social",
    name: "Entertainment & Social",
    count: 3,
    tag: "Private Cinema",
    subtitle: "Ballrooms & dining",
    icon: Crown
  },
  {
    id: "Kids & Green Nature",
    name: "Kids & Green Nature",
    count: 3,
    tag: "Family Parks",
    subtitle: "Treehouse & gardens",
    icon: Gamepad2
  },
  {
    id: "Elite Services & Safety",
    name: "Elite Services & Safety",
    count: 1,
    tag: "High Security",
    subtitle: "24x7 Valet & EV bays",
    icon: ShieldCheck
  }
];

// =========================================================
// 3. EXPANDED COLLECTION OF 26 CURATED LUXURY AMENITIES
// =========================================================
const AMENITIES_DATA = [
  // --- Aquatics & Pools ---
  {
    id: 1,
    name: "Olympic-Length Heated Lap Pool",
    category: "Aquatics & Pools",
    desc: "50-meter temperature-regulated lap pool with underwater acoustic system & sunken loungers",
    icon: Waves,
    image: "/project_photos/16%20-%20Rustomjee%20(Goregaon)/3.jpg",
    tag: "Olympic Standard",
    hasWaterRipple: true
  },
  {
    id: 2,
    name: "Rooftop Sky Horizon Infinity Pool",
    category: "Aquatics & Pools",
    desc: "Cantilevered glass-edge horizon pool with panoramic sunset views over Mumbai's western coast",
    icon: Sparkles,
    image: "/projects/project_img_40.jpg",
    tag: "Skyline Icon",
    hasWaterRipple: true
  },
  {
    id: 3,
    name: "Tropical Lagoon Pool & Cabana Deck",
    category: "Aquatics & Pools",
    desc: "Natural stone lagoon pool lined with private curtained daybed cabanas & hydrotherapy jets",
    icon: Waves,
    image: "/project_photos/11%20-%20Lodha%20(Malad)/1.jpg",
    tag: "Resort Living",
    hasWaterRipple: true
  },
  {
    id: 4,
    name: "Kids Heated Splash Pool & Aqua Arena",
    category: "Aquatics & Pools",
    desc: "Zero-depth shallow waterplay arena with playful interactive fountains and anti-skid surfaces",
    icon: Waves,
    image: "/project_photos/19%20-%20Roseworld/1.jpg",
    tag: "Family Aquatics",
    hasWaterRipple: true
  },

  // --- Clubhouse & Leisure ---
  {
    id: 5,
    name: "Double-Height Grand Residents' Club",
    category: "Clubhouse & Leisure",
    desc: "Soaring 24-ft timber ceilings, bespoke cocktail bar, fireside library & marble social salon",
    icon: Building2,
    image: "/amenities/theme_residents_lounge.jpg",
    tag: "Private Social Club",
    hasWaterRipple: false
  },
  {
    id: 6,
    name: "Mediterranean Villa Grand Clubhouse",
    category: "Clubhouse & Leisure",
    desc: "Expansive 40,000 sq.ft private clubhouse featuring concierge cafe, terrace & reading solarium",
    icon: Crown,
    image: "/amenities/clubhouse.jpg",
    tag: "40,000 Sq.Ft Club",
    hasWaterRipple: false
  },
  {
    id: 7,
    name: "Executive Business Lounge & Co-Working Pods",
    category: "Clubhouse & Leisure",
    desc: "High-speed private work booths, conference boardrooms & high-definition video conferencing suites",
    icon: Building2,
    image: "/project_photos/12%20-%20Enchante%20Point/2.jpg",
    tag: "Work from Home",
    hasWaterRipple: false
  },

  // --- Wellness & Spa ---
  {
    id: 8,
    name: "Zen Meditation Garden & Yoga Sanctuary",
    category: "Wellness & Spa",
    desc: "Open-air teakwood yoga deck surrounded by calming water bodies, bamboo screens & serene flora",
    icon: Trees,
    image: "/amenities/yoga_garden.jpg",
    tag: "Mindfulness",
    hasWaterRipple: false
  },
  {
    id: 9,
    name: "Thermal Spa, Finnish Sauna & Steam Suites",
    category: "Wellness & Spa",
    desc: "Nordic pine sauna, eucalyptus steam chambers & hydrotherapy jacuzzi relaxation loungers",
    icon: Sparkles,
    image: "/amenities/theme_wellness_spa.jpg",
    tag: "Thermal Spa",
    hasWaterRipple: false
  },
  {
    id: 10,
    name: "Ayurvedic Treatment & Therapeutic Spa",
    category: "Wellness & Spa",
    desc: "Certified therapy rooms for signature body therapies, deep tissue massage & reflexology rituals",
    icon: Trees,
    image: "/amenities/ayurvedic_treatment.jpg",
    tag: "Signature Spa",
    hasWaterRipple: false
  },

  // --- Fitness & Health ---
  {
    id: 11,
    name: "High-Performance Technogym Arena",
    category: "Fitness & Health",
    desc: "Biostrength machines, Olympic free-weight rigs & dedicated personal athletic conditioning coaches",
    icon: Dumbbell,
    image: "/amenities/gymnasium.jpg",
    tag: "Pro Fitness",
    hasWaterRipple: false
  },
  {
    id: 12,
    name: "Cardio Studio & Pilates Reformer Suite",
    category: "Fitness & Health",
    desc: "Allegro 2 Pilates reformers, spin bikes with interactive virtual courses & dedicated aerobics floor",
    icon: Dumbbell,
    image: "/projects/kalpataru_elara_gym.webp",
    tag: "Core & Stamina",
    hasWaterRipple: false
  },
  {
    id: 13,
    name: "Rooftop Sky Jogging Track",
    category: "Fitness & Health",
    desc: "Elevated cushioned jogging loop with unobstructed 360-degree city and national park horizon views",
    icon: Sparkles,
    image: "/amenities/sky_jogging_track.jpg",
    tag: "Elevated Track",
    hasWaterRipple: false
  },

  // --- Sports & Recreation ---
  {
    id: 14,
    name: "Glass-Back Squash Courts & Table Tennis",
    category: "Sports & Recreation",
    desc: "WSF-compliant international squash courts with spectator viewing gallery and indoor gaming salon",
    icon: Trophy,
    image: "/project_photos/3%20-%20Oberoi%20Sky%20City/1.jpg",
    tag: "Indoor Championship",
    hasWaterRipple: false
  },
  {
    id: 15,
    name: "Multisport Turf Arena (Football & Cricket)",
    category: "Sports & Recreation",
    desc: "Floodlit FIFA-standard artificial turf arena for box cricket, futsal & dynamic community sports",
    icon: Trophy,
    image: "/project_photos/19%20-%20Roseworld/2.jpg",
    tag: "Floodlit Arena",
    hasWaterRipple: false
  },
  {
    id: 16,
    name: "Bespoke Billiards & Snooker Salon",
    category: "Sports & Recreation",
    desc: "Full-size English Riley tournament snooker tables with vintage leather armchairs & scorekeepers",
    icon: Gamepad2,
    image: "/amenities/bespoke_billiards.jpg",
    tag: "Gentlemen's Salon",
    hasWaterRipple: false
  },

  // --- Sky & Rooftop Living ---
  {
    id: 17,
    name: "Cantilevered Sky Observation Deck",
    category: "Sky & Rooftop Living",
    desc: "Stargazing telescope dome, glass skywalk lookout & private sunset viewing cabanas on high floors",
    icon: Eye,
    image: "/project_photos/5%20-%20Godrej%20Reserve/8.jpg",
    tag: "Level 50+ Living",
    hasWaterRipple: false
  },
  {
    id: 18,
    name: "Open-Air Stargazing Lounge & Firepit",
    category: "Sky & Rooftop Living",
    desc: "Sunken plush lounge around a smokeless ethanol firepit under Mumbai's illuminated skyline",
    icon: Flame,
    image: "/projects/kalpataru_elara_balcony.webp",
    tag: "Skyline Romance",
    hasWaterRipple: false
  },

  // --- Entertainment & Social ---
  {
    id: 19,
    name: "Private Dolby Atmos Preview Cinema",
    category: "Entertainment & Social",
    desc: "24-seat private screening theatre with plush motorized recliners, 4K laser projection & acoustic walls",
    icon: Film,
    image: "/amenities/private_theatre.jpg",
    tag: "Private Cinema",
    hasWaterRipple: false
  },
  {
    id: 20,
    name: "Grand Celebratory Ballroom & Banquet Lawn",
    category: "Entertainment & Social",
    desc: "Double-height ballroom with crystal chandeliers, attached open banquet lawn & commercial prep kitchen",
    icon: Crown,
    image: "/amenities/banquet_hall.jpg",
    tag: "Grand Galas",
    hasWaterRipple: false
  },
  {
    id: 21,
    name: "Alfresco Party Terrace & Barbecue Pavilion",
    category: "Entertainment & Social",
    desc: "Built-in charcoal and gas grills with open-air dining tables for weekend culinary celebrations",
    icon: Building2,
    image: "/project_photos/1%20-%20Kalpataru%20Advay/2.jpg",
    tag: "Culinary Terrace",
    hasWaterRipple: false
  },

  // --- Kids & Green Nature ---
  {
    id: 22,
    name: "Scandinavian Wooden Treehouse & Play Park",
    category: "Kids & Green Nature",
    desc: "Natural birch wood playhouse, rock climbing walls, rope bridges & zero-impact soft rubber play turf",
    icon: Gamepad2,
    image: "/project_photos/17%20-%20Lodha%20Sovrano/3.jpg",
    tag: "Nature Play",
    hasWaterRipple: false
  },
  {
    id: 23,
    name: "Kids Creche, Activity Hub & Toddler Zone",
    category: "Kids & Green Nature",
    desc: "Supervised indoor play station with Montessori developmental games, soft blocks & storytelling den",
    icon: Gamepad2,
    image: "/amenities/kids_play.jpg",
    tag: "Montessori Den",
    hasWaterRipple: false
  },
  {
    id: 24,
    name: "Botanical Fragrance Gardens & Reflexology Path",
    category: "Kids & Green Nature",
    desc: "Aromatherapeutic herbs, flowering frangipani groves & smooth river-pebble foot reflexology pathway",
    icon: Trees,
    image: "/amenities/gardens.jpg",
    tag: "Nature Sanctuary",
    hasWaterRipple: false
  },

  // --- Elite Services & Safety ---
  {
    id: 26,
    name: "Multi-Tier Biometric Security & EV Fast-Charging",
    category: "Elite Services & Safety",
    desc: "5-tier automated access control, RFID vehicular booms, 24/7 CCTV vigilance & high-capacity EV charging bays",
    icon: ShieldCheck,
    image: "/amenities/biometric_security.jpg",
    tag: "Eco & Safe",
    hasWaterRipple: false
  }
];

// =========================================================
// 4. ARCHITECTURAL FLOOR VIEWS (CONFIDENTIAL BLUR BLUEPRINTS)
// =========================================================
const FLOOR_VIEWS = [
  {
    id: 'fv-penthouse',
    title: "Duplex Penthouse Sky Mansion",
    level: "L46-47 • Sky Duplex",
    carpetArea: "3,450 sq.ft CA",
    svg: "/projects/floor_view_penthouse.svg",
    highlight: "Private Heated Plunge Pool, 80-ft Wrap-Around Deck & Biometric Foyer",
    type: "Sky Mansion Layout"
  },
  {
    id: 'fv-4bhk',
    title: "Signature 4 BHK Presidential Suite",
    level: "L15-44 • Tower Core",
    carpetArea: "1,895 sq.ft CA",
    svg: "/projects/floor_view_4bhk.svg",
    highlight: "Master Bedroom Suite, 3 Private Viewing Sundecks & Staff Quarters",
    type: "Presidential 4 BHK"
  },
  {
    id: 'fv-3bhk',
    title: "Royale 3 BHK Cross-Air Residence",
    level: "L06-38 • Panoramic",
    carpetArea: "1,280 sq.ft CA",
    svg: "/projects/floor_view_3bhk.svg",
    highlight: "East-West Cross Ventilation, Full Modular Island Kitchen & Sundeck",
    type: "Luxury 3 BHK"
  },
  {
    id: 'fv-podium',
    title: "Podium & Clubhouse Master Deck",
    level: "Level 05 • Eco-Deck",
    carpetArea: "2+ Acres Deck",
    svg: "/projects/floor_view_amenities.svg",
    highlight: "Olympic pool blueprint, squash courts, banquet lawn & wellness pavilion",
    type: "Master Amenity Deck"
  },
  {
    id: 'fv-rooftop',
    title: "Rooftop Sky Observatory & Terrace",
    level: "Level 48 • Sky Deck",
    carpetArea: "15,000 sq.ft",
    svg: "/projects/floor_view_rooftop.svg",
    highlight: "360° Arabian Sea View, Stargazing Telescope Dome & Cocktail Cabanas",
    type: "Rooftop Sky Deck"
  },
  {
    id: 'fv-cluster',
    title: "Typical Residential Tower Cluster",
    level: "Typical • High-Rise",
    carpetArea: "4 Units / Core",
    svg: "/projects/floor_view_typical.svg",
    highlight: "Shows 2, 3 & 4 BHK placements, 6 high-speed elevator cores & fire chutes",
    type: "Tower Cluster Core"
  }
];

export function AmenitiesSection({ onOpenEnquiry }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter amenities by category
  const filteredAmenities = useMemo(() => {
    return AMENITIES_DATA.filter((item) => {
      if (selectedCategory !== 'All' && selectedCategory !== 'All Amenities') {
        if (item.category !== selectedCategory) return false;
      }
      return true;
    });
  }, [selectedCategory]);

  // Smooth scroll down to the amenities cards showcase when a category card is clicked
  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setTimeout(() => {
      const showcaseSection = document.getElementById('amenities-showcase-section');
      if (showcaseSection) {
        const navOffset = 85;
        const targetY = showcaseSection.getBoundingClientRect().top + window.pageYOffset - navOffset;
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  return (
    <div id="amenities-page" className="min-h-screen bg-[#FAF9F6] text-[#14221F]">
      
      {/* ============================================================== */}
      {/* SECTION A: HERO BANNER – MARQUEE BACKGROUND + ANIMATED GOLD HEADING */}
      {/* ============================================================== */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden border-b border-[#EAE6DF] flex items-center justify-center group shadow-md">
        
        {/* Background Scrolling Architectural Image Marquee */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          {/* Subtle horizontal fade masks on sides */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-black/60 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-black/60 to-transparent z-10" />

          {/* Marquee Track fitting the exact field height */}
          <div className="animate-marquee-amenities flex gap-4 h-full">
            {MARQUEE_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="h-full w-72 sm:w-84 md:w-96 flex-shrink-0 relative overflow-hidden"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => { e.currentTarget.src = FALLBACK_AMENITY_IMG; }}
                  className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/40" />

                {/* Subtle category & title watermark */}
                <div className="absolute bottom-3 left-3 right-3 text-white/80 pointer-events-none">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#DFBE79] block truncate">
                    {item.category} • {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Transparent Frosted Glass Blur Overlay across the marquee field */}
          <div className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
        </div>

        {/* Animated Golden Heading centered in the field */}
        <div className="relative z-20 max-w-5xl mx-auto text-center px-4 pointer-events-none select-none">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight animated-gold-heading">
            World-Class Curated Amenities
          </h1>
        </div>

      </div>

      {/* ============================================================== */}
      {/* SECTION B: AMENITIES SERVED & INTERACTIVE CATEGORY CARDS       */}
      {/* ============================================================== */}
      <section className="py-8 sm:py-12 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* Aesthetic Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[#8B6846] block font-mono">
              CURATED RESIDENTIAL PRIVILEGES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#14221F] tracking-tight">
              Amenities Served
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent mx-auto mt-2" />
            <p className="text-xs sm:text-sm text-[#5C5549] font-light max-w-xl mx-auto pt-1 leading-relaxed">
              Explore {AMENITIES_DATA.length} handpicked resort-grade amenities, wellness sanctuaries, and high-energy sports clubs curated across Mumbai's elite developments.
            </p>
          </div>

          {/* Subheader */}
          <div id="amenities-showcase-section" className="pt-2 flex items-center justify-between border-b border-[#EAE6DF] pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C59B4E]" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14221F]">
                {selectedCategory === 'All' ? 'All Curated Amenities' : selectedCategory}
              </h3>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION C: CURATED AMENITIES CARDS IN LUXURY AESTHETIC         */}
          {/* ============================================================== */}
          {filteredAmenities.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#EAE6DF] p-8 space-y-3">
              <Sparkles className="w-8 h-8 text-[#C59B4E] mx-auto opacity-70" />
              <h4 className="font-serif text-lg font-bold text-[#14221F]">No Amenities Available</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No amenities found under this category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="px-4 py-2 rounded-lg bg-[#245348] text-white text-xs font-semibold hover:bg-[#1B3F37] transition-colors"
              >
                View All Amenities
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
              {filteredAmenities.map((item) => {
                const IconComponent = item.icon || Sparkles;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onOpenEnquiry) {
                        onOpenEnquiry({
                          projectName: item.name,
                          location: "Concave Luxury Developments",
                          configuration: `Curated Lifestyle Amenity: ${item.name} (${item.category})`
                        });
                      }
                    }}
                    className="group relative rounded-2xl overflow-hidden border border-[#E7E0D5] hover:border-[#C59B4E] bg-white cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(139,104,70,0.2)] transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
                  >
                    {/* Top Image Window with Realistic Living Hover */}
                    <div className="relative h-36 sm:h-48 md:h-52 w-full overflow-hidden bg-slate-900">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_AMENITY_IMG; }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      />

                      {/* Translucent Water Ripple Overlay for Pools */}
                      {item.hasWaterRipple && (
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent pointer-events-none anim-water-caustic" />
                      )}

                      {/* Gliding Light Sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none anim-light-sweep" />

                      {/* Vignette Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none" />

                      {/* Floating Category Tag Badge */}
                      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex items-center gap-1.5">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/95 backdrop-blur-md border border-[#C59B4E]/30 flex items-center justify-center text-[#245348] group-hover:bg-[#1D3530] group-hover:text-[#DFBE79] group-hover:border-[#C59B4E] transition-all duration-300 shadow-sm">
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110" />
                        </div>
                      </div>

                      {/* Right Tag Badge */}
                      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
                        <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-black/65 backdrop-blur-md text-[#DFBE79] border border-white/20 text-[8.5px] sm:text-[10px] font-mono font-semibold max-w-[95px] sm:max-w-none truncate block shadow-xs">
                          {item.tag}
                        </span>
                      </div>

                      {/* Bottom Category Subtitle */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-2.5 sm:left-3 sm:right-3 z-10 pointer-events-none">
                        <span className="text-[8.5px] sm:text-[10px] uppercase font-mono tracking-wider text-gray-200 font-semibold block drop-shadow truncate">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content in Warm Luxury Tone */}
                    <div className="p-3 sm:p-4 bg-white flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                      <div>
                        <h4 className="font-serif text-[13px] sm:text-base font-bold text-[#14221F] group-hover:text-[#8B6846] transition-colors leading-snug line-clamp-2 min-h-[2.4rem] sm:min-h-[2.75rem] flex items-center">
                          {item.name}
                        </h4>
                      </div>

                      {/* Bottom Action Row */}
                      <div className="pt-2.5 border-t border-[#F2EDE4] flex items-center justify-center">
                        <span className="w-full py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#1D3530] via-[#245348] to-[#1D3530] group-hover:from-[#245348] group-hover:to-[#1D3530] text-[#DFBE79] border border-[#C59B4E]/30 group-hover:border-[#DFBE79] text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all">
                          <span>Enquire</span>
                          <ArrowRight className="w-3 h-3 text-[#DFBE79] group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Top Subtle Gold Highlight Line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION D: ARCHITECTURAL FLOOR VIEWS (CONFIDENTIAL BLUEPRINTS) */}
      {/* ============================================================== */}
      <section className="py-10 sm:py-16 bg-[#FAF7F2] border-t border-[#E7E0D5]">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          
          {/* Clean Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 border-b border-[#E7E0D5] pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C59B4E] font-semibold block font-mono">
                ARCHITECTURAL BLUEPRINTS
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-[#14221F]">
                Exclusive Floor Views & Blueprints
              </h3>
            </div>
          </div>

          {/* 6 Authentic Blurred Blueprints Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {FLOOR_VIEWS.map((fv) => (
              <div
                key={fv.id}
                onClick={() => onOpenEnquiry && onOpenEnquiry({
                  projectName: fv.title,
                  location: "Mumbai Signature Developments",
                  configuration: `Floor View: ${fv.title}`
                })}
                className="group relative rounded-2xl overflow-hidden border border-[#E7E0D5] hover:border-[#C59B4E] bg-white shadow-sm hover:shadow-[0_20px_45px_rgba(139,104,70,0.22)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              >
                {/* Blueprint Container with Protected Blur */}
                <div className="relative h-40 sm:h-56 md:h-64 w-full overflow-hidden bg-slate-900">
                  
                  {/* SVG Blueprint with Gaussian Blur */}
                  <img
                    src={`${fv.svg}?v=3`}
                    alt={`${fv.title} Protected Blueprint`}
                    className="w-full h-full object-cover filter blur-[5px] group-hover:blur-[2.5px] scale-105 group-hover:scale-110 transition-all duration-700 ease-out opacity-95"
                  />

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20 group-hover:via-black/15 transition-colors" />

                  {/* Top Floating Level Badge */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 pointer-events-none z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-[#1D3530]/90 backdrop-blur-md text-[#DFBE79] border border-[#C59B4E]/40 text-[8.5px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold shadow-xs whitespace-nowrap">
                      {fv.level}
                    </span>
                  </div>

                  {/* Center Lock Shield & Call to Action */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-white pointer-events-none z-10">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#1D3530]/90 backdrop-blur-md border-2 border-[#DFBE79] flex items-center justify-center shadow-[0_0_20px_rgba(223,190,121,0.35)] group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#DFBE79]" />
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#245348]/95 to-[#1D3530]/95 backdrop-blur-md text-[#DFBE79] border border-[#DFBE79]/50 text-[9px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold shadow-md group-hover:from-[#1D3530] group-hover:to-[#245348] transition-all">
                      <Eye className="w-3 h-3 text-[#DFBE79]" />
                      <span>Unlock Plan</span>
                    </span>
                  </div>


                </div>

                {/* Card Content in Warm Luxury Tone */}
                <div className="p-3 sm:p-4 bg-white flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <div>
                    <h4 className="font-serif text-[13px] sm:text-base font-bold text-[#14221F] group-hover:text-[#8B6846] transition-colors leading-snug line-clamp-2 min-h-[2.4rem] sm:min-h-[2.75rem] flex items-center">
                      {fv.title}
                    </h4>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="pt-2.5 border-t border-[#F2EDE4] flex items-center justify-center">
                    <span className="w-full py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#1D3530] via-[#245348] to-[#1D3530] group-hover:from-[#245348] group-hover:to-[#1D3530] text-[#DFBE79] border border-[#C59B4E]/30 group-hover:border-[#DFBE79] text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all">
                      <span>Enquire</span>
                      <ArrowRight className="w-3 h-3 text-[#DFBE79] group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Top Subtle Gold Shimmer Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B4E] to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}

export default AmenitiesSection;
