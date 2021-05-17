// Make connection to websocket server
const socket = io.connect(window.location.href);

function encrypt(message = '', key = '') {
  // Disallow spam of blank messages
  if (message === "") {
    return null;
  }

  var message = CryptoJS.AES.encrypt(message, key);
  return message.toString();
}

function decrypt(message = '', key = '') {
  var code = CryptoJS.AES.decrypt(message, key);
  var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

  // decryptedMessage is blank when key is invalid
  if (decryptedMessage === "") {
    return null;
  }

  return decryptedMessage;
}

// Query DOM
var message = document.getElementById('message'),
  btn = document.getElementById('send'),
  output = document.getElementById('output'),
  feedback = document.getElementById('feedback');

// Define username
const handle = prompt("Username", "");
// Allow users to choose a room
const room = prompt("Room", "main");

// Change the title of chat and window based on room
let chatTitle = document.getElementsByTagName("h2")[0];
let windowTitle = document.getElementsByTagName("title")[0];

chatTitle.innerText = `SocketChat - #${room}`;
windowTitle.innerText = chatTitle.innerText;

// Encryption key for message encryption/decryption
const enckey = prompt("Encryption Key", "");

// Emit events (upon click, emit to chat the message and handle)
btn.addEventListener('click', function() {
  let text = encrypt(message.value, enckey);
  // disallow spam of blank messages
  if (text === null) {
    message.value == "";
    return null;
  }

  // send chat to server
  socket.emit('chat', {
    message: text,
    handle: handle,
    room: room
  });
  // make message box blank after message sent
  message.value = "";
});

// Attach event listener to message input field
message.addEventListener('keypress', function(e) {
  if (e.key === "Enter") {
    btn.click();
  }
  socket.emit('typing', {
    handle: handle,
    room: room
  });
});

// Listen for events
socket.on('chat', function(data) {
  feedback.innerHTML = '';
  // Only try to display messages that are in the same room
  if (data.room === room) {
    let text = decrypt(data.message, enckey);
    // Simple check to see if key is valid
    if (text !== null) {
      output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + text + '</p>';
    }
  }
});

socket.on('typing', function(data) {
  if (data.room == room) {
    feedback.innerHTML = '<p><em>' + data.handle + ' is typing a message...</em></p>';
  }
});
