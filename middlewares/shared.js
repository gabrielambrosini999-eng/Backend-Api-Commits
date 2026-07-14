var {validationResult} = require('express-validator');

function handleValidation(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    return res.send({errors: result.array()});
}

module.exports = handleValidation;