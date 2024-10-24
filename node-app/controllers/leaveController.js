const { default: mongoose } = require("mongoose");
const Leave = require("../models/leaveSchema");
const User = require("../models/user-model");
const EmployeeLeaveAllocation = require("../models/employeeLeaveAllocation");
class leaveController {
  static createLeaveRequest = async (req, res) => {
    const {
      employee,
      leaveType,
      startDate,
      endDate,
      reason,
      supportingDocuments,
    } = req.body;

    try {
      const leaveRequest = new Leave({
        employee,
        leaveType,
        startDate,
        endDate,
        reason,
        supportingDocuments,
      });

      await leaveRequest.save();
      res
        .status(201)
        .json({ message: "Leave request created successfully", leaveRequest });
    } catch (err) {
      console.error("Error creating leave request:", err);
      res.status(500).json({ error: "Error creating leave request" });
    }
  };

  // static    approveLeaveRequest = async (req, res) => {
  //         const { leaveId } = req.params;
  //         const { managerComments } = req.body;

  //         try {
  //             const leaveRequest = await Leave.findById(leaveId).populate('employeeId').populate('leaveTypeId');

  //             if (!leaveRequest) {
  //                 return res.status(404).json({ message: 'Leave request not found' });
  //             }

  //             leaveRequest.status = 'approved';
  //             leaveRequest.managerComments = managerComments;
  //             await leaveRequest.save();

  //             // const user = leaveRequest.employeeId;
  //             const allocatedLeaves = leaveRequest.leaveTypeId.allocatedLeaves;
  //             if(allocatedLeaves == undefined || allocatedLeaves==null)
  //                 {
  //                     return res.status(400).json({message:"allocated leaves is not defined for this leavve type"});

  //                 }
  //               const leaveDays = this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate); // Update the leave balance

  //               if(leaveDays > allocatedLeaves)
  //               {
  //                 return res.status(400).json({message:"  insufficient allocated  leaves "});
  //               }
  //               allocatedLeaves -= leaveDays;
  //               leaveRequest.leaveTypeId.allocatedLeaves = allocatedLeaves;

  //               await leaveRequest.leaveTypeId.save();

  //             res.status(200).json({ message: 'Leave request approved', leaveRequest });
  //         } catch (err) {
  //             console.error('Error approving leave request:', err);
  //             res.status(500).json({ error: 'Error approving leave request' });
  //         }
  //     };

  static approveLeaveRequest = async (req, res) => {
    const { leaveId } = req.params;
    const { managerComments } = req.body;

    try {
      const leaveRequest = await Leave.findById(leaveId)
        .populate("employee")
        .populate("leaveType");

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      console.log("Leave Request:", leaveRequest);

      if (!leaveRequest.employee || !leaveRequest.leaveType) {
        return res.status(400).json({
          message: "Employee or leave type data is missing for this request",
          leaveId,
        });
      }

      leaveRequest.status = "approved";
      leaveRequest.managerComments = managerComments;

      const leaveDays = leaveController.calculateLeaveDays(
        leaveRequest.startDate,
        leaveRequest.endDate
      );

      const employeeLeaveAllocation = await EmployeeLeaveAllocation.findOne({
        employeeId: leaveRequest.employee._id,
        leaveTypeId: leaveRequest.leaveType._id,
      });

      if (!employeeLeaveAllocation) {
        return res
          .status(400)
          .json({ message: "No leave allocation found for this employee" });
      }

      const remainingLeaves =
        employeeLeaveAllocation.allocatedLeaves -
        employeeLeaveAllocation.usedLeaves;
      if (leaveDays > remainingLeaves) {
        return res
          .status(400)
          .json({ message: "Insufficient allocated leaves" });
      }

      employeeLeaveAllocation.usedLeaves += leaveDays;

      await leaveRequest.save();
      await employeeLeaveAllocation.save();

      res
        .status(200)
        .json({ message: "Leave request approved successfully", leaveRequest });
    } catch (error) {
      console.error("Error approving leave request:", error);
      res.status(500).json({
        message: "Error approving leave request",
        error: error.message,
      });
    }
  };

  // Helper function to calculate leave days

  static rejectLeaveRequest = async (req, res) => {
    try {
      const { leaveId } = req.params;
      const { managerComments } = req.body;
      const leaveRequest = await Leave.findById(leaveId).populate("employeeId");

      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      leaveRequest.status = "rejected";
      leaveRequest.managerComments = managerComments;
      await leaveRequest.save();

      res.status(200).json({ message: "Leave request rejected", leaveRequest });
    } catch (error) {
      console.error("Error approving leave request:", err);
      res.status(500).json({
        message: "Error approving leave request",
        error: error.message,
      });
    }
  };

  static calculateLeaveDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end date
    return diffDays;
  }

  static viewLeave = async (req, res) => {
    try {
      const organizationId =
        req.user?.organizationId || req.body.organizationId;

      if (!organizationId) {
        return res.status(404).json({ message: "Organization ID is missing" });
      }

      // Convert organizationId to ObjectId for the query
      const validOrganizationId = new mongoose.Types.ObjectId(organizationId);

      const leaveRequest = await Leave.find().populate({
        path: "employeeId",
        select: "name organizationId",
        match: { organizationId: validOrganizationId },
      });

      return res.status(200).json({
        message: "Leave requests retrieved successfully",
        info: leaveRequest,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error retrieving data", error: error.message });
    }
  };

  static getLeaveRequest = async (req, res) => {
    let id = req.params.id;
    try {
      // Find the leave request by ID and populate related fields
      const leaveRequest = await Leave.findById(id)
        .populate("employee")
        .populate("leaveType");

      // Check if the leave request was found
      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }

      // Return the leave request details
      res.status(200).json({ leaveRequest });
    } catch (error) {
      console.error("Error retrieving leave request:", error);
      res.status(500).json({
        message: "Error retrieving leave request",
        error: error.message,
      });
    }
  };
}

module.exports = leaveController;
