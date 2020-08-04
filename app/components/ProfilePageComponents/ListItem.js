import React from "react"
import { TextInput, View, TouchableOpacity, Text } from "react-native"
import { Dimensions } from "react-native";
import Cross from "../../assets/icons/cross.svg"

const DIMENSION_HEIGHT = Dimensions.get("window").height;
const DIMENSION_WIDTH = Dimensions.get("window").width;

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
        const updatedProps = {};
        if (this.state.value !== props.value){
            updatedProps.value = props.value
        }
        if (this.state.type !== props.type){
            updatedProps.type = props.type
        }
        if (this.state.editable !== props.editable){
            updatedProps.editable = props.editable
        }
        if (Object.keys(updatedProps).length > 0) this.setState(updatedProps);
    }

    handleChange(value) {
        this.props.updateValue ? this.props.updateValue(value) : null;
        this.setState({ value });
    }

    render() {
        return(
            <View 
                style={{ 
                    paddingVertical: DIMENSION_HEIGHT * 0.01, 
                    position: 'relative',
                    marginBottom: DIMENSION_HEIGHT * 0.01,
                    flexDirection: 'row'
                }}
            >
                <TextInput  
                    style={[this.props.style, { color: 'black' }]}
                    placeholder={`Add ${this.state.type}`}
                    value={this.state.value}   
                    onChangeText={((value) => this.handleChange(value)).bind(this)} 
                    editable={this.state.editable}
                    mode='flat'
                    selectionColor={this.props.selectionColor ? this.props.selectionColor : "#1a5d57"}
                    underlineColor={this.props.underlineColor ? this.props.underlineColor : "black"}
                    multiline={true}
                />
                {this.state.editable ?
                <TouchableOpacity 
                    onPress={() => this.props.onDeletePress()} 
                    style={{ padding: "8%", width: DIMENSION_WIDTH * 0.2}}
                >
                    <View style={{bottom: 20, right: 60, position: 'absolute'}}>
                        <Cross width={15} height={15}/>
                    </View>
                </TouchableOpacity>
                : null}  
            </View>
        );
    }
}

export default ListItem;