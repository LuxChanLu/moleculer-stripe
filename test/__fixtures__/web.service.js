/*
 * moleculer-stripe
 * Copyright (c) 2022 LuxChan S.A R.L.-S (https://github.com/LuxChanLu/moleculer-stripe)
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
