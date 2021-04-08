import bodyParser from 'body-parser'
import express from 'express'
import { createPaymentNotifierService } from './service'
import fs from 'fs'

(async () => {
  const app = express()
  const service = await createPaymentNotifierService({
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
  app.use(bodyParser.json())
  app.post('/start', async (req, res) => {
    await service.start(req.body.addresses)
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
