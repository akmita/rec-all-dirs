const express = require('express');
const express_app = express();
const app = require('http').Server(express_app);
// const io = require('socket.io')(app);
const io = require('socket.io')(app,  { transports: ['websocket', 'polling'] } );
const { v4 : uuidV4 } = require('uuid');
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=> {
    console.log("SERVER RUNNIGN ON PORT", PORT)
});


express_app.set('view engine', 'ejs');
express_app.use(express.static('public'));


express_app.get('/', (req, res) => {
    // res.redirect(`/${uuidV4().slice(0, 1)}`);
    res.redirect(`/room1`);
});

express_app.get('/:room', (req, res) => {

    console.log("rendering room page")

    // renders room.ejs file
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    // socket -> socket a new user connects to

    // event triggeed from scripts.js
    socket.on('join-room', (roomId, userId) => {
        console.log("user", userId, "joined room", roomId);

        // each socket can have a channel in other words, a room
        socket.join(roomId);

        // send message to room currently in, except me, pass user ID
        socket.broadcast.to(roomId).emit('user-connected', userId);
    });
})

module.exports = app;