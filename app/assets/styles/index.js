import { StyleSheet, Dimensions, Platform } from "react-native";

const PRIMARY_COLOR = "#7444C0";
const SECONDARY_COLOR = "#5636B8";
const WHITE = "#FFFFFF";
const GRAY = "#757E90";
const DARK_GRAY = "#363636";
const BLACK = "#000000";
const TEAL = "#1a5d57";

const ONLINE_STATUS = "#46A575";
const OFFLINE_STATUS = "#D04949";

const STAR_ACTIONS = "#FFA200";
const LIKE_ACTIONS = "#2c9c91";
const DISLIKE_ACTIONS = "#363636";
const FLASH_ACTIONS = "#5028D7";

const ICON_FONT = "tinderclone";

const DIMENSION_WIDTH = Dimensions.get("window").width;
const DIMENSION_HEIGHT = Dimensions.get("window").height;

export default StyleSheet.create({
  // COMPONENT - CARD ITEM
  containerCardItem: {
    width: DIMENSION_WIDTH * 0.8,
    marginTop: DIMENSION_HEIGHT * 0.11,
    marginLeft: DIMENSION_WIDTH * 0.04,
    backgroundColor: WHITE,
    borderRadius: 40,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    elevation: 10,
  },

  privacyContainer: {
    width: DIMENSION_WIDTH * 0.8,
    marginTop: DIMENSION_HEIGHT * 0.03,
    marginLeft: DIMENSION_WIDTH * 0.1,
    backgroundColor: WHITE,
    borderRadius: 40,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    elevation: 10,
    height: DIMENSION_HEIGHT * 0.7,
    marginBottom: DIMENSION_HEIGHT * 0.02
  },

  privacyHeader: {
    marginTop: DIMENSION_HEIGHT * 0.02,
    fontSize: 24,
    color: TEAL,
    marginBottom: DIMENSION_HEIGHT * 0.02
  },

  scrollPrivacy: {
    paddingHorizontal: DIMENSION_WIDTH * 0.1
  },
  
  popupStyling:{
    paddingRight: DIMENSION_WIDTH * 0.1,
  },

  matchContainerCardItem: {
    width: DIMENSION_WIDTH * 0.353,
    backgroundColor: WHITE,
    borderRadius: 10,
    margin: 10,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    marginLeft: 30,
    elevation: 10,
  },

  matchesCardItem: {
    marginTop: -35,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
  },

  matchLogo: {
    width: 65,
    height: 60,
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.06,
  },

  seeAllicon: {
    fontFamily: ICON_FONT,
    fontSize: 12,
    color: DARK_GRAY,
    paddingRight: 10,
  },

  matchTitle: {
    marginLeft: 100,
    paddingBottom: 10,
    fontSize: 20,
    color: "#1a5d57",
    // fontWeight: "bold",
    letterSpacing: 1,
  },

  thumbnailCaption: {
    alignSelf: "center",
    marginTop: 5,
  },

  matchesTextCardItem: {
    fontFamily: ICON_FONT,
    color: WHITE,
  },

  descriptionCardItem: {
    color: GRAY,
    textAlign: "center",
    padding: 10,
    marginTop: 10,
    marginBottom: 0,
  },

  status: {
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },

  statusText: {
    color: GRAY,
    fontSize: 12,
  },

  online: {
    width: 6,
    height: 6,
    backgroundColor: ONLINE_STATUS,
    borderRadius: 3,
    marginRight: 4,
  },

  offline: {
    width: 6,
    height: 6,
    backgroundColor: OFFLINE_STATUS,
    borderRadius: 3,
    marginRight: 4,
  },

  actionsCardItem: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
  },

  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "transparent",
    marginHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  miniButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: WHITE,
    marginHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowColor: DARK_GRAY,
    shadowOffset: { height: 10, width: 0 },
  },

  star: {
    fontFamily: ICON_FONT,
    color: STAR_ACTIONS,
  },
  like: {
    fontSize: 25,
    fontFamily: ICON_FONT,
    color: LIKE_ACTIONS,
  },

  dislike: {
    fontSize: 25,
    fontFamily: ICON_FONT,
    color: DISLIKE_ACTIONS,
  },

  flash: {
    fontFamily: ICON_FONT,
    color: FLASH_ACTIONS,
  },

  popupCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    maxHeight: DIMENSION_HEIGHT * 0.7,
    maxWidth: DIMENSION_WIDTH * 0.85,
    alignSelf: "center",
    marginVertical: DIMENSION_HEIGHT * 0.13,
    borderRadius: 30,
    // overflow: "hidden",
  },

  matchPop: {
    backgroundColor: WHITE,
    borderRadius: 20,
    top: DIMENSION_HEIGHT * 0.3,
    maxHeight: DIMENSION_HEIGHT * 0.3,
    width: DIMENSION_WIDTH * 0.85,
    alignSelf: "center",
    borderRadius: 30,
    position: "relative"
  },

  blurredView: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "white",
    maxHeight: DIMENSION_HEIGHT * 0.7,
    maxWidth: DIMENSION_WIDTH * 0.7,
    borderRadius: 20,
  },

  popupCardTitle:{
    fontSize: 20,
    // fontWeight: "bold",
    color: "#1a5d57",
  },

  popupCardTitlePosition:{
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.1,
    marginBottom: DIMENSION_HEIGHT * 0.05
  },


  biodata: {
    fontSize: 14,
    color: "#1a5d57",
    marginTop: DIMENSION_HEIGHT * 0.03,
    marginLeft: DIMENSION_WIDTH * 0.1
  },

  textValues: {
    color: "black",
  },

  // COMPONENT - CITY
  city: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 20,
    width: 90,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
  },
  cityText: {
    fontFamily: ICON_FONT,
    color: DARK_GRAY,
    fontSize: 13,
  },

  // COMPONENT - FILTERS
  filters: {
    backgroundColor: WHITE,
    padding: 10,
    borderRadius: 20,
    width: 100,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    elevation: 10,
  },
  filtersText: {
    fontFamily: ICON_FONT,
    color: "#1a5d57",
    fontSize: 13,
    marginLeft: 20,
  },

  // COMPONENT - MESSAGE
  containerMessage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    paddingHorizontal: 10,
    width: DIMENSION_WIDTH - 100,
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
    marginRight: 20,
    marginVertical: 15,
  },
  message: {
    color: GRAY,
    fontSize: 12,
    paddingTop: 5,
  },

  // COMPONENT - PROFILE ITEM
  containerProfileItem: {
    backgroundColor: WHITE,
    padding: 10,
    margin: 10,
    borderRadius: 18,
    marginTop: -140,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    elevation: 8,
  },
  containerProfileItem2: {
    backgroundColor: WHITE,
    padding: 10,
    margin: 10,
    borderRadius: 18,
    marginTop: 10,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    elevation: 8,
  },
  matchesProfileItem: {
    width: 131,
    marginTop: -15,
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 20,
    textAlign: "center",
    alignSelf: "center",
  },
  matchesTextProfileItem: {
    fontFamily: ICON_FONT,
    color: WHITE,
  },
  name: {
    marginLeft: DIMENSION_WIDTH * 0.20,
    paddingTop: 25,
    paddingBottom: 5,
    color: TEAL,
    fontSize: 24,
    textAlign: "center",
    width: DIMENSION_WIDTH * 0.5
  },
  textBoxStyle: {
    width: '55%',
    height: 50,
    alignSelf: 'center',
    backgroundColor: "transparent",
    left: DIMENSION_WIDTH * 0.2
  },
  name_secondary: {
    marginLeft: DIMENSION_WIDTH * 0.33,
    paddingTop: 25,
    paddingBottom: 5,
    color: TEAL,
    paddingBottom: 20,
    fontSize: 13,
  },
  descriptionProfileItem: {
    color: GRAY,
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 13,
  },
  
  tick: {
    marginLeft: DIMENSION_WIDTH * 0.8,
    bottom: DIMENSION_WIDTH * 0.12,
  },

  cross: {
    marginLeft: DIMENSION_WIDTH * 0.8,
    bottom: DIMENSION_WIDTH * 0.10,
    marginBottom: -DIMENSION_WIDTH * 0.05
  },
  info: {
    paddingVertical: 8,
    flexDirection: "row",
    height: 60,
    alignSelf: "center",
    marginLeft: DIMENSION_HEIGHT * - 0.28
  },
  info2: {
    paddingVertical: 8,
    flexDirection: "row",
    height: 60,
    alignSelf: "center",
    marginLeft: DIMENSION_HEIGHT * - 0.2
  },
  info3: {
    paddingVertical: 8,
    flexDirection: "row",
    height: 60,
    alignSelf: "center",
    marginLeft: DIMENSION_HEIGHT * 0.005
  },
  profileTitle: {
    fontSize: 15,
    color: TEAL,
    // paddingHorizontal: 10,
    left: 30
    // fontWeight: 'bold'
  },
  profileTitleKeywordOther: {
    fontSize: 15,
    color: TEAL,
    // paddingHorizontal: 10,
    left: DIMENSION_WIDTH * 0.63
  },
  profileTitle2: {
    fontSize: 15,
    color: TEAL,
    paddingHorizontal: 10,
    top: DIMENSION_WIDTH * 0.014 ,
    position: 'absolute',
    left: DIMENSION_WIDTH * 0.17
    // fontWeight: 'bold'
  },
  textB:{
    width: '65%',
    height: 50,
    backgroundColor: "transparent",
    left: DIMENSION_WIDTH * 0.17,
  },
  textMajor:{
    width: '45%',
    height: 50,
    backgroundColor: "transparent",
    left: DIMENSION_WIDTH * 0.35,
    bottom: 14
  },
  genderDrop: {
    width: DIMENSION_WIDTH * 0.45, 
    left: DIMENSION_WIDTH * 0.32,
    borderColor: "white", 
    borderWidth: 0.4, 
    borderRadius: 35,
    paddingLeft: 20, 
    paddingRight: 20, 
    paddingTop: -30,
    height: 50,
    bottom: 20
  },
  profileButtons: {
    marginLeft: DIMENSION_WIDTH * 0.13,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons2: {
    marginLeft: DIMENSION_WIDTH * 0.31,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons3: {
    marginLeft: DIMENSION_WIDTH * 0.35,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons4: {
    marginLeft: DIMENSION_WIDTH * 0.3,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileCardHeader: {
    marginTop: -DIMENSION_HEIGHT * 0.025,
    flexDirection: "row",
    alignItems: 'center',
  },
  iconProfile: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: DARK_GRAY,
    paddingHorizontal: 10,
  },
  infoContent: {
    color: GRAY,
    fontSize: 13,
    left: 28
  },
  infoContentOther: {
    color: BLACK,
    fontSize: 13,
    left: DIMENSION_WIDTH * 0.46,
    bottom: DIMENSION_WIDTH * 0.01 ,
    width: 350,
  },
  infoContentMajorOther: {
    color: BLACK,
    fontSize: 13,
    left: 170,
    width: 290,
  },
  infoContentGenderOther: {
    color: BLACK,
    fontSize: 13,
    left: 22
  },
  infoContentGender: {
    color: BLACK,
    fontSize: 13,
    left: 118,
    top: 4,
    width: 150
  },
  infoContentMajor: {
    color: GRAY,
    fontSize: 13,
    left: DIMENSION_WIDTH * 0.42,
    top: 1,
    width: DIMENSION_WIDTH * 0.6
  },
  infoContentBio: {
    color: GRAY,
    fontSize: 13,
    left: 85,
    width: 200,
    height:400
  },
  infoContentEmail: {
    color: GRAY,
    fontSize: 13,
    left: 50,
  },
  profileLogo: {
    width: 65,
    height: 60,
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.06,
    marginLeft: DIMENSION_HEIGHT * 0.2
  },
  otherProfileLogo: {
    width: 65,
    height: 60,
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.06,
    marginLeft: DIMENSION_HEIGHT * 0.02
  },
  LogoutSettings: {
    left: DIMENSION_WIDTH * 0.425,
    color: "black"
  },
  profileTitle: {
    fontSize: 15,
    color: TEAL,
    paddingHorizontal: 10,
    // fontWeight: 'bold'
  },
  profileTitleMajorOther: {
    fontSize: 15,
    color: TEAL,
    paddingHorizontal: 10,
    left: DIMENSION_WIDTH * 0.33,
    // fontWeight: 'bold'
  },
  profileTitleCourseOther: {
    fontSize: 15,
    color: TEAL,
    paddingHorizontal: 10,
    left: DIMENSION_WIDTH * 0.04
    // fontWeight: 'bold'
  },
  profileTitleGender: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 10,
    left: DIMENSION_WIDTH * 0.05
    // fontWeight: 'bold'
  },
  profileTitleBio: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 10,
    left: 33
    // fontWeight: 'bold'
  },
  profileTitleEmail: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 15,
    left: 20
    // fontWeight: 'bold'
  },
  profileTitleEmailOther: {
    fontSize: 15,
    color: TEAL,
    paddingHorizontal: 15,
    left: DIMENSION_WIDTH * 0.39,
    bottom: DIMENSION_WIDTH * 0.01
    // fontWeight: 'bold'
  },
  profileTitleGender: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 10,
    position: 'absolute',
    top: 10,
    left: DIMENSION_WIDTH * 0.05
    // fontWeight: 'bold'
  },
  profileTitleBio: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 10,
    left: 33
    // fontWeight: 'bold'
  },
  profileTitleEmail: {
    fontSize: 15,
    color: DARK_GRAY,
    paddingHorizontal: 15,
    left: 20
    // fontWeight: 'bold'
  },
  profileButtons: {
    marginLeft: DIMENSION_WIDTH * 0.13,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons2: {
    marginLeft: DIMENSION_WIDTH * 0.31,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons3: {
    marginLeft: DIMENSION_WIDTH * 0.35,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileButtons4: {
    marginLeft: DIMENSION_WIDTH * 0.3,
    marginTop: DIMENSION_HEIGHT * 0.025,
  },
  profileCardHeader: {
    marginTop: -DIMENSION_HEIGHT * 0.025,
    flexDirection: "row",
    alignItems: 'center',
  },

  logoSettings: {
    height: DIMENSION_HEIGHT * 0.07,
    width: DIMENSION_WIDTH * 0.15,
    marginLeft: DIMENSION_WIDTH * 0.46,
    bottom: DIMENSION_HEIGHT * 0.025,
    marginTop: DIMENSION_HEIGHT * 0.03,
    padding: 2
  },

  deleteAccount:{
    marginLeft: DIMENSION_WIDTH * 0.35,
    color: "black"
  },

  deleteAccountButton:{
    marginBottom: DIMENSION_HEIGHT * 0.02,
    color: "black"
  },
  // CONTAINER - GENERAL
  bg: {
    flex: 1,
    resizeMode: "cover",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },

  internetBG: {
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },

  internetLogo: {
    width: DIMENSION_WIDTH * 0.35,
    height: DIMENSION_WIDTH * 0.3,
    marginTop: DIMENSION_HEIGHT * 0.2,
    marginLeft: DIMENSION_WIDTH * 0.05
  },

  internetText: {
    fontSize: 23,
    paddingLeft: DIMENSION_WIDTH * 0.25,
    bottom: DIMENSION_HEIGHT * 0.079
  },

  email: {
    marginRight: DIMENSION_WIDTH * 0.7,
    marginTop: DIMENSION_HEIGHT * 0.1
  },
  top: {
    paddingTop: 50,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    paddingBottom: 10,
    fontSize: 22,
    color: DARK_GRAY,
  },
  icon: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: DARK_GRAY,
    paddingRight: 10,
  },

  // CONTAINER - HOME
  containerHome: {
    alignSelf: "center",
    marginTop: -50,
  },

  homeCards: {
    alignSelf: "center",
    marginRight: 360,
    marginTop: -25,
    marginBottom: 40,
  },

  homeLogo: {
    width: 65,
    height: 60,
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.06,
  },

  top: {
    alignSelf: "center",
  },
  filterStyle: {
    alignSelf: "center",
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: DIMENSION_HEIGHT * 0.15,
    marginTop: 0,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowColor: BLACK,
    shadowOffset: { height: 0, width: 0 },
    zIndex: Platform.OS === "ios" ? -1 : 0,
  },

  // CONTAINER - MATCHES
  containerMatches: {
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 10,
  },

  matchTop: {
    paddingTop: 20,
    marginHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchTopSub: {
    paddingTop: 10,
    marginHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    top: 10,
  },

  // CONTAINER - MESSAGES
  containerMessages: {
    justifyContent: "space-between",
    flex: 1,
    paddingHorizontal: 10,
  },

  // CONTAINER - PROFILE
  containerProfile: { marginHorizontal: 0 },
  photo: {
    width: DIMENSION_WIDTH,
    height: 450,
  },
  topIconLeft: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingLeft: 20,
    marginTop: -20,
    transform: [{ rotate: "90deg" }],
  },
  topIconRight: {
    fontFamily: ICON_FONT,
    fontSize: 20,
    color: WHITE,
    paddingRight: 20,
  },
  actionsProfile: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: { fontFamily: ICON_FONT, fontSize: 20, color: WHITE },
  textButton: {
    fontFamily: ICON_FONT,
    fontSize: 15,
    color: WHITE,
    paddingLeft: 5,
  },
  circledButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    
  },
  roundedButton: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    height: 50,
    borderRadius: 25,
    backgroundColor: SECONDARY_COLOR,
    paddingHorizontal: 20,
  },

  // MENU
  tabButton: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabButtonText: {
    textTransform: "uppercase",
  },
  // Icon size
  iconMenu: {
    fontFamily: ICON_FONT,
    height: 20,
    fontSize: 20,
    paddingBottom: 1,
  },

  //COMPONENT - SIGNUP
  logo: {
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.1,
    marginLeft: DIMENSION_WIDTH * 0.05,
    width: DIMENSION_WIDTH * 0.35,
    height: DIMENSION_HEIGHT * 0.15,
  },

  privacyLogo: {
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.04,
    marginLeft: DIMENSION_WIDTH * 0.05,
    width: DIMENSION_WIDTH * 0.25,
    height: DIMENSION_HEIGHT * 0.1,
  },

  usernameHome: {
    paddingBottom: 7,
    marginTop: 0,
    color: '#363636',
    fontSize: 20,
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif;",
    alignSelf: 'center',
    top: DIMENSION_HEIGHT * 0.035,
  },

  buttonText: {
    paddingBottom: 7,
    marginTop: 0,
    fontSize: 15,
    fontFamily: "sans-serif",
    color: "#1a5d57",
    alignSelf: 'center',
  },

  ignoreText:{
    paddingBottom: 7,
    marginTop: 0,
    fontSize: 15,
    fontFamily: "sans-serif",
    alignSelf: 'center',
    color: "#d16969",
  },

  ignoreButtonStyle: {
    borderBottomRightRadius: 30,
    borderColor: "black",
    borderWidth: 0.06,
  },

  chatButtonStyle: {
    borderBottomLeftRadius: 30,
    borderColor: "black",
    borderWidth: 0.06,
  },

  match: {
    paddingBottom: 7,
    marginTop: 0,
    top: DIMENSION_HEIGHT * 0.05,
    color: '#363636',
    fontSize: 15,
    alignSelf: 'center'
  },

  chatButton:{
    width: DIMENSION_WIDTH * 0.425,
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderBottomLeftRadius: 20,
  },

  ignoreButton:{
    width: DIMENSION_WIDTH * 0.425,
    position: 'absolute',
    bottom: 0,
    right: 0
  },

  slide0: {
    marginTop: DIMENSION_HEIGHT * 0.08
  },

  slide1: {
    marginTop: DIMENSION_HEIGHT * 0.08
  },

  uniDropDown: {
    width: DIMENSION_WIDTH * 0.7, 
    left: DIMENSION_WIDTH * 0.12,
    marginBottom:20, 
    borderColor: "white", 
    borderWidth: 0.4, 
    borderRadius: 35,
    paddingLeft: 20, 
    paddingRight: 20, 
    paddingTop: -30,
    height: 50,
  },


  slide4: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  uniList: {
    bottom: DIMENSION_HEIGHT * 0.3, 
    left: DIMENSION_WIDTH * 0.09,
    width: DIMENSION_WIDTH * 0.7,
  },

  signupbutt: {
    backgroundColor: "#013d38",
    borderRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: DIMENSION_HEIGHT * 0.16,
    marginBottom: DIMENSION_HEIGHT * 0.05,
    width: DIMENSION_WIDTH * 0.35,
    alignSelf: 'center',
  },

  bottomsignup: {
    marginBottom: 35,
  },

  //COMPONENT - LOGIN
  loginlogo: {
    alignSelf: "center",
    marginTop: DIMENSION_HEIGHT * 0.1,
    marginLeft: DIMENSION_WIDTH * 0.05,
    marginBottom: DIMENSION_HEIGHT * 0.13,
    width: DIMENSION_WIDTH * 0.35,
    height: DIMENSION_HEIGHT * 0.15,
  },

  loginbutt: {
    backgroundColor: "#013d38",
    borderRadius: 10,
    marginTop: 40,
    width: 150,
    marginLeft: DIMENSION_WIDTH * 0.275,
  },

  signupredirect: {
    marginTop: 40,
    marginLeft: DIMENSION_WIDTH * 0.285,
    width: 150,
    marginTop: DIMENSION_HEIGHT * 0.05,
    width: DIMENSION_WIDTH * 0.35,
    alignSelf: 'center',
    elevation: 4
  },
  
  acceptButton:{
    backgroundColor: "#013d38",
    borderRadius: 10,
    width: DIMENSION_WIDTH * 0.35,
    alignSelf: 'center',
    elevation: 4
  },

  signupredirect: {
    width: DIMENSION_WIDTH * 0.35,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginTop: DIMENSION_HEIGHT * 0.05,
    bottom: DIMENSION_HEIGHT * 0.025,
    backgroundColor: "#013d38",
  },

  loginRedirect: {
    width: DIMENSION_WIDTH * 0.35,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: WHITE,
    marginTop: DIMENSION_HEIGHT * 0.02,
    backgroundColor: "#013d38",
  },

  bottomlogin: {
    marginTop: 60,
  },

  //COMPONENT - SIDE MENU
  sidemenucontainer: {
    paddingTop: 20,
    flex: 1,
  },

  navItemStyle: {
    padding: 10,
  },

  navSectionStyle: {
    backgroundColor: "lightgrey",
  },

  sectionHeadingStyle: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  footerContainer: {
    padding: 20,
    backgroundColor: "lightgrey",
  },

  //CONTAINERS - Onboarding
  onboardingWrapper: {
    zIndex: -1,
  },
  onboardingBg: {
    flex: 1,
    resizeMode: "contain",
    width: DIMENSION_WIDTH,
    height: DIMENSION_HEIGHT,
  },
  slideOneTop: {
    // marginTop: DIMENSION_HEIGHT * 0.1,
    flexDirection: "column",
    alignItems: "center",
  },
  slideTwoContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  slideTwoHeader: {
    marginTop: DIMENSION_HEIGHT * 0.05,
    color: "white",
    fontSize: 30,
  },

  slideSignUp: {
    marginTop: DIMENSION_HEIGHT * 0.02
  },
  slideTwoNormal: {
    color: "white",
    fontSize: 18,
  },
  internalWrapper: {
    position: "absolute",
    marginTop: DIMENSION_HEIGHT * 0.25,
    zIndex: 5,
    backgroundColor: "transparent",
  },
  slideoneCarousel: {
    marginTop: DIMENSION_HEIGHT * 0.2,
    height: DIMENSION_HEIGHT * 0.2,
    marginBottom: DIMENSION_HEIGHT * 0.1
  },
  onBoardingButt: {
    backgroundColor: "#1b4a45",
    borderRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: 120,
    height: 40,
    alignItems: "center",
    textAlignVertical: "center",
  },
  slide4content: {
    padding: DIMENSION_HEIGHT * 0.1,
    flexDirection: "column",
    alignItems: "center",
  },
  slide4buttons: {
    marginTop: DIMENSION_HEIGHT * 0.2,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: DIMENSION_HEIGHT * 0.2,
  },
  onboardinglogo: {
    marginLeft: DIMENSION_WIDTH * 0.11,
    marginTop: DIMENSION_HEIGHT * 0.001,
    width: DIMENSION_WIDTH * 0.45,
    height: DIMENSION_HEIGHT * 0.2,
  },
  onBoardingSep: {
    marginTop: DIMENSION_HEIGHT * 0.035,
    marginBottom: DIMENSION_HEIGHT * 0.035,
  },
  onBoardingButtText: {
    color: "white",
    marginTop: 10,
  },
  slide3content: {
    marginLeft: DIMENSION_WIDTH * 0.5,
    flexDirection: "column",
    alignItems: "center",
  },
  slide3: {
    // marginHorizontal: DIMENSION_HEIGHT * 0.06,
  },
  slide3Header: {
    marginTop: DIMENSION_HEIGHT * 0.05,
    marginLeft: DIMENSION_WIDTH * 0.32,
    color: "white",
    fontSize: 30,
  },
  slide3Normal: {
    color: "white",
    fontSize: 18,
    marginLeft: DIMENSION_HEIGHT * 0.09,
  },
  slide3line: {
    width: DIMENSION_HEIGHT * 0.06,
    marginLeft: DIMENSION_HEIGHT * 0.22,
    marginTop: DIMENSION_HEIGHT * 0.015,
    marginBottom: DIMENSION_HEIGHT * 0.015,
  },
  OBnext: {
    backgroundColor: "white",
    width: DIMENSION_HEIGHT * 0.18,
    height: DIMENSION_HEIGHT * 0.06,
    borderRadius: DIMENSION_HEIGHT * 0.048,
    bottom: DIMENSION_HEIGHT * 0.05,
  },
  OBnext2: {
    backgroundColor: "white",
    width: DIMENSION_HEIGHT * 0.18,
    height: DIMENSION_HEIGHT * 0.06,
    borderRadius: DIMENSION_HEIGHT * 0.048,
    bottom: DIMENSION_HEIGHT * 0.05
  },
  OBnext3: {
    backgroundColor: "white",
    width: DIMENSION_HEIGHT * 0.18,
    height: DIMENSION_HEIGHT * 0.06,
    borderRadius: DIMENSION_HEIGHT * 0.048,
    bottom: DIMENSION_HEIGHT * 0.06
  },
  OBnextText1: {
    color: "#8B9EAF",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: DIMENSION_HEIGHT * 0.015,
    marginLeft: DIMENSION_WIDTH * 0.14,
  },
  OBnextText2: {
    color: "#4D617C",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: DIMENSION_HEIGHT * 0.015,
    marginLeft: DIMENSION_WIDTH * 0.14,
  },
  OBnextText3: {
    color: "#679389",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: DIMENSION_HEIGHT * 0.015,
    marginLeft: DIMENSION_WIDTH * 0.14,
  },
});
