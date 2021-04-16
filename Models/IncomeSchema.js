const mongoose = require('mongoose');
const { Schema } = mongoose;
const {retireveRevenue} = require('../utils/RetrieveRev');


const incomeSchema = new Schema({
    particulars: {
        type: String,
        required: true
    },
    PreKG: {
        type: Number,
        required: true
    },
    LKG: {
        type: Number,
        required: true
    },
    UKG: {
        type: Number,
        required: true
    },
    I: {
        type: Number,
        required: true
    },
    II: {
        type: Number,
        required: true
    },
    III: {
        type: Number,
        required: true
    },
    IV: {
        type: Number,
        required: true
    },
    V:{
        type: Number,
        required: true
    },
    academicYear: {
        type: Number,
        required: true
    }
});

incomeSchema.post('save', async function(body) {
    if(body) {
        const allActiveStudents = await mongoose.model('Students').find({current: 'Active'}).populate('classes').populate('revenue');
        for (let student in allActiveStudents){
            const updatedRevenue = await retireveRevenue(allActiveStudents[student].classes, 'PUT');
            const updateExistingRec = await mongoose.model('Revenue').findByIdAndUpdate(allActiveStudents[student].revenue._id, updatedRevenue, {runValidators: true, new: true});
        };
    }
});

incomeSchema.post('findOneAndDelete', async function(body) {
    if(body) {
        const allActiveStudents = await mongoose.model('Students').find({current: 'Active'}).populate('classes').populate('revenue');
        for (let student in allActiveStudents){
            const updatedRevenue = await retireveRevenue(allActiveStudents[student].classes, 'PUT');
            const updateExistingRec = await mongoose.model('Revenue').findByIdAndUpdate(allActiveStudents[student].revenue._id, updatedRevenue, {runValidators: true, new: true});
        };
    }
});

module.exports = mongoose.model('IncomeSchema', incomeSchema);