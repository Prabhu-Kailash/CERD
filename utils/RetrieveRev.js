const Revenue = require('../Models/Revenue');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ExpressError = require('./ExpressError');

module.exports.retireveRevenue = async (standard, method, preYr = undefined) => {

    let totalNew = totalOld = new Number(0);
    const createStandard = standard;
    const currentAcademicYear = await mongoose.model('AcademicYear').find({});
    const createRevenue = await mongoose.model('IncomeSchema').find({academicYear: currentAcademicYear[0].year});
    if(createRevenue.length > 0){
        for (let i = 0; i < createRevenue.length; i++){
            if (createStandard.RTE != 'Yes'){
                if(createRevenue[i].particulars != 'RTE'){
                    totalNew = totalNew + createRevenue[i][createStandard.class];
                };
            } else {
                if(createRevenue[i].particulars == 'RTE') {
                    totalNew = totalNew + createRevenue[i][createStandard.class];
                    totalOld = totalNew
                };
            };
        };

        for (let i = 0; i < createRevenue.length; i++){
            if(createRevenue[i].particulars == 'Admin' && createStandard.RTE != 'Yes'){
                totalOld = totalNew - createRevenue[i][createStandard.class];
            };
        };

        if(method == 'POST') {
            const studentRevenue = new Revenue ({ newStudent:totalNew, oldStudent: totalOld == undefined ? totalNew : totalOld });
            return studentRevenue;
        } else {
            return { newStudent:totalNew, oldStudent: totalOld == 0 ? totalNew : totalOld };
        };
        
    } else {
        if(preYr != undefined) {
            const setBack = await mongoose.model('AcademicYear').findByIdAndUpdate({_id:preYr._id}, {$set: {year: preYr.year}});
        }
        throw new ExpressError('Schema for current academic year is not found!', 404);
    };
};