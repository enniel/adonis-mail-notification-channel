'use strict'

const _ = require('lodash')
const GE = require('@adonisjs/generic-exceptions')
const MailManager = require('@adonisjs/mail/src/Mail/Manager')

class MailSender {
  constructor (Config, View) {
    this.Config = Config
    this.View = View
    this._sendersPool = {}
  }

  /**
   * Returns an instance of a mail connection. Also this
   * method will cache the connection for re-usability.
   *
   * @method connection
   *
   * @param  {Object}   config
   * @param  {String}   [name]
   *
   * @return {Object}
   */
  connection (config, name) {
    name = name || _.get(config, 'connection')

    /**
     * Returns the cache connection if defined
     */
    if (this._sendersPool[name]) {
      return this._sendersPool[name]
    }

    /**
     * Cannot get default connection
     */
    if (!name) {
      throw GE.InvalidArgumentException.invalidParameter('Make sure to define connection inside config/mail.js file')
    }

    /**
     * Get connection config
     */
    const connectionConfig = _.get(config, name)

    /**
     * Cannot get config for the defined connection
     */
    if (!connectionConfig) {
      throw GE.RuntimeException.missingConfig(name, 'config/mail.js')
    }

    /**
     * Throw exception when config doesn't have driver property
     * on it
     */
    if (!connectionConfig.driver) {
      throw GE.RuntimeException.missingConfig(`${name}.driver`, 'config/mail.js')
    }

    this._sendersPool[name] = MailManager.driver(connectionConfig.driver, connectionConfig, this.View)
    return this._sendersPool[name]
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

    const config = message.config || this.Config.get('mail')

    return this.connection(config)._driverInstance.send(message.toJSON())
  }
}

module.exports = MailSender
