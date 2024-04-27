import React ,{ useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button,Pressable,FlatList,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';   //画面遷移

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { icon } from '@fortawesome/fontawesome-svg-core';

import Recipt from '../screens/receipt/[receipt_id]/index'
import Popup from './Popup';


const ReceiptData = ({receipt, users,userId}) => {
  const [expanded, setExpanded] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const navigation = useNavigation();

  function findUserById(userId) {
    return users.find(user => user.id === userId);
  }

    const showPopup = () => {
        setIsPopupVisible(true);
    };

    const hidePopup = () => {
      setIsPopupVisible(false);
  };

  const calculatedPriceIndividual = (product,id) => {
    const totalPrice  = product.quantity * product.price;
    const totalShare = product.consumedBy.reduce((sum, consumption) => sum + consumption.quantity, 0);
    const userShare  = product.consumedBy.find(consumption => consumption.userId === id)?.quantity || 0;
    const userPrice = totalPrice * userShare / totalShare;
    return parseFloat(userPrice.toFixed(2));
  }

  const calculatedTotalPriceIndividual = (products, userId) => {
    let totalUserPrice = 0;

    products.forEach(product => {
        const totalPrice = product.quantity * product.price;
        const totalShare = product.consumedBy.reduce((sum, consumption) => sum + consumption.quantity, 0);
        const userShare = product.consumedBy.find(consumption => consumption.userId === userId)?.quantity || 0;
        const userPrice = totalPrice * userShare / totalShare;

        totalUserPrice += userPrice; // Summing up the price share for each product
    });

    return parseFloat(totalUserPrice.toFixed(2)); // Returning the total formatted as a two-decimal float
};

const calculatedTotalPrice = (products, userId) => {
  let totalPrice = 0;

  products.forEach(product => {
      totalPrice += product.quantity * product.price;
  });
  return parseFloat(totalPrice.toFixed(2)); // Returning the total formatted as a two-decimal float
};

    return (
      <View>
        <Pressable
          // key={receipt.id}
          // onPress={() => alert(`${receipt.storeName}`)}   //押したら開いたり閉じたりするように
          style={({ pressed }) => [
              styles.receipt,
              pressed ? styles.pressed : {}
          ]}
        >

          <View style={styles.title}>
            
            <Text style={styles.storeName}>{receipt.storeName}</Text>

            <Pressable onPress={() => setExpanded(!expanded)}>
              {!expanded && (
                <FontAwesomeIcon icon={faAngleDown} style={styles.icon}/>
              )}
              {expanded && (
                <FontAwesomeIcon icon={faAngleUp} style={styles.icon}/>
              )}
            </Pressable>

            <Pressable onPress={() => showPopup()}>
              <FontAwesomeIcon icon={faEllipsisV} style={styles.icon}/>
            </Pressable>

          </View>

          {isPopupVisible && <Popup 
            isVisible={isPopupVisible}
            onClose={() => setIsPopupVisible(false) }
            receipt={ receipt }
            users={users}
            style={{position: 'absolute'}}
          />}
          {/* ...を押したときに画面下から出るポップアップ */}

          <Text>{receipt.memo}</Text>
          <Text style={styles.total}>Total: ${receipt.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}</Text>

        </Pressable>

        {expanded && (
          <View>
            <View style={styles.row}>
              <Text style={styles.cell_title}>商品名</Text>
              <Text style={styles.cell_title}>数量</Text>
              <Text style={styles.cell_title}>一個あたり</Text>
              <Text style={[styles.cell_titleindividual,{color: findUserById(userId).color}]}>{findUserById(userId).letter}さんの払う分</Text>
            </View>
            <FlatList
                data={receipt.products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={styles.row}>
                    <Text style={styles.cell}>{item.productName}</Text>
                    <Text style={styles.cell}>{item.quantity}</Text>
                    <Text style={styles.cell}>{item.price}</Text>
                    <Text style={[styles.cellindividual,{color: findUserById(userId).color}]}>{calculatedPriceIndividual(item,userId)}円</Text>
                </View>
                )}
            />
            <View style={styles.row}>
              <Text style={styles.cell_title}></Text>
              <Text style={styles.cell_title}>全体料金:</Text>
              <Text style={styles.cell_title}>{calculatedTotalPrice(receipt.products,userId)}</Text>
              <Text style={[styles.cell_titleindividual,{color: findUserById(userId).color}]}>{calculatedTotalPriceIndividual(receipt.products,userId)}円</Text>
            </View>
          </View>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    width: '99%',
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    padding: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    margin: 5,
  },
  textbox: {
    fontSize: 18,
    fontWeight: "bold",
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
  title: {
    flexDirection: 'row',  // Arrange items in a row
    justifyContent: 'space-between',  // Place space between the items
    alignItems: 'center',  // Center items vertically
    marginBottom: 10,  // Add some margin at the bottom 
  },
  storeName: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  icon: { 
    marginTop: -10,  /* Increase negative margin to offset the increased padding */
    marginLeft: -15, /* Add negative margin on left if needed */
    marginRight: -5, /* Add negative margin on right if needed */
    padding: 15,     /* Increase padding to make the touch area larger */
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  cell_title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cellindividual: {
    flex: 1,
    textAlign: 'center',
  },
  cell_titleindividual: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ReceiptData;
