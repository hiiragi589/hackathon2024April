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
import { Header_Top } from "../components/Header_Top"; 

const HomeScreen = ({ navigation }) => {   //9.HomeScreenの内容、components/EditScreenInfoを参照
    const [currentuserId,setUser] =useState(1);
    const [users, setUsers] = useState([]);
    const [userserror, setUsersError] = useState(null);
    const [receipts, setReceipts] = useState([]);
    const [receiptserror, setReceiptsError] = useState(null);
    const [isUsersLoading, setIsUsersLoading] = useState(true);
    const [isReceiptsLoading, setIsReceiptsLoading] = useState(true);
    const setNewUser = (newUserID) => {
        console.log(newUserID);
        setSelectedUser(newUserID);
    }

    const fetchUsers = async () => {
        const { data, error } = await supabase
            .from('new_users')
            .select();
        if (error) {
            setUsersError(error);
            setIsUsersLoading(false);
        } else {
            setUsers(data);
            setIsUsersLoading(false);
        }
        };
    const fetchNewReceipts = async () => {
        const { data, error } = await supabase
        .from('new_receipts')
        .select(`
            *,
            new_products (
                id,
                productName,
                price,
                quantity,
                new_shares (
                    userId,
                    productId,
                    quantity
                )
            )
        `);
          
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
          fetchNewReceipts();
          fetchUsers();
          
          return () => {
            // Optional: Any cleanup actions
          };
        }, [])
    );

    useEffect(() => {
    }, [users,receipts]);


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
            <Header_Top word="レシート一覧" users={users} setUser={setUser}/>
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