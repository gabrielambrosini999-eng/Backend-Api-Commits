const {User} = require('./../models')
const {hashSync} = require('bcryptjs');

class RegisterController {
    static create(req, res, next) {
        const errors = req.session.errors || {};
        const oldData = req.session.oldData || {};
        req.session.errors = null;
        req.session.oldData = null;

        res.render('account-create', {
            errors: errors,
            old: function (field, defaultValue) {
                if (Object.prototype.hasOwnProperty.call(oldData, field)) {
                    return oldData[field];
                }

                return defaultValue || '';
            }
        });
    }

    static store(req, res, next) {
        const pwd = hashSync(req.body.password);

        User.create({
            email: req.body.email,
            password: pwd,
        }).then(user => {
            res.status(201).send({
                id: user.id,
                email: user.email,
            });
        }).catch(err => {
            next(err);
        })
    }
}

module.exports = RegisterController;
