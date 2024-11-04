import express from 'express'

const router = express.Router()

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM menu_items')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching menu items' })
  }
})

// Create a new menu item
router.post('/', async (req, res) => {
  const { name, description, price, category } = req.body
  try {
    const result = await req.db.query(
      'INSERT INTO menu_items (name, description, price, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, category]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the menu item' })
  }
})

export default router