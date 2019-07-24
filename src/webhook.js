/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

module.exports = {
  actions: {
    webhook: {
      params: { body: 'string', signature: 'string' },
      async handler(ctx) {
        try {
          const { webhook } = this.config(ctx)
          const { key, call, event } = webhook
          const { body, signature } = ctx.params
          const stripeEvent = ctx.stripe.webhooks.constructEvent(body, signature, key)
          if (call) {
            await ctx.call(call.replace(/\{type\}/g, stripeEvent.type), stripeEvent)
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
