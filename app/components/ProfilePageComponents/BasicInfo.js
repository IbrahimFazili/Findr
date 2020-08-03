import React, { PureComponent } from 'react';
import { View, Text, AsyncStorage, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../../assets/styles/index";
import KeyValue from "./KeyValue";

class BasicInfo extends PureComponent {
    constructor(props){
      super(props);
      this.state = {
        email: "",
        gender: "",
        bio: "",
      }
    }

    componentWillReceiveProps(props) {
        if (this.state.email !== props.email) this.setState({ email: props.email });
        if (this.state.gender !== props.gender) this.setState({ gender: props.gender });
        if (this.state.bio !== props.bio) this.setState({ bio: props.bio });
    }

    _getFormattedGender(gender) {
        switch (gender) {
          case "" : return "";
          case "M": return "Male";
          case "F": return "Female";
          case "O": return "Other";
          case "P": return "Prefer Not To Say";
          default: return "";
        }
    }

    render() {
      return(
        <View style={{alignItems: 'center', padding: 20 }}>
            <KeyValue
                _key="Email"
                value={this.state.email}
                spacing={12}
                width={Dimensions.get('window').height * 0.6}
                keyStyle={{color: "#1a5d57"}}
                valueStyle={{color: "black"}}
            />
            <KeyValue
                _key="Gender"
                value={this._getFormattedGender(this.state.gender)}
                spacing={8}
                width={Dimensions.get('window').height * 0.6}
                keyStyle={{color: "#1a5d57"}}
                valueStyle={{color: "black"}}
            />
            <KeyValue
                _key="About me"
                value={this.state.bio}
                width={Dimensions.get('window').height * 0.6}
                spacing={3}
                keyStyle={{color: "#1a5d57"}}
                valueStyle={{color: "black"}}
            />
        </View>
      ) 
  }
}

export default BasicInfo;
