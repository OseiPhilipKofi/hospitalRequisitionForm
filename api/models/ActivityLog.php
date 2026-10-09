<?php

declare(strict_types=1);

class ActivityLog
{
    public static function record(
        array $actor,
        string $action,
        string $summary,
        ?string $page = null,
        ?string $entityType = null,
        ?int $entityId = null
    ): void {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO activity_logs (actor_user_id, actor_role, action, page, entity_type, entity_id, summary)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            (int) $actor['id'],
            (string) $actor['role'],
            $action,
            $page,
            $entityType,
            $entityId,
            $summary,
        ]);
    }

    public static function all(?int $userId = null): array
    {
        $sql = 'SELECT a.id, a.actor_user_id, a.actor_role, a.action, a.page, a.entity_type, a.entity_id,
                       a.summary, a.created_at, u.username AS actor_username, u.email AS actor_email
                FROM activity_logs a
                LEFT JOIN users u ON u.id = a.actor_user_id';
        if ($userId !== null) {
            $stmt = Database::pdo()->prepare($sql . ' WHERE a.actor_user_id = ? ORDER BY a.created_at DESC, a.id DESC LIMIT 500');
            $stmt->execute([$userId]);
            return $stmt->fetchAll();
        }
        return Database::pdo()->query($sql . ' ORDER BY a.created_at DESC, a.id DESC LIMIT 500')->fetchAll();
    }
}
