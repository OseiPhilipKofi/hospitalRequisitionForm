<?php

declare(strict_types=1);

class RequisitionController
{
    public function index(): void
    {
        $user = Auth::requireRole(['user', 'store', 'admin']);
        if ($user['role'] === 'user') {
            Response::ok(['requisitions' => array_map([$this, 'format'], Requisition::forUser((int) $user['id']))]);
        }
        if ($user['role'] === 'store') {
            Response::ok(['requisitions' => array_map([$this, 'format'], Requisition::reviewed())]);
        }
        Response::ok(['requisitions' => array_map([$this, 'format'], Requisition::pending())]);
    }

    public function store(): void
    {
        $user = Auth::requireRole(['user']);
        $body = Request::json();
        $itemId = (int) ($body['item_id'] ?? 0);
        $quantity = (int) ($body['quantity'] ?? 0);
        $item = InventoryItem::find($itemId);
        if (!$item || empty($item['is_active'])) {
            Response::error('Selected item is not available in the active catalog', 404);
        }
        if ($quantity < 1) {
            Response::error('Quantity must be at least 1');
        }
        if ((int) $item['stock'] < $quantity) {
            Response::error('Requested quantity exceeds available stock');
        }
        $req = Requisition::create((int) $user['id'], $itemId, $quantity);
        ActivityLog::record(
            $user,
            'requisition_submitted',
            'Submitted a requisition for ' . $quantity . ' × ' . $item['name'],
            null,
            'requisition',
            (int) $req['id']
        );
        Response::ok(['requisition' => $this->format($req)], 201);
    }

    public function review(array $params): void
    {
        $actor = Auth::requireRole(['admin']);
        $id = (int) ($params['id'] ?? 0);
        $existing = Requisition::find($id);
        if (!$existing) {
            Response::error('Requisition not found', 404);
        }
        if ($existing['status'] !== 'Pending') {
            Response::error('Only pending requisitions can be reviewed', 409);
        }
        $body = Request::json();
        $status = (string) ($body['status'] ?? '');
        $notes = isset($body['admin_notes']) ? trim((string) $body['admin_notes']) : null;
        if ($notes === '') {
            $notes = null;
        }
        if (!in_array($status, ['Approved', 'Declined'], true)) {
            Response::error('Status must be Approved or Declined');
        }

        $pdo = Database::pdo();
        $pdo->beginTransaction();
        try {
            if ($status === 'Approved') {
                $ok = InventoryItem::decrementStock((int) $existing['item_id'], (int) $existing['quantity']);
                if (!$ok) {
                    $pdo->rollBack();
                    Response::error('Insufficient stock to approve this requisition', 409);
                }
            }
            $updated = Requisition::review($id, $status, $notes);
            if (!$updated) {
                $pdo->rollBack();
                Response::error('Unable to review this requisition', 409);
            }
            ActivityLog::record(
                $actor,
                'requisition_reviewed',
                $status . ' requisition #' . $id . ' for ' . $existing['item_name'] . ' (quantity ' . $existing['quantity'] . ')',
                null,
                'requisition',
                $id
            );
            $pdo->commit();
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            Response::error('Review failed', 500);
        }

        Response::ok(['requisition' => $this->format($updated)]);
    }

    private function format(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'item_id' => (int) $row['item_id'],
            'user_id' => (int) $row['user_id'],
            'quantity' => (int) $row['quantity'],
            'requesting_unit' => $row['requesting_unit'],
            'status' => $row['status'],
            'admin_notes' => $row['admin_notes'],
            'created_at' => $row['created_at'],
            'reviewed_at' => $row['reviewed_at'],
            'item_name' => $row['item_name'] ?? null,
            'item_category' => $row['item_category'] ?? null,
            'item_stock' => isset($row['item_stock']) ? (int) $row['item_stock'] : null,
            'requester_username' => $row['requester_username'] ?? null,
            'requester_email' => $row['requester_email'] ?? null,
        ];
    }
}
