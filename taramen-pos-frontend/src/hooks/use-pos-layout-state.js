import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  DASHBOARD,
  MENU_CATEGORIES,
  MENU_ITEMS,
  STAFF,
  TAKE_ORDER,
} from "@/shared/constants/routes";

export function usePosLayoutState(title) {
  const { pathname } = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    return (
      localStorage.getItem("pos_sidebar_collapsed") === "true" ||
      window.innerWidth <= 1024
    );
  });

  const toggleSidebar = useCallback((value) => {
    setIsCollapsed((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (typeof window !== "undefined") {
        localStorage.setItem("pos_sidebar_collapsed", String(next));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleResize = (event) => {
      if (event.matches) toggleSidebar(true);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [toggleSidebar]);

  const breadcrumbs = useMemo(() => {
    const routes = {
      [DASHBOARD.path]: [{ label: DASHBOARD.title, path: DASHBOARD.path }],
      [TAKE_ORDER.path]: [{ label: TAKE_ORDER.title, path: TAKE_ORDER.path }],
      [MENU_CATEGORIES.path]: [
        { label: "Menu", path: MENU_CATEGORIES.path },
        { label: "Category" },
      ],
      [MENU_ITEMS.path]: [
        { label: "Menu", path: MENU_ITEMS.path },
        { label: "Menu Items" },
      ],
      [STAFF.path]: [{ label: STAFF.title, path: STAFF.path }],
    };

    return routes[pathname] ?? (title ? [{ label: title }] : []);
  }, [pathname, title]);

  return { isCollapsed, toggleSidebar, breadcrumbs };
}
