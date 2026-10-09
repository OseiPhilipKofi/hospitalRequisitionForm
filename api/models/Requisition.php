<?php

declare(strict_types=1);

class Requisition
{
    public static function create(int $userId, int $itemId, int $quantity): array
    {
        $stmt = Database::pdo()->prepare(
            'INSERT INTO requisitions (item_id, user_id, quantity, requesting_unit, status) VALUES (?, ?, ?, \'Emergency\', \'Pending\')'
        );
        $stmt->execute([$itemId, $userId, $quantity]);
        return self::find((int) Database::pdo()->lastInsertId()) ?: [];
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare(self::selectSql() . ' WHERE r.id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function forUser(int $userId): array
    {
        $stmt = Database::pdo()->prepare(self::selectSql() . ' WHERE r.user_id = ? ORDER BY r.created_at DESC');
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public static function pending(): array
    {
        $stmt = Database::pdo()->query(self::selectSql() . " WHERE r.status = 'Pending' ORDER BY r.created_at ASC");
        return $stmt->fetchAll();
    }

    public static function reviewed(): array
    {
        $stmt = Database::pdo()->query(
            self::selectSql() . " WHERE r.status IN ('Approved', 'Declined') ORDER BY r.reviewed_at DESC, r.created_at DESC"
        );
        return $stmt->fetchAll();
    }

    public static function review(int $id, string $status, ?string $notes): ?array
    {
        if (!in_array($status, ['Approved', 'Declined'], true)) {
            return null;
        }
        $stmt = Database::pdo()->prepare(
            'UPDATE requisitions SET status = ?, admin_notes = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ? AND status = \'Pending\''
        );
        $stmt->execute([$status, $notes, $id]);
        if ($stmt->rowCount() !== 1) {
            return null;
        }
        return self::find($id);
    }

    private static function selectSql(): string
    {
        return 'SELECT r.id, r.item_id, r.user_id, r.quantity, r.requesting_unit, r.status, r.admin_notes, r.created_at, r.reviewed_at,
                i.name AS item_name, i.category AS item_category, i.stock AS item_stock,
                u.username AS requester_username, u.email AS requester_email
                FROM requisitions r
                INNER JOIN inventory_items i ON i.id = r.item_id
                INNER JOIN users u ON u.id = r.user_id';
    }
}
