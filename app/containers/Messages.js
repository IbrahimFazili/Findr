import React from 'react';
import styles from '../assets/styles';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import Message from '../components/Message';
import APIConnection from '../assets/data/APIConnection';


class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = { API: new APIConnection(), chats: [] };
  }

  async loadData(){
    let data = await this.state.API.fetchChats(
      await AsyncStorage.getItem('storedEmail')
    );

    for (let i = 0; i < data.length; i++) {
      data[i].messages = (
        await this.state.API.fetchChatData(
          await AsyncStorage.getItem('storedEmail'),
          data[i].email
        )
      ).messages;
    }

    this.setState({ chats: data });
  }

  async componentDidMount() {
    this.loadData();
    APIConnection.attachMessagePageNotifier(this.loadData.bind(this));
  }

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "80%",
          backgroundColor: "lightgrey",
          marginLeft: Dimensions.get('window').width * 0.21
        }}
      />
    );
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/Home.png')}
        style={styles.bg}
      >
        <View style={styles.containerMessages}>
          <ScrollView>
            <View style={styles.top}>
              <Image
                style={styles.matchLogo}
                source={require("../assets/images/Findr_logo2x.png")}
              />
              <Text style={styles.title}>Messages</Text>
            </View>

            <FlatList
              data={this.state.chats}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent = {this.FlatListItemSeparator}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={async () =>
                    this.props.navigation.navigate('ChatPage', {
                      messages: item.messages,
                      own_email: await AsyncStorage.getItem('storedEmail'),
                      user_name: item.name,
                      user_image: { uri: item.image },
                      user_email: item.email
                    })
                  }
                >
                  <Message
                    image={{ uri: item.image, checksum: item.checksum }}
                    name={item.name}
                    email={item.email}
                    lastMessage={APIConnection.MESSAGE_QUEUES[item.email] && 
                      APIConnection.MESSAGE_QUEUES[item.email].peekNewest() ?
                      APIConnection.MESSAGE_QUEUES[item.email].peekNewest().msg
                      : item.messages[item.messages.length - 1].msg}
                  />
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
}

export default Messages;
