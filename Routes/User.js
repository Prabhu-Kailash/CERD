const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../Models/User');
const passport = require('passport');
const Staff = require('../Models/Staff');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Shows register page
router.get('/Register', (req, res) => {
    res.render('Users/register', {login: 'Register'});
});

// Registers new users
router.post('/Register', catchAsync(async(req, res, next) => {
    const { staffID, email, password } = req.body.user;
    const staffCheck = await Staff.find({admissionNumber:staffID, current:'Active'});
    if(staffCheck.length == 0){
        req.flash('error', "Staff Identification failed, kindly verify your ID with management!");
        res.redirect('/Register');
    } else {
        try{
            const newUser = new User({ responsibility: staffCheck[0].role, email, username:staffID });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, err => {
                if(err) return next(err);
                req.flash('success', `Welcome to C. E. R. D, ${staffCheck[0].name}!`);
                res.redirect('/dashboard');
            });
        } catch (e) {
            console.log(e)
            req.flash('error', 'Check your email address/Staff ID!, it should be unique');
            res.redirect('Register');
        }
    }
}));

// Login page
router.get('/Login', (req, res) => {
    res.render('Users/Register', {login: 'Login'});
});

// Login functionality
router.post('/Login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/Login' }), catchAsync(async(req, res) => {
    const {username} = req.body;
    const staffCheck = await Staff.find({admissionNumber:username});
    req.flash('success', `Welcome back, ${staffCheck[0].name}!`);
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}));

// Logout
router.get('/Logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Good bye!')
    res.redirect('/');
});

// forgot password
router.get('/forgot', function(req, res) {
    res.render('Users/forgot');
});

router.post('/forgot', catchAsync(async function(req, res) {

    const find = await User.findOne({
        username: req.body.user.username, 
        email: {'$regex' : `${req.body.user.email}`, '$options' : 'i'}
    });

    if(!find){
        req.flash('error', 'Check your Staff ID and Email ID!');
        res.redirect('/forgot');
    }

    const hash = crypto.randomFillSync(Buffer.alloc(20)).toString('hex');
    const update = await User.findByIdAndUpdate(find._id, {resetPasswordToken: hash, resetPasswordExpires: Date.now() + 3600000}, {runValidators: true, new: true});

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: 'Kailash.Prabhu23@gmail.com',
          pass: 'Corona@19'
        },
        tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
        to: find.email,
        from: 'DoNotReply@CERD.com',
        subject: 'C. E. R. D Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + hash + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };

    smtpTransport.sendMail(mailOptions, function(err) {
        if(!err) {
            req.flash('success', 'An e-mail has been sent to ' + find.email + ' with further instructions.');
            res.redirect('/forgot');
        } else {
            req.flash('error', 'Unable to send email! Reach Admin to get it resolved.');
            res.redirect('/forgot');
        }
    });

}));

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
        }
        res.render('reset', {token: req.params.token});
    });
});

module.exports = router;