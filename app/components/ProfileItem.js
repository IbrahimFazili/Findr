import React from 'react';
import styles from '../assets/styles';

import { Text, View, Image, Button, Dimensions, TouchableOpacity, AsyncStorage} from 'react-native';
import { DefaultTheme, Provider as PaperProvider, TextInput, RadioButton, Dialog} from 'react-native-paper';
const FULL_HEIGHT = Dimensions.get('window').height;
import APIConnection from "../assets/data/APIConnection";
import Pen from '../assets/icons/pen.svg';
import Check from '../assets/icons/check.svg';
import Tag from './Tag';

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
			clubs: "",
			courses: "",
			keywords: [],

			nameLabel: "Name",
			emailLabel: "Email",
			passLabel: "Password", 
			uniLabeL: "University",
			majorLabel: "Major",
			genderLabel: "Gender",
			clubsLabel: "Clubs",
			coursesLabel: "Courses",
			keywordsLabel: "Keywords",

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
		if(this.state.name.length !== 0 && this.state.name === this.props.name){
			data.name = this.state.name
		}
		if(this.state.gender.length !== 0 && this.state.gender === this.props.gender){
			data.gender = this.state.gender[0].toUpperCase()
		}
		if(Object.keys(data).length > 1){
			const update = await API.updateUserInfo(data);
			if (update == 500) {
				console.log("Server Error");
			}
			if (update == 201) {
				this.setState({
					name: this.state.name, 
					gender: this.state.gender[0].toUpperCase() + this.state.gender.substring(1,this.state.gender.length)
				})
			}
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
		const update = await API.updateUserInfo(data);
		if (update == 500) {
			console.log("Server Error");
		}
		if(update == 201) {
			this.setState({major: this.state.major})
		}
	}

	handleEditClick3 = () => {
		this.setState({isEditable3: true});
		// this.addProjectInput()
	}

	handleUpdateClick3 = () => {
		this.setState({isEditable3: false});
	}

	handleEditClick4 = () => {
		this.setState({isEditable4: true});
		this.addExpInput()
	}

	handleUpdateClick4 = () => {
		this.setState({isEditable4: false});
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

	render() {
		console.log(this.state.isEditable3)
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
					style={textBoxStyle}
					/>)
				: (<Text style={styles.name}>{this.state.name}</Text>)
				}
				{this.state.isEditable1 
				? (<TouchableOpacity style={styles.profileButtons} onPress={this.handleUpdateClick1.bind(this)}><Check width={20} height={20}/></TouchableOpacity>) 
				: (<TouchableOpacity style={styles.profileButtons} onPress={this.handleEditClick1.bind(this)}><Pen width={20} height={20}/></TouchableOpacity>)
				}
			</View>
			<Text style={styles.descriptionProfileItem}>
				{this.props.age} - {this.state.uni}
			</Text>

			<View style={styles.info}>
				<Text style={styles.profileTitle}>Gender: </Text>
				<Text style={styles.infoContent}>{this.state.gender}</Text>
			</View>

			<View style={styles.info}>
				<Text style={styles.profileTitle}>Email: </Text>
				<Text style={styles.infoContent}>{this.props.email}</Text>
			</View>

			<View style={styles.info}>
				<Text style={styles.profileTitle}>Keywords: </Text>
				{this.state.isEditable1
				? (<TextInput
					underlineColor="transparent"
					mode={"flat"}
					value={this.state.major}
					label='Keywords'
					placeholder="Enter your keywords"
					onFocus={() => this.setState({ keywordsLabel: "" })}
					onBlur={() => this.setState({ keywordsLabel: this.state.keywords.length === 0 ? "Major" : "" })}
					onChangeText={this.handleMajorChange.bind(this)}
					theme={theme}
					style={textBoxStyle}
					/>)
				: (<Text style={styles.infoContent}>{this.state.keywords.join(", ")}</Text>)
				}
				{/* <Tag 
					keywords={this.state.keywords}
				/> */}
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
				<Text style={styles.profileTitle}>Major: </Text>
				{this.state.isEditable2
				? (<TextInput
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
					/>)
				: (<Text style={styles.infoContent}>{this.state.major}</Text>)
				}
			</View>

			<View style={styles.info}>
				<Text style={styles.profileTitle}>Courses: </Text>
				<Tag/>
			</View>

			<View style={styles.info}>
				<Text style={styles.profileTitle}>Clubs: </Text>
				<Tag/>
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
					 <TouchableOpacity disabled={!this.state.isEditable3} onPress={() => 
					(this.state.isEditable3 ? this.addProjectInput() : null)}>
						 <Pen width={10} height={10}/>
				     </TouchableOpacity>

					 <TouchableOpacity disabled={!this.state.isEditable3} onPress={() => 
					(this.state.isEditable3 ? 
					 (this.state.allProjects.length > 1 ? this.removeProjectInput(index) : null) : null)}>
						 <Check width={10} height={10}/>
					 </TouchableOpacity>
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