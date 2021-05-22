const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocal = require('passport-local-mongoose');


const userSchema = new Schema({
    responsibility: {
        type: String,
        enum: ['Admin', 'Staff'],
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model('User', userSchema);