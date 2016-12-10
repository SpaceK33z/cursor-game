export default function(id, handlers) {
    const wss = new WebSocket(`${CONFIG.socketUrl}?id=${id}`);

    wss.onopen = function(evt) {
        handlers.open();
    };

    wss.onclose = function(evt) {
        // TODO: retry logic
        // handlers.close();
    };

    wss.onmessage = function(evt) {
        const msg = JSON.parse(evt.data);
        if (handlers[msg.type]) {
            handlers[msg.type](msg.data);
        }
    };

    this.send = function(msg) {
        wss.send(JSON.stringify(msg));
    }
}
