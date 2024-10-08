const mongoose = require('mongoose');
const leaveSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    leaveTypeId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'leave_types',
        required:true,
    },
    startDate:{
        type:Date,
        required:true,

    },
    endDate:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:['pending','approved','rejected','cancelled'],
        default:'pending,'
    },
});