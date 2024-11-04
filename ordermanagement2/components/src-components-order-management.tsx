'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function OrderManagementComponent() {
  const [orders, setOrders] = useState([])
  const [tables, setTables] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [newOrder, setNewOrder] = useState({ table_id: '', items: [] })

  useEffect(() => {
    // Fetch orders, tables, and menu items from API
    fetch('/api/orders').then(response => response.json()).then(data => setOrders(data))
    fetch('/api/tables').then(response => response.json()).then(data => setTables(data))
    fetch('/api/menu').then(response => response.json()).then(data => setMenuItems(data))
  }, [])

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value })
  }

  const handleAddItem = (item_id) => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { menu_item_id: item_id, quantity: 1 }]
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add new order via API
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    })
      .then(response => response.json())
      .then(data => {
        setOrders([...orders, data])
        setNewOrder({ table_id: '', items: [] })
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Select
          name="table_id"
          value={newOrder.table_id}
          onChange={handleInputChange}
          className="mb-2"
        >
          <option value="">Select Table</option>
          {tables.map(table => (
            <option key={table.id} value={table.id}>Table {table.table_number}</option>
          ))}
        </Select>
        <div className="mb-2">
          {menuItems.map(item => (
            <Button key={item.id} onClick={() => handleAddItem(item.id)} className="mr-2 mb-2">
              {item.name}
            </Button>
          ))}
        </div>
        <Button type="submit">Place Order</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>Table {order.table_id}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm" className="ml-2">Cancel</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}