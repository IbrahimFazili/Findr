import React from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import EDIT from "../../assets/icons/pen.svg";
import CHECK from "../../assets/icons/check.svg"

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

class InfoContainer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      comp: [],
      edit: false
    }
  }

  componentWillReceiveProps(props) {
    if (props.comp !== this.state.comp) this.setState({ comp: props.comp })
  }

  render(){
    return(
      <View style={[styles.infoContainer, this.props.style]}>
        <View
            style={{
              position: 'absolute',
              left: DIMENSION_WIDTH * 0.8,
              top: 0,
            }}
          >
          {this.state.edit ? 
            <TouchableOpacity
              style={{
                padding: "10%",
                width: DIMENSION_WIDTH * 0.2,
              }}
              onPress={()=>this.setState({edit: false})}
            > 
              <CHECK width={DIMENSION_WIDTH * 0.05} height={DIMENSION_HEIGHT * 0.05}/>
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={{
                padding: "10%",
                width: DIMENSION_WIDTH * 0.2,
              }}
              onPress={()=>this.setState({edit: true})}
            > 
              <EDIT width={DIMENSION_WIDTH * 0.05} height={DIMENSION_HEIGHT * 0.05}/>
            </TouchableOpacity>
          }
        </View>
          {this.state.comp}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    backgroundColor: 'white',
    elevation: 20,
    borderRadius: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: "flex-start"
  }
})

export default InfoContainer;