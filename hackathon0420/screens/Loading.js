import * as React from "react";
import { SafeAreaView, StyleSheet, View, Text,ActivityIndicator } from "react-native";

export const Loading = ({word}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{word}||Loading...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 20,
    marginBottom: 20
  }
});