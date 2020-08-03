import React from "react"
import { Dimensions, View, FlatList } from "react-native";
import ListItem from "./ListItem";

const DIMENTIONS = Dimensions.get("window");

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: []
        }
    }

    componentWillReceiveProps(props) {
        if (this.state.items !== props.items) this.setState({ items: props.items });
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "80%",
              backgroundColor: "lightgrey",
              alignSelf: "center"
            }}
          />
        );
      }

    render() {

        return (
            <View style={[this.props.style, { alignSelf: "center" }]}>
                <FlatList
                data={this.state.items}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={({ item }) => (
                    <ListItem
                    value={item}
                    editable={false}
                    style={{
                        alignSelf: "center",
                        width: this.props.style.width * 0.9
                    }}
                    />
                )}
                />
            </View>
        );
    }
}

export default List;
