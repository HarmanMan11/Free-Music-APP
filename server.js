const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let chatHistory = [];

wss.on('connection', (ws) => {
  // Отправляем историю чата новому клиенту
  ws.send(JSON.stringify({ type: 'history', data: chatHistory }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      if(msg.type === 'message') {
        chatHistory.push(msg.data);
        if(chatHistory.length > 100) chatHistory.shift();

        // Рассылаем всем подключенным клиентам
        wss.clients.forEach(client => {
          if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', data: msg.data }));
          }
        });
      }
    } catch(e) {
      console.error('Invalid message', e);
    }
  });
});

console.log('WebSocket сервер запущен на ws://localhost:8080');
