// middleware/fileUpload.js
const upload = require("../middleware/fileUploads"); // Adjust the path as needed

const handleFileUpload = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });
      }

      // If a file is not required, you can check for its presence
      if (!req.file && req.body[fieldName]) {
        return res
          .status(400)
          .json({ message: `File upload for '${fieldName}' is required` });
      }

      next();
    });
  };
};

module.exports = handleFileUpload;
