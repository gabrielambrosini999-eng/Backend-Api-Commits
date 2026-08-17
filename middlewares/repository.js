var {body} = require('express-validator');

function validateRepositorySettings() {
    return [
        body('name')
            .notEmpty().withMessage('Requerido').bail(),

        body('visibility')
            .isIn(['Public', 'Private']).withMessage('La visibilidad no es valida').bail(),
    ];
}

module.exports = {
    validateRepositorySettings,
}
