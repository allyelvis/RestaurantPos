import express from 'express'
import cors from 'cors'
import pg from 'pg'
import { authenticateToken } from './middleware/auth.js'
import { errorHandler } from './middleware/errorHandler.js'
import { loggerMiddleware } from './middleware/logger.js'
import userRoutes from './routes/userRoutes.js'
import tableRoutes from './routes/tableRoutes.js'
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import orderEvents from './routes/orderEvents.js'
import kitchenRoutes from './routes/kitchenRoutes.js'
import waiterRoutes from './routes/waiterRoutes.js'
import inventoryRoutes from './routes/inventoryRoutes.js'
import requisitionRoutes from './routes/requisitionRoutes.js'
import accountingRoutes from './routes/accountingRoutes.js'
import reportRoutes from './routes/reportRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(loggerMiddleware)

// Database connection
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Middleware to attach db to request object
app.use((req, res, next) => {
  req.db = pool
  next()
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/tables', authenticateToken, tableRoutes)
app.use('/api/menu', authenticateToken, menuRoutes)
app.use('/api/orders', authenticateToken, orderRoutes)
app.use('/api/orders', orderEvents)
app.use('/api/kitchen', authenticateToken, kitchenRoutes)
app.use('/api/waiter', authenticateToken, waiterRoutes)
app.use('/api/inventory', authenticateToken, inventoryRoutes)
app.use('/api/requisitions', authenticateToken, requisitionRoutes)
app.use('/api/accounting', authenticateToken, accountingRoutes)
app.use('/api/reports', authenticateToken, reportRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app