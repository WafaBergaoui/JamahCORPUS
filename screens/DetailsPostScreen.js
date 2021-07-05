import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  View,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import firebase from "../firebase/firebase";
import { Block, Text } from "galio-framework";
import { TextInput } from "react-native-gesture-handler";
import { windowWidth } from "../utils/Dimentions";
import { Button } from "../components";
import { argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");

const DetailsFactureScreen = ({ navigation, route }) => {
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
  };

  const [post, setPost] = useState(initialState);
  const [loading, setLoading] = useState(true);

  const { userId } = route.params;

  useEffect(() => {
    getPostById(userId);
  }, []);

  const getPostById = async (id) => {
    const dbRef = firebase
      .firestore()
      .collection("posts")
      .doc(id);
    const doc = await dbRef.get();
    const post = doc.data();
    setPost({ ...post, id: doc.id });
    setLoading(false);
  };

  const handleTextChange = (value, prop) => {
    setPost({ ...post, [prop]: value });
  };

  const updatePost = async () => {
    const postRef = firebase
      .firestore()
      .collection("posts")
      .doc(post.id);
    await postRef.update({
      title: post.title,
      category: post.category,
      subCategory: post.subCategory,
      date: post.date,
      devise: post.devise,
      montant_ht: post.montant_ht,
      montant_ttc: post.montant_ttc,
      montant_tva: post.montant_tva,
      nom_enseigne: post.nom_enseigne,
      num_carte_bancaire: post.num_carte_bancaire,
      type_paiement: post.type_paiement,
      isCheckedByUser: true,
    });
    navigation.navigate("Acceuil");
  };

  const deletePost = async () => {
    setLoading(true);
    const dbRef = firebase
      .firestore()
      .collection("posts")
      .doc(post.id);
    await dbRef.delete();
    setLoading(false);
    navigation.navigate("Acceuil");
  };

  const openConfirmationAlert = () => {
    Alert.alert(
      "Removing this Post",
      "Are you sure?",
      [
        { text: "Yes", onPress: () => deletePost() },
        { text: "No", onPress: () => console.log("canceled") },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Block flex middle>
        <Block style={styles.blockContainer}>
          <Block flex>
            <Block flex center>
              <View style={styles.body}>
                <Image
                  source={{ uri: post.url }}
                  style={{
                    height: 370,
                    marginTop: 30,
                    marginBottom: 30,
                    width: windowWidth / 1.2,
                  }}
                  resizeMode="contain"
                />
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Titre
                  </Text>
                  <TextInput
                    placeholder="title"
                    bold
                    //autoCompleteType="name"
                    style={styles.inputGroup}
                    value={post.title}
                    onChangeText={(value) => handleTextChange(value, "title")}
                  />
                </Block>

                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Catégorie
                  </Text>
                  <TextInput
                    placeholder="Catégorie"
                    style={styles.inputGroup}
                    multiline={true}
                    value={post.category}
                    onChangeText={(value) =>
                      handleTextChange(value, "category")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Sous Catégorie
                  </Text>
                  <TextInput
                    placeholder="Sous Categorie"
                    style={styles.inputGroup}
                    multiline={true}
                    value={post.subCategory}
                    onChangeText={(value) =>
                      handleTextChange(value, "subCategory")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Date
                  </Text>
                  <TextInput
                    placeholder="date"
                    style={styles.inputGroup}
                    value={post.date}
                    onChangeText={(value) => handleTextChange(value, "date")}
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Devise
                  </Text>
                  <TextInput
                    placeholder="devise"
                    style={styles.inputGroup}
                    value={post.devise}
                    onChangeText={(value) => handleTextChange(value, "devise")}
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Montant_ht
                  </Text>
                  <TextInput
                    placeholder="montant_ht"
                    keyboardType="numeric"
                    autoCompleteType="cc-number"
                    style={styles.inputGroup}
                    value={post.montant_ht}
                    onChangeText={(value) =>
                      handleTextChange(value, "montant_ht")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Montant_ttc
                  </Text>
                  <TextInput
                    placeholder="montant_ttc"
                    keyboardType="numeric"
                    autoCompleteType="cc-number"
                    style={styles.inputGroup}
                    value={post.montant_ttc}
                    onChangeText={(value) =>
                      handleTextChange(value, "montant_ttc")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Montant_TVA
                  </Text>
                  <TextInput
                    placeholder="montant_tva"
                    keyboardType="numeric"
                    autoCompleteType="cc-number"
                    style={styles.inputGroup}
                    value={post.montant_tva}
                    onChangeText={(value) =>
                      handleTextChange(value, "montant_tva")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Nom prestataire
                  </Text>
                  <TextInput
                    placeholder="nom_enseigne"
                    style={styles.inputGroup}
                    value={post.nom_enseigne}
                    onChangeText={(value) =>
                      handleTextChange(value, "nom_enseigne")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Type paiement
                  </Text>
                  <TextInput
                    placeholder="type_paiement"
                    style={styles.inputGroup}
                    value={post.type_paiement}
                    onChangeText={(value) =>
                      handleTextChange(value, "type_paiement")
                    }
                  />
                </Block>
                <Block row="horizontal">
                  <Text bold style={{ marginRight: 30, marginLeft: 30 }}>
                    Num Carte Bancaire:
                  </Text>
                  <TextInput
                    placeholder="Num Carte Bancaire"
                    style={styles.inputGroup}
                    value={post.num_carte_bancaire}
                    onChangeText={(value) => handleTextChange(value, "num_carte_bancaire")}
                  />
                </Block>
              </View>

              <Block row="horizontal" middle>
                <Button
                  style={styles.createButton}
                  onPress={() => openConfirmationAlert()}
                  color="red"
                >
                  <Text bold size={16} color={argonTheme.COLORS.WHITE}>
                    DELETE
                  </Text>
                </Button>
                <Button
                  style={styles.createButton}
                  onPress={() => updatePost()}
                  color="success"
                >
                  <Text bold size={16} color={argonTheme.COLORS.WHITE}>
                    UPDATE
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#efecf4",
  },
  inputGroup: {
    flex: 1,
    width: 20,
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
  placeholder: {
    height: 50,
    width: "100%",
    color: "grey", // PLACE HOLDER COLOR
  },
  forgotButton: {
    marginVertical: 10,
    backgroundColor: "#A9A9A9",
  },
  blockContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: width * 0.9,
    //height: height * 0.875,
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
  createButton: {
    width: width * 0.3,
    marginTop: 25,
    marginBottom: 20,
  },
  forgotButton: {
    marginVertical: 10,
  },
});

export default DetailsFactureScreen;
