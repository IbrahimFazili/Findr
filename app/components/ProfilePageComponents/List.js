import React from "react"
import { Dimensions, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import ListItem from "./ListItem";
import Plus from "../../assets/icons/Plus.svg"

const DIMENTIONS = Dimensions.get("window");

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            editable: false,
            type: ""
        }
    }

    componentWillReceiveProps(props) {
        const updatedProps = {};
        if (this.state.items !== props.items) updatedProps.items = props.items;
        if (this.state.type !== props.type) updatedProps.type = props.type;
        if (this.state.editable !== props.editable) {
            this.state.editable && !props.editable ? (this.props.updateCallback ? 
                this.props.updateCallback(this._cleanItems(this.state.items)) : null)
            : null;
            updatedProps.editable = props.editable;
        }
        if (Object.keys(updatedProps).length > 0) this.setState(updatedProps);
    }

    _cleanItems() {
        const cleanedItems = [];
        for (let index = 0; index < this.state.items.length; index++) {
            let element = this.state.items[index];
            element = element.trim();
            if (element.length > 0) {
                cleanedItems.push(element);
            }
        }

        return cleanedItems;
    }

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "80%",
              backgroundColor: "lightgrey",
              alignSelf: "center",
            }}
          />
        );
    }
    
    updateHandler(newValue, index) {
        this.state.items[index] = newValue;
        this.setState({ items: this.state.items });
    }

    handleDelete(index) {
        console.log('delete running');
        this.state.items = this.state.items.splice(index, 1);
        this.setState({ items: this.state.items });
    }

    render() {

        return (
            <View style={[this.props.style, { alignSelf: "center"}]}>
                <FlatList
                data={this.state.items}
                contentContainerStyle={{ paddingBottom: DIMENTIONS.height * this.state.items.length * (0.08 / 4)}}
                keyExtractor={(item, index) => index.toString()}
                // ItemSeparatorComponent = {this.FlatListItemSeparator}
                renderItem={({ item, index }) => (
                    <ListItem
                    value={item ? item : ""}
                    editable={this.state.editable}
                    style={{
                        alignSelf: "center",
                        width: this.props.style.width * 0.9,
                        maxHeight: 100,
                        borderWidth: 1,
                        borderColor: "darkgrey",
                        borderRadius: 10,
                    }}
                    updateValue={((newValue) => this.updateHandler(newValue, index)).bind(this)}
                    onDeletePress={(() => this.handleDelete(index)).bind(this)}
                    type={this.state.type}
                    />
                )}
                />
                {this.state.editable ?
                <TouchableOpacity onPress={() => this.setState({ items: this.state.items.concat("") })}>
                    <View style={{ 
                        justifyContent: 'center',
                        flexDirection: 'row',
                        marginTop: DIMENTIONS.height * 0.02,
                        alignSelf: "center",
                        width: DIMENTIONS.width * 0.1
                    }}>
                        <Plus width={20} height={20} />
                    </View>
                </TouchableOpacity>
                : null}
            </View>
        );
    }
}

export default List;
