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

const ReceiptData = ({receipt}) => {
  const [expanded, setExpanded] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  
  const navigation = useNavigation();

    const showPopup = () => {
        setIsPopupVisible(true);
    };

    const hidePopup = () => {
      setIsPopupVisible(false);
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

          {isPopupVisible && <Popup isVisible={isPopupVisible} onClose={() => setIsPopupVisible(false)} style={{position: 'absolute'}}/>}
          {/* ...を押したときに画面下から出るポップアップ */}

          <Text>{receipt.memo}</Text>
          <Text style={styles.total}>Total: ${receipt.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}</Text>

        </Pressable>

        {expanded && (
          <View>
            <View style={styles.row}>
              <Text style={styles.cell_title}>商品名</Text>
              <Text style={styles.cell_title}>数量</Text>
              <Text style={styles.cell_title}>価格</Text>
            </View>
            <FlatList
                data={receipt.products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={styles.row}>
                    <Text style={styles.cell}>{item.productName}</Text>
                    <Text style={styles.cell}>{item.quantity}</Text>
                    <Text style={styles.cell}>{item.price}</Text>
                </View>
                )}
            />
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
});

export default ReceiptData;
