import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import styles from "../assets/styles";
import Swiper from 'react-native-swiper';
// import { BlurView } from '@react-native-community/blur';
import { Overlay } from 'react-native-elements';

const DIMENTIONS = Dimensions.get("window");

const nameStyle = [
    {
      paddingBottom: 7,
      marginTop: 0,
      color: '#363636',
      fontSize: 35,
      alignSelf: 'center'
    }
];

class ProfilePopup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isVisible: props.visible,
			Name: props.name,
			age: props.age,
			keywords: props.keywords,
			bio: props.bio,
			uni: props.uni,
			projects: props.projects,
			experience: props.experience
		};
	}

	componentWillReceiveProps(props) {
		if (props.visible !== this.state.isVisible) {
			this.setState({ isVisible: props.visible });
		}
		if (props.name !== this.state.Name) {
			this.setState({ Name: props.name });
		}
		if (props.age !== this.state.age) {
			this.setState({ age: props.age });
		}
		if (props.keywords !== this.state.keywords) {
			for (let i = 0; i < props.keywords.length; i++) {
				props.keywords[i] = props.keywords[i].toUpperCase();
			}
			this.setState({ keywords: props.keywords });
		}
		if (props.bio !== this.state.bio) {
			this.setState({ bio: props.bio });
		}
		if (props.uni !== this.state.uni) {
			this.setState({ uni: props.uni });
		}
		if (props.projects !== this.state.projects) {
			this.setState({ projects: props.projects });
		}
		if (props.experience !== this.state.experience) {
			this.setState({ experience: props.experience });
		}
	}

	_getAge(age) {
		if (typeof age === "number"){ return age; }
		// MM-DD-YYYY
		const year = Number(age.split("-")[2]);
		return (new Date()).getFullYear() - year;
	}

	render() {
		return (
			<Modal
				visible={this.state.isVisible}
				onBackdropPress={() => this.setState({ isVisible: false })}
				style={styles.popupCard}
				transparent={true}
				animationType={"fade"}
			>
				<View style={styles.popupCardTitlePosition}>
					<Text style={styles.popupCardTitle}>Additional Info</Text>
				</View>

				<Swiper
					onBackdropPress={() => this.setState({ isVisible: false })}
					activeDotColor="#1A5D57"
					from={1}
					loop={false}
					bounces={true}
					minDistanceForAction={0.1}
					controlsProps={{
						dotsTouchable: true,
						prevPos: "left",
						nextPos: "right",
						nextTitle: ">",
					}}
					paginationStyle={{}}
				>
					<View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Name: {" "}
								<Text style={styles.textValues}>
									{this.state.Name}
								</Text>
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								University: {" "}
								<Text style={styles.textValues}>
									{this.state.uni}
								</Text>
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Age: {" "}
								<Text style={styles.textValues}>
									{this._getAge(this.state.age)}
								</Text>
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Major: {" "}
								<Text style={styles.textValues}>
									Life Sciences
								</Text>
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Interests: {" "}
								<Text style={styles.textValues}>
									{this.state.keywords.join(", ")}
								</Text>
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								About: {" "}
								<Text style={styles.textValues}>
									{this.state.bio}
								</Text>
							</Text>
						</View>
					</View>
					<View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Projects: {"\n"}
								{this.state.projects.map((p) => (
									<Text style={styles.textValues}>{p}{"\n"}</Text>
								))}
							</Text>
						</View>
						<View style={styles.popupStyling}>
							<Text style={styles.biodata}>
								Experience: {"\n"}
								{this.state.experience.map((e) => (
									<Text style={styles.textValues}>{e}{"\n"}</Text>
								))}
							</Text>
						</View>
					</View>
				</Swiper>
				{/* </BlurView> */}
				<Overlay
           			visible={this.state.isVisible} onBackdropPress={() => {
						   this.props.onClose();
					   }
					}
           		>  
				   </Overlay>
			</Modal>
		);
	}
}

export default ProfilePopup;
