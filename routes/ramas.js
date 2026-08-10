var express = require('express');
var router = express.Router();

// aca defino que archivos ejs , html necesito
var branchController = require('../controllers/BranchController');  // donde leo la base de datos o array de objetos
var { handleValidation } = require('./../middlewares/shared');   //este queda como esta

var { validateBranches } = require('./../middlewares/branchprotection');    // hago la validacion de campos 
var branchprotectionController = require('../controllers/BranchprotectionController')  // llamoa la pantalla donde se afectan los controles

// aca hago el get del archivo + controlador.list que es el branchcontroller.js donde estan los datos
router.get('/branches', branchController.list);
/*router.post('/branches', 
  validateBranches(), 
  handleValidation, // tal cual. sin tocar
  branchController.list
);*/

router.get('/branchprotection', branchprotectionController.create);  // aca muestra el ejs/html
router.post('/branchprotection',   // trae los datos datos y los graba
  validateBranches(),  // valida los campos que esten correctos antes de grabar
  handleValidation, // tal cual. sin tocar
  branchprotectionController.store,   // graba los datos
);

module.exports = router;
