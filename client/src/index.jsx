'use strict';

const server = "http://127.0.0.1:5000/";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: ""};
  }

  render() {
    while (!this.state.username) {
      return (
    	<button onClick={() => this.requestLogin()}>
      		Login
    	</button>
  	  );
    }
	return (
	<p>
		User: {this.state.username}
	</p>
	)
  }

  requestLogin(){
	 fetch(server + "login")
	 .then((response) => response.json())
	 .then((responseJson) => {
		 this.setState({username: responseJson.user});
	 })
	 .catch((error) => {
		 console.error(error);
    });

  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<App />, domContainer);
