import React from "react";
import { Text, Dimensions, Platform, View } from "react-native";
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
} from "react-navigation";
import styles from "./assets/styles";
import SignUpScreen from "./containers/SignUp";
import LogInScreen from "./containers/LogIn";
import HomeScreen from "./containers/Home";
import MatchesScreen from "./containers/Matches";
import MessagesScreen from "./containers/Messages";
import ProfileScreen from "./containers/Profile";
import Icon from "./components/Icon";
import PrivacyScreen from "./containers/Privacy";
import OnboardingScreen from "./containers/Onboarding";
import InternetScreen from "./containers/OfflinePop";

import HomeIcon_Grey from './assets/icons/home.svg';
import HomeIcon_Green from './assets/icons/home_g.svg';
import SearchIcon_Grey from './assets/icons/search.svg';
import SearchIcon_Green from './assets/icons/search_g.svg';
import PersonIcon_Grey from './assets/icons/person.svg';
import PersonIcon_Green from './assets/icons/person_g.svg';
import ChatIcon_Grey from './assets/icons/chat.svg';
import ChatIcon_Green from './assets/icons/chat_g.svg';

const DIMENTIONS = Dimensions.get('window');

const ICON_WIDTH = DIMENTIONS.width * 0.05;
const ICON_HEIGHT = DIMENTIONS.height * 0.03;

const App = createBottomTabNavigator(
  {
    Explore: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return (
            <View
            style={{
              paddingBottom: DIMENTIONS.height * 0.01
            }}
            >
              { focused ? 
              <HomeIcon_Green width={ICON_WIDTH} height={ICON_HEIGHT}/>
              : <HomeIcon_Grey width={ICON_WIDTH} height={ICON_HEIGHT}/>}
            </View>
          );
        },
      },
    },
    Matches: {
      screen: MatchesScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          return (
            <View
              style={{ paddingBottom: DIMENTIONS.height * 0.01 }}
            >
              {focused ? 
              <SearchIcon_Green width={ICON_WIDTH} height={ICON_HEIGHT} />
              : <SearchIcon_Grey width={ICON_WIDTH} height={ICON_HEIGHT}/>}
            </View>
          );
        },
      },
    },
    Chat: {
      screen: MessagesScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? "#2c9c91" : "#4a4949";
          return (
            <View
              style={{ paddingBottom: DIMENTIONS.height * 0.01 }}
            >
              {focused ? 
              <ChatIcon_Green width={ICON_WIDTH} height={ICON_HEIGHT} />
              : <ChatIcon_Grey width={ICON_WIDTH} height={ICON_HEIGHT}/>}
            </View>
          );
        },
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? "#2c9c91" : "#4a4949";
          return (
            <View
              style={{ paddingBottom: DIMENTIONS.height * 0.01 }}
            >
              {focused ? 
              <PersonIcon_Green width={ICON_WIDTH} height={ICON_HEIGHT} />
              : <PersonIcon_Grey width={ICON_WIDTH} height={ICON_HEIGHT}/>}
            </View>
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: "#7444C0",
      inactiveTintColor: "#363636",
      labelStyle: {
        paddingTop: 0,
        margin: 0,
        opacity: 0,
      },
      style: {
        backgroundColor: "#FFF",
        borderTopWidth: 0,
        paddingVertical: 20,
        height: Platform.OS === 'ios' ? Dimensions.get("window").height * 0.04 : Dimensions.get('window').height * 0.065,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowColor: "#000",
        shadowOffset: { height: 0, width: 0 },
        elevation: 25,
      },
    },
  }
);

const RootStack = createStackNavigator(
  {
    AppScreen: {
      screen: App,
    },
    SignUp: {
      screen: SignUpScreen,
    },
    LogIn: {
      screen: LogInScreen,
    },
    Privacy :{
      screen: PrivacyScreen,
    },
    Onboarding: {
      screen: OnboardingScreen,
    },
    Internet:{
      screen: InternetScreen,
    },
  },
  { mode: "modal", headerMode: "none" }
);

// () => this.props.navigation.navigate('SignUp') on Home if signup/login needed

export default createAppContainer(RootStack);
