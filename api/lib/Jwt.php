<?php

declare(strict_types=1);

class Jwt
{
    public static function encode(array $claims, string $secret, int $ttl): string
    {
        $header = self::b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
        $now = time();
        $payload = self::b64(json_encode(array_merge($claims, [
            'iat' => $now,
            'exp' => $now + $ttl,
        ]), JSON_THROW_ON_ERROR));
        $signature = self::b64(hash_hmac('sha256', $header . '.' . $payload, $secret, true));
        return $header . '.' . $payload . '.' . $signature;
    }

    public static function decode(string $token, string $secret): array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new RuntimeException('Malformed token');
        }
        [$header, $payload, $signature] = $parts;
        $expected = self::b64(hash_hmac('sha256', $header . '.' . $payload, $secret, true));
        if (!hash_equals($expected, $signature)) {
            throw new RuntimeException('Invalid token signature');
        }
        $data = json_decode(self::ub64($payload), true);
        if (!is_array($data)) {
            throw new RuntimeException('Invalid token payload');
        }
        if (!isset($data['exp']) || time() >= (int) $data['exp']) {
            throw new RuntimeException('Token expired');
        }
        return $data;
    }

    private static function b64(string $raw): string
    {
        return rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    }

    private static function ub64(string $encoded): string
    {
        $remainder = strlen($encoded) % 4;
        if ($remainder) {
            $encoded .= str_repeat('=', 4 - $remainder);
        }
        $decoded = base64_decode(strtr($encoded, '-_', '+/'), true);
        if ($decoded === false) {
            throw new RuntimeException('Invalid token encoding');
        }
        return $decoded;
    }
}
