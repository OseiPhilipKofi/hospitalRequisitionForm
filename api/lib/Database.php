<?php

declare(strict_types=1);

class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }

        $config = require dirname(__DIR__) . '/config.php';
        $driver = $config['driver'] ?? 'sqlite';

        if ($driver === 'mysql') {
            $m = $config['mysql'];
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                $m['host'],
                $m['port'],
                $m['database'],
                $m['charset']
            );
            self::$pdo = new PDO($dsn, $m['username'], $m['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
            self::ensureSeed(self::$pdo);
            self::ensurePlatformSchema(self::$pdo, $driver);
            return self::$pdo;
        }

        $path = $config['sqlite_path'];
        $dir = dirname($path);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $exists = is_file($path);
        self::$pdo = new PDO('sqlite:' . $path, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        self::$pdo->exec('PRAGMA foreign_keys = ON');
        if (!$exists) {
            self::bootstrapSqlite(self::$pdo);
        } else {
            self::ensureSeed(self::$pdo);
        }
        self::ensurePlatformSchema(self::$pdo, 'sqlite');

        return self::$pdo;
    }

    private static function ensurePlatformSchema(PDO $pdo, string $driver): void
    {
        if ($driver === 'sqlite') {
            $columns = $pdo->query('PRAGMA table_info(inventory_items)')->fetchAll();
            $hasActiveColumn = false;
            foreach ($columns as $column) {
                if ($column['name'] === 'is_active') {
                    $hasActiveColumn = true;
                    break;
                }
            }
            if (!$hasActiveColumn) {
                $pdo->exec('ALTER TABLE inventory_items ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1');
            }
            $pdo->exec(
                'CREATE TABLE IF NOT EXISTS activity_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    actor_user_id INTEGER NULL,
                    actor_role TEXT NOT NULL,
                    action TEXT NOT NULL,
                    page TEXT NULL,
                    entity_type TEXT NULL,
                    entity_id INTEGER NULL,
                    summary TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
                )'
            );
            $pdo->exec('CREATE INDEX IF NOT EXISTS idx_activity_actor_created ON activity_logs(actor_user_id, created_at)');
            $pdo->exec('CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at)');
            return;
        }

        $column = $pdo->query("SHOW COLUMNS FROM inventory_items LIKE 'is_active'")->fetch();
        if (!$column) {
            $pdo->exec('ALTER TABLE inventory_items ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1');
        }
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS activity_logs (
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        );
    }

    private static function bootstrapSqlite(PDO $pdo): void
    {
        $pdo->exec(
            'CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT \'user\' CHECK(role IN (\'user\', \'store\', \'admin\')),
                approval_status TEXT NOT NULL DEFAULT \'pending\' CHECK(approval_status IN (\'pending\', \'approved\', \'declined\')),
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )'
        );
        $pdo->exec(
            'CREATE TABLE inventory_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL CHECK(category IN (\'Drug\', \'Non-Drug\')),
                stock INTEGER NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT \'available\',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )'
        );
        $pdo->exec(
            'CREATE TABLE requisitions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                item_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                quantity INTEGER NOT NULL,
                requesting_unit TEXT NOT NULL DEFAULT \'Emergency\',
                status TEXT NOT NULL DEFAULT \'Pending\' CHECK(status IN (\'Pending\', \'Approved\', \'Declined\')),
                admin_notes TEXT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TEXT NULL,
                FOREIGN KEY (item_id) REFERENCES inventory_items(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            )'
        );

        $adminHash = password_hash('Admin@12345', PASSWORD_BCRYPT);
        $storeHash = password_hash('Store@12345', PASSWORD_BCRYPT);
        $unitHash = password_hash('Unit@12345', PASSWORD_BCRYPT);

        self::insertSeedAccounts($pdo, $adminHash, $storeHash, $unitHash);

        $insertItem = $pdo->prepare(
            'INSERT INTO inventory_items (name, category, stock, status) VALUES (?, ?, ?, ?)'
        );
        $seed = [
            ['Adrenaline 1mg/ml', 'Drug', 48, 'available'],
            ['Atropine 0.6mg', 'Drug', 60, 'available'],
            ['Morphine 10mg', 'Drug', 24, 'available'],
            ['Normal Saline 1L', 'Drug', 120, 'available'],
            ['Tranexamic Acid 500mg', 'Drug', 36, 'available'],
            ['Trauma Dressing Pack', 'Non-Drug', 80, 'available'],
            ['Cervical Collar', 'Non-Drug', 18, 'available'],
            ['IV Cannula 18G', 'Non-Drug', 200, 'available'],
            ['Oxygen Mask Adult', 'Non-Drug', 40, 'available'],
            ['Defibrillator Pads', 'Non-Drug', 16, 'available'],
        ];
        foreach ($seed as $row) {
            $insertItem->execute($row);
        }
    }

    private static function ensureSeed(PDO $pdo): void
    {
        $count = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
        if ($count > 0) {
            return;
        }
        $adminHash = password_hash('Admin@12345', PASSWORD_BCRYPT);
        $storeHash = password_hash('Store@12345', PASSWORD_BCRYPT);
        $unitHash = password_hash('Unit@12345', PASSWORD_BCRYPT);
        self::insertSeedAccounts($pdo, $adminHash, $storeHash, $unitHash);
    }

    private static function insertSeedAccounts(PDO $pdo, string $adminHash, string $storeHash, string $unitHash): void
    {
        $insertUser = $pdo->prepare(
            'INSERT INTO users (username, email, password_hash, role, approval_status) VALUES (?, ?, ?, ?, ?)'
        );
        $insertUser->execute(['hospital.admin', 'admin@hospital.local', $adminHash, 'admin', 'approved']);
        $insertUser->execute(['store.desk', 'store@hospital.local', $storeHash, 'store', 'approved']);
        $insertUser->execute(['emergency.unit', 'unit@hospital.local', $unitHash, 'user', 'approved']);
    }
}
