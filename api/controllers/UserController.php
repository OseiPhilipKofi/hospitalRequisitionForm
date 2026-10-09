<?php

declare(strict_types=1);

class UserController
{
    public function index(): void
    {
        Auth::requireRole(['admin']);
        $users = array_map(static function (array $user): array {
            return [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role'],
                'approval_status' => $user['approval_status'],
                'created_at' => $user['created_at'],
            ];
        }, User::all());
        Response::ok(['users' => $users]);
    }

    public function update(array $params): void
    {
        $admin = Auth::requireRole(['admin']);
        $id = (int) ($params['id'] ?? 0);
        $target = User::find($id);
        if (!$target) {
            Response::error('User not found', 404);
        }
        if ((int) $target['id'] === (int) $admin['id']) {
            Response::error('Administrators cannot change their own access from this screen', 409);
        }
        $body = Request::json();
        $role = (string) ($body['role'] ?? $target['role']);
        $status = (string) ($body['approval_status'] ?? $target['approval_status']);
        $updated = User::updateRoleAndStatus($id, $role, $status);
        if (!$updated) {
            Response::error('Role must be user, store, or admin. Status must be pending, approved, or declined');
        }
        ActivityLog::record(
            $admin,
            'user_access_updated',
            'Updated access for ' . $target['username'] . ': role ' . $target['role'] . ' to ' . $role . ', approval ' . $target['approval_status'] . ' to ' . $status,
            null,
            'user',
            $id
        );
        Response::ok(['user' => Auth::publicUser($updated)]);
    }
}
