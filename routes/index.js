var express = require('express');
var router = express.Router();
var homeController = require('../controllers/HomeController');

// aca defino que archivos ejs , html nececito
var branchController = require('../controllers/BranchController');

/* GET home page. */
router.get('/', homeController.index);

// aca hago el get del archivo + controlador.list que es el branchcontroller.js donde estan los datos
//router.get('/branches', branchController.list);
/*router.post('/login', 
  validateLogin(), 
  handleValidation, // tal cual. sin tocar
  loginController.store
);*/


module.exports = router;
