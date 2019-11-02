import React from 'react';
import axios from 'axios';

class CreateTopic extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		return(
			<div>
				<form class="ui form" action="https://vc-v1.herokuapp.com/createChat" method="post" >
					<div class="field">
						<legend>I want to make a Topic to chat with my friends:</legend>
						Topic Name <br />
						<input type='text' placeholder="Enter your" />
						<input type="submit" value="Create My Topic" />
					</div>
				</form>
			</div>
		)
	}
}
export default CreateTopic;