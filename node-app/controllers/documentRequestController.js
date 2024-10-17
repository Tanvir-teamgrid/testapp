const {
  DocumentRequest,
  DocumentSubmission,
} = require("../models/documentSchema");

const path = require("path");
const BASE_URL = process.env.BASE_URL;
const upload_URL = `${BASE_URL}images/`;

class DocumentRequestController {
  // Create a new document request
  static async createDocumentRequest(req, res) {
    try {
      const { title, description, employee, format, maxSize, dueDate } =
        req.body;

      const newRequest = new DocumentRequest({
        title,
        description,
        requestedBy: req.user._id, // assuming JWT middleware adds req.user (HR/Admin)
        employee,
        format,
        maxSize,
        dueDate,
      });

      await newRequest.save();
      return res.status(201).json({
        message: "Document request created successfully",
        request: newRequest,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Get all document requests for an employee (for the employee to see their requests)
  static async getEmployeeDocumentRequests(req, res) {
    try {
      const requests = await DocumentRequest.find({
        employee: req.user.id, // assuming employee is authenticated
      }).populate("requestedBy");
      return res.status(200).json(requests);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Update a document request (HR/Admin only)
  static async updateDocumentRequest(req, res) {
    try {
      const { id } = req.params; // document request ID
      const { title, description, format, maxSize, dueDate } = req.body;

      const updatedRequest = await DocumentRequest.findByIdAndUpdate(
        id,
        {
          title,
          description,
          format,
          maxSize,
          dueDate,
        },
        { new: true } // Return the updated document request
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Document request not found" });
      }

      return res.status(200).json({
        message: "Document request updated successfully",
        request: updatedRequest,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Delete a document request (HR/Admin only)
  static async deleteDocumentRequest(req, res) {
    try {
      const { id } = req.params; // document request ID

      const deletedRequest = await DocumentRequest.findByIdAndDelete(id);

      if (!deletedRequest) {
        return res.status(404).json({ message: "Document request not found" });
      }

      return res.status(200).json({ message: "Document request deleted" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Employee submits a document in response to a request
  static async submitDocument(req, res) {
    try {
      const { documentRequestId } = req.params; // Request ID

      // req.file contains information about the uploaded file
      const filePath = req.file.path; // Path to the uploaded file
      const upload_URL = `${process.env.BASE_URL}images/${path.basename(
        filePath
      )}`; // Generate the accessible URL

      const submission = new DocumentSubmission({
        documentRequestId,
        submittedBy: req.user.id, // Use req.user.id from auth middleware
        filePath: upload_URL, // Save the file path to the database
        status: "pending", // Default status when submitted
      });

      await submission.save();
      return res.status(201).json({
        message: "Document submitted successfully",
        submission,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Get all submissions for an HR to review (HR/Admin only)
  static async getSubmissionsForReview(req, res) {
    try {
      const submissions = await DocumentSubmission.find({
        status: "pending", // Only fetch submissions that are pending review
      }).populate("submittedBy documentRequestId");

      return res.status(200).json(submissions);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // HR/Admin reviews and updates the submission status (approve/reject)
  static async reviewSubmission(req, res) {
    try {
      const { submissionId } = req.params;
      const { status, feedback } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be 'approved' or 'rejected'.",
        });
      }

      const updatedSubmission = await DocumentSubmission.findByIdAndUpdate(
        submissionId,
        {
          status,
          feedback,
          reviewedAt: Date.now(),
          reviewedBy: req.user._id, // assuming HR/Admin is authenticated
        },
        { new: true }
      );

      if (!updatedSubmission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      return res.status(200).json({
        message: `Document submission ${status} successfully`,
        submission: updatedSubmission,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }

  // Get all document requests made by HR/Admin (HR/Admin only)
  static async getAllDocumentRequests(req, res) {
    try {
      const requests = await DocumentRequest.find({
        requestedBy: req.user._id, // assuming HR/Admin is authenticated
      }).populate("employee");

      return res.status(200).json(requests);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }
}

module.exports = DocumentRequestController;
