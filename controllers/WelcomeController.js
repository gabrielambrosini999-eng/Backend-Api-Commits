class WelcomeController {
    static index(req, res) {
        res.render('organization-profile');
    }
}

module.exports = WelcomeController;