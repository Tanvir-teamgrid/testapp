const Job = require("../models/job-model");
const upload = require("../middleware/fileUploads");

const BASE_URL = "http://localhost:8080/";
const upload_URL = `${BASE_URL}images/`;

class JobController {
  // Handle file upload
  static handleFileUpload = (req, res, next) => {
    upload.single("companyLogo")(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(400).json({ message: "Error uploading file" });
      }
      next();
    });
  };

  // Post a new job
  static postJob = async (req, res) => {
    try {
      // Handle file upload first
      JobController.handleFileUpload(req, res, async () => {
        const {
          title,
          companyName,
          salaryRange,
          jobType,
          description,
          responsibilities,
          skills,
          experienceLevel,
          contactEmail,
          websiteUrl,
        } = req.body;

        const city = req.body['location.city'];
        const country = req.body['location.country'];

        if (!city || !country) {
          return res.status(400).json({ message: "City and country are required." });
        }

        if (!companyName || !salaryRange || !jobType || !description || !experienceLevel || !contactEmail) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        const newJob = new Job({
          title,
          companyName,
          companyLogo: req.file ? `${upload_URL}${req.file.filename}` : undefined,
          location: { city, country },
          salaryRange,
          jobType,
          description,
          responsibilities,
          skills,
          experienceLevel,
          contactEmail,
          websiteUrl,
        });

        try {
          const savedJob = await newJob.save();
          res.status(201).json({ message: "Job created successfully", job: savedJob });
        } catch (err) {
          console.error("Database Error:", err);
          res.status(500).json({ message: "Error saving job", error: err.message });
        }
      });
    } catch (err) {
      console.error("Error creating job:", err);
      res.status(500).json({ message: "Error creating job", error: err.message });
    }
  };

  // View all jobs
  static viewJobs = async (req, res) => {
    try {
      const jobs = await Job.find(); // Fetch all jobs from the database
      res.status(200).json(jobs); // Send the jobs as a response
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ message: "Error fetching jobs", error: err.message });
    }
  };
}

module.exports = JobController;
