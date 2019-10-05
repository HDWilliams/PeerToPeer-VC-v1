<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>


    <div v-if="peerInstance">
        Yayy connection established! 
        My Peer ID is {{ peerID }}

        <div></div>
      Peer ID: <input v-model="destPeerID" placeholder="Specify Peer ID">
      Message: <input v-model="destMsg" placeholder="type message here">
      <div/>
      <button v-if="destPeerID && destMsg != ''"
              @click="sendToPeer"> Send Message to Peer</button>

      <div v-if="receivedMsg != ''">
          <h1>Your friend sent you a message!</h1>
          <h1>'{{ receivedMsg }}'</h1>
          <small>This message will self-destruct in 10 seconds</small>
      </div>
    </div>
    <div v-else>
      <button @click="testPeer"> Test Peerjs Connection </button>

    </div>
     <video ref="video" id="video" width="640" height="480"></video>

  </div>
</template>

<script>

import Peer from 'peerjs';

let RESET_TIMEOUT = null;

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
      console.log(this.$refs);
      console.log(Object.keys(this.$refs));
      console.log(this.$refs.video);

      this.video = this.$refs.video;
      const thisContext = this;
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {            
              this.video.srcObject = stream;
              const promise = this.video.play();

              if (promise !== undefined) {
                promise.then(_ => {
                    console.log('playback started');
                  // Automatic playback started!
                  // Show playing UI.
                })
                .catch(error => {
                    console.log('error');
                    console.log(error);
                  // Auto-play was prevented
                  // Show paused UI.
                });
              }
          });
      }
  },
  data() {
     return {
        peerInstance: null,
        peerConn: null,
        peerID: null,
        destPeerID: null,
        destMsg: '',
        receivedMsg: '',
        video: {},
     }
  },
  methods: {
      testPeer() {
          const peerOptions = {
            secure: true,
            port: 443,
            host: 'vc-v1.herokuapp.com',
            path: '/peerjs'
          };
          const peer = new Peer(peerOptions); 
          const thisContext = this;
          peer.on('open', function(id) {
              thisContext.peerID = id;
              thisContext.peerInstance = peer;
          });
          console.log(navigator.getUserMedia);


          // thisContext.video = this.$refs.video;
          // console.log(thisContext.video);
          // console.log(this.$refs);
          // console.log(Object.keys(this.$refs));
          // console.log(this.$refs.video);
          // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          //         thisContext.video.src = window.URL.createObjectURL(stream);
          //         thisContext.video.play();
          //     });
          // }

          // const getUserMedia = MediaDevices.getUserMedia();
          // const getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
          // getUserMedia({video: true, audio: true}, function(stream) {
          //   thisContext.peerVideo = stream;
          // }, function(err) {
          //   console.log('Failed to get local stream' ,err);
          // });

          navigator.mediaDevices.getUserMedia({video:true, audio: true}).then(function(mediaStream){
            console.log(mediaStream);
                  thisContext.peerVideo = mediaStream;
                  console.log(thisContext.$refs);
                  thisContext.$refs.video.src = mediaStream;
                  thisContext.$refs.video.play();
                   // window.stream = mediaStream;     
                   // video.src = URL.createObjectURL(mediaStream);    
                   // video.play(); 
          });

          peer.on('connection', function(conn) {
                conn.on('data', function(data) {
                    clearTimeout(RESET_TIMEOUT);
                    thisContext.receivedMsg = data;
                    RESET_TIMEOUT = setTimeout(function () {
                        thisContext.receivedMsg = '';
                    }, 10000);
              });              
          });
      },
      sendToPeer() {
          const conn = this.peerInstance.connect(this.destPeerID);
          const thisContext = this;
          conn.on('open', function() {
              conn.send(thisContext.destMsg);
          });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
