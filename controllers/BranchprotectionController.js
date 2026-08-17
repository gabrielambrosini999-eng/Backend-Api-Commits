class BranchprotectionController {

    static create(req, res , next) {
        const errors = req.session.errors || {};
        const oldData = req.session.oldData || {};
        req.session.errors = null;
        req.session.oldData = null;

        res.render('branch-protection', {
            errors: errors,
            //errores: errors,
            old: function (field, defaultValue) {
                if (Object.prototype.hasOwnProperty.call(oldData, field)) {
                    return oldData[field];
                }

                return defaultValue || '';
            }
        });
    }

    // recibir los datos aca los muestra en json o los graba en la base de datos
    static store(req, res) {
        res.json(req.body);

        }

    // elimina registros
    static destroy (req, res) {
    //    res.json(req.body);
        }
}

module.exports = BranchprotectionController;

/*
index: Lista todos los elementos (ej. muestra todos los productos).
show: Muestra un solo elemento específico usando su ID.
create: Devuelve la vista/formulario HTML para registrar un elemento nuevo.
store: Recibe los datos de create y los guarda en la base de datos.
edit: Devuelve la vista/formulario HTML para editar un elemento existente.
update: Recibe los datos de edit y actualiza el elemento en la base de datos.
destroy: Elimina un elemento por completo del sistema.
*/

/*
GET        /comments/:id
GET        /comments/:id/edit
PUT/PATCH  /comments/:id
DELETE     /comments/:id
*/

/*
Esto genera las siguientes rutas.

GET /posts
Acción: PostsController.index
Nombre: posts.index
Propósito: Mostrar una lista de todas las publicaciones
GET /posts/create
Acción: PostsController.create
Nombre: posts.create
Propósito: Mostrar formulario para crear una nueva publicación
POST /posts
Acción: PostsController.store
Nombre: posts.store
Propósito: Almacenar una publicación recién creada
GET /posts/:id
Acción: PostsController.show
Nombre: posts.show
Propósito: Mostrar una publicación específica
GET /posts/:id/edit
Acción: PostsController.edit
Nombre: posts.edit
Propósito: Mostrar formulario para editar una publicación
PUT|PATCH /posts/:id
Acción: PostsController.update
Nombre: posts.update
Propósito: Actualizar una publicación específica
DELETE /posts/:id
Acción: PostsController.destroy
Nombre: posts.destroy
Propósito: Eliminar una publicación específica
*/

/* esta nueva denominacion es para usarlos en frontend
getAll o list (en lugar de index)
getOne o getById (en lugar de show)
create o add (en lugar de store)
update o modify (en lugar de update)
delete o remove (en lugar de destroy)
*/