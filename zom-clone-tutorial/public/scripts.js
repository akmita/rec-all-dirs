// get reference to socket from root path
const socket = io('/');

const myPeer = new Peer(undefined, {
    host: 'rtc-peerjs-server.uc.r.appspot.com',  // cloud host
    // host: '/',  // root host
    // port: '3001'
})


myPeer.on('open', id => {
    // send 'join room' event to SERVER.JS 
    socket.emit('join-room', ROOM_ID, id);
});


socket.on('user-connected', userId => {
    console.log('user connected', userId);
});