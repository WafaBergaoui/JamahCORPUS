import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Block, Text } from "galio-framework";
import { Button, Icon, Input } from "../components";
import { argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
import * as ImagePicker from "expo-image-picker";

import Categories from "../assets/data/categories.json";
import {
  addFacturesFournisseurs,
  addFacturesClient,
  addNotesDeFrais,
  addAutres,
} from "../firebase/firebase.js";

export default PostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [categoryIndex, setcategoryIndex] = useState(1);

  const onTitleChange = (inputText) => {
    setTitle(inputText);
  };

  const onCategoryChange = async (category) => {
    if (category == "Factures Fournisseurs") {
      addFacturesFournisseurs(title, category, subCategory, image);
    } else if (category == "Factures Client") {
      addFacturesClient(title, category, subCategory, image);
    } else if (category == "Note de frais") {
      addNotesDeFrais(title, category, subCategory, image);
    } else if (category == "Autres") {
      addAutres(title, category, subCategory, image);
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
        setSubCategory("");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
    if (!title || !category || !subCategory || !image) {
      return alert("fill all the fields first!");
    }
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <Block safe flex middle>
        <Block style={styles.postContainer}>
          <Block flex>
            <Block flex center>
              <Block middle>
                <Button
                  color="gray"
                  style={styles.createFirstButton}
                  onPress={onChooseImagePress}
                >
                  <Text bold size={18} color={argonTheme.COLORS.WHITE}>
                    Take Photo
                  </Text>
                </Button>
              </Block>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.navButtonText}>Choose From Gallery..</Text>
              </TouchableOpacity>

              <Image
                source={{ uri: image }}
                style={{ width: 290, height: 180, marginTop: 20 }}
              ></Image>

              <Block
                width={width * 0.8}
                style={{ marginBottom: 8, marginTop: 20 }}
              >
                <Input
                  placeholder="title"
                  onChangeText={onTitleChange}
                  value={title}
                  keyboardType="text"
                  iconContent={
                    <Icon
                      size={16}
                      color={argonTheme.COLORS.ICON}
                      name="text"
                      family="ionicon"
                      style={styles.inputIcons}
                    />
                  }
                ></Input>
              </Block>

              <Block width={width * 0.8} style={{ marginBottom: 1 }}>
                <Picker
                  selectedValue={category}
                  placeholder="Choose a category"
                  keyboardType="text"
                  onValueChange={(itemValue, itemIndex) => {
                    setCategory(itemValue);
                    setcategoryIndex(itemIndex);
                  }}
                >
                  {Categories.map((categorie) => {
                    return (
                      <Picker.Item
                        label={categorie.category}
                        value={categorie.category}
                        key={categorie.id}
                      />
                    );
                  })}
                </Picker>
              </Block>

              <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                <Picker
                  selectedValue={subCategory}
                  keyboardType="text"
                  onValueChange={(itemValue) => setSubCategory(itemValue)}
                >
                  {Categories.length > 0 &&
                    Categories[categoryIndex].subCategory.map(
                      (subCategorie) => {
                        return (
                          <Picker.Item
                            label={subCategorie}
                            value={subCategorie}
                            // key={subCategorie}
                          />
                        );
                      }
                    )}
                </Picker>
              </Block>

              <Block middle>
                <Button
                  style={styles.createButton}
                  onPress={handlePost}
                  color="success"
                >
                  <Text bold size={16} color={argonTheme.COLORS.WHITE}>
                    UPLOAD
                  </Text>
                </Button>
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
});
