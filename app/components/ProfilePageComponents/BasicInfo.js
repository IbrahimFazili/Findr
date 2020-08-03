import React from 'react';
import { View, Text, AsyncStorage, Dimensions, StyleSheet, NetInfo, Image, ImageBackground} from 'react-native';
import styles from "../../assets/styles/index";
import KeyValue from "./KeyValue";

const DIMENTIONS = Dimensions.get("window");

class BasicInfo extends React.Component {
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
        <View style={{alignItems: 'center', paddingVertical: 25 }}>
            <KeyValue
                _key="Email"
                value={this.state.email}
                spacing={12}
                width={DIMENTIONS.height * 0.4}
                keyStyle={{color: "#1a5d57", fontSize: 17 }}
                valueStyle={{color: "black"}}
            />
            <KeyValue
                _key="Gender"
                value={this._getFormattedGender(this.state.gender)}
                spacing={8}
                width={DIMENTIONS.height * 0.4}
                keyStyle={{color: "#1a5d57", fontSize: 17, marginTop: DIMENTIONS.height * 0.01 }}
                valueStyle={{color: "black", marginTop: DIMENTIONS.height * 0.01 }}
            />
            <KeyValue
                _key="About me"
                value={this.state.bio}
                width={DIMENTIONS.height * 0.4}
                spacing={1}
                keyStyle={{color: "#1a5d57", fontSize: 17, marginTop: DIMENTIONS.height * 0.01 }}
                valueStyle={{color: "black"}}
            />
        </View>
      ) 
  }
}

export default BasicInfo;
