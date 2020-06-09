import React from "react";
import styles from "../assets/styles";
import { Thumbnail } from "native-base";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  AsyncStorage,
} from "react-native";
import CardItem from "../components/CardItem";
import Icon from "../components/Icon";
import APIConnection from "../assets/data/APIConnection";

const thumnailStyle = {
  marginHorizontal: 10,
  borderColor: "#1a5d57",
  borderWidth: 2.7,
};

class Matches extends React.Component {
  constructor(props) {
    super(props);
    this.state = { API: new APIConnection(), cards: [] };
  }

  async componentDidMount() {
    const data = await this.state.API.loadData(
      await AsyncStorage.getItem("storedEmail")
    );
    this.setState({ cards: data });
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/images/Home.png")}
        style={styles.bg}
      >
        <View style={styles.containerMatches}>
          <ScrollView>
            <Image
              style={styles.matchLogo}
              source={require("../assets/images/Findr_logo2x.png")}
            />
            <View style={styles.matchTop}>
              <Text style={styles.matchTitle}>Pending Matches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllicon}>
                  See all
                  <Icon name="arrow" />
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 3, height: 130 }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  alignItems: "center",
                  paddingStart: 5,
                  paddingEnd: 5,
                }}
              >
                {this.state.cards.map((user) => (
                  <View>
                    <Thumbnail
                      large
                      style={thumnailStyle}
                      source={{ uri: user.image }}
                      key={user.name}
                    />
                    <Text style={styles.thumbnailCaption}>
                      {user.name.substring(0, user.name.search(" "))}
                    </Text>
                  </View>
                ))}
                {/* <Thumbnail large
                style={thumnailStyle} 
                source={require('../assets/images/01.jpg')}
                />
                <Text style={styles.thumbnailCaption}>Alex</Text>

                <Thumbnail large
                style={thumnailStyle}
                source={require('../assets/images/02.jpg')}/>
                <Text style={styles.thumbnailCaption}>Haley</Text>

                <Thumbnail large
                style={thumnailStyle}
                source={require('../assets/images/03.jpg')}/>
                <Text style={styles.thumbnailCaption}>Luke</Text>

                <Thumbnail large
                style={thumnailStyle}
                source={require('../assets/images/04.jpg')}/>
                <Text style={styles.thumbnailCaption}>Phil</Text>

                <Thumbnail large
                style={thumnailStyle}
                source={require('../assets/images/05.jpg')}/>
                <Text style={styles.thumbnailCaption}>Jay</Text>

                <Thumbnail large
                style={thumnailStyle}
                source={require('../assets/images/06.jpg')}/>
                <Text style={styles.thumbnailCaption}>Cam</Text> */}
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
                    image={{ uri: item.image }}
                    name={item.name}
                    status={"Online"}
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
