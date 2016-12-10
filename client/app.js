import throttle from 'lodash.throttle';
import uuid from './uuid';
import Socket from './Socket';

// Socket logic
const uniqueId = uuid();

let activeCursors = {};

const socket = new Socket(uniqueId, {
    open: handleSocketOpen,
    MOVE_EXT_CURSOR: handleExtCursor,
    DELETE_CURSOR: deleteCursor,
});

const header = document.getElementById('header');
window.addEventListener('mousemove', throttle(handleMouseMove, 20));
window.addEventListener('resize', handleResize);
let width;
let height;
handleResize();

function handleResize(event) {
    width = window.innerWidth;
    height = window.innerHeight;
}

function handleSocketOpen() {
    // After the WebSocket has been opened, we need to reset because we might
    // have missed some delete events.
    activeCursors = {};
}

function handleMouseMove(event) {
    const x = event.pageX;
    const y = event.pageY;
    socket.send({
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

// External cursors logic
function handleExtCursor(data) {
    const x = data.x;
    const y = data.y;
    const id = data.id;

    activeCursors[id] = { x, y };
    calcColors();

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
    delete activeCursors[data.id];
    calcColors();
    const el = document.getElementById(data.id);

    if (el) {
        document.body.removeChild(el);
    }
}

function calcColors() {
    // Contains the x + y values (in percent) for all active cursors.
    // So if there is only one cursor, and it is at the most top right of the screen, this would be 200.
    // For two users at the most top right of the screen, this would be 400.
    let totalValue = 0;
    // Amount of active cursors
    let length = 0;
    for (const c in activeCursors) {
        const data = activeCursors[c];
        totalValue += data.x + data.y;
        length += 1;
    }
    // Hue can be 0 - 360.
    // TODO: `totalValue /length` can only be maximum 200, should do some calculations so it can go to 360.
    const hue = totalValue / length;
    // Saturation can be 0 - 100.
    // TDOO: hmm this is boring, do some weird calculation or something.
    const saturation = totalValue / length / 2;
    // Lightness can be 0 - 100.
    document.body.style.background = `hsl(${hue}, ${saturation}%, 50%)`;
}
