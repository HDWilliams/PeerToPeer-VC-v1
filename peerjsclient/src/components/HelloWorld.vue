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
        <!-- <button @click="sendData">Send Data to Peer</button> -->
    </div>
    <div v-else>
      <button @click="testPeer"> Test Peerjs Connection </button>
    </div>
  </div>
</template>

<script>

import Peer from 'peerjs';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
     return {
        peerInstance: null,
        peerConn: null,
        peerID: null,
     }
  },
  methods: {
      testPeer() {
          console.log('test pe11er');
          const peerOptions = {
            secure: true,
            port: 443,
            host: 'vc-v1.herokuapp.com',
            path: '/peerjs'
          };
          const peer = new Peer(peerOptions); 
          const thisContext = this;
          peer.on('open', function(id) {
              console.log('my peer id is', id);
              thisContext.peerID = id;
              thisContext.peerInstance = peer;
          });
          console.log(peer);
      },
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
