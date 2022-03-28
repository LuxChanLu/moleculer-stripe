# moleculer-stripe

[![Build](https://github.com/LuxChanLu/moleculer-stripe/actions/workflows/build.yaml/badge.svg)](https://github.com/LuxChanLu/moleculer-stripe/actions/workflows/build.yaml)
[![Coverage Status](https://coveralls.io/repos/github/LuxChanLu/moleculer-stripe/badge.svg?branch=master)](https://coveralls.io/github/LuxChanLu/moleculer-stripe?branch=master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/222925eedf9c42aaa454b7138d687878)](https://www.codacy.com/gh/LuxChanLu/moleculer-stripe/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=LuxChanLu/moleculer-stripe&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/bc0acd387a21af63ba39/maintainability)](https://codeclimate.com/github/LuxChanLu/moleculer-stripe/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/LuxChanLu/moleculer-stripe/badge.svg)](https://snyk.io/test/github/LuxChanLu/moleculer-stripe)

[![Downloads](https://img.shields.io/npm/dm/moleculer-stripe.svg)](https://www.npmjs.com/package/moleculer-stripe)

## Stripe product available in this service

Ready for new PSD2 EU reglementations (SCA)

| Product                                                                                         | Implemented                                               | SCA                                                                         |
|-------------------------------------------------------------------------------------------------|-----------------------------------------------------------|-----------------------------------------------------------------------------|
| [Payments](https://stripe.com/docs/payments)                                                    |                                                           |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Checkout](https://stripe.com/docs/payments/checkout)                   | <div style="text-align: center;">:heavy_check_mark:</div> | <div style="text-align: center;">:heavy_check_mark:</div>                   |
| &nbsp;&nbsp;&nbsp;&nbsp;[Charges](https://stripe.com/docs/charges)                              | <div style="text-align: center;">:heavy_check_mark:</div> | <div style="text-align: center;">:x:</div> (Use Checkout or PaymentIntents) |
| &nbsp;&nbsp;&nbsp;&nbsp;[PaymentIntents](https://stripe.com/docs/payments/payment-intents)      | <div style="text-align: center;">:heavy_check_mark:</div> | <div style="text-align: center;">:heavy_check_mark:</div>                   |
| [Billing](https://stripe.com/docs/billing)                                                      |                                                           |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Customers](https://stripe.com/docs/billing/customer)                   | <div style="text-align: center;">:heavy_check_mark:</div> |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Subscriptions](https://stripe.com/docs/billing/subscriptions/creating) |                                                           | <div style="text-align: center;">:heavy_check_mark:</div>                   |
| &nbsp;&nbsp;&nbsp;&nbsp;[Invoices](https://stripe.com/docs/billing/invoices/workflow)           |                                                           |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Taxes](https://stripe.com/docs/billing/taxes/tax-rates)                |                                                           |                                                                             |
| [Connect](https://stripe.com/docs/connect)                                                      | <div style="text-align: center;">:heavy_check_mark:</div> |                                                                             |
| [Issuing](https://stripe.com/docs/issuing)                                                      | <div style="text-align: center;">:x:</div>                |                                                                             |
| [Terminal](https://stripe.com/docs/terminal)                                                    | <div style="text-align: center;">:x:</div>                |                                                                             |
| [Webhooks](https://stripe.com/docs/webhooks) - With signature check                             | <div style="text-align: center;">:heavy_check_mark:</div> |                                                                             |

## How to use it
```js
const StripeMixin = require('moleculer-stripe')

module.exports = {
  name: 'stripe',
  mixins: [StripeMixin],
  settings: {
    stripe: {
      /** @type {String} Secret key from Stripe dashboard. */
      secret: 'pk_',
      /* Before using webhook look in the README how to integrate it */
      webhook: {
        /** @type {Object?} Platefrom webhook (Default webhooks) */
        platform: {
          /** @type {String} Webhook signing from Stripe dashboard. */
          key: 'whsec_',
          /** @type {String?} Which action will be call when a webhook is received */
          action: undefined,
          /** @type {String?} Which event will be emitted when a webhook is received */
          event: undefined
        },
        /** @type {Object?} Connect webhook (Only if you use connect) */
        connect: {
          /** @type {String} Webhook signing from Stripe dashboard. */
          key: 'whsec_',
          /** @type {String?} Which action will be call when a webhook is received */
          action: undefined,
          /** @type {String?} Which event will be emitted when a webhook is received */
          event: undefined
        }
      },
      /** @type {String?} Version of this API (Default : latest). */
      version: undefined,
      /** @type {Boolean?} Enable/Disable telemetry for stripe (Default : true). */
      telemetry: true,
      /** @type {Function?} Custom function for config stripe, like setAppInfo for your plugin, ... (First args is stripe instance). */
      custom: undefined
    }
  }
}
```

All this options can be per call based :
```js
const customStripeOptions = {
  secret: 'pk_',
  version: '2019-08-26',
  telemetry: false
}
broker.call('stripe.payment.intents.create', charge, { meta: { stripe: customStripeOptions } })
```

When using with [Connect](https://stripe.com/docs/connect) you can have an `account` meta (It's the stripe_account from the [Connect](https://stripe.com/docs/connect) documentation)
```js
broker.call('stripe.payment.intents.create', charge, { meta: { stripe: { account: 'acc_' } } })
```

You can go further with stripe and there idempotency key (Because the Stripe API is freaking well thought)
```js
// Get autogenerated idempotency key (UUID V4)
await ctx.call('stripe.payment.intents.create', charge)
console.log(ctx.meta.stripe.idempotency)

// Or you want to use from your side
await ctx.call('stripe.payment.intents.create', charge, { meta: { stripe: { idempotency: UUIDV4() } } })
```

## Webhooks
### Integration with `moleculer-web`
Declare your stripe service like above :
```js
const StripeMixin = require('moleculer-stripe')

module.exports = {
  name: 'my.stripe.service',
  mixins: [StripeMixin],
  settings: { ... }
}
```
And in your web service add one route with the path of your webhook and the name of the stripe service :
```js
const MoleculerWeb = require('moleculer-web')
const { StripeRoute } = require('moleculer-stripe')

module.exports = {
  name: 'web',
  mixins: [MoleculerWeb],
  settings: {
    routes: [StripeRoute('/webhook/stripe', 'my.stripe.service')]
  }
}
```
If you want to use [Connect](https://stripe.com/docs/connect) webhook, just add a third arguement at `true` :
```js
const MoleculerWeb = require('moleculer-web')
const { StripeRoute } = require('moleculer-stripe')

module.exports = {
  name: 'web',
  mixins: [MoleculerWeb],
  settings: {
    routes: [StripeRoute('/webhook/stripe/platform', 'my.stripe.service'), StripeRoute('/webhook/stripe/connect', 'my.stripe.service', true)]
  }
}
```
If you want more "Pimp my ride" options on this route, look at src/index.js#78
### Integration with any other web gateway
Declare your stripe service like above :
```js
const StripeMixin = require('moleculer-stripe')

module.exports = {
  name: 'my.stripe.service',
  mixins: [StripeMixin],
  settings: { ... }
}
```
Then you need to call a specific action with the body of the webhook (:warning: [RAW Body, not json parsed](https://stripe.com/docs/webhooks/signatures) :warning:)
```js
// Example with express (If you use that, checkout the offical 'moleculer-web')
// Do your express init things + moleculer init broker
app.post('/webhook/stripe', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  const result = await broker.call('my.stripe.service.webhook', { body: request.body, signature: request.headers['stripe-signature'], connect: false })
  return result ? response.json(result) : response.status(400).end()
})
```
## API

A possiblity for every `list` actions, is to use 'autoPagination' from stripe node lib :
```js
// When it's a number it will use `autoPagingToArray` and use the value of `pagination` as the limit
ctx.call('stripe.payment.intents.list', {}, { meta: { pagination: 10000 } })
// When i's a string it will use `autoPagingEach` and use the value of `pagination` as the action to call for each and pass the item as parameter
ctx.call('stripe.payment.intents.list', {}, { meta: { pagination: 'my.service.each.payment' } })
```
```js
// Service will receive item from list
module.exports = {
  name: 'my.service',
  actions: {
    // Params is the stripe item
    'each.payment': ({ params }) => console.log(params.id, params.amount)
  }
}
```

| Action                            | Arguments                                      |
|-----------------------------------|------------------------------------------------|
| accounts.capabilities.list        | account                                        |
| accounts.capabilities.retrieve    | account, id                                    |
| accounts.capabilities.update      | account, capability, requested                 |
| accounts.create                   |                                                |
| accounts.del                      | id                                             |
| accounts.list                     |                                                |
| accounts.login                    | id                                             |
| accounts.reject                   | id                                             |
| accounts.retrieve                 | id                                             |
| accounts.update                   | id, account                                    |
| application.fees.list             |                                                |
| application.fees.refunds.create   | fee                                            |
| application.fees.refunds.list     | fee                                            |
| application.fees.refunds.retrieve | fee, id                                        |
| application.fees.refunds.update   | fee, id, refund                                |
| application.fees.retrieve         | id                                             |
| balance.retrieve                  | id                                             |
| balance.transactions.list         |                                                |
| balance.transactions.retrieve     | id                                             |
| charges.create                    |                                                |
| charges.del                       | id                                             |
| charges.list                      |                                                |
| charges.retrieve                  | id                                             |
| charges.update                    | id, charge                                     |
| checkout.sessions.create          |                                                |
| checkout.sessions.del             | id                                             |
| checkout.sessions.list            |                                                |
| checkout.sessions.retrieve        | id                                             |
| checkout.sessions.update          | id, session                                    |
| country.specs.list                |                                                |
| country.specs.retrieve            | id                                             |
| customers.create                  |                                                |
| customers.del                     | id                                             |
| customers.list                    |                                                |
| customers.retrieve                | id                                             |
| customers.update                  | id, customer                                   |
| payment.intents.cancel            | id                                             |
| payment.intents.capture           | id                                             |
| payment.intents.confirm           | id                                             |
| payment.intents.create            |                                                |
| payment.intents.list              |                                                |
| payment.intents.retrieve          | id                                             |
| payment.intents.update            | id, intent                                     |
| payouts.cancel                    | id                                             |
| payouts.create                    |                                                |
| payouts.list                      |                                                |
| payouts.retrieve                  | id                                             |
| payouts.update                    | id, payout                                     |
| products.create                   |                                                |
| products.del                      | id                                             |
| products.list                     |                                                |
| products.retrieve                 | id                                             |
| products.update                   | id, product                                    |
| refunds.create                    |                                                |
| refunds.list                      |                                                |
| refunds.retrieve                  | id                                             |
| refunds.update                    | id, refund                                     |
| setup.intents.cancel              | id                                             |
| setup.intents.confirm             | id                                             |
| setup.intents.create              |                                                |
| setup.intents.list                |                                                |
| setup.intents.retrieve            | id                                             |
| setup.intents.update              | id, intent                                     |
| skus.create                       |                                                |
| skus.del                          | id                                             |
| skus.list                         |                                                |
| skus.retrieve                     | id                                             |
| skus.update                       | id, sku                                        |
| tax.rates.create                  |                                                |
| tax.rates.list                    |                                                |
| tax.rates.retrieve                | id                                             |
| tax.rates.update                  | id, rate                                       |
| tokens.create                     |                                                |
| tokens.retrieve                   | id                                             |
| topups.cancel                     | id                                             |
| topups.create                     |                                                |
| topups.list                       |                                                |
| topups.retrieve                   | id                                             |
| topups.update                     | id, topup                                      |
| transfers.create                  |                                                |
| transfers.list                    |                                                |
| transfers.retrieve                | id                                             |
| transfers.update                  | id, transfer                                   |
