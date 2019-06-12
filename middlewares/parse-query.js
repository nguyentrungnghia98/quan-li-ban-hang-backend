module.exports = (req, res, next) => {
  console.log('query middle',req.query)
    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)
    var query = {}
    if(page < 0 || page === 0) {
      response = {"error" : true,"message" : "invalid page number, should start with 1"};
      res.status(403).json(response);
    }else{
      query.skip = limit * (page - 1)
      query.limit = limit
      req.filter = req.query.filter? JSON.parse(req.query.filter) : {}
      if(!req.filter.name || !req.filter.name["$regex"]) {
        delete req.filter['name']
      }
      req.pagination = query
      next();
    }
};
