import React from 'react'
import ICard from '../components/custom/Card'
import IButton from '../components/custom/Button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Separator } from '../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  Clock,
  Star,
  Package,
  AlertCircle
} from 'lucide-react'

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Today's Revenue",
      value: "₱12,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Active Customers",
      value: "89",
      change: "+5.1%",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Avg. Order Value",
      value: "₱79.80",
      change: "+3.7%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ]

  const recentOrders = [
    { id: "#001", customer: "Juan Dela Cruz", items: 3, total: "₱245", status: "completed", time: "2 mins ago" },
    { id: "#002", customer: "Maria Santos", items: 5, total: "₱389", status: "preparing", time: "5 mins ago" },
    { id: "#003", customer: "Jose Reyes", items: 2, total: "₱156", status: "ready", time: "8 mins ago" },
    { id: "#004", customer: "Ana Lopez", items: 4, total: "₱298", status: "completed", time: "12 mins ago" }
  ]

  const topItems = [
    { name: "Tonkotsu Ramen", orders: 45, revenue: "₱2,250", rating: 4.8 },
    { name: "Miso Ramen", orders: 38, revenue: "₱1,520", rating: 4.6 },
    { name: "Shoyu Ramen", orders: 32, revenue: "₱1,440", rating: 4.7 },
    { name: "Spicy Ramen", orders: 28, revenue: "₱1,400", rating: 4.9 }
  ]

  const quickActions = [
    { icon: ShoppingCart, label: "Take Order" },
    { icon: Package, label: "Inventory" },
    { icon: Users, label: "Customer Management" },
    { icon: AlertCircle, label: "Reports" }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your restaurant overview.</p>
        </div>
        <div className="flex gap-3">
          <IButton variant="outline">Export Report</IButton>
          <IButton variant="brandRed">New Order</IButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <ICard key={index} cardClassName="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </ICard>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ICard title="Recent Orders" cardClassName="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <p className="text-sm text-gray-600">{order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                    </div>
                  </div>
                  {index < recentOrders.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </ICard>
        </div>

  
        <div className="space-y-6">
          <ICard title="Quick Actions" cardClassName="p-6">
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <IButton key={index} className="w-full justify-start" variant="outline">
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </IButton>
              ))}
            </div>
          </ICard>

       
          <ICard title="Daily Progress" cardClassName="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Sales Goal</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Orders Processed</span>
                  <span>89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Customer Satisfaction</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </ICard>
        </div>
      </div>
      
      <ICard title="Top Selling Items" cardClassName="p-6">
        <Tabs defaultValue="today" className="w-full">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topItems.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                  <p className="font-semibold text-[--color-brand-primary]">{item.revenue}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="week" className="mt-6">
            <p className="text-center text-gray-500 py-8">Weekly data coming soon...</p>
          </TabsContent>
          <TabsContent value="month" className="mt-6">
            <p className="text-center text-gray-500 py-8">Monthly data coming soon...</p>
          </TabsContent>
        </Tabs>
      </ICard>
    </div>
  )
}

export default Dashboard