# Resumen - CRUD de punta a punta con Express, Sequelize y API REST

## Objetivo de la clase

En esta guia vamos a implementar un CRUD completo desde cero usando Express, Sequelize, migraciones, seeders, controllers, rutas REST y middlewares.

La idea es que cada paso deje el proyecto en un estado estable. Al terminar cada paso, deberias poder revisar el cambio, probar lo que corresponda y hacer un commit.

Ejemplo elegido: `Repository`.

El CRUD final deberia permitir:

- Crear repositorios con `POST`.
- Listar repositorios con `GET`.
- Ver el detalle de un repositorio con `GET`.
- Editar repositorios con `PUT` o `PATCH`.
- Eliminar repositorios con `DELETE`.
- Validar datos antes de guardar.
- Responder siempre con JSON y codigos HTTP correctos.

## 1. Definir el recurso y sus campos

Antes de escribir codigo, definir que entidad se va a administrar.

Para este ejemplo:

```text
Repository
```

Campos sugeridos:

| Campo | Tipo | Requerido | Ejemplo |
| --- | --- | --- | --- |
| `id` | integer | si | `1` |
| `name` | string | si | `backend-demo` |
| `description` | text | no | `Repositorio de practica` |
| `visibility` | enum/string | si | `Public` o `Private` |
| `created_at` | date | si | generado por Sequelize |
| `updated_at` | date | si | generado por Sequelize |

Objetivo del paso:

- Tener claro que datos existen.
- Saber que campos valida la API.
- Saber que campos se reciben y devuelven en JSON.

Verificacion:

- Los campos estan documentados.
- Los nombres coinciden con lo que se usara en modelo, migracion, controller y requests.

Commit sugerido:

```bash
git add .
git commit -m "Define repository CRUD requirements"
```

## 2. Crear la migracion

La migracion define la estructura real de la tabla en la base de datos.

Comando sugerido:

```bash
npx sequelize-cli migration:generate --name create_repositories_table
```

Archivo esperado:

```text
migrations/YYYYMMDDHHMMSS-create_repositories_table.js
```

Contenido sugerido:

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('repositories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      visibility: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'Public',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('repositories');
  },
};
```

Ejecutar la migracion:

```bash
npx sequelize-cli db:migrate
```

Objetivo del paso:

- Crear la tabla `repositories`.
- Poder revertirla con `down`.

Verificacion:

```bash
npx sequelize-cli db:migrate:status
```

Commit sugerido:

```bash
git add migrations
git commit -m "Add repositories table migration"
```

## 3. Crear el modelo

El modelo permite que la aplicacion use la tabla desde JavaScript.

Archivo:

```text
models/repository.js
```

Contenido sugerido:

```js
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Repository extends Model {
    static associate(models) {
      // associations go here
    }
  }

  Repository.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    visibility: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'Public',
    },
  }, {
    sequelize,
    modelName: 'Repository',
    tableName: 'repositories',
    timestamps: true,
    underscored: true,
  });

  return Repository;
};
```

Objetivo del paso:

- Poder importar `Repository` desde `../models`.
- Mantener nombres consistentes con la tabla.

Verificacion:

- `models/index.js` deberia cargar automaticamente el archivo.
- El nombre `modelName` debe ser `Repository`.
- El `tableName` debe ser `repositories`.

Commit sugerido:

```bash
git add models
git commit -m "Add Repository model"
```

## 4. Crear el seeder

El seeder agrega datos iniciales para probar la API sin cargar todo a mano.

Comando sugerido:

```bash
npx sequelize-cli seed:generate --name repositories_seeder
```

Archivo esperado:

```text
seeders/YYYYMMDDHHMMSS-repositories_seeder.js
```

Contenido sugerido:

```js
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('repositories', [
      {
        name: 'backend-demo',
        description: 'Repositorio de practica backend',
        visibility: 'Public',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'private-api',
        description: 'API interna del equipo',
        visibility: 'Private',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('repositories', null, {});
  },
};
```

Ejecutar el seeder:

```bash
npx sequelize-cli db:seed:all
```

Objetivo del paso:

- Tener registros de prueba.
- Confirmar que la migracion y el modelo apuntan a la misma tabla.

Verificacion:

- Consultar la tabla `repositories`.
- Confirmar que existen al menos dos registros.

Commit sugerido:

```bash
git add seeders
git commit -m "Seed repositories data"
```

## 5. Crear el controller REST

El controller contiene la logica del CRUD y responde datos en JSON.

Archivo:

```text
controllers/RepositoryController.js
```

Metodos esperados:

| Metodo | Responsabilidad |
| --- | --- |
| `index` | listar registros |
| `show` | devolver un registro |
| `store` | guardar registro nuevo |
| `update` | guardar cambios |
| `destroy` | eliminar registro |

Estructura sugerida:

```js
const { Repository } = require('../models');

class RepositoryController {
  static async index(req, res, next) {
    try {
      const repositories = await Repository.findAll({
        order: [['created_at', 'DESC']],
      });

      res.status(200).json({
        data: repositories,
      });
    } catch (error) {
      next(error);
    }
  }

  static async show(req, res, next) {
    try {
      const repository = await Repository.findByPk(req.params.id);

      if (!repository) {
        return res.status(404).json({
          message: 'Repository not found',
        });
      }

      res.status(200).json({
        data: repository,
      });
    } catch (error) {
      next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const repository = await Repository.create({
        name: req.body.name,
        description: req.body.description,
        visibility: req.body.visibility,
      });

      res.status(201).json({
        data: repository,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RepositoryController;
```

Objetivo del paso:

- Tener lectura y creacion funcionando desde el controller.
- Usar `try/catch` y `next(error)` en metodos async.
- No renderizar HTML ni depender de sesiones.

Verificacion:

- `GET /api/repositories` devuelve un arreglo JSON.
- `POST /api/repositories` crea un registro y responde `201`.

Commit sugerido:

```bash
git add controllers
git commit -m "Add repository REST controller"
```

## 6. Crear las rutas REST

Las rutas conectan URLs con metodos del controller.

Archivo:

```text
routes/repositories.js
```

Contenido sugerido:

```js
var express = require('express');
var router = express.Router();
var RepositoryController = require('../controllers/RepositoryController');

router.get('/repositories', RepositoryController.index);
router.post('/repositories', RepositoryController.store);
router.get('/repositories/:id', RepositoryController.show);
router.put('/repositories/:id', RepositoryController.update);
router.patch('/repositories/:id', RepositoryController.update);
router.delete('/repositories/:id', RepositoryController.destroy);

module.exports = router;
```

Registrar el router en `app.js` si todavia no esta registrado:

```js
var repositoryRouter = require('./routes/repositories');
app.use('/api', repositoryRouter);
```

Objetivo del paso:

- Que cada accion tenga un endpoint claro.
- Mantener nombres y verbos REST simples.
- Evitar rutas para formularios, pantallas o HTML.

Verificacion:

- `GET /api/repositories` responde JSON.
- `GET /api/repositories/1` responde JSON o `404`.
- `POST /api/repositories` llama al controller.

Commit sugerido:

```bash
git add routes app.js
git commit -m "Wire repository REST routes"
```

## 7. Crear los middlewares de validacion

Los middlewares validan `req.body` antes de llegar al controller.

Archivo:

```text
middlewares/repository.js
```

Contenido sugerido:

```js
const { body, validationResult } = require('express-validator');

function validateRepository() {
  return [
    body('name')
      .notEmpty().withMessage('Required').bail()
      .isLength({ max: 100 }).withMessage('Use up to 100 characters'),

    body('visibility')
      .notEmpty().withMessage('Required').bail()
      .isIn(['Public', 'Private']).withMessage('Visibility is invalid'),
  ];
}

function handleValidation(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    message: 'Validation failed',
    errors: result.mapped(),
  });
}

module.exports = {
  validateRepository,
  handleValidation,
};
```

Conectar el middleware en rutas:

```js
var {
  validateRepository,
  handleValidation,
} = require('../middlewares/repository');

router.post('/repositories', validateRepository(), handleValidation, RepositoryController.store);
router.put('/repositories/:id', validateRepository(), handleValidation, RepositoryController.update);
router.patch('/repositories/:id', validateRepository(), handleValidation, RepositoryController.update);
```

Objetivo del paso:

- Evitar guardar datos incompletos o invalidos.
- Responder errores de validacion en JSON.

Verificacion:

- Enviar body vacio responde `422`.
- La respuesta incluye `message` y `errors`.
- No se crea ni actualiza ningun registro cuando la validacion falla.

Commit sugerido:

```bash
git add middlewares routes
git commit -m "Validate repository API requests"
```

## 8. Completar actualizacion y eliminacion

Agregar `update` y `destroy` al controller.

Comportamiento esperado:

- `update` busca el registro, valida, actualiza y responde JSON.
- `destroy` elimina y responde `204 No Content`.
- Si el registro no existe, responde `404`.

Ejemplo de `update`:

```js
static async update(req, res, next) {
  try {
    const repository = await Repository.findByPk(req.params.id);

    if (!repository) {
      return res.status(404).json({
        message: 'Repository not found',
      });
    }

    await repository.update({
      name: req.body.name,
      description: req.body.description,
      visibility: req.body.visibility,
    });

    res.status(200).json({
      data: repository,
    });
  } catch (error) {
    next(error);
  }
}
```

Ejemplo de `destroy`:

```js
static async destroy(req, res, next) {
  try {
    const repository = await Repository.findByPk(req.params.id);

    if (!repository) {
      return res.status(404).json({
        message: 'Repository not found',
      });
    }

    await repository.destroy();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
```

Objetivo del paso:

- Poder modificar y eliminar registros existentes desde la API.

Verificacion:

- `PUT /api/repositories/:id` cambia los datos.
- `PATCH /api/repositories/:id` cambia los datos.
- `DELETE /api/repositories/:id` elimina el registro y responde `204`.
- Probar un `id` inexistente devuelve `404`.

Commit sugerido:

```bash
git add controllers routes
git commit -m "Complete repository update and delete endpoints"
```

## 9. Definir contrato de respuestas

Antes de dar por cerrado el CRUD, dejar consistente como responde la API.

Contrato sugerido:

| Caso | Codigo | Respuesta |
| --- | --- | --- |
| Lista correcta | `200` | `{ "data": [...] }` |
| Detalle correcto | `200` | `{ "data": { ... } }` |
| Creacion correcta | `201` | `{ "data": { ... } }` |
| Actualizacion correcta | `200` | `{ "data": { ... } }` |
| Eliminacion correcta | `204` | sin body |
| Validacion fallida | `422` | `{ "message": "...", "errors": { ... } }` |
| Registro inexistente | `404` | `{ "message": "Repository not found" }` |
| Error inesperado | `500` | `{ "message": "Internal server error" }` |

Objetivo del paso:

- Que todas las respuestas sean predecibles para clientes HTTP.
- Separar claramente errores de validacion, errores de negocio y errores inesperados.

Verificacion:

- Cada endpoint responde el codigo esperado.
- La API no devuelve HTML en ningun caso.

Commit sugerido:

```bash
git add .
git commit -m "Document repository API response contract"
```

## 10. Probar el flujo completo

Pruebas manuales sugeridas:

1. Ejecutar migraciones.
2. Ejecutar seeders.
3. Levantar la aplicacion.
4. Listar repositorios.
5. Crear un repositorio valido.
6. Intentar crear uno sin `name`.
7. Ver el detalle del repositorio creado.
8. Actualizar un repositorio.
9. Eliminar un repositorio.
10. Probar un `id` inexistente.

Comandos utiles:

```bash
npm test
npm start
```

Ejemplos con `curl`:

```bash
curl http://localhost:3000/api/repositories
```

```bash
curl -X POST http://localhost:3000/api/repositories \
  -H "Content-Type: application/json" \
  -d '{"name":"backend-demo","description":"Repositorio de practica","visibility":"Public"}'
```

```bash
curl -X PUT http://localhost:3000/api/repositories/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"backend-demo-renamed","description":"Repositorio actualizado","visibility":"Private"}'
```

```bash
curl -X DELETE http://localhost:3000/api/repositories/1
```

Objetivo del paso:

- Confirmar que el CRUD funciona de punta a punta como API REST.
- Detectar errores de rutas, nombres de campos, codigos HTTP o validaciones.

Commit sugerido:

```bash
git add .
git commit -m "Verify repository REST CRUD flow"
```

## Checklist final

Antes de dar por terminado el CRUD:

- La migracion crea y elimina la tabla correctamente.
- El modelo usa `tableName` y `underscored` si la tabla usa snake_case.
- El seeder inserta datos validos.
- El controller usa el modelo real, no datos hardcodeados.
- Las rutas usan verbos HTTP REST.
- Los endpoints estan bajo `/api`.
- Los requests usan JSON.
- Los middlewares validan antes de guardar.
- Los errores de validacion responden `422` con JSON.
- Los registros inexistentes responden `404` con JSON.
- Las operaciones async usan `try/catch` y `next(error)`.
- La API no renderiza vistas ni devuelve HTML.

## Secuencia de commits recomendada

```text
Define repository CRUD requirements
Add repositories table migration
Add Repository model
Seed repositories data
Add repository REST controller
Wire repository REST routes
Validate repository API requests
Complete repository update and delete endpoints
Document repository API response contract
Verify repository REST CRUD flow
```
