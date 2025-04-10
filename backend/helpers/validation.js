const { check } = require("express-validator");

exports.signupValidation = [
  check("username", "Username is required").notEmpty(),
  check("email", "Please enter a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  check("phone", "Enter a valid phone number")
    .notEmpty()
    .isMobilePhone("any", { strictMode: false }),
  check("role", "Role is required").notEmpty()
];

exports.loginValidation = [
  check("email", "Please enter a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];
