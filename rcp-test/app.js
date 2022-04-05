const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");

let senderStream;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {

    console.log("consumer method triggered")

    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
    });
    // console.log("peer:", peer);

    const desc = new webrtc.RTCSessionDescription(body.sdp);
    // console.log("desc:", desc);

    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    // console.log("senderStream.getTracks():", senderStream.getTracks());
    

    const answer = await peer.createAnswer();
    // console.log("answer:", answer);


    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }
    // console.log("payload:", payload)
    

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {

    console.log("broadcasting...")

    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
    });
    // console.log("peer:", peer);

    peer.ontrack = (e) => handleTrackEvent(e, peer);
    
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    // console.log("desc:", desc)

    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    // console.log("answer:", answer)


    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }
    // console.log("payload:", payload)

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    console.log("handling track event")
    senderStream = e.streams[0];
    console.log("sender stream: ", senderStream)
};



// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit. KURWA');
});

// [END gae_flex_node_static_files]
module.exports = app;
