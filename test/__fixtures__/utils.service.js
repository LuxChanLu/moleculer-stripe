const { StripeMethods } = require('../../src/utils.js')

module.exports = {
  name: 'utils',
  hooks: {
    before: { '*'(ctx) { ctx.stripe = this.stripe } }
  },
  mixins: [
    // Not real StripeMethods options, just for test purpose (I don't think a customer will be happy to be captured/rejected...)
    StripeMethods('customer', { confirm: true, cancel: true, capture: true, reject: true }),
    StripeMethods('checkout.session', {}, false, ({ checkout }) => checkout.session),
    StripeMethods('file', { update: false, del: false }),
    StripeMethods('refund', { create: false, retrieve: false, update: false, del: false, list: false }),
    StripeMethods('balance', { update: false, del: false }, true)
  ],
  created() {
    this.mockStripe()
  },
  actions: {
    'each.customers'({ params }) {
      this.stripe.customers.each(params)
    }
  },
  methods: {
    mockStripe() {
      this.stripe = {
        customers: {
          create: jest.fn(),
          confirm: jest.fn(),
          capture: jest.fn(),
          cancel: jest.fn(),
          reject: jest.fn(),
          retrieve: jest.fn(),
          update: jest.fn(),
          del: jest.fn(),
          list: jest.fn(() => ({ autoPagingToArray: jest.fn(), autoPagingEach: jest.fn(cb => cb({ item: true })) })),
          each: jest.fn()
        },
        checkout: {
          session: {
            create: jest.fn()
          }
        }
      }
    },
    extra() { }
  }
}
