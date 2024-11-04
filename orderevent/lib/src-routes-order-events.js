import express from 'express'
import { EventEmitter } from 'events'

const router = express.Router()
const orderEvents = new EventEmitter()

router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const sendEvent = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`)
  }

  

  orderEvents.on('update', sendEvent)

  req.on('close', () => {
    orderEvents.off('update', sendEvent)
  })
})

export const emitOrderUpdate = (order) => {
  orderEvents.emit('update', order)
}

export default router