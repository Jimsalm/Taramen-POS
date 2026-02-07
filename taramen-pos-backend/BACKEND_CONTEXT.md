# Backend Project Context

This document summarizes the backend context for the Taramen POS project.

## Stack
- Laravel 12, PHP 8.2, Sanctum, MySQL
- Vite + Tailwind tooling present for assets

## Entrypoints And Middleware
- App bootstrap and routing: `bootstrap/app.php`
- Global middleware: `App\Http\Middleware\LogEndpointAccess`
- Rate limits: `App\Providers\AppServiceProvider`
- API base prefix: `/api/v1` (grouped includes in `routes/api.php`)

## Auth
- `POST /api/v1/login`
- `POST /api/v1/logout`
- `GET /api/v1/user`
- Token issuance in `App\Services\AuthService`
- Validation in `App\Http\Requests\AuthRequest`
- Default admin: `admin@taramen.com` / `password123` (seeded by `UserSeeder`)

## Domain Model
- `Category` has many `MenuItem`
- `MenuItem` belongs to `Category`, belongs to many `Discount` via `discount_items`, soft-deletes
- `Discount` belongs to many `MenuItem`
- `Employee` soft-deletes
- `Order` belongs to `Employee`, has many `OrderItem`
- `OrderItem` belongs to `Order`, `MenuItem`, optional `Discount`
- Discount types enum: `App\Enum\DiscountType`

## Database Schema
- Orders: `database/migrations/2026_01_23_103828_create_orders_table.php`
- Order items: `database/migrations/2026_01_23_105204_create_order_items_table.php`
- Discounts: `database/migrations/2026_01_17_093743_create_discounts_table.php`
- Discount pivot: `database/migrations/2026_01_18_041918_create_discount_items_table.php`
- Employees: `database/migrations/2026_01_17_181820_create_employees_table.php`
- Categories: `database/migrations/2026_01_16_004059_create_categories_table.php`
- Menu items: `database/migrations/2026_01_16_020559_create_menu_items_table.php`

## Services
- `OrderService`: transactions, totals, discount logic, stats
- `MenuItemService`: image storage, soft-delete archive/restore, availability
- `EmployeeService`: active toggles and CRUD
- `DiscountService`: CRUD and pivot attach
- `ReportService`: summary, per-employee, top-item queries

## API Surface (All Under `/api/v1`)
- Auth: `POST /login`, `POST /logout`, `GET /user`
- Categories: RESTful `/categories`
- Menu items: RESTful `/menu-items`, `PATCH /menu-items/{id}/toggle-availability`, `POST /menu-items/{id}/restore`
- Employees: RESTful `/employees`, `GET /employees/all`, `PATCH /employees/{id}/toggle-status`
- Discounts: RESTful `/discounts`, `GET /discounts/getActive`
- Orders: RESTful `/orders`, `PATCH /orders/{id}/status`, `GET /orders/stats`
- Reports: `POST /report` with `start_date`, `end_date`

## Validation
- Requests live in `app/Http/Requests`
- `OrderRequest`: filters and order payload
- `MenuItemRequest`: includes `image` validation
- `DiscountRequest`: expects `menu_items_id` array for pivot
 - `ReportRequest`: now allows optional `start_date`/`end_date` (with `end_date` >= `start_date`)

## Logging
- Endpoint access logs via dedicated channels in `config/logging.php`

## Seed Data
- `DatabaseSeeder` runs `UserSeeder`, `CategorySeeder`, `MenuItemSeeder`

## Notes
- REST client samples in `REST/*.http`
- `pos_dev_guide.md` is broader guidance and may not match current code exactly
 - Controllers now return consistent API envelopes via `App\Http\Responses\ApiResponse`:
   - `{ success: true|false, message: string, data: any, meta?: object, errors?: object }`
   - Auth endpoints remain unchanged for token handling
