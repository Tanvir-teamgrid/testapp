const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveTypeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  accrualPolicy: { type: String }, // Description of accrual rules
  allocatedLeaves: { type: Number },
});

const LeaveType = mongoose.model("leave_types", leaveTypeSchema);

module.exports = LeaveType;
