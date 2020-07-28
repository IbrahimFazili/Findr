import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import TagInput from "react-native-tags-input";
import Tags from "react-native-tags";

const mainColor = "#3ca897";

class OtherTag extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: {
				tag: "",
				tagsArray: props.keywords,
			},
			edit: this.props.editable,
			keywords: props.keywords,
			type: props.type,
		};
	}
	componentWillReceiveProps(props) {
		if (props.editable !== this.state.edit) {
			this.state.edit = props.editable;
		}
		if (props.keywords !== this.state.keywords) {
			this.state.keywords = props.keywords;
			this.state.tags.tagsArray = props.keywords;
		}
		if (props.type !== this.state.type) {
			this.state.type = props.type;
		}
	}

	updateTagState = (state) => {
		this.setState({
			tags: state,
		});
		let { wordChange } = this.props;
		wordChange(this.state.tags.tag, this.state.tags.tagsArray);
	};

	render() {
		return (
			<View style={styles.container}>
				<Tags
					containerStyle={styles.textInput}
					readonly={true}
					initialTags={this.state.tags.tagsArray}
					tagTextStyle={styles.tagText}
					tagContainerStyle={styles.tag}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	textInput: {
		height: 30,
		backgroundColor: "white",
	},
	tag: {
		backgroundColor: "transparent",
	},
	tagText: {
		color: "black",
	},
});

export default OtherTag;
