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
			<div>
				<span>
					{this.state.name}
				</span>
			</div>
		)
	}
}
export default UserItem;