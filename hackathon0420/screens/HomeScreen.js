import { StyleSheet, ScrollView } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { Button } from "react-native";   //ボタンで画面遷移

import ReceiptData from "../components/ReceiptData"

const receipts = [
    {
      storeName: "Supermart",
      memo: "Grocery shopping on 20th April 2020 with A and B.",
      products: [
        {
          id: 1,
          productName: "Milk",
          price: 200,
          quantity: 2
        },
        {
          id: 2,
          productName: "Bread",
          price: 100,
          quantity: 1
        }
      ]
    },
    {
      storeName: "Book Haven",
      memo: " Book shopping on 20th April 2020 with A, B, and C.",
      products: [
        {
          id: 1,
          productName: "Fiction Book",
          price: 1500,
          quantity: 2
        }
      ]
    }
  ];

  const users = [
    {
      id:1,
      letter: "A",
      color: "red",
    },
    {
      id:2,
      letter: "B",
      color: "green",
    },
    {
      id:3,
      letter: "C",
      color: "orange",
    },
    {
      id:4,
      letter: "D",
      color: "pink",
    }
  ];

const HomeScreen = ({ navigation }) => {   //9.HomeScreenの内容、components/EditScreenInfoを参照
  return (
    <ScrollView style={{flex: 1}}>

      {/* home画面の本体 */}
      {receipts.map((receipt) => (
        <View key={receipt.id}>
        <ReceiptData receipt={ receipt } users={users}/>
        </View>
      ))}

      {/* <ReceiptData receipt={receipts[0]}/> */}
      {/* <Header word='Mainscreen' user={users[2]}/> */}
      {/* <MainScreen receipts={receipts}/> */}
      {/* <Header word='Receipt1' user={users[2]}/> */}
      {/* <Receipt receipt={receipts[0]} user={users[2]}/> */}
      {/* <Header word='Receipt1' user={users[2]}/> */}
      {/* <EditScreen receipt={receipts[0]} users={users}/> */}

    </ScrollView>
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

export default HomeScreen;