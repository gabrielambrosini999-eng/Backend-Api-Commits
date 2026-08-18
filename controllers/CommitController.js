class CommitController {
    static index(req, res) {
        const commits = [
            {
                mensaje: "Agregar validación de email",
                autor: "Ana",
                fecha: "hace 10 minutos",
                hash: "9f31c2a",
                rama: "main"
            },
            {
                mensaje: "Actualizar mensajes del formulario",
                autor: "Martín",
                fecha: "ayer",
                hash: "4ac08be",
                rama: "main"
            },
            {
                mensaje: "Corregir estilos del login",
                autor: "Lucía",
                fecha: "15/08/2026",
                hash: "7be912f",
                rama: "feature/login"
            }
        ];
        res.render("commit", {
            commits
        });
    }
}
module.exports = CommitController;