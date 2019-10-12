import React from 'react';
import Peer from 'peerjs';

class PeerContainer extends React.Component{
    constructor(props) {
        super(props);

        // this.testPeer = this.testPeer.bind(this);
        // this.renderVideo = this.renderVideo.bind(this);
        
        this.state = {
            peer: null,
            peerID: null,
            // videoSrc: null,
        };


        this.videoRef = React.createRef();

        this.state.peer = new Peer({
            secure: true,
            port: 443,
            host: 'vc-v1.herokuapp.com',
            path: '/peerjs'
        })

        this.state.peer.on('open', (id) => {
            this.setState({peerID: id});
            console.log(id);
        })


        // get all the groups from the server 


        // create new group with topic or smth 

        // component shows array of videos 

        

        // get video element 
        if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
            navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream) =>  {
                this.videoRef.current.srcObject = stream;
                // this.setState({videoSrc: stream});
            }).catch((err) =>  {
                console.log('Failed to get local stream' ,err);
            });
        }    
    }
    // renderVideo() {
    //     if (this.state.videoSrc) {
    //         return (
    //             <video ref={this.videoRef} autoplay={true}/>
    //         )
    //     }
    //     else {
    //         return (
    //                 <p>Video not loaded </p>
    //             )
    //     }
    // }

    render(){
        return ( 
            <div>
                <p> Peer Container: { this.state.peerID } </p>
                <video ref={this.videoRef} autoPlay={true}/>
            </div>
        )
    }
}

export default PeerContainer;