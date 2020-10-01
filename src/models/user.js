const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.virtual("tasks",{
    ref:"Task",
    localField:"_id",
    foreignField:"owner"
})

const privateKey = `MIICXgIBAAKBgQCHYw4zQtMKbyr3Fh4aahIY/Y7eDsCef91UvxMU1RLEhLZl1Ojt
avSjLOslK6Y6wFbjW4pjvJVBf02QeoROVXceG5IziwbeZSeOVTt0pFeZXiY3fEF5
Fw9Tbmt0zUHI2pzU6APLjrYJhbx5jslcVh11VOeeAP2P7jkXgqCj9PoO+wIDAQAB
AoGAJZy4UjdraAewWQq0/EOhmX2/1iMlEiOVuriGtY/ocd4oyiuXNnYzVq3g+eeh
e8r5mJpS3RiEIrkaNFxFK3oE6FnCY31hfNMWC2GeTfmIeC00r9ZrEyYDcQXTD5k5
Q5nq0eX3zFCuiihkU46ImulREmI8+nJEcqSwhtgCCS47v8ECQQDFmMO0P8eoJH8D
DDZHP3wbIFtphm/0zJqNLgaF1HeRIfqcC6Vij4SqiSSJGZr8nmLBDPtzgMRnwdDk
TAWWAUyhAkEAr2cpZiOeRhNn2dEZnJlu3A9AYSW7qLoqdQA4J/KLISX8aRtlFilu
h3L/uA5cv2SrzggKdN5179jgZBRYZuq6GwJBALeyiKZG8ReZLlcoAEIGfBs/3pvg
9q4vlLMRidDbMHlFjJWLoipZ4G0maEfo/RRDLu3oYtADcxQ+tDO5lSvac2ECQQCF
5xxcpA5c8s2SJCYIPb26802znCmxukVVQpCcNnXuHWCfING/5GtDrg/4A8bcOc9K
nyrUY0vniUpsPHfsQX9HAkEAtLDFP12RskuGxA/8MiFHSe+iN3+prRt+MCLm+7JO
NbgxyWleAbnNqHrA2xbQIv2yn80moxZUAopFO/zzmRfEQw==`
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email
    });
    if (!user) throw new Error("Email isn't already exists");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email or password doesn't match");
    return user;
}


userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, privateKey);
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens

    return userObject;
}

const User = mongoose.model("User", userSchema);;

module.exports = User;