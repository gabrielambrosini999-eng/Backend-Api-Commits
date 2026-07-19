var {validationResult} = require('express-validator');

function handleValidation(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    req.session.errors = result.mapped();

    return res.redirect('back');
}

module.exports = {
    handleValidation
};
