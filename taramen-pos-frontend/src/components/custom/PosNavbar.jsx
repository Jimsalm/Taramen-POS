import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";

import IButton from "@/components/custom/Button";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PosNotificationBar from "@/components/custom/PosNotificationBar";
import { useLogout } from "@/hooks/useAuth";
import { confirmAction } from "@/shared/helpers/confirmAction";

const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "TA";

export default function PosNavbar({
  breadcrumbs = [],
  isSidebarCollapsed,
  onToggleSidebar,
  profileName,
  profileRole,
  profileAvatar,
  showToggle = true,
}) {
  const logout = useLogout();
  const handleLogout = () => {
    confirmAction(
      "Sign out",
      "Are you sure you want to log out?",
      () => logout(),
    );
  };
  const currentLabel = breadcrumbs.at(-1)?.label || "Dashboard";

  return (
    <nav className="fixed inset-x-0 top-0 z-20 h-[72px] border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-full items-center gap-4 px-4 sm:px-5 lg:px-6">
        {showToggle ? (
          <IButton
            type="button"
            variant="outline"
            showLoading={false}
            onClick={onToggleSidebar}
            className="size-10 rounded-full border-gray-200 bg-white text-gray-700 hover:border-orange/30 hover:text-orange"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-5" />
            )}
          </IButton>
        ) : null}

        <header className="flex min-w-0 items-center gap-3">
          <img
            src="/taramen.svg"
            alt="Taramen POS"
            className="h-12 w-auto shrink-0 sm:h-14"
          />
        </header>

        <section className="ml-auto flex items-center gap-3">
          <PosNotificationBar />

          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {profileAvatar ? (
                <AvatarImage src={profileAvatar} alt={profileName} />
              ) : null}
              <AvatarFallback className="bg-orange/10 font-semibold text-orange">
                {getInitials(profileName)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-[140px] sm:block">
              <Title size="sm" className="truncate leading-tight text-gray-900">
                {profileName}
              </Title>
              <Paragraph size="sm" className="truncate uppercase leading-tight text-gray-500">
                {profileRole}
              </Paragraph>
            </div>
          </div>

          <IButton
            type="button"
            variant="outline"
            showLoading={false}
            className="size-10 rounded-full border-gray-200 bg-white text-gray-600 hover:border-orange/30 hover:text-orange"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
          </IButton>
        </section>
      </div>
    </nav>
  );
}
