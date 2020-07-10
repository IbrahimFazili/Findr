import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Keyboard,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Header, Image } from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AutogrowInput from 'react-native-autogrow-input';
import Icon from '../components/Icon';
import { moderateScale } from 'react-native-size-matters';
import ImagePicker from 'react-native-image-picker';

const DIMENSION_WIDTH = Dimensions.get('window').width;
const DIMENSION_HEIGHT = Dimensions.get('window').height;
const ICON_FONT = 'tinderclone';

const renderCustomHeader = () => {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('../assets/images/Findr_logo2x.png')}
    />
  );
};
export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      own_email: props.navigation.state.params.own_email,
      messages: props.navigation.state.params.messages,
      inputBarText: '',
      other_user: props.navigation.state.params.user_name,
      other_user_image: { uri: props.navigation.state.params.user_image },
    };
  }

  static navigationOptions = {
    title: 'Chat',
  };

  //fun keyboard stuff- we use these to get the end of the ScrollView to "follow" the top of the InputBar as the keyboard rises and falls
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //When the keyboard appears, this gets the ScrollView to move the end back "up" so the last message is visible with the keyboard up
  //Without this, whatever message is the keyboard's height from the bottom will look like the last message.
  keyboardDidShow(e) {
    this.scrollView.scrollToEnd();
  }

  //When the keyboard dissapears, this gets the ScrollView to move the last message back down.
  keyboardDidHide(e) {
    this.scrollView.scrollToEnd();
  }

  //scroll to bottom when first showing the view
  componentDidMount() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
  }

  _sendMessage() {
    this.state.messages.push({
      direction: 'right',
      text: this.state.inputBarText,
    });

    this.setState({
      messages: this.state.messages,
      inputBarText: '',
    });
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text,
    });
  }

  //This event fires way too often.
  //We need to move the last message up if the input bar expands due to the user's new message exceeding the height of the box.
  //We really only need to do anything when the height of the InputBar changes, but AutogrowInput can't tell us that.
  //The real solution here is probably a fork of AutogrowInput that can provide this information.
  _onInputSizeChange() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd({ animated: false });
      }.bind(this)
    );
  }

  render() {
    var messages = [];
    const own_email = this.state.own_email;

    this.state.messages.forEach(function (message, index) {
      messages.push(
        <MessageBubble
          key={index}
          direction={message.user === own_email ? 'right' : 'left'}
          text={message.msg}
        />
      );
    });

    return (
      <View style={styles.outer}>
        <ImageBackground
          source={require('../assets/images/Home.png')}
          style={styles.bg}
        >
          <Header
            statusBarProps={{ barStyle: 'light-content' }}
            barStyle='light-content' // or directly
            centerComponent={() => {
              return (
                <View>
                  <Text style={styles.headerTest}>{this.state.other_user}</Text>
                </View>
              );
            }}
            containerStyle={{
              backgroundColor: '#008080',
              justifyContent: 'space-around',
            }}
          />

          <ScrollView
            ref={(ref) => {
              this.scrollView = ref;
            }}
            style={styles.messages}
          >
            {messages}
          </ScrollView>
          <InputBar
            onSendPressed={() => this._sendMessage()}
            onSizeChange={() => this._onInputSizeChange()}
            onChangeText={(text) => this._onChangeInputBarText(text)}
            text={this.state.inputBarText}
          />
          <KeyboardSpacer />
        </ImageBackground>
      </View>
    );
  }
}

//The bubbles that appear on the left or the right for the messages.
class MessageBubble extends Component {
  render() {
    //These spacers make the message bubble stay to the left or the right, depending on who is speaking, even if the message is multiple lines.
    var rightSpacer =
      this.props.direction === 'left' ? null : <View style={{ width: '40%' }} />;
    var leftSpacer =
      this.props.direction === 'left' ? <View style={{ width: '40%' }} /> : null;

    var bubbleStyles =
      this.props.direction === 'left'
        ? [styles.messageBubble, styles.messageBubbleLeft]
        : [styles.messageBubble, styles.messageBubbleRight];

    var bubbleTextStyle =
      this.props.direction === 'left'
        ? styles.messageBubbleTextLeft
        : styles.messageBubbleTextRight;

    return (
      <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        {leftSpacer}
        <View style={bubbleStyles}>
          <Text style={bubbleTextStyle}>{this.props.text}</Text>
        </View>
        {rightSpacer}
      </View>
    );
  }
}

//The bar at the bottom with a textbox and a send button.
class InputBar extends Component {
  //AutogrowInput doesn't change its size when the text is changed from the outside.
  //Thus, when text is reset to zero, we'll call it's reset function which will take it back to the original size.
  //Another possible solution here would be if InputBar kept the text as state and only reported it when the Send button
  //was pressed. Then, resetInputText() could be called when the Send button is pressed. However, this limits the ability
  //of the InputBar's text to be set from the outside.
  componentWillReceiveProps(nextProps) {
    if (nextProps.text === '') {
      this.autogrowInput.resetInputText();
    }
  }

  chooseImage = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        console.log('response', JSON.stringify(response));
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.inputBar}>
        <TouchableHighlight
        style={styles.mediaButton}
        onPress={() => this.chooseImage()}
        >
          <Text style={styles.iconButton2}>
            <Icon name='explore' />
          </Text>
        </TouchableHighlight>
        <AutogrowInput
          style={styles.textBox}
          ref={(ref) => {
            this.autogrowInput = ref;
          }}
          multiline={true}
          defaultHeight={DIMENSION_HEIGHT * 0.07}
          onChangeText={(text) => this.props.onChangeText(text)}
          onContentSizeChange={this.props.onSizeChange}
          value={this.props.text}
        />
        <TouchableHighlight
          style={styles.sendButton}
          onPress={() => this.props.onSendPressed()}
        >
          <Text style={styles.iconButton}>
            <Icon name='arrow' />
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({
  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  messages: {
    flex: 1,
  },

  //InputBar

  inputBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 3,
    elevation: 50
  },

  textBox: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'gray',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    marginBottom: DIMENSION_HEIGHT * 0.02,
    maxWidth: DIMENSION_WIDTH * 0.8
  },

  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a5d57',
    height: 45,
    width: 45,
    borderRadius: 22.5,
    position: 'absolute',
    right: DIMENSION_WIDTH * 0.025,
    bottom: DIMENSION_HEIGHT * 0.034,
    elevation: 6
  },

  mediaButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a5d57',
    height: 45,
    width: 45,
    borderRadius: 22.5,
    elevation: 6
  },

  //MessageBubble

  messageBubble: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 20,
    marginTop: DIMENSION_HEIGHT * 0.015,
    flexDirection: 'row',
    flex: 1,
  },

  messageBubbleLeft: {
    backgroundColor: '#d5d8d4',
    marginRight: DIMENSION_WIDTH * 0.025,
  },

  messageBubbleTextLeft: {
    color: 'black',
  },

  messageBubbleRight: {
    backgroundColor: '#1a5d57',
    marginLeft: DIMENSION_WIDTH * 0.025,
  },

  messageBubbleTextRight: {
    color: 'white',
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  iconButton: { fontFamily: ICON_FONT, fontSize: 20, color: '#ffff' },
  iconButton2: {
    fontFamily: ICON_FONT,
    fontSize: 30,
    color: '#000000',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
  },
  headerTest: {
    color: '#ffff',
  },
  profilepic: {
    flex: 1,
    width: 25,
    height: 25,
  },
  arrowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  arrowRightContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
  item: {
    marginVertical: moderateScale(7, 2),
    flexDirection: 'row',
  },
  itemIn: {
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
});
