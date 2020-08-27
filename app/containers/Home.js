import React from 'react';
import {
  View,
  ImageBackground,
  AsyncStorage,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  BackHandler,
  Dimensions,
  StyleSheet,
  Text,
  Button,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {Card} from 'react-native-card-stack-swiper';
import CardItem from '../components/CardItem';
import Styles from '../assets/styles';
import APIConnection from '../assets/data/APIConnection';
import ProfilePopup from '../components/ProfilePopup';
import MatchPopup from '../components/MatchPopup';
import NoCardsPopup from '../components/OutOfCardsPopup';
import NetInfo from '@react-native-community/netinfo';

const MAX_LENGTH = 150;

// demo purposes only

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.addListener('didFocus', () => this.render());
    this.state = {
      // cards: [],
      visible: false,
      API: new APIConnection(),
      keywords: [],
      name: '',
      bio: '',
      uni: '',
      projects: [],
      experience: [],
      dataLoadRequired: true,
      isConnected: true,
      name: '',
      image: '',
      keywords: [],
      bio: '',
      uni: '',
      age: 0,
      matchPossible: false,
      updateCount: 0,
      refreshing: false,
      unsubscribeNetwork: null,
      //have to delete all this
      cards: [],
      swipedAllCards: false,
      swipeDirection: '',
      borderColor: 'transparent',
    };
  }

  async componentWillUnmount() {
    this.state.unsubscribeNetwork();
  }

  async componentWillMount() {
    try {
      let storedEmail = await AsyncStorage.getItem('storedEmail');
      if (storedEmail === null) {
        if ((await AsyncStorage.getItem('onboarding')) === '1') {
          this.props.navigation.navigate('LogIn');
        }

        if ((await AsyncStorage.getItem('onboarding')) === '0') {
          await AsyncStorage.setItem('onboarding', '1');
          this.props.navigation.navigate('Onboarding');
        }
      } else {
        const verified = (await this.state.API.fetchUser(storedEmail)).active;
        if (!verified) this.props.navigation.navigate('Verify');
      }
    } catch (err) {
      console.log(err);
    }
  }

  handleBack() {
    this.setState({visible: false, matchPossible: false});
  }

  async componentDidMount() {
    await AsyncStorage.setItem('onboarding', '0');
    let storedEmail = await AsyncStorage.getItem('storedEmail');

    if (storedEmail !== null && this.state.dataLoadRequired) {
      const data = await this.state.API.loadData(storedEmail);

      this.setState({
        cards: data,
        dataLoadRequired: false,
        unsubscribeNetwork: NetInfo.addEventListener((state) => {
          this.setState({isConnected: state.isConnected});
        }),
      });
    }

    APIConnection.attachHomePageNotifier(this.loadData.bind(this));
  }

  async loadData() {
    this.setState({refreshing: true});
    const data = await this.state.API.loadData(
      await AsyncStorage.getItem('storedEmail'),
    );
    this.setState({
      cards: data,
      dataLoadRequired: false,
      updateCount: this.state.updateCount + 1,
      visible: false,
      matchPossible: false,
      refreshing: false,
    });
  }

  async handleRightSwipe(email, image, name, swiped = false) {
    const swipeStatus = await this.state.API.rightSwipe(
      await AsyncStorage.getItem('storedEmail'),
      email,
    );

    if (swipeStatus.success) {
      !swiped ? this.swiper.swipeRight() : null;
      APIConnection.MatchesPage ? APIConnection.MatchesPage.notify() : null;
      if (swipeStatus.isMatch) {
        this.setState({matchPossible: true, image, name, email});
      }
    } else {
      // server didn't register the right swipe or the request didn't make sense.
      // TODO: display some sort of error message to the user that something's wrong
    }
  }

  async handleLeftSwipe(email, swiped = false) {
    const success = await this.state.API.leftSwipe(
      await AsyncStorage.getItem('storedEmail'),
      email,
    );

    if (success) !swiped ? this.swiper.swipeLeft() : null;
    else {
      // server didn't register the left swipe or the request didn't make sense.
      // TODO: display some sort of error message to the user that something's wrong
    }
  }

  renderCard = (item, index) => {
    return item ? (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={() =>
          this.setState({
            visible: true,
            name: item.name,
            age: item.age,
            keywords: item.keywords,
            bio: item.bio,
            uni: item.uni,
            image: item.image,
            projects: item.projects,
            experience: item.experience,
          })
        }
        delayLongPress={100}
        key={index}>
        <Card>
          <CardItem
            image={{uri: item.image, checksum: item.checksum}}
            name={item.name}
            keywords={item.keywords}
            email={item.email}
            key={index}
            description={
              item.bio.length > MAX_LENGTH
                ? item.bio.substring(0, MAX_LENGTH) + '...'
                : item.bio
            }
            actions
            onPressRight={() =>
              this.handleRightSwipe(item.email, item.image, item.name)
            }
            onPressLeft={() => this.handleLeftSwipe(item.email)}
          />
        </Card>
      </TouchableOpacity>
    ) : null;
  };

  onSwiped = (type) => {
    console.log(`on swiped ${type}`);
  };

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true,
    });
  };

  swipeLeft = () => {
    this.swiper.swipeLeft();
  };

  render() {
    AsyncStorage.getItem('storedEmail')
      .then((value) => {
        if (value !== null && this.state.dataLoadRequired) {
          this.loadData();
        }
      })
      .catch((err) => {
        console.log(er);
      });
    if (!this.state.isConnected) {
      this.props.navigation.navigate('Internet');
    }

    return this.state.cards.length > 0 ? (
      <ScrollView
        style={{zIndex: -1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadData.bind(this)}
          />
        }>
        <ImageBackground
          source={require('../assets/images/15.png')}
          style={[
            Styles.bg,
            {height: Dimensions.get('window').height * 0.904},
          ]}>
          <Image
            style={Styles.homeLogo}
            source={require('../assets/images/Findr_logo2x.png')}
          />
          <Swiper
            ref={(swiper) => {
              this.swiper = swiper;
            }}
            useViewOverflow={Platform.OS === 'ios'}
            onSwipedLeft={(index) =>
              this.handleLeftSwipe(this.state.cards[index].email, true)
            }
            onSwipedRight={(index) =>
              this.handleRightSwipe(
                this.state.cards[index].email,
                this.state.cards[index].image,
                this.state.cards[index].name,
                true,
              )
            }
            onSwiping={(x, y) => {
              if (x > 0) this.setState({borderColor: 'green'});
              else this.setState({borderColor: 'red'});
            }}
            onSwiped={() => this.setState({borderColor: 'transparent'})}
            onSwipedAborted={() => this.setState({borderColor: 'transparent'})}
            dragEnd={() => this.setState({borderColor: 'transparent'})}
            cardStyle={{
              borderColor: this.state.borderColor,
              borderWidth: 2,
              borderRadius: 40,
              height: Dimensions.get('window').height * 0.71,
              width: Dimensions.get('window').width * 0.81,
              marginLeft: Dimensions.get('window').width * 0.04,
              marginTop: Dimensions.get('window').height * 0.1,
            }}
            cards={this.state.cards}
            cardVerticalMargin={80}
            renderCard={this.renderCard}
            onSwipedAll={this.loadData.bind(this)}
            stackSize={3}
            containerStyle={Styles.containerHome}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard></Swiper>
        </ImageBackground>
      </ScrollView>
    ) : (
      <View></View>
    );
  }
}

export default Home;
