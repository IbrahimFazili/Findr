import React from "react";
import { Image, Platform, AsyncStorage, View } from "react-native";
import shorthash from "shorthash";
import PlaceHolder from "../assets/icons/placeholder_icon.svg"

let RNFS = require('react-native-fs');


class CachedImage extends React.Component {
    state = {
        source: null,
        placeholderRequired: false
    }

    /**
     * Check if any of the items in the cache have expired. Expired items are deleted
     */
    static async validateCache() {
        let cacheTable = await AsyncStorage.getItem('cacheTable');
        if (cacheTable) cacheTable = JSON.parse(cacheTable);
        else return;

        const cachedItems = Object.keys(cacheTable);
        const extension = (Platform.OS === 'android') ? 'file://' : '';
        const currTime = (new Date()).getTime();
        cachedItems.forEach((item) => {
            if (currTime >= cacheTable[item]) {
                // cache item expired
                const path =`${extension}${RNFS.CachesDirectoryPath}/${item}`;
                RNFS.unlink(path).catch((err) => console.log(err));
            }
        });
    }

    async getCacheTable() {
        let cacheTable = await AsyncStorage.getItem('cacheTable');
        if (cacheTable) cacheTable = JSON.parse(cacheTable);
        else cacheTable = {};

        return cacheTable;
    }

    /**
     * reset the expiry time of the item to 24hrs from now
     * @param {String} name name of the cached item
     */
    async updateExpiryTime(name) {
        const cacheTable = await this.getCacheTable();
        // new expiry date is 24hrs from now
        cacheTable[name] = (new Date()).getTime() + (24 * 60 * 60 * 1000);
        AsyncStorage.setItem('cacheTable', JSON.stringify(cacheTable));
    }

    loadFile = (path) => {
        this.setState({ source: { uri: path }, placeholderRequired: false });
    }

    downloadFile = (uri, path) => {
        RNFS.downloadFile({ fromUrl: uri, toFile: path }).promise.then((res) => this.loadFile(path));
    }

    /**
     * Compute checksum of existing image in cache and compare it with the recieved checksum to check
     * if the cached image needs to be updated
     * @param {String} checksum checksum of the image that exists on the provided url
     * @param {String} existingPath path of the cached image
     */
    async cacheRefreshRequired(checksum, existingPath) {
        const computedChecksum = await RNFS.hash(existingPath, "md5");
        console.log('computed', computedChecksum);
        if (checksum !== computedChecksum) return true;
        return false;
    }

    componentDidMount = () => {;
        const { uri, uid, checksum } = this.props;
        if (uid === undefined) return;
        // Image.getSize(uri, () => {
            
        // }, (err) => {
        //     this.setState({ placeholderRequired: true });
        // });
        const name = shorthash.unique(uid);
        const extension = (Platform.OS === 'android') ? 'file://' : '' 
        const path =`${extension}${RNFS.CachesDirectoryPath}/${name}`;
        this.updateExpiryTime(name);
        RNFS.exists(path).then(async (exists) => {
            if (exists && !(await this.cacheRefreshRequired(checksum, path))) {
                // image exists in cache
                console.log('loading locally');
                this.loadFile(path);
            }
            else {
                // image doesn't exist in cache, download it
                console.log("downloading")
                this.downloadFile(uri, path);
            }
        });
        
    }

    componentWillReceiveProps(props) {
        const updatedProps = {};
        if (props.uri !== this.state.uri) {
            updatedProps.uri = props.uri;
        }
        if (props.uid !== this.state.uid){
            updatedProps.uid = props.uid;
        }
        if (props.checksum !== this.state.checksum){
            updatedProps.checksum = props.checksum;
        }
        this.setState({source : { uri: updatedProps.uri } })
    }

    render() {
        return this.state.placeholderRequired ? 
        (
        <View style={this.props.style}>
            <PlaceHolder 
            width={this.props.style ? this.props.style.width : undefined}
            height={this.props.style ? this.props.style.width : undefined}
            />
        </View>
        ) 
        : (
        <Image
        style={this.props.style}
        source={this.state.source}
        onError={(err) => this.setState({ placeholderRequired: true })}
        />);
    }
}

export default CachedImage;