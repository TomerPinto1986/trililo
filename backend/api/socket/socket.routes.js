var chat = {};
console.log(chat, 'chat');

function connectSockets(io) {
    io.on('connection', socket => {
        console.log('socket connected:', socket);
        socket.on('chat-newMsg', msg => {

            chat[socket.myTopic].push(msg)
            console.log(chat[socket.myTopic]);
            // emits only to sockets in the same card
            io.to(socket.myTopic).emit('chat-addMsg', chat[socket.myTopic])
        });
        socket.on('chat-topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
            if (!chat[socket.myTopic]) {
                chat[socket.myTopic] = [];
            } else socket.emit('chat-history', chat[socket.myTopic]);
        });
        socket.on('typing', username => {
            console.log(username, 'typing');
            io.to(socket.myTopic).emit('user-typing', username);
        });
    });
}

module.exports = connectSockets;