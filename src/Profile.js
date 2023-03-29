import React from 'react'

class Profile extends React.Component{
    constructor(){
        super();
        this.state={
            name: "Abu Bakar",
            email: "khokharabubakar751@gmail.com",
            mn: "03104780085",
            count: 1
        }
    }
    addnew=()=>{
        this.setState({
            name: "Osama",
            email: "osama@gmail.com",
            mn: "03104919234",
            count:this.state.count+1
        })
    }
    render(){
        console.warn("calling render");
        return(
                <div>
                    <p>Name: {this.state.name}</p>
                    <p>Email: {this.state.email}</p>
                    <p>Mobile Number: {this.state.mn}</p>
                    <p>Count: {this.state.count}</p>
                    <button onClick={()=>{this.addnew()}}>Click For Add '1'</button>
                </div>
        )
    }
}

export default Profile;