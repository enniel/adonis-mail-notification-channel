'use strict'

const test = require('japa')
const path = require('path')
const { Config } = require('@adonisjs/sink')
const { ioc, registrar } = require('@adonisjs/fold')
const MailMessage = require('../../src/MailMessage')
const MailSender = require('../../src/MailSender')
const MailChannel = require('../../src/MailChannel')

test.group('MailNotificationChannelProvider', group => {
  group.before(async () => {
    ioc.singleton('Adonis/Src/Config', () => {
      const config = new Config()
      return config
    })

    ioc.singleton('Adonis/Src/View', () => null)

    await registrar
      .providers([
        '@adonisjs/mail/providers/MailProvider',
        'adonis-notifications/providers/NotificationsProvider',
        path.join(__dirname, '../../providers/MailNotificationChannelProvider')
      ])
      .registerAndBoot()
  })

  test('MailMessage', assert => {
    assert.isDefined(ioc.use('Adonis/Notifications/MailMessage'))
    assert.isFalse(ioc._bindings['Adonis/Notifications/MailMessage'].singleton)
    assert.equal(ioc._aliases['MailMessage'], 'Adonis/Notifications/MailMessage')
    assert.deepEqual(ioc.use('Adonis/Notifications/MailMessage'), MailMessage)
    assert.deepEqual(ioc.use('MailMessage'), MailMessage)
    assert.deepEqual(ioc.use('Adonis/Notifications/MailMessage'), ioc.use('MailMessage'))
  })

  test('MailSender', assert => {
    assert.isDefined(ioc.use('Adonis/Notifications/MailSender'))
    assert.isTrue(ioc._bindings['Adonis/Notifications/MailSender'].singleton)
    assert.equal(ioc._aliases['MailSender'], 'Adonis/Notifications/MailSender')
    assert.instanceOf(ioc.use('Adonis/Notifications/MailSender'), MailSender)
    assert.instanceOf(ioc.use('MailSender'), MailSender)
    assert.deepEqual(ioc.use('Adonis/Notifications/MailSender'), ioc.use('MailSender'))
  })

  test('MailChannel', assert => {
    assert.instanceOf(ioc.use('Notifications').channel('mail'), MailChannel)
  })
})
