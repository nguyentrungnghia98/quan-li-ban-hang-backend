var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Promotion = require("../models/promotion");
const parseQuery = require("../middlewares/parse-query")

module.exports = (router) => {

  router
    .route("/promotion")
    .get(getUser,parseQuery,  (req, res, next) => {
      Promotion.find(req.filter,{},req.pagination,async (err, promotions) => {
        if (err) return next(err);
        if (promotions) {
          let curPage = parseInt(req.query.page) +1
          let count = await Promotion.count()
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
                rows: promotions,
              }
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "promotions is not exist!"
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
      if(!req.body.code) {
        res.status(403).json({
          success: false,
          message: "Property code is required!"
        });
        return next()
      }   
      if(!req.body.value) {
        res.status(403).json({
          success: false,
          message: "Property value is required!"
        });
        return next()
      } 
      let promotion = new Promotion({
        name: req.body.name,
        code: req.body.code ,
        content: req.body.content,
        startTime: req.body.startTime,
        status: req.body.status || 1,
        endTime: req.body.endTime,
        value: req.body.value,
        limit_per_user: req.body.limit_per_user || 1,
        number: req.body.number,
      })
      promotion.save(err => {
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
          object: promotion
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
        Promotion.remove({'_id':{'$in':items}}, (err,result)=>{
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
    .route("/promotion/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Promotion.findOne({ _id: ObjectID(req.params.id) }, (err, promotion) => {
        if (err) return next(err);
        if (promotion) {
          res.json({
            results:{
              object: promotion
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "promotion is not exist!"
          });
        }
      })
    })
    .put(getUser, (req, res, next) => {
      let data = {}
      if (req.body.name) data.name = req.body.name
      if (req.body.code) data.code = req.body.code
      if (req.body.content) data.content = req.body.content
      if (req.body.startTime) data.startTime = req.body.startTime
      if (req.body.status) data.status = req.body.status
      if (req.body.endTime) data.endTime = req.body.endTime
      if (req.body.value) data.value = req.body.value
      if (req.body.limit_per_user) data.limit_per_user = req.body.limit_per_user
      if (req.body.number) data.number = req.body.number
      if (Object.keys(data).length == 0) {
        res.status(403).json({
          success: false,
          message: "Request sai!"
        });
      }else{
        Promotion.findByIdAndUpdate(req.params.id, data, { new: true }, (err, promotion) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (promotion) {
            res.json({
              results:{
                object: promotion
              }
            });
          } else {
            res.status(403).json({
              success: false,
              message: "promotion is not exist!"
            });
          }
        })
    
      }
    })
    .delete(getUser, (req, res, next) => {
      Promotion.findByIdAndRemove(req.params.id, (err, result) => {
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