const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const Student = require('../Models/Students');
const year = require('../Models/AcademicYear');


router.get('/', catchAsync(async (req, res, next) => {
    const listOfStudents = await (await Student.find({}).populate('parents').populate('classes').populate('revenue'));
    let numberOfBoys = numberOfGirls = activeStudents = transferredStudents = newAdmission = previousAdmission = new Number(0);
    let presentYr = await year.find({});
    presentYr = presentYr[0].year;
    for (let student of listOfStudents) {
        if(student.gender === 'Male' && student.current === 'Active') {
            numberOfBoys += 1;
        } else if (student.gender === 'Female' && student.current === 'Active') {
            numberOfGirls += 1;
        };
        if (student.current === 'Active'){
            activeStudents += 1;
        } else if (student.current === 'InActive') {
            transferredStudents += 1;
        };
        if (new Date(student.classes.DOJ).getFullYear() === presentYr){
            newAdmission +=1;
        } else if (new Date(student.classes.DOJ).getFullYear() === (presentYr - 1)){
            previousAdmission +=1;
        }
    };
    const numberData = {
        boys: numberOfBoys,
        girls: numberOfGirls,
        active: activeStudents,
        transfer: transferredStudents,
        admission: newAdmission,
        year: presentYr,
        lastyr: previousAdmission,
        tableIncrement: 1 
    };
    res.render('Students/studentsList', {students:listOfStudents, numberData});
}));

router.get('/json', catchAsync(async (req, res, next) => {
    const listOfStudents = await Student.find({current: 'Active'}).populate('parents').populate('classes').sort({ name: 'asc'});
    res.status(200).json({data: listOfStudents});
}));

router.get('/Tjson', catchAsync(async (req, res, next) => {
    const listOfStudents = await Student.find({current: 'InActive'}).populate('parents').populate('classes').sort({ name: 'asc'});
    res.status(200).json({data: listOfStudents});
}));

module.exports = router;