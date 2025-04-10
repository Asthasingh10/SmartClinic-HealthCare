const express = require("express");
const router = express.Router();
const { signupValidation, loginValidation } = require("../helpers/validation");
const userController = require("../controllers/userControllers");

router.post("/signup", signupValidation, userController.signup);
router.post("/login", loginValidation, userController.login);
router.get("/logout", userController.logout); 


module.exports = router;
