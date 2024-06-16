const express = require('express')
const router = express.Router()
const { authCheck } = require("../MiddleWare/Auth")

const { subUserSignIn, subUserSignOut, requestPasswordReset, resetPassword, changePassword, getSubUserById } = require("../Controller/SubUserController")

router.post("/subUserSignIn", subUserSignIn)
router.post("/subUserSignOut", subUserSignOut)
router.post("/requestPasswordReset", requestPasswordReset)
router.put("/resetPassword/:token", resetPassword)

router.put("/changePassword", authCheck, changePassword)

router.post("/getSubUserById", authCheck, getSubUserById)

module.exports = router