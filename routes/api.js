const router = require("express").Router();



require('./account')(router)
require('./product')(router)
require('./category')(router)
require('./customer')(router)
require('./order')(router)
require('./promotion')(router)
require('./stock')(router)

module.exports = router