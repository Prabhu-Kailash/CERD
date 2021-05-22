const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const Student = require('../Models/Students');
const ReportCard = require('../Models/ReportCard');
const { Router } = require('express');
const {isLoggedIn} = require('../utils/AuthMW');

router.get('/:studentID', isLoggedIn, catchAsync(async (req, res) => {
    const { studentID } = req.params;
    let student = await Student.findById(studentID).populate('mark');
    res.render('Students/Report', {student:student, report:student.mark == undefined ? studentMark : student.mark});
}));

router.post('/:studentID', isLoggedIn, catchAsync(async (req, res) => {
    const { studentID } = req.params;
    const retrieveStudent = await Student.findById(studentID).populate('mark');
    if (retrieveStudent.mark.heading != req.body.heading){
        var retireveMark = await ReportCard.findByIdAndUpdate(retrieveStudent.mark._id, {$set: {subjects: []}}, {new:true});
        var retireveMark = await ReportCard.findByIdAndUpdate(retrieveStudent.mark._id, {heading: req.body.heading, $push:{subjects: req.body.subjects}}, {new:true});
    } else if (retrieveStudent.mark.heading == req.body.heading) {
        var retireveMark = await ReportCard.findByIdAndUpdate(retrieveStudent.mark._id, {$push:{subjects: req.body.subjects}}, {new:true});
    };
    res.render('Students/Report' , {student:retrieveStudent, report:retireveMark});
}));

router.delete('/:studentID/:reportID', isLoggedIn, catchAsync(async (req, res) => {
    const { studentID, reportID } = req.params;
    const retrieveStudent = await Student.findById(studentID).populate('mark');
    const deleteReport = await ReportCard.findByIdAndUpdate(retrieveStudent.mark._id, {$pull:{subjects: {_id:reportID}}}, {new:true});
    res.render('Students/Report' , {student:retrieveStudent, report:deleteReport});
}))

router.delete('/:studentID', isLoggedIn, catchAsync(async (req, res) => {
    const { studentID } = req.params;
    const retrieveStudent = await Student.findById(studentID).populate('mark');
    const deleteReport = await ReportCard.findByIdAndUpdate(retrieveStudent.mark._id, {heading: undefined, $set: {subjects: []}}, {new:true});
    res.render('Students/Report' , {student:retrieveStudent, report:deleteReport});
}))

module.exports = router;