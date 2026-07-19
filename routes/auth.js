var express = require('express');
var router = express.Router();
var registerController = require('../controllers/RegisterController');
var loginController = require('../controllers/loginController');
var welcomeController = require('../controllers/WelcomeController');
var { validateLogin, isLogged } = require('./../middlewares/login');
var { handleValidation } = require('./../middlewares/shared');

router.get('/register', registerController.create);
router.post('/register', registerController.store);

router.get('/login', loginController.create);
router.post('/login', 
  validateLogin(), 
  handleValidation,
  loginController.store
);

router.get('/welcome', isLogged, welcomeController.index);

router.get('/logout', loginController.destroy);

router.get('/password/forget', function (req, res, next) {
  res.render('password-change');
});

module.exports = router;
