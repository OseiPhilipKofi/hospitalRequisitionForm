<?php

declare(strict_types=1);

class Auth
{
    public static function config(): array
    {
        static $config;
        if ($config === null) {
            $config = require dirname(__DIR__) . '/config.php';
        }
        return $config;
    }

    public static function user(): array
    {
        $token = Request::bearer();
        if ($token === null) {
            Response::error('Authentication required', 401);
        }
        try {
            $claims = Jwt::decode($token, self::config()['jwt_secret']);
        } catch (Throwable $e) {
            Response::error('Invalid or expired session', 401);
        }
        $stmt = Database::pdo()->prepare('SELECT id, username, email, role, approval_status FROM users WHERE id = ?');
        $stmt->execute([(int) $claims['sub']]);
        $user = $stmt->fetch();
        if (!$user) {
            Response::error('Account no longer exists', 401);
        }
        if ($user['approval_status'] !== 'approved') {
            Response::error('Account is not approved', 403);
        }
        return $user;
    }

    public static function requireRole(array $roles): array
    {
        $user = self::user();
        if (!in_array($user['role'], $roles, true)) {
            Response::error('You are not authorized for this action', 403);
        }
        return $user;
    }

    public static function publicUser(array $user): array
    {
        return [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'approval_status' => $user['approval_status'],
        ];
    }
}
