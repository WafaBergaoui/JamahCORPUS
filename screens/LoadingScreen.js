import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import firebase from "firebase";

export default LoadingScreen = ({ navigation }) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      navigation.navigate(user ? "App" : "Auth");
    });
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large">
        
      </ActivityIndicator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
