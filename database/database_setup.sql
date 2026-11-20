-- =============================================================================
-- Concave Realty - Production MySQL Database Schema
-- Optimized for Hostinger Shared Hosting (MySQL 5.7+ / 8.0+ / MariaDB 10.3+)
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Table: admins
-- Stores administrative credentials with SHA-256 salted password hashes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'SUPER_ADMIN',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: callers
-- Stores Caller / Tele-Sales representative accounts & credentials
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `callers` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `caller_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `phone` VARCHAR(30) NULL,
  `territory` VARCHAR(150) NULL,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Location Sales Specialist',
  `password_hash` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_caller_code` (`caller_code`),
  INDEX `idx_caller_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: leads
-- Customer property enquiries and caller pipeline status
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(191) NULL,
  `preferred_location` VARCHAR(150) NULL,
  `property_type` VARCHAR(100) NULL,
  `budget` VARCHAR(100) NULL,
  `source` VARCHAR(50) NOT NULL DEFAULT 'Website',
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `assigned_caller_code` VARCHAR(50) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_leads_phone` (`phone`),
  INDEX `idx_leads_status` (`status`),
  INDEX `idx_leads_caller` (`assigned_caller_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: job_applications
-- Verified career candidates (dispatched after OTP verification)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `job_applications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `job_id` VARCHAR(50) NOT NULL,
  `job_title` VARCHAR(150) NOT NULL,
  `applicant_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `experience` VARCHAR(100) NULL,
  `portfolio_link` VARCHAR(255) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending Review',
  `verified_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_careers_email` (`email`),
  INDEX `idx_careers_job` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: otp_logs
-- Cryptographic audit trail of dispatched OTP security challenges
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `otp_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL,
  `purpose` VARCHAR(50) NOT NULL,
  `ip_address` VARCHAR(45) NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'sent',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_otp_email` (`email`),
  INDEX `idx_otp_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Initial Seed Data (Default Accounts)
-- Password Hashes: SHA-256 with server salt
-- concave@2026 -> c715e2918d6233e9949dc45bdfa5a710d216a3113aa9702907c3d71bcd7ed36e
-- caller123    -> 58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69
-- =============================================================================

INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `role`)
VALUES
  (1, 'admin', 'admin@concaverealty.com', 'c715e2918d6233e9949dc45bdfa5a710d216a3113aa9702907c3d71bcd7ed36e', 'SUPER_ADMIN')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

INSERT INTO `callers` (`id`, `caller_code`, `name`, `email`, `phone`, `territory`, `role`, `password_hash`, `status`)
VALUES
  (1, 'Callerpreet', 'Preet Jain', 'preetjainwhatsapp@gmail.com', '98201 12345', 'Borivali, Kandivali, Goregaon, Malad', 'Senior Location Specialist', '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69', 'active'),
  (2, 'Callerproxy', 'Callerproxy', 'preetrajeshjain@gmail.com', '98202 23456', 'Jogeshwari, Andheri, Bandra, Lower Parel', 'Central & Coastal Specialist', '58bbf36bf503de1736fc3ca1e357bec450581297dcc1cd54afb211da95c41f69', 'active')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

SET FOREIGN_KEY_CHECKS = 1;
