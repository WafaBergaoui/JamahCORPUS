import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { windowHeight, windowWidth } from "../utils/Dimentions";
import {
  addFacturesFournisseurs,
  addFacturesClient,
  addNotesDeFrais,
} from "../firebase/firebase.js";

const Categories = [
  { label: "Facture fournisseur", value: "facturesFournisseurs" },
  { label: "Facture client", value: "FacturesClient" },
  { label: "Note de frais", value: "notesdefrais" },
];

export default PostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const onTitleChange = (inputText) => {
    setTitle(inputText);
  };

  const onCategoryChange = async (category) => {
    if (category == "facturesFournisseurs") {
      addFacturesFournisseurs(title, category, image);
    } else if (category == "FacturesClient") {
      addFacturesClient(title, category, image);
    } else {
      addNotesDeFrais(title, category, image);
    }
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  //On choisie une image à partir de la galerie du télèphone
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //On prend une photo à partir du cam du télèphone
  const onChooseImagePress = async () => {
    let result = await ImagePicker.launchCameraAsync();
    console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //
  const handlePost = () => {
    onCategoryChange(category)
      .then((ref) => {
        setImage(null);
        setTitle("");
        setCategory("");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
    if (!title || !category || !image) {
      return alert("fill all the fields first!");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView styles={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ marginRight: 300 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="md-arrow-back" size={24} color="black"></Ionicons>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={pickImage}>
          <Text style={{ fontWeight: "500" }}>Choose From Gallery..</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onChooseImagePress}>
          <Text style={{ fontWeight: "500" }}>Take Photo..</Text>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
          <Image
            source={{ uri: image }}
            style={{ width: 400, height: 200 }}
          ></Image>

          <TextInput
            style={styles.inputContainer}
            placeholderTextColor="#1c87c9"
            autoFocus={true}
            multiline={true}
            numberOfLines={2}
            placeholder="Title"
            onChangeText={onTitleChange}
            value={title}
          ></TextInput>

          <RNPickerSelect
            style={styles.inputSelect}
            placeholder={{
              label: "Select a category",
              value: null,
              color: "#C0C0C0",
            }}
            onValueChange={(category) => setCategory(category)}
            items={Categories}
          ></RNPickerSelect>

          <Button
            style={styles.navButtonText}
            onPress={handlePost}
            title="UPLOAD"
            color="#0000FF"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ebecf4",
    shadowColor: "#454d65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  inputSelect: {
    /* margin: 12,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30, */ // to ensure the text is never behind the icon

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
  inputContainer: {
    //flex:1,
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
  /* header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },*/
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  photo: {
    alignItems: "flex-end",
    marginHorizontal: 32,
  },
  forgotButton: {
    marginVertical: 10,
    backgroundColor: "#A9A9A9",
  },
  navButtonText: {
    fontWeight: "200",
    color: "#2e64e5",
  },
});
