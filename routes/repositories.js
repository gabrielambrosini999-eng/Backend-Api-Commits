var express = require('express');
var router = express.Router();
var RepositoryController = require('../controllers/RepositoryController');

router.get('/repository', RepositoryController.index);
router.get('/repository/settings', RepositoryController.settings);

module.exports = router;