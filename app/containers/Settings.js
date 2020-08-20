import React from "react";
import { View, ImageBackground, AsyncStorage, Image, Text, Dimensions,
TouchableOpacity} from "react-native";
import SettingsList from 'react-native-settings-list';
import styles from "../assets/styles";
import {Button} from "react-native-paper"
import BackButton from "../assets/icons/back_black.svg";
import APIConnection from "../assets/data/APIConnection";

const DIMENTIONS = Dimensions.get('window');

const ICON_WIDTH = DIMENTIONS.width * 0.05;
const ICON_HEIGHT = DIMENTIONS.height * 0.03;

class Settings extends React.Component{
    constructor(){
        super();
        this.state = {switchValue: false,unsubscribeNetwork: null, };
        const API = new APIConnection();
        visible: false;
      }
      render() {
        var bgColor = '#DCE3F4';
        return (
            <ImageBackground
              source={require("../assets/images/15.png")}
              style={styles.bg}
            >
              <View style={{borderBottomWidth:1, backgroundColor:'#f7f7f8',borderColor:'#c8c7cc'}}>
                <Text style={{alignSelf:'center',top: 37,marginBottom:20,fontSize:20,color: "black"}}>Settings</Text>
                <TouchableOpacity
                  style={{marginLeft: DIMENTIONS.height * 0.02, marginBottom: DIMENTIONS.height * 0.02}}
                  onPress={() => this.props.navigation.navigate("Profile")}
                >
                  <BackButton width={DIMENTIONS.height * 0.02} height={DIMENTIONS.height * 0.02}/>
                </TouchableOpacity>
              </View>
              <View style={{backgroundColor:'#EFEFF4',flex:1}}>
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>

                  <SettingsList.Header headerStyle={{marginTop:15}} 
                  headerText="Contact Us"/>
                  <SettingsList.Item
                    title='Help and Support'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />

                  <SettingsList.Header headerStyle={{marginTop:15}}
                  headerText="Community"/>
                  <SettingsList.Item
                    title='Community Guidlines'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />
                  <SettingsList.Item
                    title='Safety Tips'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />

                  <SettingsList.Header headerStyle={{marginTop:15}}
                  headerText="Legal"/>
                  <SettingsList.Item
                    title='Privacy Policy'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />
                  <SettingsList.Item
                    title='Terms and Services'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />
                  <SettingsList.Item
                    title='Licenses'
                    titleStyle={{color: "black"}}
                    onPress={() => {}}
                  />

                  <SettingsList.Header headerStyle={{marginTop:15}} />

                  <SettingsList.Item
                    title='Logout'
                    onPress={(() => {
                      AsyncStorage.removeItem('storedEmail');
                      APIConnection.MESSAGE_QUEUES = {};
                      APIConnection.observers = [];
                      this.props.navigation.navigate("LogIn");
                    }).bind(this)
                  }
                    hasNavArrow={false}
                    titleStyle={styles.LogoutSettings}
                  />

                </SettingsList>
                <Image source={require('../assets/images/Findr_logo2x.png')} 
                  style={styles.logoSettings}/>

              <View style={styles.deleteAccountButton}>
                <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
                    <SettingsList.Item 
                      title="Delete Account"
                    />
                </SettingsList>
              </View>
            </View>
          </ImageBackground>
        );
    }
}

export default Settings; 