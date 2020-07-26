import React, { Component } from "react";
import {
	Text,
	View,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	Keyboard,
	ImageBackground,
	Dimensions,
} from "react-native";
import { Header, Image, ThemeConsumer } from "react-native-elements";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AutogrowInput from "react-native-autogrow-input";
import { moderateScale } from "react-native-size-matters";
import ImagePicker from "react-native-image-picker";
import { Thumbnail } from "native-base";
import APIConnection from "../assets/data/APIConnection";

import AttachIcon from "../assets/icons/attach.svg";
import SendIcon from "../assets/icons/send_icon.svg";
import BackButton from "../assets/icons/back_black.svg";
import InfoIcon from "../assets/icons/i_icon.svg";

import ChatPopup from "../components/ChatPopup";

//beepboop
const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;
const ICON_FONT = "tinderclone";
const WHITE = "#FFFFFF";
const BLACK = "#000000";

const renderCustomHeader = () => {
	return (
		<Image
			style={{ width: 50, height: 50 }}
			source={require("../assets/images/Findr_logo2x.png")}
		/>
	);
};

function convertTimestamptoTime(unixTimestamp) {
	dateObj = new Date(unixTimestamp);
	hours = dateObj.getHours();
	minutes = dateObj.getMinutes();

	if (hours >= 12) {
		hours = hours % 12;
		formattedTime =
			hours.toString() + ":" + minutes.toString().padStart(2, "0") + " PM";
	} else {
		formattedTime =
			hours.toString() + ":" + minutes.toString().padStart(2, "0") + " AM";
	}

	return formattedTime;
}

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
	  showPopup: false,
      own_email: props.navigation.state.params.own_email,
      messages: props.navigation.state.params.messages,
      inputBarText: '',
      selectedMedia: [],
      other_user: props.navigation.state.params.user_name,
      other_user_image: props.navigation.state.params.user_image,
      other_user_email: props.navigation.state.params.user_email
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
    this._isMounted = true;
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );

    APIConnection.attachObserver(this.onNewMessage.bind(this), this.state.other_user_email);
    this.onNewMessage();
  }

  //this is a bit sloppy: this is to make sure it scrolls to the bottom when a message is added, but
  //the component could update for other reasons, for which we wouldn't want it to scroll to the bottom.
  componentDidUpdate() {
    setTimeout(
      function () {
        this.scrollView.scrollToEnd();
      }.bind(this)
    );
    this.onNewMessage();
  }

  onNewMessage() {
    const msgQueue = APIConnection.MESSAGE_QUEUES[this.state.other_user_email];
    if (!msgQueue) return;
    const newMessages = [];
    while (!msgQueue.isEmpty()) {
      const msg = msgQueue.dequeue();
      newMessages.push({
        user: msg.from,
        msg: msg.msg,
        timestamp: msg.time
      });
    }
    if (newMessages.length > 0) {
      this.setState({ messages: this.state.messages.concat(newMessages) });
    }
  }

  _sendMessage() {
	if (this.state.inputBarText.trim().length === 0) return;
    const timestamp = (new Date()).getTime();
    this.state.messages.push({
      user: this.state.own_email,
      msg: this.state.inputBarText,
      timestamp
    });

    for (let i = 0; i < this.state.selectedMedia.length; i++) {
      const media = this.state.selectedMedia[i];
      APIConnection.mediaStore[media.name] = { uri: media.uri, type: media.type };
      delete media.uri;      
    }

    const msg = {
      from: this.state.own_email,
      to: this.state.other_user_email,
      msg: this.state.inputBarText,
      media: this.state.selectedMedia,
      time: timestamp,
      public_key: null
    }

    APIConnection.socket.emit("new msg", msg);

    this.setState({
      messages: this.state.messages,
      inputBarText: '',
      selectedMedia: []
    });
  }

  _onChangeInputBarText(text) {
    this.setState({
      inputBarText: text,
    });
  }

  _onChangeMedia(selection) {
    const media = {
      name: selection.fileName,
      type: selection.type,
      uri: selection.uri
    };

    if (this.state.selectedMedia.length > 0) {
      this.state.selectedMedia[0] = media
    } else this.state.selectedMedia.push(media);

    this.setState({ selectedMedia: this.state.selectedMedia });
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
          direction={message.user === own_email ? 'left' : 'right'}
          text={message.msg}
          time={message.timestamp}
        />
      );
    });

    return (
		<View style={styles.outer}>
			<ImageBackground
				source={require("../assets/images/15.png")}
				style={styles.bg}
			>
				<Header
					statusBarProps={{ barStyle: "light-content" }}
					barStyle="light-content" // or directly
					centerComponent={() => {
						return (
							<View style={styles.chatHeader}>
								<TouchableOpacity
									style={styles.chatBack}
									onPress={() =>
										this.props.navigation.goBack()
									}
								>
									<BackButton
										width={DIMENSION_WIDTH * 0.02}
										height={DIMENSION_HEIGHT * 0.02}
									/>
								</TouchableOpacity>
								<Thumbnail
									small
									style={{
										alignSelf: "center",
										marginTop: 0,
										marginRight: DIMENSION_WIDTH * 0.02,
									}}
									source={this.state.other_user_image}
									key={this.state.own_email}
								/>
								<Text style={styles.headerTest}>
									{this.state.other_user}
								</Text>
							</View>
						);
					}}
					rightComponent={() => {
						return (
							<View>
								<TouchableOpacity
									onPress={() =>
										this.setState({
											showPopup: true,
										})
									}
								>
									<InfoIcon
										width={DIMENSION_WIDTH * 0.058}
										height={DIMENSION_HEIGHT * 0.058}
									/>
								</TouchableOpacity>
								<ChatPopup
									visible={this.state.showPopup}
									email={this.state.other_user_email}
									navigation={this.props.navigation}
									own_email={this.state.own_email}
								/>
							</View>
						);
					}}
					containerStyle={{
						backgroundColor: "white",
						justifyContent: "space-around",
						elevation: 15,
						paddingBottom: DIMENSION_HEIGHT * 0.03,
						height: DIMENSION_HEIGHT * 0.08,
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
					onChangeText={(text) =>
						this._onChangeInputBarText(text)
					}
					text={this.state.inputBarText}
				/>
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
			this.props.direction === "left" ? null : (
				<View style={{ width: "40%" }} />
			);
		var leftSpacer =
			this.props.direction === "left" ? (
				<View style={{ width: "40%" }} />
			) : null;

		var bubbleStyles =
			this.props.direction === "left"
				? [styles.messageBubble, styles.messageBubbleLeft]
				: [styles.messageBubble, styles.messageBubbleRight];

		var bubbleTextStyle =
			this.props.direction === "left"
				? styles.messageBubbleTextLeft
				: styles.messageBubbleTextRight;

		var leftTime =
			this.props.direction == "left" ? (
				<View style={styles.timeLeft}>
					<Text style={styles.timeText}>
						{convertTimestamptoTime(this.props.time)}
					</Text>
				</View>
			) : null;
		var rightTime =
			this.props.direction == "right" ? (
				<View style={styles.timeRight}>
					<Text style={styles.timeText}>
						{convertTimestamptoTime(this.props.time)}
					</Text>
				</View>
			) : null;

		return (
			<View>
				<View
					style={{
						justifyContent: "space-between",
						flexDirection: "row",
					}}
				>
					{leftSpacer}
					<View style={bubbleStyles}>
						<Text style={bubbleTextStyle}>{this.props.text}</Text>
					</View>
					{rightSpacer}
				</View>
				{leftTime}
				{rightTime}
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

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        // file type: response.type
        // file name: response.fileName
        this.props.onChangeMedia(response);
      }
    });
  };

  render() {
    return (
      <View style={styles.inputBar}>
        <TouchableOpacity
        style={styles.mediaButton}
        onPress={() => this.chooseImage()}
        >
          <AttachIcon width={DIMENSION_WIDTH * 0.07} height={DIMENSION_HEIGHT * 0.07}/>
        </TouchableOpacity>
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
          placeholder={"Type a message"}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => this.props.onSendPressed()}
        >
          <SendIcon width={DIMENSION_WIDTH * 0.1} height={DIMENSION_HEIGHT * 0.1}/>
        </TouchableOpacity>
      </View>
    );
  }
}

//TODO: separate these out. This is what happens when you're in a hurry!
const styles = StyleSheet.create({
	//ChatView

	outer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "space-between",
	},

	messages: {
		flex: 1,
		marginBottom: DIMENSION_HEIGHT * 0.01,
	},

	//InputBar

	inputBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		// padding: DIMENSION_HEIGHT * 0.015,
		height: DIMENSION_HEIGHT * 0.07,
		elevation: 15,
		backgroundColor: "white",
	},

	textBox: {
		borderRadius: 28,
		borderWidth: 1,
		borderColor: "lightgrey",
		flex: 1,
		fontSize: 16,
		paddingHorizontal: 10,
		maxWidth: DIMENSION_WIDTH * 0.7,
		maxHeight: DIMENSION_HEIGHT * 0.05,
		top: DIMENSION_HEIGHT * 0.01,
	},

	sendButton: {
		justifyContent: "center",
		backgroundColor: "transparent",
		marginBottom: DIMENSION_HEIGHT * 0.003,
		marginRight: DIMENSION_WIDTH * 0.01,
		elevation: 8,
	},

	mediaButton: {
		backgroundColor: "transparent",
		marginLeft: DIMENSION_WIDTH * 0.05,
		marginTop: DIMENSION_HEIGHT * 0.008,
		bottom: 5,
	},

	//MessageBubble

	messageBubble: {
		maxWidth: moderateScale(250, 2),
		paddingHorizontal: moderateScale(10, 2),
		paddingTop: moderateScale(5, 2),
		paddingBottom: moderateScale(7, 2),
		borderRadius: 20,
		marginTop: DIMENSION_HEIGHT * 0.015,
		flexDirection: "row",
		flex: 1,
		elevation: 5,
	},

	messageBubbleLeft: {
		backgroundColor: "#1a5d57",
		marginRight: DIMENSION_WIDTH * 0.025,
		borderBottomRightRadius: 0,
	},

	messageBubbleTextLeft: {
		color: "white",
	},

	messageBubbleRight: {
		backgroundColor: "white",
		marginLeft: DIMENSION_WIDTH * 0.025,
		borderBottomLeftRadius: 0,
	},

	messageBubbleTextRight: {
		color: "#334856",
	},
	bg: {
		flex: 1,
		resizeMode: "cover",
		width: DIMENSION_WIDTH,
		height: DIMENSION_HEIGHT,
	},
	iconButton: { fontFamily: ICON_FONT, fontSize: 20, color: "#ffff" },
	iconButton2: {
		fontFamily: ICON_FONT,
		fontSize: 30,
		color: "#000000",
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
	},
	headerTest: {
		color: "#334856",
		width: 100,
	},
	profilepic: {
		flex: 1,
		width: 25,
		height: 25,
	},
	arrowContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1,
		flex: 1,
	},
	arrowLeftContainer: {
		justifyContent: "flex-end",
		alignItems: "flex-start",
	},

	arrowRightContainer: {
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},

	arrowLeft: {
		left: moderateScale(-6, 0.5),
	},

	arrowRight: {
		right: moderateScale(-6, 0.5),
	},
	item: {
		marginVertical: moderateScale(7, 2),
		flexDirection: "row",
	},
	itemIn: {
		marginLeft: 20,
	},
	itemOut: {
		alignSelf: "flex-end",
		marginRight: 20,
	},
	timeLeft: {
		alignSelf: "flex-end",
		marginTop: DIMENSION_HEIGHT * 0.001,
		marginRight: DIMENSION_WIDTH * 0.05,
		marginBottom: DIMENSION_HEIGHT * 0.005,
	},
	timeRight: {
		alignSelf: "flex-start",
		marginTop: DIMENSION_HEIGHT * 0.001,
		marginLeft: DIMENSION_WIDTH * 0.05,
		marginBottom: DIMENSION_HEIGHT * 0.005,
	},
	timeText: {
		color: "#969693",
		fontSize: 11,
	},

	//Header
	chatHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: DIMENSION_WIDTH * 0.35,
	},
	chatBack: {
		marginRight: DIMENSION_WIDTH * 0.05,
		width: 30,
	},
});
