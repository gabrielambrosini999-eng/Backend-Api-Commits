class LoginController {
    static create(req, res) {
        res.render('login', {
            errors : req.session.errors
        });
    }

    static store(req, res) {
        // crear el identificador de la sesión
        const sessionId = Date.now();

        // se envía mediante una cookie
        res.cookie('session_id', sessionId, {maxAge: 600000});
        
        // se responde con la redirección
        res.redirect('/welcome');
    }
}

module.exports = LoginController;