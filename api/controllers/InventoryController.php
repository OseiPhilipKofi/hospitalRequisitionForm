<?php

declare(strict_types=1);

class InventoryController
{
    public function index(): void
    {
        Auth::requireRole(['user', 'store', 'admin']);
        $items = InventoryItem::all();
        $grouped = ['Drug' => [], 'Non-Drug' => []];
        foreach ($items as $item) {
            $grouped[$item['category']][] = $this->format($item);
        }
        Response::ok(['items' => array_map([$this, 'format'], $items), 'grouped' => $grouped]);
    }

    public function store(): void
    {
        $actor = Auth::requireRole(['store', 'admin']);
        $body = Request::json();
        $name = trim((string) ($body['name'] ?? ''));
        $category = (string) ($body['category'] ?? '');
        $stock = (int) ($body['stock'] ?? -1);
        if ($name === '' || strlen($name) > 160) {
            Response::error('Item name is required');
        }
        if (!in_array($category, ['Drug', 'Non-Drug'], true)) {
            Response::error('Category must be Drug or Non-Drug');
        }
        if ($stock < 0) {
            Response::error('Stock must be zero or greater');
        }
        $item = InventoryItem::create($name, $category, $stock);
        ActivityLog::record($actor, 'inventory_created', 'Added ' . $category . ' item "' . $name . '" with stock ' . $stock, null, 'inventory_item', (int) $item['id']);
        Response::ok(['item' => $this->format($item)], 201);
    }

    public function update(array $params): void
    {
        $actor = Auth::requireRole(['store', 'admin']);
        $id = (int) ($params['id'] ?? 0);
        $existing = InventoryItem::find($id);
        if (!$existing || empty($existing['is_active'])) {
            Response::error('Inventory item not found', 404);
        }
        $body = Request::json();
        $name = trim((string) ($body['name'] ?? $existing['name']));
        $category = (string) ($body['category'] ?? $existing['category']);
        $stock = array_key_exists('stock', $body) ? (int) $body['stock'] : (int) $existing['stock'];
        if ($name === '' || !in_array($category, ['Drug', 'Non-Drug'], true) || $stock < 0) {
            Response::error('Invalid inventory payload');
        }
        $item = InventoryItem::update($id, $name, $category, $stock);
        ActivityLog::record($actor, 'inventory_updated', 'Updated ' . $category . ' item "' . $name . '" to stock ' . $stock, null, 'inventory_item', $id);
        Response::ok(['item' => $this->format($item ?: [])]);
    }

    public function destroy(array $params): void
    {
        $actor = Auth::requireRole(['admin']);
        $id = (int) ($params['id'] ?? 0);
        $item = InventoryItem::find($id);
        if (!$item) {
            Response::error('Inventory item not found', 404);
        }
        if (!InventoryItem::archive($id)) {
            Response::error('Inventory item is already removed', 409);
        }
        ActivityLog::record(
            $actor,
            'inventory_removed',
            'Removed ' . $item['category'] . ' item "' . $item['name'] . '" from the active catalog',
            null,
            'inventory_item',
            $id
        );
        Response::ok(['removed' => true]);
    }

    private function format(array $item): array
    {
        return [
            'id' => (int) $item['id'],
            'name' => $item['name'],
            'category' => $item['category'],
            'stock' => (int) $item['stock'],
            'status' => $item['status'],
            'created_at' => $item['created_at'] ?? null,
            'is_active' => isset($item['is_active']) ? (bool) $item['is_active'] : true,
        ];
    }
}
