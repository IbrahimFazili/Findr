import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Chat from './Chat';
import Messages from './Messages';

const AppNavigator = createStackNavigator(
  {
    Home: Messages,
    MessagesHomeScreen: Chat,
  },
  {
    initialRouteName: 'Home',
  }
);
const AppContainer = createAppContainer(AppNavigator);

export default class ChatNavigation extends React.Component {
  render() {
    return <AppContainer />;
  }
}
