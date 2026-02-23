import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import PosNavbar from "@/components/custom/PosNavbar";
import PosSidebar from "@/components/custom/PosSidebar";
import { getRequestFileUrl } from "@/shared/helpers/getRequestFileUrl";
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
    if (window.innerWidth <= 1024) return true;
    const stored = localStorage.getItem("pos_sidebar_collapsed");
    return stored ? stored === "true" : true;
  });
  const [isTabletViewport, setIsTabletViewport] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 1024;
  });
  const wasTabletViewport = useRef(isTabletViewport);
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
  const profileAvatar = getRequestFileUrl(
    profile?.avatarUrl || profile?.avatar || "",
    Boolean(profile?.avatarIsPrivate ?? profile?.avatar_is_private ?? false),
    "",
  );

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

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleTabletChange = (event) => {
      setIsTabletViewport(event.matches);
    };

    setIsTabletViewport(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleTabletChange);

    return () => {
      mediaQuery.removeEventListener("change", handleTabletChange);
    };
  }, []);

  useEffect(() => {
    const enteredTablet = isTabletViewport && !wasTabletViewport.current;
    if (enteredTablet) {
      updateSidebarCollapsed(true);
    }
    wasTabletViewport.current = isTabletViewport;
  }, [isTabletViewport, updateSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px]">
      <PosNavbar
        breadcrumbs={breadcrumbItems}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => updateSidebarCollapsed((prev) => !prev)}
        profileName={profileName}
        profileRole={profileRole}
        profileAvatar={profileAvatar}
        showToggle={false}
      />
      <div className="flex h-[calc(100vh-72px)] items-stretch overflow-hidden">
        <PosSidebar
          isCollapsed={isSidebarCollapsed}
          onRequestExpand={() => updateSidebarCollapsed(false)}
          onToggleCollapse={() => updateSidebarCollapsed((prev) => !prev)}
        />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            {title ? <h1 className="text-xl font-semibold text-gray-900 md:text-2xl">{title}</h1> : null}
            {description ? (
              <p className="mt-1.5 text-sm text-gray-500">{description}</p>
            ) : null}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
