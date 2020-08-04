import React from "react";
import APIConnection from "../../assets/data/APIConnection";
import ImagePicker from 'react-native-image-crop-picker';
import shorthash from "shorthash";
import { TouchableOpacity, Image, View, Dimensions } from "react-native"
import PlaceHolder from "../../assets/icons/placeholder_icon.svg"


class ProfilePicture extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            image: props.image,
            checksum: props.checksum,
            editable: true,
            placeholder: false
        }
    }

    componentWillReceiveProps(props){
        if (this.state.image !== props.image){
            this.state.image = props.image
        }
        if (this.state.checksum !== props.checksum){
            this.state.checksum = props.checksum
        }
        if (this.state.editable !== props.editable){
            this.state.editable = props.editable
        }
        this.setState({ image: this.state.image, checksum: this.state.checksum, editable: this.state.editable, placeholder: false });
    }

    
    chooseImage = () => {
        ImagePicker.openPicker({
            compressImageQuality: 0.7
        }).then((img) => ImagePicker.openCropper({
            compressImageQuality: 0.7,
            path: img.path,
            cropperCircleOverlay: true,
            width: DIMENSION_WIDTH * 0.6,
            height: DIMENSION_HEIGHT * 0.3 
            }).then((img) => {

                this._onChangeMedia(img);

            }).catch((err) => null)
        ).catch((err) => null);

    };

    async _onChangeMedia(selection) {
        const media = {
            name: shorthash.unique(selection.path),
            type: selection.mime,
            uri: selection.path
        };

        const checksumImage = await RNFS.hash(selection.path, "md5");

        const url = await this.state.API.updateProfilePicture(
            await AsyncStorage.getItem('storedEmail'),
            media.type,
            checksumImage
        )

        APIConnection.uploadPicture(url, media);
        var profile = {...this.state.profile}
        profile.image = media.uri;
        profile.checksum = null;
        this.setState({profile})
    }
    
    render() {
        return (
            <View>
                { this.state.editable ? (
                    <TouchableOpacity
                    onPress={this.chooseImage.bind(this)}>
                        {this.state.image && !this.state.placeholder ? 
                        <Image
                        source={{ uri: this.state.image.uri}}
                        style={this.props.style}
                        onError={() => this.setState({ placeholder: true })}
                        /> :
                        <View style={this.props.style}>
                            <PlaceHolder
                            // width={Dimensions.get('window').width * 0.6}
                            // height={Dimensions.get('window').height * 0.6}
                            />
                        </View>
                        }
                    </TouchableOpacity>
                ) : (
                    this.state.image && !this.state.placeholder ? 
                        <Image
                        source={{ uri: this.state.image.uri}}
                        style={this.props.style}
                        onError={() => this.setState({ placeholder: true })}
                        /> :
                        <View style={this.props.style}>
                            <PlaceHolder
                            // width={Dimensions.get('window').width * 0.6}
                            // height={Dimensions.get('window').height * 0.6}
                            />
                        </View>                )}
            </View>
        )
    }
}

export default ProfilePicture;
