const joi = require('joi');
const ExpressError = require('../utils/ExpressError');

ValidateStudentsSchema = joi.object({
    student: joi.object({
        name: joi.string().required(),
        aadhar: joi.number().unsafe().required(),
        DOB: joi.date().iso().required(),
        gender: joi.string().valid('Male', 'Female').required(),
        religion: joi.string(),
        caste: joi.string()
    }),
    parents: joi.object({
        fatherName: joi.string().required(),
        motherName: joi.string().required(),
        mainContact: joi.number().integer().max(9999999999).required(),
        alternateContact: joi.number().integer().max(9999999999),
        doorNumber: joi.string(),
        streetName: joi.string(),
        cityName: joi.string(),
        pincode: joi.number() 
    }),
    class: joi.object({
        class: joi.string().valid('PreKG', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V').required(),
        section: joi.string().valid('A', 'B', 'C').required(),
        admissionNumber: joi.number().unsafe().required(),
        DOJ: joi.date().iso().required(),
        RTE: joi.string().valid('No', 'Yes').required()
    })
});

ValidateIncomeSchema = joi.object({
    particulars: joi.string().required(),
    PreKG: joi.number().required(),
    LKG: joi.number().required(),
    UKG: joi.number().required(),
    I: joi.number().required(),
    II: joi.number().required(),
    III: joi.number().required(),
    IV: joi.number().required(),
    V: joi.number().required(),
    academicYear: joi.number().required()
});

module.exports.validateDB = (req, res, next) => {
    const { error } = ValidateStudentsSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(' ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

module.exports.validateIncome = (req, res, next) => {
    const { error } = ValidateIncomeSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(' ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};