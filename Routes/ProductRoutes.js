const express = require('express')
const router = express.Router()
const { authCheck } = require("../MiddleWare/Auth")

const { productCreation, getUserProductsByCategory, getAllUserProducts, setProductStatus, findItemById, deleteItemById, generateLinkForActiveProducts, generateQRCodeForLink, getActiveProductsByCategory, generateQRCodePDF, updateProductItem, reorderProducts, liveSearch } = require("../Controller/ProductController")

router.post("/productCreate", authCheck, productCreation)
router.post("/getUserProductsByCategory", authCheck, getUserProductsByCategory)
router.post("/getAllUserProducts", authCheck, getAllUserProducts)
router.post("/findItemById", authCheck, findItemById)
router.put("/setProductStatus", authCheck, setProductStatus)
// router.put("/updateItemCompletely", authCheck, updateItemCompletely)
router.delete("/deleteItemById", authCheck, deleteItemById)
router.put("/updateProductItem", authCheck, updateProductItem)
// router.post("/userSignIn", userSignIn)


// New routes for QR code generation and fetching active products
router.get("/generateLinkForActiveProducts", authCheck, generateLinkForActiveProducts);
router.post("/generateQRCodeForLink", authCheck, generateQRCodeForLink);
router.post("/generateQRCodePDF", authCheck, generateQRCodePDF);
router.get("/active", authCheck, getActiveProductsByCategory); // No authCheck for viewing products


router.put("/reorderProducts", authCheck, reorderProducts);
// router.put("/moveProduct", authCheck, moveProduct);
router.post("/liveSearch", authCheck, liveSearch);


module.exports = router