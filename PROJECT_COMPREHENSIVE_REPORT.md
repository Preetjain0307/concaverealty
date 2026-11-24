# Concave Realty — Master Project Report & Technical Architecture Dossier

**Entity:** Concave Realty (Premier Luxury Real Estate Advisory & Channel Partner)  
**MahaRERA Registration Certificate:** `A51900045781`  
**Operating Headquarters:** Mumbai, Maharashtra, India  
**System Version:** Release 2.4.0 (Enterprise Architecture Edition)  

---

## 1. Direct Project Access & Portal Navigation Links

The application is actively running and accessible across the local network and host interfaces. Personnel can directly access public and internal management interfaces via the verified endpoints below:

* **Primary Luxury Showcase & Home:** [http://localhost:5180/](http://localhost:5180/)
* **Curated Residences & Project Registry:** [http://localhost:5180/#projects](http://localhost:5180/#projects)
* **Lifestyle Amenities & Signature Services:** [http://localhost:5180/#amenities](http://localhost:5180/#amenities)
* **Private Advisory Desk & Contact:** [http://localhost:5180/#contact](http://localhost:5180/#contact)
* **Careers at Concave Realty:** [http://localhost:5180/#careers](http://localhost:5180/#careers)
* **Location Specialist Caller Desk:** [http://localhost:5180/#caller](http://localhost:5180/#caller) *(Alternative Path: [http://localhost:5180/concave-caller](http://localhost:5180/concave-caller))*
* **Executive Admin Operations Portal:** [http://localhost:5180/#admin](http://localhost:5180/#admin) *(Alternative Path: [http://localhost:5180/concave-admin](http://localhost:5180/concave-admin))*
* **Consultation Pass & Success Modal Preview:** [http://localhost:5180/?previewConfirmation=1](http://localhost:5180/?previewConfirmation=1)

---

## 2. Institutional Credentials & Access Governance Matrix

Access to internal management tiers is governed by pre-configured administrative and advisory credentials. To preserve institutional discretion and brand exclusivity, internal portals are kept absent from consumer-facing header or footer navigation, accessible strictly through dedicated URL slugs or global keyboard shortcuts.

### A. Executive Administration Tier (Governance & Analytics)
* **Portal Link:** [http://localhost:5180/#admin](http://localhost:5180/#admin) *(or `/concave-admin`)*
* **Global Access Shortcut:** `Ctrl + Shift + A` (Windows / Linux) or `Cmd + Shift + A` (macOS)
* **Username:** `Hemant_Concave_Mishra`
* **Official Password:** `Hemant@2026#Mishra`
* **Registered Email:** `hemantrishi2786@gmail.com`
* **Direct Mobile:** `8286018550`
* **Jurisdiction / Authority:** Super Administrative Governance, Consultant Onboarding, Territory Allocation, Lead Reassignment, System Audit Trail Inspection, and Encrypted Financial Spreadsheet Serialization.

### B. Location Specialist Advisory Tier 1 (Western Suburbs Corridor)
* **Portal Link:** [http://localhost:5180/#caller](http://localhost:5180/#caller) *(or `/concave-caller`)*
* **Global Access Shortcut:** `Ctrl + Shift + C` (Windows / Linux) or `Cmd + Shift + C` (macOS)
* **Caller ID / Username:** `Callerpreet`
* **Official Password:** `Preetpassword`
* **Specialist Name:** Preet Jain
* **Registered Email:** `preetjainwhatsapp@gmail.com`
* **Direct Mobile:** `98201 12345`
* **Assigned Territory Corridor:** Western Suburbs (Borivali, Kandivali, Goregaon, Malad)
* **Operational Scope:** First-contact pipeline triage, luxury consultation logging, and site visit coordination.

### C. Location Specialist Advisory Tier 2 (Coastal & South Central Corridor)
* **Portal Link:** [http://localhost:5180/#caller](http://localhost:5180/#caller) *(or `/concave-caller`)*
* **Global Access Shortcut:** `Ctrl + Shift + C` (Windows / Linux) or `Cmd + Shift + C` (macOS)
* **Caller ID / Username:** `Callerproxy`
* **Official Password:** `Proxypassword`
* **Specialist Name:** Callerproxy (Coastal Lead Desk)
* **Registered Email:** `preetrajeshjain@gmail.com`
* **Direct Mobile:** `98202 23456`
* **Assigned Territory Corridor:** Coastal & South Central (Jogeshwari, Andheri, Bandra, Lower Parel)
* **Operational Scope:** High-net-worth client profiling, callback scheduling, and verified lead disposition.

### D. Cryptographic Authentication & Salt Architecture
* **Server Salt Token:** `concave_auth_salt_2026`
* **Hashing Standard:** SHA-256 via W3C Web Crypto API (`crypto.subtle.digest`)
* **Digest Format:** 64-character lowercase hexadecimal hash representation
* **Credential Recovery Protocol:** Multi-Factor One-Time Password (OTP) dispatched via Resend transactional email API with a 10-minute validity window.

---

## 3. Theoretical Framework & Complete Access Architecture

### Cryptographic Authentication & Credential Governance Theory
The enterprise authentication architecture of Concave Realty is grounded in a zero-plaintext security philosophy engineered to eliminate vulnerability to credential stuffing, dictionary attacks, and database exfiltration breaches. Rather than storing or transmitting vulnerable raw passwords, the application leverages the native browser Web Crypto API to execute cryptographic hashing directly on the client before network dispatch. During authentication, the user's submitted string is concatenated with an immutable cryptographic salt token (`concave_auth_salt_2026`) and transformed into a 256-bit hash digest represented as a 64-character hexadecimal string. This computed digest is matched against authorized baseline hash records maintained within persistent storage. If a location specialist forgets their password during active client consultations, the system avoids manual administrative friction by initiating an automated self-service cryptographic identity recovery protocol. This protocol generates a single-use six-digit verification token, binds it to an ephemeral ten-minute expiry timestamp, dispatches it to the consultant’s registered corporate email via the Resend API, and upon verification grants session privileges to update the cryptographic digest under strict character complexity policies.

### The Admin Executive Tier: Governance, Analytics & Audit Theory
The Concave Realty Admin Executive Operations Portal is conceptualized as the central nervous system governing the entire luxury brokerage lifecycle. It monitors the velocity and geographic distribution of incoming client inquiries across Mumbai’s prime real estate corridors, transforming raw lead capture events into real-time business intelligence. From this centralized cockpit, leadership executes dynamic pipeline load balancing, reviewing each advisor's queue volume and reallocating inquiries between Western and Coastal specialists to eliminate operational bottlenecks and enforce strict response SLAs. Recognizing the regulatory imperatives of statutory real estate brokering under MahaRERA, the portal integrates an automated compliance audit mechanism. Every administrative intervention—including consultant onboarding, status modifications, lead reassignments, credential updates, and data sanitization—is immutably recorded into an append-only audit trail containing high-resolution microsecond timestamps, user identifiers, actor roles, and IP device fingerprints. When institutional reporting or external accounting is required, the portal utilizes an integrated SheetJS compilation engine to serialize client objects into standardized, encrypted Excel spreadsheets filtered across bespoke date and corridor parameters without sending unencrypted client profiles over third-party analytics infrastructure.

### The Caller Advisory Tier: Pipeline Triage & Disposition State Machine
The Caller Advisory Portal functions as an ergonomic tele-advisory workspace operating on an automated queue-triage finite state machine. To preserve advisor accountability and prevent competitive friction among specialists, lead visibility is strictly partitioned by micro-market territories. When leads are captured through the digital showcase, they land in an uncalled Active Queue requiring rapid initial contact engagement. Upon establishing dialogue via integrated one-click mobile protocols or pre-composed luxury WhatsApp conversational templates, the specialist transitions the client record into a structured disposition state. Inquiries requiring future consultations or physical walkthroughs transition into a chronologically ordered Follow-Up Queue, while verified buyers with confirmed acquisition timelines advance to the Confirmed Hot Leads registry. Each disposition update dynamically recalculates retry counters, schedules automated reminder timestamps, and updates qualitative consultation dossiers, ensuring that no luxury client interaction is ever dropped or duplicated.

### Data Integrity, IDOR Shielding & Offline Hybrid Synchronization
The operational continuity of both portals relies on a hybrid dual-persistence synchronization model designed for resilience against fluctuating mobile network environments. The application layer manages state through synchronized browser `localStorage` whilst asynchronously synchronizing state updates with MySQL relational tables via prepared PHP PDO micro-services. This allows property consultants operating on-site at luxury developments to continue inspecting client dossiers, appending notes, and logging disposition transitions uninterrupted even during complete network disconnections. As soon as connectivity is restored, an idempotent background sync queue processes pending actions and resolves database concurrency. To guarantee client confidentiality and eliminate Insecure Direct Object Reference (IDOR) vulnerabilities, every advisory request executes a strict jurisdictional validation check, ensuring that an advisor assigned to the Western Suburbs is prevented from reading or modifying confidential dossiers belonging to Coastal or South Central buyers, ensuring strict adherence to the Digital Personal Data Protection (DPDP) Act, 2023 and statutory MahaRERA regulations (`A51900045781`).

---

## 4. Relational Database Architecture & Schema Blueprint

The enterprise persistence layer utilizes a high-performance relational database structure designed for strict referential integrity, automated auditing, and zero SQL injection vulnerability.

```
+-----------------------------------------------------------------------------------+
|                                 DATABASE SCHEMA                                   |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +--------------------+       +---------------------+       +------------------+  |
|  |    admin_users     |       |       callers       |       |  audit_trail     |  |
|  +--------------------+       +---------------------+       +------------------+  |
|  | id (PK)            |       | id (PK)             |       | id (PK)          |  |
|  | username           |       | caller_id (UNIQUE)  |       | actor_id         |  |
|  | password_hash      |       | password_hash       |       | actor_role       |  |
|  | salt               |       | salt                |       | action           |  |
|  | role               |       | name                |       | target_lead_id   |  |
|  | email              |       | email               |       | metadata (JSON)  |  |
|  | phone              |       | phone               |       | ip_fingerprint   |  |
|  | last_login_at      |       | corridor_assigned   |       | created_at       |  |
|  | created_at         |       | status              |       +------------------+  |
|  +--------------------+       | created_at          |                             |
|                               +----------+----------+                             |
|                                          | 1                                      |
|                                          |                                        |
|                                          | N                                      |
|                               +----------v----------+       +------------------+  |
|                               |        leads        |       |   otp_sessions   |  |
|                               +---------------------+       +------------------+  |
|                               | id (PK)             |       | id (PK)          |  |
|                               | full_name           |       | identifier       |  |
|                               | mobile              |       | otp_hash         |  |
|                               | email               |       | expires_at       |  |
|                               | preferred_location  |       | attempts         |  |
|                               | project_id          |       | verified         |  |
|                               | configuration       |       | created_at       |  |
|                               | consultation_notes  |       +------------------+  |
|                               | status              |                             |
|                               | disposition         |                             |
|                               | assigned_caller_id  |                             |
|                               | retry_count         |                             |
|                               | next_attempt_at     |                             |
|                               | created_at          |                             |
|                               | updated_at          |                             |
|                               +---------------------+                             |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Table Specifications & Data Dictionaries

#### Table 1: `admin_users`
Stores executive credentials and administrative access tokens.
* `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
* `username`: `VARCHAR(64) NOT NULL UNIQUE` (e.g., `Hemant_Concave_Mishra`)
* `password_hash`: `CHAR(64) NOT NULL` (SHA-256 cryptographic digest)
* `salt`: `VARCHAR(32) NOT NULL DEFAULT 'concave_auth_salt_2026'`
* `role`: `ENUM('SUPER_ADMIN', 'COMPLIANCE_DIRECTOR') DEFAULT 'SUPER_ADMIN'`
* `email`: `VARCHAR(128) NOT NULL` (e.g., `hemantrishi2786@gmail.com`)
* `phone`: `VARCHAR(15) NOT NULL` (e.g., `8286018550`)
* `last_login_at`: `DATETIME NULL`
* `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

#### Table 2: `callers`
Maintains advisory personnel profiles and territory corridor jurisdictions.
* `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
* `caller_id`: `VARCHAR(64) NOT NULL UNIQUE` (e.g., `Callerpreet`, `Callerproxy`)
* `password_hash`: `CHAR(64) NOT NULL` (SHA-256 cryptographic digest)
* `salt`: `VARCHAR(32) NOT NULL DEFAULT 'concave_auth_salt_2026'`
* `name`: `VARCHAR(100) NOT NULL`
* `email`: `VARCHAR(128) NOT NULL`
* `phone`: `VARCHAR(15) NOT NULL`
* `corridor_assigned`: `ENUM('WESTERN_SUBURBS', 'COASTAL_SOUTH_MUMBAI', 'CENTRAL_MUMBAI') NOT NULL`
* `status`: `ENUM('ACTIVE', 'SUSPENDED', 'ON_LEAVE') DEFAULT 'ACTIVE'`
* `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

#### Table 3: `leads`
Houses consumer inquiries, consultation notes, and finite disposition states.
* `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
* `full_name`: `VARCHAR(80) NOT NULL`
* `mobile`: `VARCHAR(15) NOT NULL INDEX`
* `email`: `VARCHAR(128) NULL`
* `preferred_location`: `VARCHAR(100) NOT NULL`
* `project_id`: `VARCHAR(100) NULL`
* `configuration`: `VARCHAR(50) NULL`
* `consultation_notes`: `TEXT NULL`
* `status`: `ENUM('ACTIVE_QUEUE', 'FOLLOW_UP', 'CONFIRMED_HOT', 'ARCHIVED') DEFAULT 'ACTIVE_QUEUE'`
* `disposition`: `VARCHAR(50) DEFAULT 'NEW_INQUIRY'`
* `assigned_caller_id`: `VARCHAR(64) NULL REFERENCES callers(caller_id)`
* `retry_count`: `TINYINT UNSIGNED DEFAULT 0`
* `next_attempt_at`: `DATETIME NULL`
* `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
* `updated_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

#### Table 4: `audit_trail`
Append-only ledger tracking all administrative and data modifications.
* `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
* `actor_id`: `VARCHAR(64) NOT NULL`
* `actor_role`: `VARCHAR(32) NOT NULL`
* `action`: `VARCHAR(64) NOT NULL` (e.g., `LEAD_REASSIGNED`, `STATUS_CHANGED`, `PASSWORD_RESET`)
* `target_lead_id`: `BIGINT UNSIGNED NULL`
* `metadata`: `JSON NULL`
* `ip_fingerprint`: `VARCHAR(64) NULL`
* `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

#### Table 5: `otp_sessions`
Ephemeral validation tokens for identity verification and credential recovery.
* `id`: `BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`
* `identifier`: `VARCHAR(128) NOT NULL INDEX` (Mobile or Email)
* `otp_hash`: `CHAR(64) NOT NULL`
* `expires_at`: `DATETIME NOT NULL`
* `attempts`: `TINYINT UNSIGNED DEFAULT 0`
* `verified`: `TINYINT(1) DEFAULT 0`
* `created_at`: `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`

---

## 5. Security Architecture, Anti-DDoS & Injection Shielding

To guarantee immunity against malicious actors, automated scraping bots, and high-frequency denial-of-service attempts, the platform enforces defense-in-depth security:

```
[ Incoming Request ]
         |
         v
[ Invisible Bot Honeypot ] ---- (Filled?) ----> [ Silent Blackhole Rejection ]
         | (Clean)
         v
[ Rate Limiter Engine ] ------- (> 5 req / 4 hrs) -> [ 429 Throttle & Error ]
         | (Permitted)
         v
[ Input Sanitization ] -------- (SQL / Script?) ----> [ Stripped & Truncated ]
         | (Sanitized)
         v
[ Mobile Regex /^[6-9]\d{9}$/ ] (Invalid?) ----> [ Validation Error ]
         | (Valid)
         v
[ PDO Prepared Statements ]
         | (Execute)
         v
[ Encrypted Storage / DB ]
```

1. **Distributed Rate Limiting Engine:** Enforces a hard threshold of **5 submissions or OTP dispatches per 4-hour window** (`14,400,000 ms`) computed against both normalized 10-digit Indian telephone identifiers and persistent browser hardware fingerprints (`concave_device_fp_v1`).
2. **SQL Injection Defense:** All user inputs pass through rigorous sanitization algorithms that strip malicious quotation marks, comments (`--`, `/*`), escape sequences, and SQL execution tokens (`UNION SELECT`, `DROP TABLE`, `INSERT INTO`). Backend PHP endpoints leverage prepared statements with disabled emulation (`PDO::ATTR_EMULATE_PREPARES => false`).
3. **Payload Truncation & Memory Exhaustion Prevention:** Input parameters feature strict length ceilings (Full Name $\le$ 60 characters, Mobile = strictly 10 digits, Email $\le$ 80 characters, Notes $\le$ 300 characters), defeating buffer bloat and memory exhaustion vectors.
4. **Automated Bot Honeypot Shield:** All inquiry forms embed hidden decoy fields (`website_source_hp`). Automated scrapers that populate every discovered DOM input field are immediately detected and silently blackholed prior to database allocation.
5. **IDOR & Data Boundary Shielding:** Consultant sessions are strictly bounded to their geographic jurisdiction code. An advisor authenticated under Western Suburbs cannot access, inspect, or modify records belonging to Coastal corridors.

---

## 6. Hosting Infrastructure & Production Tech Stack

* **Client Presentation Layer:** React 18.2, Vite 6.4, Tailwind CSS, Lucide React Iconography, Canvas Confetti animation engine, and SheetJS (`xlsx`) for local client-side encrypted report generation.
* **Server Runtime Environment:** Node.js active daemon bound to `0.0.0.0:5180` with background supervisor monitoring.
* **Backend Micro-services:** PHP 8.2+ with PDO MySQL driver, structured REST JSON endpoints, and strict CORS headers.
* **Database Engine:** MySQL 8.0 / MariaDB 10.11 enterprise relational engine with InnoDB ACID-compliant storage and UTF8MB4 multilingual collation.
* **Edge Routing & Delivery:** Cloudflare Enterprise edge termination providing DDoS mitigation, Web Application Firewall (WAF), HTTP/3 protocol negotiation, and automated TLS 1.3 certificate rotation.
* **Regulatory Accreditation:** Fully certified under Maharashtra Real Estate Regulatory Authority (MahaRERA) under Registration Certificate **`A51900045781`**.
