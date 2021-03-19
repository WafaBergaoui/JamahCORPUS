import { FontAwesome } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
 View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import firebase from "../firebase/firebase";

export default HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [users, setUsers] = useState([]); // Initial empty array of users

  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = () => {
    const subscriber = firebase
      .firestore()
      .collection("posts")
      .onSnapshot((querySnapshot) => {
        const users = [];

        querySnapshot.forEach((documentSnapshot) => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setUsers(users);
        setLoading(false);
      });

    //Unsubscribe from events when no longer in use
    return () => subscriber();
  };

  const renderPost = (item) => {
    return (
      <View style={styles.feedItem}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.name}>{item.title}</Text>
            </View>
          </View>

          <TouchableOpacity
          
            onPress={() => {
              navigation.navigate("Details", {
                itemId: item.id,
                title: item.title,
                urlImage: item.url ,
                category: item.class,
                date: item.date,
                devise: item.devise,
              });
            }}
          >
            <Image source={{uri: item.url}} style={styles.postImage} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView styles={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: "flex-end", marginRight: 300 }}
            onPress={() => navigation.openDrawer()}
          >
            <FontAwesome name="bars" size={25} color="#161924" />
          </TouchableOpacity>
        </View>

        <FlatList
          style={styles.feed}
          data={users}
          key={(item) => item.id}
          renderItem={({ item }) => renderPost(item)}
      
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

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
  /*headerTitle: {
    fontSize: 20,
    fontWeight: "500",
  },*/
  feed: {
    marginHorizontal: 16,
  },
  feedItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454d65",
  },
  timestamp: {
    fontSize: 11,
    color: "#c4c6ce",
    marginTop: 4,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16,
  },
});
