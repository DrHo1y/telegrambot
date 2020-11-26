const { Schema, model } = require('mongoose')

const Consignment = new Schema({
    name: { type: String, required: true },
    computer: { type: Schema.Types.ObjectId, ref: 'Computer' },
    batchSize: { type: Number, required: true },
    cost: { type: String, required: true },
    date: { type: Date, required: true }
})

module.exports = model('Consignment', Consignment)