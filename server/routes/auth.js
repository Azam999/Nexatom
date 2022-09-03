const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    const { name, email, password, githubUsername, stackoverflowUrl, image, experience, timezone, languages, majors } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        email,
        password: hash,
        githubUsername,
        stackoverflowUrl,
        image,
        experience,
        timezone, 
        languages,
        majors
    });

    newUser.save().then((userInfo) => {
        const jwtPayload = {
            _id: userInfo._id,
        };

        const accessToken = jwt.sign(jwtPayload, process.env.JWT_KEY, {
            expiresIn: '30d',
        });

        res.status(201).send({
            user: {
                _id: userInfo._id,
                name: userInfo.name,
                email: userInfo.email,
                githubUsername: userInfo.githubUsername,
                stackoverflowUrl: userInfo.stackoverflowUrl,
                image: userInfo.image,
                experience: userInfo.experience,
                timezone: userInfo.timezone,
                languages: userInfo.languages,
                majors: userInfo.majors
            },
            accessToken,
            message: 'User Created',
            auth: true,
        });
    });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        if (!email) {
            return res.status(401).json({
                message: 'Please enter an email',
                code: res.statusCode,
            });
        } else if (!password) {
            return res.status(401).json({
                message: 'Please enter a password',
                code: res.statusCode,
            });
        } else {
            return res.status(401).json({
                message: 'Please enter both the email and password',
                code: res.statusCode,
            });
        }
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            message: 'An account with that email does not exist',
            code: res.statusCode,
        });
    }

    const passwordVerified = await bcrypt.compare(password, user.password);

    const jwtPayload = {
        _id: user._id,
    };

    if (passwordVerified) {
        const accessToken = jwt.sign(jwtPayload, process.env.JWT_KEY, {
            expiresIn: '30d',
        });

        res.status(201).send({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                githubUsername: user.githubUsername,
                stackoverflowUrl: user.stackoverflowUrl,
                image: user.image,
                experience: user.experience,
                timezone: user.timezone,
                languages: user.languages,
                majors: user.majors
            },
            accessToken,
            message: 'Authenticated',
            auth: true,
        });
    } else {
        res.status(401).json({
            message: 'Not Authenticated',
            auth: false,
        });
    }
});

module.exports = router;