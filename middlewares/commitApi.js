var { body, param, validationResult } = require('express-validator');

function validateRepositoryIdParam() {
    return [
        param ('repositoryId')
            .isInt({ min: 1 })
            .withMessage('El ID del repositorio debe ser un número mayor que cero'),
    ];
}

function validateCommitBody() {
    return [
        body('message')
            .exists({ checkFalsy: true }).withMessage('El campo mensaje es obligatorio')
            .bail()
            .isString().withMessage('El campo mensaje debe ser texto')
            .bail()
            .trim()
            .notEmpty().withMessage('El campo mensaje no puede estar vacío')
            .bail()
            .isLength({ max: 255 }).withMessage('El campo mensaje no puede tener más de 255 caracteres'),

        body('repository_id')
            .optional({ nullable: true })
            .isInt().withMessage('El campo Id del repositorio debe ser un número'),

        body('branch_id')
            .optional({ nullable: true })
            .isInt().withMessage('El campo Id de la rama debe ser un número'),

        body('user_id')
            .optional({ nullable: true })
            .isInt().withMessage('El campo Id del usuario debe ser un número'),
    ];
}

function handleApiValidation(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        errors: result.array(),
    });
}

module.exports = {
    validateRepositoryIdParam,
    validateCommitBody,
    handleApiValidation
};