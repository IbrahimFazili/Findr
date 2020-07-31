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
        tagsArray: props.keywords
      },
      edit: this.props.editable,
      keywords: props.keywords,
      type: props.type,
      tagCSS: { top: -DIMENTIONS.height * 0.07 }
    };
  }
  componentWillReceiveProps(props){
    if (props.editable !== this.state.edit){
      this.state.edit = props.editable
      this.setState({
        tagCSS: props.editable ? { top: 0 } : { top: -DIMENTIONS.height * 0.07 }
      });
    }
    if (props.keywords !== this.state.keywords){
      this.state.keywords = props.keywords
      this.state.tags.tagsArray = props.keywords
    }
    if (props.type !== this.state.type){
      this.state.type = props.type;
    }  
  }

  updateTagState = (state) => {
      this.setState({
        tags: state
      })
      let {wordChange} = this.props;
      wordChange(this.state.tags.tag , this.state.tags.tagsArray)
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
            `Enter a ${this.state.type}` : ""}    
          inputContainerStyle={styles.textInput}
          inputStyle={{color: 'black'}}
          onFocus={() => this.setState({
            tagsColor: '#fff',
            tagsText: mainColor,
            tagCSS: { top: 0 }
          })}
          onBlur={() => this.setState({ 
            tagsColor: 'white',
            tagsText: '#fff',
            tagCSS: { top: -DIMENTIONS.height * 0.07 } }
          )}
          autoCorrect={false}
          tagStyle={[ styles.tag, this.state.tagCSS ]}
          tagTextStyle={styles.tagText}
          keysForTag={', '}/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
  },
  textInput: {
      height: Dimensions.get('window').height * 0.05,
      width: Dimensions.get('window').width * 0.4,
      backgroundColor: 'white',
  },
  tag: {
      backgroundColor: 'transparent',
  },
  tagText: {
      color: 'black'
  },
});

export default Tag; 
