const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }
});

module.exports = Todo = mongoose.model("Todo", todoSchema);