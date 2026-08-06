class FileController {
    static edit(req, res) {
        const errors = req.session.errors || {};
        const oldData = req.session.oldData || {};

        req.session.errors = null;
        req.session.oldData = null;

        res.render('file-edit', {
            errors: errors,
            old: function (field, defaultValue) {
                if (Object.prototype.hasOwnProperty.call(oldData, field)) {
                    return oldData[field];
                }
                return defaultValue || '';
            }
        });
    }
    static update(req, res) {

        res.send({
            mensaje: 'Archivo editado correctamente',
            datos: req.body
        });
    }
}
module.exports = FileController;