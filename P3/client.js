const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const chatContainer = document.getElementById("chat_container");
const sendButton = document.getElementById('send_button');
const userContainer = document.getElementById('user_list'); // Elemento donde se mostrará la lista de usuarios

const socket = io();
const msgSound = new Audio('sonido_notificacion.mp3');

// Evento para recibir mensajes del servidor
socket.on("message", (data) => {
  const { username, message } = data;
  display.innerHTML += `<p><strong>${username}:</strong> ${message}</p>`;
  msgSound.play();
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Evento para recibir lista de usuarios conectados
socket.on("usuarios", (usuarios) => {
  userContainer.innerHTML = `<p><strong>Usuarios conectados:</strong></p>`;
  usuarios.forEach(usuario => {
    userContainer.innerHTML += `<p>${usuario}</p>`;
  });
});

function sendMessage() {
  const message = msg_entry.value.trim();
  if (message !== '') {
    socket.send(message);
    msg_entry.value = '';
  }
}

sendButton.addEventListener('click', sendMessage);

msg_entry.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const username = prompt("Por favor, ingresa tu nickname:");
  if (username) {
    socket.emit('username', username);
  }
});

socket.on('usernameError', (error) => {
  alert(error);
  window.location.reload(); 
});