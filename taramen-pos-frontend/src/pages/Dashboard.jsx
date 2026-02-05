import React from 'react';
import { AppSidebar } from '../components/custom/AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '../components/ui/sidebar';
import { 
  PlusCircle, FileText, UserPlus, 
  Bell, Search, DollarSign, CreditCard, Tag, UtensilsCrossed, ShoppingCart
} from 'lucide-react';

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar user={{ username: "Admin", role: "admin" }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-8">
          <SidebarTrigger className="-ml-1" />
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="ml-auto flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-[#F5AB29] w-64 text-sm"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F9FAFB]">
          {/* 1. STATS CARDS */}
          <div className="grid grid-cols-3 gap-6 w-full">
            <StatCard label="Today's Sales" value="$2,450.00" trend="+15%" icon={DollarSign} />
            <StatCard label="Total Orders" value="+142" trend="+5%" icon={CreditCard} />
            <StatCard label="Active Discounts" value="3" subtext="Currently active campaigns" icon={Tag} />
          </div>

          {/* 2. QUICK ACTIONS */}
          <section>
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-6">
              <ActionButton icon={PlusCircle} label="New Order" primary />
              <ActionButton icon={FileText} label="Manage Menu" />
              <ActionButton icon={UserPlus} label="Add Employee" />
            </div>
          </section>

          {/* 3. RECENT ORDERS TABLE */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Recent Orders</h3>
                <p className="text-sm text-gray-400">A list of recent orders placed today.</p>
              </div>
              <button className="text-sm font-semibold text-[#F5AB29] hover:underline">View All</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Type / Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Time</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <TableRow id="#1026" type="Delivery" status="Pending" time="2 mins ago" amount="$32.00" />
                <TableRow id="#1025" type="Table 2" status="Cooking" time="12 mins ago" amount="$120.50" />
                <TableRow id="#1024" type="Table 5" status="Completed" time="25 mins ago" amount="$45.00" />
                <TableRow id="#1023" type="Table 8" status="Completed" time="40 mins ago" amount="$88.20" />
              </tbody>
            </table>
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

// HELPER COMPONENTS
const StatCard = ({ label, value, trend, subtext, icon: Icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
    <Icon className="absolute right-6 top-6 text-gray-300" size={20} />
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <h4 className="text-2xl font-bold mt-1">{value}</h4>
    {trend ? (
      <p className="text-xs font-bold text-emerald-500 mt-2">
        <span className="inline-block rotate-45 mr-1">↑</span> {trend} 
        <span className="text-gray-400 font-normal ml-1 text-[10px]">from yesterday</span>
      </p>
    ) : (
      <p className="text-xs text-gray-400 mt-2">{subtext}</p>
    )}
  </div>
);

const ActionButton = ({ icon: Icon, label, primary }) => (
  <button className={`flex flex-col items-center justify-center p-8 rounded-3xl border transition-all ${
    primary 
    ? 'bg-[#D6C29F] border-[#C4B08D] text-[#111827]' 
    : 'bg-white border-gray-100 text-[#111827] hover:bg-gray-50'
  }`}>
    <Icon className="mb-3" size={24} />
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const TableRow = ({ id, type, status, time, amount }) => {
  const statusColors = {
    Pending: 'bg-blue-50 text-blue-600',
    Cooking: 'bg-orange-50 text-orange-600',
    Completed: 'bg-emerald-50 text-emerald-600'
  };
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm font-bold">{id}</td>
      <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
         {type.includes('Table') ? <UtensilsCrossed size={14}/> : <ShoppingCart size={14}/>} {type}
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[status]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-400">{time}</td>
      <td className="px-6 py-4 text-sm font-bold text-right">{amount}</td>
    </tr>
  );
};

export default Dashboard;