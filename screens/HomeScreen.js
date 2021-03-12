import React from "react";
import { StyleSheet, View, Text } from "react-native";
import * as firebase from "firebase";

export default HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is my Home</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: "center" },
});
