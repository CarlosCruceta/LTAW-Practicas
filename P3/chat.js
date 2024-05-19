//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplicación web
const app = express();

//-- Crear un servidor HTTP asociado a la App de express
const server = http.createServer(app);

//-- Crear el servidor de websockets, asociado al servidor HTTP
const io = socket(server);

// Puntos de entrada de la aplicación web

// Definir el punto de entrada principal de la aplicación web
app.get('/', (req, res) => {
  // Utiliza res.sendFile para enviar el archivo login.html
  res.sendFile(path.join(__dirname, 'login.html'));
});


// Servir archivos estáticos (incluyendo Socket.IO client)
app.use('/', express.static(__dirname));

// Directorio público contiene archivos estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO

// Evento: Nueva conexión recibida
io.on('connect', (socket) => {
  console.log('** NUEVA CONEXIÓN **'.yellow);

  // Manejar evento de ingreso de nombre de usuario
  socket.on('username', (username) => {
    console.log(`Usuario '${username}' conectado`);
    socket.username = username; // Asignar nombre de usuario al socket

    // Emitir mensaje de bienvenida al usuario conectado
    socket.emit('message', {
      username: 'Servidor',
      message: 'Bienvenido al chat!'
    });

    // Emitir mensaje a todos los clientes que un nuevo miembro se unió al chat
    io.emit('message', {
      username: 'Servidor',
      message: `Nuevo miembro '${username}' se unió al chat`
    });
  });

  // Manejar evento de desconexión
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', {
        username: 'Servidor',
        message: `Miembro '${socket.username}' se desconectó`
      });
      console.log(`** CONEXIÓN TERMINADA: Usuario '${socket.username}' **`.yellow);
    }
  });

  // Manejar mensaje recibido
  socket.on('message', (msg) => {
    console.log(`Mensaje recibido de '${socket.username}': ${msg}`.blue);

    // Verificar si el mensaje es un comando especial
    if (msg.startsWith('/')) {
      handleCommand(msg, socket);
    } else {
      // Reenviar el mensaje a todos los clientes conectados incluyendo el nombre de usuario
      io.emit('message', {
        username: socket.username,
        message: msg
      });
    }
  });

  // Función para manejar comandos
  function handleCommand(msg, socket) {
    const command = msg.split(' ')[0]; // Obtener el comando sin los argumentos
    switch (command) {
      case '/help':
        socket.emit('message', {
          username: 'Servidor',
          message: 'Comandos soportados:\n/help - Mostrar lista de comandos\n/list - Mostrar el número de usuarios conectados\n/hello - Saludar\n/date - Mostrar la fecha'
        });
        break;
      case '/list':
        socket.emit('message', {
          username: 'Servidor',
          message: `Número de usuarios conectados: ${io.engine.clientsCount}`
        });
        break;
      case '/hello':
        socket.emit('message', {
          username: 'Servidor',
          message: '¡Hola!'
        });
        break;
      case '/date':
        const currentDate = new Date().toDateString();
        socket.emit('message', {
          username: 'Servidor',
          message: `Fecha actual: ${currentDate}`
        });
        break;
      default:
        socket.emit('message', {
          username: 'Servidor',
          message: 'Comando no reconocido. Escribe /help para ver la lista de comandos disponibles.'
        });
        break;
    }
  }
});

// Lanzar el servidor HTTP
server.listen(PUERTO, () => {
  console.log(`Escuchando en puerto: ${PUERTO}`);
});
