require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const { email, password } = req.body;

        try {
            if (await User.findOne({ email: email })) throw new Error('Email already exists');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                email: email,
                password: hashedPassword
            });

            res.status(201).json({ user: user });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email: email });
            if (!user) throw new Error('User not found');

            const match = await bcrypt.compare(password, user.password);
            if (!match) throw new Error('Invalid email/password');


            jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5m' },
                (err, token) => {
                    if (err) {
                        throw new Error('Invalid email/password');
                    } else {
                        res.status(200).json({ token: token });
                    }
                });
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json({ userId: req.token, users: users });
        } catch (error) {
            res.status(403).json({ error: error })
        }
    }

}