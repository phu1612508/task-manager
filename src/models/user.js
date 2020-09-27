const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                return new Error("Password cannot contain password");
            }
        },
    },
    age: {
        type: Number,
    },
});

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if (!user) throw new Error("Email isn't already exists");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email or password doesn't match");
    // console.log(user);
    return user;
}


userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})
const User = mongoose.model("User", userSchema);;

module.exports = User;