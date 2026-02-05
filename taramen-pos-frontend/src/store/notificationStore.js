import { NOTIFICATIONS } from "@/shared/constants/dummy/notifSample";
import { create } from "zustand";

export const useNotificationStore = create((set) => ({
   notifications: NOTIFICATIONS,
   activeTab: "all",
   setActiveTab: (tab) => set({ activeTab: tab }),
   setNotifications: (data) => set({ notifications: data }),
}));

export default useNotificationStore;
