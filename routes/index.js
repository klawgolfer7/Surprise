var express = require('express');
var router = express.Router();
var exphbs = require("express-handlebars");
var login = require("../models/session.js");

/* GET home page. whihc is the login page */


router.get('/login', function(req, res, next) {
  res.render('login');

});

module.exports = router;
