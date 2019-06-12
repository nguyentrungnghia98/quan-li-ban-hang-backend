var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Customer = require("../models/customer");
const parseQuery = require("../middlewares/parse-query")
module.exports = (router) => {

  router
    .route("/customer")
    .get(getUser,parseQuery, (req, res, next) => {
      Customer.find(req.filter,{},req.pagination,async (err, customers) => {
        if (err) return next(err);
        if (customers) {
          let curPage = parseInt(req.query.page) +1
          let count = await Customer.count()
          console.log('count',count)
          res.json({
            pagination:{
              current_page: curPage,
              next_page: curPage + 1,
              prev_page: curPage - 1,
              limit: req.pagination.limit
            },
            results:{
              objects:{
                count: count,
                rows: customers,
              }
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Customers is not exist!"
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
      if(!req.body.phone) {
        res.status(403).json({
          success: false,
          message: "Property phone is required!"
        });
        return next()
      }   
      if(!req.body.email) {
        res.status(403).json({
          success: false,
          message: "Property email is required!"
        });
        return next()
      }  
 
      let customer = new Customer({
        name: req.body.name,
        avatar: req.body.avatar,
        birthday: req.body.birthday,
        email: req.body.email,
        status: req.body.status || 1,
        phone: req.body.phone,
        sex: req.body.sex,
      })
      customer.save(err => {
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
        results:{
          object: customer
        }
      });
    })
    .delete(getUser, (req, res, next) => {
      let items = JSON.parse(req.query.items)
      console.log('items',items)
      if(!items || items.length == 0){ 
        res.status(403).json({
          error:'ids is empty'
        })
      }else{
        Customer.remove({'_id':{'$in':items}}, (err,result)=>{
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
    .route("/customer/:id")
    .get(getUser, (req, res, next) => {
      console.log('Request Id:', req.params.id);
      Customer.findOne({ _id: ObjectID(req.params.id) }, (err, customer) => {
        if (err) return next(err);
        if (customer) {
          res.json({
            results:{
              object: customer
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "customer is not exist!"
          });
        }
      })
    })
    .put(getUser, (req, res, next) => {
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.avatar) data.avatar = req.body.avatar
      if (req.body.birthday) data.birthday = req.body.birthday
      if (req.body.email) data.email = req.body.email
      if (req.body.status) data.status = req.body.status
      if (req.body.phone) data.phone = req.body.phone
      if (req.body.sex) data.sex = req.body.sex
      if (Object.keys(data).length == 0) {
        res.json({
          success: false,
          message: "Request sai!"
        });
      }else{
        Customer.findByIdAndUpdate(req.params.id, data, { new: true }, (err, customer) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (customer) {
            res.json({
              results:{
                object: customer
              }
            });
          } else {
            res.status(403).json({
              success: false,
              message: "customer is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Customer.findByIdAndRemove(req.params.id, (err, result) => {
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