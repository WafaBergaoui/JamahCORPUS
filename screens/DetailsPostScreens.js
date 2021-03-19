import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Button,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import firebase from "../firebase/firebase";
import { Ionicons } from "@expo/vector-icons";

const DetailsPostScreens = ({ navigation }) => {
  const initialState = {
    id: "",
    title: "",
    url: "",
    class: "",
    date: "",
    devise: "",
    montant_ht: "",
    montant_ttc: "",
    montant_tva: "",
    nom_enseigne: "",
    num_carte_bancaire: "",
    type_paiement: "",
    type_tva: "",
    NDF: "",
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

 

  const getUserById = async (id) => {
    const dbRef = firebase.firestore().collection("posts").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({ ...user, id: doc.id });
    setLoading(false);
  };

  const deleteUser = async () => {
    setLoading(true);
    const dbRef = firebase.firestore().collection("posts").doc(user.id);
    await dbRef.delete();
    setLoading(false);
    navigation.navigate("Home");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Removing this Post",
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



  useEffect(() => {
    getUserById(navigation.getParam("userId"));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#9E9E9E" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginRight: 300 }}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="md-arrow-back" size={24} color="black"></Ionicons>
          </TouchableOpacity>
        </View >
        <View style={styles.body}>
            <Text>Titre : {user.title}</Text>
            <Image source={{ uri: user.url }} style={{ width: 300, height: 600 }} />
            <Text style={styles.text}>Classe: {user.class}</Text>
            <Text>Date: {user.date}</Text>
            <Text>Devise: {user.devise}</Text>
            <Text>Montant_ht: {user.montant_ht}</Text>
            <Text>Montant_ttc: {user.montant_ttc}</Text>
            <Text>Montant_TVA: {user.montant_tva}</Text>
            <Text>Nom enseigne: {user.nom_enseigne}</Text>
            <Text>Num Carte Bancaire: {user.num_carte_bancaire}</Text>
            <Text>Type paiement:{user.type_paiement}</Text>
            <Text>Type TVA: {user.type_tva}</Text>
            <Text>NDF: {user.NDF}</Text>
        </View>
        
        <Button
          style={styles.btn}
          title="Delete"
          onPress={() => openConfirmationAlert()}
          color="#E37399"
        />
        <Button title="Update" onPress={() => navigation.navigate("EditDetails")} color="#19AC52" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1 ,
    //width: widthDP("100%"),
   // height: heightDP("100%"),
    backgroundColor: "#efecf4",
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
    marginLeft:50,
    marginLeft:50,
    paddingTop: 100,

  },
  text: {
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: "center",
    //fontSize: widthDP("3.70%"),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default DetailsPostScreens;

/*
<TextInput
          placeholder="title"
          autoCompleteType="name"
          style={styles.inputGroup}
          value={user.title}
          onChangeText={(value) => handleTextChange(value, "title")}
        ></TextInput> 
*/
