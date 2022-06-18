const express = require('express');
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const ErrorHandler = require('./utils/errorHandler');
const connectDatabase = require('./config/database');

app.use(cors(corsOptions));
app.use(express.json());
dotenv.config({ path: './config/config.env' });

var corsOptions = {
    origin: process.env.LOCAL_REQ_URL
};
process.on('uncaughtException', error => {
    console.log(`Error:${error.message}`);
    console.log('Sutting Down the serve due to uncaught Exception.');
    process.exit(1);
});

connectDatabase();

const auth = require('./routes/auth');
const users = require('./routes/users');
const authToken = require("./middlewares/authToken");
app.use('/api/v1', auth);
app.use('/api/v1', authToken, users);

//Handle unhable route
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found.`, 404));
});

const PORT = process.env.PORT;
const server = app.listen(3000, (req, res) => {
    console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});

process.on('unhandledRejection', err => {
    console.log(`Error:${err.message}`);
    console.log('Sutting Down the serve due to Unhandled promisr rejection.');
    server.close(() => {
        process.exit(1);
    });
});