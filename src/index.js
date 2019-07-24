/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { MoleculerError } 	= require('moleculer').Errors
const Validator = require('fastest-validator')
const Stripe = require('stripe')

const Webhook = require('./webhook.js')
const Connect = require('./connect.js')

const PaymentCheckout = require('./payments/checkout.js')
const PaymentIntents = require('./payments/intents.js')

const StripeCheck = (new Validator()).compile({
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
  custom: { type: 'function', optional: true }
})

module.exports = {
  mixins: [Webhook, Connect, PaymentCheckout, PaymentIntents],
  settings: {
    stripe: {
      secret: undefined,
      public: undefined,
      webhook: {
        key: undefined,
        action: undefined,
        event: undefined
      },
      telemetry: true,
      custom: undefined
    }
  },
  hooks: {
    before: {
      '*': 'stripe'
    }
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
      const { secret, telemetry, custom } = this.config(ctx)
      ctx.stripe = Stripe(secret)
      ctx.stripe.setTelemetryEnabled(telemetry)
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
