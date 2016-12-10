const { Server } = require('uws');
const url = require('url');

const wss = new Server({ port: 3000 });
const clients = [];

function sendMessage(data) {
    clients.forEach((client) => {
        client.send(JSON.stringify(data));
    });
}

function onMessage(ws, message) {
    // TODO: should handle illegal JSON so the server can't crash...
    const payload = JSON.parse(message);
    if (payload.type === 'MOVE_MY_CURSOR') {
        sendMessage({
            type: 'MOVE_EXT_CURSOR',
            data: payload.data,
        });
    }
}

function onClose(ws, id) {
    // Let others know that this cursor is no longer active.
    sendMessage({
        type: 'DELETE_CURSOR',
        data: { id },
    });

    const index = clients.indexOf(ws);
    if(index >= 0) {
        clients.splice(index, 1);
    }
}

wss.on('connection', function(ws) {
    const uri = url.parse(ws.upgradeReq.url, true);
    const id = uri.query.id;
    if (!id) {
        console.log('Client has not given a `id` query param.');
        return;
    }
    clients.push(ws);
    ws.on('message', (msg) => onMessage(ws, msg));
    ws.on('close', () => onClose(ws, id));
});
