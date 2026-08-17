var {validationResult} = require('express-validator');

function handleValidation(req, res, next) {
    const result = validationResult(req);

    if (result.isEmpty()) {
        return next();
    }

    req.session.errors = result.mapped();
    req.session.oldData = {...req.body};
    delete req.session.oldData.password;

    const referrer = typeof req.get === 'function'
        ? req.get('Referrer') || req.get('Referer')
        : null;

    return res.redirect(referrer || req.originalUrl || '/');
}

module.exports = {
    handleValidation
};
