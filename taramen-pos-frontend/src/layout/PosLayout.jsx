import { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import PosNavbar from "@/components/custom/PosNavbar";
import PosSidebar from "@/components/custom/PosSidebar";
import {
  DASHBOARD,
  MENU_CATEGORIES,
  MENU_ITEMS,
  STAFF,
  TAKE_ORDER,
} from "@/shared/constants/routes";

export default function PosLayout({ title, description, children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("pos_sidebar_collapsed");
    return stored ? stored === "true" : true;
  });
  const location = useLocation();
  const profile = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("auth_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const profileName =
    profile?.name || profile?.fullName || profile?.username || "Alex Morgan";
  const profileRole =
    profile?.role || profile?.title || profile?.roles?.[0] || "Store Manager";
  const profileAvatar = profile?.avatarUrl || profile?.avatar || "";

  const breadcrumbItems = useMemo(() => {
    const map = {
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

    return map[location.pathname] ?? (title ? [{ label: title }] : []);
  }, [location.pathname, title]);

  const updateSidebarCollapsed = useCallback((value) => {
    setIsSidebarCollapsed((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      if (typeof window !== "undefined") {
        localStorage.setItem("pos_sidebar_collapsed", String(next));
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <PosNavbar
        breadcrumbs={breadcrumbItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => updateSidebarCollapsed((prev) => !prev)}
        profileName={profileName}
        profileRole={profileRole}
        profileAvatar={profileAvatar}
        showToggle={false}
      />
      <div className="flex h-[calc(100vh-72px)] items-stretch pt-[72px]">
        <PosSidebar
          isCollapsed={isSidebarCollapsed}
          onRequestExpand={() => updateSidebarCollapsed(false)}
          onToggleCollapse={() => updateSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col px-6 py-6">
            {title ? <h1 className="text-2xl font-semibold text-gray-900">{title}</h1> : null}
            {description ? (
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
