const mongoose = require('mongoose');
const { Schema } = mongoose;

const classSchema = new Schema({
    class: {
        type: String,
        required: true,
        enum: ['PreKG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V']
    },
    section: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C']
    },
    admissionNumber: {
        type: Number,
        required: true,
        unique: true
    },
    DOJ: {
        type: String,
        required: true
    },
    RTE: {
        type: String,
        required: true,
        enum: ['No', 'Yes']
    }
});


module.exports = mongoose.model('Standards', classSchema);