# Restaurant POS System - Development Guide
## React Frontend + Laravel 12 Backend + MySQL

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Setup](#project-setup)
4. [Database Schema](#database-schema)
5. [Laravel Backend Structure](#laravel-backend-structure)
6. [API Routes](#api-routes)
7. [Laravel Controllers](#laravel-controllers)
8. [Laravel Models](#laravel-models)
9. [React Frontend Structure](#react-frontend-structure)
10. [Key Features Implementation](#key-features-implementation)
11. [Development Phases](#development-phases)
12. [Testing Checklist](#testing-checklist)

---

## Project Overview

### Purpose
A simple web-based POS system where admin takes orders at customer tables, saves them digitally, and generates automatic receipts.

### Key Functionalities
- Single admin account
- Employee assignment per order
- Menu management
- Discount management (preset & custom)
- Buy 1 Take 1 promotions
- Automatic receipt generation
- Daily sales reporting

---

## Technology Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form (optional)

### Backend
- **Framework**: Laravel 12
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **API**: RESTful API

### Development Tools
- **PHP**: 8.2+
- **Composer**: Dependency management
- **Node.js**: 18+
- **NPM/Yarn**: Package management

---

## Project Setup

### Backend Setup (Laravel)

```bash
# Create Laravel project
composer create-project laravel/laravel restaurant-pos-backend

cd restaurant-pos-backend

# Install Laravel Sanctum for API authentication
composer require laravel/sanctum

# Publish Sanctum configuration
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_pos
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Frontend Setup (React)

```bash
# Create React project with Vite
npm create vite@latest restaurant-pos-frontend -- --template react

cd restaurant-pos-frontend

# Install dependencies
npm install axios react-router-dom

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start development server
npm run dev
```

### Configure CORS in Laravel

**config/cors.php:**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173'], // Vite dev server
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## Database Schema

### Migration Files

Create migrations:
```bash
php artisan make:migration create_employees_table
php artisan make:migration create_categories_table
php artisan make:migration create_menu_items_table
php artisan make:migration create_discounts_table
php artisan make:migration create_discount_items_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
```

### Employees Table
```php
// database/migrations/xxxx_create_employees_table.php
public function up()
{
    Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->boolean('active')->default(true);
        $table->timestamps();
    });
}
```

### Categories Table
```php
// database/migrations/xxxx_create_categories_table.php
public function up()
{
    Schema::create('categories', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->integer('display_order')->default(0);
        $table->timestamps();
    });
}
```

### Menu Items Table
```php
// database/migrations/xxxx_create_menu_items_table.php
public function up()
{
    Schema::create('menu_items', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->decimal('price', 10, 2);
        $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
        $table->boolean('available')->default(true);
        $table->string('image')->nullable();
        $table->timestamps();
    });
}
```

### Discounts Table
```php
// database/migrations/xxxx_create_discounts_table.php
public function up()
{
    Schema::create('discounts', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->enum('type', ['percentage', 'fixed', 'buy1take1']);
        $table->decimal('value', 10, 2)->nullable();
        $table->boolean('active')->default(true);
        $table->timestamps();
    });
}
```

### Discount Items Table
```php
// database/migrations/xxxx_create_discount_items_table.php
public function up()
{
    Schema::create('discount_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('discount_id')->constrained()->onDelete('cascade');
        $table->foreignId('menu_item_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
}
```

### Orders Table
```php
// database/migrations/xxxx_create_orders_table.php
public function up()
{
    Schema::create('orders', function (Blueprint $table) {
        $table->id();
        $table->string('order_number')->unique();
        $table->foreignId('employee_id')->constrained();
        $table->string('table_number')->nullable();
        $table->decimal('subtotal', 10, 2);
        $table->foreignId('discount_id')->nullable()->constrained()->onDelete('set null');
        $table->decimal('discount_amount', 10, 2)->default(0);
        $table->decimal('total', 10, 2);
        $table->timestamps();
    });
}
```

### Order Items Table
```php
// database/migrations/xxxx_create_order_items_table.php
public function up()
{
    Schema::create('order_items', function (Blueprint $table) {
        $table->id();
        $table->foreignId('order_id')->constrained()->onDelete('cascade');
        $table->foreignId('menu_item_id')->constrained();
        $table->string('item_name');
        $table->integer('quantity');
        $table->decimal('price', 10, 2);
        $table->boolean('is_free')->default(false);
        $table->timestamps();
    });
}
```

### Run Migrations
```bash
php artisan migrate
```

---

## Laravel Backend Structure

### Folder Structure
```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── EmployeeController.php
│   │   ├── MenuItemController.php
│   │   ├── CategoryController.php
│   │   ├── DiscountController.php
│   │   ├── OrderController.php
│   │   └── ReportController.php
│   └── Middleware/
│       └── Authenticate.php
├── Models/
│   ├── User.php
│   ├── Employee.php
│   ├── MenuItem.php
│   ├── Category.php
│   ├── Discount.php
│   ├── DiscountItem.php
│   ├── Order.php
│   └── OrderItem.php
└── ...
```

---

## API Routes

### routes/api.php
```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Employees
    Route::apiResource('employees', EmployeeController::class);
    
    // Categories
    Route::apiResource('categories', CategoryController::class);
    
    // Menu Items
    Route::apiResource('menu-items', MenuItemController::class);
    Route::patch('menu-items/{id}/toggle-availability', [MenuItemController::class, 'toggleAvailability']);
    
    // Discounts
    Route::apiResource('discounts', DiscountController::class);
    Route::get('discounts/active/list', [DiscountController::class, 'activeDiscounts']);
    Route::patch('discounts/{id}/toggle', [DiscountController::class, 'toggle']);
    
    // Orders
    Route::apiResource('orders', OrderController::class);
    Route::get('orders/today/list', [OrderController::class, 'todayOrders']);
    Route::get('orders/{id}/receipt', [OrderController::class, 'receipt']);
    
    // Reports
    Route::get('reports/daily', [ReportController::class, 'daily']);
    Route::get('reports/sales-summary', [ReportController::class, 'salesSummary']);
    Route::get('reports/by-employee', [ReportController::class, 'byEmployee']);
});
```

---

## Laravel Controllers

### AuthController.php
```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### EmployeeController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return Employee::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $employee = Employee::create([
            'name' => $request->name,
            'active' => true,
        ]);

        return response()->json($employee, 201);
    }

    public function show($id)
    {
        return Employee::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'active' => 'boolean',
        ]);

        $employee->update($request->all());

        return response()->json($employee);
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted']);
    }
}
```

### MenuItemController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        return MenuItem::with('category')->orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'image_url' => 'nullable|string',
        ]);

        $menuItem = MenuItem::create($request->all());

        return response()->json($menuItem, 201);
    }

    public function show($id)
    {
        return MenuItem::with('category')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'price' => 'numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'available' => 'boolean',
            'image_url' => 'nullable|string',
        ]);

        $menuItem->update($request->all());

        return response()->json($menuItem);
    }

    public function destroy($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->delete();

        return response()->json(['message' => 'Menu item deleted']);
    }

    public function toggleAvailability($id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->available = !$menuItem->available;
        $menuItem->save();

        return response()->json($menuItem);
    }
}
```

### DiscountController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\DiscountItem;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index()
    {
        return Discount::with('menuItems')->get();
    }

    public function activeDiscounts()
    {
        return Discount::with('menuItems')
            ->where('active', true)
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:percentage,fixed,buy1take1',
            'value' => 'nullable|numeric|min:0',
            'menu_item_ids' => 'array',
            'menu_item_ids.*' => 'exists:menu_items,id',
        ]);

        $discount = Discount::create([
            'name' => $request->name,
            'type' => $request->type,
            'value' => $request->value,
            'active' => true,
        ]);

        // Attach menu items for buy1take1
        if ($request->type === 'buy1take1' && $request->has('menu_item_ids')) {
            foreach ($request->menu_item_ids as $menuItemId) {
                DiscountItem::create([
                    'discount_id' => $discount->id,
                    'menu_item_id' => $menuItemId,
                ]);
            }
        }

        return response()->json($discount->load('menuItems'), 201);
    }

    public function show($id)
    {
        return Discount::with('menuItems')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $discount = Discount::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'type' => 'in:percentage,fixed,buy1take1',
            'value' => 'nullable|numeric|min:0',
            'menu_item_ids' => 'array',
            'menu_item_ids.*' => 'exists:menu_items,id',
        ]);

        $discount->update($request->only(['name', 'type', 'value']));

        // Update menu items if provided
        if ($request->has('menu_item_ids')) {
            DiscountItem::where('discount_id', $discount->id)->delete();
            
            foreach ($request->menu_item_ids as $menuItemId) {
                DiscountItem::create([
                    'discount_id' => $discount->id,
                    'menu_item_id' => $menuItemId,
                ]);
            }
        }

        return response()->json($discount->load('menuItems'));
    }

    public function destroy($id)
    {
        $discount = Discount::findOrFail($id);
        $discount->delete();

        return response()->json(['message' => 'Discount deleted']);
    }

    public function toggle($id)
    {
        $discount = Discount::findOrFail($id);
        $discount->active = !$discount->active;
        $discount->save();

        return response()->json($discount);
    }
}
```

### OrderController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        return Order::with(['employee', 'discount', 'orderItems'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function todayOrders()
    {
        return Order::with(['employee', 'discount', 'orderItems'])
            ->whereDate('created_at', today())
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'table_number' => 'nullable|string',
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.item_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.is_free' => 'boolean',
            'subtotal' => 'required|numeric|min:0',
            'discount_id' => 'nullable|exists:discounts,id',
            'discount_amount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        // Generate order number
        $orderNumber = 'ORD' . date('Ymd') . strtoupper(Str::random(4));

        $order = Order::create([
            'order_number' => $orderNumber,
            'employee_id' => $request->employee_id,
            'table_number' => $request->table_number,
            'subtotal' => $request->subtotal,
            'discount_id' => $request->discount_id,
            'discount_amount' => $request->discount_amount ?? 0,
            'total' => $request->total,
        ]);

        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'item_name' => $item['item_name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'is_free' => $item['is_free'] ?? false,
            ]);
        }

        return response()->json([
            'order' => $order->load(['employee', 'discount', 'orderItems']),
            'order_number' => $orderNumber,
        ], 201);
    }

    public function show($id)
    {
        return Order::with(['employee', 'discount', 'orderItems.menuItem'])
            ->findOrFail($id);
    }

    public function receipt($id)
    {
        $order = Order::with(['employee', 'discount', 'orderItems'])
            ->findOrFail($id);

        return response()->json([
            'order_number' => $order->order_number,
            'date' => $order->created_at->format('Y-m-d H:i:s'),
            'table_number' => $order->table_number,
            'employee_name' => $order->employee->name,
            'items' => $order->orderItems->map(function ($item) {
                return [
                    'name' => $item->item_name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'is_free' => $item->is_free,
                ];
            }),
            'subtotal' => $order->subtotal,
            'discount_name' => $order->discount?->name,
            'discount_amount' => $order->discount_amount,
            'total' => $order->total,
        ]);
    }
}
```

### ReportController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function daily(Request $request)
    {
        $date = $request->get('date', today()->format('Y-m-d'));

        $summary = Order::whereDate('created_at', $date)
            ->selectRaw('
                COUNT(*) as total_orders,
                SUM(subtotal) as total_subtotal,
                SUM(discount_amount) as total_discounts,
                SUM(total) as total_sales
            ')
            ->first();

        $byEmployee = Order::whereDate('created_at', $date)
            ->join('employees', 'orders.employee_id', '=', 'employees.id')
            ->selectRaw('
                employees.name as employee_name,
                COUNT(orders.id) as order_count,
                SUM(orders.total) as total_sales
            ')
            ->groupBy('employees.id', 'employees.name')
            ->get();

        $topItems = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereDate('orders.created_at', $date)
            ->where('order_items.is_free', false)
            ->selectRaw('
                order_items.item_name,
                SUM(order_items.quantity) as total_quantity,
                SUM(order_items.price * order_items.quantity) as total_revenue
            ')
            ->groupBy('order_items.item_name')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get();

        return response()->json([
            'summary' => $summary,
            'by_employee' => $byEmployee,
            'top_items' => $topItems,
        ]);
    }

    public function salesSummary(Request $request)
    {
        $start = $request->get('start', today()->format('Y-m-d'));
        $end = $request->get('end', today()->format('Y-m-d'));

        $sales = Order::whereBetween('created_at', [$start, $end])
            ->selectRaw('
                DATE(created_at) as date,
                COUNT(*) as total_orders,
                SUM(total) as total_sales
            ')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($sales);
    }

    public function byEmployee(Request $request)
    {
        $start = $request->get('start', today()->format('Y-m-d'));
        $end = $request->get('end', today()->format('Y-m-d'));

        $sales = Order::whereBetween('created_at', [$start, $end])
            ->join('employees', 'orders.employee_id', '=', 'employees.id')
            ->selectRaw('
                employees.name as employee_name,
                COUNT(orders.id) as order_count,
                SUM(orders.total) as total_sales
            ')
            ->groupBy('employees.id', 'employees.name')
            ->orderBy('total_sales', 'desc')
            ->get();

        return response()->json($sales);
    }
}
```

---

## Laravel Models

### Employee.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = ['name', 'active'];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
```

### MenuItem.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    protected $fillable = [
        'name',
        'price',
        'category_id',
        'available',
        'image_url',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function discounts()
    {
        return $this->belongsToMany(Discount::class, 'discount_items');
    }
}
```

### Discount.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    protected $fillable = ['name', 'type', 'value', 'active'];

    protected $casts = [
        'value' => 'decimal:2',
        'active' => 'boolean',
    ];

    public function menuItems()
    {
        return $this->belongsToMany(MenuItem::class, 'discount_items');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
```

### Order.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'employee_id',
        'table_number',
        'subtotal',
        'discount_id',
        'discount_amount',
        'total',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

### OrderItem.php
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'menu_item_id',
        'item_name',
        'quantity',
        'price',
        'is_free',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_free' => 'boolean',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}
```

---

## React Frontend Structure

### Folder Structure
```
src/
├── components/
│   ├── Auth/
│   │   └── Login.jsx
│   ├── POS/
│   │   ├── POSScreen.jsx
│   │   ├── MenuGrid.jsx
│   │   ├── OrderSummary.jsx
│   │   └── DiscountSelector.jsx
│   ├── Admin/
│   │   ├── MenuManagement.jsx
│   │   ├── DiscountManagement.jsx
│   │   ├── EmployeeManagement.jsx
│   │   └── Reports.jsx
│   ├── Receipt/
│   │   └── ReceiptView.jsx
│   └── Layout/
│       ├── Navbar.jsx
│       └── Layout.jsx
├── contexts/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── utils/
│   ├── calculations.js
│   └── formatters.js
├── App.jsx
└── main.jsx
```

### API Service Configuration

**src/services/api.js:**
```javascript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

### Auth Context

**src/contexts/AuthContext.jsx:**
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('auth_token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        await api.post('/logout');
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

### Login Component

**src/components/Auth/Login.jsx:**
```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/pos');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Restaurant POS Login</h2>
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
```

### POS Screen Component

**src/components/POS/POSScreen.jsx:**
```javascript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MenuGrid from './MenuGrid';
import OrderSummary from './OrderSummary';

export default function POSScreen() {
    const [employees, setEmployees] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [tableNumber, setTableNumber] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, menuRes, discountRes] = await Promise.all([
                api.get('/employees'),
                api.get('/menu-items'),
                api.get('/discounts/active/list'),
            ]);

            setEmployees(empRes.data);
            setMenuItems(menuRes.data);
            setDiscounts(discountRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addToCart = (item) => {
        // Check if Buy1Take1 applies
        const buy1take1 = discounts.find(
            d => d.type === 'buy1take1' && 
            d.menu_items?.some(mi => mi.id === item.id)
        );

        if (buy1take1) {
            setCart([
                ...cart,
                { ...item, quantity: 1, is_free: false },
                { ...item, quantity: 1, is_free: true },
            ]);
        } else {
            const existing = cart.find(c => c.id === item.id && !c.is_free);
            if (existing) {
                setCart(cart.map(c => 
                    c.id === item.id && !c.is_free
                        ? { ...c, quantity: c.quantity + 1 }
                        : c
                ));
            } else {
                setCart([...cart, { ...item, quantity: 1, is_free: false }]);
            }
        }
    };

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, quantity) => {
        if (quantity === 0) {
            removeFromCart(index);
        } else {
            setCart(cart.map((item, i) => 
                i === index ? { ...item, quantity } : item
            ));
        }
    };

    const calculateTotals = () => {
        const subtotal = cart.reduce((sum, item) => {
            return sum + (item.is_free ? 0 : item.price * item.quantity);
        }, 0);

        let discountAmount = 0;
        if (selectedDiscount) {
            if (selectedDiscount.type === 'percentage') {
                discountAmount = subtotal * (selectedDiscount.value / 100);
            } else if (selectedDiscount.type === 'fixed') {
                discountAmount = selectedDiscount.value;
            }
        }

        const total = subtotal - discountAmount;
        return { subtotal, discountAmount, total };
    };

    const saveOrder = async () => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }

        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        const { subtotal, discountAmount, total } = calculateTotals();

        try {
            const response = await api.post('/orders', {
                employee_id: selectedEmployee,
                table_number: tableNumber,
                items: cart.map(item => ({
                    menu_item_id: item.id,
                    item_name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    is_free: item.is_free || false,
                })),
                subtotal,
                discount_id: selectedDiscount?.id,
                discount_amount: discountAmount,
                total,
            });

            navigate(`/receipt/${response.data.order.id}`);
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Failed to save order');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="flex-1 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Menu</h2>
                <MenuGrid items={menuItems} onAddToCart={addToCart} discounts={discounts} />
            </div>

            <div className="w-96 bg-white p-4 shadow-lg overflow-y-auto">
                <OrderSummary
                    employees={employees}
                    selectedEmployee={selectedEmployee}
                    setSelectedEmployee={setSelectedEmployee}
                    tableNumber={tableNumber}
                    setTableNumber={setTableNumber}
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    discounts={discounts}
                    selectedDiscount={selectedDiscount}
                    setSelectedDiscount={setSelectedDiscount}
                    totals={calculateTotals()}
                    onSaveOrder={saveOrder}
                />
            </div>
        </div>
    );
}
```

---

## Key Features Implementation

### 1. Create Admin Seeder

**database/seeders/AdminSeeder.php:**
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@restaurant.com',
            'password' => Hash::make('password123'),
        ]);
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=AdminSeeder
```

### 2. File Upload for Menu Images

**MenuItemController.php - Add upload method:**
```php
public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $path = $request->file('image')->store('menu-items', 'public');
    
    return response()->json([
        'url' => asset('storage/' . $path)
    ]);
}
```

**Add route in routes/api.php:**
```php
Route::post('menu-items/upload-image', [MenuItemController::class, 'uploadImage']);
```

**Create storage link:**
```bash
php artisan storage:link
```

---

## Development Phases

### Phase 1: Backend Setup (Week 1)
- [ ] Install Laravel 12
- [ ] Configure MySQL database
- [ ] Install Sanctum
- [ ] Create all migrations
- [ ] Run migrations
- [ ] Create all models with relationships
- [ ] Create admin seeder
- [ ] Test database connections

### Phase 2: Backend API (Week 1-2)
- [ ] Create all controllers
- [ ] Define API routes
- [ ] Implement authentication endpoints
- [ ] Implement CRUD for employees
- [ ] Implement CRUD for menu items
- [ ] Implement CRUD for discounts
- [ ] Implement order creation
- [ ] Implement reports endpoints
- [ ] Test all endpoints with Postman

### Phase 3: Frontend Setup (Week 2)
- [ ] Create React app with Vite
- [ ] Install Tailwind CSS
- [ ] Set up React Router
- [ ] Create API service
- [ ] Create Auth context
- [ ] Set up folder structure

### Phase 4: Authentication (Week 2)
- [ ] Build login page
- [ ] Implement protected routes
- [ ] Create layout component
- [ ] Add logout functionality

### Phase 5: Admin Pages (Week 3)
- [ ] Employee management page
- [ ] Menu management page
- [ ] Discount management page
- [ ] Image upload for menu items
- [ ] Category management (optional)

### Phase 6: POS Interface (Week 3-4)
- [ ] Create POS screen layout
- [ ] Build menu grid component
- [ ] Build order summary component
- [ ] Implement add to cart
- [ ] Implement Buy1Take1 logic
- [ ] Discount selector
- [ ] Calculate totals
- [ ] Save order functionality

### Phase 7: Receipt & Reports (Week 4)
- [ ] Create receipt view
- [ ] Format receipt for printing
- [ ] Daily report page
- [ ] Sales summary
- [ ] Employee performance report

### Phase 8: Testing & Deployment (Week 5)
- [ ] Full system testing
- [ ] Bug fixes
- [ ] UI/UX improvements
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Production database setup

---

## Testing Checklist

### Backend API Testing (Use Postman)
- [ ] POST /api/login - Login successful
- [ ] POST /api/login - Login fails with wrong credentials
- [ ] GET /api/employees - Returns employee list
- [ ] POST /api/employees - Creates employee
- [ ] GET /api/menu-items - Returns menu items
- [ ] POST /api/menu-items - Creates menu item
- [ ] GET /api/discounts/active/list - Returns active discounts
- [ ] POST /api/discounts - Creates discount
- [ ] POST /api/orders - Creates order successfully
- [ ] GET /api/orders/{id}/receipt - Returns receipt data
- [ ] GET /api/reports/daily - Returns daily report

### Frontend Testing
- [ ] Login page works
- [ ] Protected routes redirect to login
- [ ] Menu items display correctly
- [ ] Add to cart works
- [ ] Buy1Take1 auto-applies
- [ ] Discount selection works
- [ ] Quantity adjustment works
- [ ] Remove item works
- [ ] Totals calculate correctly
- [ ] Save order creates order
- [ ] Receipt displays properly
- [ ] Print receipt works
- [ ] Reports display data

---

## Useful Commands

### Laravel Commands
```bash
# Create controller
php artisan make:controller ControllerName

# Create model with migration
php artisan make:model ModelName -m

# Create seeder
php artisan make:seeder SeederName

# Run migrations
php artisan migrate

# Run specific seeder
php artisan db:seed --class=SeederName

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Create storage link
php artisan storage:link
```

### Git Commands
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Create .gitignore for Laravel
/node_modules
/public/hot
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.phpunit.result.cache
```

---

## Production Deployment

### Backend (Laravel) - Deploy to shared hosting or VPS

1. **Prepare for production:**
```bash
# Update .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. **Database:**
- Create production MySQL database
- Run migrations on production
- Seed admin account

3. **Server requirements:**
- PHP 8.2+
- MySQL 8.0+
- Composer
- Apache/Nginx

### Frontend (React) - Deploy to Vercel/Netlify

1. **Build for production:**
```bash
npm run build
```

2. **Update API URL:**
```javascript
// src/services/api.js
baseURL: import.meta.env.VITE_API_URL || 'https://api.yourdomain.com/api'
```

3. **Deploy:**
- Push to GitHub
- Connect to Vercel/Netlify
- Set environment variables
- Deploy

---

## Environment Variables

### Laravel (.env)
```env
APP_NAME="Restaurant POS"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_pos
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
```

### React (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

---

## Security Best Practices

1. **Laravel:**
- Never commit .env file
- Use strong APP_KEY
- Enable HTTPS in production
- Validate all inputs
- Use Laravel's built-in CSRF protection
- Hash passwords with bcrypt

2. **React:**
- Never expose API tokens in frontend code
- Validate data before sending to API
- Use HTTPS for all API calls
- Store tokens securely (httpOnly cookies preferred)

---

## Additional Resources

- Laravel Documentation: https://laravel.com/docs
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Laravel Sanctum: https://laravel.com/docs/sanctum
- Axios: https://axios-http.com

---

**Good luck with your development! 🚀**