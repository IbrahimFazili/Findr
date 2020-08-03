import React from 'react';
import { View, Text, AsyncStorage, Dimensions, StyleSheet, NetInfo, Image, ImageBackground, Alert} from 'react-native';
import styles from "../../assets/styles/index";
import KeyValue from "./KeyValue";
import APIConnection from '../../assets/data/APIConnection';

const DIMENTIONS = Dimensions.get("window");

class BasicInfo extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        email: "",
        gender: "",
        bio: "",
        editable: false
      }
    }

    componentWillReceiveProps(props) {
        if (this.state.email !== props.email) this.setState({ email: props.email });
        if (this.state.gender !== props.gender) this.setState({ gender: props.gender });
        if (this.state.bio !== props.bio) this.setState({ bio: props.bio });
        if (this.state.editable !== props.editable) {
          this.state.editable && !props.editable ? this.sendUpdate() : null;
          this.setState({ editable: props.editable });
        }
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

    async sendUpdate() {
      const API = new APIConnection();
      const status = await API.updateUserInfo({
        email: this.state.email,
        gender: this.state.gender,
        bio: this.state.bio
      });

      if (status === 201) {
        APIConnection.ProfilePage.notify();
      } else {
        Alert.alert("Update failed", "Couldn't update your info, try again later");
      }
    }

    updateHandler(type, updatedValue) {
      if (type === "gender") {
        this.setState({ gender: updatedValue });
      } else if (type === "about") {
        this.setState({ bio: updatedValue });
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
                valueStyle={{color: "black", marginTop: -DIMENTIONS.height * 0.015 }}
                editable={false}
            />
            <KeyValue
                _key="Gender"
                value={this._getFormattedGender(this.state.gender)}
                spacing={7}
                width={DIMENTIONS.height * 0.4}
                keyStyle={{color: "#1a5d57", fontSize: 17, marginTop: DIMENTIONS.height * 0.01 }}
                valueStyle={{color: "black", marginTop: -DIMENTIONS.height * 0.005 }}
                editable={this.state.editable}
                updateValue={((value) => this.updateHandler("gender", value)).bind(this)}
            />
            <KeyValue
                _key="About me"
                value={this.state.bio}
                width={DIMENTIONS.height * 0.4}
                spacing={1}
                keyStyle={{color: "#1a5d57", fontSize: 17, marginTop: DIMENTIONS.height * 0.01 }}
                valueStyle={{color: "black", marginTop: -DIMENTIONS.height * 0.01, marginLeft: -DIMENTIONS.width * 0.01}}
                editable={this.state.editable}
                multiline={true}
                updateValue={((value) => this.updateHandler("about", value)).bind(this)}
            />
        </View>
      ) 
  }
}

export default BasicInfo;
