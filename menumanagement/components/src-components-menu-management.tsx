'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function MenuManagementComponent() {
  const [menuItems, setMenuItems] = useState([])
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '' })

  useEffect(() => {
    // Fetch menu items from API
    fetch('/api/menu')
      .then(response => response.json())
      .then(data => setMenuItems(data))
  }, [])

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add new menu item via API
    fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    })
      .then(response => response.json())
      .then(data => {
        setMenuItems([...menuItems, data])
        setNewItem({ name: '', description: '', price: '', category: '' })
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Item Name"
          className="mb-2"
        />
        <Input
          type="text"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="mb-2"
        />
        <Input
          type="number"
          name="price"
          value={newItem.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="mb-2"
        />
        <Input
          type="text"
          name="category"
          value={newItem.category}
          onChange={handleInputChange}
          placeholder="Category"
          className="mb-2"
        />
        <Button type="submit">Add Menu Item</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm" className="ml-2">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}