const mongoose = require('mongoose');
const { Schema } = mongoose;

const Revenue = new Schema({
    amountPaid:[
        {
            academicYr: Number,
            present: String,
            description: String,
            paid: Number
        }
    ],
    newStudent: Number,
    oldStudent: Number
});

module.exports = mongoose.model('Revenue', Revenue);