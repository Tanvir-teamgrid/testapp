const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String, // URL for the organization logo
    },
    email: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    superAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // The user who created the organization, aka the super admin
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("organizations", organizationSchema);
