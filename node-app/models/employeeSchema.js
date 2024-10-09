const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the User schema
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    hireDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "terminated"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to the user who created this employee (typically the admin or HR)
      required: true,
    },
    archived: { type: Boolean, default: false }, // New field
    address: {
      type: String, // Optional field to store employee address
    },
    phone: {
      type: String, // Optional field for employee phone number
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employees", employeeSchema);
