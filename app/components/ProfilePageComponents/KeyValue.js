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
        const updatedProps = {};
        if (props._key !== this.state._key) updatedProps._key = props._key;
        if (props.value !== this.state.value) updatedProps.value = props.value;
        if (props.spacing !== this.state.spacing) updatedProps.spacing = props.spacing;
        if (props.multiline !== this.state.multiline) updatedProps.multiline = props.multiline;
        if (this.state.editable !== props.editable) updatedProps.editable = props.editable;
        
        if (Object.keys(updatedProps).length > 0) this.setState(updatedProps);
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
                onFocus={() => this.setState({ underlineColor: "lightgrey" })}
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
