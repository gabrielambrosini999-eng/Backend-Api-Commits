class RegisterController {
    static create(req, res, next) {
        res.render('account-create');
    }

    static store(req, res, next) {
        res.send(req.body);
    }
}

module.exports = RegisterController;