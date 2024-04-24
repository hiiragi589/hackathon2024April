import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock data for the purchases
const purchases = [
  { id: 1, item: 'Apples', price: 0.30, quantity: 5 },
  { id: 2, item: 'Bread', price: 1.20, quantity: 2 },
  { id: 3, item: 'Cheese', price: 2.50, quantity: 1 }
];

// Receipt component
const MainScreen = ({receipts}) => {
  // Calculate total cost
  const total = purchases.reduce((sum, purchase) => sum + (purchase.price * purchase.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receipt</Text>
      {purchases.map((purchase) => (
        <View key={purchase.id} style={styles.item}>
          <Text>{purchase.item}</Text>
          <Text>{purchase.quantity} x ${purchase.price.toFixed(2)}</Text>
          <Text>${(purchase.quantity * purchase.price).toFixed(2)}</Text>
        </View>
      ))}
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default MainScreen;
