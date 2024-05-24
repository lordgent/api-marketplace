const express = require("express");
const router = express.Router();

const { auth, AuthMerchant, AuthAdm } = require("../middlewares/Auth");
const { uploadFile } = require("../middlewares/UploadFile");

const {
  addCategory,
  getCategory,
  isDeleteCategory,
  updateCategory,
  getDetailCategory,
} = require("../controllers/CategoryController");
const { addRole } = require("../controllers/RolesController");
const { signIn, signUp } = require("../controllers/AuthController");
const {
  createMerchant,
  getMerchantInfo,
  updateMerchantInfo,
} = require("../controllers/MerchantController");
const {
  addProduct,
  getAllProduct,
  getDetailProduct,
  deleteImage,
  deleteProduct,
  updateProduct,
  getProductImage
} = require("../controllers/ProductController");
const {
  addToCart,
  getCarts,
  totalPrice,
  addQtyCart,
  deleteCart
} = require("../controllers/CartController");
const { getCity } = require("../controllers/ShippingController");
const { updateProfile } = require("../controllers/UserController");
const {checkOutCart,getUserOrder,UserProofPayment,chartAdmin} = require("../controllers/CheckoutController")
const {createFavorite,getUserWhistList,deleteFavorite} = require('../controllers/WishlistController')


router.post("/role", addRole);

// ====== Authentication Controller ==========
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);

// ===== Merchant Controller ===========
router.post("/merchant", auth, createMerchant);
router.get("/merchant/info", auth, AuthMerchant, getMerchantInfo);
router.put(
  "/merchant",
  auth,
  AuthMerchant,
  uploadFile("imageMerchant"),
  updateMerchantInfo
);

// ===== User Controller ========
router.put("/user/profile", auth, updateProfile);

// ==== Category Controller =====
router.post(
  "/category",
  auth,
  AuthAdm,
  uploadFile("iconCategory"),
  addCategory
);
router.get("/categories", getCategory);
router.get("/category/:id", getDetailCategory);
router.put(
  "/admin/category",
  auth,
  AuthAdm,
  uploadFile("iconCategory"),
  updateCategory
);
router.delete("/admin/category/:id", auth, AuthAdm, isDeleteCategory);

// ====== Product Controller ======
router.post(
  "/merchant/product",
  auth,
  AuthMerchant,
  uploadFile("imageProduct"),
  addProduct
);
router.get("/merchant/products", getAllProduct);
router.get("/product/:id", getDetailProduct);
router.delete("/merchant/product/:id", deleteProduct);
router.delete("/merchant/product-image/:id", deleteImage);
router.put("/merchant/product",auth, AuthMerchant, uploadFile("imageProduct"), updateProduct)
router.get("/merchant/product-image/:id", getProductImage);

// ======== Cart Controller ========
router.post("/user/cart", auth, addToCart);
router.post("/user/cart/total", auth, totalPrice);
router.get("/user/carts", auth, getCarts);
router.put("/user/cart", auth,addQtyCart);
router.delete("/user/cart", auth,deleteCart);

// ===== Shipping Controller =========
router.get("/shipping/city", getCity);

// ========= Checkout ========
router.post("/user/checkout", auth, checkOutCart);
router.get("/user/checkouts", auth, getUserOrder);
router.put("/user/checkout-payment", auth,uploadFile("imagePayment"), UserProofPayment);
router.get("/admin/chart",auth,chartAdmin)

// ========= Wishlist ===========
router.post("/user/wishlist", auth,createFavorite);
router.get("/user/wishlist", auth, getUserWhistList)
router.delete("/user/wishlist", auth, deleteFavorite)

module.exports = router;
