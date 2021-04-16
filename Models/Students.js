const mongoose = require('mongoose');
const Parent = require('./Parents');
const Standard = require('./Standards');
const Revenue = require('./Revenue');
const ReportCard = require('./ReportCard');
const { Schema } = mongoose;

const studentSchema = new Schema({
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
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    religion: String,
    caste: String,
    parents: {
        type: Schema.Types.ObjectId,
        ref: 'Parents'
    },
    classes: {
        type: Schema.Types.ObjectId,
        ref: 'Standards'
    },
    current: {
        type:String,
        enum:['Active', 'InActive']
    },
    DOL:{
        type: String
    },
    revenue:{
        type: Schema.Types.ObjectId,
        ref: 'Revenue'
    },
    mark:{
        type: Schema.Types.ObjectId,
        ref: 'ReportCard'
    }
    
});

studentSchema.post('save', async function(student) {
    if(student) {
        await mongoose.model('Students').findOneAndUpdate({_id: student._id}, {current: 'Active'});
    }
});

studentSchema.post('findOneAndDelete', async function(student) {
    if(student) {
        await Parent.findOneAndDelete({_id: student.parents._id});
        await Standard.findOneAndDelete({_id: student.classes._id});
        await Revenue.findOneAndDelete({_id: student.revenue._id});
        await ReportCard.findOneAndDelete({_id: student.mark._id});
    }
});

module.exports = mongoose.model('Students', studentSchema);