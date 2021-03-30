import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import SocialButton from "../components/SocialButton";
import firebase from "../firebase/firebase";
import * as GoogleSignIn from "expo-google-sign-in";

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setuser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      initAsync();
    };
  });

  const initAsync = async () => {
    await GoogleSignIn.initAsync({
      clientId:
        "926800474230-m3ei7tmrt4sccmpld9qi3t9hlp28dd5g.apps.googleusercontent.com",
    });
    _syncUserWithStateAsync();
  };

  const signIn = async () => {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      navigation.navigate("Home");
    } catch (err) {
      setError(err.message);
    }
  };

  const _syncUserWithStateAsync = async () => {
    const user = await GoogleSignIn.signInSilentlyAsync();
    setuser(user);
  };

  const signOutAsync = async () => {
    await GoogleSignIn.signOutAsync();
    setuser(null);
  };

  const signInWithGoogleAccount = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        _syncUserWithStateAsync();
      }
    } catch ({ message }) {
      alert("login: Error:" + message);
    }
  };

  const onPressSocialButton = () => {
    if (user) {
      signOutAsync();
    } else {
      signInWithGoogleAccount();
    }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>LOGIN</Text>

        <FormInput
          labelValue={email}
          onChangeText={setEmail}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormInput
          labelValue={password}
          onChangeText={setPassword}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        <FormButton buttonTitle="Sign In" onPress={() => signIn()} />

        <View>
          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => onPressSocialButton()}
          />
        </View>
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.navButtonText}>
            Don't have an acount? Create here
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default SigninScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "cover",
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
});
