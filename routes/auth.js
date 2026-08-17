var express = require('express');
var router = express.Router();
var registerController = require('../controllers/RegisterController');
var loginController = require('../controllers/LoginController');
var welcomeController = require('../controllers/WelcomeController');
var { validateRegister } = require('./../middlewares/register');
var { validateLogin, isLogged } = require('./../middlewares/login');
var { handleValidation } = require('./../middlewares/shared');

router.get('/register', registerController.create);

router.post('/register',
  validateRegister(),
  handleValidation,
  registerController.store);

router.get('/login', loginController.create);
router.post('/login',
  validateLogin(),
  handleValidation,
);

router.get('/welcome', isLogged, welcomeController.index);

router.get('/logout', isLogged, loginController.destroy);

router.get('/password/forget', function (req, res, next) {
  res.render('password-change');
});

module.exports = router;
