class BranchController {
    static list(req, res, next) {

        // aca se leen las bases de datos y/o array y/o objetos

        const branches = [
            {
                name: 'rama',
                lastCommit: 'Rama predeterminada - protegida',
                author: 'Juan',
                date: '2026-07-20 14:30',
                isProtected: true
            },
            {
                name: 'feature/email-validation',
                lastCommit: 'Ultimo commit hace 10 minutos',
                author: 'Manus',
                date: '2026-07-21 10:00',
                isProtected: false
            },
            {
                name: 'hotfix/login-timeout',
                lastCommit: 'Lista para comparar con main',
                author: 'Carlos',
                date: '2026-07-19 18:45',
                isProtected: false
            }
        ];

        res.render('branches-list', { 
            title: 'Listado de lineas de trabajo activas en el repositorio.', 
            branches: branches 
        });
    }
      
}

module.exports = BranchController;
