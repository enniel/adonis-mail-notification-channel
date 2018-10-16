# Adonis Mail Notification Channel

Mail Notification Channel for [adonis-notifications](https://github.com/enniel/adonis-notifications).

[![Build Status](https://travis-ci.org/enniel/adonis-mail-notification-channel.svg?branch=master)](https://travis-ci.org/enniel/adonis-mail-notification-channel)
[![Coverage Status](https://coveralls.io/repos/github/enniel/adonis-mail-notification-channel/badge.svg?branch=master)](https://coveralls.io/github/enniel/adonis-mail-notification-channel?branch=master)

## Installation

1. Add package:

```bash
$ npm i adonis-mail-notification-channel --save
```
or

```bash
$ yarn add adonis-mail-notification-channel
```

2. Configure mail package.

See [mail doc](https://adonisjs.com/docs/4.1/mail) for more information

3. Register provider inside the your `start/app.js` file.

```js
const providers = [
  ...
  'adonis-mail-notification-channel/providers/MailNotificationChannelProvider',
  ...
]
```

## Usage example

```js
// app/Model/User.js
const Lucid = use('Lucid')

class User extends Lucid {
  static get traits () {
    return [
      '@provider:Notifiable'
    ]
  }

  /**
   *  // email
   *  foo@bar.com
   *
   *  // email + name
   *  { address: foo@bar.com', name: 'Foo' }
   *
   *  // Array
   *  [{ address: 'foo@bar.com', name: 'Foo' }]
   */
  routeNotificationForEmail () {
    return this.email
  }
}

module.exports = User
```

```js
// app/Notifications/MyNotification.js
const MailMessage = use('MailMessage')

class MyNotification {
  constructor (text) {
    this.text = text
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

module.exports = MyNotification
```

```js
const Notifications = use('Notifications')

...
const users = await User.all()

await Notifications.send(users, new MyNotification(`It's works!!!`))
...

```

## Credits

- [Evgeni Razumov](https://github.com/enniel)

## Support

Having trouble? [Open an issue](https://github.com/enniel/adonis-mail-notification-channel/issues/new)!

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
