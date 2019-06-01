var async = require('asyncawait/async');
var await = require('asyncawait/await');
const router = require("express").Router();
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const User = require("../models/user");


router.post("/signup", getUser, (req, res, next) => {
  let user = new User();
  user.displayName = req.user.displayName || "Khách";
  user.email = req.user.email;
  user.photoURL = req.user.photoURL || "https://i.imgur.com/6RUJRyM.png";
  user.phoneNumber = req.user.phoneNumber;

  User.findOne({ email: req.user.email }, (err, existUser) => {
    if (err) return next(err);

    if (existUser) {
      res.json({
        success: false,
        message: "Account with that email is already exist"
      });
    } else {
      user.save();

      res.json({
        success: true,
        user
      });
    }
  });
});

router.post("/login", getUser, (req, res, next) => {
  User.findOne({ email: req.user.email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      if (req.body.type === "social") {
        let user = new User();
        user.displayName = req.user.displayName || "Khách";
        user.email = req.user.email;
        user.photoURL = req.user.photoURL || "https://i.imgur.com/6RUJRyM.png";
        user.phoneNumber = req.user.phoneNumber;
        user.save();

        res.json({
          success: true,
          user
        });
      } else {
        res.json({
          success: false,
          message: "User not found!"
        });
      }
    } else {
      res.json({
        success: true,
        user
      });
    }
  }).populate('likes')
  .populate('friends')
  .populate({
    path: 'support',
    populate: [{
      path: 'users'
    },
     {
      path: 'support'
    }]
  });
});
router
  .route("/info")
  .get(getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next(err);
      if (user) {
        res.json({
          success: true,
          user,
          message: "Successful Manipulation!"
        });
      } else {
        res.json({
          success: false,
          message: "Users is not exist!"
        });
      }
    }).populate('likes')
      .populate('friends')
      .populate({
        path: 'support',
        populate: [{
          path: 'users'
        },
         {
          path: 'support'
        }]
      });
  })
