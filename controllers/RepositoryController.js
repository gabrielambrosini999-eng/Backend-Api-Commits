class RepositoryController {

    static index(req, res, next) {

        const repository = {
            owner: "Icaro",
            name: "Modulo 4 - Backend",
            description: "Repositorio del proyecto grupal",
            visibility: "Publico",
            language: "JavaScript",
            stars: 4.5,
            updatedAt: "2 de agosto de 2026"
        };

        res.render('repository', {
            repository
        });
    }

    static settings(req, res, next) {

        res.render('repository-settings');
    }
}

module.exports = RepositoryController;