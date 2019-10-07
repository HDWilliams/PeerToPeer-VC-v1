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
      <button @click="callPeer">
        Initiate Video Call with Peer
      </button>
      <button @click="answerPeer">
        Recieve Call
      </button>
      <button @click="refreshVideo">
        Refresh Video
      </button>
      <CustomVideo :key="videoKey" :stream="remoteStream"/>
    </div>
    <div v-else>
      <button @click="testPeer"> Test Peerjs Connection </button>

    </div>
  </div>
</template>

<script>

import Peer from 'peerjs';
import CustomVideo from './CustomVideo.vue';
let RESET_TIMEOUT = null;

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {

  },
  mounted() {
    this.answerPeer();
    // const thisContext = this;
    //   console.log(this.peerInstance);
    //       if (this.peerInstance) {
    //           console.log('peer instance exists');
    //           this.peerInstance.on('call', function(call) {
    //             console.log('on call');
    //             if( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
    //                 navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
    //                   call.answer(stream); // Answer the call with an A/V stream.
    //                   call.on('stream', function(remoteStream) {
    //                     thisContext.remoteStream = remoteStream;
    //                     thisContext.videoKey = true; 
    //                     // Show stream in some video/canvas element.
    //                   });
    //                 }).catch((err) => {
    //                   console.log('Failed to get local stream' ,err);
    //                 });
    //             }
    //           });
    //       }
    //       else {
    //         console.log('peer doesnt exist');
    //       }
      
  },
  data() {
     return {
        peerInstance: null,
        peerConn: null,
        peerID: null,
        destPeerID: null,
        destMsg: '',
        receivedMsg: '',
        remoteStream: new MediaStream(),
        videoKey: 0,
     }
  },
  methods: {
      refreshVideo() {
          this.videoKey++;
          console.log(this.videoKey);
      },
      answerPeer() {
          const thisContext = this;
          if (this.peerInstance) {
              console.log('peer instance exists');
              this.peerInstance.on('call', function(call) {
                console.log('on call');
                if( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
                    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
                      call.answer(stream); // Answer the call with an A/V stream.
                      console.log('answered call');
                      call.on('stream', function(remoteStream) {
                        thisContext.remoteStream = remoteStream;
                        thisContext.videoKey++; 
                        // Show stream in some video/canvas element.
                      });
                    }).catch((err) => {
                      console.log('Failed to get local stream' ,err);
                    });
                }
              });
          }
          else {
            console.log('peer doesnt exist');
          }
      },
      callPeer() {
          console.log('trying to call peer', this.destPeerID);
          const thisContext = this;
          if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
            navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) =>  {
                console.log('got local stream');
                const call = thisContext.peerInstance.call(thisContext.destPeerID, stream);
                console.log('initiated call');
                console.log(call);
                console.log(stream);
                call.on('stream', function(remoteStream) {
                    thisContext.remoteStream = remoteStream;
                    thisContext.videoKey++;
                    // Show stream in some video/canvas element.
                });
            }).catch((err) =>  {
                console.log('Failed to get local stream' ,err);
            });
          }      
      },
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


          console.log(this.$refs);

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
  },
  components: {
    CustomVideo
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
