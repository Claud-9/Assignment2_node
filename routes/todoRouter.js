const todoRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const Todo = require("../models/todoModel");
const User = require("../models/userModel");
const auth = require("../middleware/auth");

todoRouter.post("/", auth, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        // validate
        if (!username || !password) {
            return res.status(400).json({ msg: "Not all required fields have been entered!" });
        } else {
            const existingUser = await User.findOne({ username: username });

            if (!existingUser) {
                return res
                .status(400)
                .json({ msg: "An account with this Username does not exists!" });
            } else {
                const passwordMatch = await bcrypt.compare(password, existingUser.password);
                if (!passwordMatch) {
                    return res
                    .status(400)
                    .json({ msg: "Not Authorized!" });
                } else {
                    await Todo.find({ username: username })
                    .then((todos) => res.json(todos))
                    .catch((err) => res.status(400).json(err));
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

todoRouter.post("/create", auth, async (req, res) => {
    try {
        const username = req.body.username;
        const title = req.body.title;
        const description = req.body.description;
        const date = req.body.date;
        const completion = 0;
    
        // validate
        if (!username || !title || !date || !description) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        } else {
            const existingUser = await User.findOne({ username: username });

            if (!existingUser) {
                return res
                .status(400)
                .json({ msg: "An account with this username does not exists." });
            } else {
                const newTodo = new Todo({
                    username,
                    title,
                    description,
                    completion,
                    date
                });
                const savedTodo = await newTodo.save()
                .then(() => {
                    res.json('Todo created!');
                })
                .catch(err => res.status(400).json(err));
            }
        }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

todoRouter.post("/update", auth, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const id = req.body._id;

        if (!username || !password || !id) {
            return res.status(400).json({ msg: "Not all the required fields have been entered!" });
        } else {
            const existingUser = await User.findOne({ username: username });

            if (!existingUser) {
                return res
                .status(400)
                .json({ msg: "An account with this username does not exists!" });
            } else {
                const passwordMatch = await bcrypt.compare(password, existingUser.password);

                if (!passwordMatch) {
                    return res
                    .status(400)
                    .json({ msg: "Not Authorized!" });
                } else {
                    Todo.findByIdAndUpdate(id)
                    .then((todo) => {
                        todo.completion = 1;
                        todo.save()
                        .then(() => res.json('Successfully Marked As Completed!'))
                        .catch(err => res.status(400).json(err));
                    })
                    .catch(err => res.status(400).json(err));
                }
            }
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = todoRouter;