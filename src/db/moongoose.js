const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const User = mongoose.model("User", {
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

const me = new User({
  name: "Khanh",
  email: "khanhphu2608@gmail.com",
  password: "xxxxxxx",
  age: 22,
});

me.save()
  .then(() => {
    console.log(me);
  })
  .catch((err) => {
    console.log(err);
  });

const Task = mongoose.model("Task", {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// const task = new Task({
//     description: "Learn Mongoose Library",
//     completed: false
// });

// task.save().then(() => {
//     console.log(task);
// }).catch((err) => {
//     console.log(err);
// })
