var express = require('express');
var router = express.Router();
var RepositoryController = require('../controllers/RepositoryController');
var { validateRepositorySettings } = require('./../middlewares/repository');
var { handleValidation } = require('./../middlewares/shared');

router.get('/repositories', RepositoryController.index);
router.get('/repositories/new', RepositoryController.create);
router.get('/repositories/:id', RepositoryController.show);
router.get('/repositories/:id/settings', RepositoryController.create);
router.post('/repositories/:id/settings', validateRepositorySettings(), handleValidation, RepositoryController.store);

module.exports = router;