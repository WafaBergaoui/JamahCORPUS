import React from "react";
import {
  DrawerNavigatorItems,
  //DrawerContentScrollView,
  //DrawerItemList,
  //DrawerItem,
} from "react-navigation-drawer";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";

const signOut = () => {
  try {
    firebase.auth().signOut();
  } catch (err) {
    Alert.alert("There is something wrong!", err.message);
  }
};

const handlePress = () => {
  signOut();
};

export default Sidebar = (props) => (
  <ScrollView>
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={{ width: undefined, padding: 16, paddingTop: 48 }}
    >
      <Image source={require("../assets/logo.png")} style={styles.profile} />
    </ImageBackground>

    <View style={styles.container}>
      <DrawerNavigatorItems {...props} />
    </View>

    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="md-exit" size={24} color="black" marginLeft="500">
        <Text size={15} style={{ fontWeight: "200" }}>Log Out</Text>
      </Ionicons>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profile: {
    width: 80,
    height: 80,
    marginLeft: 80,
    borderRadius: 40,
    borderWidth: 3,
  },
});
