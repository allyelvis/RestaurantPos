'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function WaiterPanelComponent() {
  const [tables, setTables] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Fetch tables and orders from API
    fetch('/api/tables').then(response => response.json()).then(data => setTables(data))
    fetch('/api/orders').then(response => response.json()).then(data => setOrders(data))

    // Set up real-time updates
    const eventSource = new EventSource('/api/orders/events')
    eventSource.onmessage = (event) => {
      const updatedOrder = JSON.parse(event.data)
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order
        )
      )
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const handleTableStatusUpdate = (tableId, newStatus) => {
    fetch(`/api/tables/${tableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(response => response.json())
      .then(updatedTable => {
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === updatedTable.id ? updatedTable : table
          )
        )
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Waiter Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map(table => (
                  <TableRow key={table.id}>
                    <TableCell>{table.table_number}</TableCell>
                    <TableCell>{table.status}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleTableStatusUpdate(table.id, 'occupied')} size="sm">Seat</Button>
                      <Button onClick={() => handleTableStatusUpdate(table.id, 'available')} size="sm" className="ml-2">Clear</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.filter(order => order.status === 'ready').map(order => (
              <div key={order.id} className="mb-4">
                <h3 className="font-bold">Order #{order.id} - Table {order.table_id}</h3>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>{item.name} x{item.quantity}</li>
                  ))}
                </ul>
                <Button size="sm">Deliver</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}