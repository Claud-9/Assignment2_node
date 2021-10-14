const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    username: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completion: { type: Number, required: true },
    date: { type: String, required: true }
});

module.exports = Todo = mongoose.model("Todo", todoSchema);