import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  ActivityIndicator,
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";

import firebase from "../firebase/firebase";

const DetailsPostScreen = ({ navigation }) => {

  //let picture = navigation.getParam("img");

  const getURLPicture = navigation.getParam("urlImage");
  const getTitle = navigation.getParam("title");
  const getCatgeory = navigation.getParam("category");




  const id = navigation.getParam("itemId");

  const [loading, setLoading] = useState(true);
  /*
  useEffect(() => {
    console.log(navigation.getParam("itemId"));
    getUserById(navigation.getParam("itemId"));
  }, []);

  const getUserById = async (id) => {
    const dbRef = firebase.firestore().collection("posts").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    //   setUser({ ...user, id: doc.id });
    setLoading(false);
  };
*/
  const deleteUser = async () => {
    //setLoading(true);
    console.log({id});
    const dbRef = (firebase.firestore().collection("posts").doc({id}).get());
    await dbRef.delete();
    //setLoading(false);
    //navigation.navigate("Home");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Removing the User",
      "Are you sure?",
      [
        { text: "Yes", onPress: () => deleteUser() },
        { text: "No", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  /*const updateUser = async () => {
    const userRef = firebase.db.collection("posts").doc(user.id);
    await userRef.set({
      title: user.title,
    });
    setUser(initialState);
    props.navigation.navigate("Home");
  };

  const handleTextChange = (value, prop) => {
    setUser({ ...user, [prop]: value });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }*/

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text>{getTitle}</Text>
      </View>
      <View>
        <Text>{getCatgeory}</Text>
      </View>
      <View>
        <Image source={{ uri: getURLPicture }} style={{ width: 100, height: 100 }} />
      </View>

      <View>
        <Button
          title="Delete"
          onPress={() => openConfirmationAlert()}
          color="#E37399"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  loader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  btn: {
    marginBottom: 7,
  },
});

export default DetailsPostScreen;
