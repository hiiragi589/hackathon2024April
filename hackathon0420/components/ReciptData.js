import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';   //画面遷移


// JSONファイルの読み込み
const jsonData1 = require('../testdata/recipt1.json'); // ファイルパスは実際のパスに合わせて修正

const ReciptData = () => {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation();

  // JSONデータを読み込む代わりに、ここでは仮のデータを使用する
  useEffect(() => {
    const jsonData = [
      {
        "storeName": "Supermart",
        "date": "2024/4/21",
        "totalPrice": "¥400",
        "products": [
          {
            "id": 1,
            "productName": "Milk",
            "pricePerPiece": 150,
            "quantity": 2
          },
          {
            "id": 2,
            "productName": "Bread",
            "pricePerPiece": 100,
            "quantity": 1
          }
        ]
      }
    ];
    setData(jsonData);
  }, []);

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

    const handleYesPress = () => {   //deleteを押してはい/いいえを選択
        // 「はい」が選択されたときの処理
        // ここで任意の処理を記述
        console.log('はいが選択されました');
        setModalVisible(false); // ダイアログを閉じる
    };

    const handleNoPress = () => {
        // 「いいえ」が選択されたときの処理
        // ここで任意の処理を記述
        console.log('いいえが選択されました');
        setModalVisible(false); // ダイアログを閉じる
    };

    return (
      <View style={styles.container}>

        <View style={styles.inner_container}>

            <View style={styles.inner_container_left}> 
                <Text style={styles.textbox}>{data[0]?.storeName}</Text>
                <Text style={styles.textbox}>{data[0]?.date}</Text>
                <Text style={styles.textbox}>{data[0]?.totalPrice}</Text>
            </View>

            <View style={styles.inner_container_right}>
                <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                    <Text>delete</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() =>
                    navigation.navigate('EditScreen')}>
                    <Text>edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.button}>
                    <Text>{expanded ? '-' : '+'}</Text>
                </TouchableOpacity>
            </View>

        </View>

        {expanded && (
            <FlatList
                data={data[0]?.products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                    <Text>{item.productName}</Text>
                    <Text>{item.quantity}</Text>
                    <Text>{item.pricePerPiece}</Text>
                </View>
                )}
            />
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
  inner_container: {
    width: '100%',
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inner_container_right: {   //ボタンが出るエリア
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 10,
    padding: 10,
    flexDirection: 'row-reverse',
    // backgroundColor: '#ddd',
  },
  inner_container_left: {   //店名と日付が出るエリア
    flex: 1,
    margin: 10,
    padding: 10,
    flexDirection: 'col',
    alignItems: 'flex-start',
    // backgroundColor: '#ddd',
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
});

export default ReciptData;
