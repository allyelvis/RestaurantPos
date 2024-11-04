'use client'

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  UserCircle,
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  ChefHat,
  User,
  Package,
  FileText,
  BarChart,
  Globe,
} from 'lucide-react'

export function DashboardComponent() {
  const modules = [
    { name: 'User Management', icon: <UserCircle className="h-6 w-6" />, path: '/users' },
    { name: 'Table Management', icon: <LayoutDashboard className="h-6 w-6" />, path: '/tables' },
    { name: 'Menu Management', icon: <ClipboardList className="h-6 w-6" />, path: '/menu' },
    { name: 'Order Management', icon: <ShoppingCart className="h-6 w-6" />, path: '/orders' },
    { name: 'Kitchen Panel', icon: <ChefHat className="h-6 w-6" />, path: '/kitchen' },
    { name: 'Waiter Panel', icon: <User className="h-6 w-6" />, path: '/waiter' },
    { name: 'Inventory Management', icon: <Package className="h-6 w-6" />, path: '/inventory' },
    { name: 'Stock Requisition', icon: <FileText className="h-6 w-6" />, path: '/requisitions' },
    { name: 'Accounting', icon: <BarChart className="h-6 w-6" />, path: '/accounting' },
    { name: 'Online Menu', icon: <Globe className="h-6 w-6" />, path: '/online-menu' },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Restaurant POS Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{module.name}</CardTitle>
              {module.icon}
            </CardHeader>
            <CardContent>
              <Link to={module.path}>
                <Button className="w-full">Access Module</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}