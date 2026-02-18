import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";

import IButton from "@/components/custom/Button";
import Paragraph from "@/components/custom/Paragraph";
import Title from "@/components/custom/Title";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PosNotificationBar from "@/components/custom/PosNotificationBar";
import { cn } from "@/lib/utils";

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
  return (
    <div className="fixed inset-x-0 top-0 z-20 flex h-[72px] items-center justify-between gap-3 border-b border-gray-100 bg-white px-6 py-0 shadow-sm font-['Manrope','Segoe_UI',system-ui,sans-serif]">
      <div className="flex items-center gap-3">
        {showToggle ? (
          <IButton
            type="button"
            variant="outline"
            showLoading={false}
            onClick={onToggleSidebar}
            className="size-10 rounded-2xl border-gray-200 bg-white text-black shadow-md hover:border-orange/30 hover:text-black"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-5" />
            )}
          </IButton>
        ) : null}
        <div className="flex items-center gap-3">
          <img
            src="/Taramen.png"
            alt="Taramen POS"
            className="size-14 rounded-full object-cover"
          />
          <div className="flex">
            <Title size="2xl" className="text-gray-900">
              TA'rantado
            </Title>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PosNotificationBar />
        <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-transparent px-2 py-1.5">
          <Avatar className="size-9">
            {profileAvatar ? (
              <AvatarImage src={profileAvatar} alt={profileName} />
            ) : null}
            <AvatarFallback className="bg-orange/10 text-orange">
              {getInitials(profileName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-lg font-semibold text-gray-900">
              {profileName}
            </span>
            <span className="text-base text-gray-500">{profileRole}</span>
          </div>
        </div>
        <IButton
          type="button"
          variant="outline"
          showLoading={false}
          className="size-10 rounded-2xl border-gray-200 bg-white text-gray-600 shadow-md hover:border-orange/30 hover:text-orange"
          aria-label="Logout"
        >
          <LogOut className="size-4" />
        </IButton>
      </div>
    </div>
  );
}
