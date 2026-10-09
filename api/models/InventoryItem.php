<?php

declare(strict_types=1);

class InventoryItem
{
    public static function all(): array
    {
        $stmt = Database::pdo()->query(
            'SELECT id, name, category, stock, status, created_at FROM inventory_items WHERE is_active = 1 ORDER BY category, name'
        );
        return $stmt->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::pdo()->prepare('SELECT * FROM inventory_items WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(string $name, string $category, int $stock): array
    {
        $status = $stock > 0 ? 'available' : 'out_of_stock';
        $stmt = Database::pdo()->prepare(
            'INSERT INTO inventory_items (name, category, stock, status) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([$name, $category, $stock, $status]);
        $item = self::find((int) Database::pdo()->lastInsertId());
        return $item ?: [];
    }

    public static function update(int $id, string $name, string $category, int $stock): ?array
    {
        $status = $stock > 0 ? 'available' : 'out_of_stock';
        $stmt = Database::pdo()->prepare(
            'UPDATE inventory_items SET name = ?, category = ?, stock = ?, status = ? WHERE id = ?'
        );
        $stmt->execute([$name, $category, $stock, $status, $id]);
        return self::find($id);
    }

    public static function archive(int $id): bool
    {
        $stmt = Database::pdo()->prepare('UPDATE inventory_items SET is_active = 0 WHERE id = ? AND is_active = 1');
        $stmt->execute([$id]);
        return $stmt->rowCount() === 1;
    }

    public static function decrementStock(int $id, int $qty): bool
    {
        $stmt = Database::pdo()->prepare(
            'UPDATE inventory_items SET stock = stock - ? WHERE id = ? AND stock >= ?'
        );
        $stmt->execute([$qty, $id, $qty]);
        if ($stmt->rowCount() !== 1) {
            return false;
        }
        $item = self::find($id);
        if ($item) {
            $status = ((int) $item['stock']) > 0 ? 'available' : 'out_of_stock';
            $statusStmt = Database::pdo()->prepare('UPDATE inventory_items SET status = ? WHERE id = ?');
            $statusStmt->execute([$status, $id]);
        }
        return true;
    }
}
