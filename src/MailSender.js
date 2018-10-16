'use strict'

class MailSender {
  constructor (sender) {
    this.sender = sender
  }

  send (message) {
    const { views, data } = message.mailerMessage
    if (views) {
      const viewsMap = this.sender._parseViews(views)

      /**
       * Set html text by rendering the view
       */
      if (viewsMap.html) {
        message.html(this.sender._viewInstance.render(viewsMap.html, data))
      }

      /**
       * Set plain text by rendering the view
       */
      if (viewsMap.text) {
        message.text(this.sender._viewInstance.render(viewsMap.text, data))
      }

      /**
       * Set watch text by rendering the view
       */
      if (viewsMap.watch) {
        message.watchHtml(this.sender._viewInstance.render(viewsMap.watch, data))
      }
    }

    return this.sender.connection()._driverInstance.send(message.toJSON())
  }
}

module.exports = MailSender
