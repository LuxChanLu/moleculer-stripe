# moleculer-stripe

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
| &nbsp;&nbsp;&nbsp;&nbsp;[Charges](https://stripe.com/docs/charges)                              | <div style="text-align: center;">:white_check_mark:</div> | <div style="text-align: center;">:x:</div> (Use Checkout or PaymentIntents) |
| &nbsp;&nbsp;&nbsp;&nbsp;[PaymentIntents](https://stripe.com/docs/payments/payment-intents)      | <div style="text-align: center;">:heavy_check_mark:</div> | <div style="text-align: center;">:heavy_check_mark:</div>                   |
| [Billing](https://stripe.com/docs/billing)                                                      |                                                           |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Subscriptions](https://stripe.com/docs/billing/subscriptions/creating) | <div style="text-align: center;">:white_check_mark:</div> | <div style="text-align: center;">:heavy_check_mark:</div>                   |
| &nbsp;&nbsp;&nbsp;&nbsp;[Invoices](https://stripe.com/docs/billing/invoices/workflow)           | <div style="text-align: center;">:white_check_mark:</div> |                                                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;[Taxes](https://stripe.com/docs/billing/taxes/tax-rates)                | <div style="text-align: center;">:white_check_mark:</div> |                                                                             |
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
      webhook: ''
    }
  }
}
```
