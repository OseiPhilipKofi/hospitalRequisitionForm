<?php

declare(strict_types=1);

class User
{
    public static function findByEmail(string $email): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function findByUsername(string $username): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(string $username, string $email, string $password): array
    {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = Database::pdo()->prepare(
            'INSERT INTO users (username, email, password_hash, role, approval_status) VALUES (?, ?, ?, \'user\', \'pending\')'
        );
        $stmt->execute([$username, $email, $hash]);
        $id = (int) Database::pdo()->lastInsertId();
        $user = self::find($id);
        return $user ?: [];
    }

    public static function all(): array
    {
        $stmt = Database::pdo()->query(
            'SELECT id, username, email, role, approval_status, created_at FROM users ORDER BY created_at DESC'
        );
        return $stmt->fetchAll();
    }

    public static function updateRoleAndStatus(int $id, string $role, string $status): ?array
    {
        $allowedRoles = ['user', 'store', 'admin'];
        $allowedStatus = ['pending', 'approved', 'declined'];
        if (!in_array($role, $allowedRoles, true) || !in_array($status, $allowedStatus, true)) {
            return null;
        }
        $stmt = Database::pdo()->prepare('UPDATE users SET role = ?, approval_status = ? WHERE id = ?');
        $stmt->execute([$role, $status, $id]);
        return self::find($id);
    }
}
