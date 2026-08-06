var express = require('express');
var router = express.Router();
var RepositoryController = require('../controllers/RepositoryController');
var { validateRepositorySettings } = require('./../middlewares/repository');
var { handleValidation } = require('./../middlewares/shared');

router.get('/repository', RepositoryController.index);

router.get('/repository/settings', RepositoryController.create);
router.post('/repository/settings', validateRepositorySettings(), handleValidation, RepositoryController.store);

module.exports = router;