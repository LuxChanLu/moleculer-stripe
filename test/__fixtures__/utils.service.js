const { CRUDL } = require('../../src/utils.js')

module.exports = {
  name: 'utils',
  hooks: {
    before: { '*'(ctx) { ctx.stripe = this.stripe } }
  },
  mixins: [
    CRUDL('customer'),
    CRUDL('checkout.session'),
    CRUDL('file', { update: false, del: false }),
    CRUDL('refund', { create: false, retrieve: false, update: false, del: false, list: false }),
    CRUDL('paymentIntent', { update: false, del: false }, 'prefixed.')
  ],
  created() {
    this.mockStripe()
  },
  methods: {
    mockStripe() {
      this.stripe = {
        customers: {
          create: jest.fn(),
          retrieve: jest.fn(),
          update: jest.fn(),
          del: jest.fn(),
          list: jest.fn(() => ({ autoPagingToArray: jest.fn() }))
        }
      }
    },
    extra() { }
  }
}
