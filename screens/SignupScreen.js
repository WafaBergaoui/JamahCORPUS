import React, { useState } from "react";
import {
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Block, Text } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";

const { width, height } = Dimensions.get("screen");
import firebase from "../firebase/firebase";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState("");

  const signUp = async () => {
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
          return firebase
            .firestore()
            .collection("users")
            .doc(cred.user.uid)
            .set({
              email,
            });
        });
      navigation.navigate("Login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Block flex middle>
      <StatusBar hidden />
      <ImageBackground
        source={Images.AuthBackground}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle>
          <Block style={styles.registerContainer}>
            <Block flex>
              <Block flex={0.25} middle>
                <Text color="#00000" size={30}>
                  Inscription
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
                      onChangeText={setEmail}
                      borderless
                      placeholder="E-mail"
                      keyboardType="email-address"
                      autoCapitalize="none"
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

                  <Block width={width * 0.8} style={{ marginBottom: 8 }}>
                    <Input
                      password
                      borderless
                      labelValue={password}
                      onChangeText={setPassword}
                      placeholder="Mot de passe"
                      iconType="lock"
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
                  </Block>

                  <Block width={width * 0.8}>
                    <Input
                      labelValue={confirmPassword}
                      onChangeText={setConfirmPassword}
                      password
                      borderless
                      placeholder="Confirmer votre mot de passe"
                      iconType="lock"
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
                      onPress={() => signUp()}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        S'inscrire
                      </Text>
                    </Button>
                  </Block>
                  <Block middle>
                    <TouchableOpacity
                      style={styles.forgotButton}
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={styles.navButtonText}>
                        Vous avez déjà un compte? S'identifier
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

export default SignupScreen;

const styles = StyleSheet.create({
  registerContainer: {
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
    marginTop: 25,
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
