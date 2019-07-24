const { ServiceBroker } = require('moleculer')
const Request = require('request-promise-native')

const StripeService = require('../__fixtures__/stripe.service.js')
const WebService = require('../__fixtures__/web.service.js')

describe('Webhooks - Integration', () => {
  const broker = new ServiceBroker({ logger: false })
  const stripeService = broker.createService(StripeService)
  const stripe = stripeService.stripe()
  const webService = broker.createService(WebService)
  const event = JSON.stringify({ id: 'evt_idevt_from_web', type: 'test_web', object: 'event' }, null, 2)
  const signature = stripe.webhooks.generateTestHeaderString({ payload: event, secret: stripeService.settings.stripe.webhook.key })

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should work with moleculer-web', async () => {
    const url = `http://127.0.0.1:${webService.settings.port}/stripe`
    const valid = await Request.post({ url, headers: { 'Stripe-Signature': signature, 'Content-Type': 'application/json' }, body: event, resolveWithFullResponse: true })
    expect(valid.statusCode).toBe(200)
    await expect(Request.post({ url, headers: { 'Stripe-Signature': 'wrong', 'Content-Type': 'application/json' }, body: event, resolveWithFullResponse: true })).rejects.toMatchObject({ statusCode: 400 })
  })
})
