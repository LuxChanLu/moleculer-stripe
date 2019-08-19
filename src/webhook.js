/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

module.exports = {
  actions: {
    webhook: {
      params: { body: 'string', signature: 'string', connect: 'boolean' },
      async handler(ctx) {
        const { body, signature, connect } = ctx.params
        try {
          const { webhook } = this.config(ctx)
          const { key, action, event } = connect ? webhook.connect : webhook.plateform
          ctx.meta.connect = connect
          const stripeEvent = ctx.stripe.webhooks.constructEvent(body, signature, key)
          if (action) {
            await ctx.call(action.replace(/\{type\}/g, stripeEvent.type), stripeEvent)
          }
          if (event) {
            ctx.emit(event.replace(/\{type\}/g, stripeEvent.type), stripeEvent)
          }
          ctx.meta.$responseType = 'application/json'
          return { received: true }
        } catch (error) {
          ctx.meta.$statusCode = 400
          this.logger.error('Stripe webhook error', error)
        }
      }
    }
  }
}
