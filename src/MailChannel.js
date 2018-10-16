'use strict'

const NE = require('node-exceptions')
const _ = require('lodash')

class MailChannel {
  constructor (sender) {
    this.sender = sender
  }

  async send (notifiable, notification) {
    const message = this.getMessage(notifiable, notification)
    let to = await notifiable.routeNotificationFor('mail')
    if (typeof to === 'string') {
      message.to(to)
    } else if (Array.isArray(to)) {
      message.to(...to)
    } else if (_.isObject(to)) {
      const { address, name } = to
      message.to(address, name)
    }
    return this.sender.send(message)
  }

  getMessage (notifiable, notification) {
    if (typeof notification.toMail === 'function') {
      return notification.toMail(notifiable)
    }

    throw new NE.RuntimeException('Notification is missing toMail method.')
  }
}

module.exports = MailChannel
