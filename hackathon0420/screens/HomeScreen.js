import { StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { Button } from "react-native";   //ボタンで画面遷移

import ReciptData from "../components/ReciptData"

export default function HomeScreen({ navigation }) {   //9.HomeScreenの内容、components/EditScreenInfoを参照
    // const jsonFilePath1 = require('../testdata/recipt1.json');
    // const jsonFilePath2 = require('../testdata/recipt2.json');
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Home</Text> */}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {/* <EditScreenInfo path="/screens/HomeScreen.js" /> */}

      <ReciptData/>

      <Button
        title="Add new"
        onPress={() =>
          navigation.navigate("NewReciptScreen")
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
