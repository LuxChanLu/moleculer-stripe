const MoleculerWeb = require('moleculer-web')
const { StripeRoute } = require('../../index.js')

module.exports = {
  mixins: [MoleculerWeb],

  settings: {
    routes: [StripeRoute()]
  }
}
