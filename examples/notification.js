'use strict'

const path = require('path')
const { Config } = require('@adonisjs/sink')
const { ioc, registrar } = require('@adonisjs/fold')

const run = async () => {
  ioc.singleton('Adonis/Src/Config', () => {
    const config = new Config()
    config.set('mail.connection', 'smtp')
    config.set('mail.smtp.driver', 'smtp')
    config.set('mail.smtp.host', process.env.SMTP_HOST)
    config.set('mail.smtp.port', process.env.SMTP_PORT)
    config.set('mail.smtp.auth.user', process.env.MAIL_USERNAME)
    config.set('mail.smtp.auth.pass', process.env.MAIL_PASSWORD)
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
