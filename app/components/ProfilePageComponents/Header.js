import React from "react"
import { Text, View, Dimensions, TextInput } from "react-native";

const DIMENSION_HEIGHT = Dimensions.get("window").height

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            editable: false,
            underlineColor: "transparent"
        };
    }

    componentWillReceiveProps(props) {
        const updatedProps = {};
        if (props.title !== this.state.title) updatedProps.title = props.title;
        if (props.editable !== this.state.editable) {
            this.state.editable && !props.editable ? 
            (this.props.updateCallback ? this.props.updateCallback(this.state.title) : null) 
            : null;
            updatedProps.editable = props.editable;
        }
        if (Object.keys(updatedProps).length > 0) this.setState(updatedProps);
    }

    render() {
        return (
            <View style={this.props.style}>
              <TextInput 
                style={{
                    fontSize: 26,
                    justifyContent: 'center',
                    color: "#1a5d57",
                    marginTop: DIMENSION_HEIGHT * 0.01,
                }}
                mode='flat'
                value={this.state.title}
                onChangeText={((title) => this.setState({ title })).bind(this)}
                onFocus={() => this.setState({ underlineColor: "lightgrey" })}
                onBlur={() => this.setState({ underlineColor: "transparent" })}
                underlineColorAndroid={this.state.underlineColor}
                editable={this.state.editable}
              />
              
          </View>
        );
    }
}

export default Header;
