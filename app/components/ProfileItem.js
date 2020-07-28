import React from 'react';
import styles from '../assets/styles';

import { Text, View, Image, Button, Dimensions, TouchableOpacity, AsyncStorage} from 'react-native';
import { DefaultTheme, Provider as PaperProvider, TextInput, RadioButton, Dialog} from 'react-native-paper';
const FULL_HEIGHT = Dimensions.get('window').height;
const FULL_WIDTH = Dimensions.get('window').width;

import APIConnection from "../assets/data/APIConnection";
import Pen from '../assets/icons/pen.svg';
import Check from '../assets/icons/check.svg';
import Tag from './Tag';
import TagEducation from "./TagEducation"
import TagCourses from "./TagCourses"
import TagClubs from "./TagClubs"
import Plus from "../assets/icons/Plus.svg";
import Minus from "../assets/icons/minus_green.svg";
import {Dropdown} from 'react-native-material-dropdown'


const theme = {
	colors: {
		...DefaultTheme.colors,
		primary: "black",
		text: 'black', 
		placeholder: 'darkgrey',
		labelColor: 'black',
		backgroundColor: 'white',
	},
};

const textBoxStyle = { 
	width: '75%',
	height: 50,
	alignSelf: 'center',
	backgroundColor: "transparent",
};


let genders=[
    {value: "Male",},
    {value: "Female",},
    {value: "Other",},
    {value: "Prefer Not To Say",},
];

class ProfileItem extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			isEditable1: false,
			isEditable2: false,
			isEditable3: false,
			isEditable4: false,
			password: "",
			name: props.name,
			uni: props.uni,
			major: props.major,
			gender: props.gender,
			clubs: [],
			courses: [],
			keywords: [],
			bio: "",

			nameLabel: "Name",
			emailLabel: "Email",
			passLabel: "Password", 
			uniLabeL: "University",
			majorLabel: "Major",
			genderLabel: "Gender",
			clubsLabel: "Clubs",
			coursesLabel: "Courses",
			keywordsLabel: "Keywords",
			bioLabel: "Bio",

			allProjects: [{value: ''}],
			allExp: [{value: ''}]
		}
	}

	addProjectInput = () => {
        const existingProjects = this.state.allProjects.map(fields => ({...fields}))
        const newProjects = [...existingProjects, {value: ''}]

        this.setState({allProjects: newProjects})
	}

	removeProjectInput = (targetIndex) => {
		this.setState({allProjects: this.state.allProjects.filter((item, index) => index !== targetIndex)})
	}

	addExpInput = () => {
        const existingExp = this.state.allExp.map(fields => ({...fields}))
        const newExp = [...existingExp, {value: ''}]

        this.setState({allExp: newExp})
	}
	onProjectTextChange = (text, index) => {
        const existingProjects = this.state.allProjects.map(fields => ({...fields}))
        let targetField = {...existingProjects[index]}
        targetField.value = text
        existingProjects[index] = targetField

        this.setState({allProjects: existingProjects})
	}

	removeExpInput = (targetIndex) => {
		this.setState({allExp: this.state.allExp.filter((item, index) => index !== targetIndex)})
	}

	onExpTextChange = (text, index) => {
        const existingExp = this.state.allExp.map(fields => ({...fields}))
        let targetField = {...existingExp[index]}
        targetField.value = text
        existingExp[index] = targetField

        this.setState({allExp: existingExp})
    }


	componentWillReceiveProps(props) {
		let updatedState = {};

		if (props.name !== this.state.name) {
			updatedState.name = props.name;
		}
		if (props.major !== this.state.major) {
			updatedState.major = props.major;
		}
		if (props.uni !== this.state.uni) {
			updatedState.uni = props.uni;
		}
		if (props.gender !== this.state.gender) {
			updatedState.gender = props.gender;
		}
		if (props.keywords !== this.state.keywords) {
			for (let i = 0; i < props.keywords.length; i++) {
				props.keywords[i] = props.keywords[i].toUpperCase();
			}
			updatedState.keywords = props.keywords;
		}
		if (props.clubs !== this.state.clubs) {
			updatedState.clubs = props.clubs;
		}

		if (props.courses !== this.state.courses) {
			updatedState.courses = props.courses;
		}

		if (props.bio !== this.state.bio) {
			updatedState.bio = props.bio;
		}


		if (Object.keys(updatedState).length > 0) {
			this.setState(updatedState);
		}
	}

	//Edit/Update event handlers
	handleEditClick1 = () => {
		this.setState({isEditable1: true});
	}

	handleUpdateClick1 = async() => {
		this.setState({isEditable1: false});
		const API = new APIConnection();
		const data = {
			email: await AsyncStorage.getItem("storedEmail"),
		};
		if(this.state.name.length !== 0){
			data.name = this.state.name
		}
		if(this.state.keywords.length !== 0){
			data.keywords = this.state.keywords
		}
		
		data.gender = this.state.sendG

		data.bio = this.state.bio
		if(Object.keys(data).length > 1){
			var update = await API.updateUserInfo(data);
			if (data.keywords) update = await API.updateKeywords(data);
			if (update == 500) {
				console.log("Server Error");
			}
			if (update == 201) {
				this.setState({
					keywords: this.state.keywords,
					name: this.state.name, 
					gender: this.state.gender[0].toUpperCase() + this.state.gender.substring(1,this.state.gender.length),
					bio: this.state.bio
				})
			}
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

	handleEditClick2 = () => {
		this.setState({isEditable2: true});
	}

	handleUpdateClick2 = async() => {
		this.setState({isEditable2: false});
		const API = new APIConnection();
		const data = {
			email: await AsyncStorage.getItem("storedEmail"),
		}

		if(this.state.major.length !== 0){
			data.major = this.state.major
		}

		data.clubs = this.state.clubs
		data.courses = this.state.courses

		const update = await API.updateUserInfo(data);
		if (update == 500) {
			console.log("Server Error");
		}
		if(update == 201) {
			this.setState({major: this.state.major, clubs: this.state.clubs})
		}
	}

	handleEditClick3 = async() => {
		this.setState({isEditable3: true});
		// this.addProjectInput()
	}

	handleUpdateClick3 = async() => {
		this.setState({isEditable3: false});
		const API = new APIConnection();
		const data = {
			email: await AsyncStorage.getItem("storedEmail"),
		}

		if(this.state.allProjects.length !== 0){
			data.projects = this.state.allProjects.map(fields => ({...fields}['value'])) //projects
		}
		const update = await API.updateUserInfo(data);
		if (update == 500) {
			console.log("Server Error");
		}
		if(update == 201) {
			this.setState({allProjects: this.state.allProjects}) //projects
		}
	}

	handleEditClick4 = () => {
		this.setState({isEditable4: true});
		// this.addExpInput()
	}

	handleUpdateClick4 = async() => {
		this.setState({isEditable4: false});
		const API = new APIConnection();
		const data = {
			email: await AsyncStorage.getItem("storedEmail"),
		}

		if(this.state.allExp.length !== 0){
			data.experience = this.state.allExp.map(fields => ({...fields}['value'])) //experience
		}
		const update = await API.updateUserInfo(data);
		if (update == 500) {
			console.log("Server Error");
		}
		if(update == 201) {
			this.setState({allExp: this.state.allExp}) //experience
		}
	}

	handleNameChange(text) {
		if(text.length >= 3 && text.length <= 30) {
			this.setState({ isNameValid: true, name: text });
			return;
		}
		this.setState({ isNameValid: false, name: text });
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

	handleKeywordChange(tag, arrayTag){
		if (tag.length > 0){
		this.setState({keywords: arrayTag.concat([tag])})
		}
		else{
			this.setState({keywords: arrayTag})
		}
	}

	handleClubChange(tag, clubArray){
		if (tag.length > 0){
			this.setState({clubs: clubArray.concat([tag])})
			}
		else{
			this.setState({clubs: clubArray})
		}
	}

	handleCourseChange(tag, courseArray){
		if (tag.length > 0){
			this.setState({courses: courseArray.concat([tag])})
		}
		else{
			this.setState({courses: courseArray})
		}
	}

	handleBioChange(text){
		this.setState({ bio: text });
	}

	render() {
		return (
		<View>
		<View style={styles.containerProfileItem}>
			<View style={styles.profileCardHeader}>
				{this.state.isEditable1
				? (<TextInput
					underlineColor="transparent"
					mode={"flat"}
					value={this.state.name}
					label='Name'
					placeholder="Enter your full name"
					onFocus={() => this.setState({ nameLabel: "" })}
					onBlur={() => this.setState({ nameLabel: this.state.name.length === 0 ? "Name" : "" })}
					onChangeText={this.handleNameChange.bind(this)}
					theme={theme}
					style={styles.textBoxStyle}
					/>)
				: (<Text style={styles.name}>{this.state.name}</Text>)
				}
				{this.state.isEditable1 
				? (
					<View style={{left: FULL_WIDTH * 0.20}}>
						<TouchableOpacity style={styles.profileButtons} onPress={this.handleUpdateClick1.bind(this)}>
							<Check width={20} height={20}/>
							</TouchableOpacity>
					</View>
					) 
				: (
					<View style={{right: FULL_WIDTH * 0.05}}>
						<TouchableOpacity style={styles.profileButtons} onPress={this.handleEditClick1.bind(this)}>
							<Pen width={20} height={20}/>
							</TouchableOpacity>
					</View>)
				}
			</View>
			<Text style={styles.descriptionProfileItem}>
				{this.props.age} - {this.state.uni}
			</Text>

			<View style={styles.info}>
				<Text style={styles.profileTitleGender}>Gender </Text>

				{this.state.isEditable1 ? 
				<Dropdown data={genders}
				dropdownPosition={-5}
				containerStyle={styles.genderDrop}
				pickerStyle={{borderRadius: 35,}}
				dropdownOffset={{top: 20, left: 10}}
				itemCount={4}
				textColor="black"
				itemColor="black"
				baseColor='black'
				onChangeText={this.handleGenderChange.bind(this)}
				selectedItemColor="black"
				disabledItemColor="black"/> : 

				<Text style={styles.infoContentGender}>{this.state.gender}</Text>
				}
			</View>

			<View style={styles.info2}>
				<Text style={styles.profileTitleEmail}>Email </Text>
				<Text style={styles.infoContentEmail}>{this.props.email}</Text>
			</View>

			<View style={styles.info3}>
				<Text style={styles.profileTitle}>Keywords </Text>
				<Tag 
					keywords={this.state.keywords} editable={this.state.isEditable1}
					type="keyword"
					wordChange={this.handleKeywordChange.bind(this)}
				/>
			</View>

			<View style={styles.info2}>
				<Text style={styles.profileTitleBio}>Bio </Text>
				{this.state.isEditable1
				? (<TextInput
					underlineColor="transparent"
					mode={"flat"}
					value={this.state.bio}
					label='Bio'
					placeholder="Say something about yourself"
					onFocus={() => this.setState({ bioLabel: "" })}
					onBlur={() => this.setState({ bioLabel: this.state.bio.length === 0 ? "Bio" : "" })}
					onChangeText={this.handleBioChange.bind(this)}
					theme={theme}
					style={styles.textB}
					multiline={true}
					/>)
				: (<Text style={styles.infoContentBio}>{this.state.bio}</Text>)
				}
			</View>
		</View>

		<View style={styles.containerProfileItem2}>
			<View style={styles.profileCardHeader}>
				<Text style={styles.name_secondary}>Education</Text>
				{this.state.isEditable2 
				? (<TouchableOpacity style={styles.profileButtons2} onPress={this.handleUpdateClick2.bind(this)}><Check width={20} height={20}/></TouchableOpacity>) 
				: (<TouchableOpacity style={styles.profileButtons2} onPress={this.handleEditClick2.bind(this)}><Pen width={20} height={20}/></TouchableOpacity>)
				}
			</View>
			<View style={styles.info}>
				<Text style={styles.profileTitle2}>Major: </Text>
				{this.state.isEditable2
				? (<TextInput
					underlineColor="transparent"
					mode={"flat"}
					value={this.state.major}
					placeholder="Enter your major"
					onFocus={() => this.setState({ majorLabel: "" })}
					onBlur={() => this.setState({ majorLabel: this.state.major.length === 0 ? "Major" : "" })}
					onChangeText={this.handleMajorChange.bind(this)}
					theme={theme}
					style={styles.textMajor}
					/>)
				: (<Text style={styles.infoContentMajor}>{this.state.major}</Text>)
				}
			</View>

			<View style={styles.info3}>
				<Text style={styles.profileTitle}>Courses: </Text>
				<TagCourses keywords={this.state.courses} editable={this.state.isEditable2} 
			    courseChange={this.handleCourseChange.bind(this)} type="course"/>
			</View>

			<View style={styles.info3}>
				<Text style={styles.profileTitle}>Clubs: </Text>
				<TagClubs keywords={this.state.clubs} editable={this.state.isEditable2} type="club"
				clubChange={this.handleClubChange.bind(this)}/>
			</View>
		</View>

		<View style={styles.containerProfileItem2}>
		<View style={styles.profileCardHeader}>
			<Text style={styles.name_secondary}>Projects</Text>
			{this.state.isEditable3 
				? (<TouchableOpacity style={styles.profileButtons3} onPress={this.handleUpdateClick3}><Check width={20} height={20}/></TouchableOpacity>) 
				: (<TouchableOpacity style={styles.profileButtons3} onPress={this.handleEditClick3}><Pen width={20} height={20}/></TouchableOpacity>)
			}
		</View>

		<View style={{marginTop: 10}}></View>

		{
			this.state.allProjects.map((field, index) => {
				return(
					<View key={index}>
					<TextInput  
						style={{height: FULL_HEIGHT * 0.09}}
						placeholder="Show off your Projects here!"
						value={field.value}   
						onChangeText={(text)=> this.onProjectTextChange(text, index)} 
						editable={this.state.isEditable3}
						mode='flat'
						selectionColor="#ACCEF7"
						underlineColor="#1a5d57"
						multiline={true}
						theme={theme}
					 />  
					 {this.state.isEditable3 ? 
					 <TouchableOpacity disabled={!this.state.isEditable3} onPress={() => 
					(this.state.isEditable3 ? this.addProjectInput() : null)}
					style={styles.tick}>
						 <Plus width={10} height={10}/>
				     </TouchableOpacity> : null }

					{ this.state.isEditable3 ? 
					 <TouchableOpacity disabled={!this.state.isEditable3} onPress={() => 
					(this.state.isEditable3 ? 
					 (this.state.allProjects.length > 1 ? this.removeProjectInput(index) : null) : null)}
					style={styles.cross}>
						 <Minus width={10} height={10}/>
					 </TouchableOpacity> : null}
				</View>
				)

			})
		}
		</View>

		<View style={styles.containerProfileItem2}>
		<View style={styles.profileCardHeader}>
			<Text style={styles.name_secondary}>Experience</Text>
			{this.state.isEditable4 
				? (<TouchableOpacity style={styles.profileButtons4} onPress={this.handleUpdateClick4}><Check width={20} height={20}/></TouchableOpacity>) 
				: (<TouchableOpacity style={styles.profileButtons4} onPress={this.handleEditClick4}><Pen width={20} height={20}/></TouchableOpacity>)
			}
		</View>
		<View style={{marginTop: 10}}></View>

		{
			this.state.allExp.map((field, index) => {
				return(
					<View key={index}>
					<TextInput  
						style={{height: FULL_HEIGHT * 0.09}}
						placeholder="Work or Volunteering Experience!"
						value={field.value}   
						onChangeText={(text)=> this.onExpTextChange(text, index)} 
						editable={this.state.isEditable4}
						mode='flat'
						selectionColor="#ACCEF7"
						underlineColor="#1a5d57"
						multiline={true}
						theme={theme}
					 />  
					{this.state.isEditable4 ? 
					<TouchableOpacity disabled={!this.state.isEditable4} onPress={() => 
					(this.state.isEditable4 ? this.addExpInput() : null)}
					style={styles.tick}>
						 <Plus width={10} height={10}/>
				     </TouchableOpacity> : null }

					{this.state.isEditable4 ? 
					 <TouchableOpacity disabled={!this.state.isEditable4} onPress={() => 
					(this.state.isEditable4 ? 
					 (this.state.allExp.length > 1 ? this.removeExpInput(index) : null) : null)}
					 style={styles.cross}>
						 <Minus width={10} height={10}/>
					 </TouchableOpacity>
					 : null}
				</View>
				)

			})
		}
		</View>
		</View>
		);
	}
}

export default ProfileItem;
