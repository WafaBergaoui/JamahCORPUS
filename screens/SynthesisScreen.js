import React, { useState, useEffect } from "react";
import { View, Dimensions, StatusBar, StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";
import { argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
import { ScrollView } from "react-native-gesture-handler";

import firebase from "../firebase/firebase";

export default SynthesisScreen = ({ navigation }) => {
  const [synthesis, setSynthesis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    firebase
      .firestore()
      .collection("synthesis")
      .where("userId", "==", firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const synthesis = [];
        querySnapshot.docs.forEach((doc) => {
          const { sommeTTC, sommeHT, sommeTVA } = doc.data();
          synthesis.push({
            id: doc.id,
            sommeHT,
            sommeTTC,
            sommeTVA,
          });
        });
        console.log(synthesis);
        setSynthesis(synthesis);
      });
  };

  return (
    <ScrollView>
      {synthesis.map((synthesis) => {
        return (
          <Block flex key={synthesis.id}>
            <StatusBar hidden />
            <Block middle>
              <Text
                style={{
                  marginTop: 90,
                }}
                size={30}
              >
                Synthèse
              </Text>
            </Block>

            <Block row="horizontal">
              <Text
                bold
                style={{
                  marginLeft:20,
                  marginRight: 25,
                  marginTop: 70,
                }}
              >
                Total HT
              </Text>
              <Text
                style={{
                  marginTop: 70,
                }}
              >
                {synthesis.sommeHT}
              </Text>
            </Block>

            <Block row="horizontal">
              <Text
                bold
                style={{
                  marginLeft:20,
                  marginRight: 52,
                  marginTop: 20,
                }}
              >
                TVA
              </Text>
              <Text
                style={{
                  marginTop: 20,
                }}
              >
                {synthesis.sommeTVA}
              </Text>
            </Block>
            <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "90%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
          </Block>
            <Block row="horizontal">
              <Text
                bold
                style={{
                  marginLeft:20,
                  marginRight: 23,
                  marginTop: 20,
                }}
              >
                Total TTC
              </Text>
              <Text
                style={{
                  marginTop: 20,
                }}
              >
                {synthesis.sommeTTC}
              </Text>
            </Block>
          </Block>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 50,
    width: "100%",
    color: "grey", // PLACE HOLDER COLOR
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black", // VALUE COLOR
  },

  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  forgotButton: {
    marginVertical: 10,
    backgroundColor: "#A9A9A9",
  },
  postContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  inputIcons: {
    marginRight: 12,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 10,
  },
  createFirstButton: {
    width: width * 0.7,
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 10,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0000FF",
  },
  inputGroup: {
    flex: 1,
    width: 20,
    marginTop: 50,
  },
});
