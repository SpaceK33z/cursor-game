const WebSocketServer = require('uws').Server;

const wss = new WebSocketServer({ port: 3000 });
const clients = [];

function onMessage(ws, message) {
    // TODO: should handle illegal JSON...
    const payload = JSON.parse(message);
    console.log('received:', payload);
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

wss.on
