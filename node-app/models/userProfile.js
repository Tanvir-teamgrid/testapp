const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees", // Reference to the Employee schema
      required: true,
    },
    address: {
      fullAddress: { type: String, required: true },
    },
    dob: {
      type: Date,
      required: true, // Date of birth
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      required: true,
    },
    image: {
      type: String, // URL of the uploaded profile image
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userprofiles", profileSchema);
