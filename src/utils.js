/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const Pluralize = require('pluralize')
const Decamelize = require('decamelize')
const UUIDV4 = require('uuid/v4')

const StripeMethods = { create: true, retrieve: true, update: true, del: true, list: true, confirm: false, capture: false, cancel: false, reject: false }

module.exports = {
  StripeMethods(stripeResource, options = StripeMethods, single = false) {
    options = { ...StripeMethods, ...options }

    // Trying to normalize these !#*@$# stripe resource name
    const resource = Decamelize(stripeResource, '.')
    const stripeResourcePlural = Pluralize(stripeResource)
    const plural = Pluralize(resource)
    const name = ((resource.match(/\.[^.]*$/) || [])[0] || resource).replace('.', '')

    const actions = {
      create: {
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].create(params, module.exports.extra(meta))
      },
      retrieve: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].retrieve(params.id, module.exports.extra(meta))
      },
      update: {
        params: { id: 'string', [name]: 'object' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].update(params.id, params[name], module.exports.extra(meta))
      },
      del: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].del(params.id, module.exports.extra(meta))
      },
      confirm: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].confirm(params.id, module.exports.extra(meta))
      },
      capture: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].capture(params.id, module.exports.extra(meta))
      },
      cancel: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].cancel(params.id, module.exports.extra(meta))
      },
      reject: {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].reject(params.id, module.exports.extra(meta))
      },
      list: {
        handler: (ctx) => {
          const { stripe, params, meta } = ctx
          const list = stripe[stripeResourcePlural].list(params, module.exports.extra(meta))
          if (meta.pagination) {
            if (!isNaN(meta.pagination)) {
              return list.autoPagingToArray({ limit: meta.pagination })
            } else if (typeof meta.pagination === 'string') {
              return list.autoPagingEach(async item => ctx.call(meta.pagination, item))
            }
          }
          return list
        }
      }
    }
    return {
      actions: Object.entries(actions)
        .filter((([name]) => options[name]))
        .reduce((actions, [name, action]) => ({ ...actions, [`${single ? resource : plural}.${name}`]: action }), {})
    }
  },
  extra(meta) {
    meta.stripe = meta.stripe || {}
    const { account, idempotency } = meta.stripe
    const extra = {
      idempotency_key: idempotency || (meta.stripe.idempotency = UUIDV4())
    }
    if (account) {
      extra.stripe_account = account
    }
    return extra
  }
}
