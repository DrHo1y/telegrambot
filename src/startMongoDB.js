const mongoose = require('mongoose')

const startMongo = async (URI) => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).catch(err => console.log(err))
    console.log('Mongo started')
} 

module.exports = startMongo
