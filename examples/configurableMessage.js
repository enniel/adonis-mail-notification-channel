'use strict'

const path = require('path')
const { Config } = require('@adonisjs/sink')
const { ioc, registrar } = require('@adonisjs/fold')

const run = async () => {
  ioc.singleton('Adonis/Src/Config', () => {
    const config = new Config()
    return config
  })
  ioc.singleton('Adonis/Src/View', () => null)
  ioc.alias('Adonis/Src/Config', 'Config')

  ioc.singleton('Adonis/Src/Event', () => {
    const Event = require('@adonisjs/framework/src/Event')
    return new Event(ioc.use('Config'))
  })
  ioc.alias('Adonis/Src/Event', 'Event')

  await registrar
    .providers([
      '@adonisjs/mail/providers/MailProvider',
      'adonis-notifications/providers/NotificationsProvider',
      path.join(__dirname, '../providers/MailNotificationChannelProvider')
    ])
    .registerAndBoot()

  const MailMessage = ioc.use('MailMessage')

  class MailTestNotification {
    constructor (text) {
      this.text = `It's works!!!`
    }

    via () {
      return ['mail']
    }

    toMail () {
      const message = new MailMessage()
      message
        .configure({
          connection: 'smtp',
          smtp: {
            driver: 'smtp',
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD
            }
          }
        })
        .text(this.text)
        .subject('Message Notification Channel Test')
      return message
    }
  }

  const Notifications = ioc.use('Notifications')
  return Notifications
    .route('mail', 'razumov.evgeni@gmail.com')
    .notify(new MailTestNotification())
}

run()
  .then(response => {
    console.log('Response', response)
  })
  .catch(console.error)
