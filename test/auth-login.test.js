const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../app');
const LoginController = require('../controllers/LoginController');
const { validateLogin } = require('../middlewares/login');
const { handleValidation } = require('../middlewares/shared');

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);

    server.once('error', reject);
    server.listen(0, () => resolve(server));
  });
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function request(server, options, body) {
  const address = server.address();

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy(new Error(`Request timed out: ${options.method} ${options.path}`));
    }, 1000);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        method: options.method,
        path: options.path,
        headers: options.headers,
      },
      (res) => {
        let responseBody = '';

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          clearTimeout(timeout);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: responseBody,
          });
        });
      }
    );

    req.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

async function runLoginValidators(req) {
  const validators = validateLogin();
  const chains = Array.isArray(validators) ? validators : [validators];

  for (const chain of chains) {
    await chain.run(req);
  }
}

test('GET /login renderiza el formulario de login', async () => {
  const server = await startServer();

  try {
    const response = await request(server, { method: 'GET', path: '/login' });

    assert.equal(response.statusCode, 200);
    assert.match(response.body, /<form[^>]+method="POST"[^>]+action="\/login"/);
    assert.match(response.body, /name="email"/);
    assert.match(response.body, /name="password"/);
  } finally {
    await closeServer(server);
  }
});

test('POST /login con email invalido responde errores de validacion', async () => {
  const server = await startServer();
  const body = new URLSearchParams({
    email: 'usuario-invalido',
    password: 'secret1',
  }).toString();

  try {
    const response = await request(
      server,
      {
        method: 'POST',
        path: '/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
          Referer: '/login',
        },
      },
      body
    );

    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.location, '/login');
  } finally {
    await closeServer(server);
  }
});

test('POST /login con email valido continua el flujo hacia /welcome', async () => {
  const server = await startServer();
  const body = new URLSearchParams({
    email: 'persona@example.com',
    password: 'secret1',
  }).toString();

  try {
    const response = await request(
      server,
      {
        method: 'POST',
        path: '/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      body
    );

    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.location, '/welcome');
    assert.ok(response.headers['set-cookie'].some((cookie) => cookie.startsWith('connect.sid=')));
  } finally {
    await closeServer(server);
  }
});

test('GET /welcome sin sesion redirige al login', async () => {
  const server = await startServer();

  try {
    const response = await request(server, { method: 'GET', path: '/welcome' });

    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.location, '/login');
  } finally {
    await closeServer(server);
  }
});

test('GET /welcome con sesion permite ingresar', async () => {
  const server = await startServer();
  const body = new URLSearchParams({
    email: 'persona@example.com',
    password: 'secret1',
  }).toString();

  try {
    const loginResponse = await request(
      server,
      {
        method: 'POST',
        path: '/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      body
    );
    const cookie = loginResponse.headers['set-cookie'][0].split(';')[0];
    const response = await request(
      server,
      {
        method: 'GET',
        path: '/welcome',
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.statusCode, 200);
  } finally {
    await closeServer(server);
  }
});

test('GET /logout destruye la sesion y redirige al login', async () => {
  const server = await startServer();
  const body = new URLSearchParams({
    email: 'persona@example.com',
    password: 'secret1',
  }).toString();

  try {
    const loginResponse = await request(
      server,
      {
        method: 'POST',
        path: '/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      body
    );
    const cookie = loginResponse.headers['set-cookie'][0].split(';')[0];
    const response = await request(
      server,
      {
        method: 'GET',
        path: '/logout',
        headers: {
          Cookie: cookie,
        },
      }
    );

    assert.equal(response.statusCode, 302);
    assert.equal(response.headers.location, '/login');
  } finally {
    await closeServer(server);
  }
});

test('handleValidation llama next sin enviar respuesta cuando no hay errores', async () => {
  const req = { body: { email: 'persona@example.com', password: 'secret1' } };
  const calls = {
    next: 0,
    send: 0,
  };
  const res = {
    send() {
      calls.send += 1;
    },
  };

  await runLoginValidators(req);
  handleValidation(req, res, () => {
    calls.next += 1;
  });

  assert.equal(calls.next, 1);
  assert.equal(calls.send, 0);
});

test('handleValidation envia errores y no llama next cuando hay errores', async () => {
  const req = {
    body: { email: 'usuario-invalido', password: 'secret1' },
    session: {},
  };
  const calls = {
    next: 0,
    redirect: 0,
    location: null,
  };
  const res = {
    redirect(location) {
      calls.redirect += 1;
      calls.location = location;
    },
  };

  await runLoginValidators(req);
  handleValidation(req, res, () => {
    calls.next += 1;
  });

  assert.equal(calls.next, 0);
  assert.equal(calls.redirect, 1);
  assert.equal(calls.location, 'back');
  assert.equal(req.session.errors.email.path, 'email');
  assert.equal(req.session.errors.email.msg, 'El email no es valido');
  assert.equal(req.session.oldData.email, 'usuario-invalido');
  assert.equal(req.session.oldData.password, undefined);
});

test('validateLogin devuelve solo el primer error por campo', async () => {
  const req = {
    body: {
      email: '',
      password: '',
    },
  };

  await runLoginValidators(req);

  const errors = require('express-validator').validationResult(req).array();
  const emailErrors = errors.filter((error) => error.path === 'email');
  const passwordErrors = errors.filter((error) => error.path === 'password');

  assert.equal(emailErrors.length, 1);
  assert.equal(emailErrors[0].msg, 'Requerido');
  assert.equal(passwordErrors.length, 1);
  assert.equal(passwordErrors[0].msg, 'Requerido');
});

test('LoginController.store extiende la sesion cuando remember esta activo', () => {
  const req = {
    body: {
      email: 'persona@example.com',
      remember: '1',
    },
    session: {
      cookie: {
        maxAge: 600000,
      },
    },
  };
  const res = {
    location: null,
    redirect(location) {
      this.location = location;
    },
  };

  LoginController.store(req, res);

  assert.equal(req.session.cookie.maxAge, 1000 * 60 * 60 * 24 * 7);
  assert.deepEqual(req.session.user, { email: 'persona@example.com' });
  assert.equal(res.location, '/welcome');
});
