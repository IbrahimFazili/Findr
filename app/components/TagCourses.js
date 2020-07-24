import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View
} from 'react-native';

import TagInput from 'react-native-tags-input';

const mainColor = '#3ca897';

class TagEducation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: {
        tag: '',
        tagsArray: []
      },
      edit: this.props.editable,
      keywords: props.keywords,
      type: props.type
    };
  }
  componentWillReceiveProps(props){
    if (props.editable !== this.state.edit){
      this.state.edit = props.editable
    }
    if (props.keywords !== this.state.keywords){
      this.state.keywords = props.keywords
    }
    if (props.type !== this.state.type){
        this.state.type = props.type
      }
  }

  updateTagState = (state) => {
      this.setState({
        tags: state
      })
      let {courseChange} = this.props;
      courseChange(this.state.tags.tag , this.state.tags.tagsArray)
    };
  render() {
    return (
      <View style={styles.container}>
        <TagInput
          editable={this.state.edit}
          updateState={this.updateTagState}
          tags={this.state.tags}
          placeholder=
          { this.state.edit? 
            `Enter a ${this.state.type}` : "What are you interested in?"}    
          inputContainerStyle={styles.textInput}
          inputStyle={{color: 'black'}}
          onFocus={() => this.setState({tagsColor: '#fff', tagsText: mainColor})}
          onBlur={() => this.setState({tagsColor: 'white', tagsText: '#fff'})}
          autoCorrect={false}
          tagStyle={styles.tag}
          tagTextStyle={styles.tagText}
          keysForTag={', '}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
      height: 30,
      backgroundColor: 'white',
  },
  tag: {
      backgroundColor: 'transparent'
  },
  tagText: {
      color: 'black'
  },
});

export default TagEducation; 
