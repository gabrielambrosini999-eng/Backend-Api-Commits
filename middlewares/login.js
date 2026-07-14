var {body} = require('express-validator');

function validateLogin() {
    return [
        body('email').notEmpty().isEmail(),
        body('password').notEmpty().isLength({min: 6, max: 8}),
    ]
}

module.exports = {
    validateLogin,
}
