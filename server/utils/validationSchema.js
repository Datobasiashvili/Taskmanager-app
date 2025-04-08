const { checkSchema } = require("express-validator");

const userValidationSchema = checkSchema({
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email is Required",
    },
    isEmail: {
      errorMessage: "Invalid Email Format",
    },
    normalizeEmail: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    //Ensures at least one uppercase letter, at least one lowercase letter, at least one digit and at least one special character
    matches: {
      options:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      errorMessage:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    },
  },
});

module.exports = { userValidationSchema };
