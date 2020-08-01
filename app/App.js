
import {
	createAppContainer,
	createSwitchNavigator
} from "react-navigation";
import RootStack from "./AccApp"
import SplashScreen from "./containers/SplashScreen"


const InitialNavigator = createSwitchNavigator({ //createStackNavigator
	Splash: SplashScreen,
	App: RootStack
  });

export default createAppContainer(InitialNavigator);
