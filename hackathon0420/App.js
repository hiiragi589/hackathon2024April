import React,{useState,useEffect} from 'react';
import { View,ScrollView,Text,SafeAreaView,StyleSheet,colorScheme,StatusBar } from 'react-native';
import MainScreen from './screens/receipt/MainScreen'; 
import Receipt from './screens/receipt/[receipt_id]/index';
import EditScreen from './screens/receipt/[receipt_id]/EditScreen';
import { Header } from './screens/Header';
import { Loading } from './screens/Loading';
import { supabase } from './lib/supabase'
import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";   //navigation/index.jsで定義されている
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  //mine
  const [users, setUsers] = useState([]);
  const [userserror, setUsersError] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [receiptserror, setReceiptsError] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);

  useEffect(() => {
    // console.log(users,receipts); // This will log every time users or error changes
  }, [users,receipts]);

  return (
    <View style={{ flex: 1 } }>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
          </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1
  }
});

export default App;
