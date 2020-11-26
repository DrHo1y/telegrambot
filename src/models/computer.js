const { Schema, model } = require('mongoose')

const Computer = new Schema({
    name: { type: String, required: true },
    cpu: { type: String, required: true },
    cpuSpeed: { type: String, required: true },
    gpu: { type: String, required: true },
    ram: { type: String, required: true },
    rom: { type: String, required: true },
    psu: { type: String, required: true },
    cost: {type: String, required: true}
})

module.exports = model('Computer', Computer)