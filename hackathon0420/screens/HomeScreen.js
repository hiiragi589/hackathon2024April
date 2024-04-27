import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useState, useEffect,useCallback } from "react";
import { useFocusEffect } from "@react-navigation/core";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

import { Button } from "react-native";   //ボタンで画面遷移
import { Loading } from './Loading';
import { supabase } from '../lib/supabase'

import ReceiptData from "../components/ReceiptData"
import {Header} from "../screens/Header"
const HomeScreen = ({ navigation }) => {   //9.HomeScreenの内容、components/EditScreenInfoを参照
    const currentuserId =2;
    const [users, setUsers] = useState([]);
    const [userserror, setUsersError] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [receiptserror, setReceiptsError] = useState(null);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
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

    useFocusEffect(
        useCallback(() => {
          fetchReceipts();  // Fetch data when the screen is focused
          fetchUsers();
          return () => {
            // Optional: Any cleanup actions
          };
        }, [])
    );

    useEffect(() => {
        // console.log(users,receipts); // This will log every time users or error changes
    }, [users,receipts]);

    function findUserById(userId) {
        return users.find(user => user.id === userId);
    }

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
            /* Error が出さないように変更しました*/
            <View style={{flex: 1}}>
            {/* home画面の本体 */}
            <Header word="Home" user={findUserById(currentuserId)} />
            {receipts.map((receipt) => (
                <View key={receipt.id}>
                    <ReceiptData receipt={ receipt } users={users} userId={currentuserId}/>
                </View>
            ))}
            </View>
        )}
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

export default HomeScreen;