const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../Models/User');

router.get('/register', (req, res) => {
    res.render('Users/register');
});

module.exports = router;