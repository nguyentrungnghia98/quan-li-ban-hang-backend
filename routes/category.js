var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Category = require("../models/category");
const parseQuery = require("../middlewares/parse-query")
module.exports = (router) => {

  router
    .route("/category")
    .get(getUser, parseQuery, (req, res, next) => {
      console.log('filter',req.filter,' page',req.pagination)
      Category.find(req.filter,{},req.pagination,async (err, categories) => {
        if (err) return next(err);
        if (categories) {
          let curPage = parseInt(req.query.page) +1
          let count = await Category.count()
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
                rows: categories,
              }
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "categories is not exist!"
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
      
      let category = new Category({
        name: req.body.name,
        description: req.body.description || "",
        image: req.body.image,
        status: req.body.status || 1,
      })
      await category.save(err => {
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
          object: category
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
        Category.remove({'_id':{'$in':items}}, (err,result)=>{
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
    .route("/category/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Category.findOne({ _id: ObjectID(req.params.id) }, (err, category) => {
        if (err) return next(err);
        if (category) {
          res.json({
            results:{
              object: category
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "category is not exist!"
          });
        }
      })
    })
    .put(getUser, (req, res, next) => {
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.description) data.description = req.body.description
      if (req.body.image) data.list_image = req.body.image
      if (req.body.status) data.status = req.body.status
      if (Object.keys(data).length == 0) {
        res.status(403).json({
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
              results:{
                object: category
              }
            });
          } else {
            res.status(403).json({
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