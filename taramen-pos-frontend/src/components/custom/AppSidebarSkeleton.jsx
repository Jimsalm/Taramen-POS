import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuItem,
   SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppSidebarSkeleton() {
   return (
      <Sidebar className='border border-sidebar-border'>
         <SidebarContent className='p-2 bg-sidebar border border-sidebar-border text-sidebar-foreground'>
            {/* Module groups skeleton */}
            {[1, 2].map((group) => (
               <SidebarGroup key={group}>
                  <SidebarGroupLabel>
                     <Skeleton className='h-4 w-24' />
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                     <SidebarMenu className='gap-0 w-full'>
                        {[1, 2, 3].map((item) => (
                           <SidebarMenuItem key={item}>
                              <SidebarMenuButton asChild>
                                 <div className='flex items-center gap-3 w-full p-1.5'>
                                    <Skeleton className='size-4 rounded' />
                                    <Skeleton className='h-4 w-32' />
                                 </div>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        ))}
                     </SidebarMenu>
                  </SidebarGroupContent>
               </SidebarGroup>
            ))}

            {/* Account section skeleton */}
            <SidebarGroup>
               <SidebarGroupLabel>
                  <Skeleton className='h-4 w-16' />
               </SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenuItem className='flex items-center justify-between'>
                     <SidebarMenuButton asChild>
                        <div className='flex items-center justify-between w-full'>
                           <span className='flex items-center gap-2'>
                              <Skeleton className='size-4 rounded-full' />
                              <Skeleton className='h-4 w-24' />
                           </span>
                           <Skeleton className='size-4' />
                        </div>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter className='bg-sidebar'>
            <SidebarMenu>
               <Skeleton className='h-3 w-40' />
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
