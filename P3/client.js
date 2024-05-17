const display = document.getElementById("display");
const msg_entry = document.getElementById("msg_entry");
const chatContainer = document.getElementById("chat_container");


const socket = io();
const msgSound = new Audio('sonido_notificacion.mp3');
let joined = false; // Bandera para controlar si el usuario se unió al chat

function joinChat(event) {
  event.preventDefault(); // Prevenir el envío del formulario

  var name = document.getElementById("name_entry").value;
  if (name.trim() !== "" && !joined) { // Verificar si el usuario no se ha unido aún
    document.getElementById("name_entry").disabled = true;
    chatContainer.style.display = "block";

    socket.emit('join', name); // Enviar el nombre al servidor
    joined = true; // Establecer la bandera a verdadero
  }
}

socket.on("message", (msg)=>{
  display.innerHTML += '<p style="color:blue">' + msg + '</p>';
  msgSound.play(); // Reproducir el sonido del mensaje
});

function sendMessage() {
  var message = msg_entry.value.trim();
  if (message !== "") {
    socket.send(message);
    msg_entry.value = ""; // Limpiar el campo de entrada después de enviar el mensaje
  }
}
