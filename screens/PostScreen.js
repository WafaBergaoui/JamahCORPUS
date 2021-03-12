import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../firebase/firebase";
import * as ImagePicker from "expo-image-picker";

export default PostScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isCheckedByUser, setIsCheckedByUser] = useState(false);

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

  const handlePost = () => {
    addPost(image)
      .then((ref) => {
        setImage(null);
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const addPost = async (localUri) => {
    const remoteUri = await uploadPhotoAsync(localUri, `factures/${idUser()}/${timestamp()}`);

    return new Promise((res, rej) => {
      firestore()
        .collection("test")
        .add({
          idUser: idUser(),
          timestamp: timestamp(),
          title: "",
          text: "",
          isProcessed: isProcessed,
          isCheckedByUser: isCheckedByUser,
          url: remoteUri,
        })
        .then((ref) => {
          res(ref);
        })
        .catch((error) => {
          rej(error);
        });
    });
  };

  const uploadPhotoAsync = async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filename).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  };

  const firestore = () => {
    return firebase.firestore();
  };

  const idUser = () => {
    return (firebase.auth().currentUser || {}).uid;
  };

   const timestamp = () => {
    return Date.now();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="md-exit" size={24} color="#D8D9DB"></Ionicons>
        </TouchableOpacity>
      </View>



      <TouchableOpacity  onPress={pickImage}>
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

   
        <TouchableOpacity
          style={styles.forgotButton}
          onPress= {handlePost}>
            
          <Text style={styles.navButtonText}>
            UPLOAD
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
  },
  inputContainer: {
    margin: 32,
    flexDirection: "row",
  },
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
    backgroundColor: "#A9A9A9"	,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
});
