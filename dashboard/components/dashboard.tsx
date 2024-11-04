'use client'

import React from 'react'
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
    { name: 'User Management', icon: <UserCircle className="h-6 w-6" /> },
    { name: 'Table Management', icon: <LayoutDashboard className="h-6 w-6" /> },
    { name: 'Menu Management', icon: <ClipboardList className="h-6 w-6" /> },
    { name: 'Order Management', icon: <ShoppingCart className="h-6 w-6" /> },
    { name: 'Kitchen Panel', icon: <ChefHat className="h-6 w-6" /> },
    { name: 'Waiter Panel', icon: <User className="h-6 w-6" /> },
    { name: 'Inventory Management', icon: <Package className="h-6 w-6" /> },
    { name: 'Stock Requisition', icon: <FileText className="h-6 w-6" /> },
    { name: 'Accounting', icon: <BarChart className="h-6 w-6" /> },
    { name: 'Online Menu', icon: <Globe className="h-6 w-6" /> },
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
              <Button className="w-full">Access Module</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}