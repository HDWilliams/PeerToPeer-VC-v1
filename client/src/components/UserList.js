import React from 'react';
import axios from 'axios';
import UserItem from './UserItem.js'
class UserList extends React.Component{
	constructor(props){
		this.state = {
			users:[]
		}
	}

	componentDidMount(){
		axios.get('https://vc-v1.herokuapp.com/getUsers').then(res=>{
			let users = res.data.activeUsers
			this.setState({users})
		})
	}

	render(){
		return(
			{this.state.users.map((data) =>
			    <UserItem userID={data.userID} name={data.name}/>
			)}
		)
	}
}
export default UserList;