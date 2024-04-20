const express = require('express');
const router = express.Router()

const {auth,AuthMerchant,AuthAdm} = require("../middlewares/Auth");
const {uploadFile} = require('../middlewares/UploadFile')

const {addCategory,getCategory} = require('../controllers/CategoryController')
const {addRole} = require('../controllers/RolesController')
const {signIn,signUp} = require('../controllers/AuthController')
const {createMerchant} = require('../controllers/MerchantController')
const {addProduct,getAllProduct} = require('../controllers/ProductController')
const {addToCart,getCarts} = require('../controllers/CartController')

router.post('/role', addRole)

// ====== Authentication Controller ==========
router.post('/auth/signup', signUp)
router.post('/auth/signin', signIn)

// ===== Merchant Controller ===========
router.post('/merchant', auth, createMerchant)

// ===== User Controller ========

// ==== Category Controller =====
router.post('/category', auth, AuthAdm,uploadFile("iconCategory"),addCategory)
router.get('/categories',  getCategory)

// ====== Product Controller ======
router.post('/merchant/product', auth, AuthMerchant, uploadFile("imageProduct"), addProduct)
router.get('/merchant/products',  getAllProduct)

// ======== Cart Controller ========
router.post('/user/cart', auth, addToCart)
router.get('/user/carts', auth, getCarts)


module.exports = router