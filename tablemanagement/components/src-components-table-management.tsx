'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function TableManagementComponent() {
  const [tables, setTables] = useState([])
  const [newTable, setNewTable] = useState({ table_number: '', capacity: '' })

  useEffect(() => {
    // Fetch tables from API
    fetch('/api/tables')
      .then(response => response.json())
      .then(data => setTables(data))
  }, [])

  const handleInputChange = (e) => {
    setNewTable({ ...newTable, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add new table via API
    fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTable)
    })
      .then(response => response.json())
      .then(data => {
        setTables([...tables, data])
        setNewTable({ table_number: '', capacity: '' })
      })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Table Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="number"
          name="table_number"
          value={newTable.table_number}
          onChange={handleInputChange}
          placeholder="Table Number"
          className="mb-2"
        />
        <Input
          type="number"
          name="capacity"
          value={newTable.capacity}
          onChange={handleInputChange}
          placeholder="Capacity"
          className="mb-2"
        />
        <Button type="submit">Add Table</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Table Number</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tables.map(table => (
            <TableRow key={table.id}>
              <TableCell>{table.table_number}</TableCell>
              <TableCell>{table.capacity}</TableCell>
              <TableCell>{table.status}</TableCell>
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