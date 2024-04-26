import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';   //画面遷移
import Receipt from '../screens/receipt/[receipt_id]';

const Popup = ({ isVisible, onClose, receipt, users }) => {

  const navigation = useNavigation();

  const params ={param1: receipt, param2: users};

  const handleEdit = () => {
    onClose();
    navigation.navigate("EditScreen", {receipt: receipt}); 
  };

   const handleShare = () => {
    onClose();
    navigation.navigate("ShareScreen", params); 
   };

  const handleDelete = () => {
    Alert.alert(
        '削除確認',
        '本当に削除しますか？',
        [
          {
            text: 'いいえ',
            onPress: () => console.log('削除キャンセル'),
            style: 'cancel',
          },
          {
            text: 'はい',
            onPress: () => {
              console.log('削除実行');
              onClose(); // メニューを閉じる
            },
          },
        ],
        { cancelable: true }
    );
  }

  return (
    <View style={styles.container}>
      <Modal isVisible={isVisible} style={styles.modal} onBackdropPress={onClose}>
        <View style={styles.menu}>
          <TouchableOpacity onPress={() => handleEdit()}>
            <Text style={styles.option}>編集</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete()}>
            <Text style={styles.option}>削除</Text>
          </TouchableOpacity>
          {/* 他のオプションを追加 */}
          <TouchableOpacity onPress={() => handleShare()}>
            <Text style={styles.option}>割り勘設定</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '0%',
  },
  modal: {
    justifyContent: 'flex-end', // 画面下部に表示する
    margin: 0,
  },
  menu: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  option: {
    fontSize: 18,
    paddingVertical: 10,
  },
});

export default Popup;
