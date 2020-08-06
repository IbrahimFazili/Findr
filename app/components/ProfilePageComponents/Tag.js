import React from "react";
import { Dimensions, View } from "react-native";
import TagInput from "react-native-tags-input";

const DIMENTION_HEIGHT = Dimensions.get("window").height;

class Tag extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: {
				tag: "",
				tagsArray: [],
			},
			type: "",
			editable: false,
		};
	}

	componentWillReceiveProps(props) {
		const updatedProps = {};
		if (this.state.type !== props.type) updatedProps.type = props.type;
		if (this.state.editable !== props.editable) {
			this.state.editable && !props.editable
				? this.props.updateCallback
					? this.props.updateCallback(this.state.tags.tagsArray)
					: null
				: null;
			updatedProps.editable = props.editable;
		}
		if (this.state.tags.tagsArray !== props.tags) {
			for (let index = 0; index < props.tags.length; index++) {
				props.tags[index] = props.tags[index].toUpperCase();
			}
			updatedProps.tags = {
				tagsArray: props.tags,
				tag: this.state.tags.tag,
			};
		}

		if (Object.keys(updatedProps).length > 0) this.setState(updatedProps);
	}

	updateTagState = (state) => {
		for (let index = 0; index < state.tagsArray.length; index++) {
			state.tagsArray[index] = state.tagsArray[index].toUpperCase();
		}
		this.setState({
			tags: state,
		});
	};

	render() {
		return (
			<View>
				<TagInput
					containerStyle={this.props.containerStyle}
					inputContainerStyle={{ flex: 1, flexDirection: "row" }}
					deleteIconStyles={[
						!this.state.editable
							? { width: 0, height: 0, zIndex: -10 }
							: null,
					]}
					tagStyle={{ backgroundColor: "#1a5d57" }}
					tagTextStyle={{ color: "white" }}
					updateState={this.updateTagState}
					tags={this.state.tags}
					keysForTag={" "}
					placeholder={`Add ${this.state.type}`}
					autoCorrect={true}
					disabled={!this.state.editable}
				/>
			</View>
		);
	}
}

export default Tag;
