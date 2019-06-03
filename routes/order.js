var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Order = require("../models/order");

module.exports = (router) => {

  router
    .route("/order")
    .get(getUser, (req, res, next) => {
      Order.find({}, (err, orders) => {
        if (err) return next(err);
        if (orders) {
          res.json({
            success: true,
            orders,
            message: "Successful!"
          });
        } else {
          res.json({
            success: false,
            message: "orders is not exist!"
          });
        }
      });
    })
    .post(getUser, (req, res, next) => {
      if(!req.body.customer) {
        res.status(403).json({
          success: false,
          message: "Property customer is required!"
        });
        return next()
      } 
      if(!req.body.receiver_name) {
        res.status(403).json({
          success: false,
          message: "Property receiver_name is required!"
        });
        return next()
      }   
      if(!req.body.receiver_phone) {
        res.status(403).json({
          success: false,
          message: "Property receiver_phone is required!"
        });
        return next()
      }  
      if(!req.body.receiver_address) {
        res.status(403).json({
          success: false,
          message: "Property receiver_address is required!"
        });
        return next()
      } 

      let order = new Order({
        customer: req.body.customer,
        note: req.body.note || "",
        is_pick_at_store: req.body.is_pick_at_store,
        receiver_name: req.body.receiver_name,
        status: req.body.status,
        receiver_phone: req.body.receiver_phone,
        receiver_address: req.body.receiver_address,
        products: req.body.products,
      })
      order.save(err => {
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
          order
        }
      });
    })
  router
    .route("/order/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Order.findOne({ _id: ObjectID(req.params.id) }, (err, order) => {
        if (err) return next(err);
        if (order) {
          res.json({
            success: true,
            order,
            message: "Successful Manipulation!"
          });
        } else {
          res.json({
            success: false,
            message: "order is not exist!"
          });
        }
      })
    })
    .post(getUser, (req, res, next) => {
      let data = {}

      if (req.body.customer) data.customer = req.body.customer
      if (req.body.note) data.note = req.body.note
      if (req.body.is_pick_at_store) data.is_pick_at_store = req.body.is_pick_at_store
      if (req.body.receiver_name) data.receiver_name = req.body.receiver_name
      if (req.body.status) data.status = req.body.status
      if (req.body.receiver_phone) data.receiver_phone = req.body.receiver_phone
      if (req.body.receiver_address) data.receiver_address = req.body.receiver_address
      if (req.body.products) data.products = req.body.products
      if (Object.keys(data).length == 0) {
        res.json({
          success: false,
          message: "Request sai!"
        });
      }else{
        Order.findByIdAndUpdate(req.params.id, data, { new: true }, (err, order) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (order) {
            res.json({
              success: true,
              order,
              message: "Successful Manipulation!"
            });
          } else {
            res.json({
              success: false,
              message: "order is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Order.findByIdAndRemove(req.params.id, (err, result) => {
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