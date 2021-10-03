# Payment Notifier
Sends a [Pushover](https://pushover.net/) notification when funds are received by the provided addresses

``` TypeScript
import { createPaymentNotifierService } from '@cardano-ogmios-examples/payment-notifier'
import onDeath from 'death'

createPaymentNotifierService(
  ['addr...'],
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
  service.start().catch(error => console.error(error))
  onDeath(service.shutdown)
})
```

## Web Service

### Build and Run via Docker Compose
1. Create two text files with Pushover credentials in `./secrets`
   - `pushover_token`
   - `pushover_user`
2. From the top-level of this repository:

<details open>
  <summary><i>mainnet</i></summary>

``` console
yarn mainnet:up
# OR
docker-compose -p mainnet_payment-notifier up
```
</details>

<details>
  <summary><i>testnet</i></summary>

``` console
yarn testnet:up
# OR
NETWORK=testnet OGMIOS_PORT=1338 docker-compose -p testnet_payment-notifier up
```
</details>


:information_source: _Override the `API_PORT` env if you have a clash on `3000`_

### Down

<details open>
  <summary><i>mainnet</i></summary>

``` console
yarn mainnet:down
# OR
docker-compose -p mainnet_payment-notifier down
```
</details>

<details>
  <summary><i>testnet</i></summary>

``` console
yarn testnet:down
# OR
docker-compose -p testnet_payment-notifier down
```
</details>

### Build with yarn
```console
yarn build
```

### Service Config
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
curl -X POST http://localhost:3000/start -H 'Content-Type: application/json' -d '{"addresses": ["addr_test1qq585l3hyxgj3nas2v3xymd23vvartfhceme6gv98aaeg9muzcjqw982pcftgx53fu5527z2cj2tkx2h8ux2vxsg475q2g7k3g"]}'
```
#### Shutdown
```console
curl -X POST http://localhost:3000/shutdown -H 'Content-Type: application/json'
```