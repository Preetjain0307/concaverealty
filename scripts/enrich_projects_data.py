import json

# Define the 43 projects enriched with keyFeatures and updated amenities
ENRICHMENT = {
  1: {
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
  2: {
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
  3: {
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
  4: {
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
  5: {
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
  6: {
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
  7: {
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
  8: {
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
  9: {
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
  10: {
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
  11: {
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
  12: {
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
  13: {
    "keyFeatures": [
      "Located on Link Road Corridor, Goregaon West",
      "3 Mins to Bangur Nagar Metro Station",
      "5 Mins to Inorbit Mall & Goregaon Railway Station",
      "Quick connection to Western Express Highway via Mrinal Tai Gore Flyover"
    ],
    "amenities": [
      "Grand Porte-Cochère Drop-off Lobby",
      "Swimming Pool with Timber Sun Deck",
      "State-of-the-Art Gymnasium",
      "Landscaped Podium Gardens",
      "Kids Fun Park",
      "Banquet & Gathering Hall",
      "Indoor Games Zone",
      "High-Security Access Control"
    ]
  },
  14: {
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
  15: {
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
  16: {
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
  17: {
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
  18: {
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
  19: {
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
  20: {
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
  21: {
    "keyFeatures": [
      "Direct Seafront Location in Versova, Andheri West",
      "2 Mins to Versova Metro Station (Line 1)",
      "5 Mins to Lokhandwala Complex & Juhu Beach",
      "Direct access to upcoming Versova-Bandra Sea Link"
    ],
    "amenities": [
      "Sea-Facing Infinity Lap Pool",
      "Private Seafront Cabanas",
      "Grand Porte-Cochère Lobby",
      "Modern Fitness & Pilates Studio",
      "Rooftop Party Deck with Sunset Views",
      "Private Movie Theatre",
      "Kids Splash Pool",
      "24/7 Luxury Concierge"
    ]
  },
  22: {
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
  23: {
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
  24: {
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
  25: {
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
  26: {
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
  27: {
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
  28: {
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
  29: {
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
  30: {
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
  31: {
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
  32: {
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
  33: {
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
  34: {
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
  35: {
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
  36: {
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
  37: {
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
  38: {
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
      "Double-Height Porte-Cochère",
      "24/7 Valet Concierge"
    ]
  },
  39: {
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
  40: {
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
  41: {
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
  42: {
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
  43: {
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
}

# Now let's inject keyFeatures and enriched amenities into projectsData.js!
# Notice that at the bottom of projectsData.js:
# We already have:
# PROJECTS_DATA.forEach(p => {
#   const folder = PROJECT_FOLDERS[p.id] || `${p.id} - ${p.name}`;
#   ...
# });
# We can cleanly enrich PROJECTS_DATA right there or directly assign it!

with open('src/data/projectsData.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's save the JSON dictionary into a const PROJECT_ENRICHMENTS in projectsData.js
enrichment_js = "export const PROJECT_ENRICHMENTS = " + json.dumps(ENRICHMENT, indent=2) + ";\n\n"

# In PROJECTS_DATA.forEach(p => { ...
# add:
# const enrich = PROJECT_ENRICHMENTS[p.id];
# if (enrich) {
#   p.keyFeatures = enrich.keyFeatures || [];
#   if (enrich.amenities) p.amenities = enrich.amenities;
# }

target_loop = "PROJECTS_DATA.forEach(p => {"
replacement_loop = enrichment_js + """PROJECTS_DATA.forEach(p => {
  const enrich = PROJECT_ENRICHMENTS[p.id];
  if (enrich) {
    p.keyFeatures = enrich.keyFeatures || [];
    if (enrich.amenities) p.amenities = enrich.amenities;
  }"""

if target_loop in code and "PROJECT_ENRICHMENTS" not in code:
    code = code.replace(target_loop, replacement_loop, 1)
    with open('src/data/projectsData.js', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully updated src/data/projectsData.js with PROJECT_ENRICHMENTS!")
else:
    print("Already updated or target_loop not found")

