// const multer = require("multer");
// const path = require("path");

// // Define storage settings for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../my-upload/images")); // Adjust the folder path as needed
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensuring correct extension
//   },
// });

// // Define file filter to allow only specific formats
// const fileFilter = (req, file, cb) => {
//   const allowedFormats = [
//     "image/png",
//     "image/jpg",
//     "image/jpeg",
//     "image/svg+xml",
//   ];
//   if (allowedFormats.includes(file.mimetype)) {
//     cb(null, true); // Accept file
//   } else {
//     cb(null, false);
//     return cb(
//       new Error("Only .jpg, .jpeg, .png, and .svg formats are allowed!")
//     );
//   }
// };

// // Initialize multer with storage, file filter, and file size limit
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
// });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "my-upload/images",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|svg/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png, and .svg formats are allowed!"));
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
});

module.exports = upload;
