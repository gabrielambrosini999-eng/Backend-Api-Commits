var {body} = require('express-validator');

function validateBranches() {
    
    return [
        body('pattern')  // name del campo en el ejs branch-protection.
            .trim()
            .notEmpty().withMessage('La rama principal no puede ser nula, es requerido')
            .bail(),
        body('reviews')
            .notEmpty().withMessage('reviews requerido')
            .bail(),
        body('approvals')
            .notEmpty().withMessage('reviews requerido')
            .isInt({ min: 0 }).withMessage('Las aprobaciones deben ser un número entero mayor o igual a 0.')
    ]
         
    return res.redirect('/branchprotection');
    
}

module.exports = {
    validateBranches,   
}









/*
// 2. Creamos un middleware para verificar el resultado y redireccionar si falla
function checkValidationResult(req, res, next) {
    const errors = validationResult(req);
    
    // Si hay errores de validación, se ejecuta la redirección
    if (!errors.isEmpty()) {
        return res.redirect('/branchprotection'); // Corregido: "branchprotection"
    }
    
    // Si no hay errores, el código continúa hacia el siguiente controlador
    next();
}
*/
module.exports = {
    validateBranches,
    //checkValidationResult
}
