var express = require('express');
var router = express.Router

var ApiCommitController = require('../controllers/ApiCommitController');
var {
    validateRepositoryIdParam,
    validateCommitBody,
    handleApiValidation,
} = require('../middlewares/commitApi');

//GET /api/repositories/:repositoryId/commits
router.get(
    '/repositories/:repositoryId/commits',
    validateRepositoryIdParam(),
    handleApiValidation,
    ApiCommitController.index
);

//GET /api/commits/:id
router.get(
    '/commits/:id',
    ApiCommitController.show
);

//POST /api/repositories/:repositoryId/commits
router.post(
    '/repositories/:repositoryId/commits',
    validateRepositoryIdParam(),
    validateCommitBody(),
    handleApiValidation,
    ApiCommitController.store
);

//PUT /api/commits/:id
router.put(
    '/commits/:id',
    validateCommitBody(),
    handleApiValidation,
    ApiCommitController.update
);

//DELETE /api/commits/:id
router.delete(
    '/commits/:id',
    ApiCommitController.destroy
);

module.exports = router;