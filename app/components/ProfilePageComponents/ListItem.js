import React from "react"
import { TextInput, View } from "react-native"


class ListItem extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            type: "",
            value: "",
            editable: false
        }
    }
    
    componentWillReceiveProps(props){
        if (this.state.value !== props.value){
            this.state.value = props.value
        }
        if (this.state.type !== props.type){
            this.state.type = props.type
        }
        if (this.state.editable !== props.editable){
            this.state.editable = props.editable
        }
        this.setState(this.state);
    }

    render() {
        return(
            <View>
                <TextInput  
                style={this.props.style}
                placeholder={`${this.state.type}`}
                value={this.state.value}   
                // onChangeText={(text)=> this.itemsTextChange(text, index)} 
                editable={this.state.editable}
                
                mode='flat'
                selectionColor={this.props.selectionColor ? this.props.selectionColor : "#1a5d57"}
                underlineColor={this.props.underlineColor ? this.props.underlineColor : "black"}
                multiline={true}
                />  
            </View>
        );
    }
}

export default ListItem;