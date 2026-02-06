-- ============================================================================
-- BetaDrop Complete Database Schema
-- ============================================================================
-- Version: 1.0.0
-- Last Updated: 2026-01-12
-- Compatible with: MySQL 8.0+
-- 
-- This file contains the complete database schema for BetaDrop.
-- Run this file to set up a fresh database from scratch.
-- 
-- WARNING: This will DROP and recreate the entire database!
-- ============================================================================

-- Initialize database
-- DROP DATABASE IF EXISTS betadrop;
CREATE DATABASE IF NOT EXISTS betadrop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE betadrop;

-- Session settings
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Core user management with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. MAGIC TOKENS TABLE
-- ============================================================================
-- Passwordless authentication via magic links
CREATE TABLE IF NOT EXISTS magic_tokens (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token (token),
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. PASSKEY CREDENTIALS TABLE
-- ============================================================================
-- WebAuthn/Passkey authentication credentials
CREATE TABLE IF NOT EXISTS passkey_credentials (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    credential_id VARCHAR(512) NOT NULL UNIQUE,
    public_key TEXT NOT NULL,
    counter BIGINT NOT NULL DEFAULT 0,
    device_type VARCHAR(100) DEFAULT NULL,
    backed_up BOOLEAN DEFAULT FALSE,
    transports TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_credential_id (credential_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4. PASSKEY CHALLENGES TABLE
-- ============================================================================
-- Temporary storage for WebAuthn challenges during registration/authentication
CREATE TABLE IF NOT EXISTS passkey_challenges (
    id VARCHAR(36) PRIMARY KEY,
    challenge VARCHAR(512) NOT NULL,
    user_id VARCHAR(36) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    type ENUM('registration', 'authentication') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_challenge (challenge),
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5. SESSIONS TABLE
-- ============================================================================
-- Active user sessions tracking
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    user_agent VARCHAR(512) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6. BUILDS TABLE
-- ============================================================================
-- Core table for IPA/APK builds with advanced distribution features
CREATE TABLE IF NOT EXISTS builds (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    
    -- Basic metadata
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    build_number VARCHAR(50) DEFAULT NULL,
    platform ENUM('ios', 'android') NOT NULL,
    bundle_id VARCHAR(255) DEFAULT NULL,
    
    -- File information
    file_path VARCHAR(512) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    icon_path VARCHAR(512) DEFAULT NULL,
    
    -- Notes and status
    notes TEXT DEFAULT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    is_latest BOOLEAN DEFAULT FALSE,
    is_deprecated BOOLEAN DEFAULT FALSE,
    
    -- Download and install tracking
    download_count INT DEFAULT 0,
    unique_devices_count INT DEFAULT 0,
    install_success_count INT DEFAULT 0,
    install_failure_count INT DEFAULT 0,
    
    -- Expiry settings
    expiry_type ENUM('none', 'time', 'downloads', 'devices', 'combined') DEFAULT 'none',
    expiry_time_days INT DEFAULT NULL,
    expiry_download_limit INT DEFAULT NULL,
    expiry_device_limit INT DEFAULT NULL,
    expires_at TIMESTAMP NULL,
    
    -- Custom branding
    custom_logo_path VARCHAR(512) DEFAULT NULL,
    custom_accent_color VARCHAR(7) DEFAULT NULL,
    custom_background_color VARCHAR(7) DEFAULT NULL,
    custom_message TEXT DEFAULT NULL,
    custom_brand_name VARCHAR(255) DEFAULT NULL,
    custom_theme_mode ENUM('dark', 'light', 'system') DEFAULT 'dark',
    hide_platform_branding BOOLEAN DEFAULT FALSE,
    
    -- iOS provisioning (for enterprise/ad-hoc distribution)
    provisioned_devices JSON DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys and indexes
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_platform (platform),
    INDEX idx_bundle_id (bundle_id),
    INDEX idx_is_enabled (is_enabled),
    INDEX idx_is_latest (is_latest),
    INDEX idx_is_deprecated (is_deprecated),
    INDEX idx_expires_at (expires_at),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7. INSTALL TOKENS TABLE
-- ============================================================================
-- Secure/gated install tokens for builds
CREATE TABLE IF NOT EXISTS install_tokens (
    id VARCHAR(36) PRIMARY KEY,
    build_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_build_id (build_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8. SHARE LINKS TABLE
-- ============================================================================
-- Role-based sharing links for builds
CREATE TABLE IF NOT EXISTS share_links (
    id VARCHAR(36) PRIMARY KEY,
    build_id VARCHAR(36) NOT NULL,
    link_type ENUM('qa', 'stakeholder', 'beta_tester', 'reviewer') NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    label VARCHAR(255) DEFAULT NULL,
    max_uses INT DEFAULT NULL,
    current_uses INT DEFAULT 0,
    unique_devices INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
    INDEX idx_build_id (build_id),
    INDEX idx_token (token),
    INDEX idx_link_type (link_type),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. BUILD ANALYTICS TABLE
-- ============================================================================
-- Track individual installations and device analytics
CREATE TABLE IF NOT EXISTS build_analytics (
    id VARCHAR(36) PRIMARY KEY,
    build_id VARCHAR(36) NOT NULL,
    share_link_id VARCHAR(36) DEFAULT NULL,
    
    -- Device information
    device_type ENUM('mobile', 'tablet', 'desktop') DEFAULT NULL,
    device_model VARCHAR(255) DEFAULT NULL,
    os_version VARCHAR(50) DEFAULT NULL,
    screen_size VARCHAR(50) DEFAULT NULL,
    
    -- Location and network
    ip_address VARCHAR(45) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    
    -- Install status
    install_status ENUM('success', 'failure', 'pending') DEFAULT 'pending',
    error_message TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    
    -- Timestamp
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys and indexes
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
    FOREIGN KEY (share_link_id) REFERENCES share_links(id) ON DELETE SET NULL,
    INDEX idx_build_id (build_id),
    INDEX idx_share_link_id (share_link_id),
    INDEX idx_install_status (install_status),
    INDEX idx_installed_at (installed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 10. BUILD FEEDBACKS TABLE
-- ============================================================================
-- Feedback and bug reports from testers
CREATE TABLE IF NOT EXISTS build_feedbacks (
    id VARCHAR(36) PRIMARY KEY,
    build_id VARCHAR(36) NOT NULL,
    share_link_id VARCHAR(36) DEFAULT NULL,
    
    -- Feedback content
    feedback_type ENUM('bug', 'suggestion', 'question', 'other') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('new', 'acknowledged', 'resolved', 'wont_fix') DEFAULT 'new',
    
    -- Reporter information
    reporter_email VARCHAR(255) DEFAULT NULL,
    reporter_name VARCHAR(255) DEFAULT NULL,
    device_info TEXT DEFAULT NULL,
    screenshot_path VARCHAR(512) DEFAULT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign keys and indexes
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
    FOREIGN KEY (share_link_id) REFERENCES share_links(id) ON DELETE SET NULL,
    INDEX idx_build_id (build_id),
    INDEX idx_share_link_id (share_link_id),
    INDEX idx_status (status),
    INDEX idx_severity (severity),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 11. BUILD VERSIONS TABLE
-- ============================================================================
-- Track version history for apps
CREATE TABLE IF NOT EXISTS build_versions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    bundle_id VARCHAR(255) NOT NULL,
    platform ENUM('ios', 'android') NOT NULL,
    version VARCHAR(50) NOT NULL,
    build_number VARCHAR(50) NOT NULL,
    build_id VARCHAR(36) NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys and indexes
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_bundle_id (bundle_id),
    INDEX idx_platform (platform),
    INDEX idx_is_current (is_current),
    INDEX idx_created_at (created_at),
    UNIQUE KEY unique_version (bundle_id, version, build_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 12. GUEST UPLOADS TABLE
-- ============================================================================
-- Temporary uploads from non-authenticated users
CREATE TABLE IF NOT EXISTS guest_uploads (
    id VARCHAR(36) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    file_type ENUM('ipa', 'apk') NOT NULL,
    app_name VARCHAR(255) NOT NULL,
    package_name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    file_size BIGINT NOT NULL,
    
    -- iOS provisioning (for enterprise/ad-hoc distribution)
    provisioned_devices JSON DEFAULT NULL,
    
    -- Tracking
    uploader_ip VARCHAR(45) DEFAULT NULL,
    download_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    
    -- Indexes
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at),
    INDEX idx_uploader_ip (uploader_ip),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 13. GUEST UPLOAD CLAIMS TABLE
-- ============================================================================
-- Track when users claim their guest uploads
CREATE TABLE IF NOT EXISTS guest_upload_claims (
    id VARCHAR(36) PRIMARY KEY,
    guest_upload_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    build_id VARCHAR(36) DEFAULT NULL,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys and indexes
    FOREIGN KEY (guest_upload_id) REFERENCES guest_uploads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (build_id) REFERENCES builds(id) ON DELETE SET NULL,
    INDEX idx_guest_upload_id (guest_upload_id),
    INDEX idx_user_id (user_id),
    INDEX idx_build_id (build_id),
    UNIQUE KEY unique_claim (guest_upload_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Re-enable foreign key checks
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- SCHEMA COMPLETE
-- ============================================================================
-- Total Tables: 13
-- 
-- 1.  users                - User accounts and roles
-- 2.  magic_tokens         - Magic link authentication
-- 3.  passkey_credentials  - WebAuthn/Passkey credentials
-- 4.  passkey_challenges   - WebAuthn challenge storage
-- 5.  sessions             - Active sessions
-- 6.  builds               - IPA/APK builds (main table)
-- 7.  install_tokens       - Secure install tokens
-- 8.  share_links          - Role-based share links
-- 9.  build_analytics      - Installation analytics
-- 10. build_feedbacks      - Tester feedback
-- 11. build_versions       - Version history
-- 12. guest_uploads        - Temporary guest uploads
-- 13. guest_upload_claims  - Guest upload claims
-- ============================================================================
