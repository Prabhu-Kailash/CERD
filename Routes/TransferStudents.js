const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {validateDB} = require('../utils/validateSchemas');
const Student = require('../Models/Students');
const {retireveRevenue} = require('../utils/RetrieveRev');
const Revenue = require('../Models/Revenue');
const {isLoggedIn} = require('../utils/AuthMW');


router.get('/', isLoggedIn, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const transferStudent = await Student.find({current: 'InActive'}).populate('parents').populate('classes');
    res.render('Students/TransferredStudent', {students:transferStudent});
}));

router.patch('/:id', isLoggedIn, validateDB, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const transferStudent = await Student.findByIdAndUpdate(id, {current: 'InActive', DOL: new Date().toISOString().slice(0,10)});
    res.redirect('/dashboard');
}));

router.patch('/re-add/:id', isLoggedIn, validateDB, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const reAddStudent = await Student.findByIdAndUpdate(id, {current: 'Active', DOL: ''}).populate('classes').populate('revenue');
    const updatedRevenue = await retireveRevenue(reAddStudent.classes, 'PUT');
    const updateExistingRec = await Revenue.findByIdAndUpdate(reAddStudent.revenue._id, updatedRevenue, {runValidators: true, new: true});
    res.redirect('/dashboard');
}));

module.exports = router;
