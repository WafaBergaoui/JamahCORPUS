import * as firebase from "firebase";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { windowHeight } from "../utils/Dimentions";
require("firebase/functions")

const SynthesisScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sumTTC, setSumTTC] = useState(0);

  useEffect(() => {
    firebase.functions()
      .httpsCallable("getSommeTVA")()
      .then((response) => {
        setSumTTC(response.data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>SYNTHESIS</Text>

        <Text>Somme des TTC</Text>
        <View style={styles.inputContainer}>
          <Text>{sumTTC}</Text>
        </View>

        <Text>Somme des TVA</Text>
        <View style={styles.inputContainer}>
          <Text></Text>
        </View>
      </ScrollView>
    </>
  );
};

export default SynthesisScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "cover",
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    height: windowHeight / 15,
    borderColor: "#ccc",
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
