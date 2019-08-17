/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { MoleculerError } 	= require('moleculer').Errors
const Validator = require('fastest-validator')
const Stripe = require('stripe')

const { StripeMethods } = require('./utils.js')

const Webhook = require('./webhook.js')
const Connect = require('./connect.js')

const StripeCheck = (new Validator()).compile({
  version: { type: 'string', optional: true },
  secret: 'string',
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
    StripeMethods('balance', { create: false, update: false, del: false, list: false }, true),
    StripeMethods('balanceTransactions', { create: false, update: false, del: false }),
    StripeMethods('customer'),
    StripeMethods('charge'),
    StripeMethods('checkout.session', {}, false, /* istanbul ignore next */ ({ checkout }) => checkout.session),
    StripeMethods('paymentIntent', { del: false, confirm: true, capture: true, cancel: true }),
    StripeMethods('setupIntent', { del: false, confirm: true, cancel: true }),
    StripeMethods('payout', { del: false, cancel: true }),
    StripeMethods('account', { reject: true }),
    StripeMethods('applicationFee', { create: false, update: false, del: false }),
    StripeMethods('transfer', { del: false }),
    StripeMethods('topup', { del: false, cancel: true }),
    StripeMethods('countrySpecs', { create: false, update: false, del: false }),
    StripeMethods('refund', { del: false }),
    StripeMethods('tokens', { update: false, del: false, list: false }),
    StripeMethods('product'),
    StripeMethods('taxRate', { del: false }),
    StripeMethods('sku'),
    Webhook, Connect
  ],
  $secureSettings: ['stripe'],
  settings: {
    stripe: {
      version: undefined,
      secret: undefined,
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
      const { version, secret, telemetry, custom } = this.config(ctx)
      ctx.stripe = Stripe(secret)
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
