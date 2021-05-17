const Revenue = require('../Models/Revenue');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ExpressError = require('./ExpressError');

module.exports.retireveRevenue = async (standard, method, preYr = undefined, fromRev = undefined) => {

    let totalNew = totalOld = new Number(0);
    const createStandard = standard;
    const currentAcademicYear = await mongoose.model('AcademicYear').find({});
    const createRevenue = await mongoose.model('IncomeSchema').find({academicYear: (preYr == undefined || typeof(preYr) == 'object') ? currentAcademicYear[0].year : preYr});
    if(createRevenue.length > 0){
        for (let i = 0; i < createRevenue.length; i++){
            if (createStandard.RTE != 'Yes'){
                if(createRevenue[i].particulars != 'RTE'){
                    totalNew = totalNew + createRevenue[i][createStandard.class];
                }
            } else {
                if(createRevenue[i].particulars == 'RTE') {
                    totalNew = totalNew + createRevenue[i][createStandard.class];
                    totalOld = totalNew
                }
            }
        }

        for (let i = 0; i < createRevenue.length; i++){
            if(createRevenue[i].particulars == 'Admin' && createStandard.RTE != 'Yes'){
                totalOld = totalNew - createRevenue[i][createStandard.class];
            }
        }

        if(method == 'POST') {
            const studentRevenue = new Revenue ({ newStudent:totalNew, oldStudent: totalOld == undefined ? totalNew : totalOld });
            return studentRevenue;
        } else {
            return { newStudent:totalNew, oldStudent: totalOld == 0 ? totalNew : totalOld };
        }
        
    } else {
        if(fromRev != undefined) return {newStudent: 0, oldStudent: 0};
        if(preYr != undefined && fromRev == undefined) {
            const setBack = await mongoose.model('AcademicYear').findByIdAndUpdate({_id:preYr._id}, {$set: {year: preYr.year}});
        }
        throw new ExpressError('Schema for current academic year is not found!', 404);
    }
}