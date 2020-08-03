import React from 'react';
import { Text, TextInput, Dimensions } from 'react-native';
import { View } from 'native-base';
// import { TextInput } from 'react-native-paper';

const DIMENTIONS = Dimensions.get('window');

class KeyValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _key: props._key,
            value: props.value,
            spacing: 4,
            editable: false,
            multiline: false,
            underlineColor: "transparent"
        };
    }

    componentWillReceiveProps(props) {
        if (props._key !== this.state._key) this.setState({ _key: props._key });
        if (props.value !== this.state.value) this.setState({ value: props.value });
        if (props.spacing !== this.state.spacing) this.setState({ spacing: props.spacing });
        if (props.multiline !== this.state.multiline) this.setState({ multiline: props.multiline });
        if (this.state.editable !== props.editable) this.setState({ editable: props.editable });
    }

    handleChange(value) {
        this.props.updateValue ? this.props.updateValue(value) : null;
        this.setState({ value });
    }

    render() {
        return (
            <View style={{ 
                flexDirection: "row",
                width: this.props.width,
                flexWrap: "wrap",
                flex: 1,
                alignContent: "flex-start"
            }}>
                <Text
                style={[this.props.keyStyle]}>
                    {this.state._key}:{" ".repeat(this.state.spacing)}
                </Text>
                <TextInput
                style={[this.props.valueStyle]}
                editable={this.state.editable}
                value={this.state.value}
                onChangeText={this.handleChange.bind(this)}
                onFocus={() => this.setState({ underlineColor: "#1a5d57" })}
                onBlur={() => this.setState({ underlineColor: "transparent" })}
                mode="flat"
                underlineColorAndroid={this.state.underlineColor}
                multiline={this.state.multiline}
                />
            </View>
        );
    }
}

export default KeyValue;
