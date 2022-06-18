const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/users');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');

//Resgister a new User  => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });
        sendToken(user, 200, res);
    }
    catch (error) {
        // return next(new ErrorHandler(error.message || "Internal server error.", 500));
        res.status(500).send({
            message: error.message || "Internal server error."
        });
    }
});


// Login user => api/v1/login
exports.loginuser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    //Check if email or password is entered by user
    if (!email || !password) {
        res.status(400).send({
            message: 'Please enter Password & email.'
        });
    }

    const user = await User.findOne({ email }).select('password');

    if (!user) {
        res.status(401).send({
            message: 'Invalid Email or password.'
        });
    }
    const ispasswordMathced = await user.comparePassword(password);
    if (!ispasswordMathced) {
        res.status(401).send({
            message: 'Invalid Email or password.'
        });
        // Use below only for development purpose
        // return next(new ErrorHandler('Invalid Email or password.', 401));
    }
    sendToken(user, 200, res);
});