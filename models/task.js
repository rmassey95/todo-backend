const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema({
  title: { type: String, required: true, minLength: 3, trim: true },
  dueDate: { type: String },
  priority: {
    type: String,
    enum: ["low", "med", "high", "none"],
    required: true,
  },
  label: { type: String, trim: true },
  proj: { type: String, trim: true },
  desc: { type: String, trim: true },
  completed: { type: Boolean, default: false, required: true },
  recurring: { type: Boolean, default: false, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Task", TaskSchema);
