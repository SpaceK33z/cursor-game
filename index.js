const { Server } = require('uws');

const wss = new Server({ port: 3000 });
const clients = [];

function onMessage(ws, message) {
    // TODO: should handle illegal JSON so the server can't crash...
    const payload = JSON.parse(message);
    if (payload.type === 'MOVE_MY_CURSOR') {
        clients.forEach((client) => {
            client.send(JSON.stringify({
                type: 'MOVE_EXT_CURSOR',
                data: payload.data,
            }));
        });
    }
}

wss.on('connection', function(ws) {
    clients.push(ws);
    ws.on('message', (msg) => onMessage(ws, msg));
    ws.on('close', () => {
        const index = clients.indexOf(ws);
        if(index >= 0) {
            clients.splice(index, 1);
        }
    });
});
