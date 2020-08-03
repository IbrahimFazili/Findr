import React from 'react';
import { Text } from 'react-native';
import { View } from 'native-base';

class KeyValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _key: props._key,
            value: props.value,
            spacing: 4
        };
    }

    componentWillReceiveProps(props) {
        if (props._key !== this.state._key) this.setState({ _key: props._key });
        if (props.value !== this.state.value) this.setState({ value: props.value });
        if (props.spacing !== this.state.spacing) this.setState({ spacing: props.spacing });
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
                <Text style={[this.props.valueStyle]}>
                    {this.state.value}
                </Text>
            </View>
        );
    }
}

export default KeyValue;
