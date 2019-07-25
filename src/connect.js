/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const { extra } = require('./utils.js')

module.exports = {
  actions: {
    'accounts.login': {
      params: { id: 'string' },
      handler: ({ params, stripe, meta }) => stripe.accounts.createLoginLink(params.id, extra(meta))
    },

    'accounts.capabilities.list': {
      params: { account: 'string' },
      handler: ({ params, stripe, meta }) => stripe.accounts.listCapabilities(params.account, extra(meta))
    },
    'accounts.capabilities.retrieve': {
      params: { account: 'string', id: 'string' },
      handler: ({ params, stripe, meta }) => stripe.accounts.retrieveCapability(params.account, params.id, extra(meta))
    },
    'accounts.capabilities.update': {
      params: { account: 'string', capability: 'string', requested: 'boolean' },
      handler: ({ params, stripe, meta }) => stripe.accounts.updateCapability(params.account, params.capability, { requested: params.requested }, extra(meta))
    },

    'application.fees.refunds.create': {
      params: { fee: 'string' },
      handler: ({ stripe, params, meta }) => stripe.applicationFees.createRefund(params.fee, extra(meta))
    },
    'application.fees.refunds.retrieve': {
      params: { fee: 'string', id: 'string' },
      handler: ({ stripe, params, meta }) => stripe.applicationFees.retrieveRefund(params.fee, params.id, extra(meta))
    },
    'application.fees.refunds.update': {
      params: { fee: 'string', id: 'string', refund: 'object' },
      handler: ({ stripe, params, meta }) => stripe.applicationFees.updateRefund(params.fee, params.id, params.refund, extra(meta))
    },
    'application.fees.refunds.list': {
      params: { fee: 'string' },
      handler: ({ stripe, params, meta }) => stripe.applicationFees.listRefunds(params.fee, extra(meta))
    }
  }
}
