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
            console.log(username, 'typing');
            io.to(socket.myTopic).emit('user-typing', username);
        });

        socket.on('test', () => { console.log('success!') })
    });
}

module.exports = connectSockets;