const socket = io();

const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (msg !== '') {
    socket.emit('chat message', msg);
    chatInput.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('div');
  item.textContent = msg;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
