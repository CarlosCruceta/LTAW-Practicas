const socket = require('socket.io');
const http = require('http');
const path = require('path');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;
const SERVER = 'Server';

const app = express();
const server = http.createServer(app);
const io = socket(server);

// Conjunto para almacenar los nombres de usuario conectados
const usuariosConectados = new Set();

// Puntos de entrada de la aplicación web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.use('/', express.static(__dirname));
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO

io.on('connect', (socket) => {
  console.log('** NUEVA CONEXIÓN **'.yellow);

  socket.on('username', (username) => {
    if (usuariosConectados.has(username)) {
      // Si el nombre de usuario ya está en uso, enviar un mensaje de error
      socket.emit('usernameError', 'El nickname ya está en uso. Por favor, elige otro.');
      return;
    }



    console.log(`Usuario '${username}' conectado`);
    socket.username = username;
    usuariosConectados.add(username); // Agregar usuario al conjunto de usuarios conectados

    io.emit('usuarios', Array.from(usuariosConectados)); // Enviar lista actualizada de usuarios a todos los clientes

    socket.emit('message', {
      username: SERVER,
      message: `Bienvenid@ al chat, ${username}!`
    });

    io.emit('message', {
      username: SERVER,
      message: `${username} se unió al chat`
    });
  });

  socket.on('disconnect', () => {
    if (socket.username && usuariosConectados.has(socket.username)) {
      usuariosConectados.delete(socket.username); // Eliminar usuario del conjunto de usuarios conectados
      io.emit('usuarios', Array.from(usuariosConectados)); // Enviar lista actualizada de usuarios a todos los clientes

      io.emit('message', {
        username: SERVER,
        message: `${socket.username} se desconectó`
      });
      console.log(`** CONEXIÓN TERMINADA: Usuario '${socket.username}' **`.yellow);
    }
  });

  socket.on('message', (msg) => {
    console.log(`Mensaje recibido de '${socket.username}': ${msg}`.blue);

    if (msg.startsWith('/')) {
      handleCommand(msg, socket);
    } else {
      io.emit('message', {
        username: socket.username,
        message: msg
      });
    }
  });

  function handleCommand(msg, socket) {
    const command = msg.split(' ')[0];
    switch (command) {
      case '/help':
        socket.emit('message', {
          username: SERVER,
          message: 'Comandos soportados:\n/help - Mostrar lista de comandos\n/list - Mostrar el número de usuarios conectados\n/hello - Saludar\n/date - Mostrar la fecha'
        });
        break;
      case '/list':
        socket.emit('message', {
          username: SERVER,
          message: `Número de usuarios conectados: ${io.engine.clientsCount}`
        });
        break;
      case '/hello':
        socket.emit('message', {
          username: SERVER,
          message: '¡Hola!'
        });
        break;
      case '/date':
        const currentDate = new Date().toDateString();
        socket.emit('message', {
          username: SERVER,
          message: `Fecha actual: ${currentDate}`
        });
        break;
      default:
        socket.emit('message', {
          username: SERVER,
          message: 'Comando no reconocido. Escribe /help para ver la lista de comandos disponibles.'
        });
        break;
    }
  }
});

server.listen(PUERTO, () => {
  console.log(`Escuchando en puerto: ${PUERTO}`);
});
