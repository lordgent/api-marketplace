const multer = require("multer");

exports.uploadFile = (imageProduct, imageProfile, iconCategory, imageMerchant) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      switch (file.fieldname) {
        case "imageProduct":
          cb(null, "uploads/products");
          break;
        case "imageProfile":
          cb(null, "uploads/profile");
          break;
        case "iconCategory":
          cb(null, "uploads/categories");
          break;
        case "imageMerchant":
          cb(null, "uploads/merchants");
          break;
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = (req, file, cb) => {
    if (
      file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)
    ) {
      cb(null, true);
    } else {
      req.fileValidationError = "only image files are allowed..";
      cb(new Error("Only image files are allowed!"), false);
    }
  };

  const sizeInMB = 20;
  const maxSize = sizeInMB * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageProduct,
      maxCount: 5,
    },
    {
      name: imageProfile,
      maxCount: 1,
    },
    {
      name: iconCategory,
      maxCount: 1,
    },
    {
      name: imageMerchant,
      maxCount: 1,
    },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.status(400).send({
          status: "Upload Failed!",
          message: req.fileValidationError,
        });
      }

      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            status: "Upload Failed!",
            message: "Max file sized 10mb",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
