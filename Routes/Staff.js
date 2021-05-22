const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Staff = require('../Models/Staff'); 
const User = require('../Models/User'); 
const {ValidateStaffSchema} = require('../utils/validateSchemas');
const {isLoggedIn, isAuthorized} = require('../utils/AuthMW');


router.get('/', isLoggedIn, isAuthorized, (req, res) => {
    res.render('Staff/NewEntry');
});

router.post('/', isLoggedIn, isAuthorized, ValidateStaffSchema, catchAsync(async (req, res, next) => {
    const createStaff = new Staff(req.body.staff);
    await createStaff.save();
    req.flash('success', `Successfully created/added ${createStaff.name} details!`);
    res.redirect('/dashboard');
}));

router.delete('/delete/:id', isLoggedIn, isAuthorized, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const removeStaff = await Staff.findByIdAndDelete(id);
    req.flash('success', `Successfully removed/deleted ${removeStaff.name} details!`);
    res.redirect('/dashboard');
}));

router.put('/:id', isLoggedIn, isAuthorized, ValidateStaffSchema, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const updateStaff = await Staff.findByIdAndUpdate(id, req.body.staff, {runValidators: true, new: true});
    req.flash('success', `Successfully updated ${updateStaff.name} details!`);
    res.redirect('/dashboard');
}));

router.get('/edit/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const retrieveStaff = await Staff.findById(id);
    if(!retrieveStaff){
        req.flash('error', "This staff detail doesn't exist in DB anymore");
        return res.redirect('/dashboard');
    }
    res.render('Staff/Edit', {staff:retrieveStaff});
}));

router.patch('/transfer/:id', isLoggedIn, isAuthorized, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const transferStaff = await Staff.findByIdAndUpdate(id, {current: 'InActive', DOL: new Date().toISOString().slice(0,10)});
    await User.findOneAndDelete({username:transferStaff.admissionNumber});
    req.flash('success', `Successfully terminated ${transferStaff.name} details!`);
    res.redirect('/dashboard');
}));

router.patch('/re-add/:id', isLoggedIn, isAuthorized, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const reAddStudent = await Staff.findByIdAndUpdate(id, {current: 'Active', DOL: ''});
    req.flash('success', `Successfully re-Added ${reAddStudent.name} details!`);
    res.redirect('/dashboard');
}));

router.get('/json', isLoggedIn, catchAsync(async (req, res, next) => {
    const listOfStaff = await Staff.find({current:'Active', admissionNumber: { $ne: 770846 }}).sort({ name: 'asc'});
    res.status(200).json({data: listOfStaff});
}));

router.get('/Tjson', isLoggedIn, catchAsync(async (req, res, next) => {
    const listOfStaff = await Staff.find({current:'InActive'}).sort({ name: 'asc'});
    res.status(200).json({data: listOfStaff});
}));

module.exports = router;