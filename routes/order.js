var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { ObjectID } = require("mongodb");
const getUser = require("../middlewares/get-user");
const Order = require("../models/order");
const Promotion = require("../models/promotion");
const parseQuery = require("../middlewares/parse-query")


async function calTotalAmount(products,SubFee, promotion){
  let coupon = 0;
  if(promotion){
    let pro = await Promotion.findById(promotion)
    if(pro) coupon = pro.value
  }
  let total = 0;
  let subFee = SubFee || 0

  if(products){
    products.forEach(el=>{
      total += el.number_product * el.product.price
    })
    return  subFee +  total*(100-coupon)/100
  }else{
    return  subFee
  }
}
module.exports = (router) => {

  router
    .route("/order")
    .get(getUser, parseQuery, (req, res, next) => {
      Order.find(req.filter,{},req.pagination,async (err, orders) => {
        if (err) return next(err);
        if (orders) {
          let curPage = parseInt(req.query.page) +1
          let count = await Order.count()
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
                rows: orders,
              }
            }
          });
        } else {
          res.json({
            success: false,
            message: "orders is not exist!"
          });
        }
      }).sort({created: -1})
      .populate('customer promotion')
      ;
    })
    .post(getUser, async (req, res, next) => {

      if(!req.body.customer) {
        res.status(403).json({
          success: false,
          message: "Property customer is required!"
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
      let products = null
      if(req.body.products && req.body.products.length > 0){
        products = req.body.products.map(el=> {
          return {
            number_product: el.number_product,
            product: ObjectID(el.product._id)
          }
        })
      } 
      let code = await  Order.count() 
      let order = new Order({
        code: `ORDER${code + 1}`,
        note: req.body.note || "", 
        is_pick_at_store: req.body.is_pick_at_store,
        // receiver_name: req.body.receiver_name,
        // receiver_phone: req.body.receiver_phone,
        receiver_address: req.body.receiver_address,
        customer: ObjectID(req.body.customer),
        promotion: req.body.promotion ? ObjectID(req.body.promotion): null,
        status: req.body.status || "1",
        products: products,
        subFee: req.body.subFee,
        text:req.body.noteSubFee,
        channelSelect:req.body.channelSelect,
        totalAmount: await calTotalAmount(req.body.products, req.body.subFee, req.body.promotion)
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
        results:{
          object: order
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
        Order.remove({'_id':{'$in':items}}, (err,result)=>{
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
    .route("/order/:id")
    .get(getUser, (req, res, next) => {
      //5cf3f5f2a66abe460cadb890
      console.log('Request Id:', req.params.id);
      Order.findOne({ _id: ObjectID(req.params.id) }, (err, order) => {
        if (err) return next(err);
        if (order) {
          res.json({
            results:{
              object: order
            }
          });
        } else {
          res.status(403).json({
            success: false,
            message: "order is not exist!"
          });
        }
      }).populate('products.product').populate('customer promotion');
    })
    .put(getUser, (req, res, next) => {
      let data = {} 
      if (req.body.note) data.note = req.body.note
      if (req.body.is_pick_at_store) data.is_pick_at_store = req.body.is_pick_at_store
      if (req.body.receiver_name) data.receiver_name = req.body.receiver_name
      if (req.body.status) data.status = req.body.status
      if (req.body.receiver_phone) data.receiver_phone = req.body.receiver_phone
      if (req.body.receiver_address) data.receiver_address = req.body.receiver_address
      if (req.body.products) data.products = req.body.products
      if (req.body.subFee) data.subFee = req.body.subFee
      if (req.body.text) data.text = req.body.text
      if (req.body.channelSelect) data.channelSelect = req.body.channelSelect
      let products = null
      if(req.body.products && req.body.products.length > 0){
        products = req.body.products.map(el=> {
          return {
            number_product: el.number_product,
            product: ObjectID(el.product._id)
          }
        })
        data.products = products
      } 
      if (Object.keys(data).length == 0) {
        res.status(403).json({
          success: false,
          message: "Request sai!"
        });
      }else{
        data.updated = new Date()
        Order.findByIdAndUpdate(req.params.id, data, { new: true }, (err, order) => {
          if (err) return next(res.status(500).json({
            success:false,
            message:err
          }));
          if (order) {
            res.json({
              results:{
                object: order
              }
            });
          } else {
            res.status(403).json({
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