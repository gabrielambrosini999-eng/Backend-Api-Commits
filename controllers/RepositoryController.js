class RepositoryController {
    
    static index(req, res, next) {

        const repository = {
            owner: "Icaro",
            name: "Modulo 4 - Backend",
            description: "Repositorio del proyecto grupal",
            visibility: "public",
            language: "JavaScript",
            stars: "4.5",
            updateAt: "2 de agosto de 2026"
        };

        res.render('repository', {
            repository
        });
    }
}

module.exports = RepositoryController;