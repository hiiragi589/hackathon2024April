import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';   //画面遷移
import Receipt from '../screens/receipt/[receipt_id]';

const Popup = ({ isVisible, onClose, users, id }) => {

  const handleChange = (id) => {
    onClose(id);
  };

  const ColoredCircle = ({color}) => {
    return (
      <View style={[styles.circle, {backgroundColor: color}]}></View>
    );
  };

  function findUserById(userId) {
    return users.find(user => user.id === userId);
  }

  console.log("test");

  return (
    <View style={styles.container}>
      <Modal isVisible={isVisible} style={styles.modal} onBackdropPress={() => onClose(id)}>
        <View style={styles.menu}>
          <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleChange(item.id)}>
                    <View style={styles.row}>
                        <ColoredCircle color={item.color}/>
                        <Text style={styles.cell}>{item.letter}</Text>
                    </View>
                </TouchableOpacity>
                )}
            />
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
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15, // width, heightの半分を指定することで円形になる
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-right',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
    },

});

export default Popup;
