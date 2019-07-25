/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const Pluralize = require('pluralize')
const Decamelize = require('decamelize')
const UUIDV4 = require('uuid/v4')

module.exports = {
  CRUDL(stripeResource, { create = true, retrieve = true, update = true, del = true, list = true } = {}, prefix = '') {

    // Trying to normalize these !#*@$# stripe resource name
    const resource = Decamelize(stripeResource, '.')
    const stripeResourcePlural = Pluralize(stripeResource)
    const plural = Pluralize(resource)
    const name = ((resource.match(/\.[^.]*$/) || [])[0] || resource).replace('.', '')

    const actions = {
      [`${prefix}${plural}.create`]: !create || {
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].create(params, module.exports.extra(meta))
      },
      [`${prefix}${plural}.retrieve`]: !retrieve || {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].retrieve(params.id, module.exports.extra(meta))
      },
      [`${prefix}${plural}.update`]: !update || {
        params: { id: 'string', [name]: 'object' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].update(params.id, params[name], module.exports.extra(meta))
      },
      [`${prefix}${plural}.del`]: !del || {
        params: { id: 'string' },
        handler: ({ stripe, params, meta }) => stripe[stripeResourcePlural].del(params.id, module.exports.extra(meta))
      },
      [`${prefix}${plural}.list`]: !list || {
        handler: ({ stripe, params, meta }) => {
          const list = stripe[stripeResourcePlural].list(params, module.exports.extra(meta))
          if (meta.array && !isNaN(meta.array)) {
            return list.autoPagingToArray({ limit: meta.array })
          }
          return list
        }
      }
    }
    return {
      actions: Object.entries(actions)
        .filter((([, action]) => action !== true))
        .reduce((actions, [name, action]) => ({ ...actions, [name]: action }), {})
    }
  },
  extra({ stripe }) {
    const { account, idempotency, auth } = stripe || {}
    const extra = {
      idempotency_key: idempotency || UUIDV4()
    }
    if (account) {
      extra.stripe_account = account
    }
    if (auth) {
      extra.api_key = auth
    }
    return extra
  }
}
