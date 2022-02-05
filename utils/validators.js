const { body } = require("express-validator/check");
const User = require("../models/user")

exports.registerValidators = [
  body("email")
    .isEmail().withMessage("Enter your email correctly")
    .custom(async (value, {req}) => {
      try{
        const user = await User.findOne({email: value})
        if(user) {
          return Promise.reject("This email is already exist")
        }
      }catch(e) {
        console.log(e)
      }
   }).normalizeEmail(),
  body("password", "Password should be min 6 symbols")
    .isLength({min: 6, max: 56})
    .isAlphanumeric()
    .trim(),
  body("confirm").custom((value, {req}) =>{
    if(value !== req.body.password) {
      throw new Error("Password should be similar")
    }
    return true
  }).trim(),
  body("name")
    .isLength({min: 3}).withMessage("Name should be min 3 symbols")
    .trim()
];

exports.notebookValidators = [
  body("title").isLength({min: 3})
    .withMessage("Minimum length for title should be 3 symbols")
    .trim(),
  body("price").isNumeric().withMessage("Write correct price"),
  body("img").isURL().withMessage("Write correct URL Image"),
  body("descr", "Description should be min 10 symbols")
    .isLength({min: 10})
]
