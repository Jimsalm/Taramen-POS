import { LayoutGrid, List, ShoppingBag, Tag, Users } from "lucide-react";

export const LOGIN = {
   path: "/login",
   title: "Login",
};

export const LOGOUT = {
   path: "/logout",
   title: "Logout",
};

export const DASHBOARD = {
   path: "/dashboard",
   title: "Dashboard",
   icon: LayoutGrid,
};

export const TAKE_ORDER = {
   path: "/orders",
   title: "Take Order",
   icon: ShoppingBag,
};

export const MENU_CATEGORIES = {
   path: "/menu/categories",
   title: "Menu Categories",
   icon: Tag,
};

export const MENU_ITEMS = {
   path: "/menu/items",
   title: "Menu Items",
   icon: List,
};

export const STAFF = {
   path: "/staff",
   title: "Staff",
   icon: Users,
};

export const NOT_FOUND = {
   path: "*",
   title: "Not Found",
};

export const CORE_MODULES = {
   title: "Core Modules",
   modules: [DASHBOARD],
};

export const MORE_MODULES = {
   title: "More",
   modules: [],
};

export const MODULES = [CORE_MODULES, MORE_MODULES];
