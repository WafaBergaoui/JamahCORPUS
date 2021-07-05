import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { ListItem } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { Block, Text, theme } from "galio-framework";
import { argonTheme } from "../constants";
import PropTypes from "prop-types";
const { width } = Dimensions.get("screen");

import firebase from "../firebase/firebase";

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [postsCategory, setPostsCategory] = useState([]);
  const { style, ctaColor, imageStyle } = props;

  const imageStyles = [styles.horizontalImage, imageStyle];
  const cardContainer = [styles.card, styles.shadow, style];
  const imgContainer = [
    styles.imageContainer,
    styles.horizontalStyles,
    styles.shadow,
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    firebase
      .firestore()
      .collection("posts")
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const posts = [];
        querySnapshot.docs.forEach((doc) => {
          const { title, category, url } = doc.data();
          posts.push({
            id: doc.id,
            title,
            category,
            url,
          });
        });
        setPosts(posts);
      });
  };

  const getDataCategory = (category) => {
    firebase
      .firestore()
      .collection("posts")
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .where("category", "==", category)
      .onSnapshot((querySnapshot) => {
        const postsCategory = [];
        querySnapshot.docs.forEach((doc) => {
          const { title, category, url } = doc.data();
          postsCategory.push({
            id: doc.id,
            title,
            category,
            url,
          });
        });
        setPostsCategory(postsCategory);
      });
  };

  const goDetails = (category, user) => {
    if (category == "Factures Fournisseurs") {
      navigation.navigate("DetailsFacture", {
        userId: user,
      });
    } else if (category == "Factures Client") {
      navigation.navigate("DetailsFacture", {
        userId: user,
      });
    } else if (category == "Note de frais") {
      navigation.navigate("DetailsNotedeFrai", {
        userId: user,
      });
    } else if (category == "Autres") {
      navigation.navigate("DetailsNotedeFrai", {
        userId: user,
      });
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {posts.map((post) => {
        if (post.id != 0) {
          return (
            <ListItem key={post.id} bottomDivider>
              <Block row="horizontal" card flex style={cardContainer}>
                <Block flex style={imgContainer}>
                  <Image source={{ uri: post.url }} style={imageStyles} />
                </Block>
                <TouchableWithoutFeedback>
                  <Block flex space="between" style={styles.cardDescription}>
                    <Text size={14} style={styles.cardTitle}>
                      {post.title}
                    </Text>
                    <Text
                      size={12}
                      muted={!ctaColor}
                      onPress={() => {
                        goDetails(post.category, post.id);
                      }}
                      color={ctaColor || argonTheme.COLORS.ACTIVE}
                      bold
                    >
                      View details
                    </Text>
                  </Block>
                </TouchableWithoutFeedback>
              </Block>
            </ListItem>
          );
        }
      })}
    </ScrollView>
  );
};

HomeScreen.propTypes = {
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  feed: {
    marginHorizontal: 16,
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899",
  },
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 5,
    marginTop: 5,
  },
  cardTitle: {
    flex: 1,
    flexWrap: "wrap",
    paddingBottom: 6,
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2,
  },
  imageContainer: {
    borderRadius: 3,
    elevation: 1,
    overflow: "hidden",
  },
  image: {
    borderRadius: 3,
    marginHorizontal: theme.SIZES.BASE / 2,
    marginTop: -16,
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  horizontalImage: {
    height: 122,
    width: "auto",
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 6,
  },
});
export default HomeScreen;
