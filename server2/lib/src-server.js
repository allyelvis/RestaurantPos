import express from 'express'
import cors from 'cors'
import pg from 'pg'
import userRoutes from './routes/userRoutes.js'
import tableRoutes from './routes/tableRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import kitchenRoutes from './routes/kitchenRoutes.js'
import waiterRoutes from './routes/waiterRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import requisitionRoutes from './routes/requisitionRoutes.js'
import accountingRoutes from './routes/accountingRoutes.js'
import reportRoutes from './routes/reportRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

// Database connection
const pool = new pg.Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'restaurant_pos',
  password: 'your_password',
  port: 5432,
})

// Middleware to attach db to request object
app.use((req, res, next) => {
  req.db = pool
  next()
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/kitchen', kitchenRoutes)
app.use('/api/waiter', waiterRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/requisitions', requisitionRoutes)
app.use('/api/accounting', accountingRoutes)
app.use('/api/reports', reportRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))