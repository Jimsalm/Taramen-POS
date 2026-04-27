# Taramen POS API Naming Reference

This file documents the actual API naming currently used by the backend.

Base prefix:

```text
/api/v1
```

Most routes below are protected by `auth:sanctum`.

## General Rules

- Use snake_case field names in requests and responses.
- Use the route names exactly as defined here.
- Do not invent frontend aliases like `is_available`, `categoryId`, `tableNo`, or `employeeId` when talking to the API.
- For menu items, the real boolean field is `available`.
- For orders, the real fields are `employee_id`, `table_number`, `total_discount`, and `total_amount`.
- `/get/menu-item` does not exist in the current route files.

## Employees

Routes:

```text
GET    /employees
GET    /employees/all
POST   /employees
GET    /employees/{id}
PUT    /employees/{id}
PATCH  /employees/{id}
DELETE /employees/{id}
PATCH  /employees/{id}/toggle-status
```

Actual fields:

```json
{
  "id": 1,
  "name": "James Maglolona",
  "active": true,
  "created_at": "2026-02-10T08:25:24.000000Z",
  "updated_at": "2026-02-12T07:11:12.000000Z",
  "deleted_at": null
}
```

Create/update request fields:

```json
{
  "name": "James Maglolona",
  "active": true,
  "profile": "image file"
}
```

Notes:

- `GET /employees` is the resource index route.
- `GET /employees/all` is a separate route for all employees.
- Status toggle route uses `toggle-status`, not `toggle-active`.

## Categories

Routes:

```text
GET    /categories
POST   /categories
GET    /categories/{id}
PUT    /categories/{id}
PATCH  /categories/{id}
DELETE /categories/{id}
```

Actual fields:

```json
{
  "id": 1,
  "name": "Ramenagi1231231231223",
  "description": "BULALO SINUSU12312312312TSUT23.",
  "created_at": "2026-02-05T04:57:07.000000Z",
  "updated_at": "2026-02-12T07:16:02.000000Z",
  "deleted_at": null
}
```

Create/update request fields:

```json
{
  "name": "Ramen",
  "description": "Category description",
  "status": true,
  "image": "image file"
}
```

Notes:

- The request validator accepts `status`, but the sample response you shared does not include it.
- `category_id` is the correct foreign key name when categories are referenced by other resources.

## Menu Items

Routes:

```text
GET    /menu-items
GET    /menu-items/available
POST   /menu-items
GET    /menu-items/{id}
PUT    /menu-items/{id}
PATCH  /menu-items/{id}
DELETE /menu-items/{id}
PATCH  /menu-items/{id}/toggle-availability
POST   /menu-items/{id}/restore
```

Actual response shape:

```json
{
  "id": 2,
  "name": "tonkatsu bowl",
  "price": "259.00",
  "category_id": 2,
  "available": true,
  "image": null,
  "created_at": "2026-02-19T03:08:10.000000Z",
  "updated_at": "2026-02-19T03:08:10.000000Z",
  "deleted_at": null
}
```

Create/update request fields:

```json
{
  "name": "Classic Ramen",
  "price": 150,
  "category_id": 1,
  "available": true,
  "status": true,
  "image": "image file"
}
```

Notes:

- Use `available`, not `is_available`.
- Use `category_id`, not `categoryId`.
- The toggle route is `toggle-availability`, not `toggle-status`.
- `GET /menu-items/available` is the current route for available items.
- `/get/menu-item` is not present in the current backend routes.

## Discounts

Routes:

```text
GET    /discounts
GET    /discounts/{id}
POST   /discounts
PUT    /discounts/{id}
PATCH  /discounts/{id}
DELETE /discounts/{id}
GET    /discounts/getActive
```

Create request example:

```json
{
  "name": "50% Off Select Items",
  "discount_type_id": 1,
  "value": 50,
  "active": true,
  "menu_items_id": [2, 3]
}
```

Actual request field names:

```json
{
  "name": "string",
  "discount_type_id": 1,
  "value": 50,
  "active": true,
  "menu_items_id": [2, 3]
}
```

Notes:

- Use `discount_type_id`, not `type_id`.
- Use `menu_items_id`, not `menu_item_ids`.
- `GET /discounts/getActive` exists as a separate route.

## Orders

Routes:

```text
GET    /orders
POST   /orders
GET    /orders/{id}
PUT    /orders/{id}
PATCH  /orders/{id}
DELETE /orders/{id}
GET    /orders?status=completed
GET    /orders/stats?date_from=2026-01-01&date_to=2026-02-28
PATCH  /orders/{id}/status
GET    /orders/{id}/receipt
```

Actual order response shape:

```json
{
  "id": 3,
  "order_number": "202602120001",
  "employee_id": 2,
  "table_number": "5",
  "subtotal": "397.00",
  "total_discount": "158.80",
  "total_amount": "238.20",
  "status": "pending",
  "created_at": "2026-02-12T07:44:17.000000Z",
  "updated_at": "2026-02-12T07:44:35.000000Z"
}
```

Actual order item response shape:

```json
{
  "id": 4,
  "order_id": 3,
  "menu_item_id": 3,
  "item_name": "sushi platters",
  "unit_price": "160.00",
  "quantity": 1,
  "subtotal": "160.00",
  "discount_id": 1,
  "discount_type": "percentage",
  "discount_name": "40% Off Select Items",
  "discount_amount": "64.00",
  "total_amount": "96.00",
  "created_at": "2026-02-12T07:44:23.000000Z",
  "updated_at": "2026-02-12T07:44:23.000000Z"
}
```

Create request fields:

```json
{
  "employee_id": 1,
  "table_number": "5",
  "items": [
    {
      "menu_item_id": 2,
      "quantity": 2,
      "discount_id": 1
    }
  ]
}
```

Filter/query fields:

```json
{
  "status": "pending|completed|cancelled",
  "employee_id": 1,
  "table_number": "5",
  "date_from": "2026-01-01",
  "date_to": "2026-02-28",
  "today": true,
  "per_page": 10
}
```

Status update request:

```json
{
  "status": "completed"
}
```

Notes:

- Use `employee_id`, not `server`, `staff_id`, or `employeeId`.
- Use `table_number`, not `table_no` or `tableNo`.
- Use `total_discount`, not `discount_amount`.
- Use `total_amount`, not `total`.
- Order status values are `pending`, `completed`, and `cancelled`.

## Discount Types

Routes:

```text
POST /get/discount-types
POST /create/discount-types
POST /update/discount-types
POST /delete/discount-types
```

Actual response shape:

```json
{
  "success": true,
  "message": "Discount types fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "percentage",
      "created_at": "2026-02-22T08:02:22.000000Z",
      "updated_at": "2026-02-22T08:02:22.000000Z",
      "deleted_at": null
    }
  ]
}
```

Notes:

- The route file name is `routes/api/v1/discountType.php`.
- These routes are handled by `DiscountController`.
- The naming here is non-REST and should be used exactly as written.

## Frontend Mapping Notes

Use these names directly in frontend code:

```text
employees: id, name, active
categories: id, name, description
menu items: id, name, price, category_id, available, image
discounts: id, name, discount_type_id, value, active, menu_items_id
orders: id, order_number, employee_id, table_number, subtotal, total_discount, total_amount, status
order items: menu_item_id, quantity, discount_id
```

Avoid these frontend-only aliases when sending data to the backend:

```text
is_available
categoryId
tableNo
table_no
employeeId
server
discountAmount
promoDiscountAmount
total
```
