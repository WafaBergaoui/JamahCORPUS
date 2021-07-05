/*import React from "react";
import { LogBox } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import PostScreen from "./screens/PostScreen";
import DetailsPostsScreen from "./screens/DetailsPostScreen";
import DetailsFactureScreen from "./screens/DetailsFactureScreen";
import Sidebar from "./screens/custumDrawer";
import { Header } from "./components/Header";*/



import React, {useState} from "react";
import { Image, LogBox } from "react-native";
import AppLoading from "expo-app-loading";
import { useFonts } from '@use-expo/font';
import { Asset } from "expo-asset";
import { Block, GalioProvider } from "galio-framework";
import { NavigationContainer , useNavigation} from "@react-navigation/native";


// Before rendering any navigation stack
import { enableScreens } from "react-native-screens";
enableScreens();
LogBox.ignoreAllLogs();
import Screens from "./navigation/Screens";
import { Images, articles, argonTheme } from "./constants";

// cache app images
/*const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
*/
export default props = ()=> {
 /* const [isLoadingComplete, setLoading] = useState(false);
  let [fontsLoaded] = useFonts({
    'ArgonExtra': require('./assets/font/argon.ttf'),
  });
 
  function _loadResourcesAsync() {
    return Promise.all([...cacheImages(assetImages)]);
  }

  function _handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

 function _handleFinishLoading() {
    setLoading(true);
  };

  if(!fontsLoaded && !isLoadingComplete) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else if(fontsLoaded) {
    return (
      <NavigationContainer>
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );*/
    return (
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    );
  }/* else {
    return null
  }
}*/



/*LogBox.ignoreAllLogs();
const AppContainer = createStackNavigator(
  {
    default: createDrawerNavigator(
      {
        Home: {
          screen: HomeScreen,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Ionicons name="ios-home" size={24} color={tintColor} />
            ),
          },
        },

        Post: {
          screen: PostScreen,
          navigationOptions: {
            drawerIcon: ({ tintColor }) => (
              <Ionicons
                name="download"
                size={24}
                color={tintColor}
                style={{
                  shadowColor: "#E9446a",
                  shadowOffset: { width: 0, height: 10 },
                  shadowRadius: 10,
                  shadowOpacity: 0.3,
                }}
              />
            ),
          },
        },       
      },
      {
        contentComponent: (props) => <Sidebar {...props} />,
        initialRouteName: "Home",
      }
    ),

    postModal: {
      screen: PostScreen,
    }
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

const AuthStack = createStackNavigator({
  Signin: SigninScreen,
  Signup: SignupScreen,
});

const Detailsndf = createStackNavigator({
  DetailsNotedeFrai: DetailsPostsScreen,
});

const DetailsFact = createStackNavigator({
  DetailsFacture: DetailsFactureScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack,
      DetailsNotedeFrais: Detailsndf,
      DetailsFactures: DetailsFact,
    },
    {
      initialRouteName: "Loading",
    }
  )
);*/
