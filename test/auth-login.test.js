const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

const app = require('../app');
const { validateLogin, handleValidation } = require('../middlewares/login');

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
        },
      },
      body
    );

    const payload = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.ok(Array.isArray(payload.errors));
    assert.ok(payload.errors.some((error) => error.path === 'email'));
    assert.notEqual(response.headers.location, '/welcome');
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
  const req = { body: { email: 'usuario-invalido', password: 'secret1' } };
  const calls = {
    next: 0,
    send: 0,
    payload: null,
  };
  const res = {
    send(payload) {
      calls.send += 1;
      calls.payload = payload;
    },
  };

  await runLoginValidators(req);
  handleValidation(req, res, () => {
    calls.next += 1;
  });

  assert.equal(calls.next, 0);
  assert.equal(calls.send, 1);
  assert.ok(Array.isArray(calls.payload.errors));
  assert.ok(calls.payload.errors.some((error) => error.path === 'email'));
});
