import * as React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";

export const Header = ({word,user}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{word || 'Invalid'}</Text>
      <View style={[styles.circleStyle, { backgroundColor: user?.color || 'black' }]}>
        <Text style={styles.letterStyle}>{user?.letter||''}</Text>
      </View>
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