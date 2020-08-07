import React from "react";
import {
	View,
	Text,
	AsyncStorage,
	Dimensions,
	StyleSheet,
	NetInfo,
	Image,
	ImageBackground,
	Alert,
} from "react-native";
import styles from "../../assets/styles/index";
import KeyValue from "./KeyValue";
import APIConnection from "../../assets/data/APIConnection";
import {Dropdown} from 'react-native-material-dropdown'


const DIMENTIONS = Dimensions.get("window");

let genders=[
    {value: "Male",},
    {value: "Female",},
    {value: "Other",},
    {value: "Prefer Not To Say",},
];

class BasicInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			gender: "",
			bio: "",
			major: "",
			uni: "",
			sendG: "",
			editable: false,
		};
	}

	componentWillReceiveProps(props) {
		const updatedProps = {};
		if (this.state.email !== props.email) updatedProps.email = props.email;
		if (this.state.gender !== props.gender)
			updatedProps.gender = props.gender;
		if (this.state.bio !== props.bio) updatedProps.bio = props.bio;
		if (this.state.major !== props.major) updatedProps.major = props.major;
		if (this.state.uni !== props.uni) updatedProps.uni = props.uni;
		if (this.state.editable !== props.editable) {
			this.state.editable && !props.editable ? this.sendUpdate() : null;
			updatedProps.editable = props.editable;
		}

		if (Object.keys(updatedProps).length > 0) {
			this.setState(updatedProps);
		}
	}

	_getFormattedGender(gender) {
		switch (gender) {
			case "":
				return "";
			case "M":
				return "Male";
			case "F":
				return "Female";
			case "O":
				return "Other";
			case "P":
				return "Prefer Not To Say";
			default:
				return "";
		}
	}

	async sendUpdate() {
		const API = new APIConnection();
		const status = await API.updateUserInfo({
			email: this.state.email,
			gender: this.state.sendG,
			bio: this.state.bio,
			uni: this.state.uni,
			major: this.state.major,
		});

		if (status === 201) {
			APIConnection.ProfilePage.notify();
		} else {
			Alert.alert(
				"Update failed",
				"Couldn't update your info, try again later"
			);
		}
	}

	handleGenderChange(text){
		if (text === "Male"){
			this.setState({gender: 'Male', sendG : 'M'})
		}
		else if (text === "Female"){
			this.setState({gender: 'Female', sendG : 'F'})
		}
		else if (text === "Prefer Not To Say"){
			this.setState({gender: 'Prefer Not To Say', sendG : 'P'})
		}
		else{
			this.setState({gender: 'Other', sendG : 'O'})
		}
	}

	updateHandler(type, updatedValue) {
		if (type === "gender") {
			this.setState({ gender: updatedValue });
		} else if (type === "about") {
			this.setState({ bio: updatedValue });
		} else if (type === "major") {
			this.setState({ major: updatedValue });
		} else if (type === "uni") {
			this.setState({ uni: updatedValue });
		}
	}

	render() {
		return (
			<View style={{ alignItems: "center", paddingVertical: 25, }}>
				<KeyValue
					_key="Email"
					value={this.state.email}
					spacing={12}
					width={DIMENTIONS.height * 0.4}
					keyStyle={{ color: "#1a5d57", fontSize: 15 }}
					valueStyle={{
						color: "black",
						marginTop: -DIMENTIONS.height * 0.03,
					}}
					editable={false}
				/>
				<KeyValue
					_key="University"
					value={this.state.uni}
					spacing={4}
					width={DIMENTIONS.height * 0.4}
					keyStyle={{ color: "#1a5d57", fontSize: 15 }}
					valueStyle={{
						color: "black",
						marginTop: -DIMENTIONS.height * 0.03,
					}}
					editable={this.state.editable}
					updateValue={((value) =>
						this.updateHandler("uni", value)).bind(this)}
				/>
				<KeyValue
					_key="Major"
					value={this.state.major}
					spacing={12}
					multiline={true}
					width={DIMENTIONS.height * 0.4}
					keyStyle={{ color: "#1a5d57", fontSize: 15 }}
					valueStyle={{
						color: "black",
						marginTop: -DIMENTIONS.height * 0.005,
					}}
					editable={this.state.editable}
					updateValue={((value) =>
						this.updateHandler("major", value)).bind(this)}
				/>
				{/* <KeyValue
					_key="Gender"
					value={this._getFormattedGender(this.state.gender)}
					spacing={8}
					width={DIMENTIONS.height * 0.4}
					keyStyle={{
						color: "#1a5d57",
						fontSize: 15,
						marginTop: DIMENTIONS.height * 0.01,
					}}
					valueStyle={{
						color: "black",
						marginTop: -DIMENTIONS.height * 0.005,
					}}
					editable={this.state.editable}
					updateValue={((value) =>
						this.updateHandler("gender", value)).bind(this)}
				/> */}
				{this.state.editable ? 
				<Dropdown data={genders}
				dropdownPosition={-5}
				containerStyle={styles.genderDrop}
				pickerStyle={{borderRadius: 35,}}
				dropdownOffset={{ top: 20, left: 10 }}
				itemCount={4}
				textColor="black"
				itemColor="black"
				baseColor='black'
				onChangeText={this.handleGenderChange.bind(this)}
				selectedItemColor="black"
				disabledItemColor="black"/> :
				<KeyValue
					_key="Gender"
					value={this._getFormattedGender(this.state.gender)}
					spacing={8}
					width={DIMENTIONS.height * 0.4}
					keyStyle={{
						color: "#1a5d57",
						fontSize: 15,
						marginTop: DIMENTIONS.height * 0.01,
					}}
					valueStyle={{
						color: "black",
						marginTop: -DIMENTIONS.height * 0.005,
					}}
					editable={this.state.editable}
					updateValue={((value) =>
						this.updateHandler("gender", value)).bind(this)}
				/>
				 } 

				<KeyValue
					_key="About me"
					value={this.state.bio}
					width={DIMENTIONS.width * 0.8}
					spacing={1}
					keyStyle={{
						color: "#1a5d57",
						fontSize: 15,
						marginTop: DIMENTIONS.height * 0.01,
					}}
					valueStyle={{
						color: "black",
						marginBottom: -DIMENTIONS.height * 0.075,
						marginLeft: -DIMENTIONS.width * 0.003,
					}}
					editable={this.state.editable}
					multiline={true}
					updateValue={((value) =>
						this.updateHandler("about", value)).bind(this)}
				/>
			</View>
		);
	}
}

export default BasicInfo;
