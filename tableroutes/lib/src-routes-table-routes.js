import express from 'express'

const router = express.Router()

// Get all tables
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM tables')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching tables' })
  }
})

// Create a new table
router.post('/', async (req, res) => {
  const { table_number, capacity } = req.body
  try {
    const result = await req.db.query(
      'INSERT INTO tables (table_number, capacity) VALUES ($1, $2) RETURNING *',
      [table_number, capacity]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the table' })
  }
})

export default router