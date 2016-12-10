// Socket logic

const WEBSOCKET_URL = 'ws://localhost:3000';

const uniqueId = guid();
const wss = new WebSocket(`${WEBSOCKET_URL}?id=${uniqueId}`);

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
    if (payload.type === 'DELETE_CURSOR') {
        deleteCursor(payload.data);
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
    window.addEventListener('mousemove', debounce(handleMouseMove, 10));
    window.addEventListener('resize', handleResize);
    let width;
    let height;
    handleResize();

    const header = document.getElementById('header');

    function handleResize(event) {
        width = window.innerWidth;
        height = window.innerHeight;
    }

    function handleMouseMove(event) {
        const x = event.pageX;
        const y = event.pageY;
        wssSend({
            type: 'MOVE_MY_CURSOR',
            data: {
                id: uniqueId,
                x: (x / width) * 100,
                y: (y / height) * 100,
            },
        });

        // This doesn't make any sense, but so does life :')
        header.style.transform = `rotate(${x - y}deg)`;
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

// Delete cursor logic
function deleteCursor(data) {
    const el = document.getElementById(data.id);

    if (el) {
        document.body.removeChild(el);
    }
}
