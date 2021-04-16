const mongoose = require('mongoose');
const { Schema } = mongoose;
const {retireveRevenue} = require('../utils/RetrieveRev');

const year = new Schema({
    year: {
        type: Number,
        required: true
    }
});

year.post('findOneAndUpdate', async function(preYr) {
    if(preYr) {
        const allActiveStudents = await mongoose.model('Students').find({current: 'Active'}).populate('classes').populate('revenue');
        for (let student in allActiveStudents){
            const updatedRevenue = await retireveRevenue(allActiveStudents[student].classes, 'PUT', preYr);
            const updateExistingRec = await mongoose.model('Revenue').findByIdAndUpdate(allActiveStudents[student].revenue._id, updatedRevenue, {runValidators: true, new: true});
        };
    }
});

module.exports = mongoose.model('AcademicYear', year);