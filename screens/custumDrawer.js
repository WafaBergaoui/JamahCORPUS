import React from "react";
import {
  DrawerNavigatorItems,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
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
    <Image source={require("../assets/logo.png")} style={styles.profile} />
    <View>
      <DrawerNavigatorItems {...props} />
    </View>
    <TouchableOpacity onPress={handlePress}>
      <Ionicons name="md-exit" size={17} color="black">
        Log Out
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
    borderRadius: 40,
    borderWidth: 3,
  },
});
