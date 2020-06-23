import React from 'react';
import { Text, Dimensions, Platform } from 'react-native';
import {
  createBottomTabNavigator,
  createAppContainer,
  createStackNavigator,
} from 'react-navigation';
import styles from './assets/styles';
import SignUpScreen from './containers/SignUp';
import LogInScreen from './containers/LogIn';
import HomeScreen from './containers/Home';
import MatchesScreen from './containers/Matches';
import MessagesPage from './containers/Messages';
import ProfileScreen from './containers/Profile';
import Icon from './components/Icon';
import Chat from './containers/Chat';
import { moderateScale } from 'react-native-size-matters';

const App = createBottomTabNavigator(
  {
    Explore: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? '#2c9c91' : '#4a4949';
          return (
            <Text
              style={[
                styles.iconMenu,
                { color: iconFocused, marginTop: '15%' },
              ]}
            >
              <Icon name='explore' />
            </Text>
          );
        },
      },
    },
    Matches: {
      screen: MatchesScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? '#2c9c91' : '#4a4949';
          return (
            <Text
              style={[
                styles.iconMenu,
                { color: iconFocused, marginTop: '15%' },
              ]}
            >
              <Icon name='heart' />
            </Text>
          );
        },
      },
    },
    Chat: {
      screen: MessagesPage,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? '#2c9c91' : '#4a4949';
          return (
            <Text
              style={[
                styles.iconMenu,
                { color: iconFocused, marginTop: '15%' },
              ]}
            >
              <Icon name='chat' />
            </Text>
          );
        },
      },
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => {
          const iconFocused = focused ? '#2c9c91' : '#4a4949';
          return (
            <Text
              style={[
                styles.iconMenu,
                { color: iconFocused, marginTop: '15%' },
              ]}
            >
              <Icon name='user' />
            </Text>
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#7444C0',
      inactiveTintColor: '#363636',
      labelStyle: {
        paddingTop: 0,
        margin: 0,
        opacity: 0,
      },
      style: {
        backgroundColor: '#FFF',
        borderTopWidth: 0,
        paddingVertical: 20,
        height:
          Platform.OS === 'ios'
            ? Dimensions.get('window').height * 0.04
            : Dimensions.get('window').height * 0.065,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowColor: '#000',
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
    Messages: {
      screen: MessagesPage,
    },
    ChatPage: {
      screen: Chat,
    },
  },
  { mode: 'modal', headerMode: 'none' }
);

// () => this.props.navigation.navigate('SignUp') on Home if signup/login needed

export default createAppContainer(RootStack);
