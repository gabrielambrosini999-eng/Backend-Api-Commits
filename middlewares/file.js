var { body } = require('express-validator');

function validateFileEdit() {
    return [
        body('fileName')
            .notEmpty().withMessage('El nombre del archivo es requerido'),

        body('content')
            .notEmpty().withMessage('El contenido es requerido'),

        body('commitMessage')
            .notEmpty().withMessage('El mensaje del commit es requerido')
    ];
}

module.exports = {
    validateFileEdit
};