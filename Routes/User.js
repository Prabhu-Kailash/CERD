const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../Models/User');
const passport = require('passport');
const Staff = require('../Models/Staff');

router.get('/Register', (req, res) => {
    res.render('Users/register', {login: 'Register'});
});

router.post('/Register', catchAsync(async(req, res) => {
    const { staffID, email, password } = req.body.user;
    const staffCheck = await Staff.find({admissionNumber:staffID});
    if(staffCheck.length == 0){
        req.flash('error', "Staff Identification failed, kindly verify your ID with management!");
        res.redirect('/Register');
    } else {
        try{
            const newUser = new User({ email, username:staffID });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser)
            req.flash('success', `Welcome to C. E. R. D, ${staffCheck[0].name}!`);
            res.redirect('/dashboard');
        } catch (e) {
            req.flash('error', 'Check your email address/Staff ID!, it should be unique');
            res.redirect('Register');
        }
    }
}));

router.get('/Login', (req, res) => {
    res.render('Users/Register', {login: 'Login'});
});

router.post('/Login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/Login' }), async (req, res) => {
    const {username} = req.body;
    const staffCheck = await Staff.find({admissionNumber:username});
    req.flash('success', `Welcome back, ${staffCheck[0].name}!`);
    res.redirect('/dashboard');
});

module.exports = router;