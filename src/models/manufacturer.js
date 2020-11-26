const { Schema, model } = require('mongoose')

const Manufacturer = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    consignment: { type: Schema.Types.ObjectId, ref: 'Consignment'}
})

module.exports = model('Manufacturer', Manufacturer)
