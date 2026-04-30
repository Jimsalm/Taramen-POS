import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { DASHBOARD, MENU_CATEGORIES, MENU_ITEMS, STAFF, TAKE_ORDER } from "@/shared/constants/routes";

const LOCAL_STORAGE_KEY = "pos_sidebar_collapsed";

export function usePosLayoutState(title) {
  const { pathname } = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved === "true" || (typeof window !== "undefined" && window.innerWidth <= 1024);
  });

  const toggleSidebar = useCallback((value) => {
    setIsCollapsed((prev) => {
      const next = typeof value === "boolean" ? value : !prev;
      localStorage.setItem(LOCAL_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 64rem)");
    const handler = (e) => e.matches && setIsCollapsed(true);
    
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const breadcrumbs = useMemo(() => {
    const routeMap = {
      [DASHBOARD.path]: [{ label: DASHBOARD.title, path: DASHBOARD.path }],
      [TAKE_ORDER.path]: [{ label: TAKE_ORDER.title, path: TAKE_ORDER.path }],
      [MENU_CATEGORIES.path]: [{ label: "Menu", path: MENU_CATEGORIES.path }, { label: "Category" }],
      [MENU_ITEMS.path]: [{ label: "Menu", path: MENU_ITEMS.path }, { label: "Menu Items" }],
      [STAFF.path]: [{ label: STAFF.title, path: STAFF.path }],
    };

    return routeMap[pathname] ?? (title ? [{ label: title }] : []);
  }, [pathname, title]);

  return { isCollapsed, toggleSidebar, breadcrumbs };
}
