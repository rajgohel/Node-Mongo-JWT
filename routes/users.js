const express = require('express');
const router = express.Router();
const authToken = require("../middlewares/authToken");
const { getUsers } = require('../controllers/usersController');

router.route('/users', authToken).get(getUsers);

module.exports = router;