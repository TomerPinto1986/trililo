// var chat = {};
// console.log(chat, 'chat');

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('activity-newMsg', msg => {
            console.log(msg);
            io.to(socket.myTopic).emit('activity-addMsg', msg)
        });
        socket.on('card-topic', topic => {
            console.log(topic, 'topic');
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('typing', username => {
            socket.to(socket.myTopic).broadcast.emit('user-typing', username);
        });

    });
}

module.exports = connectSockets;