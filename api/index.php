<?php

declare(strict_types=1);

$config = require __DIR__ . '/config.php';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['cors_origins'], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Max-Age: 86400');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

spl_autoload_register(static function (string $class): void {
    $paths = [
        __DIR__ . '/lib/' . $class . '.php',
        __DIR__ . '/controllers/' . $class . '.php',
        __DIR__ . '/models/' . $class . '.php',
    ];
    foreach ($paths as $path) {
        if (is_file($path)) {
            require_once $path;
            return;
        }
    }
});

class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $pattern,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = rawurldecode($path);
        if (strncmp($path, '/api', 4) === 0) {
            $path = substr($path, 4) ?: '/';
        }
        $path = '/' . trim($path, '/');
        if ($path !== '/') {
            $path = rtrim($path, '/');
        }
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            $regex = '#^' . $route['pattern'] . '$#';
            if ($route['method'] !== $method) {
                continue;
            }
            if (!preg_match($regex, $path, $matches)) {
                continue;
            }
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            ($route['handler'])($params);
            return;
        }

        Response::error('Endpoint not found', 404);
    }
}

$router = new Router();
$auth = new AuthController();
$inventory = new InventoryController();
$requisitions = new RequisitionController();
$users = new UserController();
$activity = new ActivityController();

$router->add('GET', '/', static function (): void {
    Response::ok(['service' => 'Hospital Emergency Requisition API']);
});
$router->add('GET', '/health', static function (): void {
    Response::ok(['status' => 'healthy']);
});
$router->add('POST', '/auth/register', [$auth, 'register']);
$router->add('POST', '/auth/login', [$auth, 'login']);
$router->add('GET', '/auth/me', [$auth, 'me']);
$router->add('GET', '/inventory', [$inventory, 'index']);
$router->add('POST', '/inventory', [$inventory, 'store']);
$router->add('PUT', '/inventory/(?P<id>\d+)', [$inventory, 'update']);
$router->add('DELETE', '/inventory/(?P<id>\d+)', [$inventory, 'destroy']);
$router->add('GET', '/requisitions', [$requisitions, 'index']);
$router->add('POST', '/requisitions', [$requisitions, 'store']);
$router->add('PATCH', '/requisitions/(?P<id>\d+)', [$requisitions, 'review']);
$router->add('GET', '/users', [$users, 'index']);
$router->add('PATCH', '/users/(?P<id>\d+)', [$users, 'update']);
$router->add('GET', '/activity', [$activity, 'index']);
$router->add('POST', '/activity', [$activity, 'store']);

try {
    Database::pdo();
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');
} catch (Throwable $e) {
    error_log($e->getMessage());
    Response::error('Server error', 500);
}
