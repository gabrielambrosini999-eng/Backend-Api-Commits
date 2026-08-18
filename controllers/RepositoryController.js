class RepositoryController {
    static index(req, res, next) {
        const repos = [];
        return res.json(repos);
    }

    static show(req, res, next) {
        const repository = {
            id: req.params.id,
            owner: "Icaro",
            name: "Modulo 4 - Backend",
            description: "Repositorio del proyecto grupal",
            visibility: "Public",
            language: "JavaScript",
            stars: 4.5,
            updatedAt: "2 de agosto de 2026"
        };

        res.render('repository', {
            repository
        });
    }

    static create(req, res) {
        const errors = req.session.errors || {};
        const oldData = req.session.oldData || {};
        req.session.errors = null;
        req.session.oldData = null;

        res.render('repository-settings', {
            action : req.url,
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
        const name = req.body.name;
        const description = req.body.description;
        const visibility = req.body.visibility;

        res.redirect('/repositories/' + req.params.id + '/settings');
    }
}

module.exports = RepositoryController;
