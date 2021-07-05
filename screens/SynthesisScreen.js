import React, { useState, useEffect } from "react";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { Block, Text } from "galio-framework";
import { ListItem } from "react-native-elements";
import { TextInput } from "react-native-gesture-handler";
import { argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");

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
          synthesis.push({
            id: doc.id,
          });
        });
          setSynthesis(synthesis);
      });
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <Block safe flex middle>
        <Block style={styles.postContainer}>
          <Block flex>
            <Block flex center>
              <Block flex={0.25} middle>
                <Text  size={30}>
                  Synthèse
                </Text>
              </Block>

              <Block row="horizontal">
                <Text
                  bold
                  style={{
                    marginRight: 10,
                    marginTop: 50,
                  }}
                >
                  Total HT
                </Text>
                <Text
                  bold
                  style={{
                  
                    marginTop: 50,
                  }}
                >
                  {synthesis.sommeHT}jjj
                </Text>
              </Block>

              <Block row="horizontal">
                <Text
                  bold
                  style={{
                    marginRight: 10,
                    marginTop: 20,
                  }}
                >
                  TVA
                </Text>
                <Text
                  bold
                  style={{
               
                    marginTop: 20,
                  }}
                >
                  {synthesis.sommeTVA}
                </Text>
              </Block>
              <Block row="horizontal">
                <Text
                  bold
                  style={{
                    marginRight: 10,
                    marginTop: 20,
                  }}
                >
                  Total TTC
                </Text>
                <Text
                  bold
                  style={{
             
                    marginTop: 20,
                  }}
                >
                  {synthesis.sommeTTC}
                </Text>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
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
