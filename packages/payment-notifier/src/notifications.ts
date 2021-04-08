import { Pushover } from '@stingalleman/pushover.js'

export interface NotificationClient {
  send: (message: string, title?: string) => Promise<void>
}

export const createPushoverClient = (
  credentials: {
    token: string,
    user: string
  },
  options?: {
    sound?: 'magic',
    priority?: 1
  }
): NotificationClient => {
  const pushover = new Pushover(credentials.token, credentials.user)

  return {
    send: (message, title) => pushover.message.send(message, {
      title,
      sound: options?.sound || 'magic',
      priority: options?.priority || 1
    })
  }
}

export const createConsoleNotificationsClient = (): NotificationClient => {
  return {
    send: (message, title) => Promise.resolve(console.log(`${title}: ${message}`))
  }
}
