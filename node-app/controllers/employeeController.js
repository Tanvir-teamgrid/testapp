const Role = require('../models/role');
const User = require('../models/user-model');
const UserProfile = require('../models/userProfile');
const bcrypt = require('bcrypt');

class employeeController {
    static addEmployee = async (req, res) => {
        try {
            const { username, email, phone, roleId, firstName, lastName, dob, contactNumber } = req.body;
            if (!username || !email || !phone || !roleId) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash('employee@123', 10);
            const user = new User({
                email, phone, username, password: hashedPassword, roleId
            });
            const savedUser = await user.save();
            const userProfile = new UserProfile({
                firstName, lastName, dob, contactNumber, userId: user._id
            });
            await userProfile.save();
            res.status(201).json({ message: "Created successfully", userProfile, savedUser });
        } catch (error) {
            res.status(500).json({ message: "Error adding employee", error: error.message });
        }
    };

    static viewEmployee = async (req, res) => {
        try {
            const userId = req.params.id; // Assuming you are passing the user ID in the URL
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Employee not found" });
            }
            const userProfile = await UserProfile.findOne({ userId: user._id });
            res.status(200).json({ user, userProfile });
        } catch (error) {
            res.status(500).json({ message: "Error viewing employee", error: error.message });
        }
    };

    static viewAllEmployees = async (req, res) => {
        try {
            const users = await User.find().populate('roleId', 'roleName'); // Optionally populate role details
            const userProfiles = await UserProfile.find();
    
            // Combine users with their profiles
            const allEmployees = users.map(user => {
                const profile = userProfiles.find(profile => profile.userId.toString() === user._id.toString());
                return {
                    user,
                    userProfile: profile || null  
                };
            });
    
            res.status(200).json(allEmployees);
        } catch (error) {
            res.status(500).json({ message: "Error viewing all employees", error: error.message });
        }
    };

    static deleteEmployee = async (req, res) => {
        try {
            const userId = req.params.id;  
            
           
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Employee not found" });
            }
            
            
            await UserProfile.deleteOne({ userId: user._id });

            // Delete the user
            await User.deleteOne({ _id: userId });

            res.status(200).json({ message: "Employee deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting employee", error: error.message });
        }
    }
}

module.exports = employeeController;
