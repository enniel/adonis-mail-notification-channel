'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MailNotificationChannelProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Notifications/MailMessage', () => {
      return require('../src/MailMessage')
    })
    this.app.alias('Adonis/Notifications/MailMessage', 'MailMessage')
    this.app.singleton('Adonis/Notifications/MailSender', app => {
      const MailSender = require('../src/MailSender')
      return new MailSender(app.use('Adonis/Addons/Mail'))
    })
    this.app.alias('Adonis/Notifications/MailSender', 'MailSender')
  }

  boot () {
    const Notifications = this.app.use('Notifications')
    Notifications.extend('mail', () => {
      const MailSender = this.app.use('MailSender')
      const MailChannel = require('../src/MailChannel')
      return new MailChannel(MailSender)
    })
  }
}

module.exports = MailNotificationChannelProvider
