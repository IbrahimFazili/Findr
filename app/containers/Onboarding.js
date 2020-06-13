import React from 'react';
import { View, AsyncStorage, Image, Text, ScrollView, Dimensions, ImageBackground, Animated } from 'react-native';
import styles from '../assets/styles';
import { DefaultTheme, Provider as PaperProvider, TextInput, RadioButton, Dialog, Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper'
import APIConnection from '../assets/data/APIConnection';
import { Thumbnail } from "native-base";
import CardItem from '../components/CardItem';
import SignUp from './SignUp';

const theme = {
    colors: {
        ...DefaultTheme.colors,
        primary: "transparent",
        text: 'white', 
        placeholder: 'lightgrey',
        labelColor: 'black',
    },
};

const textBoxStyle = { 
    width: '75%',
    height: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignSelf: 'center',
    backgroundColor: "#5EA39D",
    opacity: 0.5,
    marginBottom: "8%"
};

const thumbnailStyle = {
    marginHorizontal: 10,
    borderColor: "#1a5d57",
    borderWidth: 2.7,
  };

// const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;


function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
    return regex.test(password);
}

class Onboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 

            date: null,
            name: "",
            email: "",
            password: "",
            uni: "",
            major: "",

            nameLabel: "Name",
            emailLabel: "Email",
            passLabel: "Password",
            uniLabeL: "University",
            majorLabel: "Major",

            isNameValid: false,
            isEmailValid: false,
            isPasswordValid: false,
            isUniValid: false,
            isMajorValid: false,

            API: new APIConnection(),
            cards: []
        };
    }

    

    async componentDidMount() {
        const data = await this.state.API.loadData("meredith.grey@seattlegrace.com");
        this.setState({ cards: data });
    }

    async handleSubmit() {
        if(!this.state.isNameValid || !this.state.isEmailValid || !this.state.isPasswordValid
            || !this.state.date || !this.state.isUniValid || !this.state.isMajorValid) {
            console.log(this.state);
            console.log('invalid inputs');
            return;
        }
        const API = new APIConnection();
        const data = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            uni: this.state.uni,
            major: this.state.major,
            age: this.state.date,
            // image: req.body.image
        }

        const signUpStatus = await API.requestSignUp(data);
        if(signUpStatus === 201) {
            await AsyncStorage.setItem('storedEmail', data.email);
            this.props.navigation.navigate('AppScreen');
        }
    }

    render() {
        console.log(this.state.cards);
        return (
            <View style={{width: "100%", height: "100%"}}>
                <Swiper
                    style={styles.onboardingWrapper}
                    height={fullHeight}
                    onMomentumScrollEnd={(e, state, context) =>
                        console.log('index:', state.index)
                    }
                    dot={
                        <View
                        style={{
                            backgroundColor: 'rgba(0,0,0,.3)',
                            width: 10,
                            height: 10,
                            borderRadius: 10,
                            marginLeft: 7,
                            marginRight: 7,
                            marginBottom: 10
                        }}/>
                    }
                    activeDot={
                        <View
                        style={{
                            backgroundColor: '#FFF',
                            width: 12,
                            height: 12,
                            borderRadius: 10,
                            marginRight: 7,
                            marginLeft: 7,
                            marginBottom: 10
                        }}/>
                    }
                    paginationStyle={{
                        bottom: -23,
                        left: null,
                        right: 10
                    }}
                    loop={false}
                >
                    <View style={styles.slide1}>
                        <ImageBackground
                            source={require("../assets/images/Page_1.png")}
                            style={styles.onboardingBg}
                        >
                        <View style={styles.slideOneTop}>
                            <Text style={styles.slideTwoHeader}>Efficient Work</Text>
                            <Text style={styles.slideTwoNormal}>Master the Art of Studying Efficiently</Text> 
                        </View>
                        <View style={styles.slideoneCarousel}>
                            <ScrollView
                                ref={ref => this.scrollView = ref}
                                onLayout={(e) =>
                                    this.scrollView.scrollToEnd({animated: true})
                                }
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
                                    <CardItem
                                        variant
                                        key={user.name}
                                        image={{ uri: user.image }}
                                        name={user.name}
                                        status={"Online"}
                                    />
                                </View>
                                ))}
                            </ScrollView>
                        </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.slide2}>
                        <ImageBackground
                            source={require("../assets/images/Page_2.png")}
                            style={styles.onboardingBg}
                        >
                        <View style={styles.slideTwoContent}>
                            <Text style={styles.slideTwoHeader}>Network Smarter</Text>
                            <Text style={styles.slideTwoNormal}>Get outside your comfort zone!</Text>
                            <Text style={styles.slideTwoNormal}>Find people in every field</Text>
                            <Image style={styles.addIcon} source={require('../assets/images/icn_add.png')}/>
                        </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.slide3}>
                        <ImageBackground
                                source={require("../assets/images/Page_3.png")}
                                style={styles.onboardingBg}
                        >
                        </ImageBackground>
                    </View>
                    <View style={styles.slide4}>
                        <ImageBackground
                            source={require("../assets/images/Page4.png")}
                            style={styles.onboardingBg}
                        >
                        <View style={styles.slide4content}>
                            <Image style={styles.onboardinglogo} source={require('../assets/images/Findr_white2x.png')}/>
                            <View style={styles.slide4buttons}>
                                <Button mode="contained" style={styles.onBoardingButt}>
                                    Sign Up
                                </Button>
                                <Image style={styles.onBoardingSep} source={require('../assets/images/OR_photo.png')}/>
                                <Button mode="contained" style={styles.onBoardingButt}>
                                    Log in
                                </Button> 
                            </View>
                        </View>
                        </ImageBackground>
                    </View>
                </Swiper>
            </View>
        );
    }
}

export default Onboarding;
