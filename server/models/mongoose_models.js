const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema(
  {
    taskId: { type: String, required: true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is required"],
      unique: true,
    },
    tasks: [TaskSchema],
    favoriteTasks: [TaskSchema],
    completedTasks: [TaskSchema],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
