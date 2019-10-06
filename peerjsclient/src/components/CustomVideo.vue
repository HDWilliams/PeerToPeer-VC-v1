<template>
  <div>
      <small>Video supposed to be here</small>
      <video ref="video" id="video" width="640" height="480"></video>
  </div>
</template>

<script>

import Peer from 'peerjs';


export default {
  name: 'HelloWorld',
  props: {
    stream: MediaStream,
  },
  mounted() {
      if (this.stream) {
          this.video = this.$refs.video;
          this.video.srcObject = this.stream;
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
      }
  },
  data() {
     return {
        video: {},
     }
  },
  methods: {
      
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
