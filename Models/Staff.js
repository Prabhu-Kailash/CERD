const mongoose = require('mongoose');
const { Schema } = mongoose;

const staffSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    aadhar: {
        type: Number,
        required: true
    },
    DOB: {
        type: String,
        required: true
    },
    religion: String,
    caste: String,
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    detail: {
        type: String,
        enum: ['Tech', 'NonTech']
    },
    fatherName: String,
    motherName: String,
    doorNumber: String,
    streetName: String,
    cityName: String,
    pincode: Number,
    mainContact: {
        type: Number,
        required: true
    },
    alternateContact: Number,
    admissionNumber: {
        type: Number,
        required: true,
        unique: true
    },
    DOJ: {
        type: String,
        required: true
    },
    current: {
        type: String,
        enum: ['Active', 'InActive']
    },
    DOL: String
});

staffSchema.post('save', async function(staff) {
    if(staff) {
        await mongoose.model('Staff').findOneAndUpdate({_id: staff._id}, {current: 'Active'});
    }
});

module.exports = mongoose.model('Staff', staffSchema);