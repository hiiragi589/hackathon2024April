import { StyleSheet, Button, FlatList, TouchableOpacity,Alert } from "react-native";
import { useState,useEffect } from "react";
import { Text, View } from "../components/Themed";
import { supabase } from '../lib/supabase'
import { useNavigation } from "@react-navigation/native";
import isEqual from 'lodash/isEqual';

const ClickableCircle = ({ letter, color,startingStatus,onToggle }) => {
  const [isActive, setIsActive] = useState(startingStatus);
  const handlePress = () => {
    setIsActive(!isActive); // Toggle the active state
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
const ProductItem = ({ productName, quantity, consumedBy, users, onToggleProductUser }) => {
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

function checkIfUserConsumed(consumedBy, id) {
  return consumedBy.some(consumption => consumption.userId === id);
}

// Sharescreen component
export default function ShareScreen({ route }) {
  const navigation = useNavigation();
  const {param1, param2} = route.params;
  // Param1=Receipt, Param2=Users
  const [productConsumption, setProductConsumption] = useState(param1.products);
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

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //     console.log('param1.products:', param1.products);
  //     console.log('productConsumption:', productConsumption);
  //     if(!isEqual(param1.products, productConsumption)){
  //     // 画面から離れる前にアラートを表示
  //     e.preventDefault(); // デフォルトの動作をキャンセル

  //       Alert.alert(
  //         '確認',
  //         'データを保存しますか？',
  //         [
  //           {
  //             text: '保存する',
  //             onPress: () => {
  //               // データを保存する処理を実行
  //               // 例: saveData()
  //               // ここでデータベースの更新をお願いします
  //               navigation.dispatch(e.data.action); // ナビゲーションを続行
  //             },
  //           },
  //           {
  //             text: '保存しない',
  //             style: 'cancel',
  //             onPress: () => {
  //               navigation.dispatch(e.data.action); // ナビゲーションを続行
  //             }
  //           },
  //           {
  //             text: 'キャンセル',
  //             style: 'cancel',
  //             onPress: () => e.preventDefault(), // ナビゲーションをキャンセル
  //           },
  //         ],
  //         { cancelable: true }
  //       );
  //     }else{
  //       navigation.dispatch(e.data.action); // ナビゲーションを続行
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation, param1.products, productConsumption]);

  const handleConfirmChanges = async (receiptId) => {
    // Show confirmation dialog
    Alert.alert(
      '更新確認', // Title of the alert
      'このレシートを更新してもよろしいですか？', // Message asking for confirmation
      [
        {
          text: 'いいえ',
          onPress: () => console.log('更新キャンセル'),
          style: 'cancel',
        },
        {
          text: 'はい',
          onPress: async () => {
            console.log('更新実行');
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
            console.log('Updated Consumption:', JSON.stringify(productConsumption, null, 2));
          },
        },
      ],
      { cancelable: true }
    );
  };
  
  return (
    <View style={styles.receiptContainer}>
      <View style={styles.edit}>
        <Button title='Confirm Change?' onPress={() =>handleConfirmChanges(param1.id)} style={styles.button}/>
      </View>
      <Text style={styles.title}>{param1.storeName}</Text>
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>商品名</Text>
        <Text style={styles.productDetail}>数</Text>
        <Text style={styles.circleGroup}></Text>
      </View>
      <FlatList
        data={param1.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            productName={item.productName}
            quantity={item.quantity}
            users={param2}
            consumedBy={item.consumedBy}
            onToggleProductUser={userId => handleToggleConsumption(item.id, userId)}
          />
        )}
      />
    </View>
  );
}

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
