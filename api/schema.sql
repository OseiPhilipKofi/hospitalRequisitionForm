CREATE DATABASE IF NOT EXISTS hospital_requisition CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_requisition;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'store', 'admin') NOT NULL DEFAULT 'user',
    approval_status ENUM('pending', 'approved', 'declined') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    category ENUM('Drug', 'Non-Drug') NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    status VARCHAR(40) NOT NULL DEFAULT 'available',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requisitions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    item_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    requesting_unit VARCHAR(40) NOT NULL DEFAULT 'Emergency',
    status ENUM('Pending', 'Approved', 'Declined') NOT NULL DEFAULT 'Pending',
    admin_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME NULL,
    CONSTRAINT fk_req_item FOREIGN KEY (item_id) REFERENCES inventory_items(id),
    CONSTRAINT fk_req_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    actor_user_id INT UNSIGNED NULL,
    actor_role VARCHAR(20) NOT NULL,
    action VARCHAR(80) NOT NULL,
    page VARCHAR(255) NULL,
    entity_type VARCHAR(80) NULL,
    entity_id INT UNSIGNED NULL,
    summary VARCHAR(500) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_actor_created (actor_user_id, created_at),
    INDEX idx_activity_created (created_at),
    CONSTRAINT fk_activity_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
