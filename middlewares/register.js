const { User } = require('../models');
const { body } = require('express-validator');

function validateRegister() {
    return [
        body('email')
            .notEmpty().withMessage('Requerido').bail()
            .isEmail().withMessage('El email no es valido').bail()
            .custom(async value => {
                const user = await User.findOne({
                    where: {
                        email: value
                    }
                });

                if (!user) {
                    return true;
                }

                throw new Error('El email ya esta registrado');
            }),

        body('password')
            .notEmpty().withMessage('Requerido').bail()
            .isLength({ min: 8 }).withMessage('Ingrese al menos 8 caracteres'),
    ];
}

module.exports = {
    validateRegister,
};
