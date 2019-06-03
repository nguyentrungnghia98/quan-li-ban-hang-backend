var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Category = require("../models/category");

module.exports = (router) => {

  router
    .route("/category")
    .get(getUser, (req, res, next) => {
      Category.find({}, (err, categories) => {
        if (err) return next(err);
        if (categories) {
          res.json({
            pagination:{
              current_page: 1,
              next_page: 2,
              prev_page: 0,
              limit: 10
            },
            results:{
              objects:{
                count: categories.length,
                rows: categories,
              }
            }
          });
        } else {
          res.json({
            success: false,
            message: "categories is not exist!"
          });
        }
      });
    })
    .post(getUser, (req, res, next) => {
      if(!req.body.name) {
        res.status(403).json({
          success: false,
          message: "Property name is required!"
        });
        return next()
      } 
      
      let category = new Category({
        name: req.body.name,
        description: req.body.description || "",
        image: req.body.image,
        status: req.body.status || 1,
      })
      category.save(err => {
        if (err) {
          console.log(err)
          res.status(403).json({
            success: false,
            message: err
          });
          return next()
        }
      })
      res.json({
        success: true,
        data:{
          category
        }
      });
    })
  router
    .route("/category/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Category.findOne({ _id: ObjectID(req.params.id) }, (err, category) => {
        if (err) return next(err);
        if (category) {
          res.json({
            success: true,
            category,
            message: "Successful Manipulation!"
          });
        } else {
          res.json({
            success: false,
            message: "category is not exist!"
          });
        }
      })
    })
    .post(getUser, (req, res, next) => {
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.description) data.description = req.body.description
      if (req.body.image) data.list_image = req.body.image
      if (req.body.status) data.status = req.body.status
      if (Object.keys(data).length == 0) {
        res.json({
          success: false,
          message: "Request body failed!"
        });
      }else{
        Category.findByIdAndUpdate(req.params.id, data, { new: true }, (err, category) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (category) {
            res.json({
              success: true,
              category,
              message: "Successful Manipulation!"
            });
          } else {
            res.json({
              success: false,
              message: "category is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Category.findByIdAndRemove(req.params.id, (err, result) => {
        if (err) return next(res.status(500).json({
          success:false,
          message:err
        }));
        res.json({
          success: true,
          message: result
        });
      })
  
    });
}