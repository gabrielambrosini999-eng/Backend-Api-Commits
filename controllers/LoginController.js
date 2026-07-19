class LoginController {
    static create(req, res) {
        const errors = req.session.errors || [];
        req.session.errors = null;

        res.render('login', {
            errors: errors
        });
    }

    static store(req, res) {
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
