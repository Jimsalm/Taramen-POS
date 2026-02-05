import { ChevronRight, LogOutIcon, MoreHorizontal, User2 } from "lucide-react";

import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubItem,
   SidebarProvider,
   SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { MODULES } from "@/shared/constants/routes";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function AppSidebar({ user }) {
   const navigate = useNavigate();
   const location = useLocation();
   const onSignOut = () => {
      // Simple logout - clear localStorage and navigate to login
      localStorage.removeItem("token");
      navigate("/");
   };

   const FOOTER_ITEMS = [
      { label: "Account", icon: User2, onClick: () => console.log("Account clicked") },
      {
         label: "Sign Out",
         icon: LogOutIcon,
         onClick: onSignOut,
         className: "text-destructive",
      },
   ];

   return (
      <TooltipProvider>
         <Sidebar collapsible="icon" className='border border-sidebar-border'>
         <SidebarContent className='p-2 bg-sidebar border border-sidebar-border text-sidebar-foreground'>
            {MODULES.map((module, index) =>
               module.modules.some((item) => !item.roles || item.roles.includes(user.role)) ? (
                  <SidebarGroup key={index}>
                     <SidebarGroupLabel className='text-sidebar-foreground'>{module.title}</SidebarGroupLabel>
                     <SidebarGroupContent>
                        <SidebarMenu className='gap-0 w-full'>
                           {module.modules.map((item) =>
                              item.roles && !item.roles.includes(user.role) ? null : item.children &&
                                item.children.length > 0 ? (
                                 <Collapsible key={item.title} className='group' asChild>
                                    <SidebarMenuItem>
                                       <CollapsibleTrigger asChild>
                                          <SidebarMenuButton asChild>
                                             <div
                                                className={cn(
                                                   "flex items-center justify-between gap-3 w-full text-sidebar-foreground text-base cursor-pointer select-none hover:bg-secondary/5! rounded hover:text-secondary! transition-all",
                                                   location.pathname.includes("inventory") &&
                                                      "bg-secondary/5! font-semibold text-secondary!",
                                                )}
                                             >
                                                <div className='flex items-center gap-2 mx-1.5'>
                                                   <item.icon className='size-4' />
                                                   <h1>{item.title}</h1>
                                                </div>
                                                <ChevronRight className='size-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-90' />
                                             </div>
                                          </SidebarMenuButton>
                                       </CollapsibleTrigger>

                                       <CollapsibleContent className='border-l border-gray-400' asChild>
                                          <SidebarMenuSub>
                                             {item.children.map((child) =>
                                                child.roles && !child.roles.includes(user.role) ? null : (
                                                   <SidebarMenuSubItem key={child.title}>
                                                      <SidebarMenuButton type='button' className='h-6' asChild>
                                                         <div
                                                            className={cn(
                                                               "flex items-center gap-3 w-full text-sidebar-foreground hover:text-secondary hover:bg-secondary/5 transition-all text-base cursor-pointer select-none",
                                                            )}
                                                            onClick={() => navigate(child.path)}
                                                         >
                                                            {child.icon ? (
                                                               <child.icon className='size-4' />
                                                            ) : (
                                                               <span className='size-4' />
                                                            )}
                                                            <h1>{child.title}</h1>
                                                         </div>
                                                      </SidebarMenuButton>
                                                   </SidebarMenuSubItem>
                                                ),
                                             )}
                                          </SidebarMenuSub>
                                       </CollapsibleContent>
                                    </SidebarMenuItem>
                                 </Collapsible>
                              ) : (
                                 <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                       <Tooltip>
                                          <TooltipTrigger asChild>
                                             <div
                                                className={cn(
                                                   `flex items-center justify-between gap-3 w-full text-sidebar-foreground hover:bg-secondary/5 rounded p-1.5 hover:text-secondary transition-all text-base cursor-pointer select-none`,
                                                   item.disabled && "opacity-50",
                                                   location.pathname === item.path &&
                                                      "bg-secondary/5 font-semibold text-secondary",
                                                )}
                                                onClick={() => (item.disabled ? {} : navigate(item.path))}
                                             >
                                                <div className='flex items-center gap-2 w-full text-sm'>
                                                   <item.icon className='size-4' />
                                                   <h1>{item.title}</h1>
                                                </div>
                                             </div>
                                          </TooltipTrigger>
                                          {item.disabled && (
                                             <TooltipContent side="right" sideOffset={0}>
                                                <p>Under Development</p>
                                             </TooltipContent>
                                          )}
                                       </Tooltip>
                                    </SidebarMenuButton>
                                 </SidebarMenuItem>
                              ),
                           )}
                        </SidebarMenu>
                     </SidebarGroupContent>
                  </SidebarGroup>
               ) : null,
            )}

            <SidebarGroup>
               <SidebarGroupLabel className='text-sidebar-foreground'>Account</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenuItem className='flex items-center justify-between'>
                     <SidebarMenuButton asChild>
                        <div className='flex items-center justify-between'>
                           <span className='flex items-center gap-2'>
                              <User2 className='size-4' />
                              <span>{user.username}</span>
                           </span>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <MoreHorizontal className='cursor-pointer size-4 text-gray-500' />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                 {FOOTER_ITEMS.map((item, index) => (
                                    <DropdownMenuItem key={index} onClick={item.onClick} className={item.className}>
                                       {item.icon && <item.icon className='mr-2 size-4' />}
                                       {item.label}
                                    </DropdownMenuItem>
                                 ))}
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </div>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter className='bg-sidebar'>
            <SidebarMenu>
               <p className='text-gray-400 text-xs'>Development In Progress</p>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
      </TooltipProvider>
   );
}
