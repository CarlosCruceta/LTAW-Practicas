//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const path = require('path');
const express = require('express');
const colors = require('colors');

const PUERTO = 9090;

//-- Crear una nueva aplciacion web
const app = express();

//-- Crear un servidor, asociado a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  // Utiliza res.sendFile para enviar el archivo chat.htm
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/chat.html', (req, res) => {
  // Extraer el nombre de usuario de la query string
  const username = req.query.username;
  console.log(username)
  if (!username) {
    return res.status(400).send('Nombre de usuario no proporcionado');
  }

  // Renderizar la página chat.html y pasar el nombre de usuario como variable
  res.sendFile(path.join(__dirname, 'chat.html'));
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));

//------------------- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  socket.send("")
  const socketId = socket.id;
  io.to(socketId).emit('message', 'Bienvenido');
  io.send("Nuevo miembro se unió al chat");
  console.log('** NUEVA CONEXIÓN **'.yellow);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    io.send("Miembro se salió del chat");
  });  

  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log("Mensaje Recibido!: " + msg.blue);

    //-- Verificar si el mensaje es un comando especial
    if (msg.startsWith('/')) {
      handleCommand(msg, socket);
    } else {
      //-- Reenviar el mensaje a todos los clientes conectados excepto al que lo envió
      io.send(msg);
    }
  });

  function handleCommand(msg, socket) {
    const command = msg.split(' ')[0]; // Obtener el comando sin los argumentos
    switch (command) {
      case '/help':
        socket.send('Comandos soportados:\n/help - Mostrar lista de comandos\n/list - Mostrar el número de usuarios conectados\n/hello - Saludar\n/date - Mostrar la fecha');
        break;
      case '/list':
        socket.send(`Número de usuarios conectados: ${io.engine.clientsCount}`);
        break;
      case '/hello':
        socket.send('¡Hola!');
        break;
      case '/date':
        const currentDate = new Date().toDateString();
        socket.send(`Fecha actual : ${currentDate}`);
        break;
      default:
        socket.send('Comando no reconocido. Escribe /help para ver la lista de comandos disponibles.');
        break;
    }
  }
});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);
