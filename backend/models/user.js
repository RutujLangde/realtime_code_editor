import { Schema, Model, model } from "mongoose";
import { randomBytes, createHmac } from "crypto";
import { createTokensForUsers } from '../services/authentication.js'

const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '../public/images/defaultavatar.png'
    }
}, { timestamps: true });

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    const salt = randomBytes(16).toString('hex');
    const hash = createHmac('sha256', salt)
        .update(this.password)   // hash plain text only once
        .digest('hex');

    this.salt = salt;
    this.password = hash;
    next();
});


userSchema.static('matchPasswordandGenrateToken', async function (email, password) {

    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('User not define');
        return;
    }

    const salt = user.salt;
    const hashedpassword = user.password;

    const hash = createHmac('sha256', user.salt)
        .update(password)   // plain text from login request
        .digest('hex');

    if (user.password !== hash) {
        throw new Error('Invalid credentials');
        return;
    }

    const token = createTokensForUsers(user);

    return token;



})

const User = model("user", userSchema);

export default User;