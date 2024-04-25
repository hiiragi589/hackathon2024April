import React ,{ useState, useEffect } from 'react';
import { View, Text, StyleSheet,Button,Pressable,FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown'
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV'
import { icon } from '@fortawesome/fontawesome-svg-core';

import Recipt from './[receipt_id]/index'

// Receipt component
const MainScreen = ({receipts}) => {

  const [expanded, setExpanded] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      {receipts.map((receipt) => (
        <View key={receipt.id}>
        <Pressable
        key={receipt.id}
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

          <Pressable onPress={() => handleButtonPress()}>
          <FontAwesomeIcon icon={faEllipsisV} style={styles.icon}/>
          </Pressable>
          </View>
          <Text>{receipt.memo}</Text>
          <Text style={styles.total}>Total: ${receipt.products.reduce((sum, product) => sum + (product.price * product.quantity), 0)}</Text>
        </Pressable>

        {expanded && (
            // <FlatList
            //     data={receipt.products}
            //     keyExtractor={(item) => item.id.toString()}
            //     renderItem={({ item }) => (
            //     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
            //         <Text>{item.productName}</Text>
            //         <Text>{item.quantity}</Text>
            //         <Text>{item.price}</Text>
            //     </View>
            //     )}
            // />
            <ReceiptDetail data={receipt.products}/>
        )}

        </View>
      ))}
    </View>
  );
};

const handleButtonPress = () => {   //アラートの表示,delete押したとき
  Alert.alert(
  'このレシートを消してもよろしいですか？',
  '',
  [
      {
      text: 'はい',
      onPress: () => handleYesPress(),
      },
      {
      text: 'いいえ',
      onPress: () => handleNoPress(),
      style: 'cancel',
      },
  ],
  { cancelable: false }
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    // marginHorizontal: -10,
    width: "99%",
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
