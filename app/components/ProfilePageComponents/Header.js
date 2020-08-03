import React from "react"
import { Text, View, TouchableOpacity, Dimensions } from "react-native";

const DIMENSION_HEIGHT = Dimensions.get("window").height

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title
        };
    }

    componentWillReceiveProps(props) {
        if (props.title !== this.state.title) this.setState({ title: props.title });
    }

    render() {
        return (
            <View style={this.props.style}>
              <Text 
                style={{
                    fontSize: 26,
                    justifyContent: 'center',
                    color: "#1a5d57",
                    marginTop: DIMENSION_HEIGHT * 0.01,
                }}
              >
                {this.state.title}
              </Text>
              
          </View>
        );
    }
}

export default Header;
