const mongoose = require("mongoose");
const { Schema } = mongoose;

// Import User and UserProfile models
const User = require("../models/user-model");
const UserProfile = require("../models/userProfile");

const EmployeeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "userprofiles",
      required: true,
    },
    department: { type: String, required: true }, // New field for employee's department
    position: { type: String, required: true }, // New field for employee's position
    hireDate: { type: Date, required: true }, // New field for hire date
    salary: { type: Number, required: true }, // New field for employee's salary
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Export the Employee model
module.exports = mongoose.model("employees", EmployeeSchema);
