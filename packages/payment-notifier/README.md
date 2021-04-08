# Payment Notifier
Sends a [Pushover](https://pushover.net/) notification when funds are received by the provided addresses

``` TypeScript
import { createPaymentNotifierService } from '@cardano-ogmios-examples/payment-notifier'
import onDeath from 'death'

createPaymentNotifierService(
  {
    host: 'localhost',
    port: 1338
  },
  {
    notifications: {
      pushover: {
        credentials: {
          token: process.ENV.PUSHOVER_TOKEN,
          user: process.ENV.PUSHOVER_USER
        }
      }
    }
  }
).then(service => {
  service.start(['addr...']).catch(error => console.error(error))
  onDeath(service.shutdown)
})
```

## Web Service

### Build and run with Docker
1. Create two text files with Pushover credentials in `./secrets`
   - `pushover_token`
   - `pushover_user`
2. From the top-level of this repository:
```console
yarn mainnet:up
# Alias for
docker-compose -p ogmios-mainnet up
```
:information_source: _Override the `API_PORT` env if you have a clash on `3000`_
### Build with yarn
```console
yarn build
```

### Config
- `API_PORT`
- `OGMIOS_HOST`
- `OGMIOS_PORT`
- `PUSHOVER_TOKEN_FILE` - Path to a text file containing a Pushover token 
- `PUSHOVER_USER_FILE` - Path to a text file containing a Pushover token

### Run
```console
{CONFIG} node ./dist/index.js
```

### Endpoints
#### Start
```console
curl -X POST http://localhost:3000/start -H 'Content-Type: application/json' -d '{"addresses": 
["addr..."]}'
```
#### Shutdown
```console
curl -X POST http://localhost:3000/shutdown -H 'Content-Type: application/json'
```