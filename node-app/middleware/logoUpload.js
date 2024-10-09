const upload = require("./fileUploads");

const handleFileUpload = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res
          .status(400)
          .json({ message: "File upload failed", error: err.message });
      }

      // Optional check: if a file is required but not uploaded
      if (!req.file && req.body[fieldName]) {
        return res
          .status(400)
          .json({ message: `File upload for '${fieldName}' is required` });
      }

      // Continue to the next middleware if everything is fine
      next();
    });
  };
};

module.exports = handleFileUpload;
