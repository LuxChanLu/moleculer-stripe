/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { ServiceBroker } = require('moleculer')

const StripeService = require('../__fixtures__/stripe.service.js')

describe('Webhooks - Unit', () => {
  const broker = new ServiceBroker({ logger: false })
  const service = broker.createService(StripeService)
  const stripe = service.stripe()

  const stripeEvent = { id: 'evt_idevt', type: 'test', object: 'event' }
  const event = JSON.stringify(stripeEvent, null, 2)
  const signatures = [
    stripe.webhooks.generateTestHeaderString({ payload: event, secret: service.settings.stripe.webhook.platform.key }),
    stripe.webhooks.generateTestHeaderString({ payload: event, secret: 'whsec_sigonfly' }),
    stripe.webhooks.generateTestHeaderString({ payload: event, secret: service.settings.stripe.webhook.connect.key }),
  ]

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should validate signature', async () => {
    service.mockWebhookHandler()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[0], connect: false })).resolves.toEqual({ received: true })
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[1], connect: false }, { meta: { stripe: { webhook: { platform: { key: 'whsec_sigonfly' } } } } })).resolves.toEqual({ received: true })
    expect(service.webhook.action).toHaveBeenCalledTimes(2)
    expect(service.webhook.action).toHaveBeenCalledWith(stripeEvent)
    expect(service.webhook.event).toHaveBeenCalledTimes(2)
    expect(service.webhook.event).toHaveBeenCalledWith(stripeEvent)

    service.mockWebhookHandler()
    service.settings.stripe.webhook.connect = { key: service.settings.stripe.webhook.connect.key }
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[2], connect: true })).resolves.toEqual({ received: true })
    expect(service.webhook.action).not.toHaveBeenCalled()
    expect(service.webhook.event).not.toHaveBeenCalled()
  })

  it('should not validate signature', async () => {
    service.mockWebhookHandler()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[1], connect: true })).resolves.toBeUndefined()
    await expect(broker.call('stripe.webhook', { body: event, signature: signatures[0], connect: true }, { meta: { stripe: { webhook: { connect: { key: 'whsec_sigonfly' } } } } })).resolves.toBeUndefined()
    expect(service.webhook.action).not.toHaveBeenCalled()
    expect(service.webhook.event).not.toHaveBeenCalled()
  })

})
