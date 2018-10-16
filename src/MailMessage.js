'use strict'

const Message = require('@adonisjs/mail/src/Mail/Message')

class MailMessage extends Message {
  /**
   * Set email views
   *
   * @method views
   * @param  {Object}       [data]
   *
   * @param  {String|Array} views
   *
   * @chainable
   */
  views (views, data) {
    this.mailerMessage.views = views
    this.mailerMessage.data = data
    return this
  }
}

module.exports = MailMessage
