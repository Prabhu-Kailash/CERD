const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Student = require('../Models/Students');
const Revenue = require('../Models/Revenue');
const year = require('../Models/AcademicYear');

router.post('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studentRev = await Student.findById(id).populate('revenue');
    const update = await Revenue.findOneAndUpdate({_id: studentRev.revenue._id}, {$push:{amountPaid: req.body}});
    res.redirect('/revenue/' + id);
}));

router.delete('/:studentID/:revID/:paidID', catchAsync(async (req, res, next) => {
    const { studentID, revID, paidID } = req.params;
    const del = await Revenue.findOneAndUpdate({_id: revID}, {$pull: {amountPaid: {_id: paidID}}});
    res.redirect('/revenue/' + studentID);
}));

router.get('/:item', catchAsync(async (req, res, next) => {
    let paid = new Number(0);
    const { item } = req.params;
    const currentAcademicYear = await year.find({});
    const studentRev = await Student.findById(item).populate('classes').populate('revenue');
    for (let l in studentRev.revenue.amountPaid){
        if(studentRev.revenue.amountPaid[l].academicYr == currentAcademicYear[0].year){
            paid = paid + studentRev.revenue.amountPaid[l].paid
        }        
    }
    res.render('Students/Revenue', {studentRev:studentRev, workingYear:currentAcademicYear[0].year, totalAmountPaid: paid});
}));

router.get('/json/:studentID', catchAsync(async(req, res, next) => {
    const { studentID } = req.params;
    let retrieveRev = await Revenue.findById(studentID);
    res.status(200).json({data:retrieveRev});
}));


module.exports = router;