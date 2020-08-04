import React from "react"
import { TextInput, View, TouchableOpacity } from "react-native"
import { Dimensions } from "react-native";
import Cross from "../../assets/icons/cross.svg"


class ListItem extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            type: "",
            value: "",
            editable: false,
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

    handleChange(value) {
        this.props.updateValue ? this.props.updateValue(value) : null;
        this.setState({ value });
    }

    render() {
        return(
            <View style={{ paddingVertical: Dimensions.get("window").height * 0.009, zIndex: Number.MAX_SAFE_INTEGER - 1, position: 'relative'}}>
                <TextInput  
                style={[this.props.style]}
                placeholder={`${this.state.type}`}
                value={this.state.value}   
                onChangeText={((value) => this.handleChange(value)).bind(this)} 
                editable={this.state.editable}
                mode='flat'
                selectionColor={this.props.selectionColor ? this.props.selectionColor : "#1a5d57"}
                underlineColor={this.props.underlineColor ? this.props.underlineColor : "black"}
                multiline={true}
                />
                {this.state.editable ?
                <TouchableOpacity onPress={() => this.props.onDeletePress()} style={{ zIndex: Number.MAX_SAFE_INTEGER }}>
                    <View style={{top: 35, right: 30 , flexDirection: 'row', position: 'absolute'}}>
                        <Cross width={15} height={15}/>
                    </View>
                </TouchableOpacity>
                : null}  
            </View>
        );
    }
}

export default ListItem;