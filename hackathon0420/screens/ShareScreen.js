import { StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View } from "../components/Themed";

// import EditScreen from "./receipt/EditScreen";

export default function ShareScreen({ route }) {
  const {param1, param2} = route.params;
  console.log(route.params);
  console.log(param1);
  console.log(param2);

  const ClickableCircle = ({ letter, color }) => {
    const [isActive, setIsActive] = useState(false);
    const handlePress = () => {
      setIsActive(!isActive); // Toggle the active state
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

  const ProductItem = ({ productName, price, quantity,users }) => {
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
            <ClickableCircle letter={item.letter} color={item.color}/>
        )}
      />
        </View>
      </View>
    );
  };


  return (
    <View style={styles.receiptContainer}>
      <View style={styles.edit}>
        <Button title='Confirm Change?' style={styles.button}/>
      </View>
      <Text style={styles.title}>{param1.storeName}</Text>
      <View style={styles.productItemContainer}>
        <Text style={styles.productDetail}>商品名</Text>
        <Text style={styles.productDetail}>数</Text>
        <Text style={styles.userPrice}></Text>
        <Text style={styles.circleGroup}></Text>
      </View>
      <FlatList
        data={param1.products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <ProductItem
            productName={item.productName}
            price={item.price}
            quantity={item.quantity}
            users={param2}
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
