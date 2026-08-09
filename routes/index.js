var express = require('express');
var router = express.Router();
var homeController = require('../controllers/HomeController');

/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
