class LoginController {
    static create(req, res) {
        const errors = req.session.errors || {};
        const oldData = req.session.oldData || {};
        req.session.errors = null;
        req.session.oldData = null;

        res.render('login', {
            errors: errors,
            old: function (field, defaultValue) {
                if (Object.prototype.hasOwnProperty.call(oldData, field)) {
                    return oldData[field];
                }

                return defaultValue || '';
            }
        });
    }

    static store(req, res) {
        if (req.body.remember) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
        }

        req.session.user = {
            email: req.body.email
        };

        res.redirect('/welcome');
    }

    static destroy(req, res) {
        req.session.destroy(function () {
            res.redirect('/login');
        });
    }
}

module.exports = LoginController;
