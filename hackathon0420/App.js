import React,{useState,useEffect} from 'react';
import { View,ScrollView,Text,SafeAreaView,StyleSheet } from 'react-native';
import MainScreen from './screens/receipt/MainScreen'; 
import Receipt from './screens/receipt/[receipt_id]/index';
import EditScreen from './screens/receipt/[receipt_id]/EditScreen';
import { Header } from './screens/Header';
import { Loading } from './screens/Loading';
import { supabase } from './lib/supabase'
// const receipts = [
//   {
//     id: 1,
//     storeName: "Supermart",
//     memo: "Grocery shopping on 20th April 2020 with A and B.",
//     products: [
//       {
//         id: 1,
//         productName: "Milk",
//         price: 200,
//         quantity: 2,
//         consumedBy: [
//           { userId: 1, quantity: 1 },
//           { userId: 2, quantity: 1 }
//         ]
//       },
//       {
//         id: 2,
//         productName: "Bread",
//         price: 100,
//         quantity: 1,
//         consumedBy: [
//           { userId: 2, quantity: 1 },
//           { userId: 3, quantity: 1 }
//         ]
//       }
//     ]
//   },
//   {
//     id:2,
//     storeName: "Book Haven",
//     memo: " Book shopping on 20th April 2020 with A, B, and C.",
//     products: [
//       {
//         id: 1,
//         productName: "Fiction Book",
//         price: 1500,
//         quantity: 2,
//         consumedBy: [
//           { userId: 1, quantity: 1 }
//         ]
//       }
//     ]
//   }
// ];
// const users = [
//   {
//     id:1,
//     letter: "A",
//     color: "red",
//   },
//   {
//     id:2,
//     letter: "B",
//     color: "green",
//   },
//   {
//     id:3,
//     letter: "C",
//     color: "orange",
//   },
//   {
//     id:3,
//     letter: "D",
//     color: "pink",
//   }
// ];
const App = () => {
  //mine
  const [users, setUsers] = useState([]);
  const [userserror, setUsersError] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [receiptserror, setReceiptsError] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select();
      if (error) {
        setUsersError(error);
        setIsUsersLoading(false);
      } else {
        setUsers(data);
        setIsUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchReceipts = async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select();
      if (error) {
        setReceiptsError(error);
        setIsReceiptsLoading(false);
      } else {
        setReceipts(data);
        setIsReceiptsLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  useEffect(() => {
    console.log(users,receipts); // This will log every time users or error changes
  }, [users,receipts]);

  function findUserById(userId) {
    return users.find(user => user.id === userId);
  }

    //my change
  // import { useLoadedAssets } from "./hooks/useLoadedAssets";
  // import Navigation from "./navigation";   //navigation/index.jsで定義されている
  // import { useColorScheme } from "react-native";

  // export default function App() {
  //   const isLoadingComplete = useLoadedAssets();
  //   const colorScheme = useColorScheme();

  //   if (!isLoadingComplete) {
  //     return null;
  //   } else {
  //     return (
  //       <SafeAreaProvider>
  //         <Navigation colorScheme={colorScheme} />
  //         <StatusBar />
  //       </SafeAreaProvider>
  //     );
  //   }

  function findReceiptById(receiptId) {
    return receipts.find(receipt => receipt.id === receiptId);
  }

  return (
    <View style={{ flex: 1 }}>
      {isUsersLoading || isReceiptsLoading ? (
        <SafeAreaView style={styles.fullScreen}>
        <Loading word='Fetching data...'/>
      </SafeAreaView>
      ) : (
        <ScrollView>
          <Header word='Mainscreen' user={findUserById(3)} />
          <MainScreen receipts={receipts} />
          <Header word='Receipt1' user={findUserById(3)} />
          <Receipt receipt={findReceiptById(1)} user={findUserById(3)} />
          <Header word='Receipt1' user={findUserById(3)} />
          <EditScreen receipt={findReceiptById(1)} users={users} />
        </ScrollView>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1
  }
});

export default App;