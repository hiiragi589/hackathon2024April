import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

import { StyleSheet } from "react-native";

// JSONファイルの読み込み
const jsonData1 = require('../testdata/recipt1.json'); // ファイルパスは実際のパスに合わせて修正
const jsonData2 = require('../testdata/recipt2.json'); // ファイルパスは実際のパスに合わせて修正

const ExtractData = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false); // ローカルファイルなので即時に読み込み完了とする
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }


  return (
    <View
      style={styles.container}
    >
      {/* Display the JSON data */}
      <FlatList
        data={jsonData1} // Assuming jsonData is an array of objects
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={styles.container}
          >
            <Text style={styles.textbox}>{item.storeName}</Text>
            <Text style={styles.textbox}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container_gray: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#DDDDDD",
    },
    container: {
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
    textbox: {
      fontSize: 20,
      fontWeight: "bold",
    },
  });

export default ExtractData;
