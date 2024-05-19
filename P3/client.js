const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const chatContainer = document.getElementById("chat_container");
const sendButton = document.getElementById('send_button');


const socket = io();
const msgSound = new Audio('sonido_notificacion.mp3');


socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
  msgSound.play(); // Reproducir el sonido del mensaje
});



msg_entry.onchange = () => {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}

// Función para enviar el mensaje
function sendMessage() {
  if (msg_entry.value)
    socket.send(msg_entry.value);
  
  //-- Borrar el mensaje actual
  msg_entry.value = "";
  }


// Event listener para el botón enviar
sendButton.addEventListener('click', sendMessage);

// Event listener para enviar el mensaje al presionar Enter
msg_entry.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});