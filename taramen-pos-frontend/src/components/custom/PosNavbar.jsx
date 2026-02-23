import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";

import IButton from "@/components/custom/Button";
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
      () => logout()
    );
  };

  return (
    <div className="fixed inset-x-0 top-0 z-20 flex h-[72px] items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 py-0 shadow-sm sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {showToggle ? (
          <IButton
            type="button"
            variant="outline"
            showLoading={false}
            onClick={onToggleSidebar}
            className="size-9 rounded-2xl border-gray-200 bg-white text-black shadow-md hover:border-orange/30 hover:text-black md:size-10"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-5" />
            )}
          </IButton>
        ) : null}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <img
            src="/Taramen.png"
            alt="Taramen POS"
            className="size-10 rounded-full object-cover sm:size-12 lg:size-14"
          />
          <div className="flex min-w-0">
            <Title size="2xl" className="truncate text-xl text-gray-900 sm:text-2xl">
              TA'rantado
            </Title>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <PosNotificationBar />
        <div className="flex items-center gap-2 rounded-2xl border border-transparent bg-transparent px-1 py-1 sm:px-2 sm:py-1.5">
          <Avatar className="size-8 sm:size-9">
            {profileAvatar ? (
              <AvatarImage src={profileAvatar} alt={profileName} />
            ) : null}
            <AvatarFallback className="bg-orange/10 text-orange">
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 flex-col text-left leading-tight xl:flex">
            <span className="truncate text-base font-semibold text-gray-900">
              {profileName}
            </span>
            <span className="truncate text-sm text-gray-500">{profileRole}</span>
          </div>
        </div>
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          className="size-9 rounded-2xl border-gray-200 bg-white text-gray-600 shadow-md hover:border-orange/30 hover:text-orange md:size-10"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
        </IButton>
      </div>
    </div>
  );
}
