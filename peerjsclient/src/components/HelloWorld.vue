<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <button @click="testPeer"> Test Peerjs Connection </button>
  </div>
</template>

<script>

import Peer from 'peerjs';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
      testPeer() {
          console.log('test pe11er');
          const peerOptions = {
            port: 9000,
            host: 'https://vc-v1.herokuapp.com',
            path: '/peerjs',
          }
          const peer = new Peer('1234', peerOptions);
          console.log(peer);
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
