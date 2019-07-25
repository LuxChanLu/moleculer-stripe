# moleculer-stripe (/!\ WIP do not use in any kind of production (Even 'little' one) /!\)

[![Build Status](https://travis-ci.org/YourSoftRun/moleculer-stripe.svg?branch=master)](https://travis-ci.org/YourSoftRun/moleculer-stripe)
[![Coverage Status](https://coveralls.io/repos/github/YourSoftRun/moleculer-stripe/badge.svg?branch=master)](https://coveralls.io/github/YourSoftRun/moleculer-stripe?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9876f0d1a940446cb1aa4531c61d956f)](https://www.codacy.com/app/Hugome/moleculer-stripe?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=YourSoftRun/moleculer-stripe&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/e3ead65146fb298a850e/maintainability)](https://codeclimate.com/github/YourSoftRun/moleculer-stripe/maintainability)
[![David](https://img.shields.io/david/YourSoftRun/moleculer-stripe.svg)](https://david-dm.org/YourSoftRun/moleculer-stripe)
[![Known Vulnerabilities](https://snyk.io/test/github/YourSoftRun/moleculer-stripe/badge.svg)](https://snyk.io/test/github/YourSoftRun/moleculer-stripe)

[![Downloads](https://img.shields.io/npm/dm/moleculer-stripe.svg)](https://www.npmjs.com/package/moleculer-stripe)

## What in this package ?

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
      secret: '',
      public: '',
      webhook: {
        key: '',
        action: '',
        event: ''
      }
    }
  }
}
```

## How to integrate with `moleculer-web`
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

## API

| Action                            | Arguments                                             |
|-----------------------------------|-------------------------------------------------------|
| stripe.accounts.create            |                                                       |
| stripe.accounts.del               | id                                                    |
| stripe.accounts.list              |                                                       |
| stripe.accounts.retrieve          | id                                                    |
| stripe.accounts.update            | id, account                                           |
| stripe.charges.create             |                                                       |
| stripe.charges.del                | id                                                    |
| stripe.charges.list               |                                                       |
| stripe.charges.retrieve           | id                                                    |
| stripe.charges.update             | id, charge                                            |
| stripe.checkout.sessions.create   |                                                       |
| stripe.checkout.sessions.del      | id                                                    |
| stripe.checkout.sessions.list     |                                                       |
| stripe.checkout.sessions.retrieve | id                                                    |
| stripe.checkout.sessions.update   | id, session                                           |
| stripe.customers.create           |                                                       |
| stripe.customers.del              | id                                                    |
| stripe.customers.list             |                                                       |
| stripe.customers.retrieve         | id                                                    |
| stripe.customers.update           | id, customer                                          |
| stripe.payment.intents.create     |                                                       |
| stripe.payment.intents.del        | id                                                    |
| stripe.payment.intents.list       |                                                       |
| stripe.payment.intents.retrieve   | id                                                    |
| stripe.payment.intents.update     | id, intent                                            |
| stripe.products.create            |                                                       |
| stripe.products.del               | id                                                    |
| stripe.products.list              |                                                       |
| stripe.products.retrieve          | id                                                    |
| stripe.products.update            | id, product                                           |
| stripe.refunds.create             |                                                       |
| stripe.refunds.list               |                                                       |
| stripe.refunds.retrieve           | id                                                    |
| stripe.refunds.update             | id, refund                                            |
| stripe.skus.create                |                                                       |
| stripe.skus.del                   | id                                                    |
| stripe.skus.list                  |                                                       |
| stripe.skus.retrieve              | id                                                    |
| stripe.skus.update                | id, sku                                               |
| stripe.tax.rates.create           |                                                       |
| stripe.tax.rates.list             |                                                       |
| stripe.tax.rates.retrieve         | id                                                    |
| stripe.tax.rates.update           | id, rate                                              |
