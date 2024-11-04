import express from 'express'
import bcrypt from 'bcrypt'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT id, username, role FROM users')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching users' })
  }
})

// Create a new user
router.post('/', async (req, res) => {
  const { username, password, role } = req.body
  try {
    const  hashedPassword = await bcrypt.hash(password, 10)
    const result = await req.db.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hashedPassword, role]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the user' })
  }
})

export default router