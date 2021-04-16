const mongoose = require('mongoose');
const { Schema } = mongoose;

const parentSchema = new Schema({
    fatherName: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    mainContact: {
        type: Number,
        required: true
    },
    alternateContact: Number,
    doorNumber: String,
    streetName: String,
    cityName: String,
    pincode: Number 
})

module.exports = mongoose.model('Parents', parentSchema);