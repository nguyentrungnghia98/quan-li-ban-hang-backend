var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const User = require("../models/user");
const parseQuery = require("../middlewares/parse-query")
module.exports = (router) => {

  router.post("/signup", getUser, (req, res, next) => {
    let user = new User();
    user.name = req.user.name || "Không rõ";
    user.email = req.user.email;
    user.avatar = req.user.avatar || "https://i.imgur.com/6RUJRyM.png";

    User.findOne({ email: req.user.email }, (err, existUser) => {
      if (err) return next(err);

      if (existUser) {
        res.status(403).json({
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
        res.status(403).json({
          success: false,
          message: "User not found!"
        });
      } else {
        res.json({
          success: true,
          user
        });
      }
    })
  });

  router
    .route("/user")
    .get(getUser, parseQuery, (req, res, next) => {
      User.find({}, (err, users) => {
        if (err) return next(err);
        if (users) {
          res.json({
            pagination:{
              current_page: 1,
              next_page: 2,
              prev_page: 1,
              limit: -1
            },
            results:{
              objects:{
                count: users.length,
                rows: users,
              }
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Users is not exist!"
          });
        }
      });
    })
  router
    .route("/user/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      User.findOne({ _id: ObjectID(req.params.id) }, (err, user) => {
        if (err) return next(err);
        if (user) {
          res.json({
            results:{
              object: user
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Users is not exist!"
          });
        }
      })
    })
    .put(getUser, (req, res, next) => {
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.avatar) data.avatar = req.body.avatar
      if (req.body.role) data.role = req.body.role

      if (Object.keys(data).length == 0) {
        res.status(403).json({
          success: false,
          message: "Request sai!"
        });
      }else{
        User.findByIdAndUpdate(req.params.id, data, { new: true }, (err, user) => {
          if (err) return next(err);
          if (user) {
            res.json({
              results:{
                object: user
              }
            });
          } else {
            res.status(403).json({
              success: false,
              message: "Users is not exist!"
            });
          }
        })
    
      }
    })

}