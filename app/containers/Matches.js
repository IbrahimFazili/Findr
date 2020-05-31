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
  AsyncStorage
} from 'react-native';
import CardItem from '../components/CardItem';
import Icon from '../components/Icon';
import Fetcher from "../assets/data/Fetcher";

class Matches extends React.Component {

  constructor(props) {
    super(props);
    this.state = { fetcher: new Fetcher(), cards: [] };
  }

  async componentDidMount() {
    const data = await this.state.fetcher.loadData(await AsyncStorage.getItem('storedEmail'));
    this.setState({ cards: data });
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/Home.png')}
        style={styles.bg}
      >
        <View style={styles.containerMatches}>
          <Image style={styles.matchLogo} source={require('../assets/images/Findr_logo2x.png')}/>
          <ScrollView>
            <View style={styles.matchTop}>
              <Text style={styles.matchTitle}>Pending Matches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllicon}>
                  See all<Icon name="arrow"/>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{flex:3, height:100}}>
              <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems:'center',
                paddingStart: 5,
                paddingEnd: 5,
              }}
              >
                <Thumbnail name="mike"
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}} 
                source={require('../assets/images/01.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/02.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/03.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/04.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/05.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/06.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/07.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/08.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/09.jpg')}/>
                <Thumbnail 
                style={{marginHorizontal: 10, borderColor: '#1a5d57', borderWidth: 2.7}}
                source={require('../assets/images/10.jpg')}/>
              </ScrollView>
            </View>

            <View style={styles.matchTopSub}>
              <Text style={styles.matchTitle}>Matches</Text>
            </View>

            <FlatList
              numColumns={2}
              data={this.state.cards}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity>
                  <CardItem 
                    image={ { uri: item.image } }
                    name={item.name}
                    status={'Online'}
                    variant
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

export default Matches;
