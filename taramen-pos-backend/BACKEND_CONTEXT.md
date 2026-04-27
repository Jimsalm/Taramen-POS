# Backend Project Context

Last scanned: 2026-04-27

This document summarizes the implemented backend for the Taramen POS project. Treat `pos_dev_guide.md` as planning/reference material only; the codebase has drifted from that guide in several places.

## Repository Layout

- Backend: `taramen-pos-backend`
- Frontend: `taramen-pos-frontend`
- Menu seed source: root `taramen_menu.md`
- REST client samples: `taramen-pos-backend/REST/*.http`

## Stack

- Laravel 12 on PHP 8.2
- Laravel Sanctum 4 for bearer-token API auth
- Scalar Laravel package present for API reference UI at `/scalar`
- Pest/PHPUnit for tests
- Vite + Tailwind tooling present in the backend for Laravel assets
- Database config supports SQLite, MySQL/MariaDB, PostgreSQL, and SQL Server
- `.env.example` uses MySQL (`taramen_pos_backend`)
- `phpunit.xml` uses in-memory SQLite for tests
- Docker runtime currently installs PostgreSQL PHP extensions (`pdo_pgsql`, `pgsql`) and runs PHP-FPM + Nginx under Supervisor

## Entrypoints

- HTTP bootstrap: `bootstrap/app.php`
- API routing root: `routes/api.php`
- Versioned route fragments: `routes/api/v1/*.php`
- Web route: `GET /health`
- Console schedule: `routes/console.php`
- Global middleware appended in bootstrap: `App\Http\Middleware\LogEndpointAccess`

## Routing And Rate Limits

All API routes are under `/api/v1`.

- Strict auth group, `5/min`: `login`, `logout`, `user`
- Order group, `20/min`: orders and discounts
- General group, `60/min`: categories, menu items, employees, reports, discount types, file routes

Rate limiters are defined in `App\Providers\AppServiceProvider`.

## API Response Shape

Most controllers return `App\Http\Responses\ApiResponse`.

Success:

```json
{
  "success": true,
  "message": "OK",
  "data": {},
  "meta": {
    "time": "YYYY-MM-DD HH:mm:ss",
    "api_version": "1.0.0",
    "request_id": "..."
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Error",
  "errors": {},
  "meta": {}
}
```

Notes:

- `GET /api/v1/user` currently returns Laravel's raw authenticated user object, not an `ApiResponse` envelope.
- API exceptions are forced to JSON in `bootstrap/app.php`.
- Unauthenticated API access returns standardized `401 Unauthorized`.
- Authorization exceptions return standardized `403 Forbidden`.

## Auth

- `POST /api/v1/login`
  - Body: `email`, `password`
  - Validated by `App\Http\Requests\AuthRequest`
  - Uses `App\Services\AuthService`
  - Returns `data.user` and `data.token`
- `POST /api/v1/logout`
  - Requires `auth:sanctum`
  - Deletes the current access token
- `GET /api/v1/user`
  - Requires `auth:sanctum`
  - Returns the authenticated user directly

Seeded admin:

- Email: `admin@taramen.com`
- Password: `password123`

Sanctum expiry is configured by `SANCTUM_EXPIRATION`, defaulting to `720` minutes.

## API Surface

Auth:

- `POST /login`
- `POST /logout`
- `GET /user`

Categories:

- `GET /categories`
- `POST /categories`
- `GET /categories/{category}`
- `PUT|PATCH /categories/{category}`
- `DELETE /categories/{category}`

Menu items:

- `GET /menu-items`
- `POST /menu-items`
- `GET /menu-items/available`
- `GET /menu-items/{menu_item}`
- `PUT|PATCH /menu-items/{menu_item}`
- `DELETE /menu-items/{menu_item}`
- `POST /menu-items/{id}/restore`
- `PATCH /menu-items/{id}/toggle-availability`

Employees:

- `GET /employees` returns active employees only
- `GET /employees/all` returns all non-deleted employees
- `POST /employees`
- `GET /employees/{employee}`
- `PUT|PATCH /employees/{employee}`
- `DELETE /employees/{employee}`
- `PATCH /employees/{id}/toggle-status`

Discounts:

- `GET /discounts`
- `POST /discounts`
- `GET /discounts/getActive`
- `GET /discounts/{discount}`
- `PUT|PATCH /discounts/{discount}`
- `DELETE /discounts/{discount}`

Discount types:

- `GET /get/discount-types`
- `POST /create/discount-types`
- `PUT /update/discount-types/{id}`
- `DELETE /delete/discount-types/{id}`

Orders:

- `GET /orders`
- `POST /orders`
- `GET /orders/stats`
- `GET /orders/{id}/receipt`
- `GET /orders/{order}`
- `PUT|PATCH /orders/{order}`
- `DELETE /orders/{order}`
- `PATCH /orders/{id}/status`

Reports:

- `POST /report`

Files:

- `GET /get/menu-item/{storage_filename}` requires `auth:sanctum`
- `GET /signed/menu-item/{storage_filename}` requires signed URL middleware

Health:

- `GET /health`

## Domain Model

- `User`: authenticatable Sanctum token owner.
- `Category`: soft-deletable; has many `MenuItem`; optional image via `FilesUpload`.
- `MenuItem`: soft-deletable; belongs to `Category`; optional image via `FilesUpload`; belongs to many `Discount` through `discount_items`; can be a bundle through `menu_item_components`.
- `DiscountType`: soft-deletable; has many `Discount`.
- `Discount`: belongs to `DiscountType`; belongs to many `MenuItem` through `discount_items`.
- `Employee`: soft-deletable; has `name`, optional profile path, and `active`.
- `Order`: belongs to `Employee`; has many `OrderItem`; stores generated `order_number`, status, subtotal, total discount, and total amount.
- `OrderItem`: belongs to `Order`, `MenuItem`, and optional `Discount`; stores item price/quantity snapshots and discount snapshots.
- `FilesUpload`: soft-deletable metadata for uploaded files.
- `EndpointLog`: persisted request log with method, endpoint, status, user, duration, and error info.

## Schema Highlights

Primary app migrations:

- `files_uploads`: storage filename, original name, extension, file path, soft deletes
- `categories`: unique name, description, status, optional `image_id`, soft deletes
- `menu_items`: name, price, nullable `category_id`, status, available, optional `image_id`, `is_bundle`, soft deletes
- `menu_item_components`: bundle menu item, component menu item, quantity, unique bundle/component pair
- `discount_types`: name, soft deletes
- `discounts`: name, `discount_type_id`, nullable value, active, soft deletes
- `discount_items`: discount/menu-item pivot
- `employees`: name, optional profile path, active, soft deletes
- `orders`: order number, employee, table number, subtotal, total discount, total amount, status enum
- `order_items`: order, menu item, item name, unit price, quantity, subtotal, optional discount snapshot, total
- `endpoint_logs`: request/audit log table with indexes for created date, status, success flag, user, and path

Laravel defaults also provide users, password reset tokens, sessions, cache, jobs, and Sanctum personal access tokens.

## Services

- `AuthService`: validates credentials, creates Sanctum token, deletes current token on logout.
- `MenuItemService`: lists items with category, bundle components, file data, and temporary image URLs; creates/updates items inside transactions; syncs bundle components; archives/restores/toggles availability.
- `EmployeeService`: active/all listing, CRUD, profile upload, status toggle.
- `DiscountService`: CRUD and menu-item pivot attach/sync.
- `DiscountTypeService`: CRUD for discount type names.
- `OrderService`: filtered/paginated order listing, transactional order creation, receipt shaping, status updates, delete guard for completed orders, stats.
- `ReportService`: intended to produce total sales, employee sales, and top item summaries.

## Validation

Requests live in `app/Http/Requests`.

- `AuthRequest`: `email`, `password`
- `CategoryRequest`: name uniqueness on create/update, description/status, optional image
- `MenuItemRequest`: name, price, category, status/available, optional image, bundle components
- `EmployeeRequest`: name, active, optional profile image
- `DiscountRequest`: name, `discount_type_id`, value, active, `menu_items_id` array
- `DiscountTypeRequest`: unique required name
- `OrderRequest`: order filters, order creation payload, status updates, pagination
- `ReportRequest`: optional `start_date` and `end_date`, with `end_date >= start_date`

## File Uploads And Images

- Upload helper: `App\Helper\FileUploadHelper`
- Files are stored on the `public` disk under `{path_name}/{year}/{uuid}.{extension}`
- Upload metadata is saved in `files_uploads`
- Menu item and category image references use `image_id`
- Menu item listing attaches a temporary signed `image_url`
- Category listing attaches a temporary signed `image_url` through `App\Helper\AttachUrl`
- Signed menu item image route name: `secure.menu.image.signed`

## Order Flow

1. `POST /orders` validates `employee_id`, `table_number`, and `items`.
2. `OrderService` opens a DB transaction.
3. Order number is generated as `YYYYMMDD####`.
4. Each item snapshots current menu item name and price.
5. If a valid active discount is attached to that menu item, discount snapshot fields are stored on the order item.
6. If a submitted `discount_id` is inactive, unsupported, or not attached to the selected menu item, order creation fails with a `422` validation response and the transaction rolls back.
7. Order totals are recalculated from order items.
8. The response loads `orderItems` and `employee`.

Order statuses are `pending`, `completed`, and `cancelled`. Completed orders cannot be deleted through `OrderService::deleteOrder`.

## Logging And Maintenance

- Endpoint access logging is global middleware.
- Successes go to `endpoint_success`; failures go to `endpoint_failure`.
- DB logs are written to `endpoint_logs`.
- Log-channel file retention:
  - success logs: 30 days
  - failure logs: 60 days
  - all endpoint log channel exists with 14-day retention, but middleware does not currently write to it
- Scheduled tasks:
  - `sanctum:prune-expired --hours=24` daily at 02:00
  - delete old `endpoint_logs` daily at 02:30
- DB log retention uses `ENDPOINT_LOG_RETENTION_DAYS`, defaulting to `365`.

## Seed Data

`DatabaseSeeder` runs:

- `UserSeeder`
- `CategorySeeder`
- `MenuItemSeeder`
- `BundleMenuSeeder`
- `DiscountTypeSeeder`

Seeder behavior:

- `CategorySeeder` and `MenuItemSeeder` parse root `taramen_menu.md`.
- Duplicate menu item names are decorated with the category name.
- `BundleMenuSeeder` creates/restores bundle categories, bundle menu items, and bundle component relations.
- `DiscountTypeSeeder` seeds `percentage`, `fixed`, and `buy1take1`.

## Frontend Contract Snapshot

The frontend currently targets:

- `VITE_API_BASE_URL`, or
- fallback `https://taramen-pos.onrender.com/api/v1`

Auth integration:

- `src/hooks/useAuth.js` posts to `/login`
- It stores `data.token`, `data.data?.token`, or `data.accessToken` into `localStorage.auth_token`
- `src/shared/api/client.js` sends `Authorization: Bearer {auth_token}`
- The active route guard in `components/custom/ProtectedRoute.jsx` only checks for a local token; it does not verify `/user`

Current frontend app routes are minimal: `/login` and `/dashboard`.

## Deployment Notes

- `Dockerfile` builds vendor dependencies in one stage, then serves with PHP-FPM + Nginx + Supervisor.
- `docker/start.sh` clears/caches config, runs migrations, seeds only if no users exist, then starts Supervisor.
- Runtime port defaults to `10000` and is injected into the Nginx template.
- `.dockerignore` excludes `.env`, vendor, node modules, logs, and framework cache/session/view directories.

## Tests

- Test runner: `composer test` or `php artisan test`
- Pest is configured for Feature tests, but `RefreshDatabase` is commented out.
- Current test files are only Laravel skeleton examples.

## Current Caveats And Drift Points

- `ReportService` appears out of sync with the schema. It references invalid or missing fields/aliases such as `COUNT *`, `employee.id`, `order_items.name`, `orders_id`, and `is_free`.
- Discount calculation in `OrderService` checks `$discount->type`, but the current `discounts` table/model use `discount_type_id` and a `discountType` relation. This likely needs alignment before discount calculations are reliable.
- `DiscountTypeSeeder` is not idempotent and may create duplicate names on repeated seeding.
- `Discount` migration has `softDeletes`, but the model does not currently use `SoftDeletes`.
- Migration rollbacks for `files_uploads` and `discount_types` drop `files` and `discount_type` respectively, not the tables created in `up`.
- Docker installs PostgreSQL PHP extensions, while `.env.example` is configured for MySQL. MySQL deployments will need the relevant PDO extension.
- `REST/*.http` samples include hardcoded bearer tokens and a few stale endpoints; use them as examples, not source of truth.
- `tests/Feature/ExampleTest.php` requests `/`, but the implemented health route is `/health`.
