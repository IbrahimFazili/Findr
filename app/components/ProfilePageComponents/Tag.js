import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View
} from 'react-native';
import TagInput from 'react-native-tags-input';

const mainColor = '#3ca897';
const DIMENTIONS = Dimensions.get('window');

class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: '',
        tagsArray: []
      },
      type: ""
    };
  }

  componentWillReceiveProps(props) {
    if (this.state.type !== props.type) {
      this.setState({ type: props.type });
    }
  }

  updateTagState = (state) => {
    this.setState({
      tags: state
    })
  };

  render() {

    return (
    <View>
      <TagInput
      updateState={this.updateTagState}
      tags={this.state.tags}
      placeholder={`Add ${this.state.type}`}
      autoCorrect={true}
      />
    </View>
    );
  }
}


export default Tag; 
              