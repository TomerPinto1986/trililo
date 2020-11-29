import io from 'socket.io-client';
const BASE_URL = process.env.NODE_ENV === 'production' ?
    '/' :
    '//localhost:3030'
var socket;
export const socketService = {
    setup,
    terminate,
    on,
    off,
    emit
}
function setup() {
    console.log('connecting', BASE_URL);
    socket = io(BASE_URL);
    console.log(socket)
}

function terminate() {
    socket = null;
}

function on(eventName, cb) {
    socket.on(eventName, cb)
}

function off(eventName, cb) {
    socket.off(eventName, cb)
}

function emit(eventName, data) {
    socket.emit(eventName, data)
}