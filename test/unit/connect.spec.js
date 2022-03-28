/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { ServiceBroker } = require('moleculer')

const StripeService = require('../__fixtures__/stripe.service.js')

describe('Utils', () => {
  const broker = new ServiceBroker({ logger: false })
  const mocks = {
    accounts: {
      createLoginLink: jest.fn(),
      listCapabilities: jest.fn(),
      retrieveCapability: jest.fn(),
      updateCapability: jest.fn()
    },
    applicationFees: {
      createRefund: jest.fn(),
      retrieveRefund: jest.fn(),
      updateRefund: jest.fn(),
      listRefunds: jest.fn()
    }
  }
  broker.createService({
    mixins: [StripeService],
    settings: {
      stripe: {
        custom(stripe) {
          stripe.accounts = mocks.accounts
          stripe.applicationFees = mocks.applicationFees
        }
      }
    }
  })

  beforeAll(() => broker.start())
  afterAll(() => broker.stop())

  it('should get account login link', async () => {
    await broker.call('stripe.accounts.login', { id: 'acct_1CoGRRJDiHehFaue' })

    expect(mocks.accounts.createLoginLink).toHaveBeenCalledTimes(1)
    expect(mocks.accounts.createLoginLink).toHaveBeenCalledWith('acct_1CoGRRJDiHehFaue', { idempotency_key: expect.anything() })
  })

  it('should manage account capabilities', async () => {
    await broker.call('stripe.accounts.capabilities.list', { account: 'acct_1CoGRRJDiHehFaue' })
    await broker.call('stripe.accounts.capabilities.retrieve', { account: 'acct_1CoGRRJDiHehFaue', id: 'acap_1F0FWpJDiHehFaue4nt3wbv0' })
    await broker.call('stripe.accounts.capabilities.update', { account: 'acct_1CoGRRJDiHehFaue', capability: 'card_payments', requested: true })

    expect(mocks.accounts.listCapabilities).toHaveBeenCalledTimes(1)
    expect(mocks.accounts.listCapabilities).toHaveBeenCalledWith('acct_1CoGRRJDiHehFaue', { idempotency_key: expect.anything() })
    expect(mocks.accounts.retrieveCapability).toHaveBeenCalledTimes(1)
    expect(mocks.accounts.retrieveCapability).toHaveBeenCalledWith('acct_1CoGRRJDiHehFaue', 'acap_1F0FWpJDiHehFaue4nt3wbv0', { idempotency_key: expect.anything() })
    expect(mocks.accounts.updateCapability).toHaveBeenCalledTimes(1)
    expect(mocks.accounts.updateCapability).toHaveBeenCalledWith('acct_1CoGRRJDiHehFaue', 'card_payments', { requested: true }, { idempotency_key: expect.anything() })
  })

  it('should manage application fees refunds', async () => {
    await broker.call('stripe.application.fees.refunds.create', { fee: 'fee_1F0FWpJDiHehFauer21VvXW6' })
    await broker.call('stripe.application.fees.refunds.retrieve', { fee: 'fee_1F0FWpJDiHehFauer21VvXW6', id: 'fr_1F0FWpJDiHehFauecbbkgWHn' })
    await broker.call('stripe.application.fees.refunds.update', { fee: 'fee_1F0FWpJDiHehFauer21VvXW6', id: 'fr_1F0FWpJDiHehFauecbbkgWHn', refund: { metadata: { test: 1 } } })
    await broker.call('stripe.application.fees.refunds.list', { fee: 'fee_1F0FWpJDiHehFauer21VvXW6' })

    expect(mocks.applicationFees.createRefund).toHaveBeenCalledTimes(1)
    expect(mocks.applicationFees.createRefund).toHaveBeenCalledWith('fee_1F0FWpJDiHehFauer21VvXW6', { idempotency_key: expect.anything() })
    expect(mocks.applicationFees.retrieveRefund).toHaveBeenCalledTimes(1)
    expect(mocks.applicationFees.retrieveRefund).toHaveBeenCalledWith('fee_1F0FWpJDiHehFauer21VvXW6', 'fr_1F0FWpJDiHehFauecbbkgWHn', { idempotency_key: expect.anything() })
    expect(mocks.applicationFees.updateRefund).toHaveBeenCalledTimes(1)
    expect(mocks.applicationFees.updateRefund).toHaveBeenCalledWith('fee_1F0FWpJDiHehFauer21VvXW6', 'fr_1F0FWpJDiHehFauecbbkgWHn', { metadata: { test: 1 } }, { idempotency_key: expect.anything() })
    expect(mocks.applicationFees.listRefunds).toHaveBeenCalledTimes(1)
    expect(mocks.applicationFees.listRefunds).toHaveBeenCalledWith('fee_1F0FWpJDiHehFauer21VvXW6', { idempotency_key: expect.anything() })
  })

})
