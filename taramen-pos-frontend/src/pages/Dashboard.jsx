import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <SidebarInset>
       <h1>hatdog</h1>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Dashboard;