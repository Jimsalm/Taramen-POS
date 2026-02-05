import { ChevronRight } from "lucide-react";

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { useNavigate, useLocation } from "react-router-dom";
import { MODULES, DASHBOARD } from "@/shared/constants/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/shared/lib/utils";
// Auth helper functions moved inline to resolve 404 error
const getUserAvailableModules = (user, allModules = []) => {
  if (!user || !user.roles) return [];
  if (!allModules || !allModules.length) return [];
  if (user.roles.includes('superadmin')) return allModules;
  
  return allModules.filter(module => 
    !module.roles || !module.roles.length || 
    module.roles.some(role => user.roles.includes(role))
  );
};

const isRouteDisabled = (route) => {
  if (!route) return { status: 'denied', message: 'Route not found' };
  if (route.status === 'development') {
    return { status: 'development', message: 'This feature is under development' };
  }
  return { status: 'accessible', message: '' };
};
import { useEffect, useMemo } from "react";
import useSidebarStore from "@/store/sidebarStore";
import ITooltip from "./Tooltip";
import Title from "./Title";


export function AppSidebar({ user, enableCollapse = true }) {
   const navigate = useNavigate();
   const location = useLocation();
   const { isHovered, setIsHovered, setIsCollapsed, openItems, setOpenItems, resetOpenItems, isMobile, setIsMobile } =
      useSidebarStore();

   const { availableModules, isCollapsed } = useMemo(() => {
      const isRouteDashboard = location.pathname === DASHBOARD.path;

      return {
         availableModules: getUserAvailableModules(user, MODULES),
         isCollapsed: !isRouteDashboard && !isHovered && enableCollapse,
      };
   }, [user, location.pathname, isHovered, enableCollapse]);

   useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
   }, [setIsMobile]);

   useEffect(() => {
      setIsHovered(false);
      resetOpenItems();
   }, []);

   useEffect(() => {
      setIsCollapsed(isCollapsed && enableCollapse);
      if (isCollapsed) resetOpenItems();
   }, [isCollapsed, enableCollapse]);

   return (
      <Sidebar
         className={cn(
            "border border-sidebar-border md:mt-16 transition-all duration-500 ease-in-out",
            isCollapsed ? "w-22" : "w-64 lg:w-90",
         )}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         onClick={() => setIsHovered(true)}
      >
         <SidebarContent className='bg-sidebar border border-sidebar-border text-sidebar-foreground p-2'>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarHeader className='mb-2 flex md:hidden items-center gap-2'>
                     <img src={BulsuLogo} alt='Bulsu Logo' className='size-12' />
                     <header className='flex items-center gap-2'>
                        <Title className={cn("")}>Elib Management System</Title>
                     </header>
                  </SidebarHeader>

                  <SidebarMenu className='gap-0.5 w-full'>
                     {availableModules.map((item) =>
                        item.children && item.children.length > 0 ? (
                           <Collapsible
                              key={item.title}
                              className='group'
                              asChild
                              open={isMobile || !isCollapsed ? openItems[item.title] || false : false}
                              onOpenChange={(open) => setOpenItems({ ...openItems, [item.title]: open })}
                           >
                              <SidebarMenuItem>
                                 <CollapsibleTrigger asChild>
                                    <SidebarMenuButton asChild className='h-auto px-1.5 py-3! relative mt-0.5'>
                                       <div
                                          className={cn(
                                             `flex items-center gap-2 sm:gap-3 w-full hover:bg-primary! hover:text-white! rounded-lg transition-all text-sm sm:text-base cursor-pointer select-none`,
                                             item.disabled && "opacity-50",
                                             location.pathname.includes(item.path) &&
                                                "bg-primary text-white font-semibold",
                                          )}
                                       >
                                          <span
                                             className={cn(
                                                "flex items-center gap-4 mx-1 font-semibold text-sm lg:text-base",
                                                location.pathname === item.path && "text-white",
                                             )}
                                          >
                                             <item.icon className='size-6 ml-1.5' />
                                             <h1
                                                className={cn(
                                                   "absolute left-14 whitespace-nowrap transition-opacity duration-300 ease-in-out flex items-center w-full",
                                                   isMobile
                                                      ? "opacity-100"
                                                      : isCollapsed
                                                        ? "opacity-0 w-0"
                                                        : "opacity-100 delay-100",
                                                )}
                                             >
                                                {item.title}
                                             </h1>
                                             <ChevronRight
                                                className={cn(
                                                   "absolute right-4 size-4 transition-transform duration-300 group-data-[state=open]:rotate-90",
                                                   isMobile
                                                      ? "opacity-100"
                                                      : isCollapsed
                                                        ? "opacity-0 w-0"
                                                        : "opacity-100 transition-opacity delay-200",
                                                )}
                                             />
                                          </span>
                                       </div>
                                    </SidebarMenuButton>
                                 </CollapsibleTrigger>

                                 <CollapsibleContent className='border-l border-gray-400' asChild>
                                    <SidebarMenuSub>
                                       {item.children.map((child) => {
                                          if (isRouteDisabled(user, child, false)) return null;

                                          const isChildDisabled = child.disabled || !child.element;

                                          return (
                                             <SidebarMenuSubItem key={child.title}>
                                                <ITooltip
                                                   label={isChildDisabled ? "Under Development" : ""}
                                                   placement='right'
                                                   sideOffset={0}
                                                   className='w-full!'
                                                   tooltipClassName='bg-primary'
                                                >
                                                   <SidebarMenuButton type='button' className='h-auto' asChild>
                                                      <div
                                                         className={cn(
                                                            "flex items-center gap-2 w-full hover:bg-primary! hover:text-white! transition-all duration-300 text-sm sm:text-base cursor-pointer select-none px-4! py-3!",
                                                            location.pathname.endsWith(`${item.path}${child.path}`) &&
                                                               "bg-primary font-semibold text-white!",
                                                            isChildDisabled &&
                                                               "opacity-50 hover:bg-transparent! hover:text-black/60!",
                                                         )}
                                                         onClick={() =>
                                                            isChildDisabled ? {} : navigate(`${item.path}${child.path}`)
                                                         }
                                                      >
                                                         {child.icon && (
                                                            <child.icon className='size-3 sm:size-4 shrink-0' />
                                                         )}

                                                         <h1
                                                            className={cn(
                                                               "text-xs sm:text-sm whitespace-nowrap transition-opacity duration-300 ease-in-out",
                                                               isMobile
                                                                  ? "opacity-100"
                                                                  : isCollapsed
                                                                    ? "opacity-0 w-0"
                                                                    : "opacity-100 delay-100",
                                                            )}
                                                         >
                                                            {child.title}
                                                         </h1>
                                                      </div>
                                                   </SidebarMenuButton>
                                                </ITooltip>
                                             </SidebarMenuSubItem>
                                          );
                                       })}
                                    </SidebarMenuSub>
                                 </CollapsibleContent>
                              </SidebarMenuItem>
                           </Collapsible>
                        ) : (
                           <SidebarMenuItem key={item.title}>
                              {(() => {
                                 const isItemDisabled = item.disabled || !item.element;

                                 return (
                                    <SidebarMenuButton asChild className='h-auto p-0.5!'>
                                       <ITooltip
                                          label={isItemDisabled ? "Under Development" : ""}
                                          placement='right'
                                          sideOffset={0}
                                       >
                                          <div
                                             onClick={() => (isItemDisabled ? {} : navigate(item.path))}
                                             className={cn(
                                                `flex items-center gap-2 sm:gap-3 w-full hover:bg-primary hover:text-white rounded-lg px-1 py-3 transition-all text-sm sm:text-base cursor-pointer select-none`,
                                                isItemDisabled &&
                                                   "opacity-50 hover:bg-transparent! hover:text-black/60!",
                                                location.pathname === item.path && "bg-primary font-semibold",
                                             )}
                                          >
                                             <span
                                                className={cn(
                                                   "flex items-center gap-4 mx-1 font-semibold text-sm lg:text-base",
                                                   location.pathname === item.path && "text-white",
                                                )}
                                             >
                                                <item.icon className='size-5 lg:size-6 ml-1.5' />
                                                <h1
                                                   className={cn(
                                                      "absolute left-12 lg:left-14 text-xs lg:text-base whitespace-nowrap transition-opacity duration-300 ease-in-out",
                                                      isMobile
                                                         ? "opacity-100"
                                                         : isCollapsed
                                                           ? "opacity-0 w-0"
                                                           : "opacity-100 delay-100",
                                                   )}
                                                >
                                                   {item.title}
                                                </h1>
                                             </span>
                                          </div>
                                       </ITooltip>
                                    </SidebarMenuButton>
                                 );
                              })()}
                           </SidebarMenuItem>
                        ),
                     )}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter className='bg-sidebar p-1.5 sm:p-2'>
            <SidebarMenu>
               <p
                  className={cn(
                     "text-gray-400 text-[10px] sm:text-xs whitespace-nowrap transition-opacity duration-300 ease-in-out",
                     isMobile ? "opacity-100" : isCollapsed ? "opacity-0 h-0" : "opacity-100 delay-100",
                  )}
               >
                  Version {import.meta.env.VITE_APP_VERSION}
               </p>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
