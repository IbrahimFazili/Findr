import React from 'react';
import { View, AsyncStorage, Image, Dimensions, ScrollView } from 'react-native';
import styles from '../assets/styles';
import { DefaultTheme, TextInput, Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper'
import APIConnection from '../assets/data/APIConnection';

const DIMENTIONS = Dimensions.get('window');

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
    height: DIMENTIONS.height * 0.06,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignSelf: 'center',
    backgroundColor: "#5EA39D",
    opacity: 0.5,
    marginBottom: "8%"
};

function validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/;
    return regex.test(password);
}

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 

            date: null,
            name: "",
            email: "",
            password: "",
            uni: "",
            major: "",

            isNameValid: false,
            isEmailValid: false,
            isPasswordValid: false,
            isUniValid: false,
            isMajorValid: false,

            showDots: true
        };
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
            <View style={{backgroundColor: "#164e48", width: "100%", height: "100%", padding: '3%' }}>
                <Image style={styles.logo} source={require('../assets/images/Findr_white2x.png')}/>
                <Swiper
                    height={DIMENTIONS.height * 0.6}
                    dot={
                        <View
                        style={{
                            backgroundColor: 'rgba(0,0,0,.3)',
                            width: DIMENTIONS.width * 0.02,
                            height: DIMENTIONS.width * 0.02,
                            borderRadius: 10,
                            marginBottom: DIMENTIONS.height * 0.01,
                            marginHorizontal: DIMENTIONS.width * 0.025
                        }}/>
                    }
                    activeDot={
                        <View
                        style={{
                            backgroundColor: '#FFF',
                            width: DIMENTIONS.width * 0.02,
                            height: DIMENTIONS.width * 0.02,
                            borderRadius: 10,
                            marginBottom: DIMENTIONS.height * 0.01,
                            marginHorizontal: DIMENTIONS.width * 0.025
                        }}/>
                    }
                    loop={false}
                    showsPagination={this.state.showDots}
                    >
                    <ScrollView style={styles.slide0}>
                        <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.name}
                            label={"Name"}
                            placeholder="Enter your full name"
                            onChangeText={this.handleNameChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.email}
                            label={"E-Mail"}
                            placeholder="email@example.com"
                            onChangeText={this.handleEmailChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        <TextInput
                            underlineColor="transparent"
                            secureTextEntry={true}
                            mode={"flat"}
                            value={this.state.password}
                            label={"Password"}
                            placeholder="Enter your new password"
                            onChangeText={this.handlePasswordChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                    </ScrollView>
                    <ScrollView style={styles.slide1}>
                        <DatePicker
                            date={this.state.date}
                            mode="date"
                            placeholder="Date of Birth"
                            format="MM-DD-YYYY"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateInput: {
                                    marginTop: DIMENTIONS.height * 0.02,
                                    borderBottomLeftRadius: 30,
                                    borderBottomRightRadius: 30,
                                    borderTopLeftRadius: 30,
                                    borderTopRightRadius: 30,
                                    height: DIMENTIONS.height * 0.06,
                                },
                                dateText: {
                                    color: '#FFFFFF'
                                }
                            }}
                            style={{ 
                                width: DIMENTIONS.width * 0.7,
                                marginBottom: DIMENTIONS.height * 0.05,
                                alignSelf: 'center',
                            }}
                            showIcon={false}
                            onDateChange={(date) => {this.setState({date: date})}}
                            androidMode='spinner'
                        />

                        <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.uni}
                            label={"University"}
                            placeholder="Enter your university"
                            onChangeText={this.handleUniChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.major}
                            label={"Major"}
                            placeholder="Enter your major"
                            onChangeText={this.handleMajorChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        <Button mode="contained" style={styles.signupbutt}>Sign Up</Button>
                        
                        <Button 
                        labelStyle={{color: "#FFF"}}
                        style={styles.loginRedirect}
                        onPress={() => this.props.navigation.navigate("LogIn")}
                        mode='outlined'
                        >
                            Log in
                        </Button>
                    </ScrollView>
                </Swiper>
                
            </View>
        );
    }
}

export default SignUp;
