var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const User = require("../models/user");
const parseQuery = require("../middlewares/parse-query")
module.exports = (router) => {

  router.post("/account/signup", getUser, (req, res, next) => {
    console.log('req',req.body)
    let user = new User();
    user.name = req.body.name || "Không rõ";
    user.email = req.body.email;
    user.avatar = req.body.avatar || "https://i.imgur.com/6RUJRyM.png";
    user.role = req.body.role
    user.isAccepted = false
    User.findOne({ email: req.user.email },async (err, existUser) => {
      if (err) return next({
        message: err
      });
      if (existUser) {
        res.status(403).json({
          success: false,
          message: "Account with that email is already exist"
        });
      } else {
        await user.save();

        res.json({
          results:{
            object: user
          }
        });
      }
    });
  });

  router.post("/account/login", getUser, (req, res, next) => {
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) return next({
        message: err
      });

      if (!user) {
        res.status(403).json({
          success: false,
          message: "User not found!"
        });
      } else {
        res.json({
          results:{
            object: user
          }
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
    }).delete(getUser, (req, res, next) => {
      let items = JSON.parse(req.query.items)
      console.log('items',items)
      if(!items || items.length == 0){ 
        res.status(403).json({
          error:'ids is empty'
        })
      }else{
        User.remove({'_id':{'$in':items}}, (err,result)=>{
          if(err) return res.status(403).json({
            err
          })
          res.json({
            success:true,
            result
          })
        })
      }
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
      if (req.body.role && (req.body.role == "manager" || req.body.role == "staff")) data.role = req.body.role
      if (req.body.isAccepted != undefined) data.isAccepted = req.body.isAccepted
      if (req.body.isDenied != undefined) data.isDenied = req.body.isDenied
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