import React from "react";
import { View,StyleSheet,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";



const DetailsPostsScreen = ({ navigation }) => {
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

      
      </SafeAreaView>
    </View>
  );
};

export default DetailsPostsScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
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

})
