//Import Express for router, Bcrypt for password hashing, JWT for auth
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//Import user model and JWT Secret
import User from '../models/userModel.js';
import JWT_SECRET from '../config.js';

//Create instance of Express router
const router = express.Router();

//REGISTER
router.post("/register", async (request, response) => {
    try {
        const { username, password } = request.body;

        //Validate fields not empty
        if (!username || !password) {
            return response.status(400).json({ msg: "Please enter username AND password" });
        }
        //Check password length
        if (password.length < 5) {
            return response.status(400).json({ msg: "Password must be at least 5 characters" });
        }
        //Check username not already taken
        const existingUsername = await User.findOne({ username: username });
        if (existingUsername) {
            return response.status(400).json({ msg: "Username is already taken" });
        }

        //Hash password with Bcrypt for security
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //Use hashed password for new user
        const newUser = new User({
            username: username,
            password: passwordHash,
        });
        const savedUser = await newUser.save();
        //Success msg
        response.json(savedUser);

    } catch (error) {
        console.error('Error registering user:', error);
        response.status(500).json({ err: error.message });
    }
});

//Export router
export default router;

//LOG IN
router.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;

        //Validate fields not empty
        if (!username || !password) {
            return response.status(400).json({ msg: "Please enter username AND password" });
        }
        //Check entered username vs database stored username
        const user = await User.findOne({ username: username });
        if (!user) {
            return response.status(400).json({ msg: "Incorrect username" });
        }
        //Check entered password vs database stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return response.status(400).json({ msg: "Incorrect password" });
        }

        //Create JsonWebToken by passing user ID and JWT secret
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3d' }); 
        //Set JWT as cookie, expiring in 3 days
        response.cookie('token', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        response.json({
            token, user: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (error) {
        response.status(500).json({ err: error.message });
    }
});

//CHECK IF USER ALREADY LOGGED IN


//LOG OUT
//Clear cookie token