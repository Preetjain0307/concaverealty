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
    coverImage: "/project_photos/40%20-%20Lodha%20(Lower%20Parel)/1.jpg",
    images: [
      "/project_photos/40%20-%20Lodha%20(Lower%20Parel)/1.jpg",
      "/project_photos/40%20-%20Lodha%20(Lower%20Parel)/2.jpg"
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
      "/projects/project_img_66.jpg"
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
    coverImage: null,
    images: [],
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
    keyHighlight: "Metro 2A, Link Road & National Park proximity",
    lat: 19.2307,
    lng: 72.8567,
    zoom: 14,
    pincode: "400091 / 400066",
    corridors: "Metro Lines 2A & 7, New Link Road, WEH",
    landmarks: ["Sanjay Gandhi National Park", "Don Bosco High School", "Borivali West & Devipada Metro", "Gorai Creek Seafront"]
  },
  {
    name: "Kandivali",
    tagline: "Godrej Reserve & Mahindra Vista Green Living",
    activeListings: 4,
    badge: "Fast Growing",
    keyHighlight: "Western Express Highway & Lokhandwala Township",
    lat: 19.2045,
    lng: 72.8522,
    zoom: 14,
    pincode: "400101 / 400067",
    corridors: "Metro Line 7, Akurli Road, Western Express Highway",
    landmarks: ["Lokhandwala Complex", "Growel's 101 Mall", "Cambridge School", "Mahindra & Mahindra Hub"]
  },
  {
    name: "Malad",
    tagline: "Runwal, Lodha & Enchante Point Residences",
    activeListings: 4,
    badge: "High Demand",
    keyHighlight: "Inorbit Mall, Mindspace & Link Road Hub",
    lat: 19.1860,
    lng: 72.8485,
    zoom: 14,
    pincode: "400064 / 400097",
    corridors: "Metro Line 2A, New Link Road, S.V. Road",
    landmarks: ["Inorbit Mall Malad", "Mindspace Commercial District", "Infiniti Mall Malad", "Zenith Hospital"]
  },
  {
    name: "Goregaon",
    tagline: "Kalpataru Elara & Rustomjee Signature Towers",
    activeListings: 4,
    badge: "Prime Central",
    keyHighlight: "Hub of Western Suburbs, Oberoi Mall & Metro",
    lat: 19.1645,
    lng: 72.8490,
    zoom: 14,
    pincode: "400104 / 400063",
    corridors: "Metro Lines 2A & 7, WEH, Mrinal Gore Flyover",
    landmarks: ["Oberoi Mall", "Nesco Exhibition Centre", "Bangur Nagar Metro", "Film City & Aarey Canopy"]
  },
  {
    name: "Jogeshwari",
    tagline: "Lodha Sovrano & Paradigm Downtown 102",
    activeListings: 4,
    badge: "Emerging Value",
    keyHighlight: "JVLR Connectivity & SV Road Corridor",
    lat: 19.1380,
    lng: 72.8495,
    zoom: 14,
    pincode: "400102 / 400060",
    corridors: "Jogeshwari-Vikhroli Link Road (JVLR), S.V. Road, WEH",
    landmarks: ["JVLR Junction", "Oshiwara Metro", "Millat Hospital", "Hub Mall & SEEPZ Link"]
  },
  {
    name: "Andheri",
    tagline: "Godrej Skyshore (Versova) & Kalpataru Vian",
    activeListings: 12,
    badge: "Ultra Luxury",
    keyHighlight: "Versova Seafront, Metro 1 & Coastal Road Link",
    lat: 19.1197,
    lng: 72.8468,
    zoom: 14,
    pincode: "400053 / 400058 / 400069",
    corridors: "Metro Lines 1, 2A & 7 Triple Grid, WEH, Versova Promenade",
    landmarks: ["Versova Beach Promenade", "Kokilaben Dhirubhai Ambani Hospital", "CSM International Airport", "D.N. Nagar Interchange"]
  },
  {
    name: "Bandra",
    tagline: "Heritage Luxury & Celebrity Seafront",
    activeListings: 7,
    badge: "Elite",
    keyHighlight: "Queen of Suburbs, Sea Face & Fine Dining",
    lat: 19.0596,
    lng: 72.8295,
    zoom: 14,
    pincode: "400050 / 400051",
    corridors: "Bandra-Worli Sea Link, Coastal Road, Aqua Line 3 Metro",
    landmarks: ["Bandstand & Carter Road Seafront", "Bandra Kurla Complex (BKC)", "Mount Mary Basilica", "Pali Hill Club"]
  },
  {
    name: "Lower Parel",
    tagline: "Commercial Skyscrapers & Sky Mansions",
    activeListings: 4,
    badge: "Downtown",
    keyHighlight: "High Street Phoenix & Financial Center",
    lat: 18.9982,
    lng: 72.8292,
    zoom: 14,
    pincode: "400013",
    corridors: "Mumbai Coastal Road, Senapati Bapat Marg, Eastern Freeway",
    landmarks: ["High Street Phoenix & Palladium Mall", "World One Towers", "Peninsula Corporate Park", "St. Regis Mumbai"]
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
      "3 Mins to Borivali West Metro Station (Line 2A)",
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
      "150m Direct Ramp Access to Western Express Highway",
      "3 Mins to Magathane Metro Station (Line 7)",
      "7 Mins to Borivali Railway Station & S.V. Road",
      "Adjacent to 25,000-Acre Sanjay Gandhi National Park Greens"
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
      "Zero-Minute Access to Western Express Highway Service Road",
      "1 Min Direct Skywalk to Devipada Metro Station (Line 7)",
      "Direct Integrated Walkway to Sky City Mall & Multiplex",
      "6 Mins to Borivali Railway Station & Oberoi International School"
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
      "250m to Western Express Highway via Kulupwadi Road",
      "3 Mins to Rashtriya Udyan (National Park) Metro Station",
      "5 Mins to Borivali Railway Station (East) & Local Markets",
      "Bordering Main Sanjay Gandhi National Park Entrance & Nature Trail"
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
      "Direct access on Akurli Road, Kandivali East",
      "3 Mins to Akurli Metro Station & Western Express Highway",
      "5 Mins to Kandivali Railway Station & Growel's 101 Mall",
      "Flanked by 100+ Acres of Protected Reserve Forest & Cambridge School"
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
      "Directly at Mahindra Yellow Gate on Akurli Road, Kandivali East",
      "2 Mins to Western Express Highway & Akurli Metro Station (Line 7)",
      "4 Mins to Growel's 101 Mall & PVR Multiplex",
      "5 Mins to Kandivali Railway Station & S.V. Road"
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
      "Prime address in Lokhandwala Township, Kandivali East",
      "3 Mins to Poisar Metro Station (Line 7) & WEH Junction",
      "4 Mins to Lokhandwala Foundation School & Central Park",
      "8 Mins to Kandivali Railway Station & Thakur Village Hub"
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
      "150m off Western Express Highway, Kandivali East",
      "3 Mins to Poisar Metro Station (Line 7)",
      "Surrounded by 25,000 Acres of National Park Forest Canopy",
      "5 Mins to Thakur Village High Street, D-Mart & Growel's 101 Mall"
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
      "Located on New Link Road Corridor near Mith Chowki, Malad West",
      "3 Mins to Malad West Metro Station (Line 2A)",
      "6 Mins to Malad Railway Station & S.V. Road",
      "4 Mins to Inorbit Mall, Mindspace IT Park & Zenith Hospital"
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
      "Adjacent to Inorbit Mall & Mindspace, Malad West",
      "2 Mins to Lower Malad Metro Station (Line 2A)",
      "6 Mins to Malad Railway Station via S.V. Road",
      "4 Mins to Mindspace IT & Commercial SEZ & Infiniti Mall Malad"
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
      "Prime frontage on New Link Road near Chincholi Bunder, Malad West",
      "3 Mins to Valnai - Meeth Chowki Metro Station (Line 2A)",
      "5 Mins to Malad Railway Station & S.V. Road",
      "4 Mins to Infiniti Mall Malad, Uncle Kitchens & Inorbit Mall"
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
      "Off S.V. Road & Link Road near Sundar Nagar, Malad West",
      "3 Mins to Malad Railway Station (West)",
      "5 Mins to Malad West Metro Station (Line 2A)",
      "Near Sundar Nagar Garden, Ryan International School & Surana Hospital"
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
      "Located on New Link Road Corridor near Bangur Nagar, Goregaon West",
      "3 Mins to Bangur Nagar Metro Station (Line 2A)",
      "5 Mins to Inorbit Mall Goregaon & City Centre Mall",
      "6 Mins to Goregaon Railway Station & WEH via Mrinal Gore Flyover"
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
      "Near Bangur Nagar & Inorbit Mall, Goregaon West",
      "2 Mins to Bangur Nagar Metro Station (Line 2A)",
      "5 Mins to Goregaon Railway Station & S.V. Road",
      "4 Mins to Inorbit Mall, Vibgyor High School & Bangur Nagar Sports Complex"
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
      "New Link Road Corridor, Goregaon West",
      "3 Mins to Goregaon West (Pahadi Goregaon) Metro Station (Line 2A)",
      "4 Mins to Ram Mandir Suburban Railway Station",
      "6 Mins to Nesco IT Park, Exhibition Centre & Inorbit Mall"
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
      "S.V. Road & Link Road Intersect, Goregaon West",
      "3 Mins to Goregaon Railway Station (Harbour & Western Lines)",
      "4 Mins to Goregaon West Metro Station (Line 2A)",
      "Near Topiwala Multiplex, Patkar Varde College & Siddharth Hospital"
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
      "Near S.V. Road & Behram Baug, Jogeshwari West",
      "3 Mins to Oshiwara Metro Station (Line 2A)",
      "4 Mins to Jogeshwari Suburban Railway Station",
      "Near Millat Superspeciality Hospital, JVLR & Lokhandwala Complex Link"
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
      "Direct Frontage on Main S.V. Road, Jogeshwari West",
      "2 Mins to Oshiwara / Jogeshwari West Metro Station (Line 2A)",
      "3 Mins to Jogeshwari Railway Station",
      "4 Mins to JVLR Flyover, Western Express Highway & Hub Mall"
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
      "Jogeshwari West Corridor near Oshiwara Bridge",
      "3 Mins to Oshiwara Metro Station (Line 2A)",
      "4 Mins to Ram Mandir Railway Station",
      "Near Mega Mall Oshiwara, Lokhandwala Market & JVLR Junction"
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
      "At JVLR Junction & Western Express Highway, Jogeshwari East",
      "2 Mins to JVLR Metro Station (Line 7)",
      "3 Mins to Jogeshwari Railway Station (East)",
      "Direct access to SEEPZ IT Zone, Nesco IT Park & Oberoi Commerz"
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
      "Direct Seafront Position on Yari Road, Versova, Andheri West",
      "3 Mins to Versova Metro Station (Line 1)",
      "5 Mins to Versova Beach Promenade & Nana Nani Park",
      "Direct access to upcoming Versova-Bandra Coastal Sea Link & Juhu Circle"
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
      "100m Ramp Access to Western Express Highway, Andheri East",
      "2 Mins to Gundavali (Line 7) & WEH (Line 1) Metro Interchange",
      "3 Mins to Andheri Railway Station (East) & Hubtown SEZ",
      "7 Mins to Chhatrapati Shivaji Maharaj International Airport (T2)"
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
      "Adjacent to D.N. Nagar Metro Interchange (Lines 1 & 2A), Andheri West",
      "2 Mins to New Link Road & Juhu Circle",
      "4 Mins to Kokilaben Dhirubhai Ambani Hospital & Research Institute",
      "5 Mins to Andheri Railway Station, Bhavan's College & The Club Mumbai"
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
      "Central Andheri West Corridor on S.V. Road",
      "3 Mins to Andheri Metro Station (Line 1)",
      "3 Mins to Andheri Railway Station (Harbour & Western Lines)",
      "Near Shoppers Stop Andheri, Gilbert Hill Heritage & Nadco Market"
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
      "Andheri-Kurla Road Corridor, Chakala, Andheri East",
      "2 Mins to Chakala (J.B. Nagar) Metro Station (Line 1)",
      "4 Mins to Western Express Highway & Solitaire Corporate Park",
      "6 Mins to CSM International Airport (T2) & ITC Maratha"
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
      "Chakala Central Commercial Belt, Andheri East",
      "3 Mins to Western Express Highway Metro Station (Line 1)",
      "4 Mins to Andheri Railway Station (East)",
      "5 Mins to CSM International Airport (T2) & Courtyard by Marriott"
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
      "Lallubhai Park Residential Enclave, Andheri West",
      "3 Mins to Azad Nagar Metro Station (Line 1)",
      "4 Mins to Andheri Railway Station (West)",
      "Adjacent to Lallubhai Park, Prime Hospital & Bhavan's Campus"
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
      "Veera Desai Road Luxury Corridor, Andheri West",
      "4 Mins to D.N. Nagar Metro Interchange (Lines 1 & 2A)",
      "5 Mins to Andheri Railway Station & New Link Road",
      "Near The Country Club, Yash Raj Films Studio & Kokilaben Hospital"
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
      "Lokhandwala Complex Back Road, Andheri West",
      "3 Mins to Adarsh Nagar / Oshiwara Metro Station (Line 2A)",
      "3 Mins to Lokhandwala High Street Market & Celebration Sports Club",
      "5 Mins to Infiniti Mall Andheri, PVR Dynamix & Juhu Circle"
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
      "Four Bungalows Residential Belt, Andheri West",
      "3 Mins to D.N. Nagar Metro Station (Lines 1 & 2A)",
      "5 Mins to Andheri Railway Station & Western Express Highway",
      "Near Four Bungalows Market, Rustomjee Cambridge School & Kokilaben Hospital"
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
      "Upper Link Road near Adarsh Nagar Junction, Andheri West",
      "2 Mins to Adarsh Nagar Metro Station (Line 2A)",
      "4 Mins to Infiniti Mall Andheri & Citi Mall",
      "5 Mins to Jogeshwari Railway Station & JVLR Connector"
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
      "Direct Frontage on Oshiwara Link Road, Andheri West",
      "2 Mins to Oshiwara Metro Station (Line 2A)",
      "4 Mins to Ram Mandir Railway Station",
      "Near Mega Mall Oshiwara, Laxmi Industrial Estate & Star Bazaar"
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
      "Elite Sanctuary on Nargis Dutt Road, Pali Hill, Bandra West",
      "3 Mins to Bandra Colony Metro Station (Aqua Line 3 Underground)",
      "4 Mins to Bandra-Worli Sea Link & Coastal Road Ramp",
      "Near Pali Hill Club, Candies, Olive Bar & Kitchen & Carter Road Seafront"
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
      "Corner of Turner Road & Perry Cross Road, Bandra West",
      "3 Mins to Bandra Colony Metro Station (Aqua Line 3)",
      "4 Mins to Bandra Railway Station (West)",
      "Near Turner Road Boutiques, Carter Road Seafront Promenade & Otters Club"
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
      "Direct Gateway to Bandra Kurla Complex (BKC), Bandra East",
      "2 Mins to BKC Underground Metro Station (Aqua Line 3 & Line 2B)",
      "3 Mins to Bandra Terminus & Western Express Highway Kalanagar Flyover",
      "Near Jio World Centre, US Consulate, MCA Club & Trident BKC"
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
      "Mount Mary Hill & Bandstand Promenade, Bandra West",
      "2 Mins to Bandra-Worli Sea Link Toll Plaza",
      "Near Mount Mary Basilica, Taj Lands End & Bandstand Sea Promenade",
      "Panoramic Unobstructed Views of Arabian Sea Horizons & Sunsets"
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
      "Direct Front-Row Facing on Carter Road Seafront Promenade, Bandra West",
      "3 Mins to Khar Underground Metro Station & Khar Road Station",
      "5 Mins to Bandra-Worli Sea Link & Western Express Highway",
      "Adjacent to Otters Club, Union Park & Joggers Park"
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
      "Hill Road & St. Martin's Cross, Bandra West",
      "3 Mins to Bandra Underground Metro (Aqua Line 3)",
      "3 Mins to Bandra Railway Station (West)",
      "Near Holy Family Hospital, Elco Market Hill Road & Bandra Fort"
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
      "Waterfield Road & Linking Road Corridor, Bandra West Prime",
      "3 Mins to Bandra Underground Metro Station (Aqua Line 3)",
      "3 Mins to Bandra Railway Station & Western Express Highway",
      "Near Linking Road Shopping Boulevard, Taj Mahal Tea House & Pali Naka"
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
      "Parkside on Senapati Bapat Marg, Lower Parel",
      "3 Mins to Science Centre / Worli Metro Station (Aqua Line 3)",
      "4 Mins to Lower Parel Station (Western Line) & Currey Road Station (Central Line)",
      "Adjacent to High Street Phoenix, Palladium Mall & The St. Regis Mumbai"
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
      "Lower Parel Commercial Boulevard opposite Peninsula Corporate Park",
      "2 Mins to Acharya Atre Chowk / Lower Parel Metro Station (Aqua Line 3)",
      "3 Mins to Lower Parel & Currey Road Railway Stations",
      "Near Peninsula Corporate Park, Kamala Mills Dining Hub & One World Center"
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
      "Off Senapati Bapat Marg near One International Centre, Lower Parel",
      "3 Mins to Worli / Science Centre Metro Station (Aqua Line 3)",
      "4 Mins to Lower Parel Railway Station & Mumbai Coastal Road Worli Ramp",
      "Near One International Centre, Four Seasons Hotel & ITC Grand Central"
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
      "Lower Parel Midtown Corridor near Marathon Futurex",
      "2 Mins to Lower Parel Monorail & Currey Road Metro Link",
      "3 Mins to Lower Parel Suburban Station & Currey Road Station",
      "Near Marathon Futurex IT Park, Lodha Excelus, Urmi Estate & Coastal Road"
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
  40: "1.jpg",             // Lodha Lower Parel (World Towers / Parkside): Iconic triple high-rise towers overlooking bay & parkland
  41: "1.jpg",             // Piramal Mahalaxmi (Lower Parel): Iconic 3-tower luxury skyline overlooking racecourse
  42: "1.jpg"              // Prestige Jasdan Classic (Lower Parel): Twin towers rising over city (NOT bedroom)
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
  36: 3, 37: 3, 38: 4, 39: 3, 40: 2,
  41: 3, 42: 2, 43: 0
};

PROJECTS_DATA.forEach(p => {
  const enrich = PROJECT_ENRICHMENTS[p.id];
  if (enrich) {
    p.keyFeatures = enrich.keyFeatures || [];
    if (enrich.amenities) p.amenities = enrich.amenities;
  }

  const folder = PROJECT_FOLDERS[p.id] || `${p.id} - ${p.name}`;
  p.folder = folder;

  // Project 43 (Godrej Lower Parel): Photos explicitly removed as requested
  if (p.id === 43) {
    p.coverImage = null;
    p.images = [];
    p.fallbackCover = null;
    return;
  }

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

// =========================================================================
// PRECISE GPS COORDINATES, POSTAL ADDRESSES & TRANSIT CONNECTIVITY MATRIX
// Accurate latitude/longitude coordinates & verified distances for Mumbai developments
// =========================================================================
export const LOCATION_COORDINATES = {
  "Borivali": { lat: 19.2307, lng: 72.8567, zoom: 14, pincode: "400091", metro: "Line 2A & Line 7 Interchange", highway: "Western Express Highway" },
  "Kandivali": { lat: 19.2045, lng: 72.8522, zoom: 14, pincode: "400101", metro: "Line 7 Poisar / Akurli", highway: "WEH & Akurli Road" },
  "Malad": { lat: 19.1860, lng: 72.8485, zoom: 14, pincode: "400064", metro: "Line 2A Malad West & Valnai", highway: "New Link Road & WEH" },
  "Goregaon": { lat: 19.1645, lng: 72.8490, zoom: 14, pincode: "400104", metro: "Line 2A Bangur Nagar & Line 7 Aarey", highway: "WEH & JVLR" },
  "Jogeshwari": { lat: 19.1380, lng: 72.8495, zoom: 14, pincode: "400102", metro: "Line 2A Oshiwara & Line 7 JVLR", highway: "JVLR & S.V. Road" },
  "Andheri": { lat: 19.1197, lng: 72.8468, zoom: 14, pincode: "400053", metro: "Line 1, 2A & 7 Triple Grid", highway: "WEH & Coastal Link" },
  "Bandra": { lat: 19.0596, lng: 72.8295, zoom: 14, pincode: "400050", metro: "Aqua Line 3 (BKC Underground)", highway: "Bandra-Worli Sea Link & Coastal Road" },
  "Lower Parel": { lat: 18.9982, lng: 72.8292, zoom: 14, pincode: "400013", metro: "Aqua Line 3 (Science Centre/Worli)", highway: "Mumbai Coastal Road & Eastern Freeway" }
};

export const PROJECT_COORDINATES = {
  1: {
    lat: 19.2315, lng: 72.8436, pincode: "400091",
    address: "Jairaj Nagar, New Link Road, Borivali West, Mumbai — 400091",
    metro: "Borivali West Metro Station (Line 2A) — 300m (3 mins walk)",
    railway: "Borivali Suburban Railway Station (West) — 1.8 km (7 mins drive)",
    highway: "New Link Road (Direct Frontage) & WEH via Shimpoli — 2.2 km (7 mins)",
    airport: "CSM International Airport (T2) — 18 km (32 mins)",
    landmark: "Don Bosco High School (400m), Vazira Naka (550m) & Kora Kendra (1.2 km)"
  },
  2: {
    lat: 19.2244, lng: 72.8622, pincode: "400066",
    address: "Off Western Express Highway, Magathane, Borivali East, Mumbai — 400066",
    metro: "Magathane Metro Station (Line 7) — 350m (4 mins walk)",
    railway: "Borivali Railway Station (East) — 1.8 km (7 mins)",
    highway: "Western Express Highway (WEH) — 150m (Direct Ramp Access)",
    airport: "CSM International Airport (BOM) — 16.5 km (28 mins)",
    landmark: "Sanjay Gandhi National Park (1.1 km), Tata Power Center & Magathane Flyover"
  },
  3: {
    lat: 19.2198, lng: 72.8637, pincode: "400066",
    address: "Western Express Highway, Devipada, Borivali East, Mumbai — 400066",
    metro: "Devipada Metro Station (Line 7) — 100m (Direct Integrated Skywalk / 1 min)",
    railway: "Borivali Railway Station (East) — 1.6 km (6 mins)",
    highway: "Western Express Highway (WEH) — 0 km (Direct WEH Service Road Frontage)",
    airport: "CSM International Airport (BOM) — 16.0 km (25 mins)",
    landmark: "Sky City Mall (On-Campus), Oberoi International School & SGNP Forest Views"
  },
  4: {
    lat: 19.2285, lng: 72.8675, pincode: "400066",
    address: "Near SGNP Main Gate, Kulupwadi, Borivali East, Mumbai — 400066",
    metro: "Rashtriya Udyan (National Park) Metro Station (Line 7) — 350m (4 mins walk)",
    railway: "Borivali Railway Station (East) — 1.3 km (5 mins)",
    highway: "Western Express Highway (WEH) — 250m (1 min drive)",
    airport: "CSM International Airport (BOM) — 17.0 km (30 mins)",
    landmark: "Sanjay Gandhi National Park Main Entrance (250m) & Abhinav Nagar"
  },
  5: {
    lat: 19.2082, lng: 72.8685, pincode: "400101",
    address: "Akurli Road, Opp Mahindra, Kandivali East, Mumbai — 400101",
    metro: "Akurli Metro Station (Line 7) — 300m (3 mins walk)",
    railway: "Kandivali Railway Station (East) — 1.2 km (5 mins)",
    highway: "Western Express Highway (WEH) — 400m (2 mins)",
    airport: "CSM International Airport (BOM) — 14.5 km (25 mins)",
    landmark: "Growel's 101 Mall (450m), Cambridge School (500m) & Akurli Crossroad"
  },
  6: {
    lat: 19.2054, lng: 72.8667, pincode: "400101",
    address: "Akurli Road, Near WEH Junction, Kandivali East, Mumbai — 400101",
    metro: "Akurli Metro Station (Line 7) — 350m (3 mins walk)",
    railway: "Kandivali Railway Station (East) — 1.3 km (5 mins)",
    highway: "Western Express Highway (WEH) — 200m (1 min)",
    airport: "CSM International Airport (BOM) — 14.2 km (24 mins)",
    landmark: "Mahindra & Mahindra Compound Gate, Growel's 101 Mall & Lokhandwala Complex"
  },
  7: {
    lat: 19.2031, lng: 72.8715, pincode: "400101",
    address: "Lokhandwala Township, Kandivali East, Mumbai — 400101",
    metro: "Poisar Metro Station (Line 7) — 900m (3 mins drive / 10 mins walk)",
    railway: "Kandivali Railway Station (East) — 2.2 km (8 mins)",
    highway: "Western Express Highway (WEH) — 1.1 km (3 mins)",
    airport: "CSM International Airport (BOM) — 15.0 km (26 mins)",
    landmark: "Lokhandwala Foundation School (200m), Whispering Palms & Central Park"
  },
  8: {
    lat: 19.2115, lng: 72.8655, pincode: "400101",
    address: "Off Western Express Highway, Thakur Village Corridor, Kandivali East, Mumbai — 400101",
    metro: "Poisar Metro Station (Line 7) — 400m (4 mins walk)",
    railway: "Kandivali Railway Station (East) — 1.6 km (6 mins)",
    highway: "Western Express Highway (WEH) — 150m (1 min)",
    airport: "CSM International Airport (BOM) — 14.8 km (25 mins)",
    landmark: "Sanjay Gandhi National Park Border, D-Mart (300m) & Thakur Public School"
  },
  9: {
    lat: 19.1832, lng: 72.8365, pincode: "400064",
    address: "New Link Road Corridor, Near Mith Chowki, Malad West, Mumbai — 400064",
    metro: "Malad West Metro Station (Line 2A) — 350m (3 mins walk)",
    railway: "Malad Railway Station (West) — 1.5 km (6 mins)",
    highway: "New Link Road (Direct) & WEH via Chincholi Flyover — 2.1 km (7 mins)",
    airport: "CSM International Airport (BOM) — 13.2 km (24 mins)",
    landmark: "Inorbit Mall (700m), Mindspace IT Park (850m) & Zenith Hospital"
  },
  10: {
    lat: 19.1764, lng: 72.8342, pincode: "400064",
    address: "Near Inorbit Mall & Mindspace, Malad West, Mumbai — 400064",
    metro: "Lower Malad Metro Station (Line 2A) — 250m (2 mins walk)",
    railway: "Malad Railway Station (West) — 1.6 km (6 mins)",
    highway: "Malad-Goregaon Link Road & WEH — 1.8 km (5 mins)",
    airport: "CSM International Airport (BOM) — 12.8 km (22 mins)",
    landmark: "Inorbit Mall (250m), Hypercity, Mindspace Commercial Zone & Infiniti Mall (1 km)"
  },
  11: {
    lat: 19.1865, lng: 72.8358, pincode: "400064",
    address: "Link Road, Near Chincholi Bunder, Malad West, Mumbai — 400064",
    metro: "Valnai - Meeth Chowki Metro Station (Line 2A) — 350m (4 mins walk)",
    railway: "Malad Railway Station (West) — 1.4 km (5 mins)",
    highway: "Western Express Highway via Chincholi Underpass — 2.0 km (6 mins)",
    airport: "CSM International Airport (BOM) — 13.5 km (24 mins)",
    landmark: "Infiniti Mall Malad (450m), Uncle Kitchens, S.V. Road (650m)"
  },
  12: {
    lat: 19.1895, lng: 72.8442, pincode: "400064",
    address: "Off S.V. Road, Near Sundar Nagar, Malad West, Mumbai — 400064",
    metro: "Malad West Metro Station (Line 2A) — 550m (5 mins)",
    railway: "Malad Railway Station (West) — 700m (3 mins drive / 7 mins walk)",
    highway: "Main S.V. Road (100m) & WEH via Malad Subway — 1.4 km (5 mins)",
    airport: "CSM International Airport (BOM) — 13.0 km (22 mins)",
    landmark: "Sundar Nagar Garden (150m), Ryan International School (450m) & Surana Hospital"
  },
  13: {
    lat: 19.1678, lng: 72.8375, pincode: "400104",
    address: "Link Road Corridor, Near Bangur Nagar, Goregaon West, Mumbai — 400104",
    metro: "Bangur Nagar Metro Station (Line 2A) — 300m (3 mins walk)",
    railway: "Goregaon Railway Station (West) — 1.4 km (6 mins)",
    highway: "Western Express Highway via Mrinal Gore Flyover — 1.8 km (5 mins)",
    airport: "CSM International Airport (BOM) — 11.2 km (20 mins)",
    landmark: "Inorbit Mall Goregaon (500m), Vibgyor High School (350m) & City Centre Mall"
  },
  14: {
    lat: 19.1624, lng: 72.8388, pincode: "400104",
    address: "Near Bangur Nagar & Inorbit Mall, Goregaon West, Mumbai — 400104",
    metro: "Bangur Nagar Metro Station (Line 2A) — 250m (2 mins walk)",
    railway: "Goregaon Railway Station (West) — 1.3 km (5 mins)",
    highway: "Western Express Highway via Mrinal Gore Flyover — 1.6 km (5 mins)",
    airport: "CSM International Airport (BOM) — 10.8 km (19 mins)",
    landmark: "Inorbit Mall (350m), Vibgyor High School, Bangur Nagar Sports Complex"
  },
  15: {
    lat: 19.1605, lng: 72.8362, pincode: "400104",
    address: "New Link Road Corridor, Goregaon West, Mumbai — 400104",
    metro: "Goregaon West (Pahadi Goregaon) Metro Station (Line 2A) — 300m (3 mins walk)",
    railway: "Ram Mandir Suburban Railway Station — 950m (3 mins drive / 10 mins walk)",
    highway: "Western Express Highway — 1.7 km (5 mins)",
    airport: "CSM International Airport (BOM) — 10.5 km (18 mins)",
    landmark: "Nesco IT Park & Exhibition Centre (1.4 km), Topiwala Center & Bangur Nagar"
  },
  16: {
    lat: 19.1558, lng: 72.8425, pincode: "400104",
    address: "S.V. Road & Link Road Intersect, Goregaon West, Mumbai — 400104",
    metro: "Goregaon West Metro Station (Line 2A) — 400m (4 mins walk)",
    railway: "Goregaon Railway Station (Harbour & Western) — 750m (3 mins drive / 7 mins walk)",
    highway: "S.V. Road Frontage & WEH via Station Road — 1.2 km (4 mins)",
    airport: "CSM International Airport (BOM) — 10.2 km (18 mins)",
    landmark: "Topiwala Multiplex (250m), Patkar Varde College (450m) & Siddharth Hospital"
  },
  17: {
    lat: 19.1398, lng: 72.8445, pincode: "400102",
    address: "Near S.V. Road & Behram Baug, Jogeshwari West, Mumbai — 400102",
    metro: "Oshiwara Metro Station (Line 2A) — 300m (3 mins walk)",
    railway: "Jogeshwari Suburban Railway Station — 750m (3 mins)",
    highway: "JVLR (Jogeshwari-Vikhroli Link Road) — 450m (2 mins)",
    airport: "CSM International Airport (BOM) — 8.2 km (15 mins)",
    landmark: "Millat Superspeciality Hospital (250m), Behram Baug Junction & Lokhandwala Access"
  },
  18: {
    lat: 19.1352, lng: 72.8432, pincode: "400102",
    address: "Main S.V. Road, Jogeshwari West, Mumbai — 400102",
    metro: "Oshiwara / Jogeshwari West Metro (Line 2A) — 180m (2 mins walk)",
    railway: "Jogeshwari Railway Station — 450m (2 mins drive / 5 mins walk)",
    highway: "Direct S.V. Road Frontage & JVLR Flyover — 250m (1 min)",
    airport: "CSM International Airport (BOM) — 7.8 km (14 mins)",
    landmark: "Hub Mall (WEH - 1.1 km), Jogeshwari Caves & Oshiwara Furniture Hub"
  },
  19: {
    lat: 19.1375, lng: 72.8405, pincode: "400102",
    address: "Jogeshwari West Corridor, Near Oshiwara, Mumbai — 400102",
    metro: "Oshiwara Metro Station (Line 2A) — 350m (4 mins walk)",
    railway: "Ram Mandir Railway Station — 900m (3 mins)",
    highway: "JVLR Intersect — 700m (2 mins)",
    airport: "CSM International Airport (BOM) — 8.5 km (16 mins)",
    landmark: "Mega Mall Oshiwara (600m), Anand Nagar Market & Link Road Corridor"
  },
  20: {
    lat: 19.1315, lng: 72.8532, pincode: "400060",
    address: "Near JVLR Junction & WEH, Jogeshwari East, Mumbai — 400060",
    metro: "JVLR Metro Station (Line 7) — 200m (2 mins walk)",
    railway: "Jogeshwari Railway Station (East) — 650m (3 mins)",
    highway: "Western Express Highway Frontage & JVLR Start — 100m (1 min)",
    airport: "CSM International Airport (BOM) — 6.2 km (11 mins)",
    landmark: "SEEPZ IT Zone (1.6 km), Nesco IT Park (1.4 km) & Majas Bus Depot"
  },
  21: {
    lat: 19.1312, lng: 72.8165, pincode: "400061",
    address: "Yari Road, Versova, Andheri West, Mumbai — 400061",
    metro: "Versova Metro Station (Line 1) — 450m (4 mins walk)",
    railway: "Andheri Suburban & Outstation Station — 3.5 km (12 mins)",
    highway: "Versova Coastal Road Link & New Link Road — 1.1 km (4 mins)",
    airport: "CSM International Airport (BOM) — 9.2 km (18 mins)",
    landmark: "Versova Beach & Rock Beach (250m), Nana Nani Park & Prithvi Theatre (2 km)"
  },
  22: {
    lat: 19.1175, lng: 72.8572, pincode: "400069",
    address: "Near Western Express Highway, Andheri East, Mumbai — 400069",
    metro: "Gundavali Metro (Line 7) & WEH Metro (Line 1) — 200m (2 mins walk / Direct Interchange)",
    railway: "Andheri Railway Station (East) — 850m (3 mins drive / 7 mins walk)",
    highway: "Western Express Highway (WEH) — 100m (Direct Flyover Ramp)",
    airport: "CSM International Airport (Terminal 1 & 2) — 3.6 km (7 mins)",
    landmark: "The Lalit Mumbai (1.1 km), Solitaire Corporate Park (500m) & Bisleri Junction"
  },
  23: {
    lat: 19.1248, lng: 72.8322, pincode: "400053",
    address: "Near DN Nagar Metro & Link Road, Andheri West, Mumbai — 400053",
    metro: "D.N. Nagar Metro Interchange (Line 1 & Line 2A) — 150m (Direct 2-min Walk)",
    railway: "Andheri Railway Station (West) — 1.4 km (5 mins)",
    highway: "New Link Road (Direct) & WEH via Andheri-Kurla Rd — 2.0 km (7 mins)",
    airport: "CSM International Airport (BOM) — 7.2 km (14 mins)",
    landmark: "Kokilaben Dhirubhai Ambani Hospital (650m), Bhavan's College (350m) & The Club (750m)"
  },
  24: {
    lat: 19.1192, lng: 72.8465, pincode: "400058",
    address: "Andheri Central Corridor, S.V. Road, Andheri West, Mumbai — 400058",
    metro: "Andheri Metro Station (Line 1) — 350m (3 mins walk)",
    railway: "Andheri Railway Station (Harbour & Western Line Junction) — 450m (3 mins walk)",
    highway: "S.V. Road (Immediate) & Western Express Highway — 1.3 km (4 mins)",
    airport: "CSM International Airport (BOM) — 5.5 km (11 mins)",
    landmark: "Shoppers Stop Andheri (250m), Gilbert Hill Heritage Rock (500m) & Nadco Center"
  },
  25: {
    lat: 19.1145, lng: 72.8625, pincode: "400069",
    address: "Andheri-Kurla Road, Chakala, Andheri East, Mumbai — 400069",
    metro: "Chakala (J.B. Nagar) Metro Station (Line 1) — 200m (2 mins walk)",
    railway: "Andheri Railway Station (East) — 1.2 km (5 mins)",
    highway: "Western Express Highway — 750m (2 mins)",
    airport: "CSM International Airport (T2) — 3.0 km (6 mins)",
    landmark: "Solitaire Business Park (250m), ITC Maratha (1.6 km) & Courtyard Marriott"
  },
  26: {
    lat: 19.1118, lng: 72.8605, pincode: "400093",
    address: "Chakala Central Corridor, Andheri East, Mumbai — 400093",
    metro: "Western Express Highway (WEH) Metro Station (Line 1) — 300m (3 mins walk)",
    railway: "Andheri Railway Station (East) — 900m (3 mins)",
    highway: "Western Express Highway — 350m (1 min)",
    airport: "CSM International Airport (BOM) — 2.8 km (5 mins)",
    landmark: "Courtyard by Marriott (150m), Naman Midtown Hub & Chakala Market"
  },
  27: {
    lat: 19.1225, lng: 72.8405, pincode: "400058",
    address: "Lallubhai Park Road, Andheri West, Mumbai — 400058",
    metro: "Azad Nagar Metro Station (Line 1) — 300m (3 mins walk)",
    railway: "Andheri Railway Station (West) — 700m (3 mins drive / 7 mins walk)",
    highway: "S.V. Road (150m) & Western Express Highway — 1.7 km (5 mins)",
    airport: "CSM International Airport (BOM) — 6.0 km (12 mins)",
    landmark: "Lallubhai Park (80m), Prime Superspeciality Hospital (250m) & Bhavan's Campus"
  },
  28: {
    lat: 19.1215, lng: 72.8355, pincode: "400058",
    address: "Veera Desai Road, Andheri West, Mumbai — 400058",
    metro: "D.N. Nagar Metro Station (Line 1 & 2A) — 450m (4 mins walk)",
    railway: "Andheri Railway Station (West) — 1.8 km (6 mins)",
    highway: "New Link Road (150m) & Western Express Highway — 2.3 km (7 mins)",
    airport: "CSM International Airport (BOM) — 7.0 km (14 mins)",
    landmark: "The Country Club (150m), Yash Raj Films Studio (350m) & Kokilaben Hospital (750m)"
  },
  29: {
    lat: 19.1285, lng: 72.8305, pincode: "400053",
    address: "Lokhandwala Complex Back Road, Andheri West, Mumbai — 400053",
    metro: "Adarsh Nagar / Oshiwara Metro Station (Line 2A) — 400m (4 mins walk)",
    railway: "Andheri Railway Station — 2.5 km (8 mins)",
    highway: "Link Road Corridor — 300m (2 mins)",
    airport: "CSM International Airport (BOM) — 8.0 km (16 mins)",
    landmark: "Lokhandwala Market (250m), Celebration Sports Club (200m) & Infiniti Mall (750m)"
  },
  30: {
    lat: 19.1165, lng: 72.8345, pincode: "400058",
    address: "Four Bungalows Corridor, Andheri West, Mumbai — 400058",
    metro: "D.N. Nagar Metro Station (Line 1 & 2A) — 300m (3 mins walk)",
    railway: "Andheri Railway Station (West) — 1.6 km (5 mins)",
    highway: "Western Express Highway via Andheri Underpass — 2.2 km (7 mins)",
    airport: "CSM International Airport (BOM) — 6.8 km (13 mins)",
    landmark: "Four Bungalows Market (150m), Rustomjee Cambridge School & Kokilaben Hospital (550m)"
  },
  31: {
    lat: 19.1345, lng: 72.8275, pincode: "400053",
    address: "Higher Link Road, Near Adarsh Nagar, Andheri West, Mumbai — 400053",
    metro: "Adarsh Nagar Metro Station (Line 2A) — 250m (2 mins walk)",
    railway: "Jogeshwari / Ram Mandir Station — 1.7 km (5 mins)",
    highway: "New Link Road Frontage & JVLR Extension — 700m (2 mins)",
    airport: "CSM International Airport (BOM) — 8.5 km (16 mins)",
    landmark: "Infiniti Mall Andheri (350m), Lotus Petrol Pump Junction & Citi Mall (300m)"
  },
  32: {
    lat: 19.1365, lng: 72.8255, pincode: "400053",
    address: "Oshiwara Link Road, Andheri West, Mumbai — 400053",
    metro: "Oshiwara Metro Station (Line 2A) — 200m (2 mins walk)",
    railway: "Ram Mandir Railway Station — 1.2 km (4 mins)",
    highway: "Direct Link Road Frontage — 0 km",
    airport: "CSM International Airport (BOM) — 8.8 km (17 mins)",
    landmark: "Mega Mall (250m), Laxmi Industrial Estate (150m) & Star Bazaar"
  },
  33: {
    lat: 19.0652, lng: 72.8285, pincode: "400050",
    address: "Pali Hill Sanctuary, Nargis Dutt Road, Bandra West, Mumbai — 400050",
    metro: "Bandra Colony Underground Metro (Aqua Line 3) — 1.0 km (3 mins drive / 10 mins walk)",
    railway: "Bandra Suburban & Harbour Station — 1.5 km (5 mins)",
    highway: "Bandra-Worli Sea Link & Coastal Road Ramp — 1.2 km (3 mins)",
    airport: "CSM International Airport (BOM) — 9.0 km (15 mins)",
    landmark: "Pali Hill Club (100m), Candies (250m), Olive Bar & Kitchen (350m) & Carter Road (550m)"
  },
  34: {
    lat: 19.0585, lng: 72.8325, pincode: "400050",
    address: "Turner Road & Perry Cross Road, Bandra West, Mumbai — 400050",
    metro: "Bandra Colony Metro (Aqua Line 3) — 900m (3 mins drive / 9 mins walk)",
    railway: "Bandra Railway Station (West) — 1.0 km (4 mins)",
    highway: "Western Express Highway & Sea Link — 1.1 km (3 mins)",
    airport: "CSM International Airport (BOM) — 8.8 km (15 mins)",
    landmark: "Turner Road Boutiques (80m), Carter Road Seafront (650m) & Otters Club (850m)"
  },
  35: {
    lat: 19.0625, lng: 72.8545, pincode: "400051",
    address: "Bandra East, Adjacent to BKC Financial Gateway, Mumbai — 400051",
    metro: "BKC Underground Metro Station (Aqua Line 3 & Line 2B Interchange) — 200m (2 mins walk)",
    railway: "Bandra Terminus & Suburban Station — 450m (2 mins drive / 5 mins walk)",
    highway: "Western Express Highway & Kalanagar Flyover — 100m (1 min)",
    airport: "CSM International Airport (BOM) — 6.0 km (10 mins via BKC Elevated Corridor)",
    landmark: "Bandra Kurla Complex (BKC - 250m), Jio World Centre (750m), US Consulate (1 km) & MCA Club"
  },
  36: {
    lat: 19.0465, lng: 72.8215, pincode: "400050",
    address: "Mount Mary Hill & Bandstand Promenade, Bandra West, Mumbai — 400050",
    metro: "Bandra Underground Metro Link (Aqua Line 3) — 1.2 km (4 mins)",
    railway: "Bandra Railway Station (West) — 1.9 km (6 mins)",
    highway: "Bandra-Worli Sea Link Toll Plaza — 850m (2 mins)",
    airport: "CSM International Airport (BOM) — 10.0 km (18 mins)",
    landmark: "Mount Mary Basilica (120m), Taj Lands End (350m), Bandstand Promenade (180m) & Mannat (300m)"
  },
  37: {
    lat: 19.0685, lng: 72.8235, pincode: "400050",
    address: "Carter Road Seafront Promenade, Bandra West, Mumbai — 400050",
    metro: "Khar Underground Metro Station — 950m (3 mins)",
    railway: "Khar Road Railway Station — 1.2 km (4 mins) & Bandra Station (1.8 km)",
    highway: "Bandra-Worli Sea Link & Western Express Highway — 1.8 km (5 mins)",
    airport: "CSM International Airport (BOM) — 8.5 km (15 mins)",
    landmark: "Carter Road Seafront Promenade (Direct Frontage / 30m), Otters Club (250m) & Union Park"
  },
  38: {
    lat: 19.0545, lng: 72.8355, pincode: "400050",
    address: "Hill Road & St. Martin's Cross, Bandra West, Mumbai — 400050",
    metro: "Bandra Underground Metro (Aqua Line 3) — 700m (3 mins)",
    railway: "Bandra Railway Station (West) — 850m (3 mins drive / 7 mins walk)",
    highway: "Western Express Highway & Sea Link Connector — 1.3 km (4 mins)",
    airport: "CSM International Airport (BOM) — 8.5 km (15 mins)",
    landmark: "Holy Family Hospital (120m), Elco Market Hill Road (250m) & St. Stanislaus High School"
  },
  39: {
    lat: 19.0615, lng: 72.8295, pincode: "400050",
    address: "Waterfield Road, Bandra West Prime, Mumbai — 400050",
    metro: "Bandra Underground Metro (Aqua Line 3) — 750m (3 mins)",
    railway: "Bandra Railway Station (West) — 1.0 km (4 mins)",
    highway: "Linking Road (80m) & Western Express Highway — 1.2 km (3 mins)",
    airport: "CSM International Airport (BOM) — 8.8 km (15 mins)",
    landmark: "Linking Road Shopping Boulevard (100m), Taj Mahal Tea House (200m) & Pali Naka (350m)"
  },
  40: {
    lat: 18.9985, lng: 72.8285, pincode: "400013",
    address: "Senapati Bapat Marg, Lower Parel / Parkside, Mumbai — 400013",
    metro: "Science Centre / Worli Metro Station (Aqua Line 3) — 300m (3 mins walk)",
    railway: "Lower Parel Station (Western Line - 400m / 4 mins walk) & Currey Road (Central Line - 550m)",
    highway: "Mumbai Coastal Road (Worli Sea Face Ramp - 1.0 km / 2 mins) & Eastern Freeway (1.8 km)",
    airport: "CSM International Airport (BOM) — 14.0 km (22 mins)",
    landmark: "High Street Phoenix & Palladium Mall (250m), The St. Regis Mumbai (350m) & Peninsula Park"
  },
  41: {
    lat: 18.9945, lng: 72.8315, pincode: "400013",
    address: "Lower Parel Commercial Boulevard, Opp Peninsula Park, Mumbai — 400013",
    metro: "Acharya Atre Chowk / Lower Parel Metro (Aqua Line 3) — 250m (2 mins walk)",
    railway: "Lower Parel Suburban Station — 300m (3 mins walk) & Currey Road (350m)",
    highway: "Atal Setu (MTHL) Access & Eastern Freeway — 2.0 km (5 mins)",
    airport: "CSM International Airport (BOM) — 14.5 km (24 mins)",
    landmark: "Peninsula Corporate Park (100m), Kamala Mills Dining District (350m) & One World Center"
  },
  42: {
    lat: 18.9965, lng: 72.8265, pincode: "400013",
    address: "Off Senapati Bapat Marg, Near One International Centre, Lower Parel, Mumbai — 400013",
    metro: "Worli / Science Centre Metro (Aqua Line 3) — 350m (3 mins walk)",
    railway: "Lower Parel Railway Station — 450m (4 mins walk)",
    highway: "Mumbai Coastal Road (Worli Interchange) — 850m (2 mins)",
    airport: "CSM International Airport (BOM) — 13.8 km (22 mins)",
    landmark: "One International Centre (150m), Four Seasons Hotel (450m) & ITC Grand Central"
  },
  43: {
    lat: 18.9925, lng: 72.8295, pincode: "400013",
    address: "Lower Parel Midtown Corridor, Near Marathon Futurex, Mumbai — 400013",
    metro: "Currey Road Metro Link & Lower Parel Monorail — 200m (2 mins walk)",
    railway: "Lower Parel Station (Western) & Currey Road Station (Central) — 300m (3 mins walk)",
    highway: "Bandra-Worli Sea Link & Mumbai Coastal Road — 1.4 km (3 mins)",
    airport: "CSM International Airport (BOM) — 14.6 km (24 mins)",
    landmark: "Marathon Futurex IT Park (100m), Lodha Excelus (250m) & Urmi Estate (350m)"
  }
};

// Enrich all developments with precise GPS coordinates, verified addresses and transit matrices
PROJECTS_DATA.forEach(p => {
  const coord = PROJECT_COORDINATES[p.id];
  if (coord) {
    p.coords = { lat: coord.lat, lng: coord.lng };
    p.exactAddress = coord.address;
    p.pincode = coord.pincode;
    p.mapUrl = `https://maps.google.com/?q=${coord.lat},${coord.lng}`;
    p.connectivity = [
      coord.metro,
      coord.railway,
      coord.highway,
      coord.airport,
      coord.landmark
    ];
    p.transit = {
      metro: coord.metro,
      railway: coord.railway,
      highway: coord.highway,
      airport: coord.airport,
      landmark: coord.landmark
    };
  } else {
    p.coords = { lat: 19.1197, lng: 72.8468 };
    p.exactAddress = `${p.locality || ''}, ${p.location}, Mumbai`;
    p.pincode = "400053";
  }
});

