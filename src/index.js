const express = require("express");
require("./db/mongoose.js");
const User = require("./models/user.js");
const Task = require("./models/task.js");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("started");
})

app.post("/users", (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((err) => res.status(400).send(err));

});

app.get("/users", (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((err) => res.status(500).send(err));
});

app.get("/users/:id", (req, res) => {
    const _id=req.params.id;
    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send(user);
    }).catch((err) => res.status(500).send(err));

})

app.post("/tasks", (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch((err) => res.status(400).send(err));
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server was started on port ${port}`);
});