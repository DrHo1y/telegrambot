const { Schema, model } = require('mongoose')

const Distributor = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    consignment: { type: Schema.Types.ObjectId, ref: 'Consignment'}
})

module.exports = model('Distributor', Distributor)