import { Book, Calendar, User2, Warehouse } from "lucide-react";

export const LOGIN = {
   path: "/",
   title: "Login",
};

export const DASHBOARD = {
   path: "/dashboard",
   title: "Dashboard",
   icon: Warehouse,
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