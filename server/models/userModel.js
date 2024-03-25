//Imports
import mongoose from 'mongoose';

//Define Mongoose schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

//Create and export user model based on schema
const User = mongoose.model('User', userSchema);
export default User;