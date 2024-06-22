import * as React from "react";
import { SafeAreaView, StyleSheet, View, Text, Pressable } from "react-native";
import { useState } from "react";

import Popup_Users from "./Popup_User";

export const Header_Top = ({word, users,setUser}) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selecteduser, setSelectedUser] = useState(1);

    const showPopup = () => {
        setIsPopupVisible(true);
    };

    const hidePopup = (id) => {
        setIsPopupVisible(false);
        setSelectedUser(id);
        setUser(id);
    }

    function findUserById(userId) {
        return users.find(user => user.id === userId);
    }

    console.log(selecteduser);

  return (   //ユーザーを選択
    <View style={styles.container}>
      <Text style={styles.textStyle}>{word || 'Invalid'}</Text>
      <Pressable style={[styles.circleStyle, { backgroundColor: findUserById(selecteduser).color }]} onPress={showPopup}>
        <Text style={styles.letterStyle}>{findUserById(selecteduser).letter||''}</Text>
      </Pressable>
      
      {isPopupVisible &&
      <View>
        <Popup_Users isVisible={isPopupVisible} onClose={hidePopup} users={users} id={selecteduser} style={{position: "absolute"}}/>
      </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0077b6",
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 10,  // Add some padding on both sides
  },
  textStyle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    flex: 1,
  },
  circleStyle: {
    width: 50,   // Set the width of the circle
    height: 50,  // Set the height of the circle
    borderRadius: 25,  // Make it round
    justifyContent: 'center',  // Center the letter vertically
    alignItems: 'center',      // Center the letter horizontally
  },
  letterStyle: {
    color: "white",  // You can change this depending on your color choice
    fontSize: 24,    // Adjust size as needed
    fontWeight: "bold"
  }
});

export default Header_Top;