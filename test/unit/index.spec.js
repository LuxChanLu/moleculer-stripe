const { ServiceBroker } = require('moleculer')

const StripeService = require('../__fixtures__/stripe.service.js')

describe('Stripe configurations', () => {
  const broker = new ServiceBroker({ logger: false })
  const service = broker.createService(StripeService)

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should config basic stripe', async () => {
    expect(service.config()).toBeDefined()
  })

  it('should not config stripe', async () => {
    expect(() => service.config({ meta: { stripe: { secret: null } } })).toThrow()
  })

  it('should config stripe with custom options', async () => {
    service.settings.stripe.custom = stripe => stripe.setTimeout(50000)
    const stripe = service.stripe()
    expect(stripe).toBeDefined()
    expect(stripe._api.timeout).toBe(50000)
  })

})
