import React from 'react';
import { View, Text, StyleSheet, FlatList,Button } from 'react-native';

<<<<<<< HEAD
const calculatedPrice = (product,id) => {
  const totalPrice  = product.quantity * product.price;
  const totalShare = product.consumedBy.reduce((sum, consumption) => sum + consumption.quantity, 0);
  const userShare  = product.consumedBy.find(consumption => consumption.userId === id)?.quantity || 0;
  const userPrice = totalPrice * userShare / totalShare;
  return parseFloat(userPrice.toFixed(2));
}
const ProductItem = ({ product,user }) => {
    return (
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>{product.productName}</Text>
        <Text style={styles.productDetail}>{product.quantity}</Text>
        <Text style={[styles.userPrice,{color: user.color}]}>{calculatedPrice(product,user.id)}円 </Text>
        <Text style={styles.productPrice}>/ {product.quantity * product.price}円</Text>
=======
const ProductItem = ({ productName, price, quantity,userColor }) => {
    return (
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>{productName}</Text>
        <Text style={styles.productDetail}>{quantity}</Text>
        <Text style={[styles.userPrice,{color: userColor}]}>XX円 </Text>
        <Text style={styles.productPrice}>/ {price}円</Text>
>>>>>>> 58d9f2c (fixed conflict and updated others' change)
      </View>
    );
  };

// Receipt component
const Receipt = ({receipt,user}) => {
  // Calculate total cost
  return (
    <View style={styles.receiptContainer}>
      <View style={styles.edit}>
        <Button title='Edit' style={styles.button}/>
      </View>
      <Text style={styles.title}>{receipt.storeName}</Text>
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>商品名</Text>
        <Text style={styles.productDetail}>数</Text>
        <Text style={styles.userPrice}></Text>
        <Text style={styles.productPrice}>料金</Text>
      </View>
      <FlatList
        data={receipt.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
<<<<<<< HEAD
            product={item}
            user={user}
=======
            productName={item.productName}
            price={item.price}
            quantity={item.quantity}
            userColor={user.color}
>>>>>>> 58d9f2c (fixed conflict and updated others' change)
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    edit: { 
        flexDirection: 'row',
        justifyContent: 'flex-end',
        },
    button: {
        padding: 10,
        borderRadius: 2,
        margin: 16,
        backgroundColor: '#f0f0f0',
        },
    receiptContainer: {
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    productItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: '#eee',
    },
    productDetail: {
      flex:1,
      fontSize: 20,
      color: '#333',
      textAlign: 'center',
    },
    userPrice: {
        flex:2,
          fontSize: 20,
          color: '#333',
          textAlign: 'right',
          fontWeight: 'bold',
    },
    productPrice: {
    flex:1,
      fontSize: 20,
      color: '#333',
      textAlign: 'right',
    },
  });  

export default Receipt;
