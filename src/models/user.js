const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
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

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})
const User = mongoose.model("User", userSchema);

module.exports = User;