const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },  
    password: {
        type: String, 
        required: true
    }
},
{ timestamps: true});
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
