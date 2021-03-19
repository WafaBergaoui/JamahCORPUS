import React, { useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
//import { heightDP, widthDP } from "../utils/Dimentions";


import firebase from "../firebase/firebase";

const HomeScreens = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("posts")
      .onSnapshot((querySnapshot) => {
        const posts = [];
        querySnapshot.docs.forEach((doc) => {
          const { title, url } = doc.data();
          posts.push({
            id: doc.id,
            title,
            url,
          });
        });
        setPosts(posts);
      });
  }, []);

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

        <ScrollView>
          {posts.map((user) => {
            return (
              <ListItem
                key={user.id}
                bottomDivider
                onPress={() => {
                  navigation.navigate("Details", {
                    userId: user.id,
                  });
                }}
              >
                <ListItem.Chevron />
                <View style={styles.feedItem}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <ListItem.Content>
                        <ListItem.Title style={styles.name}>
                          {user.title}
                        </ListItem.Title>
                        <View>
                          <Image
                            source={{ uri: user.url }}
                            style={styles.postImage}
                          />
                        </View>
                      </ListItem.Content>
                    </View>
                  </View>
                </View>
              </ListItem>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // width: widthDP("100%"),
   // height: heightDP("100%"),
    backgroundColor: "white",
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
    width: 200,
    height: 300,
    borderRadius: 5,
    marginVertical: 16,
    justifyContent: 'center',
        alignItems: 'center',
  },
});
export default HomeScreens;
