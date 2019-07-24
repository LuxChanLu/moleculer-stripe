const { ServiceBroker } = require('moleculer')

const StripeService = require('../__fixtures__/stripe.service.js')

describe('Webhooks - Unit', () => {
  const broker = new ServiceBroker({ logger: false })
  const service = broker.createService(StripeService)
  const stripe = service.stripe()

  const stripeEvent = { id: 'evt_idevt', type: 'test', object: 'event' }
  const event = JSON.stringify(stripeEvent, null, 2)
  const signatures = [
    stripe.webhooks.generateTestHeaderString({ payload: event, secret: service.settings.stripe.webhook.key }),
    stripe.webhooks.generateTestHeaderString({ payload: event, secret: 'whsec_sigonfly' })
  ]

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should validate signature', async () => {
    service.mockWebhookHandler()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[0] })).resolves.toEqual({ received: true })
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[1] }, { meta: { stripe: { webhook: { key: 'whsec_sigonfly' } } } })).resolves.toEqual({ received: true })
    expect(service.webhook.action).toHaveBeenCalledTimes(2)
    expect(service.webhook.action).toHaveBeenCalledWith(stripeEvent)
    expect(service.webhook.event).toHaveBeenCalledTimes(2)
    expect(service.webhook.event).toHaveBeenCalledWith(stripeEvent)

    service.mockWebhookHandler()
    service.settings.stripe.webhook = { key: service.settings.stripe.webhook.key }
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[0] })).resolves.toEqual({ received: true })
    expect(service.webhook.action).not.toHaveBeenCalled()
    expect(service.webhook.event).not.toHaveBeenCalled()
  })

  it('should not validate signature', async () => {
    service.mockWebhookHandler()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[1] })).resolves.toBeUndefined()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[0] }, { meta: { stripe: { webhook: { key: 'whsec_sigonfly' } } } })).resolves.toBeUndefined()
    expect(service.webhook.action).not.toHaveBeenCalled()
    expect(service.webhook.event).not.toHaveBeenCalled()
  })

})
