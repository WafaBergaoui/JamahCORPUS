import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { Block, Text } from "galio-framework";
import firebase from "../firebase/firebase";
import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
import * as GoogleSignIn from "expo-google-sign-in";

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setuser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      initAsync();
      registerForPushNotificationsAsync();
    };
  });

  const initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId:
        "926800474230-m3ei7tmrt4sccmpld9qi3t9hlp28dd5g.apps.googleusercontent.com",
    });
    _syncUserWithStateAsync();
  };

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    let uid = firebase.auth().currentUser.uid;
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .update({
        expoPushToken: token,
      });

    console.log("************************************" + token);
    return token;
  };
  const signIn = async () => {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      navigation.navigate("App");
    } catch (err) {
      setError(err.message);
    }
  };

  const _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    setuser(user);
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.AuthBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle>
          <Block style={styles.loginContainer}>
            <Block flex>
              <Block flex={0.25} middle>
                <Text color="#00000" size={30}>
                  Connexion
                </Text>
              </Block>
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.8} style={{ marginBottom: 8 }}>
                    <Input
                      labelValue={email}
                      borderless
                      placeholder="E-mail"
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="ic_mail_24px"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      labelValue={password}
                      password
                      borderless
                      placeholder="Mot de passe"
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="padlock-unlocked"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                    {error ? (
                      <Text style={{ color: "red" }}>{error}</Text>
                    ) : null}
                  </Block>
                  <Block middle>
                    <Button
                      color="primary"
                      style={styles.createButton}
                      onPress={() => signIn()}
                    >
                      <Text bold size={16} color={argonTheme.COLORS.WHITE}>
                        Se connecter
                      </Text>
                    </Button>
                  </Block>
                  <Block middle>
                    <TouchableOpacity
                      style={styles.forgotButton}
                      onPress={() => navigation.navigate("Register")}
                    >
                      <Text style={styles.navButtonText}>
                        Vous n'avez pas de compte ? Créer ici
                      </Text>
                    </TouchableOpacity>
                  </Block>
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </ImageBackground>
    </Block>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  loginContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
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
    marginTop: 26,
  },
  forgotButton: {
    marginVertical: 10,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F6982",
  },
});
