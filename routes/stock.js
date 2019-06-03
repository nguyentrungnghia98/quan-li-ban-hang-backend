var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Stock = require("../models/stock");

module.exports = (router) => {

  router
    .route("/stock")
    .get(getUser, (req, res, next) => {
      Stock.find({}, (err, stocks) => {
        if (err) return next(err);
        if (stocks) {
          res.json({
            success: true,
            stocks,
            message: "Successful!"
          });
        } else {
          res.json({
            success: false,
            message: "stocks is not exist!"
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
      if(!req.body.provider_name) {
        res.status(403).json({
          success: false,
          message: "Property provider_name is required!"
        });
        return next()
      }   
      if(!req.body.products) {
        res.status(403).json({
          success: false,
          message: "Property products is required!"
        });
        return next()
      }   

      let stock = new Stock({
        name: req.body.name,
        provider_name: req.body.provider_name || "",
        products: req.body.products,
        total_items: req.body.products.length,
        status: req.body.status || 1,
      })
      stock.save(err => {
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
          stock
        }
      });
    })
  router
    .route("/stock/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Stock.findOne({ _id: ObjectID(req.params.id) }, (err, stock) => {
        if (err) return next(err);
        if (stock) {
          res.json({
            success: true,
            stock,
            message: "Successful Manipulation!"
          });
        } else {
          res.json({
            success: false,
            message: "stock is not exist!"
          });
        }
      })
    })
    .post(getUser, (req, res, next) => {
      let data = {}

      if (req.body.name) data.name = req.body.name
      if (req.body.provider_name) data.provider_name = req.body.provider_name
      if (req.body.products) data.products = req.body.products
      if (req.body.status) data.status = req.body.status
      if (Object.keys(data).length == 0) {
        res.json({
          success: false,
          message: "Request sai!"
        });
      }else{
        Stock.findByIdAndUpdate(req.params.id, data, { new: true }, (err, stock) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (stock) {
            res.json({
              success: true,
              stock,
              message: "Successful Manipulation!"
            });
          } else {
            res.json({
              success: false,
              message: "stock is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Stock.findByIdAndRemove(req.params.id, (err, result) => {
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