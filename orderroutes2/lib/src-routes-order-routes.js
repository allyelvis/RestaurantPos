import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM orders')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching orders' })
  }
})

// Create a new order
router.post('/', [
  body('table_id').isInt(),
  body('items').isArray(),
  body('items.*.menu_item_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { table_id, items } = req.body
  const client = await req.db.connect()

  try {
    await client.query('BEGIN')
    const orderResult = await client.query(
      'INSERT INTO orders (table_id, status) VALUES ($1, $2) RETURNING id',
      [table_id, 'pending']
    )
    const orderId = orderResult.rows[0].id

    for (let item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity) VALUES ($1, $2, $3)',
        [orderId, item.menu_item_id, item.quantity]
      )
    }

    await client.query('COMMIT')
    res.status(201).json({ id: orderId, table_id, status: 'pending', items })
  } catch (err) {
    await client.query('ROLLBACK')
    res.status(500).json({ error: 'An error occurred while creating the order' })
  } finally {
    client.release()
  }
})

// Update order status
router.patch('/:id', [
  body('status').isIn(['pending', 'in-progress', 'ready', 'delivered'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { status } = req.body

  try {
    const result = await req.db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while updating the order' })
  }
})

export default router