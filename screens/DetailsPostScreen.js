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
import { TextInput } from "react-native-gesture-handler";
import { windowWidth } from "../utils/Dimentions";

const DetailsPostScreen = ({ navigation }) => {
  const initialState = {
    id: "",
    title: "",
    category: "",
    subCategory: "",
    date: "",
    devise: "",
    montant_ht: "",
    montant_ttc: "",
    montant_tva: "",
    nom_enseigne: "",
    num_carte_bancaire: "",
    type_paiement: "",
    type_tva: "",
  };

  const [user, setUser] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const userId = navigation.getParam("userId");

  useEffect(() => {
    getUserById(userId);
  }, []);

  const getUserById = async (id) => {
    const dbRef = firebase.firestore().collection("posts").doc(id);
    const doc = await dbRef.get();
    const user = doc.data();
    setUser({ ...user, id: doc.id });
    setLoading(false);
  };
  const handleTextChange = (value, prop) => {
    if (/^\d+$/.test(value.toString())) {
      setUser({ ...user, [prop]: value });
    }
  };

  const updateUser = async () => {
    const userRef = firebase.firestore().collection("posts").doc(user.id);
    await userRef.update({
      title: user.title,
      category: user.category,
      subCategory: user.subCategory,
      date: user.date,
      devise: user.devise,
      montant_ht: user.montant_ht,
      montant_ttc: user.montant_ttc,
      montant_tva: user.montant_tva,
      nom_enseigne: user.nom_enseigne,
      num_carte_bancaire: user.num_carte_bancaire,
      type_paiement: user.type_paiement,
      type_tva: user.type_tva,
      isCheckedByUser: true,
    });
    navigation.navigate("Home");
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
        </View>

        <View style={styles.body}>
          <Text>Titre :</Text>
          <TextInput
            placeholder="title"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.title}
            onChangeText={(value) => handleTextChange(value, "title")}
          />
          <View>
            <Image
              source={{ uri: user.url }}
              style={{
                width: windowWidth / 1.2,
                height: 400,
              }}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.text}>Catégorie: </Text>
          <TextInput
            placeholder="Catégorie"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.category}
            onChangeText={(value) => handleTextChange(value, "category")}
          />

          <Text style={styles.text}>Sous Catégorie: </Text>
          <TextInput
            placeholder="Sous Categorie"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.subCategory}
            onChangeText={(value) => handleTextChange(value, "subCategory")}
          />

          <Text>Date: </Text>
          <TextInput
            placeholder="date"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.date}
            onChangeText={(value) => handleTextChange(value, "date")}
          />

          <Text>Devise: </Text>
          <TextInput
            placeholder="devise"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.devise}
            onChangeText={(value) => handleTextChange(value, "devise")}
          />
          <Text>Montant_ht: </Text>

          <TextInput
            placeholder="montant_ht"
            keyboardType = 'numeric'
            autoCompleteType="cc-number"
            style={styles.inputGroup}
            value={user.montant_ht}
            onChangeText={(value) => handleTextChange(value, "montant_ht")}
          />
          <Text>Montant_ttc: </Text>

          <TextInput
            placeholder="montant_ttc"
            keyboardType = 'numeric'
            autoCompleteType="cc-number"
            style={styles.inputGroup}
            value={user.montant_ttc}
            onChangeText={(value) => handleTextChange(value, "montant_ttc")}
          />
          <Text>Montant_TVA: </Text>

          <TextInput
            placeholder="montant_tva"
            keyboardType = 'numeric'
            autoCompleteType="cc-number"
            style={styles.inputGroup}
            value={user.montant_tva}
            onChangeText={(value) => handleTextChange(value, "montant_tva")}
          />

          <Text>Nom enseigne: </Text>

          <TextInput
            placeholder="nom_enseigne"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.nom_enseigne}
            onChangeText={(value) => handleTextChange(value, "nom_enseigne")}
          />
          <Text>Num Carte Bancaire: </Text>

          <TextInput
            placeholder="num_carte_bancaire"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.num_carte_bancaire}
            onChangeText={(value) =>
              handleTextChange(value, "num_carte_bancaire")
            }
          />
          <Text>Type paiement:</Text>

          <TextInput
            placeholder="type_paiement"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.type_paiement}
            onChangeText={(value) => handleTextChange(value, "type_paiement")}
          />
          <Text>Type TVA: </Text>

          <TextInput
            placeholder="type_tva"
            //autoCompleteType="name"
            style={styles.inputGroup}
            value={user.type_tva}
            onChangeText={(value) => handleTextChange(value, "type_tva")}
          />
        </View>
        <View style={styles.btnDelete}>
          <Button
            title="Delete"
            onPress={() => openConfirmationAlert()}
            color="#E37399"
          />
        </View>
        <View style={styles.btnUpdate}>
          <Button title="Update" color="#19AC52" onPress={() => updateUser()} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
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
  btnDelete: {
    marginBottom: 7,
    marginEnd: 50,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 20,
  },
  btnUpdate: {
    marginEnd: 50,
    marginLeft: 50,
    marginRight: 50,
    paddingTop: 10,
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  body: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
});

export default DetailsPostScreen;
