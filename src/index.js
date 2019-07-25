/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { MoleculerError } 	= require('moleculer').Errors
const Validator = require('fastest-validator')
const Stripe = require('stripe')

const { CRUDL } = require('./utils.js')

const Webhook = require('./webhook.js')
const Connect = require('./connect.js')

const PaymentCheckout = require('./payments/checkout.js')
const PaymentIntents = require('./payments/intents.js')

const StripeCheck = (new Validator()).compile({
  version: { type: 'string', optional: true },
  secret: 'string',
  public: 'string',
  webhook: {
    type: 'object',
    items: {
      key: 'string',
      action: { type: 'string', optional: true },
      event: { type: 'string', optional: true }
    },
    optional: true
  },
  account: { type: 'string', optional: true },
  custom: { type: 'function', optional: true }
})

module.exports = {
  mixins: [
    CRUDL('customer'),
    CRUDL('charge'),
    CRUDL('checkout.session'),
    CRUDL('paymentIntent'),
    CRUDL('account'),
    CRUDL('refund', { del: false }),
    CRUDL('product'),
    CRUDL('taxRate', { del: false }),
    CRUDL('sku'),
    Webhook, Connect, PaymentCheckout, PaymentIntents
  ],
  settings: {
    stripe: {
      version: undefined,
      secret: undefined,
      public: undefined,
      webhook: {
        key: undefined,
        action: undefined,
        event: undefined
      },
      telemetry: true,
      account: undefined,
      custom: undefined
    }
  },
  hooks: {
    before: { '*': 'stripe' }
  },
  methods: {
    config(ctx = {}) {
      const meta = (ctx.meta || {}).stripe || {}
      const config = { ...this.settings.stripe, ...meta, webhook: { ...this.settings.stripe.webhook, ...(meta.webhook || {}) } }
      const validate = StripeCheck(config)
      if (validate === true) {
        return config
      }
      throw new MoleculerError('Stripe unrecognized configuration', validate)
    },
    stripe(ctx = {}) {
      const { version, secret, telemetry, account, custom } = this.config(ctx)
      ctx.stripe = Stripe(secret, { stripeAccount: account })
      ctx.stripe.setTelemetryEnabled(telemetry)
      if (version) {
        ctx.stripe.setApiVersion(version)
      }
      if (custom) {
        ctx.stripe = custom(ctx.stripe) || ctx.stripe
      }
      return ctx.stripe
    }
  },
  StripeDecorator(_, _1, req) {
    req.$params.signature = req.headers['stripe-signature']
    req.$params.body = req.body
  },
  StripeRoute(path = 'stripe', service = 'stripe') {
    return {
      bodyParsers: { json: false, text: { type: 'application/json' } },
      aliases: { [`POST ${path}`]: `${service}.webhook` },
      onBeforeCall: module.exports.StripeDecorator
    }
  }
}
