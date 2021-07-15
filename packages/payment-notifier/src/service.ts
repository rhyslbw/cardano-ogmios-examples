import {
  ConnectionConfig,
  createChainSyncClient,
  isAllegraBlock,
  isMaryBlock,
  isShelleyBlock,
  Schema
} from '@cardano-ogmios/client'
import {
  createConsoleNotificationsClient,
  createPushoverClient,
  NotificationClient
} from './notifications'
import { fetchAdaPrice } from './priceFetcher'

export interface PaymentNotifierService {
  start: () => Promise<void>
  shutdown: () => Promise<void>
}

export async function createPaymentNotifierService (
  addresses: string[],
  connection: ConnectionConfig,
  options?: {
    notifications?: {
      pushover?: {
        credentials: {
          token: string
          user: string
        }
        enabled?: boolean
      }
    }
  }
): Promise<PaymentNotifierService> {
  const chainSyncClient = await createChainSyncClient({
    rollBackward: async ({ point }) => {
      console.log('Rollback to point', point)
    },
    rollForward: async ({ block }) => {
      let b: Schema.BlockShelley | Schema.BlockAllegra | Schema.BlockMary
      if (isShelleyBlock(block)) {
        b = block.shelley as Schema.BlockShelley
      } else if (isAllegraBlock(block)) {
        b = block.allegra as Schema.BlockAllegra
      } else if (isMaryBlock(block)) {
        b = block.mary as Schema.BlockMary
      }
      if (b !== undefined) {
        for (const tx of b.body) {
          for (const output of tx.body.outputs) {
            if (addresses.includes(output.address)) {
              await notifications.send(
                `Payment received. Current ada value ${await fetchAdaPrice()}`,
                'Ada payment received'
              )
            }
          }
        }
      }
    }
  },
  console.error,
  console.log,
  { connection })
  let notifications: NotificationClient
  if (options?.notifications?.pushover) {
    notifications = createPushoverClient(options.notifications.pushover.credentials)
  } else {
    notifications = createConsoleNotificationsClient()
  }
  return {
    start: async () => {
      await chainSyncClient.startSync()
      await notifications.send(
        `You will be notified of payments to ${addresses.join(' ')}`,
        'Payment notifier started'
      )
    },
    shutdown: async () => {
      await chainSyncClient.shutdown()
      await notifications.send(
        'Stopped watching for payments',
        'Payment notifier stopped'
      )
    }
  }
}
