import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
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
        .createUserWithEmailAndPassword(email, password);
      navigation.navigate("Signin");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>REGISTER</Text>

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

        <FormInput
          labelValue={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        <FormButton buttonTitle="Sign Up" onPress={() => signUp()} />

        <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
          <Text style={styles.navButtonText}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fafd",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: "#051d5f",
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2e64e5",
  },
});
