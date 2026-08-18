var express = require('express');
var router = express.Router();
var homeController = require('../controllers/HomeController');
var CommitController = require('../controllers/CommitController');

/* GET home page. */
router.get('/', homeController.index);

/* GET commits page. */
router.get('/commits', CommitController.index);

module.exports = router;
