var {body} = require('express-validator');

function validateLogin() {
    return [
        body('email').notEmpty().withMessage('Requerido'),
        body('email').isEmail().withMessage('El email no es valido'),

        body('password').notEmpty().withMessage('Requerido'),
        body('password').isLength({min: 6, max: 8}).withMessage('Ingrese 6 a 8 caracteres'),
    ]
}

function isLogged(req, res, next) {
    if (req.cookies.session_id) {
        return next();
    }

    return res.redirect('/login');
}

module.exports = {
    validateLogin,
    isLogged,
}
