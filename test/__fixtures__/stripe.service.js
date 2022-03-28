/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const StripeService = require('../../index.js')

module.exports = {
  name: 'stripe',
  settings: {
    stripe: {
      secret: 'sk_secretkey',
      webhook: {
        platform: {
          key: 'whsec_sigkey',
          action: 'stripe.webhook.action',
          event: 'stripe.webhook.event'
        },
        connect: {
          key: 'whsec_sigkeyconnect',
          action: 'stripe.webhook.action',
          event: 'stripe.webhook.event'
        }
      }
    }
  },
  mixins: [StripeService],
  actions: {
    'webhook.action'({ params }) {
      this.webhook.action(params)
    },
    'connect': () => true
  },
  events: {
    'stripe.webhook.event'(event) {
      this.webhook.event(event)
    }
  },
  methods: {
    mockWebhookHandler() {
      this.settings.stripe.webhook.action = 'stripe.webhook.action'
      this.settings.stripe.webhook.event = 'stripe.webhook.event'
      this.webhook = { action: jest.fn(), event: jest.fn() }
    }
  }
}
