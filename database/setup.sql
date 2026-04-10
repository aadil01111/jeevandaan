-- ============================================================
-- database/setup.sql
-- Run this in phpMyAdmin or MySQL terminal
-- ============================================================

CREATE DATABASE IF NOT EXISTS blood_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE blood_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL,
    email               VARCHAR(191)    NOT NULL UNIQUE,
    phone               VARCHAR(20)     NOT NULL UNIQUE,
    password            VARCHAR(255)    NOT NULL,
    role                ENUM('donor', 'requester', 'red_cross') NOT NULL DEFAULT 'donor',
    verification_status ENUM('Pending', 'Verified', 'Rejected')  NOT NULL DEFAULT 'Pending',
    center_id           VARCHAR(100)    NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password resets table (for forgot password feature)
CREATE TABLE IF NOT EXISTS password_resets (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(191) NOT NULL,
    token       VARCHAR(64)  NOT NULL,
    expires_at  DATETIME     NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Test users (password = "password" for all)
INSERT INTO users (name, email, phone, password, role, verification_status)
VALUES (
    'Test Donor',
    'donor@test.com',
    '+9779800000001',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'donor',
    'Verified'
);

INSERT INTO users (name, email, phone, password, role, verification_status)
VALUES (
    'Test Requester',
    'requester@test.com',
    '+9779800000002',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'requester',
    'Pending'
);

INSERT INTO users (name, email, phone, password, role, verification_status, center_id)
VALUES (
    'Red Cross Admin',
    'admin@redcross.com',
    '+9779800000003',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'red_cross',
    'Verified',
    'RC-KTM-001'
);