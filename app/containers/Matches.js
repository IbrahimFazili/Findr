import React from 'react';
import styles from '../assets/styles';
import {Thumbnail} from 'native-base';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  AsyncStorage,
  RefreshControl,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import CardItem from '../components/CardItem';
import APIConnection from '../assets/data/APIConnection';

const thumnailStyle = {
  marginHorizontal: 10,
  borderColor: '#1a5d57',
  borderWidth: 2.7,
};

const PLACEHOLDER_PNG = require('../assets/images/placeholder.png');

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      API: new APIConnection(),
      cards: [],
      pending_cards: [],
      visible: false,
      name: '',
      keywords: [],
      bio: '',
      uni: '',
      isConnected: true,
      refreshing: false,
      unsubscribeNetwork: null,
    };
  }

  async loadData() {
    this.setState({refreshing: true});
    const data = await this.state.API.fetchMatches(
      await AsyncStorage.getItem('storedEmail'),
    );
    let pendingMatches = await this.state.API.fetchPendingMatches(
      await AsyncStorage.getItem('storedEmail'),
    );
    pendingMatches = pendingMatches.map((value) => {
      return {data: value, placeholder: false};
    });
    this.scrollView.scrollToEnd({animated: true, duration: 1000});
    this.setState({
      cards: data,
      pending_cards: pendingMatches,
      refreshing: false,
    });
  }

  async componentDidMount() {
    this.loadData();
    this.setState({
      unsubscribeNetwork: NetInfo.addEventListener((state) => {
        this.setState({isConnected: state.isConnected});
      }),
    });

    APIConnection.attachMatchPageNotifier(this.loadData.bind(this));
  }

  async componentWillUnmount() {
    this.state.unsubscribeNetwork();
  }

  render() {
    if (!this.state.isConnected) {
      this.props.navigation.navigate('Internet');
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.loadData.bind(this)}
          />
        }>
        <ImageBackground
          source={require('../assets/images/Home.png')}
          style={styles.bg}>
          <View style={styles.containerMatches}>
            <ScrollView>
              <Image
                style={styles.matchLogo}
                source={require('../assets/images/Findr_logo2x.png')}
              />
              <View style={styles.matchTop}>
                <Text style={styles.matchTitle}>Pending Matches</Text>
              </View>

              <View style={{flex: 3, height: 130}}>
                <ScrollView
                  ref={(ref) => (this.scrollView = ref)}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: 'center',
                    paddingStart: 5,
                    paddingEnd: 5,
                  }}>
                  {this.state.pending_cards.map((user, i) => (
                    <View>
                      <Thumbnail
                        large
                        style={thumnailStyle}
                        source={
                          user.placeholder
                            ? PLACEHOLDER_PNG
                            : {uri: user.data.image}
                        }
                        key={user.data.name}
                        onError={(err) => {
                          this.state.pending_cards[i].placeholder = true;
                          this.setState({
                            pending_cards: this.state.pending_cards,
                          });
                        }}
                      />
                      <Text style={styles.thumbnailCaption}>
                        {user.data.name.substring(
                          0,
                          user.data.name.search(' '),
                        )}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.matchTopSub}>
                <Text style={styles.matchTitle}>Matches</Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <FlatList
                  numColumns={2}
                  data={this.state.cards}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() =>
                        this.props.navigation.navigate('OtherProfile2', {
                          email: item.email,
                        })
                      }>
                      <CardItem
                        image={{uri: item.image, checksum: item.checksum}}
                        name={item.name}
                        status={'Online'}
                        email={item.email}
                        variant
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </ScrollView>
    );
  }
}

export default Matches;
