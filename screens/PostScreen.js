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
import { Picker } from "@react-native-picker/picker";

import * as ImagePicker from "expo-image-picker";
import FormButton from "../components/FormButton";

import {
  addFacturesFournisseurs,
  addFacturesClient,
  addNotesDeFrais,
  addAutres,
} from "../firebase/firebase.js";

const Categories = [
  { label: "Facture fournisseur", value: "Factures Fournisseurs" },
  { label: "Facture client", value: "Factures Client" },
  { label: "Note de frais", value: "Note de frais" },
  { label: "Autres", value: "Autres" },
];

export default PostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const onTitleChange = (inputText) => {
    setTitle(inputText);
  };
  const isPlaceholder = (value) => {
    return value == "";
  };

  const onCategoryChange = async (category) => {
    if (category == "Factures Fournisseurs") {
      addFacturesFournisseurs(title, category, image);
    } else if (category == "Factures Client") {
      addFacturesClient(title, category, image);
    } else if (category == "Note de frais") {
      addNotesDeFrais(title, category, image);
    } else if (category == "Autres") {
      addAutres(title, category, image);
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
      aspect: [6, 8],
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
        <View style={styles.header}></View>
        <View>
          <FormButton buttonTitle="Take Photo" onPress={onChooseImagePress} />
        </View>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.textGallery}>
            <Text>Choose From Gallery..</Text>
          </View>
        </TouchableOpacity>

        <View style={{ marginHorizontal: 32, marginTop: 32, height: 150 }}>
          <Image
            source={{ uri: image }}
            style={{ width: 290, height: 200 }}
          ></Image>

          <TextInput
            style={styles.inputContainer}
            placeholderTextColor="grey"
            autoFocus={true}
            multiline={true}
            numberOfLines={2}
            placeholder="Title"
            onChangeText={onTitleChange}
            value={title}
          ></TextInput>

          <Picker
            selectedValue={category}
            style={isPlaceholder(category) ? styles.placeholder : styles.picker}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
          >
            <Picker.Item color="grey" label="Choose Category..." value="" />
            <Picker.Item
              label="Facture fournisseur"
              value="Factures Fournisseurs"
            />
            <Picker.Item label="Facture client" value="Factures Client" />
            <Picker.Item label="Note de frais" value="Note de frais" />
            <Picker.Item label="Autres" value="Autres" />
          </Picker>

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
    padding: 1,
    // width: widthDP("100%"),
    //height: heightDP("100%"),
    backgroundColor: "#efecf4",
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
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
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

  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: "100%",
    borderColor: "#ccc",
    borderRadius: 2,
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
  textGallery: {
    fontSize: 5,
    color: "#2e64e5",
    justifyContent: "center",
    alignItems: "center",
  },
});
