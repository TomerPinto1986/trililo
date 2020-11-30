// var chat = {};
// console.log(chat, 'chat');

function connectSockets(io) {
    io.on('connection', socket => {
        // console.log('socket connected:', socket);
        socket.on('activity-newMsg', msg => {
            // chat[socket.myTopic].push(msg)
            console.log(msg);
            // console.log(chat[socket.myTopic]);
            // emits only to sockets in the same card
            io.to(socket.myTopic).emit('activity-addMsg', msg)
        });
        socket.on('card-topic', topic => {
            console.log(topic, 'topic');
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
            // if (!chat[socket.myTopic]) {
            //     chat[socket.myTopic] = [];
            //     console.log(socket.myTopic);
            // } else socket.emit('chat-history', chat[socket.myTopic]);
        });
        socket.on('typing', username => {
            console.log(username, 'typing');
            io.to(socket.myTopic).emit('user-typing', username);
        });

        socket.on('test', () => { console.log('success!') })
    });
}

module.exports = connectSockets;