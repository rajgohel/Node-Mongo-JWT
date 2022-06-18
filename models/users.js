const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter valid Email Address'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid Email Address.']
    },
    role: {
        type: String,
        enum: ['user', 'employeer'],
        message: 'Please select correct role.',
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please enter password  for your account.'],
        minlength: [8, 'Your password mustbe at least 8 characters long'],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    restPasswordToken: String,
    restPasswordExpire: Date

});

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWET_EXPIRES_TIME })
}

userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);