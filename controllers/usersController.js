const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const User = require('../models/users');

// Get users => api/v1/users
exports.getUsers = catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find();
        if (users) res.send(users);
    }
    catch (err) {
        res.status(500).send({
            message: err.message || "Internal server error."
        });
    }
});