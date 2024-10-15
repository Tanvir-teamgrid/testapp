const Leave = require('../models/leaveSchema');  
const User = require('../models/user-model');  
class leaveController {
   
  static  createLeaveRequest = async (req, res) => {
        const { employeeId, leaveTypeId, startDate, endDate, reason, supportingDocuments } = req.body;

        try {
            const leaveRequest = new Leave({
                employeeId,
                leaveTypeId,
                startDate,
                endDate,
                reason,
                supportingDocuments,
            });

            await leaveRequest.save();
            res.status(201).json({ message: 'Leave request created successfully', leaveRequest });
        } catch (err) {
            console.error('Error creating leave request:', err);
            res.status(500).json({ error: 'Error creating leave request' });
        }
    }

     
static    approveLeaveRequest = async (req, res) => {
        const { leaveId } = req.params;  
        const { managerComments } = req.body;

        try {
            const leaveRequest = await Leave.findById(leaveId).populate('employeeId');

            if (!leaveRequest) {
                return res.status(404).json({ message: 'Leave request not found' });
            }

            
            leaveRequest.status = 'approved';
            leaveRequest.managerComments = managerComments;
            await leaveRequest.save();

            
            const user = leaveRequest.employeeId;  
            user.allocatedLeaves -= this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate); // Update the leave balance
            await user.save();

            res.status(200).json({ message: 'Leave request approved', leaveRequest });
        } catch (err) {
            console.error('Error approving leave request:', err);
            res.status(500).json({ error: 'Error approving leave request' });
        }
    };

    
    static calculateLeaveDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the end date
        return diffDays;
    };
    static viewLeave = async (req,res) => {
        try {
            const organizationId = req.user.organizationId;
            const leaveRequest = await Leave.find().populate({
                path:'employeeId',
                select:'name organizationId',
                match: {organizationId}
            });
            res.status(201).json({message:" leave request retrive successfully",info:leaveRequest});

            
        } catch (error) {
            res.status(500).json({message:"error retireving data"})
            
        }
        
    };
}

module.exports = leaveController;