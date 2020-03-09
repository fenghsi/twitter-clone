const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    email:{
        type:String,
        required: true,
        unique: true
    },
    verified:Boolean,
    key:String,
    followers: [String],
    following: [String]
});

userSchema.methods.validPassword = function(password) {
    return password === this.password;
};

userSchema.methods.validKey = function(key) {
    return key === this.key;
};

module.exports = mongoose.model('User', userSchema);