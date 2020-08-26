import React from 'react';
import styles from '../assets/styles';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  View,
  Image,
  FlatList,
  AsyncStorage,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Item from './SearchBubble';
import Tag from './ProfilePageComponents/Tag';
import CHECK from '../assets/icons/check.svg';

const DIMENTION_HEIGHT = Dimensions.get('window').height;
const DIMENTION_WIDTH = Dimensions.get('window').width;

class EditKeywords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      tags: props.navigation.state.params.tags,
      editable: true,
      count: 0
    };
  }

  filterList(list) {
    return list.filter((listItem) =>
      listItem.keyword.toLowerCase().includes(this.state.search.toLowerCase()),
    );
  }

  handleKeywordAdd(item) {
    if (!this.state.tags.includes(item)) {
      this.state.tags.push(item);
      this.setState({tags: this.state.tags});
    }
  }

  render() {
    const list = [
      {keyword: 'CSC108'},
      {keyword: 'CSC148'},
      {keyword: 'MAT102'},
      {keyword: 'MAT244'},
      {keyword: 'PHL245'},
      {keyword: 'ANT102'},
      {keyword: 'PHL247'},
      {keyword: 'PHL103'},
      {keyword: 'CSC207'},
      {keyword: 'MAT202'},
      {keyword: 'MAT223'},
      {keyword: 'CSC209'},
      {keyword: 'CSC108'},
      {keyword: 'CSC148'},
      {keyword: 'MAT102'},
      {keyword: 'MAT244'},
      {keyword: 'PHL245'},
      {keyword: 'ANT102'},
      {keyword: 'PHL247'},
      {keyword: 'PHL103'},
      {keyword: 'CSC207'},
      {keyword: 'MAT202'},
      {keyword: 'MAT223'},
      {keyword: 'CSC209'},
    ];

    if (this.state.count < 1) this.setState({ count: this.state.count + 1 });

    return (
      <ImageBackground
        source={require('../assets/images/Home.png')}
        style={styles.bg}>
        <View style={styles.top}>
          <Image
            style={styles.matchLogo}
            source={require('../assets/images/Findr_logo2x.png')}
          />
          <Text style={styles.title}>Edit your interests</Text>
        </View>

        {/* Search bar */}
        <TextInput
          onChangeText={(search) => this.setState({search})}
          style={styles.searchBar}
        />
        <ScrollView style={{height: DIMENTION_HEIGHT * 0.25}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginLeft: DIMENTION_WIDTH * 0.13,
            }}
          >
            {this.filterList(list).map((listItem, index) => (
              <TouchableOpacity
                onPress={() => this.handleKeywordAdd(listItem.keyword)}
                style={{
                  paddingHorizontal: DIMENTION_WIDTH * 0.01
                }}
              >
                <Item key={index} keyword={listItem.keyword} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View
          style={{
            borderBottomColor: 'black',
            borderBottomWidth: 3,
            width: '80%',
            alignSelf: 'center',
            paddingVertical: 10,
          }}
        />
        <ScrollView style={{ alignContent: "center", marginLeft: DIMENTION_WIDTH * 0.1 }}>
            <Tag
              containerStyle={{width: DIMENTION_WIDTH * 0.8}}
              tags={this.state.tags}
              // type={"interests"}
              editable={this.state.editable}
              updateCallback={this.props.navigation.state.params.updateKey}
            />
        </ScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: '#156070',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            height: 50,
            margin: 10,
            width: '50%',
            borderRadius: 40,
            borderWidth: 0.5,
            borderColor: '#156070',
          }}
          onPress={() => {
            this.setState({editable: false});
            this.props.navigation.navigate('Profile');
          }}>
          <Text style={{color: 'white', fontSize: 18}}>Confirm changes</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

export default EditKeywords;
