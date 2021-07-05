import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import argonTheme from "../constants/Theme";
import * as firebase from 'firebase';


class DrawerItem extends React.Component {

  signOut = () => {
    const { navigation} = this.props;
    firebase.auth().signOut().then(() =>{
      navigation.navigate('Login');
    });
};

  renderIcon = () => {
    const { title, focused , navigation} = this.props;

    switch (title) {
      case "Acceuil":
        return (
          <Icon
            name="shop"
            family="ArgonExtra"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Ajouter un nouveau fichier":
        return (
          <Icon
            name="cloud-upload"
            family="ionicon"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.ERROR}
          />
        );
      case "Synthèse":
        return (
          <Icon
            name="calculator"
            family="ionicon"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.PRIMARY}
          />
        );
      case "Rapport":
        return (
          <Icon
            name="analytics"
            family="ionicon"
            size={14}
            color={focused ? "white" : argonTheme.COLORS.WARNING}
          />
        );
      case "Déconnexion":
        return (
          <Icon
            name="ios-log-out"
            family="ionicon"
            size={14}
            color={focused ? "white" : "rgba(0,0,0,0.5)"}   
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <TouchableOpacity
      style={{ height: 60 }}
      onPress={() =>
        title == "Logout"
          ? this.signOut()
          : navigation.navigate(title)
      }
    >        
      <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              size={15}
              bold={focused ? true : false}
              color={focused ? "white" : "rgba(0,0,0,0.5)"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16
  },
  activeStyle: {
    backgroundColor: argonTheme.COLORS.ACTIVE,
    borderRadius: 4
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
