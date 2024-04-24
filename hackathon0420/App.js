import React from 'react';
import { View,ScrollView } from 'react-native';
import MainScreen from './screens/receipt/MainScreen'; 
import Receipt from './screens/receipt/[receipt_id]/index';
import EditScreen from './screens/receipt/[receipt_id]/EditScreen';
import { Header } from './screens/Header';
function findUserById(userId) {
  return users.find(user => user.id === userId);
}
function findReceiptById(receiptId) {
  return receipts.find(receipt => receipt.id === receiptId);
}
const receipts = [
  {
    id: 1,
    storeName: "Supermart",
    memo: "Grocery shopping on 20th April 2020 with A and B.",
    products: [
      {
        id: 1,
        productName: "Milk",
        price: 200,
        quantity: 2,
        consumedBy: [
          { userId: 1, quantity: 1 },
          { userId: 2, quantity: 1 }
        ]
      },
      {
        id: 2,
        productName: "Bread",
        price: 100,
        quantity: 1,
        consumedBy: [
          { userId: 2, quantity: 1 },
          { userId: 3, quantity: 1 }
        ]
      }
    ]
  },
  {
    id:2,
    storeName: "Book Haven",
    memo: " Book shopping on 20th April 2020 with A, B, and C.",
    products: [
      {
        id: 1,
        productName: "Fiction Book",
        price: 1500,
        quantity: 2,
        consumedBy: [
          { userId: 1, quantity: 1 }
        ]
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
        <Header word='Mainscreen' user={findUserById(3)}/>
        <MainScreen receipts={receipts}/>
        <Header word='Receipt1' user={findUserById(3)}/>
        <Receipt receipt={findReceiptById(1)} user={findUserById(3)}/>
        <Header word='Receipt1' user={findUserById(3)}/>
        <EditScreen receipt={findReceiptById(1)} users={users}/>
      </ScrollView>
    </View>

  );
};
export default App;