const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs-mate');
const path = require('path');
const year = require('./Models/AcademicYear');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const localPassport = require('passport-local');
const User = require('./Models/User');


const studentRoute = require('./Routes/Students');
const dashboardRoute = require('./Routes/Dashboard');
const transferRoute = require('./Routes/TransferStudents');
const incomeRoute = require('./Routes/IncomeSchema');
const revenueRoute = require('./Routes/Revenue');
const reportRoute = require('./Routes/ReportCard');
const staffRoute = require('./Routes/Staff');
const userRoute = require('./Routes/User');
const {isLoggedIn} = require('./utils/AuthMW');

// Development Phase

const setAcademicYear = async () => {
    const retrieve = await year.find({});
    if (retrieve.length == 0){
        const academic = new year ({ year: new Date().getFullYear() });
        await academic.save();
    };
};

setAcademicYear();

// MongoDB

mongoose.connect('mongodb://localhost/CERD', {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).then((data) => {
    console.log('DB successfully connected');
}).catch((err) => {
    console.log(err);
});


// Middleware - Express

app.engine('ejs', ejs);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('Public'));

// Session Config

const sessionConfig = {
    secret: 'thisisasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60,
        maxAge: 1000 * 60 * 60
    }

}
app.use(session(sessionConfig));

// Passport Authentication

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware - Flash Messages

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Routes

app.use('/', userRoute);
app.use('/students', studentRoute);
app.use('/dashboard', dashboardRoute);
app.use('/transfer', transferRoute);
app.use('/IncomeSchema', incomeRoute);
app.use('/Revenue', revenueRoute);
app.use('/Report', reportRoute);
app.use('/staff', staffRoute);


// Academic Year

app.post('/changeYear', isLoggedIn, catchAsync(async (req, res, next) => {
    const retrieve = await year.findOneAndUpdate({}, {$set: {year: req.body.year}});
    res.redirect('/dashboard');
}));


// System Route

app.get('/', (req, res) => {
    res.send('Hello World, I am coming to rule!');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found!', 404));
})

app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Oops! Something went wrong!'} = err;
    res.status(statusCode).render('Errors/404', {err});
});

app.listen('3000', () =>{
    console.log('Running on port 3000');
});