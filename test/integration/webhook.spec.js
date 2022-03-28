/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

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
  const signatures = {
    platform: stripe.webhooks.generateTestHeaderString({ payload: event, secret: stripeService.settings.stripe.webhook.platform.key }),
    connect: stripe.webhooks.generateTestHeaderString({ payload: event, secret: stripeService.settings.stripe.webhook.connect.key }),
  }

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should work with moleculer-web', async () => {
    stripeService.mockWebhookHandler()
    const base = `http://127.0.0.1:${webService.settings.port}`
    await expect(Request.post({ url: `${base}/stripe`, headers: { 'Stripe-Signature': signatures.platform, 'Content-Type': 'application/json' }, body: event, resolveWithFullResponse: true })).resolves.toMatchObject({ statusCode: 200 })
    await expect(Request.post({ url: `${base}/stripe/connect`, headers: { 'Stripe-Signature': signatures.connect, 'Content-Type': 'application/json' }, body: event, resolveWithFullResponse: true })).resolves.toMatchObject({ statusCode: 200 })
    await expect(Request.post({ url: `${base}/stripe`, headers: { 'Stripe-Signature': 'wrong', 'Content-Type': 'application/json' }, body: event, resolveWithFullResponse: true })).rejects.toMatchObject({ statusCode: 400 })
  })
})
