// Socket logic

const WEBSOCKET_URL = 'ws://localhost:3000';

const wss = new WebSocket(WEBSOCKET_URL);

function wssSend(msg) {
    wss.send(JSON.stringify(msg));
}

wss.onopen = function(evt) {
    initialize();
};

wss.onmessage = function(evt) {
    const payload = JSON.parse(evt.data);
    if (payload.type === 'MOVE_EXT_CURSOR') {
        handleExtCursor(payload.data);
    }
};

wss.onclose = function(evt) {
    console.log('Closed', evt);
};

// UUID generation
function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const uniqueId = guid();

// Debouncer
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Cursor tracking logic
function initialize() {
    document.onmousemove = debounce(handleMouseMove, 10);
    const width = window.innerWidth;
    const height = window.innerHeight;

    function handleMouseMove(event) {
        wssSend({
            type: 'MOVE_MY_CURSOR',
            data: {
                id: uniqueId,
                x: (event.pageX / width) * 100,
                y: (event.pageY / height) * 100,
            },
        });
    }
}

// External cursors logic
function handleExtCursor(data) {
    const x = data.x;
    const y = data.y;
    const id = data.id;

    let el = document.getElementById(id);
    if (!el) {
        el = document.createElement('div');
        el.classList.add('cursor');
        el.id = id;
        document.body.appendChild(el);
    }
    el.style.top = y + '%';
    el.style.left = x + '%';
}
