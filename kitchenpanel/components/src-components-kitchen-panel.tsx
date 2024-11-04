'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function KitchenPanelComponent() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Fetch pending orders from API
    fetch('/api/orders?status=pending')
      .then(response => response.json())
      .then(data => setOrders(data))

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

  const handleStatusUpdate = (orderId, newStatus) => {
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(response => response.json())
      .then(updatedOrder => {
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === updatedOrder.id ? updatedOrder : order
          )
        )
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Kitchen Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id} - Table {order.table_id}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-4">
                {order.items.map(item => (
                  <li key={item.id}>{item.name} x{item.quantity}</li>
                ))}
              </ul>
              <div className="flex justify-between">
                <Button onClick={() => handleStatusUpdate(order.id, 'in-progress')}>Start</Button>
                <Button onClick={() => handleStatusUpdate(order.id, 'ready')}>Ready</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}