// Complete Location-Wise Project Catalog for Concave Realty
// Sourced from verified collateral, MahaRERA filings & supplied developer listings

export const LOCATIONS_LIST = [
  "Borivali",
  "Kandivali",
  "Malad",
  "Goregaon",
  "Jogeshwari",
  "Andheri",
  "Bandra",
  "Lower Parel"
];

export const MARQUEE_IMAGES = [
  {
    url: "/projects/kalpataru_advay_official.webp",
    title: "Kalpataru Advay",
    location: "Borivali West",
    tag: "Signature Towers"
  },
  {
    url: "/projects/godrej_skyshore_official.webp",
    title: "Godrej Skyshore",
    location: "Versova, Andheri",
    tag: "Seafront High-Rise"
  },
  {
    url: "/projects/godrej_reserve_official.webp",
    title: "Godrej Reserve",
    location: "Kandivali East",
    tag: "Forest Living"
  },
  {
    url: "/projects/mahindra_vista_official.webp",
    title: "Mahindra Vista",
    location: "Kandivali East",
    tag: "Elevated Living"
  },
  {
    url: "/projects/adani_ten_bkc_official.webp",
    title: "Adani Ten BKC",
    location: "Bandra East",
    tag: "Bespoke Residences"
  },
  {
    url: "/projects/adani_linkbay_official.webp",
    title: "Adani Linkbay",
    location: "Andheri West",
    tag: "Skyline Living"
  },
  {
    url: "/projects/lodha_altus_official.png",
    title: "Lodha Altus",
    location: "Borivali West",
    tag: "Art Deco Towers"
  },
  {
    url: "/projects/rustomjee_stella_official.webp",
    title: "Rustomjee Stella",
    location: "Bandra East",
    tag: "Landmark Architecture"
  },
  {
    url: "/projects/raymond_the_address_official.webp",
    title: "The Address by GS",
    location: "Bandra East",
    tag: "Bespoke Luxury"
  },
  {
    url: "/projects/project_20_user_1.png",
    title: "SunteckCity",
    location: "Jogeshwari / Goregaon",
    tag: "Integrated Township"
  },
  {
    url: "/projects/prestige_jasdan_official.webp",
    title: "Prestige Jasdan Classic",
    location: "Lower Parel / Byculla",
    tag: "Palatial Penthouses"
  },
  {
    url: "/projects/kalpataru_vian_official.jpg",
    title: "Kalpataru Vian",
    location: "Andheri West",
    tag: "Urban Elegance"
  }
];

export const PROJECTS_DATA = [
  // ==========================================
  // LOCATION 1: BORIVALI
  // ==========================================
  {
    id: 1,
    name: "Kalpataru Advay",
    builder: "Kalpataru Limited",
    tagline: "Ultra-Luxury High-Rise Sanctuary in Borivali West",
    location: "Borivali",
    locality: "Jairaj Nagar, New Link Road, Borivali West",
    city: "Mumbai",
    priceRange: "₹5.60 Cr - ₹7.99 Cr*",
    priceDisplay: "₹5.60 Cr*",
    status: "Under Construction",
    possession: "Nov 2028",
    rera: "P51800077381",
    landParcel: "6.12 Acres",
    towers: "3 Signature Towers (Tower A, B & C)",
    towerDetails: "Tower A & C: 37 Floors | Tower B: 47 Floors (1B + G + 5 Podium + Eco Deck)",
    elevators: "6 High-speed Elevators & 2 Fire Escape Staircases",
    amenitiesCount: "50+ Curated Lifestyle Amenities",
    coverImage: "/projects/project_1_user_1.png",
    images: [
      "/projects/project_1_user_1.png",
      "/projects/project_1_user_2.png",
      "/projects/kalpataru_advay_official.webp"
    ],
    configurations: [
      { bhk: "3 BHK Premium", carpetArea: "1,191 sq.ft CA", price: "₹5.60 Cr*", floorPlanLabel: "Type 3A Luxury", possessionDate: "Nov 2028" },
      { bhk: "3 BHK Grande", carpetArea: "1,319 sq.ft CA", price: "₹6.30 Cr*", floorPlanLabel: "Type 3B Royal", possessionDate: "Nov 2028" },
      { bhk: "4 BHK Royal Suite", carpetArea: "1,835 sq.ft CA", price: "₹7.99 Cr*", floorPlanLabel: "Type 4A Presidential", possessionDate: "Nov 2028" },
      { bhk: "Palatial Jodi Residence", carpetArea: "2,510 - 3,154 sq.ft CA", price: "Price on Request*", floorPlanLabel: "Custom Jodi Layout", possessionDate: "Nov 2028" }
    ],
    virtualTourUrl: "https://view.pixeldo.com/KalpataruAdvay/",
    mapUrl: "https://maps.google.com/?q=Kalpataru+Advay+Jairaj+Nagar%2C+New+Link+Road%2C+Borivali+West+Mumbai",
    overview: "Kalpataru Advay is an iconic multi-tower residential landmark sprawled across 6.12 acres in Borivali West. Featuring an eco-deck level, 50+ hand-picked lifestyle amenities, and unobstructed panoramic green and sea views.",
    highlights: [
      "Prime location on New Link Road, Jairaj Nagar, Borivali West",
      "Grand 47-storey architectural tower with triple-height entrance lobby",
      "Eco Deck level with infinity-edge pool, private theatre & sky lounge",
      "6 high-speed elevators per core ensuring zero wait-time luxury transit"
    ],
    amenities: ["Infinity Pool", "Grand Clubhouse", "Sky Lounge", "Private Theatre", "Gymnasium", "Kids Play Area", "Reflexology Path", "24/7 Concierge"]
  },
  {
    id: 2,
    name: "Lodha Altus",
    builder: "Lodha Group",
    tagline: "Exclusive High-Rise Sanctuary in Borivali",
    location: "Borivali",
    locality: "Off Western Express Highway, Borivali West",
    city: "Mumbai",
    priceRange: "₹3.90 Cr - ₹5.75 Cr*",
    priceDisplay: "₹3.90 Cr*",
    status: "Newly Launched",
    possession: "Dec 2028",
    rera: "P51800055102",
    landParcel: "3.2 Acres",
    towers: "2 Signature Towers (38 Storeys)",
    towerDetails: "G + 4 Podium + 38 Residential Floors",
    elevators: "4 High-Speed Elevators",
    amenitiesCount: "35+ World-Class Amenities",
    coverImage: "/projects/project_2_user_1.png",
    images: [
      "/projects/project_2_user_1.png",
      "/projects/project_2_user_2.png",
      "/projects/project_2_user_3.png",
      "/projects/lodha_altus_official.png"
    ],
    configurations: [
      { bhk: "3 BHK Luxe", carpetArea: "1,050 sq.ft CA", price: "₹3.90 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2028" },
      { bhk: "4 BHK Grande", carpetArea: "1,520 sq.ft CA", price: "₹5.75 Cr*", floorPlanLabel: "Type 4A", possessionDate: "Dec 2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Altus+Western+Express+Highway%2C+Borivali+West+Mumbai",
    overview: "Lodha Altus brings Saint Amand hospitality and signature architecture to Borivali, offering thoughtfully planned expansive homes with lavish balconies and forest views.",
    highlights: [
      "Low density tower with only 3 residences per floor",
      "Panoramic views of Sanjay Gandhi National Park",
      "Luxury clubhouse managed by Saint Amand"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Fitness Center", "Banquet Hall", "Tennis Court", "Jogging Track"]
  },
  {
    id: 3,
    name: "Oberoi Sky City",
    builder: "Oberoi Realty",
    tagline: "Integrated Urban Oasis on Western Express Highway",
    location: "Borivali",
    locality: "Off Western Express Highway, Borivali East",
    city: "Mumbai",
    priceRange: "₹3.85 Cr - ₹6.50 Cr*",
    priceDisplay: "₹3.85 Cr*",
    status: "Under Construction & Ready Phases",
    possession: "Dec 2025 / Ready Phased",
    rera: "P51800003582",
    landParcel: "25 Acres Integrated Township",
    towers: "8 Towers | Up to 60 Floors",
    towerDetails: "Ultra-luxury modern skyscraper township with Sky City Mall",
    elevators: "6 High-speed passenger elevators per core",
    amenitiesCount: "60+ Integrated Township Amenities",
    coverImage: "/projects/project_3_user_1.png",
    images: [
      "/projects/project_3_user_1.png",
      "/projects/project_3_user_2.png",
      "/projects/oberoi_sky_city_official.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Standard", carpetArea: "1,034 sq.ft CA", price: "₹3.85 Cr*", floorPlanLabel: "Tower D", possessionDate: "Dec 2025" },
      { bhk: "3 BHK Luxury", carpetArea: "1,310 sq.ft CA", price: "₹4.90 Cr*", floorPlanLabel: "Tower E", possessionDate: "Dec 2025" },
      { bhk: "3 BHK Sky Suite", carpetArea: "1,425 sq.ft CA", price: "₹6.50 Cr*", floorPlanLabel: "Tower F", possessionDate: "Dec 2025" }
    ],
    mapUrl: "https://maps.google.com/?q=Oberoi+Sky+City+Western+Express+Highway%2C+Borivali+East+Mumbai",
    overview: "Spanning 25 acres, Oberoi Sky City redefines luxury living in Borivali East with a seamlessly integrated high-street mall, grand landscape decks, and direct metro connectivity.",
    highlights: [
      "Direct entry from Western Express Highway and Devipada Metro",
      "Upcoming luxury 5-star hotel & Sky City Mall within complex",
      "Grand clubhouse with Olympic-sized pool and indoor badminton"
    ],
    amenities: ["Olympic Pool", "Sky City Mall Access", "Indoor Sports Arena", "Squash Courts", "Kids Adventure Park", "Spa & Sauna"]
  },
  {
    id: 4,
    name: "Chandak GreenAir",
    builder: "Chandak Group",
    tagline: "Contemporary Green-Facing Living in Borivali East",
    location: "Borivali",
    locality: "Near National Park, Borivali East",
    city: "Mumbai",
    priceRange: "₹1.95 Cr - ₹3.10 Cr*",
    priceDisplay: "₹1.95 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800035091",
    landParcel: "2 Acres",
    towers: "2 Towers | 36 Storeys",
    towerDetails: "G + 3 Podium + 36 Floors",
    elevators: "3 High-Speed Elevators",
    amenitiesCount: "25+ Amenities",
    coverImage: "/projects/chandak_greenair_cover.jpg",
    images: [
      "/projects/chandak_greenair_cover.jpg",
      "/project_photos/4%20-%20Chandak%20GreenAir/3.jpg",
      "/project_photos/4%20-%20Chandak%20GreenAir/1.jpg",
      "/project_photos/4%20-%20Chandak%20GreenAir/2.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Smart", carpetArea: "640 sq.ft CA", price: "₹1.95 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Comfort", carpetArea: "910 sq.ft CA", price: "₹3.10 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Chandak+GreenAir+National+Park%2C+Borivali+East+Mumbai",
    overview: "Overlooking pristine national park greenery, Chandak GreenAir blends serenity with rapid urban transit in Borivali East.",
    highlights: [
      "Walking distance to Sanjay Gandhi National Park gate",
      "Efficient zero-wastage layouts with sunlit ventilation",
      "Rooftop leisure amenities with telescope observatory"
    ],
    amenities: ["Rooftop Pool", "Fitness Center", "Co-working Pods", "Yoga Deck", "Children's Zone"]
  },

  // ==========================================
  // LOCATION 2: KANDIVALI
  // ==========================================
  {
    id: 5,
    name: "Godrej Reserve",
    builder: "Godrej Properties",
    tagline: "Lush Forest Resort Living amidst Western Suburbs",
    location: "Kandivali",
    locality: "Akurli Road, Kandivali East",
    city: "Mumbai",
    priceRange: "₹2.45 Cr - ₹4.95 Cr*",
    priceDisplay: "₹2.45 Cr*",
    status: "Under Construction",
    possession: "June 2027",
    rera: "P51800031200",
    landParcel: "18.5 Acres Natural Green Canvas",
    towers: "6 Residential Towers",
    towerDetails: "G + 42 Storey Modern Towers overlooking green canopy",
    elevators: "4 Elevators per wing",
    amenitiesCount: "60+ Resort Amenities including 6-acre forest reserve",
    coverImage: "/projects/godrej_reserve_cover.jpg",
    images: [
      "/projects/godrej_reserve_cover.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/6.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/7.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/8.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/3.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/4.jpg",
      "/project_photos/5%20-%20Godrej%20Reserve/5.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Forest View", carpetArea: "750 - 820 sq.ft CA", price: "₹2.45 Cr*", floorPlanLabel: "Type 2F Serenity", possessionDate: "June 2027" },
      { bhk: "3 BHK Luxe Canopy", carpetArea: "1,050 - 1,220 sq.ft CA", price: "₹3.55 Cr*", floorPlanLabel: "Type 3C Grand", possessionDate: "June 2027" },
      { bhk: "4 BHK Royal Deck", carpetArea: "1,600 sq.ft CA", price: "₹4.95 Cr*", floorPlanLabel: "Type 4R Forest", possessionDate: "June 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Godrej+Reserve+Akurli+Road%2C+Kandivali+East+Mumbai",
    overview: "Nestled in Kandivali East, Godrej Reserve brings nature right to your balcony with an expansive 18.5-acre green habitat and modern amenities designed for multi-generational luxury.",
    highlights: [
      "Connected directly to Western Express Highway and upcoming metro line",
      "Over 6 acres of conserved botanical landscape and fruit orchards",
      "Olympic-length pool, elevated jogging trail and organic cafe",
      "Low-density living with maximum natural ventilation"
    ],
    amenities: ["Olympic Pool", "6-Acre Forest Park", "Elevated Jogging Track", "Clubhouse", "Cricket Pitch", "Pet Park"]
  },
  {
    id: 6,
    name: "Mahindra Vista",
    builder: "Mahindra Lifespaces",
    tagline: "Eco-Conscious Biophilic Living in Kandivali East",
    location: "Kandivali",
    locality: "Akurli Road, Kandivali East",
    city: "Mumbai",
    priceRange: "₹2.25 Cr - ₹4.50 Cr*",
    priceDisplay: "₹2.25 Cr*",
    status: "Newly Launched",
    possession: "Dec 2028",
    rera: "P51800054328",
    landParcel: "9.5 Acres",
    towers: "4 High-Rise Towers (35 Storeys)",
    towerDetails: "G + 4 Podium + 35 Storeys with green terraces",
    elevators: "4 High-Speed Elevators",
    amenitiesCount: "40+ Biophilic Amenities",
    coverImage: "/projects/mahindra_vista_official.webp",
    images: [
      "/projects/mahindra_vista_official.webp",
      "/projects/project_img_18.jpg",
      "/projects/project_img_16.webp",
      "/projects/project_img_15.webp"
    ],
    configurations: [
      { bhk: "2 BHK Premium", carpetArea: "765 sq.ft CA", price: "₹2.25 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2028" },
      { bhk: "3 BHK Luxury", carpetArea: "1,080 sq.ft CA", price: "₹3.35 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2028" },
      { bhk: "4 BHK Grande", carpetArea: "1,550 sq.ft CA", price: "₹4.50 Cr*", floorPlanLabel: "Type 4A", possessionDate: "Dec 2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Mahindra+Vista+Akurli+Road%2C+Kandivali+East+Mumbai",
    overview: "Mahindra Vista presents biophilic luxury homes crafted with green building principles, panoramic hillside vistas, and zero-compromise community infrastructure.",
    highlights: [
      "IGBC Platinum pre-certified sustainable design",
      "Sprawling central lifestyle podium with amphitheater",
      "Rapid connection to Western Express Highway"
    ],
    amenities: ["Lap Pool", "Biophilic Clubhouse", "Amphitheater", "Indoor Games", "Reflexology Trail"]
  },
  {
    id: 7,
    name: "Godrej Bliss",
    builder: "Godrej Properties",
    tagline: "Resort-Inspired Urban Living in Kandivali East",
    location: "Kandivali",
    locality: "Lokhandwala Township, Kandivali East",
    city: "Mumbai",
    priceRange: "₹1.99 Cr - ₹3.40 Cr*",
    priceDisplay: "₹1.99 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800051214",
    landParcel: "4 Acres",
    towers: "3 High-Rise Towers (41 Storeys)",
    towerDetails: "G + 4 Podium + 41 Residential Floors",
    elevators: "4 Elevators per core",
    amenitiesCount: "40+ Lifestyle Amenities",
    coverImage: "/projects/project_7_user_1.png",
    images: [
      "/projects/project_7_user_1.png",
      "/projects/project_7_user_2.png",
      "/projects/godrej_bliss_official.webp"
    ],
    configurations: [
      { bhk: "2 BHK Urban", carpetArea: "680 sq.ft CA", price: "₹1.99 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Grand", carpetArea: "980 sq.ft CA", price: "₹3.40 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Godrej+Bliss+Lokhandwala+Township%2C+Kandivali+East+Mumbai",
    overview: "Located in the established Lokhandwala Township, Godrej Bliss offers resort-style amenities, private sundecks, and effortless connectivity.",
    highlights: [
      "Surrounded by established social infrastructure & top schools",
      "40+ podium amenities with infinity pool & sky deck",
      "Minutes from upcoming metro and highway corridor"
    ],
    amenities: ["Infinity Pool", "Sky Deck", "Fitness Center", "Badminton Court", "Lounge"]
  },
  {
    id: 8,
    name: "Lodha Woods",
    builder: "Lodha Group",
    tagline: "Private Sanctuary amidst National Park Greenery",
    location: "Kandivali",
    locality: "Off Western Express Highway, Kandivali East",
    city: "Mumbai",
    priceRange: "₹2.10 Cr - ₹3.85 Cr*",
    priceDisplay: "₹2.10 Cr*",
    status: "Ready for Fit-out",
    possession: "Mid 2025",
    rera: "P51800031545",
    landParcel: "5 Acres",
    towers: "4 Residential Towers",
    towerDetails: "G + 35 Storeys with deep balconies",
    elevators: "3 High-Speed Elevators",
    amenitiesCount: "30+ Amenities",
    coverImage: "/project_photos/8%20-%20Lodha%20Woods/1.jpg",
    images: [
      "/project_photos/8%20-%20Lodha%20Woods/1.jpg",
      "/project_photos/8%20-%20Lodha%20Woods/2.jpg",
      "/project_photos/8%20-%20Lodha%20Woods/4.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Forest Deck", carpetArea: "710 sq.ft CA", price: "₹2.10 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Mid 2025" },
      { bhk: "3 BHK Sky Deck", carpetArea: "1,040 sq.ft CA", price: "₹3.85 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Mid 2025" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Woods+Western+Express+Highway%2C+Kandivali+East+Mumbai",
    overview: "Lodha Woods sits directly adjacent to the tranquil foliage of Sanjay Gandhi National Park, blending urban comfort with clean air and scenic vistas.",
    highlights: [
      "Direct frontage to national park green buffer",
      "Grand clubhouse with temperature-controlled indoor pool",
      "Ready fit-out timelines with OC in process"
    ],
    amenities: ["Indoor Pool", "Forest Trail", "Clubhouse", "Gymnasium", "Banquet Hall"]
  },

  // ==========================================
  // LOCATION 3: MALAD
  // ==========================================
  {
    id: 9,
    name: "Naring",
    builder: "Naring Group",
    tagline: "Exclusive Residential Enclave in Malad West",
    location: "Malad",
    locality: "Link Road Corridor, Malad West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Malad Parcel",
    towers: "High-Rise Residential Tower",
    towerDetails: "Contemporary architectural facade with luxury units",
    elevators: "Modern High-Speed Elevators",
    amenitiesCount: "Curated Luxury Amenities",
    coverImage: "/projects/naring_malad_cover.jpg",
    images: [
      "/projects/naring_malad_cover.jpg",
      "/project_photos/9%20-%20Naring%20(Malad)/1.jpg",
      "/project_photos/9%20-%20Naring%20(Malad)/2.jpg",
      "/project_photos/9%20-%20Naring%20(Malad)/3.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Naring+Naring+Link+Road+%2C+Malad+West+Mumbai",
    overview: "An upcoming luxury development by Naring in the vibrant heart of Malad West, designed to deliver high-quality contemporary residences.",
    highlights: [
      "Strategic location near commercial and entertainment hubs",
      "Curated lifestyle amenities for elite family living",
      "Early priority enquiry slots now open"
    ],
    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "24/7 Security", "Landscaped Garden"]
  },
  {
    id: 10,
    name: "Runwal",
    builder: "Runwal Group",
    tagline: "Premier High-Rise Urban Living in Malad West",
    location: "Malad",
    locality: "Near Inorbit Mall, Malad West",
    city: "Mumbai",
    priceRange: "₹1.85 Cr - ₹3.60 Cr*",
    priceDisplay: "₹1.85 Cr*",
    status: "Under Construction",
    possession: "Dec 2028",
    rera: "P51800048911",
    landParcel: "3.5 Acres",
    towers: "3 Residential Towers",
    towerDetails: "G + 38 Storeys with lifestyle podium",
    elevators: "4 High-Speed Elevators",
    amenitiesCount: "35+ Amenities",
    coverImage: "/projects/project_10_user_1.png",
    images: [
      "/projects/project_10_user_1.png",
      "/projects/project_10_user_2.png",
      "/projects/runwal_auris_official.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Elegant", carpetArea: "670 sq.ft CA", price: "₹1.85 Cr*", floorPlanLabel: "Type 2E", possessionDate: "Dec 2028" },
      { bhk: "3 BHK Grand", carpetArea: "990 sq.ft CA", price: "₹3.60 Cr*", floorPlanLabel: "Type 3G", possessionDate: "Dec 2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Runwal+Runwal+Inorbit+Mall%2C+Malad+West+Mumbai",
    overview: "Crafted by Runwal Group, this Malad development blends modern lifestyle conveniences with rapid access to Mindspace IT Park and Link Road retail avenues.",
    highlights: [
      "Moments away from Inorbit Mall and Malad railway station",
      "Podium level recreation deck with sky pool",
      "Renowned Runwal delivery track record"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Children's Play Area", "Gymnasium", "Banquet Hall"]
  },
  {
    id: 11,
    name: "Lodha",
    builder: "Lodha Group",
    tagline: "Signature Lodha Tower in Malad West",
    location: "Malad",
    locality: "Link Road, Malad West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Launch",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Acreage",
    towers: "Signature High-Rise Tower",
    towerDetails: "Iconic contemporary facade with private sun decks",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Lodha Signature Amenities",
    coverImage: "/projects/lodha_malad_cover.jpg",
    images: [
      "/projects/lodha_malad_cover.jpg",
      "/project_photos/11%20-%20Lodha%20(Malad)/1.jpg",
      "/project_photos/11%20-%20Lodha%20(Malad)/2.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 2", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Lodha+Link+Road%2C+Malad+West+Mumbai",
    overview: "Lodha's landmark residential vision for Malad West, featuring grand club facilities, Saint Amand hospitality services, and bespoke finishing.",
    highlights: [
      "Reputed brand pedigree with world-class landscaping",
      "Strategically positioned on high-growth Link Road belt",
      "Pre-launch registration privileges available"
    ],
    amenities: ["Clubhouse", "Swimming Pool", "Fitness Center", "Concierge Service", "Landscaped Decks"]
  },
  {
    id: 12,
    name: "Enchante Point",
    builder: "Enchante / Transcon",
    tagline: "Bespoke Boutique Luxury in Malad West",
    location: "Malad",
    locality: "Off S.V. Road, Malad West",
    city: "Mumbai",
    priceRange: "₹1.70 Cr - ₹2.95 Cr*",
    priceDisplay: "₹1.70 Cr*",
    status: "Under Construction",
    possession: "March 2027",
    rera: "P51800038102",
    landParcel: "1.8 Acres",
    towers: "Single Tower | 34 Storeys",
    towerDetails: "G + 34 Storeys with boutique finishing",
    elevators: "3 High-Speed Elevators",
    amenitiesCount: "20+ Curated Amenities",
    coverImage: "/projects/project_img_41.jpg",
    images: [
      "/projects/project_img_41.jpg",
      "/projects/project_img_38.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Boutique", carpetArea: "630 sq.ft CA", price: "₹1.70 Cr*", floorPlanLabel: "Type 2B", possessionDate: "March 2027" },
      { bhk: "3 BHK Elegance", carpetArea: "920 sq.ft CA", price: "₹2.95 Cr*", floorPlanLabel: "Type 3E", possessionDate: "March 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Enchante+Point+S.V.+Road%2C+Malad+West+Mumbai",
    overview: "Enchante Point delivers boutique luxury living with private decks, serene open layouts, and effortless access to business districts.",
    highlights: [
      "Low density boutique building with private community feel",
      "Rooftop infinity splash pool with sunset lounge",
      "Near Malad metro station and commercial centers"
    ],
    amenities: ["Rooftop Pool", "Fitness Studio", "Yoga Corner", "Terrace Garden", "Lobby Lounge"]
  },

  // ==========================================
  // LOCATION 4: GOREGAON
  // ==========================================
  {
    id: 13,
    name: "Naring",
    builder: "Naring Group",
    tagline: "Premium Residential Address in Goregaon West",
    location: "Goregaon",
    locality: "Link Road Corridor, Goregaon West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Goregaon Land",
    towers: "Modern High-Rise Tower",
    towerDetails: "Sculptural architecture with expansive balconies",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Premium Amenities",
    coverImage: "/projects/naring_goregaon_cover.jpg",
    images: [
      "/projects/naring_goregaon_cover.jpg",
      "/project_photos/13%20-%20Naring%20(Goregaon)/1.jpg",
      "/project_photos/13%20-%20Naring%20(Goregaon)/2.jpg",
      "/project_photos/13%20-%20Naring%20(Goregaon)/3.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Naring+Naring+Link+Road+%2C+Goregaon+West+Mumbai",
    overview: "A prestigious development by Naring in Goregaon West offering state-of-the-art residences connected to Mumbai's primary lifestyle and transit arteries.",
    highlights: [
      "Surrounded by elite retail hubs including Inorbit & Oberoi Mall",
      "Superior construction engineering and luxury finishes",
      "Priority registration currently underway"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Kids Play Area", "Security"]
  },
  {
    id: 14,
    name: "Kalpataru Elara",
    builder: "Kalpataru Limited",
    tagline: "Elegant High-Rise Living in Goregaon West",
    location: "Goregaon",
    locality: "Near Inorbit Mall, Goregaon West",
    city: "Mumbai",
    priceRange: "₹2.10 Cr - ₹3.75 Cr*",
    priceDisplay: "₹2.10 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800032910",
    landParcel: "2.8 Acres",
    towers: "2 Towers | 38 Storeys",
    towerDetails: "G + 4 Podium + 38 Residential Storeys",
    elevators: "4 Elevators per core",
    amenitiesCount: "30+ Modern Amenities",
    coverImage: "/projects/kalpataru_elara_official.webp",
    images: [
      "/projects/kalpataru_elara_official.webp",
      "/projects/kalpataru_elara_living.webp",
      "/projects/kalpataru_elara_balcony.webp",
      "/projects/kalpataru_elara_gym.webp"
    ],
    configurations: [
      { bhk: "2 BHK Premium", carpetArea: "720 sq.ft CA", price: "₹2.10 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Royale", carpetArea: "1,060 sq.ft CA", price: "₹3.75 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Kalpataru+Elara+Inorbit+Mall%2C+Goregaon+West+Mumbai",
    overview: "Kalpataru Elara embodies thoughtful luxury with expansive cross-ventilated homes, landscaped podium greens, and seamless metro access.",
    highlights: [
      "5 minutes from Goregaon West Metro Station and Link Road",
      "Podium level recreational amenities with swimming pool",
      "Signature Kalpataru craftsmanship and design pedigree"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Banquet Hall", "Jogging Deck"]
  },
  {
    id: 15,
    name: "Kolte-Patil",
    builder: "Kolte-Patil Developers",
    tagline: "Creation of Crafted Spaces in Goregaon",
    location: "Goregaon",
    locality: "Link Road Corridor, Goregaon West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2028",
    rera: "Information Coming Soon",
    landParcel: "Prime Acreage",
    towers: "Contemporary Tower",
    towerDetails: "Multi-storey residential tower",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/project_15_user_1.png",
    images: [
      "/projects/project_15_user_1.png"
    ],
    configurations: [
      { bhk: "2 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan 2", possessionDate: "2028" },
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan 3", possessionDate: "2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Kolte-Patil+Kolte-Patil+Link+Road+%2C+Goregaon+West+Mumbai",
    overview: "Kolte-Patil presents an exquisite residential project in Goregaon West, blending intelligent spatial planning with signature lifestyle amenities.",
    highlights: [
      "Convenient access to Western Express Highway & SV Road",
      "Sustainable design with abundant natural light",
      "Verified Kolte-Patil quality benchmarks"
    ],
    amenities: ["Clubhouse", "Gymnasium", "Play Area", "Swimming Pool", "Security"]
  },
  {
    id: 16,
    name: "Rustomjee",
    builder: "Rustomjee",
    tagline: "Signature Design & Communal Harmony in Goregaon",
    location: "Goregaon",
    locality: "S.V. Road / Link Road, Goregaon West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Goregaon Prime Land",
    towers: "Iconic Tower",
    towerDetails: "High-rise architectural residential tower",
    elevators: "High-Speed Elevators",
    amenitiesCount: "World-Class Amenities",
    coverImage: "/projects/project_16_user_1.png",
    images: [
      "/projects/project_16_user_1.png",
      "/projects/project_16_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type A", possessionDate: "TBA" },
      { bhk: "3 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Rustomjee+S.V.+Road+%2F+Link+Road%2C+Goregaon+West+Mumbai",
    overview: "Rustomjee brings its hallmark community-centric design to Goregaon, featuring thoughtfully planned spaces that bring families closer to nature.",
    highlights: [
      "Renowned Rustomjee thoughtful architectural planning",
      "Dedicated wellness and family entertainment zones",
      "Central access to corporate corridors and metro lines"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Children's Creative Studio", "Gymnasium", "Gardens"]
  },

  // ==========================================
  // LOCATION 5: JOGESHWARI
  // ==========================================
  {
    id: 17,
    name: "Lodha Sovrano",
    builder: "Lodha Group",
    tagline: "Regal High-Rise Residences in Jogeshwari West",
    location: "Jogeshwari",
    locality: "Near S.V. Road, Jogeshwari West",
    city: "Mumbai",
    priceRange: "₹2.15 Cr - ₹3.90 Cr*",
    priceDisplay: "₹2.15 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800045612",
    landParcel: "3 Acres",
    towers: "2 Towers | 40 Storeys",
    towerDetails: "G + 4 Podium + 40 Residential Floors",
    elevators: "4 Elevators per core",
    amenitiesCount: "30+ Lifestyle Amenities",
    coverImage: "/projects/project_17_user_1.png",
    images: [
      "/projects/project_17_user_1.png",
      "/projects/project_17_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "700 sq.ft CA", price: "₹2.15 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Premium", carpetArea: "1,020 sq.ft CA", price: "₹3.90 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Sovrano+S.V.+Road%2C+Jogeshwari+West+Mumbai",
    overview: "Lodha Sovrano brings luxury residential excellence to Jogeshwari West with grand entrance lobbies, private decks, and seamless access to Western Express Highway and JVLR.",
    highlights: [
      "Minutes from Jogeshwari railway station & Western Express Highway",
      "Grand lifestyle club with infinity swimming pool",
      "World-class safety, security, and concierge services"
    ],
    amenities: ["Infinity Pool", "Clubhouse", "Gymnasium", "Badminton Court", "Lounge"]
  },
  {
    id: 18,
    name: "Paradigm Downtown 102",
    builder: "Paradigm Realty",
    tagline: "Contemporary High-Rise Urban Living in Jogeshwari West",
    location: "Jogeshwari",
    locality: "S.V. Road, Jogeshwari West",
    city: "Mumbai",
    priceRange: "₹1.65 Cr - ₹2.85 Cr*",
    priceDisplay: "₹1.65 Cr*",
    status: "Under Construction",
    possession: "Dec 2026",
    rera: "P51800049012",
    landParcel: "2 Acres",
    towers: "Single Tower | 32 Storeys",
    towerDetails: "G + 32 Storeys Modern Facade",
    elevators: "3 High-Speed Elevators",
    amenitiesCount: "25+ Amenities",
    coverImage: "/projects/project_18_user_1.png",
    images: [
      "/projects/project_18_user_1.png",
      "/projects/project_18_user_2.png",
      "/projects/paradigm_downtown_official.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Urban", carpetArea: "610 sq.ft CA", price: "₹1.65 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2026" },
      { bhk: "3 BHK Grand", carpetArea: "890 sq.ft CA", price: "₹2.85 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2026" }
    ],
    mapUrl: "https://maps.google.com/?q=Paradigm+Downtown+102+S.V.+Road%2C+Jogeshwari+West+Mumbai",
    overview: "Paradigm Downtown 102 offers smartly engineered urban residences on SV Road, combining rapid connectivity with premium clubhouse amenities.",
    highlights: [
      "Prime frontage on SV Road with rapid transit access",
      "Rooftop lifestyle deck with panoramic city views",
      "Efficient planning with minimal passage wastage"
    ],
    amenities: ["Rooftop Pool", "Fitness Center", "Co-working Space", "Banquet Deck", "Play Area"]
  },
  {
    id: 19,
    name: "Roseworld",
    builder: "Roseworld Developers",
    tagline: "Boutique Residential Living in Jogeshwari",
    location: "Jogeshwari",
    locality: "Jogeshwari West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Boutique Land Parcel",
    towers: "Residential Tower",
    towerDetails: "Multi-storey modern residential structure",
    elevators: "Modern Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/project_19_user_1.png",
    images: [
      "/projects/project_19_user_1.png",
      "/projects/project_19_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Roseworld+Jogeshwari+West+Mumbai",
    overview: "Roseworld presents a boutique residential development in Jogeshwari, designed for tranquil living with immediate proximity to JVLR and highway corridors.",
    highlights: [
      "Boutique low-density living with private family feel",
      "Seamless east-west connectivity via JVLR",
      "Quality finishes and high architectural specifications"
    ],
    amenities: ["Gymnasium", "Lobby Lounge", "Security", "Garden", "Kids Zone"]
  },
  {
    id: 20,
    name: "Sunteck",
    builder: "Sunteck Realty",
    tagline: "Signature Luxury Living in Jogeshwari",
    location: "Jogeshwari",
    locality: "Near JVLR Junction, Jogeshwari West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Launch",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Strategic Acreage",
    towers: "High-Rise Signature Tower",
    towerDetails: "Ultra-modern glass facade with lifestyle amenities",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Sunteck Signature Amenities",
    coverImage: "/projects/project_20_user_1.png",
    images: [
      "/projects/project_20_user_1.png",
      "/projects/project_img_20.webp"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 2", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Sunteck+Realty+Sunteck+JVLR+Junction%2C+Jogeshwari+West+Mumbai",
    overview: "Sunteck brings its high-end residential pedigree to Jogeshwari, offering curated sky residences with expansive views and world-class club recreation.",
    highlights: [
      "Direct transit connectivity to BKC and SEEPZ via JVLR",
      "Lavish clubhouse with temperature controlled pool",
      "Pre-launch expression of interest open"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Fitness Center", "Concierge Desk", "Landscaped Gardens"]
  },

  // ==========================================
  // LOCATION 6: ANDHERI
  // ==========================================
  {
    id: 21,
    name: "Godrej Skyshore (Versova)",
    builder: "Godrej Properties",
    tagline: "Exclusive Sky Bungalows with Breathtaking Sea Views in Versova",
    location: "Andheri",
    locality: "Versova, Andheri West",
    city: "Mumbai",
    priceRange: "₹14.05 Cr - ₹24.50 Cr*",
    priceDisplay: "₹14.05 Cr*",
    status: "Newly Launched",
    possession: "Dec 2028",
    rera: "P51800052341",
    landParcel: "Exclusive Coastal Enclave",
    towers: "Signature Coastal High-Rise Tower",
    towerDetails: "Ultra-luxury Sky Bungalows overlooking the Arabian Sea (G + 38 Storeys)",
    elevators: "Private High-Speed Biometric Elevators",
    amenitiesCount: "40+ World-Class Bespoke Club Amenities",
    coverImage: "/projects/project_21_user_1.png",
    images: [
      "/projects/project_21_user_1.png",
      "/projects/project_21_user_2.png",
      "/projects/godrej_skyshore_official.webp"
    ],
    configurations: [
      { bhk: "4 Bed Royal Residence", carpetArea: "2,200 - 2,850 sq.ft CA", price: "₹14.05 Cr*", floorPlanLabel: "Royal Sky Bungalow", possessionDate: "Dec 2028" },
      { bhk: "5 Bed Duplex Penthouse", carpetArea: "3,800 - 4,600 sq.ft CA", price: "₹24.50 Cr*", floorPlanLabel: "Presidential Seafront Duplex", possessionDate: "Dec 2028" }
    ],
    virtualTourUrl: "https://view.pixeldo.com/GodrejSkyShore/",
    mapUrl: "https://maps.google.com/?q=Godrej+Skyshore+(Versova)+Versova%2C+Andheri+West+Mumbai",
    overview: "A home where breathtaking sea views meet spectacular sunrises, mesmerising sunsets and the glittering Mumbai skyline. Presenting an opportunity to own an exclusive Sky Bungalow at Godrej Skyshore, Versova.",
    highlights: [
      "Unobstructed 270° Arabian Sea and coastal mangroves views",
      "Sprawling private wrap-around deck in every sky residence",
      "Private elevator lobbies with biometric security control",
      "Minutes away from Versova Metro, Juhu and coastal road link"
    ],
    amenities: ["Seafront Infinity Pool", "Private Sunset Deck", "Bespoke Club Lounge", "Private Biometric Lifts", "Spa & Wellness Suite", "Banquet Hall"]
  },
  {
    id: 22,
    name: "Kalpataru Vian",
    builder: "Kalpataru Limited",
    tagline: "Urban Sophistication in Andheri East",
    location: "Andheri",
    locality: "Near Western Express Highway, Andheri East",
    city: "Mumbai",
    priceRange: "₹2.40 Cr - ₹4.10 Cr*",
    priceDisplay: "₹2.40 Cr*",
    status: "Under Construction",
    possession: "June 2028",
    rera: "P51800047910",
    landParcel: "2.5 Acres",
    towers: "2 Towers | 32 Storeys",
    towerDetails: "G + 4 Podium + 32 Storeys Modern Residences",
    elevators: "4 Elevators per core",
    amenitiesCount: "30+ Lifestyle Amenities",
    coverImage: "/projects/kalpataru_vian_official.jpg",
    images: [
      "/projects/kalpataru_vian_official.jpg",
      "/projects/project_img_58.jpg",
      "/projects/project_img_61.jpg",
      "/projects/project_img_59.jpg"
    ],
    configurations: [
      { bhk: "2 BHK Urban", carpetArea: "710 sq.ft CA", price: "₹2.40 Cr*", floorPlanLabel: "Type 2A", possessionDate: "June 2028" },
      { bhk: "3 BHK Grand", carpetArea: "1,030 sq.ft CA", price: "₹4.10 Cr*", floorPlanLabel: "Type 3A", possessionDate: "June 2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Kalpataru+Vian+Western+Express+Highway%2C+Andheri+East+Mumbai",
    overview: "Kalpataru Vian combines executive connectivity with resort amenities, located just minutes from international airport transit and metro corridors.",
    highlights: [
      "5 minutes from Western Express Highway and Andheri Metro",
      "Grand double-height lobby with curated art installations",
      "Rooftop clubhouse with city-skyline pool"
    ],
    amenities: ["Rooftop Pool", "Clubhouse", "Gymnasium", "Business Lounge", "Children's Zone"]
  },
  {
    id: 23,
    name: "Adani Linkbay",
    builder: "Adani Realty",
    tagline: "Waterfront Luxury Residences in Andheri West",
    location: "Andheri",
    locality: "Near DN Nagar Metro, Andheri West",
    city: "Mumbai",
    priceRange: "₹2.85 Cr - ₹5.60 Cr*",
    priceDisplay: "₹2.85 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800046123",
    landParcel: "4.2 Acres",
    towers: "3 Towers | 36 Storeys",
    towerDetails: "G + 5 Podium + 36 Storeys",
    elevators: "4 High-Speed Elevators",
    amenitiesCount: "40+ Amenities",
    coverImage: "/projects/adani_linkbay_official.webp",
    images: [
      "/projects/adani_linkbay_official.webp",
      "/projects/project_img_69.png"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "760 sq.ft CA", price: "₹2.85 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Royale", carpetArea: "1,120 sq.ft CA", price: "₹4.20 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" },
      { bhk: "4 BHK Presidential", carpetArea: "1,650 sq.ft CA", price: "₹5.60 Cr*", floorPlanLabel: "Type 4A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Adani+Linkbay+DN+Nagar+Metro%2C+Andheri+West+Mumbai",
    overview: "Adani Linkbay offers sprawling residential towers overlooking lush mangroves and creek views in Andheri West, featuring expansive private sun decks.",
    highlights: [
      "Direct connectivity to DN Nagar Metro interchange (Lines 1 & 2A)",
      "Bespoke clubhouse with temperature controlled lap pool",
      "Adani Realty construction excellence and high delivery standard"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Squash Court", "Gymnasium", "Banquet Deck", "Spa"]
  },
  {
    id: 24,
    name: "Puravankara",
    builder: "Puravankara Limited",
    tagline: "Signature Luxury Residence in Andheri",
    location: "Andheri",
    locality: "Andheri Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Andheri Parcel",
    towers: "High-Rise Tower",
    towerDetails: "Modern residential skyscraper",
    elevators: "Modern Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/project_24_user_1.png",
    images: [
      "/projects/project_24_user_1.png",
      "/projects/project_24_user_2.png",
      "/projects/project_24_user_3.png"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type A", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Puravankara+Puravankara+Andheri+Mumbai",
    overview: "Puravankara brings its nationally celebrated architectural planning and luxury finishes to Andheri, offering refined urban sanctuaries.",
    highlights: [
      "Strategically situated for quick transit to airport and BKC",
      "Lush landscaped open podium spaces",
      "Puravankara hallmark quality assurance"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Security", "Play Area"]
  },
  {
    id: 25,
    name: "Gurukrupa Realcon",
    builder: "Gurukrupa Group",
    tagline: "Contemporary Urban Residences in Andheri East",
    location: "Andheri",
    locality: "Andheri East Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2027",
    rera: "Information Coming Soon",
    landParcel: "Urban Land Parcel",
    towers: "High-Rise Tower",
    towerDetails: "Contemporary residential tower",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Lifestyle Amenities",
    coverImage: "/projects/project_25_user_1.png",
    images: [
      "/projects/project_25_user_1.png",
      "/projects/project_25_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "2027" },
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Gurukrupa+Realcon+Andheri+East+Mumbai",
    overview: "Gurukrupa Realcon presents modern urban residences in Andheri East, offering practical layouts and rapid airport road connectivity.",
    highlights: [
      "Proximity to metro and commercial business district",
      "Vastu-compliant contemporary apartment designs",
      "Attractive entry investment pricing"
    ],
    amenities: ["Fitness Center", "Lobby", "Security", "Rooftop Garden"]
  },
  {
    id: 26,
    name: "Naman 58",
    builder: "Shree Naman Group",
    tagline: "Executive Luxury Living in Andheri East",
    location: "Andheri",
    locality: "Chakala, Andheri East",
    city: "Mumbai",
    priceRange: "₹2.20 Cr - ₹3.80 Cr*",
    priceDisplay: "₹2.20 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51800041285",
    landParcel: "2 Acres",
    towers: "Single Tower | 28 Storeys",
    towerDetails: "Executive High-Rise with Glass Balconies",
    elevators: "3 High-Speed Elevators",
    amenitiesCount: "25+ Amenities",
    coverImage: "/projects/project_26_user_1.png",
    images: [
      "/projects/project_26_user_1.png"
    ],
    configurations: [
      { bhk: "2 BHK Executive", carpetArea: "680 sq.ft CA", price: "₹2.20 Cr*", floorPlanLabel: "Type 2A", possessionDate: "Dec 2027" },
      { bhk: "3 BHK Presidential", carpetArea: "990 sq.ft CA", price: "₹3.80 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Naman+58+Chakala%2C+Andheri+East+Mumbai",
    overview: "Naman 58 delivers executive luxury residences in Chakala, tailored for corporate leaders seeking walking access to metro and commercial hubs.",
    highlights: [
      "2 minutes from Chakala Metro Station",
      "Rooftop clubhouse and business conference facilities",
      "Low maintenance smart-home automation"
    ],
    amenities: ["Rooftop Lounge", "Business Center", "Gymnasium", "Banquet Room", "Security"]
  },
  {
    id: 27,
    name: "Kolte-Patil",
    builder: "Kolte-Patil Developers",
    tagline: "High-Rise Urban Homes in Andheri",
    location: "Andheri",
    locality: "Andheri Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2028",
    rera: "Information Coming Soon",
    landParcel: "Prime Acreage",
    towers: "High-Rise Tower",
    towerDetails: "Multi-storey residential tower",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/project_img_63.jpg",
    images: [
      "/projects/project_img_63.jpg",
      "/projects/project_img_47.webp"
    ],
    configurations: [
      { bhk: "2 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "2028" },
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Kolte-Patil+Kolte-Patil+Andheri+Mumbai",
    overview: "Kolte-Patil brings thoughtfully designed homes to Andheri, prioritizing natural ventilation, smart room ergonomics, and family recreational spaces.",
    highlights: [
      "Prime central location with fast highway connectivity",
      "Comprehensive clubhouse facilities",
      "Established brand trust"
    ],
    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Kids Play Area"]
  },
  {
    id: 28,
    name: "Hiranandani",
    builder: "Hiranandani Communities",
    tagline: "Neoclassical Masterpiece in Andheri",
    location: "Andheri",
    locality: "Andheri Prime",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Signature Land Parcel",
    towers: "Neoclassical High-Rise Tower",
    towerDetails: "Signature Roman arches and grand architectural facade",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Hiranandani Luxury Club",
    coverImage: "/projects/project_28_user_1.png",
    images: [
      "/projects/project_28_user_1.png",
      "/projects/project_28_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK Neoclassical", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 2", possessionDate: "TBA" },
      { bhk: "3 BHK Royale", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Hiranandani+Hiranandani+Andheri+Mumbai",
    overview: "A neoclassical architectural landmark in Andheri by Hiranandani, showcasing grand stone masonry, high ceilings, and landscaped piazzas.",
    highlights: [
      "Signature Hiranandani neoclassical aesthetic",
      "Vibrant self-contained lifestyle ecosystem",
      "High capital appreciation corridor"
    ],
    amenities: ["Grand Clubhouse", "Swimming Pool", "Tennis Court", "Landscaped Piazza", "Concierge"]
  },
  {
    id: 29,
    name: "Bharat",
    builder: "Bharat Infrastructure",
    tagline: "Bespoke Residences in Andheri West",
    location: "Andheri",
    locality: "Andheri West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2027",
    rera: "Information Coming Soon",
    landParcel: "Urban Land Parcel",
    towers: "High-Rise Tower",
    towerDetails: "Modern residential structure with luxury lobby",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/project_29_user_1.png",
    images: [
      "/projects/project_29_user_1.png",
      "/projects/project_29_user_2.png"
    ],
    configurations: [
      { bhk: "2 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "2027" },
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Bharat+Infrastructure+Bharat+Andheri+West+Mumbai",
    overview: "Bharat Infrastructure presents thoughtfully engineered homes in Andheri West, placing residents moments away from premier dining, entertainment, and transit.",
    highlights: [
      "Walking proximity to Andheri West metro corridor",
      "Vastu-compliant floor layouts",
      "High rental yield and capital appreciation potential"
    ],
    amenities: ["Gymnasium", "Lobby", "Security", "Rooftop Garden"]
  },
  {
    id: 30,
    name: "Rustomjee",
    builder: "Rustomjee",
    tagline: "Thoughtful Luxury Living in Andheri",
    location: "Andheri",
    locality: "Andheri Prime Belt",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Parcel",
    towers: "Signature High-Rise Tower",
    towerDetails: "Multi-storey residential landmark",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Rustomjee Signature Amenities",
    coverImage: "/projects/rustomjee_andheri_cover.jpg",
    images: [
      "/projects/rustomjee_andheri_cover.jpg",
      "/projects/project_30_user_1.png",
      "/projects/rustomjee_stella_official.webp"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type A", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Rustomjee+Andheri+Mumbai",
    overview: "Rustomjee's celebrated approach to thoughtful community living in Andheri, featuring expansive family decks and children's activity zones.",
    highlights: [
      "Holistic community living with dedicated learning zones",
      "Centrally connected to Western Express Highway & Metro",
      "Reputed construction delivery record"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Children's Creative Studio", "Fitness Center"]
  },
  {
    id: 31,
    name: "Lodha",
    builder: "Lodha Group",
    tagline: "Prestigious High-Rise Living in Andheri",
    location: "Andheri",
    locality: "Andheri West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Launch",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Acreage",
    towers: "Signature High-Rise Tower",
    towerDetails: "Luxury skyscraper with Saint Amand concierge",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Lodha Club Amenities",
    coverImage: "/projects/project_31_user_1.png",
    images: [
      "/projects/project_31_user_1.png",
      "/projects/project_31_user_2.png",
      "/projects/project_31_user_3.png"
    ],
    configurations: [
      { bhk: "2 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "3 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Lodha+Andheri+West+Mumbai",
    overview: "Lodha brings its legendary hospitality standards and architectural grandeur to Andheri, offering discerning residents private high-rise sanctuaries.",
    highlights: [
      "Saint Amand 5-star residential hospitality management",
      "Lavish clubhouse with indoor heated pool and spa",
      "Prime Western Suburbs location"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Spa", "Concierge Desk"]
  },
  {
    id: 32,
    name: "DLF",
    builder: "DLF",
    tagline: "Iconic North-India Luxury Developer in Andheri",
    location: "Andheri",
    locality: "Andheri West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Mumbai Enclave",
    towers: "Landmark Residential Tower",
    towerDetails: "Ultra-luxury international architecture",
    elevators: "High-Speed Elevators",
    amenitiesCount: "DLF Club Standards",
    coverImage: "/projects/project_32_user_1.png",
    images: [
      "/projects/project_32_user_1.png",
      "/projects/project_32_user_2.png"
    ],
    configurations: [
      { bhk: "3 BHK Presidential", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" },
      { bhk: "4 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=DLF+DLF+Andheri+West+Mumbai",
    overview: "DLF enters Mumbai with an ultra-luxury residential landmark in Andheri West, featuring grand scale club amenities and bespoke international finishes.",
    highlights: [
      "Iconic DLF ultra-luxury development standards",
      "Expansive floor-to-ceiling glass panoramic facades",
      "High-end clubhouse and concierge ecosystem"
    ],
    amenities: ["Olympic Pool", "Grand Clubhouse", "Private Theatre", "Spa", "Tennis Court"]
  },

  // ==========================================
  // LOCATION 7: BANDRA
  // ==========================================
  {
    id: 33,
    name: "Godrej",
    builder: "Godrej Properties",
    tagline: "Ultra-Luxury Seafront Sanctuary in Bandra",
    location: "Bandra",
    locality: "Pali Hill / Bandra West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Newly Launched",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Pali Hill Acreage",
    towers: "Signature High-Rise Tower",
    towerDetails: "Bespoke seafront sky mansions with wrap-around balconies",
    elevators: "Private Biometric Elevators",
    amenitiesCount: "Bespoke Club Amenities",
    coverImage: "/projects/godrej_bandra_cover.jpg",
    images: [
      "/projects/godrej_bandra_cover.jpg",
      "/projects/godrej_bandra_2.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Seafront", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" },
      { bhk: "4 BHK Penthouse", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Godrej+Godrej+Pali+Hill+%2F+Bandra+West+Mumbai",
    overview: "Godrej Properties presents a marquee ultra-luxury development in prestigious Bandra West, delivering unobstructed views of the Arabian Sea and bespoke Italian interiors.",
    highlights: [
      "Prime Bandra West address in Mumbai's most coveted neighborhood",
      "Unobstructed panoramic Arabian Sea views",
      "Private elevator access and high-security enclave"
    ],
    amenities: ["Seafront Infinity Pool", "Private Helipad Access", "Spa & Wellness Suite", "Clubhouse", "24/7 Concierge"]
  },
  {
    id: 34,
    name: "Hiranandani",
    builder: "Hiranandani Group",
    tagline: "Architectural Grandeur in Bandra",
    location: "Bandra",
    locality: "Bandra West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Exclusive Enclave",
    towers: "High-Rise Tower",
    towerDetails: "Neoclassical high-rise architecture",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Curated Amenities",
    coverImage: "/projects/hiranandani_bandra_cover.jpg",
    images: [
      "/projects/hiranandani_bandra_cover.jpg",
      "/projects/project_34_user_1.png",
      "/projects/project_34_user_2.png"
    ],
    configurations: [
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "4 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Hiranandani+Hiranandani+Bandra+West+Mumbai",
    overview: "Hiranandani's neoclassical architectural signature arrives in Bandra, offering palatial ceiling heights, marble foyers, and elite club facilities.",
    highlights: [
      "Distinctive neoclassical design and craftsmanship",
      "Located in the cultural capital of Mumbai",
      "High net-worth community neighborhood"
    ],
    amenities: ["Grand Club", "Swimming Pool", "Gymnasium", "Banquet Deck"]
  },
  {
    id: 35,
    name: "Raymond",
    builder: "Raymond Realty",
    tagline: "The Address by GS – Luxury Living in Bandra",
    location: "Bandra",
    locality: "Bandra East / BKC Gateway",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2027",
    rera: "Information Coming Soon",
    landParcel: "Prime Gateway Parcel",
    towers: "Signature High-Rise Tower",
    towerDetails: "G + 40 Storeys Luxury Tower with curated club",
    elevators: "4 High-Speed Elevators",
    amenitiesCount: "35+ Curated Amenities",
    coverImage: "/projects/raymond_bandra_cover.jpg",
    images: [
      "/projects/raymond_bandra_cover.jpg",
      "/projects/raymond_bandra_balcony.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "2027" },
      { bhk: "4 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Raymond+Realty+Raymond+Bandra+East+%2F+BKC+Gateway+Mumbai",
    overview: "The Address by GS by Raymond Realty in Bandra combines bespoke sartorial luxury with swift connectivity to Bandra-Kurla Complex (BKC).",
    highlights: [
      "3 minutes from Bandra-Kurla Complex (BKC)",
      "Curated lifestyle club inspired by classical heritage",
      "Grand double-height air-conditioned entrance lobby"
    ],
    amenities: ["Infinity Pool", "Clubhouse", "Gymnasium", "Cigar Lounge", "Tennis Court"]
  },
  {
    id: 36,
    name: "Sunteck",
    builder: "Sunteck Realty",
    tagline: "Signature Ultra-Luxury Residence in Bandra West",
    location: "Bandra",
    locality: "Bandra West / Mount Mary",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2028",
    rera: "Information Coming Soon",
    landParcel: "Boutique Seafront Parcel",
    towers: "Ultra-Luxury Tower",
    towerDetails: "Private residences overlooking Arabian Sea",
    elevators: "Private Elevators",
    amenitiesCount: "World-Class Amenities",
    coverImage: "/projects/sunteck_bandra_cover.jpg",
    images: [
      "/projects/sunteck_bandra_cover.jpg",
      "/projects/sunteck_bandra_daylight.jpg",
      "/projects/project_img_36.jpg"
    ],
    configurations: [
      { bhk: "4 BHK Palatial", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "2028" },
      { bhk: "5 BHK Sky Villa", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 5", possessionDate: "2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Sunteck+Realty+Sunteck+Bandra+West+%2F+Mount+Mary+Mumbai",
    overview: "Sunteck's ultra-luxury residences in Bandra West offer unmatched exclusivity, soaring ceilings, and mesmerizing Arabian Sea vistas.",
    highlights: [
      "Elite address with high celebrity and business profile neighbors",
      "Private full-floor and duplex sky villa residences",
      "Dedicated concierge and 5-tier security protocols"
    ],
    amenities: ["Sea-Facing Pool", "Spa & Wellness Deck", "Private Lounge", "Biometric Elevators"]
  },
  {
    id: 37,
    name: "Oberoi Realty",
    builder: "Oberoi Realty",
    tagline: "Prestige Masterpiece in Bandra West",
    location: "Bandra",
    locality: "Carter Road / Bandra West",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Marquee Seafront Parcel",
    towers: "Iconic Skyscraper",
    towerDetails: "Contemporary international architecture",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Oberoi Club Standards",
    coverImage: "/projects/project_37_user_1.png",
    images: [
      "/projects/project_37_user_1.png",
      "/projects/project_37_user_2.png",
      "/projects/oberoi_sky_city_official.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "4 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Oberoi+Realty+Oberoi+Realty+Carter+Road+%2F+Bandra+West+Mumbai",
    overview: "Oberoi Realty brings its celebrated architectural precision and engineering perfection to Bandra West, creating timeless high-rise homes.",
    highlights: [
      "Unrivaled location near Bandra promenade and Carter Road",
      "Uncompromising Oberoi quality and high execution standards",
      "World-class private club amenities"
    ],
    amenities: ["Olympic Pool", "Private Clubhouse", "Gymnasium", "Banquet Hall", "Concierge"]
  },
  {
    id: 38,
    name: "Adani Realty",
    builder: "Adani Realty",
    tagline: "Contemporary Waterfront Living in Bandra",
    location: "Bandra",
    locality: "Bandra West Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Launch",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime Bandra Acreage",
    towers: "Signature High-Rise Tower",
    towerDetails: "Glass facade architecture with wide decks",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Adani Club Standards",
    coverImage: "/projects/adani_ten_bkc_official.webp",
    images: [
      "/projects/adani_ten_bkc_official.webp",
      "/projects/project_img_8.jpg",
      "/projects/project_img_9.jpg",
      "/projects/project_img_10.jpg"
    ],
    configurations: [
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "TBA" },
      { bhk: "4 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Adani+Realty+Adani+Realty+Bandra+West+Mumbai",
    overview: "Adani Realty's prime residential offering in Bandra West, presenting panoramic urban views, spacious floor plates, and modern luxury.",
    highlights: [
      "Direct connectivity to Bandra-Worli Sea Link and Western Express Highway",
      "Expansive floor-to-ceiling glass glazing",
      "High standard of construction reliability"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Sky Lounge", "24/7 Security"]
  },
  {
    id: 39,
    name: "DLH",
    builder: "DLH Group",
    tagline: "Boutique Heritage Luxury in Bandra West",
    location: "Bandra",
    locality: "Bandra West Prime",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Under Construction",
    possession: "2027",
    rera: "Information Coming Soon",
    landParcel: "Exclusive Boutique Plot",
    towers: "Boutique Residential Tower",
    towerDetails: "Low-density luxury apartments",
    elevators: "Private Elevators",
    amenitiesCount: "Boutique Amenities",
    coverImage: "/projects/dlh_bandra_cover.jpg",
    images: [
      "/projects/dlh_bandra_cover.jpg",
      "/projects/project_39_user_1.png",
      "/projects/project_39_user_2.png"
    ],
    configurations: [
      { bhk: "3 BHK Boutique", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "2027" },
      { bhk: "4 BHK Presidential", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "2027" }
    ],
    mapUrl: "https://maps.google.com/?q=DLH+DLH+Bandra+West+Mumbai",
    overview: "DLH Group delivers boutique, low-density residences in Bandra West, tailored for residents who value refined privacy and timeless style.",
    highlights: [
      "Only 1 to 2 residences per floor for maximum privacy",
      "Walking access to Bandra's iconic cafes and seaside promenade",
      "Customizable interior spatial arrangements"
    ],
    amenities: ["Private Elevator Access", "Rooftop Lounge", "Fitness Studio", "Valet Parking"]
  },

  // ==========================================
  // LOCATION 8: LOWER PAREL
  // ==========================================
  {
    id: 40,
    name: "Lodha",
    builder: "Lodha Group",
    tagline: "Iconic Skyscraper Living in Lower Parel",
    location: "Lower Parel",
    locality: "Lower Parel / Parkside",
    city: "Mumbai",
    priceRange: "₹8.50 Cr - ₹25.00 Cr*",
    priceDisplay: "₹8.50 Cr*",
    status: "Ready & Under Construction Phased",
    possession: "Dec 2026 / Ready",
    rera: "P51900008345",
    landParcel: "17 Acres Urban Park Oasis",
    towers: "Sculptural Curved Glass Towers",
    towerDetails: "World-class architectural towers soaring up to 100+ storeys",
    elevators: "Private Concierge Elevators by Otis",
    amenitiesCount: "50+ Armani/Casa Club Amenities",
    coverImage: "/projects/project_40_user_1.png",
    images: [
      "/projects/project_40_user_1.png",
      "/projects/project_40_user_2.png"
    ],
    configurations: [
      { bhk: "3 BHK Sky Suite", carpetArea: "1,550 sq.ft CA", price: "₹8.50 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2026" },
      { bhk: "4 BHK Sea View", carpetArea: "2,450 sq.ft CA", price: "₹14.50 Cr*", floorPlanLabel: "Type 4A", possessionDate: "Dec 2026" },
      { bhk: "5 BHK Duplex Sky Mansion", carpetArea: "4,800 sq.ft CA", price: "₹25.00 Cr*", floorPlanLabel: "Type 5A", possessionDate: "Dec 2026" }
    ],
    mapUrl: "https://maps.google.com/?q=Lodha+Lodha+Lower+Parel+%2F+Parkside+Mumbai",
    overview: "Soaring into the South Mumbai skyline, Lodha's Lower Parel developments represent the pinnacle of architectural luxury with 7-acre private parks and Italian interior design.",
    highlights: [
      "Overlooks the Mahalaxmi Racecourse and Arabian Sea",
      "Interiors curated by Giorgio Armani / Casa",
      "Private helipad, temperature-controlled indoor pool & spa"
    ],
    amenities: ["Armani/Casa Club", "Olympic Lap Pool", "Private Helipad Access", "Spa & Wellness Suite", "Concierge Desk"]
  },
  {
    id: 41,
    name: "Piramal",
    builder: "Piramal Realty",
    tagline: "Spectacular Luxury High-Rise Living in Lower Parel",
    location: "Lower Parel",
    locality: "Lower Parel Commercial & Residential Hub",
    city: "Mumbai",
    priceRange: "₹7.25 Cr - ₹18.00 Cr*",
    priceDisplay: "₹7.25 Cr*",
    status: "Under Construction",
    possession: "Dec 2027",
    rera: "P51900015893",
    landParcel: "7 Acres",
    towers: "3 Architectural Towers",
    towerDetails: "G + 60 Storeys with panoramic sea link vistas",
    elevators: "High-Speed Lifts",
    amenitiesCount: "40+ Amenities",
    coverImage: "/projects/piramal_mahalaxmi_official.webp",
    images: [
      "/projects/piramal_mahalaxmi_official.webp",
      "/projects/project_img_64.webp",
      "/projects/project_img_48.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Luxe", carpetArea: "1,420 sq.ft CA", price: "₹7.25 Cr*", floorPlanLabel: "Type 3A", possessionDate: "Dec 2027" },
      { bhk: "4 BHK Royal", carpetArea: "2,150 sq.ft CA", price: "₹12.80 Cr*", floorPlanLabel: "Type 4A", possessionDate: "Dec 2027" }
    ],
    mapUrl: "https://maps.google.com/?q=Piramal+Realty+Piramal+Lower+Parel+Commercial+%26+Residential+Mumbai",
    overview: "Piramal Realty presents an enclave of architectural serenity in Lower Parel, offering dual-aspect views of the Eastern Harbour and Arabian Sea.",
    highlights: [
      "Minutes from Palladium Mall, High Street Phoenix & corporate HQs",
      "Lush landscaped forest deck and biophilic architecture",
      "Floor-to-ceiling soundproof acoustic glass windows"
    ],
    amenities: ["Infinity Pool", "Clubhouse", "Gymnasium", "Cricket Pitch", "Children's Play Area"]
  },
  {
    id: 42,
    name: "Prestige Group",
    builder: "Prestige Group",
    tagline: "Marquee South Mumbai Landmark in Lower Parel",
    location: "Lower Parel",
    locality: "Off Senapati Bapat Marg, Lower Parel",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Newly Launched",
    possession: "2028",
    rera: "Information Coming Soon",
    landParcel: "Prime South Mumbai Acreage",
    towers: "Signature High-Rise Towers",
    towerDetails: "Iconic towers soaring over 50 storeys",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Prestige Luxury Club",
    coverImage: "/projects/prestige_jasdan_official.webp",
    images: [
      "/projects/prestige_jasdan_official.webp",
      "/projects/project_img_66.jpg",
      "/projects/project_img_68.jpg"
    ],
    configurations: [
      { bhk: "3 BHK Luxury", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 3", possessionDate: "2028" },
      { bhk: "4 BHK Royal", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Type 4", possessionDate: "2028" }
    ],
    mapUrl: "https://maps.google.com/?q=Prestige+Prestige+Group+Senapati+Bapat+Marg%2C+Lower+Parel+Mumbai",
    overview: "Prestige Group brings its celebrated luxury hospitality standards to Lower Parel with landmark high-rise towers designed for Mumbai's top business leaders.",
    highlights: [
      "Center of Mumbai's financial and fine dining epicenter",
      "Lavish clubhouse with indoor squash, badminton and heated pool",
      "High-speed transit connectivity via Coastal Road and Sea Link"
    ],
    amenities: ["Heated Lap Pool", "Squash Courts", "Executive Lounge", "Spa", "Concierge"]
  },
  {
    id: 43,
    name: "Godrej",
    builder: "Godrej Properties",
    tagline: "Exclusive High-Rise Sanctuary in Lower Parel",
    location: "Lower Parel",
    locality: "Lower Parel Corridor",
    city: "Mumbai",
    priceRange: "Price on Request*",
    priceDisplay: "Price on Request*",
    status: "Upcoming Development",
    possession: "Information Coming Soon",
    rera: "Information Coming Soon",
    landParcel: "Prime South Mumbai Parcel",
    towers: "Signature High-Rise Tower",
    towerDetails: "Ultra-luxury residential skyscraper",
    elevators: "High-Speed Elevators",
    amenitiesCount: "Godrej Signature Amenities",
    coverImage: "/projects/project_43_user_1.png",
    images: [
      "/projects/project_43_user_1.png",
      "/projects/godrej_skyshore_official.webp",
      "/projects/godrej_reserve_official.webp"
    ],
    configurations: [
      { bhk: "3 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan A", possessionDate: "TBA" },
      { bhk: "4 BHK", carpetArea: "Information Coming Soon", price: "Price on Request*", floorPlanLabel: "Plan B", possessionDate: "TBA" }
    ],
    mapUrl: "https://maps.google.com/?q=Godrej+Godrej+Lower+Parel+Mumbai",
    overview: "Godrej Properties presents a marquee luxury residential project in Lower Parel, blending green architecture with breathtaking urban skyline vistas.",
    highlights: [
      "Direct highway and sea link connectivity",
      "Green building design with energy-efficient ventilation",
      "Unmatched Godrej delivery legacy"
    ],
    amenities: ["Swimming Pool", "Clubhouse", "Gymnasium", "Sky Lounge", "24/7 Security"]
  }
];

export const AMENITIES_LIST = [
  {
    id: 1,
    name: "Swimming Pool",
    category: "Wellness",
    tag: "Temperature Controlled",
    icon: "Waves",
    image: "/amenities/swimming_pool.jpg",
    desc: "Olympic-dimension temperature controlled lap pool with submerged sun loungers and cabana deck."
  },
  {
    id: 2,
    name: "Fully-equipped Gymnasium",
    category: "Wellness",
    tag: "Technogym Studio",
    icon: "Dumbbell",
    image: "/amenities/gymnasium.jpg",
    desc: "State-of-the-art cardiovascular and strength training equipment with dedicated personal coaching studio."
  },
  {
    id: 3,
    name: "Landscaped Gardens",
    category: "Nature",
    tag: "Zen Sanctuary",
    icon: "Trees",
    image: "/amenities/gardens.jpg",
    desc: "Zen meditation pavilions, manicured reflexology walking trails, and fragrant botanical flora."
  },
  {
    id: 4,
    name: "Kids' Play Area",
    category: "Nature",
    tag: "Adventure Zone",
    icon: "Gamepad2",
    image: "/amenities/kids_play_v2.jpg",
    desc: "Rubberized child-safe outdoor obstacle courses, creative soft-play arenas, and climbing towers."
  },
  {
    id: 5,
    name: "Grand Clubhouse",
    category: "Leisure",
    tag: "Private Club",
    icon: "Building2",
    image: "/amenities/clubhouse.jpg",
    desc: "Multi-level private lifestyle lounge with banquet salon, billiards room, and residents' library."
  },
  {
    id: 6,
    name: "24x7 Security & CCTV",
    category: "Services",
    tag: "Biometric AI",
    icon: "ShieldCheck",
    image: "/amenities/security.jpg",
    desc: "Multi-tier biometric facial recognition access, RFID gated boom barriers, and perimeter patrol."
  },
  {
    id: 7,
    name: "Rooftop Infinity Pool",
    category: "Wellness",
    tag: "Skyline Horizon",
    icon: "Sparkles",
    image: "/amenities/infinity_pool.jpg",
    desc: "Cantilevered sky horizon pool with breathtaking sunset views of the Arabian Sea and city skyline."
  },
  {
    id: 8,
    name: "Banquets Hall",
    category: "Leisure",
    tag: "Celebration Venue",
    icon: "Crown",
    image: "/amenities/banquet_hall.jpg",
    desc: "Grand celebratory ballroom with crystal chandeliers, banquet seating, and bespoke catering lounge."
  },
  {
    id: 9,
    name: "Spa & Hydrotherapy Sauna",
    category: "Wellness",
    tag: "Thermal Wellness",
    icon: "Flame",
    image: "/amenities/spa_sauna.jpg",
    desc: "Aromatherapy steam rooms, Finnish sauna chambers, unisex salon suites, and therapeutic Jacuzzis."
  },
  {
    id: 10,
    name: "White-Glove Concierge",
    category: "Services",
    tag: "24/7 Hospitality",
    icon: "ConciergeBell",
    image: "/amenities/concierge.jpg",
    desc: "Five-star personal assistance for travel reservations, guest management, and parcel handling."
  },
  {
    id: 11,
    name: "Co-working & Business Lounge",
    category: "Services",
    tag: "High-Speed Pods",
    icon: "Laptop",
    image: "/amenities/coworking.jpg",
    desc: "High-speed fiber connectivity, private video conference rooms, and acoustic phone pods."
  },
  {
    id: 12,
    name: "EV Fast Charging Bays",
    category: "Services",
    tag: "Eco Mobility",
    icon: "Zap",
    image: "/amenities/ev_charging.jpg",
    desc: "Dedicated high-voltage rapid charging stations compatible with all major EV automobile models."
  },
  {
    id: 13,
    name: "Rooftop Sky Observatory",
    category: "Leisure",
    tag: "360° Panorama",
    icon: "Sun",
    image: "/amenities/sky_deck.jpg",
    desc: "High-power celestial telescopes, open-air stargazing amphitheater, and sunset cocktail terrace."
  }
];

export const PROMOTED_LOCATIONS = [
  {
    name: "Borivali",
    tagline: "Kalpataru Advay & Premium Family Living",
    activeListings: 4,
    badge: "Flagship Hub",
    keyHighlight: "Metro 2A, Link Road & National Park proximity"
  },
  {
    name: "Kandivali",
    tagline: "Godrej Reserve & Mahindra Vista Green Living",
    activeListings: 4,
    badge: "Fast Growing",
    keyHighlight: "Western Express Highway & Lokhandwala Township"
  },
  {
    name: "Malad",
    tagline: "Runwal, Lodha & Enchante Point Residences",
    activeListings: 4,
    badge: "High Demand",
    keyHighlight: "Inorbit Mall, Mindspace & Link Road Hub"
  },
  {
    name: "Goregaon",
    tagline: "Kalpataru Elara & Rustomjee Signature Towers",
    activeListings: 4,
    badge: "Prime Central",
    keyHighlight: "Hub of Western Suburbs, Oberoi Mall & Metro"
  },
  {
    name: "Jogeshwari",
    tagline: "Lodha Sovrano & Paradigm Downtown 102",
    activeListings: 4,
    badge: "Emerging Value",
    keyHighlight: "JVLR Connectivity & SV Road Corridor"
  },
  {
    name: "Andheri",
    tagline: "Godrej Skyshore (Versova) & Kalpataru Vian",
    activeListings: 12,
    badge: "Ultra Luxury",
    keyHighlight: "Versova Seafront, Metro 1 & Coastal Road Link"
  },
  {
    name: "Bandra",
    tagline: "Heritage Luxury & Celebrity Seafront",
    activeListings: 7,
    badge: "Elite",
    keyHighlight: "Queen of Suburbs, Sea Face & Fine Dining"
  },
  {
    name: "Lower Parel",
    tagline: "Commercial Skyscrapers & Sky Mansions",
    activeListings: 4,
    badge: "Downtown",
    keyHighlight: "High Street Phoenix & Financial Center"
  }
];

export const PROJECT_FOLDERS = {
  1: "1 - Kalpataru Advay",
  2: "2 - Lodha Altus",
  3: "3 - Oberoi Sky City",
  4: "4 - Chandak GreenAir",
  5: "5 - Godrej Reserve",
  6: "6 - Mahindra Vista",
  7: "7 - Godrej Bliss",
  8: "8 - Lodha Woods",
  9: "9 - Naring (Malad)",
  10: "10 - Runwal",
  11: "11 - Lodha (Malad)",
  12: "12 - Enchante Point",
  13: "13 - Naring (Goregaon)",
  14: "14 - Kalpataru Elara",
  15: "15 - Kolte-Patil (Goregaon)",
  16: "16 - Rustomjee (Goregaon)",
  17: "17 - Lodha Sovrano",
  18: "18 - Paradigm Downtown 102",
  19: "19 - Roseworld",
  20: "20 - Sunteck (Jogeshwari)",
  21: "21 - Godrej Skyshore (Versova)",
  22: "22 - Kalpataru Vian",
  23: "23 - Adani Linkbay",
  24: "24 - Puravankara",
  25: "25 - Gurukrupa Realcon",
  26: "26 - Naman 58",
  27: "27 - Kolte-Patil (Andheri)",
  28: "28 - Hiranandani (Andheri)",
  29: "29 - Bharat",
  30: "30 - Rustomjee (Andheri)",
  31: "31 - Lodha (Andheri)",
  32: "32 - DLF (Andheri)",
  33: "33 - Godrej (Bandra)",
  34: "34 - Hiranandani (Bandra)",
  35: "35 - Raymond",
  36: "36 - Sunteck (Bandra)",
  37: "37 - Oberoi Realty",
  38: "38 - Adani Realty",
  39: "39 - DLH",
  40: "40 - Lodha (Lower Parel)",
  41: "41 - Piramal",
  42: "42 - Prestige Group",
  43: "43 - Godrej (Lower Parel)"
};

// Map each project's cover photo to file "1" inside its dedicated folder in public/project_photos/
export const PROJECT_ENRICHMENTS = {
  "1": {
    "keyFeatures": [
      "Direct access to New Link Road & upcoming Coastal Road",
      "5 Mins to Eksar Metro Station (Line 2A)",
      "7 Mins to Borivali Railway Station & S.V. Road",
      "Near Apex Superspeciality Hospital & Don Bosco High School"
    ],
    "amenities": [
      "Infinity Lap Pool",
      "Grand 25,000 sq.ft Clubhouse",
      "Rooftop Sky Lounge",
      "Private Screening Theatre",
      "Olympic-Grade Gymnasium",
      "Kids Aquatic Zone",
      "Zen Reflexology Gardens",
      "24/7 Valet & Concierge"
    ]
  },
  "2": {
    "keyFeatures": [
      "Direct off Western Express Highway (Borivali West)",
      "3 Mins to Magathane / Borivali Metro Station",
      "Overlooking 25,000-acre Sanjay Gandhi National Park",
      "8 Mins to Borivali Terminus & S.V. Road"
    ],
    "amenities": [
      "Heated Swimming Pool",
      "Art Deco Grand Clubhouse",
      "State-of-the-Art Fitness Center",
      "Banquet & Ballrooms",
      "Championship Tennis Court",
      "Private Sunset Sundecks",
      "Lush Forest Tree Court",
      "Kids Play Area"
    ]
  },
  "3": {
    "keyFeatures": [
      "Direct Integrated Skywalk to Sky City Mall",
      "Directly Connected to Devipada Metro Station",
      "Zero-Minute Access to Western Express Highway",
      "Panoramic Unobstructed Views of Sanjay Gandhi National Park"
    ],
    "amenities": [
      "Olympic-Length Lap Pool",
      "Direct Mall Access",
      "Multi-Sport Indoor Arena",
      "Squash & Badminton Courts",
      "Kids Adventure Forest",
      "Luxury Spa & Hydrotherapy Sauna",
      "Grand Banquet Lawn",
      "Rooftop Jogging Track"
    ]
  },
  "4": {
    "keyFeatures": [
      "Direct access off Western Express Highway",
      "3 Mins to Rashtriya Udyan Metro Station",
      "Bordering Sanjay Gandhi National Park Nature Corridor",
      "5 Mins to Borivali East Station & Markets"
    ],
    "amenities": [
      "Sky Infinity Pool",
      "Designer Clubhouse",
      "Crossfit & Aerobics Gym",
      "Lush Landscaped Podium",
      "Yoga & Meditation Pavilion",
      "Children's Sensory Park",
      "Senior Citizens Seating Plaza",
      "Indoor Games Arcade"
    ]
  },
  "5": {
    "keyFeatures": [
      "Direct access via Akurli Road, Kandivali East",
      "3 Mins to Akurli Metro Station & Western Express Highway",
      "5 Mins to Growel's 101 Mall & Kandivali Railway Station",
      "Flanked by 100+ Acres of Protected Reserve Forest Greens"
    ],
    "amenities": [
      "Resort-Style Swimming Pool",
      "Grand Double-Height Entrance Lobby",
      "Clubhouse with Steam & Sauna",
      "Modern Gymnasium",
      "Indoor Badminton Court",
      "Reflexology & Jogging Trail",
      "Terrace Sky Garden",
      "24/7 Biometric Multi-Tier Security"
    ]
  },
  "6": {
    "keyFeatures": [
      "Located on Akurli Road, Kandivali East",
      "2 Mins to Western Express Highway & Metro Line 7",
      "4 Mins to Growel's 101 Mall & Multiplex",
      "7 Mins to Kandivali Railway Station & S.V. Road"
    ],
    "amenities": [
      "Temperature-Controlled Pool",
      "Club Vista Community Center",
      "High-Tech Fitness Studio",
      "Multipurpose Sports Court",
      "Organic Community Farm",
      "Sky Gazing Deck",
      "Kids Learning Pod",
      "Electric Vehicle Charging Stations"
    ]
  },
  "7": {
    "keyFeatures": [
      "Prime Location in Lokhandwala Township, Kandivali East",
      "3 Mins to Western Express Highway & Metro Station",
      "5 Mins to Cambridge School & Sports Arena",
      "Direct corridor to Kandivali & Malad East business hubs"
    ],
    "amenities": [
      "Infinity-Edge Swimming Pool",
      "Grand 40-Storey Sky Lounge",
      "Fully Equipped Gymnasium",
      "Jogging & Cycling Track",
      "Indoor Games Room",
      "Kids Splash Park",
      "Banquet & Party Lawn",
      "Private Work Pods / Business Center"
    ]
  },
  "8": {
    "keyFeatures": [
      "Nestled off Western Express Highway, Kandivali East",
      "2 Mins to Mahindra & Mahindra Metro Station",
      "Surrounded by 25,000 Acres of National Park Greens",
      "6 Mins to Thakur Village & Growel's 101 Mall"
    ],
    "amenities": [
      "Heated Swimming Pool",
      "20,000 sq.ft International Clubhouse",
      "Woodland Nature Trails",
      "Outdoor Tennis & Basketball Courts",
      "Gymnasium by World-Class Trainers",
      "Private Dining Terrace",
      "Kids Adventure Forest",
      "24/7 Concierge"
    ]
  },
  "9": {
    "keyFeatures": [
      "Located on Link Road Corridor, Malad West",
      "3 Mins to Inorbit Mall & Infiniti Mall Malad",
      "4 Mins to Malad West Metro Station (Line 2A)",
      "Rapid connection to Mindspace IT Park & S.V. Road"
    ],
    "amenities": [
      "Rooftop Infinity Swimming Pool",
      "Designer Sky Clubhouse",
      "Hi-Tech Fitness Gym",
      "Rooftop Party Deck",
      "Children's Play Arena",
      "Indoor Games Lounge",
      "Multipurpose Banquet",
      "24/7 CCTV & RFID Access"
    ]
  },
  "10": {
    "keyFeatures": [
      "Adjacent to Inorbit Mall, Malad West",
      "3 Mins to Malad West Metro Station",
      "5 Mins to Mindspace IT & Commercial SEZ",
      "8 Mins to S.V. Road & Western Express Highway via Flyover"
    ],
    "amenities": [
      "Large Lap Pool & Kids Pool",
      "Palatial Lifestyle Clubhouse",
      "Advanced Fitness & Cardio Suite",
      "Squash & Table Tennis Courts",
      "Landscaped Podium Gardens",
      "Banquet Hall with Kitchen",
      "Jogging Loop",
      "Co-Working Executive Lounge"
    ]
  },
  "11": {
    "keyFeatures": [
      "Prime position on Link Road, Malad West",
      "4 Mins to Mindspace & Western Metro Line 2A",
      "5 Mins to Infiniti & Inorbit Malls",
      "Direct connectivity to Coastal Road extension & S.V. Road"
    ],
    "amenities": [
      "Signature Lodha Swimming Pool",
      "Grand Entrance Lobby",
      "World-Class Fitness Center",
      "Indoor Games & Billiards Room",
      "Private Meeting Rooms",
      "Sky Deck with City Views",
      "Children's Play Zone",
      "24/7 Lodha Concierge"
    ]
  },
  "12": {
    "keyFeatures": [
      "Off S.V. Road & Link Road, Malad West",
      "4 Mins to Malad Railway Station",
      "5 Mins to Inorbit Mall & Metro Line 2A",
      "Easy bypass to Goregaon & Western Express Highway"
    ],
    "amenities": [
      "Rooftop Horizon Swimming Pool",
      "Boutique Sky Clubhouse",
      "Fitness & Yoga Studio",
      "Designer Landscaped Terraces",
      "Indoor Games Arcade",
      "Private Party Lounge",
      "Multipurpose Community Hall",
      "Hi-Speed Passenger Elevators"
    ]
  },
  "13": {
    "keyFeatures": [
      "Located on Link Road Corridor, Goregaon West",
      "3 Mins to Bangur Nagar Metro Station",
      "5 Mins to Inorbit Mall & Goregaon Railway Station",
      "Quick connection to Western Express Highway via Mrinal Tai Gore Flyover"
    ],
    "amenities": [
      "Grand Porte-Coch\u00e8re Drop-off Lobby",
      "Swimming Pool with Timber Sun Deck",
      "State-of-the-Art Gymnasium",
      "Landscaped Podium Gardens",
      "Kids Fun Park",
      "Banquet & Gathering Hall",
      "Indoor Games Zone",
      "High-Security Access Control"
    ]
  },
  "14": {
    "keyFeatures": [
      "Near Inorbit Mall & Mindspace, Goregaon West",
      "3 Mins to Bangur Nagar Metro Station",
      "6 Mins to Goregaon Railway Station & S.V. Road",
      "Direct arterial access to Western Express Highway"
    ],
    "amenities": [
      "Curved Swimming Pool & Poolside Cabanas",
      "Grand Double-Height Entrance Lobby",
      "Fully Equipped Fitness Center",
      "Badminton & Half Basketball Court",
      "Jogging Path & Reflexology Walkway",
      "Kids Play Area & Sandbox",
      "Party Lawn with BBQ Station",
      "24/7 Manned Security"
    ]
  },
  "15": {
    "keyFeatures": [
      "Link Road Corridor, Goregaon West",
      "3 Mins to Metro Station Line 2A",
      "5 Mins to Inorbit Mall & Hypercity",
      "10 Mins to Oberoi Mall via Goregaon-Mulund Link Road"
    ],
    "amenities": [
      "Sky Swimming Pool",
      "Fitness & Aerobics Center",
      "Rooftop Sky Lounge",
      "Landscaped Sit-out Gardens",
      "Indoor Games & Card Room",
      "Children's Play Arena",
      "Grand Welcoming Lobby",
      "24/7 Security & CCTV"
    ]
  },
  "16": {
    "keyFeatures": [
      "Strategic position off S.V. Road & Link Road, Goregaon West",
      "4 Mins to Goregaon Railway Station",
      "5 Mins to Inorbit Mall & Metro Station",
      "Direct flyover access to Western Express Highway"
    ],
    "amenities": [
      "Full-Length Swimming Pool",
      "Exclusive Rustomjee Clubhouse",
      "Equipped Gymnasium & Yoga Deck",
      "Tennis & Multipurpose Court",
      "Amphitheatre & Performance Lawn",
      "Children's Theme Park",
      "Senior Citizens Pavilion",
      "24/7 Concierge"
    ]
  },
  "17": {
    "keyFeatures": [
      "Near S.V. Road & JVLR, Jogeshwari West",
      "3 Mins to Jogeshwari Railway Station & Metro Line 6",
      "5 Mins to Western Express Highway & Lokhandwala Link",
      "8 Mins to Oberoi Mall & Nesco IT Park"
    ],
    "amenities": [
      "Regal Swimming Pool with Sunken Loungers",
      "Grand Art Deco Clubhouse",
      "Fitness Center with Modern Cardio",
      "Indoor Sports Room",
      "Designer Tree-lined Gardens",
      "Banquet Hall & Party Lawns",
      "Kids Adventure Play Zone",
      "24/7 Lodha Services"
    ]
  },
  "18": {
    "keyFeatures": [
      "Directly on S.V. Road, Jogeshwari West",
      "2 Mins to Jogeshwari Railway Station",
      "5 Mins to JVLR & Western Express Highway",
      "7 Mins to Andheri Station & Metro Line 1"
    ],
    "amenities": [
      "Rooftop Infinity Lap Pool",
      "Sky Lounge & Stargazing Deck",
      "Technogym Fitness Studio",
      "Rooftop Walking Track",
      "Kids Play Zone",
      "Indoor Games Pavilion",
      "Modern Business Center",
      "Multipurpose Community Hall"
    ]
  },
  "19": {
    "keyFeatures": [
      "Directly on S.V. Road, Oshiwara, Jogeshwari West",
      "2 Mins to Lower Oshiwara Metro Station",
      "5 Mins to Infiniti Mall Andheri & Lokhandwala Complex",
      "Quick access to JVLR & Western Express Highway"
    ],
    "amenities": [
      "Podium Swimming Pool with Deck",
      "High-Tech Gymnasium & Aerobics Room",
      "Rooftop Sky Lounge",
      "Landscaped Podium Gardens",
      "Banquet & Celebration Hall",
      "Children's Fun Zone",
      "Indoor Sports Lounge",
      "Multi-Tier Smart Security"
    ]
  },
  "20": {
    "keyFeatures": [
      "Near JVLR Junction & Oshiwara, Jogeshwari West",
      "2 Mins to Ram Mandir Railway Station & Metro",
      "Direct access to Western Express Highway via JVLR",
      "5 Mins to Nesco IT Park & Oberoi Commerz"
    ],
    "amenities": [
      "Olympic-Style Swimming Pool",
      "Integrated Township Clubhouse",
      "Advanced Fitness Center",
      "Squash & Tennis Courts",
      "Lush Central Park Gardens",
      "Boutique Retail & Cafes",
      "Kids Aquatic Zone",
      "24/7 Concierge & Valet"
    ]
  },
  "21": {
    "keyFeatures": [
      "Direct Seafront Location in Versova, Andheri West",
      "2 Mins to Versova Metro Station (Line 1)",
      "5 Mins to Lokhandwala Complex & Juhu Beach",
      "Direct access to upcoming Versova-Bandra Sea Link"
    ],
    "amenities": [
      "Sea-Facing Infinity Lap Pool",
      "Private Seafront Cabanas",
      "Grand Porte-Coch\u00e8re Lobby",
      "Modern Fitness & Pilates Studio",
      "Rooftop Party Deck with Sunset Views",
      "Private Movie Theatre",
      "Kids Splash Pool",
      "24/7 Luxury Concierge"
    ]
  },
  "22": {
    "keyFeatures": [
      "Near Western Express Highway, Andheri East",
      "3 Mins to Gundavali / Western Express Highway Metro",
      "5 Mins to Andheri Railway Station & Hubtown SEZ",
      "8 Mins to Chhatrapati Shivaji Maharaj International Airport (T2)"
    ],
    "amenities": [
      "Temperature-Controlled Pool",
      "Designer Sky Clubhouse",
      "Cardio & Weight Training Gym",
      "Reflexology Walkway & Gardens",
      "Indoor Badminton & Games",
      "Kids Play Arena",
      "Executive Meeting Lounge",
      "24/7 Smart Security"
    ]
  },
  "23": {
    "keyFeatures": [
      "Near D.N. Nagar Metro Interchange, Andheri West",
      "2 Mins to Link Road & Juhu Circle",
      "5 Mins to Kokilaben Dhirubhai Ambani Hospital",
      "8 Mins to Versova Beach & Western Express Highway via JVLR"
    ],
    "amenities": [
      "Skyline Lap Pool",
      "Grand High-Ceiling Clubhouse",
      "State-of-the-Art Fitness Center",
      "Squash & Multi-Play Courts",
      "Landscaped Eco Decks",
      "Private Screening Cinema",
      "Children's Interactive Playground",
      "24/7 Valet Concierge"
    ]
  },
  "24": {
    "keyFeatures": [
      "Prime Andheri Corridor Location",
      "3 Mins to Western Metro Line & Highway Link",
      "6 Mins to International Airport & Commercial Hubs",
      "Proximity to Top International Schools & Hospitals"
    ],
    "amenities": [
      "Resort-Style Swimming Pool",
      "Clubhouse with Steam & Jacuzzi",
      "Modern Gymnasium",
      "Indoor Badminton Court",
      "Yoga & Meditation Green Lawn",
      "Kids Pool & Play Ground",
      "Banquet Hall",
      "24/7 CCTV Multi-Tier Security"
    ]
  },
  "25": {
    "keyFeatures": [
      "Andheri East Corridor near Metro Line 1",
      "5 Mins to Western Express Highway & Metro Station",
      "8 Mins to International Airport Terminal 2",
      "Proximity to MIDC & SEEPZ Commercial Hubs"
    ],
    "amenities": [
      "Swimming Pool with Lounge Deck",
      "Equipped Gymnasium",
      "Rooftop Landscaped Garden",
      "Indoor Games Room",
      "Kids Play Arena",
      "Grand Entrance Lobby",
      "Senior Citizen Sit-out Zone",
      "24/7 Security"
    ]
  },
  "26": {
    "keyFeatures": [
      "Strategic Location in Chakala / JB Nagar, Andheri",
      "2 Mins to Chakala Metro Station (Line 1)",
      "4 Mins to Western Express Highway & Solitaire Corporate Park",
      "7 Mins to Mumbai International Airport (T2)"
    ],
    "amenities": [
      "Rooftop Infinity Pool",
      "Sky Lounge with Panoramic Runway Views",
      "High-Tech Gymnasium",
      "Executive Business Pods & Boardroom",
      "Landscaped Sky Terraces",
      "Indoor Recreation Lounge",
      "24/7 High-Speed Elevators",
      "Biometric Access Security"
    ]
  },
  "27": {
    "keyFeatures": [
      "Prime Andheri West Corridor",
      "3 Mins to Metro Station & Link Road",
      "5 Mins to Juhu Circle & Kokilaben Hospital",
      "8 Mins to Andheri Railway Station"
    ],
    "amenities": [
      "Sky Swimming Pool",
      "Rooftop Fitness Pavilion",
      "Open-Air Sky Lounge",
      "Landscaped Podium Gardens",
      "Kids Play Space",
      "Indoor Games Arcade",
      "Grand Designer Lobby",
      "24/7 Security"
    ]
  },
  "28": {
    "keyFeatures": [
      "Prime Andheri West Location near S.V. Road",
      "3 Mins to Andheri Railway Station & Metro Interchange",
      "6 Mins to Western Express Highway & Juhu",
      "Surrounded by Top Educational & Healthcare Institutes"
    ],
    "amenities": [
      "Neoclassical Architecture Swimming Pool",
      "Luxury Hiranandani Clubhouse",
      "World-Class Gymnasium",
      "Squash & Badminton Courts",
      "Landscaped Roman Gardens",
      "Banquet & Ballrooms",
      "Children's Adventure Area",
      "24/7 Concierge"
    ]
  },
  "29": {
    "keyFeatures": [
      "Upper Juhu / D.N. Nagar Corridor, Andheri West",
      "2 Mins to D.N. Nagar Metro Station",
      "4 Mins to Kokilaben Dhirubhai Ambani Hospital",
      "6 Mins to Juhu Circle, PVR Dynamix & Juhu Beach"
    ],
    "amenities": [
      "Sky Infinity Pool overlooking Arabian Sea",
      "Exclusive Clubhouse with Spa",
      "Modern Fitness & Aerobics Center",
      "Squash Court & Indoor Sports",
      "Zen Meditation Garden",
      "Kids Fun Zone",
      "Double-Height Designer Lobby",
      "24/7 Valet Parking"
    ]
  },
  "30": {
    "keyFeatures": [
      "Andheri Prime Belt near S.V. Road & Metro",
      "3 Mins to Andheri Railway Station",
      "5 Mins to Western Express Highway",
      "7 Mins to International Airport"
    ],
    "amenities": [
      "Rooftop Lap Pool",
      "Thoughtful Clubhouse Spaces",
      "Advanced Gymnasium",
      "Sky Deck with City Views",
      "Children's Creative Play Park",
      "Indoor Games Zone",
      "Multipurpose Hall",
      "24/7 Concierge"
    ]
  },
  "31": {
    "keyFeatures": [
      "Prime Andheri West Belt near Link Road",
      "3 Mins to Metro Station & Retail Avenues",
      "6 Mins to Kokilaben Hospital & Juhu Circle",
      "Rapid connection to Western Express Highway via JVLR"
    ],
    "amenities": [
      "Signature Lodha Pool",
      "Art Deco Inspired Clubhouse",
      "Fitness Studio with Trainers",
      "Indoor Games Room",
      "Landscaped Gardens",
      "Banquet Facilities",
      "Children's Play Arena",
      "24/7 Lodha Services"
    ]
  },
  "32": {
    "keyFeatures": [
      "Andheri West Corridor near Link Road",
      "4 Mins to Metro Line 2A & D.N. Nagar Interchange",
      "6 Mins to Kokilaben Hospital & Lokhandwala",
      "10 Mins to Juhu Beach & Western Express Highway"
    ],
    "amenities": [
      "Luxury Lap Pool with Sunbeds",
      "High-End DLF Clubhouse",
      "Crossfit & Cardio Gym",
      "Private Screening Lounge",
      "Lush Landscaped Central Court",
      "Kids Play Arena",
      "Grand Double-Height Lobby",
      "24/7 Concierge"
    ]
  },
  "33": {
    "keyFeatures": [
      "Exclusive Pali Hill / Bandra West Location",
      "2 Mins to Bandra Promenade & Carter Road",
      "5 Mins to Bandra-Worli Sea Link & Linking Road",
      "10 Mins to BKC Financial District via Connector"
    ],
    "amenities": [
      "Private Infinity Pool",
      "Ultra-Luxury Bespoke Clubhouse",
      "Technogym Fitness Suite",
      "Private Screening Theatre",
      "Zen Sky Lounge overlooking Arabian Sea",
      "Fine Dining Banquet Room",
      "Dedicated Valet & Concierge",
      "Biometric Private Lift Lobby"
    ]
  },
  "34": {
    "keyFeatures": [
      "Prime Bandra West Corridor near Turner Road",
      "3 Mins to Bandra-Worli Sea Link",
      "5 Mins to Bandra Railway Station & S.V. Road",
      "Surrounded by Elite Cafes, Boutiques & Lilavati Hospital"
    ],
    "amenities": [
      "Neoclassical Rooftop Pool",
      "Hiranandani Luxury Club",
      "State-of-the-Art Gymnasium",
      "Landscaped Sky Terraces",
      "Private Meeting Suites",
      "Kids Play Area",
      "Grand Entrance Foyer",
      "24/7 White-Glove Concierge"
    ]
  },
  "35": {
    "keyFeatures": [
      "Directly at BKC Gateway, Bandra East",
      "2 Mins to Bandra Kurla Complex (BKC) Financial District",
      "3 Mins to Western Express Highway & BKC Connector",
      "5 Mins to Bandra-Worli Sea Link & Kalanagar Junction"
    ],
    "amenities": [
      "Rooftop Infinity Pool overlooking BKC Skyline",
      "Clubhouse Curated by GS",
      "High-Tech Gymnasium & Aerobics",
      "Squash & Badminton Courts",
      "Exclusive Cigar & Reading Lounge",
      "Private Screening Cinema",
      "Kids Play Arena",
      "24/7 Valet & Concierge"
    ]
  },
  "36": {
    "keyFeatures": [
      "Prestigious Mount Mary / Bandstand, Bandra West",
      "2 Mins to Taj Lands End & Bandra Fort",
      "4 Mins to Bandra-Worli Sea Link",
      "Panoramic Unobstructed Arabian Sea & Sunset Views"
    ],
    "amenities": [
      "Sea-Facing Infinity Pool",
      "Ultra-Luxury Private Clubhouse",
      "World-Class Fitness Studio",
      "Spa with Steam & Sauna",
      "Rooftop Stargazing Lounge",
      "Private Dining Room",
      "Children's Creche & Play Zone",
      "24/7 Dedicated Concierge"
    ]
  },
  "37": {
    "keyFeatures": [
      "Iconic Carter Road Promenade, Bandra West",
      "Direct Front-Row Arabian Sea Views",
      "4 Mins to Bandra-Worli Sea Link & Western Express Highway",
      "8 Mins to BKC via Kalanagar Flyover"
    ],
    "amenities": [
      "Seafront Olympic-Length Lap Pool",
      "Oberoi Signature Clubhouse",
      "Gymnasium with Personal Trainers",
      "Squash & Tennis Courts",
      "Lush Landscaped Green Lawns",
      "Private Wine & Dine Lounge",
      "Kids Activity Pod",
      "24/7 High-Security Protocols"
    ]
  },
  "38": {
    "keyFeatures": [
      "Prime Bandra West Corridor near Linking Road",
      "3 Mins to Bandra-Worli Sea Link",
      "5 Mins to Bandra Terminus & Western Express Highway",
      "10 Mins to BKC Financial Hub"
    ],
    "amenities": [
      "Luxury Lap Pool with Sunken Decks",
      "Grand Designer Clubhouse",
      "Modern Fitness & Yoga Studio",
      "Sky Deck with City Panorama",
      "Children's Creative Play Park",
      "Multipurpose Hall",
      "Double-Height Porte-Coch\u00e8re",
      "24/7 Valet Concierge"
    ]
  },
  "39": {
    "keyFeatures": [
      "Near Bandra Reclamation & Lilavati Hospital, Bandra West",
      "2 Mins to Bandra-Worli Sea Link Toll Plaza",
      "4 Mins to S.V. Road & Bandra Station",
      "7 Mins to BKC via Western Express Highway"
    ],
    "amenities": [
      "Rooftop Infinity Swimming Pool",
      "Boutique Luxury Clubhouse",
      "High-Tech Gymnasium",
      "Sky Lounge with Sea Views",
      "Children's Play Arena",
      "Indoor Games Lounge",
      "Designer Entrance Lobby",
      "24/7 Smart Security"
    ]
  },
  "40": {
    "keyFeatures": [
      "At Parkside / Worli-Lower Parel Junction",
      "Adjacent to High Street Phoenix & Phoenix Palladium Mall",
      "3 Mins to Upcoming Coastal Road & Worli Sea Face",
      "5 Mins to Lower Parel & Currey Road Railway Stations"
    ],
    "amenities": [
      "7 Swimming Pools including Olympic Lap Pool",
      "50,000 sq.ft Grand Clubhouse (The Jewel)",
      "7-Acre Private Park within Estate",
      "Evander Holyfield Boxing Ring",
      "Full-Size Cricket Pitch & Football Turf",
      "Luxury Spa by ESPA",
      "Private Screening Theatre",
      "24/7 Saint Amand Concierge"
    ]
  },
  "41": {
    "keyFeatures": [
      "Direct Frontage to Mahalaxmi Racecourse & Arabian Sea",
      "2 Mins to Mahalaxmi Railway Station & Monorail",
      "4 Mins to Mumbai Coastal Road Interchange",
      "6 Mins to Phoenix Palladium Mall & Lower Parel Business District"
    ],
    "amenities": [
      "Infinity Lap Pool overlooking Racecourse",
      "Grand 3-Level Luxury Clubhouse",
      "Spa with Jacuzzi & Sauna",
      "Modern Fitness Studio & Pilates",
      "Squash & Badminton Courts",
      "Private Screening Theatre",
      "Kids Creative Learning Center",
      "24/7 White-Glove Concierge"
    ]
  },
  "42": {
    "keyFeatures": [
      "Off Senapati Bapat Marg, Lower Parel / Byculla",
      "3 Mins to Lower Parel Commercial Hub (One World Center / Kamala Mills)",
      "5 Mins to Eastern Express Highway & Coastal Road",
      "6 Mins to Phoenix Palladium & High Street Phoenix"
    ],
    "amenities": [
      "Infinity Swimming Pool & Kids Pool",
      "Grand Double-Height Clubhouse",
      "World-Class Gymnasium & Aerobics",
      "Badminton & Squash Courts",
      "Spa with Treatment Rooms",
      "Private Banquet & Party Hall",
      "Children's Play Park",
      "24/7 Prestige Concierge"
    ]
  },
  "43": {
    "keyFeatures": [
      "Prime Lower Parel / Wadala Corridor with Monorail & Metro",
      "5 Mins to Eastern Freeway & Eastern Express Highway",
      "7 Mins to Lower Parel Business District & Phoenix Palladium",
      "10 Mins to BKC via Trans-Harbour Link / Freeway"
    ],
    "amenities": [
      "5-Tier Sky Lounge & Infinity Pool",
      "Grand 5-Storey Clubhouse",
      "State-of-the-Art Fitness Center",
      "Squash & Tennis Courts",
      "Lush Landscaped Sky Podiums",
      "Private Cineplex",
      "Kids Play World",
      "24/7 Biometric Multi-Tier Security"
    ]
  }
};

// Dedicated map of the highest quality full-building exterior facade photo for each project
export const BEST_COVER_FILES = {
  1: "3.jpg",              // Kalpataru Advay (Borivali W): 3 glowing high-rise towers in twilight
  2: "tower_facade.jpg",   // Lodha Altus (Borivali W): Full high-rise skyscraper tower from JLL
  3: "3.jpg",              // Oberoi Sky City (Borivali E): All 5 majestic towers in golden sunlight
  4: "cover.jpg",          // Chandak GreenAir (Borivali E): User twin towers sunset elevation
  5: "cover.jpg",          // Godrej Reserve (Kandivali E): Official multi-tower master render (user cover)
  6: "tower_facade.webp",  // Mahindra Vista (Kandivali E): All 4 high-rise towers from Mahindra Lifespaces
  7: "2.jpg",              // Godrej Bliss (Kandivali E): All 4 high-rise towers
  8: "1.jpg",              // Lodha Woods (Kandivali E): Wide estate building facade
  9: "cover.jpg",          // Naring Malad (Malad W): High-rise tower elevation render
  10: "3.jpg",             // Runwal Auris (Malad W): All 4 lit towers at dusk
  11: "cover.jpg",          // Lodha Malad (Malad W): High-rise dusk tower facade render
  12: "3.jpg",             // Enchante Point (Malad W): Full high-rise tower at night
  13: "cover.jpg",          // Naring Goregaon (Goregaon W): Full twin towers with commercial podium (user render)
  14: "1.jpg",             // Kalpataru Elara (Goregaon W): Grand high-rise towers overlooking city
  15: "cover.jpg",         // Kolte-Patil Goregaon (Goregaon W): Sunset skyline master elevation render
  16: "2.jpg",             // Rustomjee Goregaon (Goregaon W): 4-tower skyline (NOT swimming pool)
  17: "1.jpg",             // Lodha Sovrano (Jogeshwari W): Full high-rise towers with commercial podium
  18: "cover.jpg",         // Paradigm Downtown 102 (Jogeshwari W): Widescreen sunset master elevation render
  19: "cover.jpg",         // Roseworld (Jogeshwari W): Glowing skyscraper twin towers at sunset
  20: "cover.jpg",         // Sunteck City (Jogeshwari W): 4-tower daytime aerial master elevation render
  21: "cover.jpg",         // Godrej Skyshore (Versova): Widescreen aerial sunset master elevation facing Arabian sea
  22: "cover.jpg",         // Kalpataru Vian (Andheri E): Widescreen 3-tower master elevation render
  23: "cover.jpg",         // Adani Linkbay (Andheri W): Widescreen daylight master elevation render
  24: "2.jpg",             // Puravankara (Andheri): Full illuminated building at night
  25: "cover.jpg",         // Gurukrupa Realcon (Andheri E): Widescreen aerial master elevation overlooking highway & metro corridor
  26: "cover.jpg",         // Naman 58 (Andheri E): Widescreen aerial master elevation overlooking metro line
  27: "1.jpg",             // Kolte-Patil (Andheri): 2-tower lit exterior next to metro line
  28: "cover.jpg",         // Hiranandani (Andheri): Widescreen sunset architectural master elevation render
  29: "4.jpg",             // Bharat (Andheri W): Full corporate & residential high-rise complex
  30: "cover.jpg",         // Rustomjee (Andheri): Widescreen boulevard avenue master elevation render
  31: "cover.jpg",         // Lodha (Andheri): Widescreen sunset residential wings overlooking pool & sports court
  32: "1.jpg",             // DLF (Andheri): DLF residential towers
  33: "cover.jpg",         // Godrej (Bandra W): Waterfront luxury tower overlooking Bandra-Worli Sea Link
  34: "cover.jpg",         // Hiranandani (Bandra W): Widescreen sunset neoclassical skyscraper tower render
  35: "cover.jpg",         // Raymond (Bandra E): Widescreen master elevation render of full towers at dusk
  36: "cover.jpg",         // Sunteck (Bandra W): Widescreen sunset master elevation render with vertical sky-gardens
  37: "1.jpg",             // Oberoi Realty (Bandra W): Luxury towers overlooking greenery
  38: "tower_facade.jpg",  // Adani Ten BKC (Bandra BKC): Illuminated night exterior from Adani Realty (NOT swimming pool)
  39: "cover.jpg",         // DLH (Bandra W): Widescreen sunset master elevation render of skyscraper tower
  40: "1.jpg",             // Lodha Lower Parel (World Towers): Entire skyscraper tower (NOT woman in dress)
  41: "1.jpg",             // Piramal Mahalaxmi (Lower Parel): Iconic 3-tower luxury skyline overlooking racecourse
  42: "1.jpg",             // Prestige Jasdan Classic (Lower Parel): Twin towers rising over city (NOT bedroom)
  43: "3.jpg"              // Godrej Lower Parel (Lower Parel): Multi-tower master elevation (NOT balcony edge)
};

// Map each project's total photo count in public/project_photos/
export const PROJECT_PHOTO_COUNTS = {
  1: 3, 2: 4, 3: 3, 4: 3, 5: 8,
  6: 4, 7: 3, 8: 3, 9: 3, 10: 3,
  11: 2, 12: 4, 13: 3, 14: 4, 15: 4,
  16: 3, 17: 4, 18: 3, 19: 3, 20: 3,
  21: 4, 22: 5, 23: 3, 24: 3, 25: 3,
  26: 5, 27: 3, 28: 3, 29: 4, 30: 3,
  31: 4, 32: 3, 33: 2, 34: 3, 35: 2,
  36: 3, 37: 3, 38: 4, 39: 3, 40: 5,
  41: 3, 42: 3, 43: 3
};

PROJECTS_DATA.forEach(p => {
  const enrich = PROJECT_ENRICHMENTS[p.id];
  if (enrich) {
    p.keyFeatures = enrich.keyFeatures || [];
    if (enrich.amenities) p.amenities = enrich.amenities;
  }

  const folder = PROJECT_FOLDERS[p.id] || `${p.id} - ${p.name}`;
  p.folder = folder;
  p.fallbackCover = p.coverImage;

  const bestCover = BEST_COVER_FILES[p.id] || '1.jpg';
  p.coverImage = `/project_photos/${encodeURIComponent(folder)}/${bestCover}`;

  // Assemble full photo gallery with best exterior facade as 1st photo
  const count = PROJECT_PHOTO_COUNTS[p.id] || 3;
  const otherImages = [];
  // For custom projects, customize gallery order to exclude unwanted images
  let photoOrder;
  if (p.id === 4) {
    // Chandak GreenAir: cover.jpg, then new aerial view (3.jpg), followed by 1.jpg & 2.jpg
    photoOrder = [3, 1, 2];
  } else if (p.id === 5) {
    photoOrder = [6, 7, 8, 3, 4, 5];
  } else if (p.id === 7) {
    // Godrej Bliss: exclude watermarked pool photo (3.jpg), keep 1, 2 (cover), 4
    photoOrder = [1, 4];
  } else if (p.id === 8) {
    // Lodha Woods: gallery has image 1 (cover), newly inserted image 2 (tower facade), and image 4
    photoOrder = [1, 2, 4];
  } else if (p.id === 11) {
    // Lodha Malad: exclude European brick buildings (3.jpg & 4.jpg), keep 1 and 2
    photoOrder = [1, 2];
  } else if (p.id === 12) {
    // Enchante Point: exclude commercial glass building (4.jpg), keep 1, 2, and 5
    photoOrder = [1, 2, 5];
  } else if (p.id === 15) {
    // Kolte-Patil Goregaon: gallery has newly added high-res facade render (4.jpg), followed by 2.jpg & 3.jpg
    photoOrder = [4, 2, 3];
  } else if (p.id === 17) {
    // Lodha Sovrano: 1 (cover tower), 2 (tower facade), 3 (treehouse bridge), 4 (lawn & palm grove)
    photoOrder = [1, 2, 3, 4];
  } else if (p.id === 18) {
    // Paradigm Downtown 102: cover (sunset master render), 1 (tower elevation), 2 (facade render)
    photoOrder = [1, 2];
  } else if (p.id === 19) {
    // Roseworld: cover (HD glowing twin towers at sunset), 1 (facade), 2 (amenities)
    photoOrder = [1, 2];
  } else if (p.id === 20) {
    // Sunteck City: cover (4-tower daylight render), 4 (night tower facade), 2 (amenities)
    photoOrder = [4, 2];
  } else if (p.id === 21) {
    // Godrej Skyshore: cover (widescreen sunset over Arabian sea), 1 (tower elevation), 2, 3
    photoOrder = [1, 2, 3];
  } else if (p.id === 22) {
    // Kalpataru Vian: cover (widescreen master render), 1 (tower facade), 2, 3, 4
    photoOrder = [1, 2, 3, 4];
  } else if (p.id === 23) {
    // Adani Linkbay: cover (widescreen master render), 2 (tower elevation), 3
    photoOrder = [2, 3];
  } else if (p.id === 25) {
    // Gurukrupa Realcon: exclude purple gift box (3.jpg), keep 1 and 2
    photoOrder = [1, 2];
  } else if (p.id === 26) {
    // Naman 58: cover (widescreen aerial view over metro line), 2, 3, 4, 1
    photoOrder = [2, 3, 4, 1];
  } else if (p.id === 28) {
    // Hiranandani Andheri: exclude black & white photo (3.jpg), keep 1 and 2
    photoOrder = [1, 2];
  } else if (p.id === 30) {
    // Rustomjee Andheri: cover (widescreen master render), 2 (twilight tower), 1 (tower elevation), 3
    photoOrder = [2, 1, 3];
  } else if (p.id === 31) {
    // Lodha Andheri: cover (sunset wings overlooking pool), 1 (tower facade), 2, 3
    photoOrder = [1, 2, 3];
  } else if (p.id === 33) {
    // Godrej Pali Hill / Bandra West: cover (waterfront tower facing Sea Link), 2 (coastline aerial)
    photoOrder = [2];
  } else if (p.id === 34) {
    // Hiranandani Bandra: cover (sunset master render), 1 (tower facade), 2 (interiors)
    photoOrder = [1, 2];
  } else if (p.id === 35) {
    // Raymond Bandra East: cover (widescreen master elevation render), 2 (balcony deck & luxury living room)
    photoOrder = [2];
  } else if (p.id === 36) {
    // Sunteck Bandra West: cover (sunset sky-gardens render), 2 (daylight tower render), 3
    photoOrder = [2, 3];
  } else if (p.id === 39) {
    // DLH Bandra West: cover (sunset master render), 1 (tower elevation), 2 (facade)
    photoOrder = [1, 2];
  } else {
    photoOrder = Array.from({ length: count }, (_, idx) => idx + 1);
  }

  for (const i of photoOrder) {
    const fileName = `${i}.jpg`;
    if (fileName !== bestCover) {
      otherImages.push(`/project_photos/${encodeURIComponent(folder)}/${fileName}`);
    }
  }
  p.images = [p.coverImage, ...otherImages];
});

