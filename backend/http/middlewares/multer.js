// import multer from "multer";

// // Storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/stories"); // folder where files will be stored
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   }
// }); 

// // File filter (optional: allow only images)
// function fileFilter(req, file, cb) {
//   const allowed = ["image/jpeg", "image/png", "image/jpg"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only jpg, jpeg, png allowed"));
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter
// });

// export default upload;

import multer from "multer";

// Use memory storage to keep file in memory
const storage = multer.memoryStorage();

// File filter (optional) — accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Max file size (optional) — 5MB for example
const limits = {
  fileSize: 5 * 1024 * 1024
};

// Export the middleware
const upload = multer({ storage, fileFilter, limits });

export default upload;

