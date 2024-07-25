const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


//register a new user
router.post('/register', async (req,res) => {
    const data = req.body;
    try{
        const existingUser = await User.findOne({ email: data.email });
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(data.password,10);
        data.password = hashedPassword;

        const register = await User.create(data);
        res.status(201).json({ message: 'User registered successfully!'});

    }catch(error){
        res.status(500).json({message: 'Server Error'});
    }
});

//login a user
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({ email: email});
        if(!user){
            return res.status(400).json({ message: 'Invalid email'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Incorrect password or email"});
        }
        //generate a jwt token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({ token });

;    }catch (error) {
    res.status(500).json({ message: 'Server error' });
}
});

// Example protected route
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;