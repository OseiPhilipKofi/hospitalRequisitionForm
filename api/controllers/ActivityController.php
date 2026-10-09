<?php

declare(strict_types=1);

class ActivityController
{
    public function index(): void
    {
        Auth::requireRole(['admin']);
        $userId = null;
        if (isset($_GET['user_id']) && $_GET['user_id'] !== '') {
            $parsed = filter_var($_GET['user_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            if ($parsed === false) {
                Response::error('User ID must be a positive integer');
            }
            $userId = (int) $parsed;
            if (!User::find($userId)) {
                Response::error('User not found', 404);
            }
        }

        $requisitions = $userId === null ? [] : Requisition::forUser($userId);
        Response::ok([
            'activities' => ActivityLog::all($userId),
            'requisitions' => $requisitions,
        ]);
    }

    public function store(): void
    {
        $actor = Auth::requireRole(['user', 'store', 'admin']);
        $body = Request::json();
        $page = trim((string) ($body['page'] ?? ''));
        if ($page === '' || strlen($page) > 255 || $page[0] !== '/' || str_contains($page, '?')) {
            Response::error('A valid page path is required');
        }
        ActivityLog::record($actor, 'page_view', 'Viewed ' . $page, $page, 'page');
        Response::ok(['recorded' => true], 201);
    }
}
