//Import Express for router, Bcrypt for password hashing
import express from 'express';
import bcrypt from 'bcrypt';
//Import user model
import User from '../models/userModel.js';

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