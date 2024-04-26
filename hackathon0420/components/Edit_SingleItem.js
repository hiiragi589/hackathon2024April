import { StyleSheet, Button, ScrollView, FlatList, Pressable, TextInput } from "react-native";
import { useState } from "react";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed"
// import TextArea from "../components/Textarea";

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'

export default function Edit_SingleItem({item, onChange}){
    const [isVisible, setIsVisible] = useState(true);

    const handleDelete = () => {
        setIsVisible(false);
        onChange(true);
    }

    const TextArea = ({default_text}) => {
        const [text, setText] = useState(default_text); // デフォルトのテキストをstateで管理

        const handleChange = (newText) => {
            setText(newText);
            onChange(true);
        }

      
        return (
          <View style={styles.container}>
            <TextInput
              style={styles.textArea}
              multiline={true} // 複数行の入力を許可
              numberOfLines={2} // 表示する行数
              onChangeText={handleChange} // テキストが変更された時にstateを更新
              value={text} // テキストエリアの値をstateと紐づけ
              placeholder="ここに入力してください" // 入力フィールドが空の時に表示されるプレースホルダー
            />
          </View>
        )
    }

    return (
        <View>
            {isVisible && 
            <View style={styles.row}>
                <TextArea default_text={item !== undefined ? item.productName : ""}/>
                <TextArea default_text={item !== undefined ? String(item.quantity) : ""}/>
                <TextArea default_text={item !== undefined ? String(item.price) : ""}/>
                <Pressable onPress={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} style={styles.icon}/>
                </Pressable>
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 8,
    },
    icon: { 
      padding: 15,
      marginTop: 25,
      alignContent: 'center',
    },
    textArea: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    container: {
        padding: 10,
        backgroundColor: '#fff',
        width: '30%',
    },
  });