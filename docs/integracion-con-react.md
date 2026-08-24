# Integracion con React

## Objetivo

El objetivo de esta guia es entender como conectar un backend hecho con Express con una aplicacion frontend hecha con React.

La idea central es esta:

```text
React pide datos -> Express responde JSON -> React muestra esos datos en pantalla
```

Cuando Express responde HTML usando `res.render`, estamos trabajando con vistas del backend.

Cuando Express responde datos usando `res.json`, estamos creando un endpoint tipo API.

React normalmente consume endpoints tipo API, porque React se encarga de construir la pantalla en el navegador.

## 1. Que es un endpoint tipo API

Un endpoint es una URL del backend que responde a una peticion.

Ejemplos:

```text
GET /repositories
GET /repositories/1
POST /repositories
```

Un endpoint tipo API no devuelve una pagina HTML completa. Devuelve datos, normalmente en formato JSON.

Ejemplo de respuesta JSON:

```json
{
  "id": 1,
  "owner": "Icaro",
  "name": "Modulo 4 - Backend",
  "description": "Repositorio del proyecto grupal",
  "visibility": "Public",
  "language": "JavaScript",
  "stars": 4.5
}
```

JSON significa JavaScript Object Notation. Es un formato de texto que se parece mucho a un objeto de JavaScript, por eso es comodo para comunicar backend y frontend.

## 2. Diferencia entre vista EJS y API

En este proyecto ya existen vistas EJS. Por ejemplo:

```js
res.render('repository', {
    repository
});
```

Eso significa:

```text
Express arma el HTML y se lo manda listo al navegador.
```

En cambio, un endpoint API hace esto:

```js
res.json(repository);
```

Eso significa:

```text
Express manda datos. React recibe esos datos y arma la pantalla.
```

Ambas formas son validas, pero se usan para objetivos distintos.

## 3. Ejemplo de backend: crear un endpoint API en Express

Supongamos que queremos exponer el detalle de un repositorio para que React pueda consumirlo.

Podemos crear una ruta como esta:

```text
GET /api/repositories/:id
```

La palabra `api` en la URL no es obligatoria, pero ayuda a distinguir rutas que devuelven JSON de rutas que renderizan HTML.

### 3.1. Controller de ejemplo

Archivo sugerido:

```text
controllers/RepositoryApiController.js
```

Contenido:

```js
class RepositoryApiController {
    static show(req, res) {
        const repository = {
            id: Number(req.params.id),
            owner: 'Icaro',
            name: 'Modulo 4 - Backend',
            description: 'Repositorio del proyecto grupal',
            visibility: 'Public',
            language: 'JavaScript',
            stars: 4.5,
            updatedAt: '2 de agosto de 2026'
        };

        res.json(repository);
    }
}

module.exports = RepositoryApiController;
```

Puntos importantes:

- `req.params.id` lee el valor que viene en la URL.
- Si la URL es `/api/repositories/7`, entonces `req.params.id` vale `"7"`.
- `Number(req.params.id)` convierte ese texto a numero.
- `res.json(repository)` responde datos JSON.

### 3.2. Ruta de ejemplo

Archivo sugerido:

```text
routes/api.js
```

Contenido:

```js
var express = require('express');
var router = express.Router();
var RepositoryApiController = require('../controllers/RepositoryApiController');

router.get('/repositories/:id', RepositoryApiController.show);

module.exports = router;
```

Esta ruta define:

```text
GET /repositories/:id
```

Pero todavia falta montarla en `app.js`.

### 3.3. Registrar la ruta en app.js

En `app.js` se importa el router:

```js
var apiRouter = require('./routes/api');
```

Y luego se registra:

```js
app.use('/api', apiRouter);
```

Con eso, la ruta final queda:

```text
GET /api/repositories/:id
```

Ejemplo real:

```text
GET http://localhost:3000/api/repositories/1
```

## 4. Probar el endpoint antes de usar React

Antes de conectar React, conviene probar el backend solo.

Si el servidor Express esta corriendo en:

```text
http://localhost:3000
```

Abrimos en el navegador:

```text
http://localhost:3000/api/repositories/1
```

Deberiamos ver algo como:

```json
{
  "id": 1,
  "owner": "Icaro",
  "name": "Modulo 4 - Backend",
  "description": "Repositorio del proyecto grupal",
  "visibility": "Public",
  "language": "JavaScript",
  "stars": 4.5,
  "updatedAt": "2 de agosto de 2026"
}
```

Si esto no funciona, React tampoco va a funcionar. Primero se corrige el backend.

## 5. Crear un proyecto React

Una forma simple de crear un proyecto React moderno es con Vite.

Comando:

```bash
npm create vite@latest frontend -- --template react
```

Entramos a la carpeta:

```bash
cd frontend
```

Instalamos dependencias:

```bash
npm install
```

Levantamos React:

```bash
npm run dev
```

Normalmente Vite corre en:

```text
http://localhost:5173
```

Entonces tendriamos:

```text
Backend Express: http://localhost:3000
Frontend React:  http://localhost:5173
```

## 6. Consumir el endpoint desde React

React puede pedir datos al backend usando `fetch`.

Ejemplo completo:

Archivo:

```text
src/App.jsx
```

Contenido:

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/repositories/1')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo obtener el repositorio');
        }

        return response.json();
      })
      .then((data) => {
        setRepository(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando repositorio...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main style={{ fontFamily: 'system-ui', padding: '2rem' }}>
      <h1>
        {repository.owner}/{repository.name}
      </h1>

      <p>{repository.description}</p>

      <ul>
        <li>Visibilidad: {repository.visibility}</li>
        <li>Lenguaje: {repository.language}</li>
        <li>Estrellas: {repository.stars}</li>
        <li>Ultima actualizacion: {repository.updatedAt}</li>
      </ul>
    </main>
  );
}

export default App;
```

## 7. Explicacion linea por linea

### 7.1. Importar hooks

```jsx
import { useEffect, useState } from 'react';
```

React usa hooks para manejar estado y efectos.

- `useState` guarda datos que pueden cambiar.
- `useEffect` ejecuta codigo cuando el componente se monta.

### 7.2. Estado del componente

```jsx
const [repository, setRepository] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

Tenemos tres estados:

- `repository`: guarda los datos del repositorio.
- `loading`: indica si todavia estamos esperando la respuesta.
- `error`: guarda un mensaje si algo falla.

Al principio:

```text
repository = null
loading = true
error = null
```

### 7.3. Pedir datos al backend

```jsx
useEffect(() => {
  fetch('http://localhost:3000/api/repositories/1')
    ...
}, []);
```

`useEffect` se ejecuta cuando el componente aparece en pantalla.

El array vacio `[]` significa:

```text
Ejecutar esto una sola vez.
```

`fetch` hace una peticion HTTP al backend.

### 7.4. Revisar si la respuesta fue correcta

```jsx
if (!response.ok) {
  throw new Error('No se pudo obtener el repositorio');
}
```

`response.ok` es `true` cuando el servidor responde con un codigo exitoso, por ejemplo:

```text
200 OK
```

Si el backend responde `404`, `500` u otro error, lanzamos un error para mostrarlo en pantalla.

### 7.5. Convertir la respuesta a JSON

```jsx
return response.json();
```

El backend envia texto JSON. React necesita convertirlo a un objeto JavaScript.

Por ejemplo, esto:

```json
{
  "name": "Modulo 4 - Backend"
}
```

se convierte en:

```js
{
  name: 'Modulo 4 - Backend'
}
```

### 7.6. Guardar los datos

```jsx
.then((data) => {
  setRepository(data);
})
```

Cuando llegan los datos, los guardamos en el estado `repository`.

Cuando cambia el estado, React vuelve a renderizar la pantalla.

### 7.7. Manejar errores

```jsx
.catch((error) => {
  setError(error.message);
})
```

Si falla la peticion, guardamos el mensaje de error.

Puede fallar por varias razones:

- El backend no esta corriendo.
- La URL esta mal escrita.
- El endpoint no existe.
- El backend respondio con error.
- Hay un problema de CORS.

### 7.8. Terminar la carga

```jsx
.finally(() => {
  setLoading(false);
});
```

Esto se ejecuta tanto si todo salio bien como si hubo error.

Sirve para dejar de mostrar:

```text
Cargando repositorio...
```

## 8. Que pasa en pantalla

Mientras React espera la respuesta:

```jsx
if (loading) {
  return <p>Cargando repositorio...</p>;
}
```

Si hubo error:

```jsx
if (error) {
  return <p>Error: {error}</p>;
}
```

Si todo salio bien:

```jsx
return (
  <main>
    ...
  </main>
);
```

React muestra el repositorio usando datos reales recibidos desde Express.

## 9. Problema comun: CORS

Cuando React corre en `localhost:5173` y Express corre en `localhost:3000`, para el navegador son origenes distintos.

```text
http://localhost:5173
http://localhost:3000
```

Aunque ambos esten en la misma computadora, los puertos son distintos.

El navegador puede bloquear la peticion por CORS.

CORS significa Cross-Origin Resource Sharing.

Si aparece un error parecido a este:

```text
Access to fetch at 'http://localhost:3000/api/repositories/1'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

entonces el backend debe permitir que React le pida datos.

### 9.1. Solucion simple con middleware manual

En `app.js`, antes de las rutas, se puede agregar:

```js
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

Esto le dice al navegador:

```text
El frontend de localhost:5173 tiene permiso para pedir datos a este backend.
```

Para una app real se debe configurar con mas cuidado, pero para aprender es suficiente.

## 10. Version con async/await

El mismo ejemplo tambien se puede escribir usando `async/await`.

```jsx
import { useEffect, useState } from 'react';

function App() {
  const [repository, setRepository] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRepository() {
      try {
        const response = await fetch('http://localhost:3000/api/repositories/1');

        if (!response.ok) {
          throw new Error('No se pudo obtener el repositorio');
        }

        const data = await response.json();
        setRepository(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadRepository();
  }, []);

  if (loading) {
    return <p>Cargando repositorio...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <main>
      <h1>{repository.name}</h1>
      <p>{repository.description}</p>
    </main>
  );
}

export default App;
```

`async/await` no cambia lo que hace el codigo. Solo cambia la forma de escribirlo.

## 11. Enviar datos desde React al backend

Hasta ahora usamos `GET`, que sirve para leer datos.

Para crear o guardar datos se usa normalmente `POST`.

Ejemplo:

```jsx
async function createRepository() {
  const response = await fetch('http://localhost:3000/api/repositories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'nuevo-repo',
      description: 'Repositorio creado desde React',
      visibility: 'Public'
    })
  });

  const data = await response.json();
  console.log(data);
}
```

Puntos importantes:

- `method: 'POST'` indica que queremos enviar datos.
- `headers` avisa que enviamos JSON.
- `JSON.stringify` convierte un objeto JavaScript a texto JSON.
- El backend necesita tener `app.use(express.json())` para leer ese JSON.

En este proyecto `app.js` ya tiene:

```js
app.use(express.json());
```

Eso permite leer datos enviados como JSON usando:

```js
req.body
```

## 12. Endpoint POST de ejemplo en Express

Ejemplo simple:

```js
router.post('/repositories', function (req, res) {
    const repository = {
        id: 10,
        name: req.body.name,
        description: req.body.description,
        visibility: req.body.visibility
    };

    res.status(201).json(repository);
});
```

Si React envia:

```json
{
  "name": "nuevo-repo",
  "description": "Repositorio creado desde React",
  "visibility": "Public"
}
```

Express puede responder:

```json
{
  "id": 10,
  "name": "nuevo-repo",
  "description": "Repositorio creado desde React",
  "visibility": "Public"
}
```

## 13. Flujo completo

El flujo completo seria:

```text
1. El usuario abre React en http://localhost:5173
2. React monta el componente App
3. useEffect ejecuta fetch
4. fetch pide http://localhost:3000/api/repositories/1
5. Express recibe la peticion
6. Express ejecuta el controller
7. El controller responde JSON
8. React recibe JSON
9. React guarda los datos en useState
10. React vuelve a renderizar
11. El usuario ve el repositorio en pantalla
```

## 14. Checklist para alumnos

Antes de decir "no funciona", revisar:

- El backend esta corriendo.
- El frontend esta corriendo.
- La URL del fetch es correcta.
- El endpoint existe en Express.
- El endpoint responde JSON.
- El navegador no muestra error de CORS.
- React maneja `loading`.
- React maneja `error`.
- React no intenta leer propiedades de `null`.

Ejemplo de error comun:

```jsx
return <h1>{repository.name}</h1>;
```

Si `repository` todavia es `null`, eso rompe.

Por eso antes se hace:

```jsx
if (loading) {
  return <p>Cargando...</p>;
}
```

## 15. Resumen

Para integrar Express con React necesitamos:

1. Crear un endpoint API en Express.
2. Responder con `res.json`.
3. Probar el endpoint directamente.
4. Crear un componente React.
5. Usar `fetch` para pedir datos.
6. Guardar los datos con `useState`.
7. Ejecutar la peticion con `useEffect`.
8. Mostrar estados de carga, error y exito.
9. Resolver CORS si React y Express corren en puertos distintos.

La frase mas importante:

```text
Express entrega datos. React construye la interfaz.
```
