// var chat = {};
// console.log(chat, 'chat');

function connectSockets(io) {
    io.on('connection', socket => {
        socket.on('activity-newMsg', msg => {
            io.to(socket.myTopic).emit('activity-addMsg', msg)
        });
        socket.on('card-topic', topic => {
            if (socket.myTopic) {
                socket.leave(socket.myTopic);
            }
            socket.join(topic);
            socket.myTopic = topic;
        });
        socket.on('typing', username => {
            socket.to(socket.myTopic).broadcast.emit('user-typing', username);
        });
        socket.on('board-topic', topic => {
            if(socket.boardTopic === topic) return;
            if (socket.boardTopic) {
                socket.leave(socket.boardTopic);
            }
            socket.join(topic);
            socket.boardTopic = topic;
        });
        socket.on('updateBoard', board => {
            socket.to(socket.boardTopic).broadcast.emit('boardUpdate', board);
        })
        socket.on('updateCard', card => {
            console.log(card)
            socket.to(socket.boardTopic).broadcast.emit('cardUpdate', card);
        })
    });
}

module.exports = connectSockets;