var {body} = require('express-validator');

function validateRepositorySettings() {
    return [
        body('name')
            .notEmpty().withMessage('Requerido').bail(),

        body('visibility')
            .isIn(['Public', 'Private']).withMessage('La visibilidad no es válida').bail(),
    ];
}

module.exports = {
    validateRepositorySettings,
}