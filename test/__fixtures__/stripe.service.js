const StripeService = require('../../index.js')

module.exports = {
  name: 'stripe',
  settings: {
    stripe: {
      secret: 'sk_secretkey',
      public: 'pk_publickey',
      webhook: {
        key: 'whsec_sigkey',
        call: 'stripe.webhook.action',
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
  created() {
    this.mockWebhookHandler()
  },
  methods: {
    mockWebhookHandler() {
      this.settings.stripe.webhook.call = 'stripe.webhook.action'
      this.settings.stripe.webhook.event = 'stripe.webhook.event'
      this.webhook = { action: jest.fn(), event: jest.fn() }
    }
  }
}
