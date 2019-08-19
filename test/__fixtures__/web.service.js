/*
 * moleculer-stripe
 * Copyright (c) 2019 YourSoft.run (https://github.com/YourSoftRun/moleculer-stripe)
 * MIT Licensed
 */

'use strict'

const MoleculerWeb = require('moleculer-web')
const { StripeRoute } = require('../../index.js')

module.exports = {
  mixins: [MoleculerWeb],

  settings: {
    routes: [StripeRoute(), StripeRoute('stripe/connect', 'stripe.connect', true)]
  }
}
