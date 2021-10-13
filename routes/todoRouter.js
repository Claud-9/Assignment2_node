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
    
        // validate
        if (!username || !title || !date || !description) {
            return res.status(400).json({ msg: "Not all fields have been entered." });
        } else {
            const existingUser = await User.findOne({ username: username });

            if (!existingUser) {
                return res
                .status(400)
                .json({ msg: "An account with this Clinic ID does not exists." });
            } else {
                const newTodo = new Todo({
                    username,
                    title,
                    description,
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

module.exports = todoRouter;