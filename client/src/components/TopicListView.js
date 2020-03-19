import React from 'react';
import Peer from 'peerjs';
import Axios from 'axios';

class TopicListView extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            waitingForTopics: true,
        };

        this.getTopicList();        
    }
    getTopicList() {
        Axios.get('https://vc-v1.herokuapp.com/getTopicList')
            .then((response) => {
                console.log('got response');
                console.log(response);
                this.setState({waitingForTopics: false});
            })
            .catch((err) => {
                console.log('failed axios');
                console.log(err);
            })
        console.log('whatup im going to get the list');
    }

    render(){
        return ( 
            <div>

                
            </div>
        )
    }
}

export default TopicListView;