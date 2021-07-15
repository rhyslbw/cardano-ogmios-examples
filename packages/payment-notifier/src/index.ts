import bodyParser from 'body-parser'
import express from 'express'
import fs from 'fs'
import {
  createPaymentNotifierService,
  PaymentNotifierService
} from './service'

(async () => {
  const app = express()
  app.use(bodyParser.json())
  let service: PaymentNotifierService
  app.post('/start', async (req, res) => {
    service = await createPaymentNotifierService(
      req.body.addresses,
      {
        host: process.env.OGMIOS_HOST,
        port: parseInt(process.env.OGMIOS_PORT)
      }, {
        notifications: {
          pushover: {
            credentials: {
              token: fs.readFileSync(process.env.PUSHOVER_TOKEN_FILE).toString(),
              user: fs.readFileSync(process.env.PUSHOVER_USER_FILE).toString()
            }
          }
        }
      })
    await service.start()
    console.log(`Notifying of payments made to ${req.body.addresses.join(', ')}`)
    res.sendStatus(200)
  })
  app.post('/shutdown', async (_req, res) => {
    await service.shutdown()
    res.sendStatus(200)
  })

  app.listen(3000, () => {
    console.log(`Payment Notifier service listening at http://localhost:${process.env.API_PORT}`)
  })
})()
