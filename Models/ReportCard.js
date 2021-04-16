const mongoose = require('mongoose');
const { Schema } = mongoose;


const studentReportCard = new Schema({
    heading: {
        type: String
    },
    subjects: [{
        subject: {type:String},
        score: {type:Number},
        total: {type:Number}
    }]
});

module.exports = mongoose.model('ReportCard', studentReportCard);