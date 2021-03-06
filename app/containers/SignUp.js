import React from 'react';
import { View, AsyncStorage, Image, Dimensions, ScrollView, Text } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import styles from '../assets/styles';
import { DefaultTheme, TextInput, Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';
import Swiper from 'react-native-swiper'
import APIConnection from '../assets/data/APIConnection';
import {Dropdown} from 'react-native-material-dropdown'


const DIMENTIONS = Dimensions.get('window');
const CARDS_NUMBER = 2

const theme = {
    colors: {
        ...DefaultTheme.colors,
        primary: "transparent",
        text: 'white', 
        placeholder: 'darkgrey',
        labelColor: 'black',
        underlineColor:  'transparent',
    },
    
};

const textBoxStyle = { 
    width: '75%',
    height: DIMENTIONS.height * 0.06,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderRadius: 35,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderColor: 'darkgrey',
    opacity: 1,
    marginBottom: "8%",
    zIndex: -1,
    unsubscribeNetwork: null,

};


function validateEmail(email) {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*_])[a-zA-Z0-9!@#$%^&*_]{6,}$/;
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
      confirmedPassword: "",
      idxActive: 0,

      nameLabel: "Name",
      emailLabel: "Email",
      passLabel: "Password",
      uniLabeL: "University",

      isNameValid: false,
      isEmailValid: false,
      isPasswordValid: false,
      isConfirmValid: false,
      isUniValid: false,
      showDots: true,
      dropdownVisible: false,
      goingToPrivacy: false,
      emailUse: false,
      unsubscribeNetwork: null,

      isConnected: true,
      universityArray: []
    };
  }


  handleNameChange(text) {
    if (text.length >= 3) {
      this.setState({ isNameValid: true, name: text });
      return;
    }
    this.setState({ isNameValid: false, name: text });
  }

  async checkDuplicateEmail(email){
    try {
      const res = await (new APIConnection()).fetchUser(email);
      this.setState({emailUse: true})
    }
    catch(err){
      this.setState({emailUse: false})
    }
  }

  handleEmailChange(text) {
    this.checkDuplicateEmail(text)
    if (validateEmail(text.toLowerCase())) {
        this.setState({ isEmailValid: true, email: text });
        return;
    }
    this.setState({ isEmailValid: false, emailUse: false, email: text.toLowerCase() });
  }

  handlePasswordChange(text) {
    if (validatePassword(text)) {
      this.setState({ isPasswordValid: true, password: text });
      return;
    }
    this.setState({ password: text, isPasswordValid: false });
  }

  handlePasswordConfirmChange(text){
    if (this.state.password === text){
      this.setState({isConfirmValid: true, confirmedPassword: text})
      return;
    }
    this.setState({isConfirmValid: false, confirmedPassword: text})
  }

  handleUniChange(text) {
    if (text.length >= 6) {
      this.setState({ isUniValid: true, uni: text });
      return;
    }
    this.setState({ isUniValid: false, uni: text });
  }

  async componentDidMount(){

    const temp = await ((new APIConnection())).fetchUniversities()
    this.setState({ universityArray: temp.map((value) => { return { value } }) ,
    unsubscribeNetwork: NetInfo.addEventListener( state => {
      this.setState({isConnected: state.isConnected})
    })})
  }

  async componentWillUnmount() {
    this.state.unsubscribeNetwork()
  }

  onPressNext = () => {
    const { idxActive } = this.state;
    if (idxActive < CARDS_NUMBER) {
      this.refs.swiper.scrollBy(1);
    }
  };

  handleConnectivityChange = isConnected => {
    this.setState({ isConnected });
  };

  handlePrivacyChange(){
    this.setState({goingToPrivacy: true})
  }

  async handleSubmit() {
    if (
      !this.state.isNameValid ||
      !this.state.isEmailValid ||
      !this.state.isPasswordValid ||
      !this.state.date ||
      !this.state.isUniValid ||
      this.state.emailUse
      ) 
    {
      console.log("invalid inputs");
      return;
    }
    const API = new APIConnection();
    const data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      uni: this.state.uni,
      age: this.state.date,
    };

    const signUpResponse = await API.requestSignUp(data);
    if (signUpResponse.status === 201) {
      // signup successful, store email locally and upload profile picture (if provided)
      await AsyncStorage.setItem("storedEmail", data.email);
      this.props.navigation.navigate("Privacy");
    }
  }

    render() {
        if (!this.state.isConnected) {
          this.props.navigation.navigate("Internet");
        }
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
                    onIndexChanged={(newIndex) => {
                      this.setState({ idxActive: newIndex });
                    }}
                    ref={"swiper"}
                    bounces={true}
                    >
                    <ScrollView style={styles.slide0}>
                        <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.name}
                            label={"Name"}
                            autoCompleteType="name"
                            placeholder="Enter your full name"
                            onChangeText={this.handleNameChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        {this.state.isNameValid === true || this.state.name === "" ? null : 
                        <Text style={styles.errorName}>Name must be greater than 3 characters</Text>}

                        <Dropdown label="University" data={this.state.universityArray}
                            dropdownPosition={-6.15}
                            containerStyle={styles.uniDropDown}
                            pickerStyle={{borderRadius: 35,}}
                            dropdownOffset={{top: 20, left: 10}}
                            itemCount={6}
                            textColor="white"
                            itemColor="black"
                            baseColor='darkgrey'
                            onChangeText={(value)=> this.handleUniChange(value)}
                            selectedItemColor="black"
                            disabledItemColor="black"
                          />

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
                                    borderColor: "darkgrey",
                                },
                                dateText: {
                                    color: 'white',
                                },
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

                        <Button 
                            labelStyle={{color: "#FFF"}}
                            style={styles.signUpNext}
                            onPress={this.onPressNext}
                            mode='contained'
                        >
                            Next
                        </Button>

                    </ScrollView>
                    <ScrollView style={styles.slide1}>

                    <TextInput
                            underlineColor="transparent"
                            mode={"flat"}
                            value={this.state.email}
                            label={"E-Mail"}
                            autoCompleteType="email"
                            placeholder="email@example.com"
                            onChangeText={this.handleEmailChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        {this.state.isEmailValid === true || this.state.email == "" ? null : 
                        <Text style={styles.errorMail}>Email provided is not valid</Text>} 
                        {this.state.emailUse === true ? 
                        <Text style={styles.errorMail2}>Email is already taken</Text> : 
                        null}
                        
                        <TextInput
                            underlineColor="transparent"
                            secureTextEntry={true}
                            mode={"flat"}
                            value={this.state.password}
                            label={"Password"}
                            autoCompleteType="password"
                            placeholder="Enter your new password"
                            onChangeText={this.handlePasswordChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />
                          {this.state.isPasswordValid === true || this.state.password === ""
                          || this.state.password.length >= 6 ? null : 
                          <View style={{ paddingRight:DIMENTIONS.width * 0.2}}>
                          <Text style ={styles.errorPassword}>Passwords must be greater than 5 characters, 
                          include a number, an uppercase, lowercase, and special character</Text>
                          </View>} 

                        <TextInput
                            underlineColor="transparent"
                            secureTextEntry={true}
                            mode={"flat"}
                            value={this.state.confirmedPassword}
                            label={"Confirm Password"}
                            placeholder="Confirm your new password"
                            onChangeText={this.handlePasswordConfirmChange.bind(this)}
                            onFocus={() => this.setState({ showDots: false })}
                            onBlur={() => this.setState({ showDots: true })}
                            theme={theme}
                            style={textBoxStyle}
                        />

                        {this.state.isConfirmValid === true || this.state.confirmedPassword === "" ?  null :
                        <Text style={styles.passwordNotError}>Passwords do not match</Text>} 
                        
                        <Button mode="contained" style={styles.signupbutt}
                          onPress={()=> this.handleSubmit()}
                        >
                          Sign Up
                        </Button>
                        <Image 
                            source={require('../assets/images/or.png')} 
                            style={{marginLeft: DIMENTIONS.width * 0.2}}
                        />

                        <Button 
                            labelStyle={{color: "#FFF"}}
                            style={styles.loginRedirect}
                            onPress={() => this.props.navigation.navigate("LogIn")}
                            mode='contained'
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
