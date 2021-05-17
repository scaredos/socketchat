// Make connection to web server
const port = 8080;
const socket = io.connect(`http://${window.location.host}:${port}`);

function encryption(message = '', key = '') {
  let message = CryptoJS.AES.encrypt(message, key);
  return message.toString();
}

function decrypt(message = '', key = '') {
  let message = CryptoJS.AES.decrypt(message, key);
  return message.toString(CryptoJS.enc.Utf8);
}

// Query DOM to add chat
var message = document.getElementById('message');
var username = document.getElementById('username');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');

btn.addEventListener('click', () => {
  let message = encrypt(message, key);

  socket.emit('chat', {
    message: message,
    handle: username.value,
    room: room
  });
  message.value = "";
});

message.addEventListener('keypress', () => {
  socket.emit('typing', username.value);
});

socket.on('chat', (data) => {
  feedback.innerHTML = '';
  let message = decrypt(data.message, key);
  output.innerHTML += '<p><strong>' + data.username + ': </strong>' + message + '</p>';
});

socket.on('typing', (data) => {
  feedback.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
});
