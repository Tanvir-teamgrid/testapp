const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Document Request Schema (created by HR or Manager)
const DocumentRequestSchema = new Schema({
  title: { type: String, required: true }, // Title of the document request (e.g., ID Proof)
  description: { type: String, required: true }, // Detailed description of the request
  requestedBy: { type: Schema.Types.ObjectId, ref: "users" }, // HR/Admin who requested the document
  employee: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Employee expected to submit the document
  format: { type: String, required: true },
  maxSize: { type: Number, required: true },
  dueDate: { type: Date, required: true }, // Deadline for submitting the document
  status: {
    type: String,
    enum: ["pending", "submitted", "approved", "rejected"],
    default: "pending", // Status of the request
  },
  createdAt: { type: Date, default: Date.now },
});

// Document Submission Schema
const DocumentSubmissionSchema = new Schema({
  documentRequestId: {
    type: Schema.Types.ObjectId,
    ref: "DocumentRequest",
    required: true,
  }, // The associated document request
  submittedBy: { type: Schema.Types.ObjectId, ref: "uers", required: true }, // Employee who submits the document
  filePath: { type: String, required: true }, // Path to the uploaded document file
  status: {
    type: String,
    enum: ["pending", "reviewed", "approved", "rejected"],
    default: "pending", // Status of the submission
  },
  feedback: { type: String }, // Optional feedback for rejection or approval comments
  reviewedAt: { type: Date }, // When the submission was reviewed
  reviewedBy: { type: Schema.Types.ObjectId, ref: "users" }, // HR/Admin who reviewed the submission
  createdAt: { type: Date, default: Date.now }, // When the submission was created
});

// Export both models
module.exports = {
  DocumentRequest: mongoose.model("DocumentRequest", DocumentRequestSchema),
  DocumentSubmission: mongoose.model(
    "DocumentSubmission",
    DocumentSubmissionSchema
  ),
};
