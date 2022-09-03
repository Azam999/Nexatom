const express = require('express');
const logger = require('morgan');
const router = express.Router();
const cors = require('cors');
const mongoose = require('mongoose')

// Set up dotenv
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

app.use('/api', router);
app.use('*', (req, res) => {
    res.status(404).send({
        message: 'Not Found',
    });
});

module.exports = app;