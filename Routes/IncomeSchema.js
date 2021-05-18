const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const IncomeSchema = require('../Models/IncomeSchema');
const year = require('../Models/AcademicYear');
const {validateIncome} = require('../utils/validateSchemas');

router.get('/', catchAsync(async (req, res, next) => {
    const currentAcademicYear = await year.find({});
    const incomeDetails = await IncomeSchema.find({academicYear: currentAcademicYear[0].year});
    if(!incomeDetails){
        req.flash('error', "This student detail doesn't exist in DB anymore");
        return res.redirect('/dashboard');
    }
    res.render('Revenue/YearlyIncome', {incomeDetails, year:currentAcademicYear[0].year});
}));

router.post('/', validateIncome, catchAsync(async(req, res, next) => {
    const Income = new IncomeSchema(req.body);
    await Income.save();
    res.redirect('/IncomeSchema');
}));

router.get('/:year', catchAsync(async(req, res, next) => {
    const yearlyIncome = await IncomeSchema.find({academicYear: req.params.year});
    res.status(200).json({data: yearlyIncome});
}));

router.delete('/removeIncome/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const Income = await IncomeSchema.findByIdAndDelete(id);
    res.redirect('/IncomeSchema');
}));

module.exports = router;