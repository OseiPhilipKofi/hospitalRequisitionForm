# Emergency Requisition API

I built this API to support the Hospital Emergency Requisition Platform. It provides JSON endpoints for account access, role-specific inventory and requisition workflows, and administrator activity history. PHP's built-in development server sends every request through `index.php`, the API's single entry point.

## Requirements

- PHP 8.1 or newer
- PHP PDO enabled, with `pdo_sqlite` for the default database or `pdo_mysql` if you choose MySQL
- A writable `api/storage` directory when using SQLite
- MySQL 8 or a compatible MySQL server if using the MySQL driver

To check your PHP installation, run:

```powershell
php -v
php -m
```

## Run locally

From the project root on Windows, run `start-api.cmd`. It starts PHP at `http://127.0.0.1:8080` and routes requests through `api/index.php`.

You can also start it directly:

```powershell
cd api
php -S 127.0.0.1:8080 index.php
```

Check that the API is available:

```text
GET http://127.0.0.1:8080/health
```

The API returns JSON with an `ok` property. Errors include an explanatory `error` and an appropriate HTTP status.

## Database setup

SQLite is the default. The first API request creates `storage/hospital.sqlite`, creates the tables, and seeds the demo accounts and initial catalogue. On later starts, the API applies the current activity-log and inventory archival migrations without deleting existing data.

To use MySQL instead, create the database and tables using `schema.sql`, then update the `driver` and MySQL connection values in `config.php`. The MySQL account must be allowed to create or alter the activity and inventory schema when the API starts.

The seed accounts are created only when the database has no users:

| Role | Email | Development password |
| --- | --- | --- |
| Hospital Administrator | `admin@hospital.local` | `Admin@12345` |
| Store Personnel | `store@hospital.local` | `Store@12345` |
| Emergency Unit User | `unit@hospital.local` | `Unit@12345` |

These credentials are for local development only. Change or remove them before exposing a deployment, and do not place real credentials in source control.

## Configuration and deployment

I keep database, JWT, and CORS settings in `config.php`.

- `driver` selects `sqlite` or `mysql`.
- `sqlite_path` selects the SQLite file location.
- `mysql` contains the MySQL host, port, database, username, password, and character set.
- `jwt_secret` signs stateless access tokens. Replace the checked-in development value with a long, random, private secret before deployment.
- `jwt_ttl` is the token lifetime in seconds.
- `cors_origins` is the explicit allowlist of frontend origins. Add the exact production origin when deploying; do not use a wildcard for authenticated requests.

Configure the web server to route API requests to `index.php` and prevent direct public access to configuration, schema, and storage files. Use HTTPS in production. PHP errors are written to the server error log; clients receive a generic server error response.

## Roles and permissions

- **Unit User (`user`)**: registers as a pending user, browses the active inventory, submits Emergency requisitions, and sees their own request history.
- **Store Personnel (`store`)**: views the active inventory and completed request logs, and can add or edit inventory. Store accounts cannot submit requisitions or access administrator endpoints.
- **Hospital Administrator (`admin`)**: reviews requests and registrations, manages inventory including removing items from the active catalogue, and views activity and account-specific requisition history.

Every protected API request must include `Authorization: Bearer <token>`. The backend checks the current approved account and role; frontend route protection is not a substitute for these checks. Removing an inventory item archives it, so earlier requisition records remain available.

## API endpoints

The development Vite proxy removes the `/api` prefix before forwarding requests. For example, the frontend calls `/api/auth/login`, and the PHP router receives `/auth/login`. When calling PHP directly, use the endpoint path without `/api`.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Public | API service information |
| `GET` | `/health` | Public | Health check |
| `POST` | `/auth/register` | Public | Register a pending Unit User |
| `POST` | `/auth/login` | Public | Sign in and receive a JWT |
| `GET` | `/auth/me` | Approved account | Return the signed-in account |
| `GET` | `/inventory` | Approved user, Store, or Admin | List active items and Drug/Non-Drug groups |
| `POST` | `/inventory` | Store or Admin | Add an item |
| `PUT` | `/inventory/{id}` | Store or Admin | Update an item |
| `DELETE` | `/inventory/{id}` | Admin | Remove an item from the active catalogue |
| `GET` | `/requisitions` | Approved user, Store, or Admin | Return the caller's requests, completed Store logs, or pending Admin requests, according to role |
| `POST` | `/requisitions` | Unit User | Submit an Emergency requisition |
| `PATCH` | `/requisitions/{id}` | Admin | Approve or decline a pending requisition, with optional notes |
| `GET` | `/users` | Admin | List accounts |
| `PATCH` | `/users/{id}` | Admin | Update an account's role and approval status |
| `GET` | `/activity` | Admin | View up to 500 recent activity records |
| `GET` | `/activity?user_id={id}` | Admin | View one account's activity and requisition history |
| `POST` | `/activity` | Approved user, Store, or Admin | Record a dashboard page visit |

Inventory categories must be `Drug` or `Non-Drug`; requisition decisions must be `Approved` or `Declined`. Registration starts with role `user` and approval status `pending`.

## Database and security notes

I use PDO with native prepared statements and foreign-key enforcement for SQLite. Passwords are hashed with `password_hash()` and verified with `password_verify()`. Requisition approval and stock deduction run in a database transaction so the decision and stock change stay consistent.

Activity records are available to administrators and contain the actor, role, action, page or related record, summary, and timestamp. Avoid putting patient-identifying or sensitive clinical information in request notes or activity summaries.
