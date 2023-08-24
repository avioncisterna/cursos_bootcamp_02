var express = require('express');
var router = express.Router();
const { User, Bootcamp } = require("../models/index");

/* GET bootcamps listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;