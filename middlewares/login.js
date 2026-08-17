const {User} = require('../models');
const {compare} = require('bcryptjs');
const {body} = require('express-validator');

// SELECT * FROM users WHERE email = ? LIMIT 1
async function getUser(email) {
    return User.findOne({
        where: {
            email: email.trim().toLowerCase()
        }
    });
}

function validateLogin() {
    return [
        body('email')
            .notEmpty().withMessage('Requerido').bail()
            .isEmail().withMessage('El email no es valido').bail()
            .custom(async (value, {req}) => {
                const user = await getUser(value);

                if (user) {
                    req.loginUser = user;
                    return true;
                }

                throw new Error('Usuario no encontrado');
            }),

        body('password')
            .notEmpty().withMessage('Requerido').bail()
            .isLength({min: 6, max: 12}).withMessage('Ingrese 6 a 12 caracteres').bail()
            .custom(async (value, {req}) => {
                if (!req.loginUser) {
                    return true;
                }

                if (await compare(value, req.loginUser.password)) {
                    return true;
                }

                throw new Error('El password no coincide');
            }),
    ]
}

function isLogged(req, res, next) {
    if (req.session.user) {
        return next();
    }

    return res.redirect('/login');
}

module.exports = {
    validateLogin,
    isLogged,
}
