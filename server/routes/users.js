const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/:id?', async (req, res) => {
    const { id } = req.params;

    if (id) {
        try {
            const user = await User.findById(id).select('-password');

            res.status(200).send(user);
        } catch (error) {
            res.status(404).json({
                message: 'A user with that ID does not exist',
            });
        }
    } else {
        try {
            const users = await User.find().select('-password');
            const userCount = users.length;

            res.status(200).json({
                userCount,
                users,
            });
        } catch (error) {
            res.status(500).json({
                message: 'There was an error retrieving the users',
            });
        }
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    User.findByIdAndDelete(id)
        .then((user) => {
            if (user) {
                res.status(200).json({
                    user,
                    message: 'User successfully deleted',
                });
            }
        })
        .catch(() => {
            res.status(400).json({
                message: 'There was an error deleting the user',
            });
        });
});

module.exports = router;
