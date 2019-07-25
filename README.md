# moleculer-stripe

:money_with_wings: Not perfect (yet), be careful before doing some crazy millions :moneybag::moneybag::moneybag: transactions with this :money_with_wings:

[![Build Status](https://travis-ci.org/YourSoftRun/moleculer-stripe.svg?branch=master)](https://travis-ci.org/YourSoftRun/moleculer-stripe)
[![Coverage Status](https://coveralls.io/repos/github/YourSoftRun/moleculer-stripe/badge.svg?branch=master)](https://coveralls.io/github/YourSoftRun/moleculer-stripe?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9876f0d1a940446cb1aa4531c61d956f)](https://www.codacy.com/app/Hugome/moleculer-stripe?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YourSoftRun/moleculer-stripe&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/e3ead65146fb298a850e/maintainability)](https://codeclimate.com/github/YourSoftRun/moleculer-stripe/maintainability)
[![David](https://img.shields.io/david/YourSoftRun/moleculer-stripe.svg)](https://david-dm.org/YourSoftRun/moleculer-stripe)
[![Known Vulnerabilities](https://snyk.io/test/github/YourSoftRun/moleculer-stripe/badge.svg)](https://snyk.io/test/github/YourSoftRun/moleculer-stripe)

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
        /** @type {String} Webhook signing from Stripe dashboard. */
        key: 'whsec_',
        /** @type {String?} Which action will be call when a webhook is received */
        action: undefined,
        /** @type {String?} Which event will be emitted when a webhook is received */
        event: undefined
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
  const result = await broker.call('my.stripe.service.webhook', { body: request.body, signature: request.headers['stripe-signature'] })
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

| Action                                   | Arguments                                      |
|------------------------------------------|------------------------------------------------|
| stripe.accounts.capabilities.list        | account                                        |
| stripe.accounts.capabilities.retrieve    | account, id                                    |
| stripe.accounts.capabilities.update      | account, capability, requested                 |
| stripe.accounts.create                   |                                                |
| stripe.accounts.del                      | id                                             |
| stripe.accounts.list                     |                                                |
| stripe.accounts.login                    | id                                             |
| stripe.accounts.reject                   | id                                             |
| stripe.accounts.retrieve                 | id                                             |
| stripe.accounts.update                   | id, account                                    |
| stripe.application.fees.list             |                                                |
| stripe.application.fees.refunds.create   | fee                                            |
| stripe.application.fees.refunds.list     | fee                                            |
| stripe.application.fees.refunds.retrieve | fee, id                                        |
| stripe.application.fees.refunds.update   | fee, id, refund                                |
| stripe.application.fees.retrieve         | id                                             |
| stripe.balance.retrieve                  | id                                             |
| stripe.balance.transactions.list         |                                                |
| stripe.balance.transactions.retrieve     | id                                             |
| stripe.charges.create                    |                                                |
| stripe.charges.del                       | id                                             |
| stripe.charges.list                      |                                                |
| stripe.charges.retrieve                  | id                                             |
| stripe.charges.update                    | id, charge                                     |
| stripe.checkout.sessions.create          |                                                |
| stripe.checkout.sessions.del             | id                                             |
| stripe.checkout.sessions.list            |                                                |
| stripe.checkout.sessions.retrieve        | id                                             |
| stripe.checkout.sessions.update          | id, session                                    |
| stripe.country.specs.list                |                                                |
| stripe.country.specs.retrieve            | id                                             |
| stripe.customers.create                  |                                                |
| stripe.customers.del                     | id                                             |
| stripe.customers.list                    |                                                |
| stripe.customers.retrieve                | id                                             |
| stripe.customers.update                  | id, customer                                   |
| stripe.payment.intents.cancel            | id                                             |
| stripe.payment.intents.capture           | id                                             |
| stripe.payment.intents.confirm           | id                                             |
| stripe.payment.intents.create            |                                                |
| stripe.payment.intents.list              |                                                |
| stripe.payment.intents.retrieve          | id                                             |
| stripe.payment.intents.update            | id, intent                                     |
| stripe.payouts.cancel                    | id                                             |
| stripe.payouts.create                    |                                                |
| stripe.payouts.list                      |                                                |
| stripe.payouts.retrieve                  | id                                             |
| stripe.payouts.update                    | id, payout                                     |
| stripe.products.create                   |                                                |
| stripe.products.del                      | id                                             |
| stripe.products.list                     |                                                |
| stripe.products.retrieve                 | id                                             |
| stripe.products.update                   | id, product                                    |
| stripe.refunds.create                    |                                                |
| stripe.refunds.list                      |                                                |
| stripe.refunds.retrieve                  | id                                             |
| stripe.refunds.update                    | id, refund                                     |
| stripe.setup.intents.cancel              | id                                             |
| stripe.setup.intents.confirm             | id                                             |
| stripe.setup.intents.create              |                                                |
| stripe.setup.intents.list                |                                                |
| stripe.setup.intents.retrieve            | id                                             |
| stripe.setup.intents.update              | id, intent                                     |
| stripe.skus.create                       |                                                |
| stripe.skus.del                          | id                                             |
| stripe.skus.list                         |                                                |
| stripe.skus.retrieve                     | id                                             |
| stripe.skus.update                       | id, sku                                        |
| stripe.tax.rates.create                  |                                                |
| stripe.tax.rates.list                    |                                                |
| stripe.tax.rates.retrieve                | id                                             |
| stripe.tax.rates.update                  | id, rate                                       |
| stripe.tokens.create                     |                                                |
| stripe.tokens.retrieve                   | id                                             |
| stripe.topups.cancel                     | id                                             |
| stripe.topups.create                     |                                                |
| stripe.topups.list                       |                                                |
| stripe.topups.retrieve                   | id                                             |
| stripe.topups.update                     | id, topup                                      |
| stripe.transfers.create                  |                                                |
| stripe.transfers.list                    |                                                |
| stripe.transfers.retrieve                | id                                             |
| stripe.transfers.update                  | id, transfer                                   |
