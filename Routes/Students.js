const express = require('express');
const {validateDB} = require('../utils/validateSchemas');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const Student = require('../Models/Students');
const Parent = require('../Models/Parents');
const Standard = require('../Models/Standards');
const Revenue = require('../Models/Revenue');
const ExpressError = require('../utils/ExpressError');
const {retireveRevenue} = require('../utils/RetrieveRev');
const Standards = require('../Models/Standards');
const ReportCard = require('../Models/ReportCard');
const schoolStandard = {class:['PreKG', 'LKG','UKG','I', 'II', 'III', 'IV', 'V'], sec:['A', 'B', 'C'], RTE:['No', 'Yes']};


router.get('/', (req, res) => {
    res.render('Students/NewEntry');
});

router.post('/', validateDB, catchAsync(async (req, res, next) => {
    const verifyAdmission = await Standard.find({admissionNumber: req.body.class.admissionNumber});
    if (verifyAdmission.length > 0) {
        throw new ExpressError('Admission Number entered already exist in DB (Admission number should be unique)!', 404);
    } else {
        const createStudent = new Student(req.body.student);
        const createParent = new Parent(req.body.parents);
        const createStandard = new Standard(req.body.class);
        const createMark = new ReportCard ({});
        const studentRevenue = await retireveRevenue(createStandard, 'POST');
        createStudent.parents = createParent;
        createStudent.classes = createStandard;
        createStudent.revenue = studentRevenue;
        createStudent.mark = createMark;
        await studentRevenue.save();
        await createStandard.save();
        await createStudent.save();
        await createMark.save();
        await createParent.save();
        res.redirect('/dashboard');
    };
}));

router.put('/:id', validateDB, catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const updateStudent = await Student.findByIdAndUpdate(id, req.body.student, {runValidators: true, new: true}).populate('parents').populate('classes');
    const updateParent = await Parent.findByIdAndUpdate(updateStudent.parents._id, req.body.parents, {runValidators: true, new: true});
    const updateClasses = await Standard.findByIdAndUpdate(updateStudent.classes._id, req.body.class, {runValidators: true, new: true});
    const updateRevenue = await Revenue.findByIdAndUpdate(updateStudent.revenue._id, await retireveRevenue(updateClasses, 'PUT'), {runValidators: true, new: true});
    res.redirect('/dashboard');
}));

router.delete('/delete/:id', catchAsync(async(req, res, next) => {
    const {id} = req.params;
    const removeStudent = await Student.findByIdAndDelete(id);
    res.redirect('/dashboard');
}));

router.get('/edit/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const retrieveStudent = await Student.findById(id).populate('parents').populate('classes');
    res.render('Students/Edit', {student:retrieveStudent, schoolStandard});
}));

router.get('/promote', catchAsync(async (req, res, next) => {
    res.render('Students/Promote');
}));

router.post('/promote', catchAsync(async (req, res, next) => {
    const classes = ['PreKG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V']
    const promotionList = req.body.list;
    let listOfIDs = promotionList.split(",");
    if(listOfIDs.length > 0) {
        listOfIDs.forEach(async (element) => {
            let retrieveStudent = await Student.findById(element).populate('classes').populate('revenue');
            const present = Number(classes.indexOf(retrieveStudent.classes.class));
            if (present == 7) {
                const transferStudent = await Student.findByIdAndUpdate(element, {current: 'InActive', DOL: new Date().toISOString().slice(0,10)});
            } else if (present < 7) {
                const updateExistingStandard = await Standards.findByIdAndUpdate(retrieveStudent.classes._id, {class:classes[(present + 1)]}, {runValidators: true, new: true});
                const updatedRevenue = await retireveRevenue(updateExistingStandard, 'PUT');
                const updateExistingRev = await Revenue.findByIdAndUpdate(retrieveStudent.revenue._id, updatedRevenue, {runValidators: true, new: true});
            }
        });
    }
    res.render('Students/Promote');
}));

module.exports = router;

