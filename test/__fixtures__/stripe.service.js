/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const StripeService = require('../../index.js')

module.exports = {
  name: 'stripe',
  settings: {
    stripe: {
      secret: 'sk_secretkey',
      public: 'pk_publickey',
      webhook: {
        key: 'whsec_sigkey',
        action: 'stripe.webhook.action',
        event: 'stripe.webhook.event'
      }
    }
  },
  mixins: [StripeService],
  actions: {
    'webhook.action'({ params }) {
      this.webhook.action(params)
    }
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
