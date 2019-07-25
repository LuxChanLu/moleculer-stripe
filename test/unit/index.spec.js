/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

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

  it('should config stripe with version, no telemetry and a connect account', async () => {
    const stripe = service.stripe({ meta: { stripe: { version: '2019-05-16', telemetry: false, account: 'pk_connect_acc_id' } } })
    expect(stripe).toBeDefined()
    expect(stripe._api.version).toBe('2019-05-16')
    expect(stripe._api._enableTelemetry).toBeFalsy()
  })

  it('should config stripe with custom options', async () => {
    service.settings.stripe.custom = stripe => stripe.setTimeout(50000)
    const stripe = service.stripe()
    expect(stripe).toBeDefined()
    expect(stripe._api.timeout).toBe(50000)
  })

})
