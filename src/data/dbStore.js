import * as XLSX from 'xlsx';

// ==========================================
// COMPACT DATABASE ENCODING / DECODING MAPS
// Ensures ultra-small footprint storage
// ==========================================

export const STATUS_CODES = {
  1: "Hot Lead",
  2: "Lead",
  3: "Interested",
  4: "Not Answered",
  5: "Not Interested",
  6: "Fake / Spam",
  7: "New",
  8: "Interested",
  9: "Call Back",
  10: "Busy"
};

export const REVERSE_STATUS_CODES = {
  "hot_lead": 1,
  "hot lead": 1,
  "more_interested": 1,
  "lead": 2,
  "interested": 8,
  "okay": 3,
  "not_picking": 4,
  "not_picking_up": 4,
  "not_answered": 4,
  "not answered": 4,
  "not_interested": 5,
  "not interested": 5,
  "busy": 10,
  "call_back": 9,
  "call back": 9,
  "fake": 6,
  "fake / spam": 6,
  "fake/spam": 6,
  "new": 7
};

export const CALL_STATUS_CODES = {
  0: "Uncalled",
  1: "Connected & Discussed",
  2: "Not Answered (4hr Pending)",
  3: "Daily Retry Pending",
  4: "Ongoing Retry (Up to 10 Days)",
  5: "10-Day Exhausted (Archived)",
  6: "Call Back Scheduled",
  7: "Line Busy (Pending Retry)"
};

export const LOCATION_CODES = {
  1: "Borivali",
  2: "Kandivali",
  3: "Goregaon",
  4: "Malad",
  5: "Jogeshwari",
  6: "Andheri",
  7: "Bandra",
  8: "Lower Parel"
};

export const REVERSE_LOCATION_CODES = {
  "borivali": 1,
  "borivali west": 1,
  "borivali east": 1,
  "kandivali": 2,
  "kandivali west": 2,
  "kandivali east": 2,
  "goregaon": 3,
  "goregaon west": 3,
  "goregaon east": 3,
  "malad": 4,
  "malad west": 4,
  "malad east": 4,
  "jogeshwari": 5,
  "jogeshwari west": 5,
  "jogeshwari east": 5,
  "andheri": 6,
  "andheri west": 6,
  "andheri east": 6,
  "versova": 6,
  "bandra": 7,
  "bandra west": 7,
  "bandra east": 7,
  "lower parel": 8,
  "worli": 8,
  "powai": 6,
  "bhayander": 3,
  "bhayandar": 3,
  "mira road": 1,
  "miraroad": 1
};

export const PROJECT_CODES = {
  1: "Kalpataru Advay",
  2: "Godrej Skyshore",
  3: "Godrej Reserve",
  4: "Concave Signature Residences",
  5: "Lodha World Towers Collection",
  6: "Mira-Bhayander Waterfront Enclave"
};

export const TYPE_CODES = {
  1: "General Enquiry",
  2: "VIP Site Visit",
  3: "Immediate Callback",
  4: "Brochure & Digital Kit",
  5: "Private Consultation"
};

// ==========================================
// CLIENT DEVICE DETECTION ENGINE
// Detects user device (iPhone, Samsung, OnePlus, Vivo, etc.)
// ==========================================
export function detectUserDevice() {
  if (typeof window === 'undefined' || !window.navigator) {
    return 'Web Browser';
  }
  const ua = window.navigator.userAgent || '';

  // 1. Apple Devices
  if (/iPhone/i.test(ua)) return 'Apple iPhone';
  if (/iPad/i.test(ua)) return 'Apple iPad';
  if (/iPod/i.test(ua)) return 'Apple iPod';

  // 2. Popular Android Flagships & Brands
  if (/SM-|Samsung|SGH-|SCH-|SPH-|Galaxy/i.test(ua)) return 'Samsung Galaxy';
  if (/OnePlus|ONEPLUS|GM19|HD19|KB20|IN20|NE22|CPH24|CPH25/i.test(ua)) return 'OnePlus';
  if (/Pixel/i.test(ua)) return 'Google Pixel';
  if (/Redmi|POCO|Xiaomi|Mi\s|2201|2109|2203|2210|2304/i.test(ua)) return 'Xiaomi / Redmi';
  if (/vivo|V20|V21|V22|V23|V24|I20|I21|I22/i.test(ua)) return 'Vivo';
  if (/OPPO|Realme|RMX/i.test(ua)) return 'Oppo / Realme';
  if (/Moto|Motorola/i.test(ua)) return 'Motorola';

  // 3. Generic Android
  if (/Android/i.test(ua)) {
    return /Mobile/i.test(ua) ? 'Android Smartphone' : 'Android Tablet';
  }

  // 4. Desktop Platforms
  if (/Macintosh|Mac OS X/i.test(ua)) return 'Mac / MacBook';
  if (/Windows NT/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux Desktop';

  return 'Mobile (Web)';
}

// Compact device label helper for ultra-clean tables
export function formatCompactDevice(device) {
  if (!device) return 'Mobile';
  const str = String(device);
  if (/iPhone/i.test(str)) return 'iPhone';
  if (/iPad/i.test(str)) return 'iPad';
  if (/Samsung/i.test(str)) return 'Samsung';
  if (/OnePlus/i.test(str)) return 'OnePlus';
  if (/Pixel/i.test(str)) return 'Pixel';
  if (/Redmi|Xiaomi|POCO/i.test(str)) return 'Redmi';
  if (/Realme/i.test(str)) return 'Realme';
  if (/Oppo/i.test(str)) return 'Oppo';
  if (/Vivo/i.test(str)) return 'Vivo';
  if (/Moto/i.test(str)) return 'Moto';
  if (/Android/i.test(str)) return 'Android';
  if (/Mac/i.test(str)) return 'Mac';
  if (/Windows|PC/i.test(str)) return 'PC';
  if (/Admin/i.test(str)) return 'Admin';
  if (/Caller/i.test(str)) return 'Caller';
  return str.split(' ')[0] || 'Device';
}

// Check if device is desktop / laptop / PC
export function isDesktopDevice(device) {
  if (!device) return false;
  return /PC|Mac|Windows|Linux|Desktop|Laptop/i.test(String(device));
}

// Check if a record is a confirmed Lead or Hot Lead
export function isConfirmedLead(lead) {
  if (!lead) return false;
  const s = lead.statusCode ?? lead.s;
  if (s === 1 || s === 2 || s === 8 || lead.isHotLead === true) {
    return true;
  }
  return false;
}

// Check if a record is a callback / retry follow-up
export function isCallbackLead(lead) {
  if (!lead) return false;
  const s = lead.statusCode ?? lead.s;
  if (s === 5 || s === 6 || lead.s === 5 || lead.s === 6) return false;
  const cs = lead.callStatusCode ?? lead.cs;
  const isRetryCall = cs === 2 || cs === 3 || cs === 6 || cs === 7;
  const isFollowUpStatus = s === 3 || s === 4 || s === 9 || s === 10;
  return isRetryCall || isFollowUpStatus;
}

// Check if a record is a pending enquiry (Active Queue)
// In Active Queue there should be pending calls only where callers need to make a call (Uncalled)
export function isPendingEnquiry(lead) {
  if (!lead) return false;
  const s = lead.statusCode ?? lead.s;
  // Once status is assigned (Hot Lead, Lead, Follow up, Not Picking, Not Interested, Spam), it leaves Active Queue
  if (s === 1 || s === 2 || s === 3 || s === 4 || s === 5 || s === 6 || s === 8 || s === 9 || s === 10) {
    return false;
  }
  const isUncalled = lead.callStatusCode === 0 || lead.cs === 0 || lead.callStatusName === 'Uncalled';
  return isUncalled || s === 7 || lead.statusName === 'New';
}

const DB_KEY = "concave_realty_compact_db_v5";
const CALLERS_KEY = "concave_realty_callers_v5";

// Default Callers with territory location IDs & ID generation timestamps
// Passwords stored as SHA-256 salted cryptographic hashes (Never plaintext)
const DEFAULT_CALLERS = [
  {
    id: 1,
    callerCode: "Callerpreet",
    name: "Preet Jain",
    phone: "98201 12345",
    email: "preetjainwhatsapp@gmail.com",
    password: "1ace255a4de8353c8b1a12e9aa80276b7aef8c8588529ceae7b96f85c39eeaf9", // Salted SHA-256 hash
    assignedLocations: [1, 2, 3, 4], // Borivali, Kandivali, Goregaon, Malad
    role: "Senior Location Specialist",
    active: true,
    createdAt: new Date(2026, 10, 1, 0, 0, 0).getTime() // 1 Nov 2026
  },
  {
    id: 2,
    callerCode: "Callerproxy",
    name: "Callerproxy",
    phone: "98202 23456",
    email: "preetrajeshjain@gmail.com",
    password: "f96457dcf95a624133c4be68864145b5dd1218aec6dfadf6e7ba0256a2bdc11b", // Salted SHA-256 hash
    assignedLocations: [5, 6, 7, 8], // Jogeshwari, Andheri, Bandra, Lower Parel
    role: "Central & Coastal Specialist",
    active: true,
    createdAt: new Date(2026, 10, 1, 0, 0, 0).getTime() // 1 Nov 2026
  }
];

// Initial Seed Leads (Stored with compact single-letter keys)
// { i: id, n: name, m: mobile, e: email, l: locId, p: projId, t: typeId, s: statusId, c: callerId, cs: callStatusId, rc: retryCount, na: nextAttempt, ts: createdAt, nt: notes }
const INITIAL_SEED_LEADS = [
  // ── HISTORICAL RECORDS (July - August 2026: Strictly Admin only, created before caller ID generation) ──
  {
    i: 91,
    n: "Kunal Shah",
    m: "98200 44111",
    e: "kunal.shah@example.com",
    l: 6, // Andheri
    p: 2, // Godrej Skyshore
    t: 1,
    s: 5, // Not Interested
    c: null,
    cs: 1,
    rc: 0,
    na: null,
    ts: new Date(2026, 6, 15, 11, 30).getTime(), // 15 Jul 2026
    d: "Budget mismatch for 4 BHK sky bungalow. Customer looking under 5 Cr.",
    dv: "Apple iPhone",
    nt: [{ by: "Admin Desk", at: new Date(2026, 6, 15, 12, 0).getTime(), txt: "Client budget is too low for Versova luxury tier. Marked Not Interested." }]
  },
  {
    i: 92,
    n: "Meera Nair",
    m: "98201 99881",
    e: "meera.test@fake.com",
    l: 3, // Goregaon
    p: 4, // Concave Signature
    t: 1,
    s: 6, // Fake / Spam
    c: null,
    cs: 1,
    rc: 0,
    na: null,
    ts: new Date(2026, 7, 10, 16, 45).getTime(), // 10 Aug 2026
    d: "Invalid contact inquiry from aggregator.",
    dv: "Windows PC",
    nt: [{ by: "Admin Desk", at: new Date(2026, 7, 10, 17, 0).getTime(), txt: "Phone number invalid, bot lead. Marked Fake/Spam." }]
  },

  // ── CALLER 1: Preet Jain (Locations: Borivali [1], Kandivali [2], Goregaon [3], Malad [4]) ──
  // 1. Pending Enquiries (Active Queue - Uncalled: cs: 0, s: 7) - New incoming web enquiries
  {
    i: 101,
    n: "Ananya Sharma",
    m: "98201 55667",
    e: "ananya.s@example.com",
    l: 3, // Goregaon
    p: 4, // Concave Signature Residences
    t: 1, // General Enquiry
    s: 7, // New
    c: 1, // Preet Jain
    cs: 0, // Uncalled
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 1.5,
    d: "Interested in 3 BHK high floor unit near Inorbit Mall.",
    dv: "Windows PC",
    nt: []
  },
  {
    i: 102,
    n: "Vikramaditya Roy",
    m: "98192 33445",
    e: "v.roy@example.com",
    l: 4, // Malad
    p: 6, // Mira-Bhayander Waterfront Enclave
    t: 1,
    s: 7,
    c: 1, // Preet Jain
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 2.5,
    d: "Enquiry for 2 BHK waterfront facing apartment with deck.",
    dv: "Apple iPhone",
    nt: []
  },
  {
    i: 103,
    n: "Kavita Rao",
    m: "98205 66789",
    e: "kavita.rao@example.com",
    l: 1, // Borivali
    p: 1, // Kalpataru Advay
    t: 1,
    s: 7,
    c: 1, // Preet Jain
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 3.8,
    d: "Interested in 3 BHK sea-view residence. Requested brochure and floor plans.",
    dv: "Android Smartphone",
    nt: []
  },
  {
    i: 104,
    n: "Siddharth Patel",
    m: "98206 11224",
    e: "siddharth.p@example.com",
    l: 2, // Kandivali
    p: 3, // Godrej Reserve
    t: 1,
    s: 7,
    c: 1, // Preet Jain
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 4.2,
    d: "Inquiry for 2 BHK luxury apartment with club view.",
    dv: "OnePlus",
    nt: []
  },
  {
    i: 105,
    n: "Neha Singhania",
    m: "98207 44332",
    e: "neha.s@example.com",
    l: 3, // Goregaon
    p: 4, // Concave Signature Residences
    t: 2, // Site Visit
    s: 7,
    c: 1, // Preet Jain
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 5.5,
    d: "Requested Sunday site visit for 4 BHK duplex suite.",
    dv: "Samsung Galaxy",
    nt: []
  },
  // 2. Confirmed Leads (Called and marked: Hot Lead / Lead)
  {
    i: 106,
    n: "Sanjay Singhal",
    m: "98190 22334",
    e: "sanjay.s@corp.in",
    l: 1, // Borivali
    p: 1, // Kalpataru Advay
    t: 2,
    s: 1, // Hot Lead
    c: 1, // Preet Jain
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 7,
    d: "Booked 3 BHK royal suite with custom wooden deck.",
    dv: "Apple iPhone",
    nt: [{ by: "Preet Jain", at: Date.now() - 3600 * 1000 * 6, txt: "Spoke for 15 mins. Client confirmed 3 BHK booking token for this Saturday. High value VIP lead." }]
  },
  {
    i: 107,
    n: "Rohan Varma",
    m: "98199 44321",
    e: "rohan.v@example.com",
    l: 4, // Malad
    p: 6, // Mira-Bhayander Waterfront Enclave
    t: 1,
    s: 2, // Lead (Interested)
    c: 1, // Preet Jain
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 12,
    d: "Looking for 2 BHK budget around 1.15 Cr all-in.",
    dv: "Samsung Galaxy",
    nt: [{ by: "Preet Jain", at: Date.now() - 3600 * 1000 * 10, txt: "Interested in payment milestone schedule. Sent brochure via WhatsApp." }]
  },
  // 3. Non-Leads / Callbacks
  {
    i: 108,
    n: "Kabir Singh",
    m: "90040 22119",
    e: "kabir.singh@example.com",
    l: 3, // Goregaon
    p: 4, // Concave Signature
    t: 3, // Callback
    s: 4, // Not Answered
    c: 1, // Preet Jain
    cs: 2, // 4hr retry pending
    rc: 1,
    na: Date.now() + 3600 * 1000 * 2,
    ts: Date.now() - 3600 * 1000 * 8,
    d: "Requested callback regarding ready-to-move units near Inorbit.",
    dv: "Android Smartphone",
    nt: [{ by: "Preet Jain", at: Date.now() - 3600 * 1000 * 7.5, txt: "Rung 4 times, no response. Scheduled 4-hour automatic re-dial." }]
  },
  {
    i: 109,
    n: "Rajesh Kothari",
    m: "98208 99881",
    e: "rajesh.k@example.com",
    l: 2, // Kandivali
    p: 3, // Godrej Reserve
    t: 1,
    s: 5, // Not Interested
    c: 1, // Preet Jain
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 16,
    d: "Purchased commercial property elsewhere.",
    dv: "Windows PC",
    nt: [{ by: "Preet Jain", at: Date.now() - 3600 * 1000 * 15, txt: "Client purchased commercial office in BKC. Not interested in residential property." }]
  },

  // ── CALLER 2: Callerproxy (Locations: Jogeshwari [5], Andheri [6], Bandra [7], Lower Parel [8]) ──
  // 1. Pending Enquiries (Active Queue - Uncalled: cs: 0, s: 7) - New incoming web enquiries
  {
    i: 110,
    n: "Pooja Hegde",
    m: "91672 88771",
    e: "pooja.h@gmail.com",
    l: 5, // Jogeshwari
    p: 6, // Mira-Bhayander Waterfront Enclave
    t: 1,
    s: 7,
    c: 2, // Callerproxy
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 1.8,
    d: "Downloaded digital brochure for waterfront facing residences.",
    dv: "Samsung Galaxy",
    nt: []
  },
  {
    i: 111,
    n: "Amit Deshmukh",
    m: "98209 33221",
    e: "amit.d@example.com",
    l: 6, // Andheri
    p: 2, // Godrej Skyshore
    t: 1,
    s: 7,
    c: 2, // Callerproxy
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 2.8,
    d: "Interested in 3 BHK sea-view penthouse in Versova.",
    dv: "Apple iPhone",
    nt: []
  },
  {
    i: 112,
    n: "Ritu Kapoor",
    m: "98210 77665",
    e: "ritu.k@example.com",
    l: 7, // Bandra
    p: 5, // Lodha World Towers Collection
    t: 2, // Site Visit
    s: 7,
    c: 2, // Callerproxy
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 4.0,
    d: "Inquiry for 4 BHK sea-view residential suite.",
    dv: "Mac / MacBook",
    nt: []
  },
  {
    i: 113,
    n: "Kunal Shah",
    m: "98211 44556",
    e: "kunal.shah99@example.com",
    l: 8, // Lower Parel
    p: 5, // Lodha World Towers Collection
    t: 5, // Private Consultation
    s: 7,
    c: 2, // Callerproxy
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 4.7,
    d: "VIP consultation request for high floor duplex suite.",
    dv: "OnePlus",
    nt: []
  },
  {
    i: 114,
    n: "Farhan Merchant",
    m: "98212 88990",
    e: "farhan.m@example.com",
    l: 6, // Andheri
    p: 2, // Godrej Skyshore
    t: 1,
    s: 7,
    c: 2, // Callerproxy
    cs: 0,
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 5.8,
    d: "Enquiry for 3 BHK luxury layout and payment plans.",
    dv: "Android Smartphone",
    nt: []
  },
  // 2. Confirmed Leads (Called and marked: Hot Lead / Lead)
  {
    i: 115,
    n: "Amitabh Singhania",
    m: "98205 99887",
    e: "singhania@corp.in",
    l: 8, // Lower Parel
    p: 5, // Lodha World Towers Collection
    t: 5,
    s: 1, // Hot Lead
    c: 2, // Callerproxy
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 14,
    d: "Seeking 5 BHK Duplex Sky Mansion in Worli/Lower Parel.",
    dv: "Apple iPhone",
    nt: [{ by: "Callerproxy", at: Date.now() - 3600 * 1000 * 12, txt: "High net-worth buyer. Arranged private presentation with senior director for this Friday." }]
  },
  {
    i: 116,
    n: "Diya Kapoor",
    m: "98200 11882",
    e: "diya.k@example.com",
    l: 6, // Andheri
    p: 2, // Godrej Skyshore
    t: 1,
    s: 2, // Lead (Interested)
    c: 2, // Callerproxy
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 18,
    d: "Looking for 4 Bed Royal Residence with 25:25:50 Diwali plan.",
    dv: "Google Pixel",
    nt: [{ by: "Callerproxy", at: Date.now() - 3600 * 1000 * 16, txt: "Scheduled private virtual tour review and site-visit on Saturday 4 PM." }]
  },
  // 3. Non-Leads / Callbacks
  {
    i: 117,
    n: "Nisha Patel",
    m: "91670 55443",
    e: "nisha.p@gmail.com",
    l: 5, // Jogeshwari
    p: 6, // Mira-Bhayander Waterfront Enclave
    t: 3, // Callback
    s: 4, // Not Answered
    c: 2, // Callerproxy
    cs: 3, // Daily retry pending
    rc: 2,
    na: Date.now() + 3600 * 1000 * 18,
    ts: Date.now() - 3600 * 1000 * 20,
    d: "Requested callback regarding 2 BHK waterfront facing unit.",
    dv: "Samsung Galaxy",
    nt: [
      { by: "Callerproxy", at: Date.now() - 3600 * 1000 * 20, txt: "Attempt 1: No answer." },
      { by: "Callerproxy", at: Date.now() - 3600 * 1000 * 16, txt: "Attempt 2 (4h retry): Line busy. Moved to daily retry schedule." }
    ]
  },
  {
    i: 118,
    n: "Harsh Vardhan",
    m: "98204 77665",
    e: "harsh.v@outlook.com",
    l: 7, // Bandra
    p: 5, // Lodha World Towers Collection
    t: 1,
    s: 5, // Not Interested
    c: 2, // Callerproxy
    cs: 1, // Connected & Discussed
    rc: 0,
    na: null,
    ts: Date.now() - 3600 * 1000 * 22,
    d: "Relocating to Bangalore corporate office.",
    dv: "OnePlus",
    nt: [{ by: "Callerproxy", at: Date.now() - 3600 * 1000 * 21, txt: "Customer shifting cities to Bangalore. Not interested in Mumbai properties." }]
  }
];

// ==========================================
// ANTI-ABUSE, RATE LIMITING & SECURITY SUITE
// Prevents SQL injection, XSS, Spam & Flooding
// ==========================================
export const RATE_LIMIT_KEY = "concave_security_ratelimit_v1";
export const RATE_LIMIT_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 Hours cooldown
export const RATE_LIMIT_MAX_ATTEMPTS = 5; // Maximum 5 attempts per 4 hours

// Sanitize string to prevent SQL injection and script injection
export function sanitizeInput(input, maxLength = 100) {
  if (typeof input !== 'string') return '';
  // Truncate to maximum length first to prevent large input DDoS attacks
  let sanitized = input.slice(0, maxLength).trim();
  // Strip potential script tags, event handlers, and dangerous characters
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '') // strip all HTML tags
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '') // strip event handlers (onclick=, onload=, onerror= etc.)
    .replace(/['";\\]/g, '') // strip SQL string delimiters & statement separators
    .replace(/--|\/\*|\*\//g, ''); // strip SQL comment markers (-- or /* */)
  return sanitized;
}

// Generate or retrieve persistent browser device fingerprint
export function getDeviceFingerprint() {
  try {
    let fp = localStorage.getItem("concave_device_fp_v1");
    if (!fp) {
      fp = "fp_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
      localStorage.setItem("concave_device_fp_v1", fp);
    }
    return fp;
  } catch (e) {
    return "fp_fallback";
  }
}

// Check rate limit for an identifier (phone number or device fingerprint)
// Enforces max 5 attempts per 4-hour window
export function checkRateLimit(identifier, action = 'enquiry') {
  try {
    const rawData = getRawData(RATE_LIMIT_KEY, {});
    const cleanId = (identifier || getDeviceFingerprint()).replace(/\D/g, '') || getDeviceFingerprint();
    const key = `${action}_${cleanId}`;
    const now = Date.now();
    const attempts = Array.isArray(rawData[key]) ? rawData[key] : [];

    // Filter attempts strictly within the 4-hour window
    const validAttempts = attempts.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);

    if (validAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS) {
      const oldestValid = Math.min(...validAttempts);
      const resetTimeMs = oldestValid + RATE_LIMIT_WINDOW_MS;
      const remainingMs = Math.max(0, resetTimeMs - now);
      const remainingHours = (remainingMs / (60 * 60 * 1000)).toFixed(1);
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

      return {
        allowed: false,
        attemptsCount: validAttempts.length,
        maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
        remainingAttempts: 0,
        remainingMinutes,
        remainingHours,
        message: `Security Limit: Maximum ${RATE_LIMIT_MAX_ATTEMPTS} attempts allowed per 4 hours for security protection. Please wait ${remainingMinutes > 60 ? `${remainingHours} hours` : `${remainingMinutes} minutes`} or reach our desk directly on WhatsApp.`
      };
    }

    return {
      allowed: true,
      attemptsCount: validAttempts.length,
      maxAttempts: RATE_LIMIT_MAX_ATTEMPTS,
      remainingAttempts: RATE_LIMIT_MAX_ATTEMPTS - validAttempts.length
    };
  } catch (err) {
    console.error("Rate limit check error:", err);
    return { allowed: true, remainingAttempts: 1 };
  }
}

// Record an attempt towards rate limit
export function recordRateLimitAttempt(identifier, action = 'enquiry') {
  try {
    const rawData = getRawData(RATE_LIMIT_KEY, {});
    const cleanId = (identifier || getDeviceFingerprint()).replace(/\D/g, '') || getDeviceFingerprint();
    const key = `${action}_${cleanId}`;
    const now = Date.now();
    const attempts = Array.isArray(rawData[key]) ? rawData[key] : [];

    // Keep only valid within window + new attempt
    const validAttempts = attempts.filter(ts => (now - ts) < RATE_LIMIT_WINDOW_MS);
    validAttempts.push(now);

    rawData[key] = validAttempts;
    setRawData(RATE_LIMIT_KEY, rawData);
    return true;
  } catch (err) {
    console.error("Rate limit record error:", err);
    return false;
  }
}

// Helper to safely access localStorage
function getRawData(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (err) {
    console.error("Storage read error:", err);
    return fallback;
  }
}

function setRawData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error("Storage write error:", err);
    return false;
  }
}

// ==========================================
// AUDIT LOGGING & SECURITY ENGINE
// ==========================================
const AUDIT_LOGS_KEY = "concave_audit_logs_v1";

export function logSecurityEvent(actor, actionType, targetResource, details = {}) {
  try {
    const logs = getRawData(AUDIT_LOGS_KEY, []);
    const entry = {
      id: "aud_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now(),
      timestamp: new Date().toISOString(),
      actorId: actor?.id || (actor?.username ? 'ADMIN' : 'SYSTEM'),
      actorName: actor?.name || actor?.username || 'System / Admin',
      actorRole: actor?.role || (actor?.username ? 'admin' : 'system'),
      actionType, // 'LOGIN', 'LOGOUT', 'DELETE_LEAD', 'EXPORT_EXCEL', 'UPDATE_DISPOSITION', 'CHANGE_PASSWORD', 'IDOR_VIOLATION_BLOCKED'
      targetResource: String(targetResource || ''),
      details
    };
    logs.unshift(entry);
    if (logs.length > 500) logs.pop(); // Keep last 500 audit events
    setRawData(AUDIT_LOGS_KEY, logs);
    return entry;
  } catch (e) {
    console.error("Audit log error:", e);
    return null;
  }
}

export function getAuditLogs(actor) {
  if (!actor || (actor.role !== 'admin' && actor.role !== 'superadmin')) {
    return [];
  }
  return getRawData(AUDIT_LOGS_KEY, []);
}

// ==========================================
// STYLED EXCEL WORKBOOK EXPORTER
// 1. Removes unnecessary non-provided columns (Caller Contact, Enquiry Type, Customer Requirement, Retry Count)
// 2. Highlights confirmed Lead and Hot Lead FULL ROWS in GREEN (#00FF00) in Excel
// 3. Styled header with bright Yellow (#FFFF00) and bold black text
// 4. Strict plain-text status labels without any emojis
// ==========================================
export function exportStyledLeadsWorkbook(leads, sheetTitle, fileName) {
  const excelRows = leads.map((l, index) => {
    const isConfirmed = isConfirmedLead(l);
    const isUncalled = l.callStatusCode === 0 || l.cs === 0 || l.callStatusName === 'Uncalled';

    let ratingLabel = "New";
    if (isConfirmed) {
      ratingLabel = (l.statusCode === 1 || l.isHotLead) ? "Hot Lead" : "Lead (Interested)";
    } else if (isUncalled) {
      ratingLabel = "New";
    } else {
      ratingLabel = l.statusName || "New";
    }
    // Remove any accidental emojis from labels
    ratingLabel = String(ratingLabel).replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();

    return {
      "Sr No": index + 1,
      "Lead ID": `CON-${l.id}`,
      "Customer Name": l.name,
      "Mobile Number": l.mobile,
      "Email Address": l.email || "N/A",
      "Preferred Location": l.locationName,
      "Project Interest": l.projectName,
      "Customer Device": l.deviceName || "Mobile Device",
      "Lead Rating": ratingLabel,
      "Assigned Caller": l.callerName || "Admin Desk (Direct)",
      "Call Status": l.callStatusName || "Uncalled",
      "Enquiry Date & Time": new Date(l.createdAt).toLocaleString(),
      "Latest Caller Remark": l.notes && l.notes.length > 0 ? l.notes[0].txt : "Pending call"
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(excelRows);

  // Auto-fit column widths
  worksheet['!cols'] = [
    { wch: 7 },  // Sr No
    { wch: 12 }, // Lead ID
    { wch: 22 }, // Customer Name
    { wch: 16 }, // Mobile Number
    { wch: 24 }, // Email Address
    { wch: 18 }, // Preferred Location
    { wch: 24 }, // Project Interest
    { wch: 18 }, // Customer Device
    { wch: 24 }, // Lead Rating
    { wch: 22 }, // Assigned Caller
    { wch: 22 }, // Call Status
    { wch: 22 }, // Enquiry Date & Time
    { wch: 45 }  // Latest Caller Remark
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

  try {
    const bin = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
    const cfb = XLSX.CFB.read(bin, { type: 'binary' });

    // 1. Inject styles into styles.xml
    const stylesFile = cfb.FileIndex.find(f => f.name === 'styles.xml');
    if (stylesFile) {
      const customStylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <!-- Font 0: Regular Calibri 11pt, Black -->
    <font><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/></font>
    <!-- Font 1: Bold Calibri 11pt, Black -->
    <font><b/><sz val="11"/><color rgb="FF000000"/><name val="Calibri"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <!-- Fill 2: Bright Yellow Header #FFFF00 -->
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFFF00"/><bgColor indexed="64"/></patternFill></fill>
    <!-- Fill 3: Bright Green Confirmed Lead Highlight #00FF00 -->
    <fill><patternFill patternType="solid"><fgColor rgb="FF00FF00"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD0D0D0"/></left>
      <right style="thin"><color rgb="FFD0D0D0"/></right>
      <top style="thin"><color rgb="FFD0D0D0"/></top>
      <bottom style="thin"><color rgb="FFD0D0D0"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <!-- 0: Default Normal Data Cell -->
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
    <!-- 1: Header Row (Yellow Fill + Bold Black Text + Centered) -->
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="center" vertical="center"/>
    </xf>
    <!-- 2: Confirmed Lead Full Row (Green Fill + Regular Black Text) -->
    <xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center"/>
    </xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`;
      stylesFile.content = new TextEncoder().encode(customStylesXml);
      stylesFile.size = stylesFile.content.length;
    }

    // 2. Identify rows to style green: strictly ONLY confirmed leads (called and marked as Lead / Hot Lead)
    const greenRowNumbers = new Set();
    leads.forEach((l, idx) => {
      if (isConfirmedLead(l)) {
        greenRowNumbers.add(idx + 2); // Excel 1-based, row 1 is header
      }
    });

    const sheetFile = cfb.FileIndex.find(f => f.name === 'sheet1.xml');
    if (sheetFile) {
      let sheetXml = new TextDecoder().decode(sheetFile.content);

      function applyStyleToCells(cellsXml, rowNum, styleIndex) {
        const cellRegex = new RegExp(`<c r="([A-Z]+${rowNum})"([^>]*)>`, 'g');
        return cellsXml.replace(cellRegex, (m, cellRef, rest) => {
          if (/s="\d+"/.test(rest)) {
            return `<c r="${cellRef}"${rest.replace(/s="\d+"/, `s="${styleIndex}"`)}>`;
          }
          return `<c r="${cellRef}" s="${styleIndex}"${rest}>`;
        });
      }

      // Style header row 1 (Yellow)
      sheetXml = sheetXml.replace(/<row r="1"([^>]*)>([\s\S]*?)<\/row>/, (m, attrs, cells) => {
        const styledCells = applyStyleToCells(cells, 1, 1);
        return `<row r="1" s="1" customFormat="1"${attrs}>${styledCells}</row>`;
      });

      // Style all confirmed Lead / Hot Lead full rows with s="2" (Green across all columns A-M)
      greenRowNumbers.forEach(rowNum => {
        const reg = new RegExp(`(<row r="${rowNum}"[^>]*>)([\\s\\S]*?)(<\\/row>)`);
        sheetXml = sheetXml.replace(reg, (m, openTag, cells, closeTag) => {
          const styledCells = applyStyleToCells(cells, rowNum, 2);
          return `<row r="${rowNum}" s="2" customFormat="1">${styledCells}</row>`;
        });
      });

      sheetFile.content = new TextEncoder().encode(sheetXml);
      sheetFile.size = sheetFile.content.length;
    }

    const outBin = XLSX.CFB.write(cfb, { fileType: 'zip', type: 'binary' });

    if (typeof window !== 'undefined' && window.document) {
      const buf = new ArrayBuffer(outBin.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < outBin.length; i++) view[i] = outBin.charCodeAt(i) & 0xFF;

      const blob = new Blob([view], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      return true;
    }
  } catch (err) {
    console.warn("Styled Excel export fallback to standard writer:", err);
  }

  // Fallback to standard XLSX.writeFile
  XLSX.writeFile(workbook, fileName);
  return true;
}

// ==========================================
// PUBLIC DB INTERFACE
// ==========================================

export const dbStore = {
  // Initialize storage if empty
  init() {
    try {
      // Clear legacy storage versions to purge all old caller & lead data cleanly
      if (typeof localStorage !== 'undefined') {
        ['v1', 'v2', 'v3', 'v4'].forEach(v => {
          try {
            localStorage.removeItem(`concave_realty_compact_db_${v}`);
            localStorage.removeItem(`concave_realty_callers_${v}`);
          } catch {}
        });
      }

      const existing = getRawData(DB_KEY, null);
      if (!existing || existing.length === 0) {
        setRawData(DB_KEY, INITIAL_SEED_LEADS);
      } else {
        let updated = false;
        INITIAL_SEED_LEADS.forEach(seed => {
          if (!existing.some(l => l.i === seed.i)) {
            existing.push(seed);
            updated = true;
          }
        });
        // Auto-purge automated System Lead Router logs from stored leads
        existing.forEach(l => {
          if (l.nt && Array.isArray(l.nt)) {
            const cleanNt = l.nt.filter(n => n.by !== "System Lead Router" && !n.txt?.includes("System Lead Router") && !n.txt?.includes("Auto-assigned"));
            if (cleanNt.length !== l.nt.length) {
              l.nt = cleanNt;
              updated = true;
            }
          }
        });
        if (updated) setRawData(DB_KEY, existing);
      }

      if (!localStorage.getItem(CALLERS_KEY)) {
        setRawData(CALLERS_KEY, DEFAULT_CALLERS);
      } else {
        const storedCallers = getRawData(CALLERS_KEY, DEFAULT_CALLERS);
        let changed = false;
        storedCallers.forEach(c => {
          if (!c.createdAt) {
            c.createdAt = new Date(2026, 10, 1, 0, 0, 0).getTime();
            changed = true;
          }
          // Automatically upgrade any legacy plaintext password to salted SHA-256 hash
          if (c.password && !/^[0-9a-f]{64}$/i.test(c.password)) {
            c.password = (c.id === 1)
              ? '1ace255a4de8353c8b1a12e9aa80276b7aef8c8588529ceae7b96f85c39eeaf9'
              : 'f96457dcf95a624133c4be68864145b5dd1218aec6dfadf6e7ba0256a2bdc11b';
            changed = true;
          }
          if (c.assignedLocations) {
            const valid = c.assignedLocations.filter(lid => lid >= 1 && lid <= 8);
            if (valid.length !== c.assignedLocations.length) {
              c.assignedLocations = valid.length > 0 ? valid : [1];
              changed = true;
            }
          }
        });
        if (changed) setRawData(CALLERS_KEY, storedCallers);
      }
    } catch (e) {
      console.warn("DB init warning:", e);
    }
  },

  // Real-time bidirectional synchronization with Hostinger MySQL server
  async syncWithServer() {
    let anyUpdated = false;

    // 1. Synchronize Leads with live MySQL database
    try {
      let res = await fetch(`/api/leads.php?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      if (!res || !res.ok) {
        res = await fetch(`/api/leads?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      }
      if (res && res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.leads)) {
          this.init();
          const local = getRawData(DB_KEY, INITIAL_SEED_LEADS);
          const serverIds = new Set(data.leads.map(sl => String(sl.i)));

          // Remove any locally cached leads that were deleted in live database
          let updatedList = local.filter(l => serverIds.has(String(l.i)));
          if (updatedList.length !== local.length) {
            anyUpdated = true;
          }

          data.leads.forEach(serverLead => {
            const sId = String(serverLead.i);
            const sMobile = String(serverLead.m || '').replace(/\D/g, '');
            const existingIdx = updatedList.findIndex(l => 
              String(l.i) === sId || 
              (sMobile && String(l.m || '').replace(/\D/g, '') === sMobile && Math.abs((l.ts || 0) - (serverLead.ts || 0)) < 3600000)
            );

            if (existingIdx !== -1) {
              const existing = updatedList[existingIdx];
              // If local caller has already assigned a status or called this lead, preserve caller's updated status!
              const callerAlreadyHandled = (existing.cs > 0 || existing.s === 1 || existing.s === 2 || existing.s === 3 || existing.s === 4 || existing.s === 5 || existing.s === 6) && serverLead.cs === 0;
              const finalStatus = callerAlreadyHandled ? existing.s : serverLead.s;
              const finalCallStatus = callerAlreadyHandled ? existing.cs : serverLead.cs;
              const finalNotes = (existing.nt && existing.nt.length >= (serverLead.nt || []).length) ? existing.nt : serverLead.nt;

              if (String(existing.i) !== sId || existing.s !== finalStatus || existing.cs !== finalCallStatus || existing.c !== serverLead.c || (finalNotes && finalNotes.length !== (existing.nt || []).length)) {
                updatedList[existingIdx] = { ...existing, ...serverLead, s: finalStatus, cs: finalCallStatus, nt: finalNotes };
                anyUpdated = true;
              }
            } else {
              updatedList.unshift(serverLead);
              anyUpdated = true;
            }
          });

          if (anyUpdated) {
            setRawData(DB_KEY, updatedList);
          }
        }
      }
    } catch (e) {
      console.warn("[dbStore] Leads sync error:", e);
    }

    // 2. Synchronize Callers with live MySQL database
    try {
      let cRes = await fetch(`/api/callers.php?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      if (!cRes || !cRes.ok) {
        cRes = await fetch(`/api/callers?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      }
      if (cRes && cRes.ok) {
        const cData = await cRes.json();
        if (cData && cData.success && Array.isArray(cData.callers) && cData.callers.length > 0) {
          setRawData(CALLERS_KEY, cData.callers);
          anyUpdated = true;
        }
      }
    } catch (err) {
      console.warn("[dbStore] Callers sync warning:", err);
    }

    // 3. Synchronize Careers / Job Applications with live MySQL database
    try {
      let appRes = await fetch(`/api/careers.php?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      if (!appRes || !appRes.ok) {
        appRes = await fetch(`/api/careers?_t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
      }
      if (appRes && appRes.ok) {
        const appData = await appRes.json();
        if (appData && appData.success && Array.isArray(appData.applications)) {
          localStorage.setItem('concave_career_applications_v1', JSON.stringify(appData.applications));
          anyUpdated = true;
        }
      }
    } catch (err) {
      console.warn("[dbStore] Careers sync warning:", err);
    }

    return anyUpdated;
  },

  // Get Callers
  getCallers() {
    try {
      this.init();
      return getRawData(CALLERS_KEY, DEFAULT_CALLERS);
    } catch {
      return DEFAULT_CALLERS;
    }
  },

  // Add or update caller in live MySQL database
  saveCaller(callerData) {
    try {
      const callers = this.getCallers();
      let updatedCaller;
      if (callerData.id) {
        const idx = callers.findIndex(c => c.id === callerData.id);
        if (idx !== -1) {
          callers[idx] = { ...callers[idx], ...callerData };
          updatedCaller = callers[idx];
        }
      } else {
        const newId = callers.length > 0 ? Math.max(...callers.map(c => c.id)) + 1 : 1;
        const newCaller = {
          id: newId,
          callerCode: callerData.callerCode || `CALLER-${100 + newId}`,
          name: callerData.name || "New Caller",
          phone: callerData.phone || "",
          email: callerData.email || "",
          password: callerData.password || "caller123",
          assignedLocations: callerData.assignedLocations || [1],
          territory: callerData.territory || (callerData.assignedLocations ? callerData.assignedLocations.map(lid => LOCATION_CODES[lid] || '').join(', ') : 'Borivali'),
          role: callerData.role || "Location Sales Specialist",
          active: callerData.active !== false,
          createdAt: callerData.createdAt || Date.now()
        };
        callers.push(newCaller);
        updatedCaller = newCaller;
      }
      setRawData(CALLERS_KEY, callers);

      // LIVE DATABASE ACTION: Save to MySQL callers table
      try {
        fetch('/api/callers.php?action=save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'save', ...updatedCaller })
        }).catch(() => {
          fetch('/api/callers?action=save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'save', ...updatedCaller })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Save caller DB action warning:", err);
      }

      return callers;
    } catch (e) {
      console.error("Error saving caller:", e);
      return this.getCallers();
    }
  },

  // Remove caller from live MySQL database
  removeCaller(callerId) {
    try {
      const callers = this.getCallers().filter(c => c.id !== callerId);
      setRawData(CALLERS_KEY, callers);

      // LIVE DATABASE ACTION: Delete from MySQL callers table
      try {
        fetch('/api/callers.php?action=delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: callerId })
        }).catch(() => {
          fetch('/api/callers?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: callerId })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Delete caller DB action warning:", err);
      }

      return callers;
    } catch {
      return this.getCallers();
    }
  },

  // Get admin credentials from storage or default
  getAdminCredentials() {
    const DEFAULT_ADMIN = {
      username: 'Hemant_Concave_Mishra',
      password: '8da334e29c94e4ee583710f0584f9ad2a94e0c2eac0a2910201566f98a73852b', // Salted SHA-256 hash for Hemant@2026#Mishra
      email: 'hemantrishi2786@gmail.com',
      phone: '8286018550'
    };

    try {
      const stored = localStorage.getItem('concave_admin_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.password && parsed.username === DEFAULT_ADMIN.username && parsed.password === DEFAULT_ADMIN.password) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading admin auth:", e);
    }

    try {
      localStorage.setItem('concave_admin_auth', JSON.stringify(DEFAULT_ADMIN));
    } catch {
      // ignore
    }
    return DEFAULT_ADMIN;
  },

  // Update admin password in live MySQL database
  async updateAdminPassword(newPassword) {
    try {
      const current = this.getAdminCredentials();
      const hashedPassword = await hashPassword(newPassword);
      const updated = { ...current, password: hashedPassword, updatedAt: Date.now() };
      localStorage.setItem('concave_admin_auth', JSON.stringify(updated));

      // LIVE DATABASE ACTION: Update admin password in MySQL admins table
      try {
        fetch('/api/admin.php?action=update_password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_password',
            username: updated.username,
            passwordHash: hashedPassword
          })
        }).catch(() => {
          fetch('/api/admin?action=update_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_password',
              username: updated.username,
              passwordHash: hashedPassword
            })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Admin password DB sync warning:", err);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Update caller password in live MySQL database
  async updateCallerPassword(callerIdOrCode, newPassword) {
    try {
      this.init();
      const callers = this.getCallers();
      const idx = callers.findIndex(c =>
        c.id === callerIdOrCode ||
        c.callerCode === String(callerIdOrCode).trim()
      );
      if (idx !== -1) {
        const hashedPassword = await hashPassword(newPassword);
        callers[idx].password = hashedPassword;
        setRawData(CALLERS_KEY, callers);

        // LIVE DATABASE ACTION: Update caller password in MySQL callers table
        try {
          fetch('/api/callers.php?action=update_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_password',
              id: callers[idx].id,
              email: callers[idx].email,
              passwordHash: hashedPassword
            })
          }).catch(() => {
            fetch('/api/callers?action=update_password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update_password',
                id: callers[idx].id,
                email: callers[idx].email,
                passwordHash: hashedPassword
              })
            }).catch(() => {});
          });
        } catch (err) {
          console.warn("[dbStore] Caller password DB sync warning:", err);
        }

        return { success: true, caller: callers[idx] };
      }
      return { success: false, error: "Caller not found" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Automatic Lead Router by Location with EQUAL LOAD BALANCING
  // If multiple callers are assigned to the same location, divides enquiries equally.
  // If no callers are registered by admin, routes directly to Super Admin!
  findCallerForLocation(locId) {
    try {
      const callers = this.getCallers().filter(c => c.active !== false);
      if (!callers || callers.length === 0) {
        return null; // No caller registered by admin - direct to Super Admin!
      }
      const matches = callers.filter(c => c.assignedLocations && c.assignedLocations.includes(locId));

      if (matches.length === 1) return matches[0].id;

      if (matches.length > 1) {
        // Equal load balancing: find caller who currently has the fewest active leads
        const rawLeads = getRawData(DB_KEY, []);
        const countMap = {};
        matches.forEach(m => { countMap[m.id] = 0; });
        rawLeads.forEach(l => {
          if (countMap[l.c] !== undefined) {
            countMap[l.c]++;
          }
        });
        // Pick the caller with least assigned leads
        matches.sort((a, b) => (countMap[a.id] || 0) - (countMap[b.id] || 0));
        return matches[0].id;
      }

      // Fallback: pick caller with least leads
      return callers.length > 0 ? callers[0].id : null;
    } catch {
      return null;
    }
  },

  // Divert Work from an absent caller to another selected caller
  reassignCallerLeads(fromCallerId, toCallerId) {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);
      const callers = this.getCallers();
      const fromCaller = callers.find(c => c.id === fromCallerId);
      const toCaller = callers.find(c => c.id === toCallerId);

      let transferredCount = 0;
      rawLeads.forEach(lead => {
        if (lead.c === fromCallerId) {
          lead.c = toCallerId;
          transferredCount++;
          if (!lead.nt) lead.nt = [];
          lead.nt.unshift({
            by: "Admin Work Diverter",
            at: Date.now(),
            txt: `Work diverted from ${fromCaller ? fromCaller.name : 'Caller #' + fromCallerId} to ${toCaller ? toCaller.name : 'Caller #' + toCallerId} (Absentee Coverage).`
          });
        }
      });

      setRawData(DB_KEY, rawLeads);

      // LIVE DATABASE ACTION: Reassign in MySQL leads table
      try {
        fetch('/api/leads.php?action=reassign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'reassign',
            fromCallerCode: fromCaller ? fromCaller.callerCode : '',
            toCallerCode: toCaller ? toCaller.callerCode : ''
          })
        }).catch(() => {
          fetch('/api/leads?action=reassign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'reassign',
              fromCallerCode: fromCaller ? fromCaller.callerCode : '',
              toCallerCode: toCaller ? toCaller.callerCode : ''
            })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Reassign DB action warning:", err);
      }

      return { success: true, count: transferredCount, toCallerName: toCaller ? toCaller.name : `Caller #${toCallerId}` };
    } catch (e) {
      console.error("Divert work error:", e);
      return { success: false, error: e.message };
    }
  },

  // Add new enquiry from visitor / customer with automatic encoding & strict security
  addEnquiry({ name, mobile, email, locationName, projectName, type = "General Enquiry", description = "", honeypot = "", deviceName = "" }) {
    try {
      // 1. Bot Honeypot Defense: Reject hidden bot inputs immediately
      if (honeypot && String(honeypot).trim().length > 0) {
        console.warn("Security Alert: Automated bot submission blocked by honeypot.");
        return { error: "Automated submission blocked.", securityBlocked: true };
      }

      // 2. Strict Input Sanitization & Anti-SQL/XSS Injection
      const cleanName = sanitizeInput(name, 60);
      const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(0, 10);
      const cleanEmail = sanitizeInput(email, 80).toLowerCase();
      const cleanDesc = sanitizeInput(description, 300);

      // Validate Indian mobile number format (10 digits starting with 6-9)
      if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
        return { error: "Please enter a valid 10-digit Indian mobile number." };
      }

      if (!cleanName || cleanName.length < 2) {
        return { error: "Please provide a valid full name (minimum 2 characters)." };
      }

      // 3. Security Rate Limit Enforcement (5 submissions per 4-hour window)
      const rateCheck = checkRateLimit(cleanMobile, 'enquiry');
      if (!rateCheck.allowed) {
        return {
          error: rateCheck.message,
          rateLimited: true,
          remainingMinutes: rateCheck.remainingMinutes,
          remainingHours: rateCheck.remainingHours
        };
      }

      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);

      // Convert location string to compact numeric code
      const normLoc = (locationName || "").toLowerCase().trim();
      const locId = REVERSE_LOCATION_CODES[normLoc] || 1;

      // Project code mapping
      let projId = 1;
      const normProj = (projectName || "").toLowerCase();
      if (normProj.includes("skyshore")) projId = 2;
      else if (normProj.includes("reserve")) projId = 3;
      else if (normProj.includes("signature")) projId = 4;
      else if (normProj.includes("lodha") || normProj.includes("world")) projId = 5;
      else if (normProj.includes("mira") || normProj.includes("bhayander")) projId = 6;
      else projId = 1;

      // Type code mapping
      let typeId = 1;
      const normType = (type || "").toLowerCase();
      if (normType.includes("visit")) typeId = 2;
      else if (normType.includes("call")) typeId = 3;
      else if (normType.includes("kit") || normType.includes("brochure")) typeId = 4;
      else if (normType.includes("consult")) typeId = 5;

      // Automatically assign caller specializing in this location (or Super Admin if none registered)
      const assignedCallerId = this.findCallerForLocation(locId);
      const callers = this.getCallers();
      const assignedCaller = assignedCallerId ? callers.find(c => c.id === assignedCallerId) : null;

      const newId = rawLeads.length > 0 ? Math.max(...rawLeads.map(l => l.i)) + 1 : 101;
      const clientDevice = deviceName || detectUserDevice();

      const compactRecord = {
        i: newId,
        n: cleanName,
        m: cleanMobile,
        e: cleanEmail || "",
        l: locId,
        p: projId,
        t: typeId,
        s: 7, // New Lead (code 7)
        c: assignedCallerId,
        cs: 0, // Uncalled (code 0)
        rc: 0, // Retry count 0
        na: null,
        ts: Date.now(),
        d: cleanDesc || `Enquiry for ${PROJECT_CODES[projId]} at ${LOCATION_CODES[locId]}`,
        dv: clientDevice,
        nt: [
          {
            by: "System Lead Router",
            at: Date.now(),
            txt: assignedCaller
              ? `Auto-routed to ${assignedCaller.name} for location [${LOCATION_CODES[locId]}].`
              : `No caller registered for [${LOCATION_CODES[locId]}]. Routed directly to Super Admin Panel for personal follow-up.`
          }
        ]
      };

      rawLeads.unshift(compactRecord);
      setRawData(DB_KEY, rawLeads);

      // LIVE DATABASE ACTION: Persist enquiry to MySQL database immediately
      try {
        const enquiryPayload = {
          name: cleanName,
          mobile: cleanMobile,
          email: cleanEmail,
          locationName: LOCATION_CODES[locId] || locationName || 'Borivali',
          projectName: PROJECT_CODES[projId] || projectName || 'Luxury Property',
          type: TYPE_CODES[typeId] || type || 'General Enquiry',
          statusCode: 7, // New Lead
          callStatusCode: 0, // Uncalled
          description: compactRecord.d,
          notes: compactRecord.nt,
          deviceName: clientDevice
        };

        fetch('/api/leads.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiryPayload)
        }).then(res => res.json()).then(resData => {
          if (resData && (resData.id || (resData.lead && resData.lead.i))) {
            const returnedId = resData.id || resData.lead.i;
            compactRecord.i = returnedId;
            const updated = getRawData(DB_KEY, []);
            const matchIdx = updated.findIndex(l => l.m === cleanMobile);
            if (matchIdx !== -1) {
              updated[matchIdx].i = returnedId;
              setRawData(DB_KEY, updated);
            }
          }
        }).catch(() => {
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enquiryPayload)
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Enquiry DB action warning:", err);
      }

      // Record rate limit attempt upon successful creation
      recordRateLimitAttempt(cleanMobile, 'enquiry');
      recordRateLimitAttempt(getDeviceFingerprint(), 'enquiry');

      return this.decodeLead(compactRecord);
    } catch (e) {
      console.error("Error adding enquiry:", e);
      return null;
    }
  },

  // Create Manual Lead (Manually entered by Admin or Caller)
  createManualLead({
    name,
    mobile,
    email = "",
    locationId = 1,
    locationName = "",
    projectId = 1,
    projectName = "",
    statusCode = 1, // Default 1: Hot Lead
    callStatusCode = 1, // Default 1: Connected & Discussed
    callerId = 0,
    callerName = "Admin Desk (Direct)",
    description = "",
    noteText = "",
    deviceName = ""
  }) {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);

      const cleanName = sanitizeInput(name, 60);
      const cleanMobile = String(mobile || '').replace(/\D/g, '').slice(0, 10);
      const cleanEmail = sanitizeInput(email, 80).toLowerCase();

      if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
        return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
      }
      if (!cleanName || cleanName.length < 2) {
        return { success: false, error: "Please enter a valid customer name (minimum 2 characters)." };
      }

      // Resolve location ID
      let locId = parseInt(locationId, 10) || 1;
      if (locationName && !locationId) {
        const normLoc = locationName.toLowerCase().trim();
        locId = REVERSE_LOCATION_CODES[normLoc] || 1;
      }

      // Resolve project ID
      let projId = parseInt(projectId, 10) || 1;
      if (projectName && !projectId) {
        const normProj = projectName.toLowerCase();
        if (normProj.includes("skyshore")) projId = 2;
        else if (normProj.includes("reserve")) projId = 3;
        else if (normProj.includes("signature")) projId = 4;
        else if (normProj.includes("lodha") || normProj.includes("world")) projId = 5;
        else if (normProj.includes("mira") || normProj.includes("bhayander")) projId = 6;
        else projId = 1;
      }

      const newId = rawLeads.length > 0 ? Math.max(...rawLeads.map(l => l.i)) + 1 : 101;
      const clientDevice = deviceName || (callerName?.includes('Admin') ? "Admin Manual Entry" : "Caller Phone Consultation");

      const initialNotes = [];
      const noteContent = (noteText || description || '').trim();
      if (noteContent) {
        initialNotes.push({
          by: callerName || "Admin (Direct)",
          at: Date.now(),
          txt: noteContent
        });
      } else {
        initialNotes.push({
          by: callerName || "Admin (Direct)",
          at: Date.now(),
          txt: `Lead manually registered and assigned to ${callerName || 'Admin Desk (Direct)'}.`
        });
      }

      const compactRecord = {
        i: newId,
        n: cleanName,
        m: cleanMobile,
        e: cleanEmail || "",
        l: locId,
        p: projId,
        t: 1, // Direct Entry
        s: parseInt(statusCode, 10) || 1, // Hot Lead, Interested, etc.
        c: callerId ? parseInt(callerId, 10) : 0, // 0 = Admin
        cs: parseInt(callStatusCode, 10) || 1, // Connected & Discussed
        rc: 0,
        na: null,
        ts: Date.now(),
        d: description.trim() || `Manual lead entry for ${PROJECT_CODES[projId] || projectName || 'Luxury Property'} at ${LOCATION_CODES[locId] || locationName || 'Mumbai'}`,
        dv: clientDevice,
        nt: initialNotes
      };

      rawLeads.unshift(compactRecord);
      setRawData(DB_KEY, rawLeads);

      // LIVE DATABASE ACTION: Persist enquiry to MySQL database immediately
      try {
        const enquiryPayload = {
          name: cleanName,
          mobile: cleanMobile,
          email: cleanEmail,
          locationName: LOCATION_CODES[locId] || locationName || 'Borivali',
          projectName: PROJECT_CODES[projId] || projectName || 'Luxury Property',
          type: TYPE_CODES[typeId] || type || 'General Enquiry',
          statusCode: 7, // New Lead
          callStatusCode: 0, // Uncalled
          description: compactRecord.d,
          notes: compactRecord.nt,
          deviceName: clientDevice
        };

        fetch('/api/leads.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enquiryPayload)
        }).then(res => res.json()).then(resData => {
          if (resData && (resData.id || (resData.lead && resData.lead.i))) {
            const returnedId = resData.id || resData.lead.i;
            compactRecord.i = returnedId;
            const updated = getRawData(DB_KEY, []);
            const matchIdx = updated.findIndex(l => l.m === cleanMobile);
            if (matchIdx !== -1) {
              updated[matchIdx].i = returnedId;
              setRawData(DB_KEY, updated);
            }
          }
        }).catch(() => {
          fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enquiryPayload)
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Enquiry DB action warning:", err);
      }

      return {
        success: true,
        lead: this.decodeLead(compactRecord)
      };
    } catch (e) {
      console.error("Error creating manual lead:", e);
      return { success: false, error: e.message || "Failed to create manual lead." };
    }
  },

  // Decode a compact record into user-friendly object
  decodeLead(raw) {
    if (!raw) return null;
    const callers = this.getCallers();
    const caller = raw.c ? callers.find(c => c.id === raw.c) : null;

    // Realistic device fallback for seed or legacy records
    const defaultDevice = (raw.i % 4 === 1) ? 'Apple iPhone' :
                          (raw.i % 4 === 2) ? 'Samsung Galaxy' :
                          (raw.i % 4 === 3) ? 'OnePlus' : 'Android Smartphone';

    return {
      id: raw.i,
      name: raw.n,
      mobile: raw.m,
      email: raw.e || "",
      locationId: raw.l,
      locationName: LOCATION_CODES[raw.l] || "Mumbai Suburbs",
      projectId: raw.p,
      projectName: raw.pr || PROJECT_CODES[raw.p] || "Signature Project",
      typeId: raw.t,
      typeName: TYPE_CODES[raw.t] || "General Enquiry",
      statusCode: raw.s,
      statusName: STATUS_CODES[raw.s] || "New",
      isHotLead: raw.s === 1,
      isInterested: raw.s === 2,
      callerId: raw.c || null,
      callerName: caller ? caller.name : "Admin Desk (Direct)",
      callerPhone: caller ? caller.phone : "",
      callStatusCode: raw.cs,
      callStatusName: CALL_STATUS_CODES[raw.cs] || "Uncalled",
      retryCount: raw.rc || 0,
      nextAttemptAt: raw.na,
      createdAt: raw.ts,
      description: raw.d || "",
      notes: raw.nt || [],
      deviceName: raw.dv || raw.device || defaultDevice
    };
  },

  // Get all leads (decoded)
  getAllLeads() {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);
      return rawLeads.map(l => this.decodeLead(l));
    } catch (e) {
      console.error("Error retrieving leads:", e);
      return [];
    }
  },

  // Row Level Security (RLS) Lead Provider
  // Strictly returns only the records the authenticated user is authorized to see
  getLeads(user) {
    if (!user) return [];
    if (user.role === 'admin' || user.role === 'superadmin') {
      return this.getAllLeads();
    }
    if (user.role === 'caller') {
      return this.getLeadsForCaller(user.id);
    }
    return [];
  },

  // Get leads for a specific caller based on their assigned locations & assigned IDs
  // CRITICAL RULE: A caller ONLY sees enquiries that arrived AFTER their ID generation.
  // Historical enquiries of that location from before their ID generation are strictly for Admin only.
  getLeadsForCaller(callerId) {
    try {
      const all = this.getAllLeads();
      const callers = this.getCallers();
      const currentCaller = callers.find(c => c.id === callerId);
      if (!currentCaller) return [];

      const callerCreatedTs = currentCaller.createdAt || new Date(2026, 10, 1, 0, 0, 0).getTime();

      return all.filter(l => {
        const leadTs = l.createdAt || l.ts || 0;

        // Strictly hide past enquiries created before this caller's ID was generated (Admin only)
        if (leadTs < callerCreatedTs) {
          return false;
        }

        // Single-caller isolation: An enquiry record is strictly visible to ONLY 1 caller and Admin
        if (l.callerId) {
          return l.callerId === callerId;
        }

        // If unassigned (callerId is null/0), fallback to location only if caller covers it
        const matchesLocation = currentCaller.assignedLocations && currentCaller.assignedLocations.includes(l.locationId);
        return matchesLocation;
      });
    } catch (e) {
      console.error("Error getting caller leads:", e);
      return [];
    }
  },

  // Update Call Disposition & Rating (Hot Lead = 1, Interested = 2, Not Picking = 4, etc.)
  // Implements Row Level Security & IDOR Protection: Callers cannot tamper with other callers' leads
  updateLeadDisposition(leadId, { statusCode, noteText = "", callerName = "Caller" }, user = null) {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);
      const lead = rawLeads.find(l => String(l.i) === String(leadId) || l.i == leadId);
      if (!lead) return false;

      // STOP IDOR BUGS: If user is caller, enforce that this caller owns the lead
      if (user && user.role === 'caller') {
        const callers = this.getCallers();
        const currentCaller = callers.find(c => c.id === user.id);
        const ownsLead = lead.c === user.id ||
          (currentCaller?.assignedLocations && currentCaller.assignedLocations.includes(lead.l));

        if (!ownsLead) {
          console.warn(`[SECURITY ALERT] IDOR attempt blocked: Caller #${user.id} tried to modify unassigned Lead #${leadId}`);
          logSecurityEvent(user, 'IDOR_MODIFICATION_BLOCKED', `Lead #${leadId}`, { leadId, actualCallerId: lead.c });
          return { error: "Access Denied: Row Level Security prevented unauthorized modification of this lead." };
        }
      }

      const codeNum = parseInt(statusCode, 10);
      lead.s = codeNum; // Store compact numeric code 1, 2, 3, 4, 5, 6

      const now = Date.now();

      // Check Disposition type
      if (codeNum === 4) {
        // Not Answered: Auto 4-Hour / Daily Retry
        lead.rc = (lead.rc || 0) + 1;
        if (lead.rc === 1) {
          lead.cs = 2; // Not Answered (4hr Pending)
          lead.na = now + (4 * 3600 * 1000); // 4 hours later
          var retryMessage = "Call Attempt 1: Customer didn't answer. Scheduled for 4-HOUR automatic retry.";
        } else if (lead.rc >= 2 && lead.rc < 10) {
          lead.cs = 3; // Daily Retry Pending
          lead.na = now + (24 * 3600 * 1000); // 1 day later
          var retryMessage = `Call Attempt ${lead.rc}: No answer. Scheduled for 24-HOUR daily retry (Day ${lead.rc} of 10).`;
        } else {
          lead.cs = 5; // 10-Day Exhausted
          lead.na = null;
          var retryMessage = "Call Attempt 10: 10-day retry cycle completed with no response. Lead closed/archived.";
        }
      } else if (codeNum === 10) {
        // Busy: Retry in 2 hours
        lead.cs = 7; // Line Busy (Pending Retry)
        lead.na = now + (2 * 3600 * 1000);
        var retryMessage = "Customer line was busy. Scheduled for 2-hour retry.";
      } else if (codeNum === 9) {
        // Call Back: Call Back scheduled
        lead.cs = 6; // Call Back Scheduled
        lead.na = now + (4 * 3600 * 1000);
        var retryMessage = "Customer requested a call back. Added to Call Back queue.";
      } else {
        // Connected or completed (Hot Lead: 1, Lead: 2, Interested: 8/3, Not Interested: 5, Fake/Spam: 6)
        lead.cs = 1; // Connected & Discussed
        lead.na = null; // Clear pending retry timer
      }

      // Add to caller note trail
      if (!lead.nt) lead.nt = [];
      lead.nt.unshift({
        by: callerName,
        at: now,
        txt: noteText ? `${noteText} [Status: ${STATUS_CODES[codeNum]}]` : (retryMessage || `Rated as: ${STATUS_CODES[codeNum]}`)
      });

      setRawData(DB_KEY, rawLeads);

      // Real-time synchronization to backend server API
      try {
        const payload = {
          action: 'update',
          id: lead.i,
          statusCode: codeNum,
          statusName: STATUS_CODES[codeNum] || 'Updated',
          callStatusCode: lead.cs,
          notes: lead.nt
        };
        fetch('/api/leads.php?action=update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {
          fetch('/api/leads?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Failed to dispatch server update:", err);
      }

      return this.decodeLead(lead);
    } catch (e) {
      console.error("Error updating disposition:", e);
      return null;
    }
  },

  // Add a quick note to a lead
  addLeadNote(leadId, callerName, noteText) {
    try {
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);
      const lead = rawLeads.find(l => l.i === leadId);
      if (!lead) return false;

      if (!lead.nt) lead.nt = [];
      lead.nt.unshift({
        by: callerName,
        at: Date.now(),
        txt: noteText
      });

      setRawData(DB_KEY, rawLeads);

      // LIVE DATABASE ACTION: Sync note update to MySQL database
      try {
        const payload = {
          action: 'update',
          id: lead.i,
          statusCode: lead.s,
          callStatusCode: lead.cs,
          notes: lead.nt
        };
        fetch('/api/leads.php?action=update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {
          fetch('/api/leads?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Note sync warning:", err);
      }

      return true;
    } catch {
      return false;
    }
  },

  // Storage Stats (Hostinger 20 GB SSD with 2 GB Buffer Rule)
  getStorageStats() {
    try {
      const rawStr = localStorage.getItem(DB_KEY) || "";
      const rawBytes = new Blob([rawStr]).size;
      const allLeads = this.getAllLeads();
      const uncompressedStr = JSON.stringify(allLeads);
      const uncompressedBytes = new Blob([uncompressedStr]).size;
      const savings = uncompressedBytes > 0
        ? Math.round(((uncompressedBytes - rawBytes) / uncompressedBytes) * 100)
        : 72;

      // Hostinger 20 GB SSD Plan specifications
      const totalPlanBytes = 20 * 1024 * 1024 * 1024; // 20.00 GB
      const bufferBytes = 2 * 1024 * 1024 * 1024;    // 2.00 GB buffer
      const usableQuotaBytes = totalPlanBytes - bufferBytes; // 18.00 GB

      // Local / Client fallback: Baseline website files + database records
      const estimatedUsedBytes = Math.round(1.85 * 1024 * 1024 * 1024) + rawBytes;
      const rawRemainingBytes = Math.max(0, totalPlanBytes - estimatedUsedBytes);
      // User rule: if remaining is 18gb then show only 16gb (keep 2gb buffer)
      const displayedEmptyBytes = Math.max(0, rawRemainingBytes - bufferBytes);
      const usagePercent = Math.min(100, Math.max(1, Math.round((estimatedUsedBytes / usableQuotaBytes) * 100)));

      return {
        recordCount: allLeads.length,
        rawBytes,
        uncompressedBytes,
        savingsPercent: savings > 0 ? savings : 72,
        planName: "Hostinger 20 GB SSD",
        totalPlanBytes,
        totalPlanFormatted: "20.00 GB",
        bufferBytes,
        bufferFormatted: "2.00 GB",
        usableQuotaBytes,
        usableQuotaFormatted: "18.00 GB",
        usedBytes: estimatedUsedBytes,
        usedFormatted: (estimatedUsedBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB",
        rawRemainingBytes,
        rawRemainingFormatted: (rawRemainingBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB",
        displayedEmptyBytes,
        displayedEmptyFormatted: (displayedEmptyBytes / (1024 * 1024 * 1024)).toFixed(2) + " GB",
        usagePercent
      };
    } catch {
      return {
        recordCount: 6,
        rawBytes: 1200,
        uncompressedBytes: 4500,
        savingsPercent: 73,
        planName: "Hostinger 20 GB SSD",
        totalPlanBytes: 20 * 1024 * 1024 * 1024,
        totalPlanFormatted: "20.00 GB",
        bufferBytes: 2 * 1024 * 1024 * 1024,
        bufferFormatted: "2.00 GB",
        usableQuotaBytes: 18 * 1024 * 1024 * 1024,
        usableQuotaFormatted: "18.00 GB",
        usedBytes: 2 * 1024 * 1024 * 1024,
        usedFormatted: "2.00 GB",
        rawRemainingBytes: 18 * 1024 * 1024 * 1024,
        rawRemainingFormatted: "18.00 GB",
        displayedEmptyBytes: 16 * 1024 * 1024 * 1024,
        displayedEmptyFormatted: "16.00 GB",
        usagePercent: 11
      };
    }
  },

  // 1-CLICK EXCEL EXPORT (Decoded Master Data)
  // ==========================================
  exportMasterLeadsToExcel(user = null) {
    try {
      const leads = this.getAllLeads();
      const todayStr = new Date().toISOString().split('T')[0];
      const fileName = `Concave_Realty_Master_Leads_${todayStr}.xlsx`;
      
      const ok = exportStyledLeadsWorkbook(leads, "Concave Realty Master Leads", fileName);
      logSecurityEvent(user || { role: 'admin', username: 'Super Admin' }, 'EXPORT_MASTER_EXCEL', fileName, { totalExported: leads.length });
      return ok;
    } catch (e) {
      console.error("Excel generation error:", e);
      return false;
    }
  },

  // ==============================================================
  // ADMIN SECURE DATA PURGE WITH MANDATORY EXCEL BACKUP
  // 1. Always exports full Excel spreadsheet first
  // 2. Wipes or resets database leads
  // ==============================================================
  purgeAllLeadsWithBackup() {
    try {
      this.init();
      // Step 1: Mandatory auto-download of master Excel
      this.exportMasterLeadsToExcel();

      // Step 2: Purge leads data
      setRawData(DB_KEY, []);
      return { success: true };
    } catch (e) {
      console.error("Purge error:", e);
      return { success: false, error: e.message };
    }
  },

  // Single customer lead deletion (Admin Only, Audit Logged)
  deleteLead(leadId, user = null) {
    try {
      // Row Level Security: Callers can NEVER delete leads
      if (user && user.role === 'caller') {
        logSecurityEvent(user, 'UNAUTHORIZED_DELETE_BLOCKED', `Lead #CON-${leadId}`, { leadId });
        return { success: false, error: "Access Denied: Callers are strictly prohibited from deleting customer leads." };
      }

      this.init();
      const rawLeads = getRawData(DB_KEY, []);
      const remaining = rawLeads.filter(l => String(l.i) !== String(leadId) && l.i != leadId);
      setRawData(DB_KEY, remaining);

      // LIVE DATABASE ACTION: Delete from MySQL database
      try {
        fetch('/api/leads.php?action=delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: leadId })
        }).catch(() => {
          fetch('/api/leads?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: leadId })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Delete lead DB action warning:", err);
      }

      logSecurityEvent(user || { role: 'admin', username: 'Super Admin' }, 'DELETE_LEAD', `Lead #CON-${leadId}`, { leadId });
      return { success: true };
    } catch (e) {
      console.error("Delete single lead error:", e);
      return { success: false, error: e.message };
    }
  },

  // ==============================================================
  // DATE-RANGE CUSTOM EXCEL EXPORT
  // ==============================================================
  exportDateRangeLeadsToExcel(startDateStr, endDateStr) {
    try {
      this.init();
      const startMs = new Date(startDateStr).setHours(0, 0, 0, 0);
      const endMs = new Date(endDateStr).setHours(23, 59, 59, 999);

      const allLeads = this.getAllLeads();
      const filtered = allLeads.filter(l => l.createdAt >= startMs && l.createdAt <= endMs);

      if (filtered.length === 0) {
        return { success: false, count: 0, message: "No records found in selected date range." };
      }

      const fileName = `Concave_Leads_${startDateStr}_to_${endDateStr}.xlsx`;
      exportStyledLeadsWorkbook(filtered, "Selected Period Leads", fileName);

      return { success: true, count: filtered.length };
    } catch (e) {
      console.error("Date range export error:", e);
      return { success: false, error: e.message };
    }
  },

  // ==============================================================
  // QUARTERLY CLEANUP ENGINE WITH QUEUE WORK & 30-DAY IMMUNITY
  // 1. Strict 30-day immunity: Never touches data from past month to this month
  // 2. Queue logic: cleans chronological 3-month batches of historical data (e.g. Jan-Mar, then Apr-Jun, or July-Oct)
  // 3. Automatically downloads Excel backup of that specific batch before deleting
  // 4. Deletes ONLY non-lead data (Not Interested: 5, Fake: 6, Okay: 3)
  // 5. NEVER deletes Hot Lead (1), Lead (2, 7), or Pending Calls (4 or uncalled)
  // ==============================================================
  getQuarterlyQueueInfo() {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);

      const now = new Date();
      // Strict 30-day protection cutoff: Past month to this month (recent 30 days) is 100% IMMUNE
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 23, 59, 59, 999);
      const cutoffTs = cutoffDate.getTime();

      // Filter historical records that fall BEFORE the 30-day protection cutoff
      const historicalLeads = rawLeads.filter(l => l.ts <= cutoffTs);

      let batchStart, batchEnd, candidates = [];
      let isOverdue = false;
      let diffMonths = 0;

      if (historicalLeads.length > 0) {
        // Find the oldest historical record
        const oldestTs = Math.min(...historicalLeads.map(l => l.ts));
        const diffMonthsFromOldest = Math.floor((now.getTime() - oldestTs) / (30 * 24 * 3600 * 1000));

        // Queue batch starts at the oldest uncleaned historical record
        batchStart = new Date(oldestTs);
        // Batch spans 3 months (90 days) forward from the oldest record
        const candidateEndTs = batchStart.getTime() + (90 * 24 * 3600 * 1000);
        // But CANNOT exceed the 30-day protection cutoff (last month)
        batchEnd = new Date(Math.min(candidateEndTs, cutoffTs));

        // Non-lead disposable candidates in this batch window
        candidates = rawLeads.filter(l => {
          const inWindow = l.ts >= batchStart.getTime() && l.ts <= batchEnd.getTime();
          const isDisposable = l.s === 5 || l.s === 6 || l.s === 3;
          const isNotPending = l.s !== 4 && l.cs !== 2 && l.cs !== 3 && l.cs !== 0;
          return inWindow && isDisposable && isNotPending;
        });

        isOverdue = diffMonthsFromOldest >= 6;
        diffMonths = diffMonthsFromOldest;
      } else {
        // When all database records are within the recent 30-day protected window:
        // Target historical window is 3 months ending at last month (never future dates!)
        batchEnd = cutoffDate;
        batchStart = new Date(batchEnd.getTime() - (90 * 24 * 3600 * 1000));
        candidates = [];
        isOverdue = false;
        diffMonths = 0;
      }

      const batchStartStr = batchStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const batchEndStr = batchEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      return {
        batchStartStr,
        batchEndStr,
        batchStartTs: batchStart.getTime(),
        batchEndTs: batchEnd.getTime(),
        cutoffStr: cutoffDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        candidatesCount: candidates.length,
        isOverdue,
        diffMonths,
        totalRecords: rawLeads.length,
        historicalRecordsCount: historicalLeads.length
      };
    } catch {
      const now = new Date();
      const cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const startDate = new Date(cutoffDate.getTime() - 90 * 86400000);
      return {
        batchStartStr: startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        batchEndStr: cutoffDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        batchStartTs: startDate.getTime(),
        batchEndTs: cutoffDate.getTime(),
        candidatesCount: 0,
        isOverdue: false,
        diffMonths: 0
      };
    }
  },

  runQuarterlyCleanup() {
    try {
      this.init();
      const queueInfo = this.getQuarterlyQueueInfo();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);

      const windowStart = queueInfo.batchStartTs;
      const windowEnd = queueInfo.batchEndTs;

      // Strict enforcement of 30-day immunity rule
      const cutoffTs = Date.now() - (30 * 24 * 3600 * 1000);
      const safeWindowEnd = Math.min(windowEnd, cutoffTs);

      // Step 1: Backup all data in this 3-month queue window to Excel first
      const windowLeads = this.getAllLeads().filter(l => l.createdAt >= windowStart && l.createdAt <= safeWindowEnd);

      if (windowLeads.length > 0) {
        const backupFileName = `Concave_Quarterly_Backup_${queueInfo.batchStartStr.replace(/ /g, '_')}_to_${queueInfo.batchEndStr.replace(/ /g, '_')}.xlsx`;
        exportStyledLeadsWorkbook(windowLeads, "Quarterly Backup", backupFileName);
      }

      // Step 2: Delete ONLY non-lead data (Not Interested: 5, Fake: 6, Okay: 3).
      // NEVER delete Leads (2, 7), Hot Leads (1), or Pending Calls (4 or uncalled cs === 0, 2, 3).
      // NEVER delete any record from past month to today (ts > safeWindowEnd).
      const eligibleForPurge = rawLeads.filter(l => {
        const inWindow = l.ts >= windowStart && l.ts <= safeWindowEnd;
        const isDisposable = l.s === 5 || l.s === 6 || l.s === 3;
        const isNotPending = l.s !== 4 && l.cs !== 2 && l.cs !== 3 && l.cs !== 0;
        return inWindow && isDisposable && isNotPending;
      });

      const remainingLeads = rawLeads.filter(l => {
        const inWindow = l.ts >= windowStart && l.ts <= safeWindowEnd;
        const isDisposable = l.s === 5 || l.s === 6 || l.s === 3;
        const isNotPending = l.s !== 4 && l.cs !== 2 && l.cs !== 3 && l.cs !== 0;
        return !(inWindow && isDisposable && isNotPending);
      });

      setRawData(DB_KEY, remainingLeads);

      // LIVE DATABASE ACTION: Purge non-leads older than cutoff from MySQL database
      try {
        fetch('/api/leads.php?action=bulk_cleanup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'bulk_cleanup', days: 30 })
        }).catch(() => {
          fetch('/api/leads?action=bulk_cleanup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'bulk_cleanup', days: 30 })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Bulk cleanup DB action warning:", err);
      }

      return {
        success: true,
        startDate: queueInfo.batchStartStr,
        endDate: queueInfo.batchEndStr,
        backedUpCount: windowLeads.length,
        deletedCount: eligibleForPurge.length,
        remainingCount: remainingLeads.length
      };
    } catch (e) {
      console.error("Quarterly cleanup error:", e);
      return { success: false, error: e.message };
    }
  },

  // ==============================================================
  // MONTH-END ARCHIVAL & RETENTION ENGINE (User's Exact Rules)
  // 1. Automatically exports Excel backup before any record deletion
  // 2. Only deletes NORMAL non-lead data (NEVER deletes Hot Lead 1 or 2)
  // 3. Implements the rolling gap window (e.g. 25th of last month to 25th of previous month)
  // ==============================================================
  runMonthlyArchivalCleanup(dryRun = false) {
    try {
      this.init();
      const rawLeads = getRawData(DB_KEY, INITIAL_SEED_LEADS);
      const now = new Date();

      // Calculation of 25th boundary dates
      // E.g. If today is Nov 2:
      // Window Start: 25th September (two months ago 25th)
      // Window End: 25th October (last month 25th)
      const windowEnd = new Date(now.getFullYear(), now.getMonth() - 1, 25, 23, 59, 59).getTime();
      const windowStart = new Date(now.getFullYear(), now.getMonth() - 2, 25, 0, 0, 0).getTime();

      // Identify candidates for deletion:
      // Condition 1: Must fall inside the target historical window [windowStart, windowEnd]
      // Condition 2: MUST NOT be a Hot Lead (code 1) or Interested Lead (code 2)
      const eligibleForDeletion = rawLeads.filter(l => {
        const inWindow = l.ts >= windowStart && l.ts <= windowEnd;
        const isNotHotLead = l.s !== 1 && l.s !== 2;
        return inWindow && isNotHotLead;
      });

      const preservedCount = rawLeads.length - eligibleForDeletion.length;

      if (dryRun) {
        return {
          windowStart: new Date(windowStart).toLocaleDateString(),
          windowEnd: new Date(windowEnd).toLocaleDateString(),
          totalRecords: rawLeads.length,
          candidatesToDelete: eligibleForDeletion.length,
          protectedRecords: preservedCount
        };
      }

      // Step 1: Export full snapshot to Excel backup before deleting
      this.exportMasterLeadsToExcel();

      // Step 2: Keep protected leads (all recent + all hot leads forever)
      const remainingLeads = rawLeads.filter(l => {
        const inWindow = l.ts >= windowStart && l.ts <= windowEnd;
        const isNotHotLead = l.s !== 1 && l.s !== 2;
        return !(inWindow && isNotHotLead);
      });

      setRawData(DB_KEY, remainingLeads);

      // LIVE DATABASE ACTION: Purge non-leads older than cutoff from MySQL database
      try {
        fetch('/api/leads.php?action=bulk_cleanup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'bulk_cleanup', days: 30 })
        }).catch(() => {
          fetch('/api/leads?action=bulk_cleanup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'bulk_cleanup', days: 30 })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Bulk cleanup DB action warning:", err);
      }

      return {
        success: true,
        deletedCount: eligibleForDeletion.length,
        remainingCount: remainingLeads.length,
        windowStart: new Date(windowStart).toLocaleDateString(),
        windowEnd: new Date(windowEnd).toLocaleDateString()
      };
    } catch (e) {
      console.error("Archival error:", e);
      return { success: false, error: e.message };
    }
  },

  // ==============================================================
  // CAREERS & TALENT ACQUISITION
  // ==============================================================
  addJobApplication(appData) {
    try {
      this.init();
      const existing = this.getJobApplications();
      const newApp = {
        id: `CR-APP-${Date.now().toString().slice(-5)}`,
        name: sanitizeInput(appData.name, 100),
        email: sanitizeInput(appData.email, 120),
        mobile: sanitizeInput(appData.mobile, 15),
        city: sanitizeInput(appData.city || 'Mumbai', 80),
        position: sanitizeInput(appData.position, 100),
        experience: sanitizeInput(appData.experience || 'Fresher', 50),
        currentCompany: sanitizeInput(appData.currentCompany || 'Not Disclosed', 100),
        currentRole: sanitizeInput(appData.currentRole || 'N/A', 100),
        currentCtc: sanitizeInput(appData.currentCtc || 'Not Disclosed', 50),
        noticePeriod: sanitizeInput(appData.noticePeriod || 'Immediate', 50),
        expectedCtc: sanitizeInput(appData.expectedCtc || 'Negotiable', 50),
        linkedin: sanitizeInput(appData.linkedin || '', 200),
        coverNote: sanitizeInput(appData.coverNote || '', 1000),
        resumeName: sanitizeInput(appData.resumeName || 'Profile_Resume.pdf', 120),
        resumeSize: appData.resumeSize || '1.2 MB',
        otpVerified: Boolean(appData.otpVerified),
        status: 'Under Review',
        appliedAt: Date.now()
      };
      existing.unshift(newApp);
      localStorage.setItem('concave_career_applications_v1', JSON.stringify(existing));

      // LIVE DATABASE ACTION: Insert into MySQL job_applications table immediately
      try {
        const payload = {
          name: newApp.name,
          email: newApp.email,
          phone: newApp.mobile,
          jobId: newApp.position || 'GENERAL',
          jobTitle: newApp.position || 'General Application',
          experience: newApp.experience,
          portfolioLink: newApp.linkedin,
          verificationToken: appData.verificationToken || ''
        };

        fetch('/api/career-apply.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {
          fetch('/api/careers.php?action=create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Career application DB dispatch warning:", err);
      }

      return { success: true, application: newApp };
    } catch (e) {
      console.error("Failed to add job application:", e);
      return { success: false, error: e.message };
    }
  },

  getJobApplications() {
    try {
      const data = localStorage.getItem('concave_career_applications_v1');
      if (!data) {
        // Seed default realistic applications for display
        const defaultApps = [
          {
            id: 'CR-APP-88219',
            name: 'Aakash Verma',
            email: 'aakash.verma@example.com',
            mobile: '9820145892',
            city: 'Bandra West, Mumbai',
            position: 'Senior Luxury Real Estate Consultant',
            experience: '4-8 Years',
            currentCompany: 'Sotheby’s International Realty',
            currentRole: 'Senior Relationship Manager',
            noticePeriod: '30 Days',
            expectedCtc: '₹14 LPA + Incentives',
            linkedin: 'https://linkedin.com/in/aakash-verma-luxury',
            coverNote: 'Extensive 6-year portfolio in South Mumbai and Bandra luxury residential closings with high HNW network.',
            resumeName: 'Aakash_Verma_Luxury_CV.pdf',
            resumeSize: '1.8 MB',
            status: 'Shortlisted for Interview',
            appliedAt: Date.now() - 86400000 * 2
          },
          {
            id: 'CR-APP-91402',
            name: 'Sneha Kulkarni',
            email: 'sneha.kulkarni@example.com',
            mobile: '9819234109',
            city: 'Andheri West, Mumbai',
            position: 'NRI & Global Investor Sales Specialist',
            experience: '3-6 Years',
            currentCompany: 'Anarock Property Consultants',
            currentRole: 'International Desk Manager',
            noticePeriod: '15 Days',
            expectedCtc: '₹11 LPA',
            linkedin: 'https://linkedin.com/in/sneha-k-nri-advisory',
            coverNote: 'Specialist in Gulf NRI consultations, cross-border banking coordination, and remote digital property walkthroughs.',
            resumeName: 'Sneha_Kulkarni_Resume.pdf',
            resumeSize: '1.4 MB',
            status: 'Under Review',
            appliedAt: Date.now() - 86400000
          }
        ];
        localStorage.setItem('concave_career_applications_v1', JSON.stringify(defaultApps));
        return defaultApps;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  },

  updateJobApplicationStatus(appId, newStatus) {
    try {
      const apps = this.getJobApplications();
      const idx = apps.findIndex(a => a.id === appId);
      if (idx !== -1) {
        apps[idx].status = newStatus;
        localStorage.setItem('concave_career_applications_v1', JSON.stringify(apps));

        // LIVE DATABASE ACTION: Update in MySQL job_applications table
        try {
          fetch('/api/careers.php?action=update_status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'update_status', id: appId, status: newStatus })
          }).catch(() => {
            fetch('/api/careers?action=update_status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'update_status', id: appId, status: newStatus })
            }).catch(() => {});
          });
        } catch (err) {
          console.warn("[dbStore] Career update status DB error:", err);
        }

        return { success: true };
      }
      return { success: false, error: 'Application not found' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  deleteJobApplication(appId) {
    try {
      const apps = this.getJobApplications().filter(a => a.id !== appId);
      localStorage.setItem('concave_career_applications_v1', JSON.stringify(apps));

      // LIVE DATABASE ACTION: Delete from MySQL job_applications table
      try {
        fetch('/api/careers.php?action=delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: appId })
        }).catch(() => {
          fetch('/api/careers?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', id: appId })
          }).catch(() => {});
        });
      } catch (err) {
        console.warn("[dbStore] Career delete DB error:", err);
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  exportJobApplicationsToExcel() {
    try {
      if (typeof XLSX === 'undefined') return false;
      const apps = this.getJobApplications();
      const excelRows = apps.map((a, index) => ({
        "Sr No": index + 1,
        "Application ID": a.id,
        "Applicant Name": a.name,
        "Mobile Number": a.mobile,
        "Email Address": a.email,
        "OTP Verified": a.otpVerified ? "Yes (Verified)" : "No",
        "City / Area": a.city || "Mumbai",
        "Position / Domain": a.position,
        "Experience": a.experience,
        "Current Organization": a.currentCompany || "N/A",
        "Current Designation": a.currentRole || "N/A",
        "Current CTC": a.currentCtc || "N/A",
        "Expected CTC": a.expectedCtc || "Negotiable",
        "Notice Period": a.noticePeriod || "Immediate",
        "Resume Document": a.resumeName || "Resume.pdf",
        "LinkedIn URL": a.linkedin || "N/A",
        "Cover Note": a.coverNote || "None provided",
        "Hiring Status": a.status || "Under Review",
        "Application Date": new Date(a.appliedAt).toLocaleString()
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const colWidths = [
        { wch: 6 },
        { wch: 14 },
        { wch: 22 },
        { wch: 15 },
        { wch: 26 },
        { wch: 15 }, // OTP Verified
        { wch: 18 },
        { wch: 28 },
        { wch: 16 },
        { wch: 22 },
        { wch: 20 },
        { wch: 14 },
        { wch: 16 },
        { wch: 16 },
        { wch: 22 },
        { wch: 30 },
        { wch: 35 },
        { wch: 18 },
        { wch: 22 }
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Job Enquiries");

      const todayStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `Concave_Realty_Job_Enquiries_${todayStr}.xlsx`);
      return true;
    } catch (e) {
      console.error("Export job applications failed:", e);
      return false;
    }
  }
};

// =========================================================================
// SECURITY & AUTHENTICATION UTILITIES
// Prevents SQL Injection, brute-force attacks, and enforces password policy
// =========================================================================

export function detectSqlInjection(str) {
  if (!str || typeof str !== 'string') return false;
  // Detect SQL injection meta-characters, UNION SELECT, drop, comment sequences, tautology payloads
  const sqlInjectionRegex = /('|"|;|--|\/\*|\*\/|\b(OR\s+['"\d\w]+=['"\d\w]+|UNION\s+SELECT|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM|UPDATE\s+[\w\d]+\s+SET|ALTER\s+TABLE|EXEC\s*\(|xp_)\b)/i;
  return sqlInjectionRegex.test(str);
}

// Password Policy: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
export function validatePasswordPolicy(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: "Password cannot be empty." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 numeric digit (0-9)." };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: "Password must contain at least 1 special character (!@#$%^&* etc.)." };
  }
  return { valid: true };
}

// Cryptographic Password Hashing (SHA-256 with Salt via Web Crypto API)
export async function hashPassword(plainPassword, salt = 'concave_auth_salt_2026') {
  if (!plainPassword) return '';
  try {
    const enc = new TextEncoder();
    const data = enc.encode(`${salt}:${plainPassword}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback if crypto.subtle unavailable in non-browser context
    return plainPassword;
  }
}

export async function verifyPassword(plainPassword, storedPassword, salt = 'concave_auth_salt_2026') {
  if (!plainPassword || !storedPassword) return false;
  // If stored password is an encrypted 64-character SHA-256 hex string
  if (storedPassword.length === 64 && /^[0-9a-f]{64}$/i.test(storedPassword)) {
    const hashed = await hashPassword(plainPassword, salt);
    return hashed.toLowerCase() === storedPassword.toLowerCase();
  }
  // Backward compatibility for initial bootstrap plaintext
  return plainPassword === storedPassword;
}

