const { User } = require('./../models')

class RegisterController {
    static create(req, res, next) {
        res.render('account-create');
    }

    static store(req, res, next) {
        // guardar el usuario en la db
        User.create({
            email: req.body.email,
            password: req.body.password,
        }).then(user => {
            res.send(user);
        }).catch(err => {
            res.send(err)
        })
    }
}

module.exports = RegisterController;