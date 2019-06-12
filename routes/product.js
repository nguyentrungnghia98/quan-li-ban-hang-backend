var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Product = require("../models/product");
const parseQuery = require("../middlewares/parse-query")

module.exports = (router) => {

  router
    .route("/product")
    .get(getUser,parseQuery,  (req, res, next) => {
      console.log('filter',req.filter,' page',req.pagination)
      Product.find(req.filter,{},req.pagination,async (err, products) => {
        if (err) return next(err);
        if (products) {
          let curPage = parseInt(req.query.page) +1
          let count = await Product.count()
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
                rows: products,
              }
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Products is not exist!"
          });
        }
      });
    })
    .post(getUser,async (req, res, next) => {
      if(!req.body.name) {
        res.status(403).json({
          success: false,
          message: "Property name is required!"
        });
        return next()
      } 
      if(!req.body.price) {
        res.status(403).json({
          success: false,
          message: "Property price is required!"
        });
        return next()
      }   
      let categories = null
      if(req.body.categories && req.body.categories.length > 0) categories = req.body.categories.map(el=> ObjectID(el))
      let product = new Product({
        name: req.body.name,
        description: req.body.description || "",
        list_image: req.body.list_image,
        price: req.body.price,
        status: req.body.status || 1,
        categories: categories,
        thumb: req.body.list_image[0] || null
      })
      await product.save(err => {
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
          object: product
        }
        
      });
    })
    .delete(getUser, (req, res, next) => {
      console.log('query',req.query)
      let items = JSON.parse(req.query.items)
      console.log('items',items)
      if(!items || items.length == 0){ 
        res.status(403).json({
          error:'ids is empty'
        })
      }else{
        Product.remove({'_id':{'$in':items}}, (err,result)=>{
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
    .route("/product/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Product.findOne({ _id: ObjectID(req.params.id) }, (err, product) => {
        if (err) return next(err);
        if (product) {
          res.json({
            results:{
              object: product
            }
            
          });
        } else {
          res.status(403).json({
            success: false,
            message: "Product is not exist!"
          });
        }
      })
    })
    .put(getUser, (req, res, next) => {
      console.log('Request Id:', req.params.id);
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.description) data.description = req.body.description
      if (req.body.list_image) data.list_image = req.body.list_image
      if (req.body.price) data.price = req.body.price
      if (req.body.status) data.status = req.body.status
      if (req.body.number_product) data.number_product = req.body.number_product
      let categories = null
      if(req.body.categories && req.body.categories.length > 0){
        categories = req.body.categories.map(el=> ObjectID(el))
        data.categories = categories
      } 
      console.log('data',data)
      if (Object.keys(data).length == 0) {
        res.status(403).json({
          success: false,
          message: "Request sai!"
        });
      }else{
        Product.findByIdAndUpdate(req.params.id, data, { new: true }, (err, product) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (product) {
            res.json({
              results:{
                object: product
              }
            });
          } else {
            res.status(403).json({
              success: false,
              message: "Product is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Product.findByIdAndRemove(req.params.id, (err, result) => {
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