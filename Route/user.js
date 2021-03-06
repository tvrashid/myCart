const express = require("express");
const router = express.Router();
const controller = require("../controller/user");
const getdb = require("../data/User").getdb;
const userAUth = require("../middleware/user-auth");
// const adminController = require("../controller/admin");
const { body } = require("express-validator/check");
router.post("/order", userAUth, controller.postOrder);
router.post(
  "/signup",
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid E-mail")
    .normalizeEmail()
    .custom(value => {
      const myDb = getdb();
      return myDb
        .collection("New-Users")
        .find({ email: value })
        .next()
        .then(result => {
          console.log("E-mail exist->:" + result);
          if (result) {
            return Promise.reject("E-mail already exist");
          }
        });
    }),
  body("password", "Invalid Password,Password must be alpha numeric")
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 6, max: 16 }),
  controller.registerUser
);
router.post(
  "/login",
  [
    body("email", "Invalid E-mail")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password Should not be empty")
      .isLength({ min: 6, max: 20 })
      .withMessage("Password Should be minimum 6 character")
  ],
  controller.getLogin
);

// /user/getCart
router.get("/getcart", userAUth, controller.getCart);

router.get("/getLogout", userAUth, controller.getLogout);

router.get("/getprod/:prodId", controller.getProductDetail);

///user/addtocart/<%=product._id%>

router.post("/addtocart/:prodId", userAUth, controller.postAddtoCart);
///user/removeItem/<%=prod._id%>
router.post("/removeItem/:prodId", userAUth, controller.postRemoveItem);
///user/getCart

module.exports = router;
