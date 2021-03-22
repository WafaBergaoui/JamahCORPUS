import React from "react";
import { LogBox } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from "./screens/LoadingScreen";
import SigninScreen from "./screens/SigninScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreens";
import PostScreen from "./screens/PostScreen";
import DetailsPostsScreen from "./screens/DetailsPostScreens";
import Sidebar from "./screens/custumDrawer";


LogBox.ignoreAllLogs();
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
                color="#E9446a"
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
    },
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

const AuthStack = createStackNavigator({
  Signup: SignupScreen,
  Signin: SigninScreen,
});

const Details = createStackNavigator({
  Details: DetailsPostsScreen,
});



export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack,
      DetailsPosts: Details,
    },
    {
      initialRouteName: "Loading",
    }
  )
);