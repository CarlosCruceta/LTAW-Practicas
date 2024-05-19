const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const chatContainer = document.getElementById("chat_container");
const sendButton = document.getElementById('send_button');

const socket = io();
const msgSound = new Audio('sonido_notificacion.mp3');

// Evento para recibir mensajes del servidor
socket.on("message", (data) => {
  const { username, message } = data;
  display.innerHTML += `<p><strong>${username}:</strong> ${message}</p>`;
  msgSound.play(); // Reproducir el sonido del mensaje
  // Asegurar que el nuevo mensaje sea visible al usuario
  chatContainer.scrollTop = chatContainer.scrollHeight;
});

// Función para enviar mensajes al servidor
function sendMessage() {
  const message = msg_entry.value.trim();
  if (message !== '') {
    socket.send(message);
    msg_entry.value = '';
  }
}

// Event listener para el botón enviar
sendButton.addEventListener('click', sendMessage);

// Event listener para enviar el mensaje al presionar Enter
msg_entry.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Al cargar la página, pedir al usuario su nombre de usuario
document.addEventListener('DOMContentLoaded', () => {
  const username = prompt("Por favor, ingresa tu nombre de usuario:");
  if (username) {
    // Enviar el nombre de usuario al servidor para que lo registre
    socket.emit('username', username);
  }
});
