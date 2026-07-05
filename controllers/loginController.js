class LoginController {
    static create(req, res) {
        res.render('login');
    }

    static store(req, res) {
        res.redirect('/welcome');
    }
}

module.exports = LoginController;