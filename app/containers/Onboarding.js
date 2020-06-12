import React from 'react';
import { View, AsyncStorage, Image, Text, ScrollView, Dimensions, ImageBackground } from 'react-native';
import styles from '../assets/styles';
import { DefaultTheme, Provider as PaperProvider, TextInput, RadioButton, Dialog, Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper'
import APIConnection from '../assets/data/APIConnection';
import { Thumbnail } from "native-base";

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
        const data = await this.state.API.loadData(
          await AsyncStorage.getItem("harsh@gmail.com")
        );
        this.setState({ cards: data });
      }

    handleNameChange(text) {
        if(text.length >= 3 && text.length <= 30) {
            this.setState({ isNameValid: true, name: text });
            return;
        }
        this.setState({ isNameValid: false, name: text });
    }

    handleEmailChange(text) {
        if(validateEmail(text.toLowerCase())) {
            this.setState({ isEmailValid: true, email: text });
            return;
        }

        this.setState({ isEmailValid: false, email: text.toLowerCase() });
    }

    handlePasswordChange(text) {
        if(validatePassword(text)) {
            this.setState({ isPasswordValid: true, password: text });
            return;
        }
        this.setState({ password: text, isPasswordValid: false });
    }

    handleUniChange(text) {
        if(text.length >= 6) {
            this.setState({ isUniValid: true, uni: text });
            return;
        }
        this.setState({ isUniValid: false, uni: text });
    }

    handleMajorChange(text) {
        if(text.length >= 6) {
            this.setState({ isMajorValid: true, major: text });
            return;
        }
        this.setState({ isMajorValid: false, major: text });
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
                            <Text>Efficient Work</Text>
                            <Text>Master the Art of Studying Efficiently</Text> 
                        </View>
                        <View style={styles.slideoneCarousel}>
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
                                        style={thumbnailStyle}
                                        source={{ uri: user.image }}
                                        key={user.name}
                                    />
                                    <Text style={styles.thumbnailCaption}>
                                        {user.name.substring(0, user.name.search(" "))}
                                    </Text>
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
                        <View style={styles.slide3text}>
                            <TextInput
                                underlineColor="transparent"
                                mode={"flat"}
                                value={this.state.name}
                                label='Name'
                                placeholder="Enter your full name"
                                onFocus={() => this.setState({ nameLabel: "" })}
                                onBlur={() => this.setState({ nameLabel: this.state.name.length === 0 ? "Name" : "" })}
                                onChangeText={this.handleNameChange.bind(this)}
                                theme={theme}
                                style={textBoxStyle}
                            />

                            <TextInput
                                underlineColor="transparent"
                                mode={"flat"}
                                value={this.state.email}
                                label='Email'
                                placeholder="email@example.com"
                                onFocus={() => this.setState({ emailLabel: "" })}
                                onBlur={() => this.setState({ emailLabel: this.state.email.length === 0 ? "Email" : "" })}
                                onChangeText={this.handleEmailChange.bind(this)}
                                theme={theme}
                                style={textBoxStyle}
                            />

                            <TextInput
                                underlineColor="transparent"
                                secureTextEntry={true}
                                mode={"flat"}
                                value={this.state.password}
                                label='Password'
                                placeholder="Enter your new password"
                                onFocus={() => this.setState({ passLabel: "" })}
                                onBlur={() => this.setState({ passLabel: this.state.password.length === 0 ? "Password" : "" })}
                                onChangeText={this.handlePasswordChange.bind(this)}
                                theme={theme}
                                style={textBoxStyle}
                            />
                        </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.slide4}>
                        <ImageBackground
                            source={require("../assets/images/Page4.png")}
                            style={styles.onboardingBg}
                        >
                        <View style={styles.slide4text}>
                            <DatePicker
                                date={this.state.date}
                                mode="date"
                                placeholder="Date of Birth"
                                format="MM-DD-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateInput: {
                                        marginLeft: 36,
                                        borderBottomLeftRadius: 30,
                                        borderBottomRightRadius: 30,
                                        borderTopLeftRadius: 30,
                                        borderTopRightRadius: 30,
                                        height: 50
                                    }
                                }}
                                showIcon={false}
                                style={{ marginLeft: '4%', marginBottom: "8%", width: "83%"}}
                                onDateChange={(date) => {this.setState({date: date})}}
                                androidMode='spinner'
                            />

                            <TextInput
                                underlineColor="transparent"
                                mode={"flat"}
                                value={this.state.uni}
                                label='University'
                                placeholder="Enter your university"
                                onFocus={() => this.setState({ uniLabel: "" })}
                                onBlur={() => this.setState({ uniLabel: this.state.uni.length === 0 ? "University" : "" })}
                                onChangeText={this.handleUniChange.bind(this)}
                                theme={theme}
                                style={textBoxStyle}
                            />

                            <TextInput
                                underlineColor="transparent"
                                mode={"flat"}
                                value={this.state.major}
                                label='Major'
                                placeholder="Enter your major"
                                onFocus={() => this.setState({ majorLabel: "" })}
                                onBlur={() => this.setState({ majorLabel: this.state.major.length === 0 ? "Major" : "" })}
                                onChangeText={this.handleMajorChange.bind(this)}
                                theme={theme}
                                style={textBoxStyle}
                            />
                            <Button mode="contained" style={styles.signupbutt}>
                                Sign Up
                            </Button>
                            <View style={styles.bottomsignup}>
                                <Button transparent='true' labelStyle={{color: "#FFF"}} style={styles.signupredirect}>
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
