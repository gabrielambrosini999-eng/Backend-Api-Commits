var express = require('express');
var router = express.Router();
var registerController = require('../controllers/RegisterController');
var loginController = require('../controllers/loginController');
var welcomeController = require('../controllers/WelcomeController');

router.get('/register', registerController.create);
router.post('/register', registerController.store);

router.get('/login', loginController.create);
router.post('/login', loginController.store);

router.get('/welcome', welcomeController.index);

router.get('/password/forget', function (req, res, next) {
  res.render('password-change');
});

module.exports = router;
