import React from 'react';

class UserItem extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			userID: props.userID, 
			name: props.name
		}
	}

	render() {
		return(
			<div class="item">
				{this.state.name}
			</div>
		)
	}
}
export default UserItem;