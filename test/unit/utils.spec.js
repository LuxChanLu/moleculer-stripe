/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { ServiceBroker } = require('moleculer')

const UtilsService = require('../__fixtures__/utils.service.js')

describe('Utils', () => {
  const broker = new ServiceBroker({ logger: false })
  const service = broker.createService(UtilsService)

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should create a mapping', async () => {
    await broker.call('utils.checkout.sessions.create', {})

    await broker.call('utils.customers.create', { email: 'customer@test.eu' })
    await broker.call('utils.customers.retrieve', { id: 'cus_test' })
    await broker.call('utils.customers.confirm', { id: 'cus_test' })
    await broker.call('utils.customers.capture', { id: 'cus_test' })
    await broker.call('utils.customers.cancel', { id: 'cus_test' })
    await broker.call('utils.customers.reject', { id: 'cus_test' })
    await broker.call('utils.customers.update', { id: 'cus_test', customer: { email: 'newcustomer@test.eu' } })
    await broker.call('utils.customers.del', { id: 'cus_test' })
    await broker.call('utils.customers.list', { starting_after: 10 })
    await broker.call('utils.customers.list', { starting_after: 20 }, { meta: { pagination: 10000 } })
    await broker.call('utils.customers.list', { starting_after: 30 }, { meta: { pagination: 'utils.each.customers' } })
    await broker.call('utils.customers.list', { starting_after: 40 }, { meta: { pagination: {} } })

    expect(service.stripe.checkout.session.create).toHaveBeenCalledTimes(1)
    expect(service.stripe.checkout.session.create).toHaveBeenCalledWith({ }, { idempotency_key: expect.anything() })

    expect(service.stripe.customers.create).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.create).toHaveBeenCalledWith({ email: 'customer@test.eu' }, { idempotency_key: expect.anything() })
    expect(service.stripe.customers.retrieve).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.retrieve).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.confirm).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.confirm).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.capture).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.capture).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.cancel).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.cancel).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.reject).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.reject).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.update).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.update).toHaveBeenCalledWith('cus_test', { email: 'newcustomer@test.eu' }, { idempotency_key: expect.anything() })
    expect(service.stripe.customers.del).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.del).toHaveBeenCalledWith('cus_test', { idempotency_key: expect.anything() })
    expect(service.stripe.customers.list).toHaveBeenCalledTimes(4)
    expect(service.stripe.customers.list).toHaveBeenNthCalledWith(1, { starting_after: 10 }, { idempotency_key: expect.anything() })
    expect(service.stripe.customers.list).toHaveBeenNthCalledWith(2, { starting_after: 20 }, { idempotency_key: expect.anything() })
    expect(service.stripe.customers.list).toHaveBeenNthCalledWith(3, { starting_after: 30 }, { idempotency_key: expect.anything() })
    expect(service.stripe.customers.list.mock.results[0].value.autoPagingToArray).not.toHaveBeenCalled()
    expect(service.stripe.customers.list.mock.results[0].value.autoPagingEach).not.toHaveBeenCalled()
    expect(service.stripe.customers.list.mock.results[1].value.autoPagingToArray).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.list.mock.results[1].value.autoPagingEach).not.toHaveBeenCalled()
    expect(service.stripe.customers.list.mock.results[1].value.autoPagingToArray).toHaveBeenCalledWith({ limit: 10000 })
    expect(service.stripe.customers.list.mock.results[2].value.autoPagingEach).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.list.mock.results[2].value.autoPagingToArray).not.toHaveBeenCalled()
    expect(service.stripe.customers.each).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.each).toHaveBeenCalledWith({ item: true })
    expect(service.stripe.customers.list.mock.results[3].value.autoPagingEach).not.toHaveBeenCalled()
    expect(service.stripe.customers.list.mock.results[3].value.autoPagingToArray).not.toHaveBeenCalled()
  })

  it('should not create a full mapping', () => {
    expect(service.actions['files.create']).toBeDefined()
    expect(service.actions['files.retrieve']).toBeDefined()
    expect(service.actions['files.update']).toBeUndefined()
    expect(service.actions['files.del']).toBeUndefined()
    expect(service.actions['files.list']).toBeDefined()
    expect(service.actions['refunds.create']).toBeUndefined()
    expect(service.actions['refunds.retrieve']).toBeUndefined()
    expect(service.actions['refunds.update']).toBeUndefined()
    expect(service.actions['refunds.del']).toBeUndefined()
    expect(service.actions['refunds.list']).toBeUndefined()
  })

  it('should create a mapping with special resource', () => {
    expect(service.actions['checkout.sessions.create']).toBeDefined()
    expect(service.actions['checkout.sessions.update']).toBeDefined()
    expect(service.schema.actions['checkout.sessions.update'].params.session).toBe('object')
  })

  it('should generate extra params', async () => {
    service.stripe.customers.create.mockClear()
    await broker.call('utils.customers.create', { email: 'customer@test.eu' }, { meta: { stripe: { account: 'pk_account_connect', idempotency: 'V5jts59sdfcxq' } } })
    expect(service.stripe.customers.create).toHaveBeenCalledTimes(1)
    expect(service.stripe.customers.create).toHaveBeenCalledWith({ email: 'customer@test.eu' }, { stripe_account: 'pk_account_connect', idempotency_key: 'V5jts59sdfcxq' })
  })

  it('should generate with single wording', async () => {
    expect(service.actions['balance.retrieve']).toBeDefined()
  })

})
