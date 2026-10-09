<?php

declare(strict_types=1);

class AuthController
{
    public function register(): void
    {
        $body = Request::json();
        $username = trim((string) ($body['username'] ?? ''));
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');

        if ($username === '' || !preg_match('/^[A-Za-z0-9._-]{3,80}$/', $username)) {
            Response::error('Username must be 3-80 characters and use letters, numbers, dots, underscores, or hyphens');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('A valid email address is required');
        }
        if (strlen($password) < 8) {
            Response::error('Password must be at least 8 characters');
        }
        if (User::findByEmail($email) || User::findByUsername($username)) {
            Response::error('An account with that username or email already exists', 409);
        }

        $user = User::create($username, $email, $password);
        ActivityLog::record($user, 'registration_submitted', 'Submitted a registration for administrator review');
        Response::ok([
            'message' => 'Registration submitted. A hospital administrator must approve your account before you can sign in.',
            'user' => Auth::publicUser($user),
        ], 201);
    }

    public function login(): void
    {
        $body = Request::json();
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $password = (string) ($body['password'] ?? '');
        $user = User::findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }
        if ($user['approval_status'] === 'pending') {
            Response::error('Your registration is awaiting administrator approval', 403);
        }
        if ($user['approval_status'] === 'declined') {
            Response::error('Your registration was declined. Contact hospital administration.', 403);
        }

        $config = Auth::config();
        $token = Jwt::encode([
            'sub' => (int) $user['id'],
            'role' => $user['role'],
        ], $config['jwt_secret'], (int) $config['jwt_ttl']);

        ActivityLog::record($user, 'login', 'Signed in to the ' . $user['role'] . ' workspace');
        Response::ok([
            'token' => $token,
            'user' => Auth::publicUser($user),
        ]);
    }

    public function me(): void
    {
        $user = Auth::user();
        Response::ok(['user' => Auth::publicUser($user)]);
    }
}
