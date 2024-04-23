import React from 'react';
import { View, Text, StyleSheet,Button,Pressable } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { icon } from '@fortawesome/fontawesome-svg-core';
// Receipt component
const MainScreen = ({receipts}) => {
  return (
    <View style={styles.container}>
      {receipts.map((receipt) => (
        <View key={receipt.id}>
        <Pressable
        key={receipt.id}
        onPress={() => alert(`${receipt.storeName}`)}
        style={({ pressed }) => [
            styles.receipt,
            pressed ? styles.pressed : {}
          ]}
        >
          <View style={styles.title}>
                <Text style={styles.storeName}>{receipt.storeName}</Text>
          <Pressable onPress={() => alert(`Delete ${receipt.storeName}`)}>
          <FontAwesomeIcon icon={faTrash} style={styles.icon}/>
          </Pressable>
          </View>
          <Text>{receipt.memo}</Text>
          <Text style={styles.total}>Total: ${receipt.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}</Text>
        </Pressable>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: -10,
  },
  title: {
    flexDirection: 'row',  // Arrange items in a row
    justifyContent: 'space-between',  // Place space between the items
    alignItems: 'center',  // Center items vertically
  },
  storeName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: { 
    marginTop:-15,
    padding: 10,
  },
  total: {
    marginTop: 20,
    fontSize: 20,
    alignSelf: 'flex-end',
    color: '#666',
  },
  receipt: {
    padding: 10,
    marginHorizontal: 0,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#caf0f8', // Normal state background
  },
  pressed: {
    backgroundColor: '#90e0ef', // Pressed state background
  },
});

export default MainScreen;
