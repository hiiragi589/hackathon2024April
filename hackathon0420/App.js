import React from 'react';
import { View,ScrollView } from 'react-native';
import MainScreen from './screens/receipt/MainScreen'; 
import Receipt from './screens/receipt/[receipt_id]/index';
import EditScreen from './screens/receipt/[receipt_id]/EditScreen';
import { Header } from './screens/Header';
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
    id:3,
    letter: "D",
    color: "pink",
  }
];
const App = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Header word='Mainscreen' user={users[2]}/>
        <MainScreen receipts={receipts}/>
        <Header word='Receipt1' user={users[2]}/>
        <Receipt receipt={receipts[0]} user={users[2]}/>
        <Header word='Receipt1' user={users[2]}/>
        <EditScreen receipt={receipts[0]} users={users}/>
      </ScrollView>
    </View>

  );
};
export default App;