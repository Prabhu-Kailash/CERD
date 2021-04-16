const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs-mate');
const path = require('path');
const year = require('./Models/AcademicYear');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const studentRoute = require('./Routes/Students');
const dashboardRoute = require('./Routes/Dashboard');
const transferRoute = require('./Routes/TransferStudents');
const incomeRoute = require('./Routes/IncomeSchema');
const revenueRoute = require('./Routes/Revenue');
const reportRoute = require('./Routes/ReportCard');

const setAcademicYear = async () => {
    const retrieve = await year.find({});
    if (retrieve.length == 0){
        const academic = await new year ({ year: new Date().getFullYear() });
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


// Routes

app.use('/students', studentRoute);
app.use('/dashboard', dashboardRoute);
app.use('/transfer', transferRoute);
app.use('/IncomeSchema', incomeRoute);
app.use('/Revenue', revenueRoute);
app.use('/Report', reportRoute);


// Academic Year

app.post('/changeYear', catchAsync(async (req, res, next) => {
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