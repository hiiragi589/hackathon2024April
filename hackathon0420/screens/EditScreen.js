import { StyleSheet, Button, ScrollView, FlatList, Pressable, BackHandler, Alert } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { Text, View } from "../components/Themed"
import { useNavigation } from "@react-navigation/native";

import Edit_SingleItem from "../components/Edit_SingleItem";

export default function EditScreen({route}) {
  const {receipt} = route.params;   //レシート情報の受け取り

  const [components, setComponents] = useState([]);   //新しく追加したコンポーネントの管理用
  const [isChanged, setIsChanged] = useState(false);

  console.log(route.params);
  console.log(receipt);

  const navigation = useNavigation();

  const addComponent = () => {   //新しい商品の追加
    const newComponent = <Edit_SingleItem onChange={handleChange}/>;
    setComponents([...components, newComponent]);
    setIsChanged(true);   //変更あり
    console.log(isChanged);
  }

  const handleChange = (changed) => {   //子コンポーネントで変更があった場合呼ばれる
    setIsChanged(changed);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if(isChanged){
      // 画面から離れる前にアラートを表示
      e.preventDefault(); // デフォルトの動作をキャンセル

        Alert.alert(
          '確認',
          'データを保存しますか？',
          [
            {
              text: '保存する',
              onPress: () => {
                // データを保存する処理を実行
                // 例: saveData()
                navigation.dispatch(e.data.action); // ナビゲーションを続行
              },
            },
            {
              text: '保存しない',
              style: 'cancel',
              onPress: () => {
                navigation.dispatch(e.data.action); // ナビゲーションを続行
              }
            },
            {
              text: 'キャンセル',
              style: 'cancel',
              onPress: () => e.preventDefault(), // ナビゲーションをキャンセル
            },
          ],
          { cancelable: true }
        );
      }else{
        navigation.dispatch(e.data.action); // ナビゲーションを続行
      }
    });

    return unsubscribe;
  }, [navigation, isChanged]);
  

  return (   //本体
    <ScrollView style={{flex: 1}}>
      <View style={styles.row}>
        <Text style={styles.cell}>商品名</Text>
        <Text style={styles.cell}>数量</Text>
        <Text style={styles.cell}>価格</Text>
      </View>
      <View>
        <FlatList
          data={receipt.products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Edit_SingleItem item={item} onChange={handleChange} />
          )}
        />
        {components.map(component => component)}
      </View>
    <Button onPress={addComponent} title="add new">
    </Button>
    {/* <HeaderBackButton onPress={handleBackPress} /> */}
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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
});
