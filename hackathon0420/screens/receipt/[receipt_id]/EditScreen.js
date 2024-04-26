import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList,Button,TouchableOpacity } from 'react-native';
import { supabase } from '../../../lib/supabase'

const ClickableCircle = ({ letter, color,startingStatus,onToggle }) => {
    const [isActive, setIsActive] = useState(startingStatus);
    const handlePress = () => {
      const newActiveStatus = !isActive; 
      setIsActive(!isActive);
      onToggle();
    };
    return (
      <TouchableOpacity onPress={handlePress} style={[
          styles.circle,
          { backgroundColor: isActive ? color : 'white',
          borderColor: color , }
        ]}>
        <Text style={[
            styles.letter,
            { color: isActive ? 'white' : color }
          ]}>
          {letter}
        </Text>
      </TouchableOpacity>
    );
  };

function checkIfUserConsumed(consumedBy, id) {
    return consumedBy.some(consumption => consumption.userId === id);
}

const ProductItem = ({ productName, price, quantity,consumedBy,users,onToggleProductUser  }) => {
    return (
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>{productName}</Text>
        <Text style={styles.productDetail}>{quantity}</Text>
        <View style={styles.circleGroup}>
        <FlatList
        data={users}
        horizontal={true}
        keyExtractor={user => user.id.toString()}
        renderItem={({ item }) => (
            <ClickableCircle letter={item.letter} color={item.color} startingStatus={checkIfUserConsumed(consumedBy, item.id)}
            onToggle={()=>onToggleProductUser(item.id)}/>
        )}
      />
        </View>
      </View>
    );
  };

// Receipt component
const EditScreen = ({receipt,users}) => {
  const [productConsumption, setProductConsumption] = useState(receipt.products);
const handleToggleConsumption = (productId, userId) => {
  const newProductConsumption = productConsumption.map(product =>
      product.id === productId ? {
          ...product,
          consumedBy: checkIfUserConsumed(product.consumedBy, userId) ?
                product.consumedBy.filter(consume => consume.userId !== userId) // Remove user
                : [...product.consumedBy, { userId, quantity: 1 }] // Add user with a default quantity
        } : product
  );
  setProductConsumption(newProductConsumption);
};
const handleConfirmChanges = async (receiptId) => {
  try {
    const { data, error } = await supabase
      .from('receipts')
      .update({ products: productConsumption })
      .match({ id: receiptId });

    if (error) {
      console.error('Error updating receipt:', error);
    } else {
      console.log('Receipt updated successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error during update:', err);
  }
  console.log('Updated Consumption:',JSON.stringify(productConsumption, null, 2));
};
  return (
    <View style={styles.receiptContainer}>
      <View style={styles.edit}>
        <Button title='Confirm Change?' onPress={() =>handleConfirmChanges(receipt.id)} style={styles.button}/>
      </View>
      <Text style={styles.title}>{receipt.storeName}</Text>
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>商品名</Text>
        <Text style={styles.productDetail}>数</Text>
        <Text style={styles.userPrice}></Text>
        <Text style={styles.circleGroup}></Text>
      </View>
      <FlatList
        data={receipt.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            productName={item.productName}
            price={item.price}
            quantity={item.quantity}
            users={users}
            consumedBy={item.consumedBy}
            onToggleProductUser={userId => handleToggleConsumption(item.id, userId)}
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
      alignSelf: 'center',
    },
    circleGroup: {
      flex:3,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderColor: '#eee',
      alignItems: 'flex-end',
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 50, // Half of the width and height to create a circle
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3, 
        backgroundColor: 'white', 
        marginHorizontal: 10,
      },
      letter: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black', // Initial text color

      }
  });  

export default EditScreen;
