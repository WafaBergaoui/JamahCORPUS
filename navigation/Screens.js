import React from "react";
import { Dimensions } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// screens
import Home from "../screens/HomeScreen";
import DetailsFacture from "../screens/DetailsFactureScreen";
import DetailsNotedeFrai from "../screens/DetailsPostScreen";
import Post from "../screens/PostScreen";
import Register from "../screens/SignupScreen";
import Login from "../screens/SigninScreen";
import Synthèse from "../screens/SynthesisScreen";
import Rapport from "../screens/ReportScreen";
import Notification from "../screens/NotificationScreen";
import Loading from "../screens/LoadingScreen";
// drawer
import CustomDrawerContent from "./Menu";

// header for screens
import { Header } from "../components";
const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeStack() {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Acceuil"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Jamah CORPUS"
              search
              tabs={tabs.categories}
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="DetailsFacture"
        component={DetailsFacture}
        headerMode="screen"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Details Facture"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="DetailsNotedeFrai"
        component={DetailsNotedeFrai}
        headerMode="screen"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Details Note De Frais"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        headerMode="screen"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Notification"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function PostStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Ajouter un nouveau fichier"
        component={Post}
        option={{
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}
export default function LoadingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Loading"
        component={Loading}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        option={{
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Register"
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function ReportsStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="none">
      <Stack.Screen
        name="Synthèse"
        component={Synthèse}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Synthèse"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}

function StaticStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Rapport"
        component={Rapport}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Rapport"
              back
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
    </Stack.Navigator>
  );
}

const AppStack = (props) => {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen name="Acceuil" component={HomeStack} />
      <Drawer.Screen name="Ajouter un nouveau fichier" component={PostStack} />
      <Drawer.Screen name="Synthèse" component={ReportsStack} />
      <Drawer.Screen name="Rapport" component={StaticStack} />
    </Drawer.Navigator>
  );
};
