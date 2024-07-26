const socket = io();

let user;

const chatBox = document.getElementById('chatBox');
const messagesDiv = document.getElementById('chatMessages');
const messageLog = document.getElementById('messageLogs');
const sendButton = document.getElementById('send');

// Utilizamos SweetAlert para el mensaje de bienvenida
// Swall es un objeto que nos permite usar los metodos de la libreria sweetalert2

Swal.fire({
  title: 'Bienvenido',
  text: 'Ingrese su nombre',
  input: 'text',
  inputValidator: (value) => {
    if (!value) {
      return 'Por favor ingrese su nombre!'
    };
  },
  allowOutsideClick: false,
  confirmButtonText: 'Iniciar Chat'
}).then((result) => {
  user = result.value;// Guardamos el valor del input en la variable user
})

// Desde el chatbox capturamos el mensaje y se lo enviamos al backend

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

sendButton.addEventListener("click", () => {
  sendMessage();
});

function sendMessage() {
  const msg = chatBox.value.trim();
  if (msg.length > 0) {
    socket.emit("message", { user: user, message: chatBox.value });
    chatBox.value = "";
  }
}

function formatMessage(message) {
  // Reemplaza el texto rodeado de barras por cursiva primero
  const italicFormattedMessage = message.replace(/\/(.*?)\//g, '<span class="italic">$1</span>');
  // Reemplaza el texto rodeado de asteriscos por negrita después
  const boldFormattedMessage = italicFormattedMessage.replace(/\*(.*?)\*/g, '<span class="font-bold">$1</span>');
  return boldFormattedMessage;
}

socket.on("history", data => {
  const log = document.getElementById("messagesLogs");
  let messages = "";

  data.forEach(message => {
    messages += `${message.user} dice: ${formatMessage(message.message)} <br>`;
  });

  log.innerHTML = messages;
});