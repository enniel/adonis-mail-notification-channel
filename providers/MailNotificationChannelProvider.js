'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class MailNotificationChannelProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Notifications/MailMessage', () => {
      return require('../src/MailMessage')
    })
    this.app.alias('Adonis/Notifications/MailMessage', 'MailMessage')
    this.app.singleton('Adonis/Notifications/MailSender', app => {
      const View = app.use('Adonis/Src/View')
      const Config = app.use('Adonis/Src/Config')

      const MailSender = require('../src/MailSender')
      return new MailSender(Config, View)
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
