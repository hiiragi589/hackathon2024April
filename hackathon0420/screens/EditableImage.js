import React, { useState } from 'react';
import { View, Image, Button, StyleSheet, Alert, Text, TextInput } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const EditableImage = ({ route }) => {
  const { image } = route.params || {};
  const [currentImageUri, setCurrentImageUri] = useState(image);
  const [cropParams, setCropParams] = useState({ originX: 0, originY: 0, width: 200, height: 200 });

  const cropImage = async () => {
    try {
      const result = await manipulateAsync(
        currentImageUri,
        [{ crop: cropParams }],
        { compress: 1, format: SaveFormat.JPEG }
      );
      setCurrentImageUri(result.uri);
    } catch (error) {
      Alert.alert("Error", "Failed to crop the image: " + error.message);
    }
  };

  const handleParamChange = (param, value) => {
    setCropParams(prev => ({
      ...prev,
      [param]: Math.max(0, parseInt(value, 10) || 0) // Handle NaN and empty input as zero
    }));
  };

  const handleParamSubmit = (param, value) => {
    handleParamChange(param, value.trim() === '' ? '0' : value);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: currentImageUri }} style={styles.image} resizeMode="contain" />
      <Text>Crop Parameters: X: {cropParams.originX}, Y: {cropParams.originY}, Width: {cropParams.width}, Height: {cropParams.height}</Text>
      <View style={styles.inputContainer}>
        {['originX', 'originY', 'width', 'height'].map((param) => (
          <TextInput
            key={param}
            style={styles.input}
            keyboardType='numeric'
            onChangeText={(value) => handleParamChange(param, value)}
            value={cropParams[param].toString()}
            onSubmitEditing={({ nativeEvent }) => handleParamSubmit(param, nativeEvent.text)}
            returnKeyType="done"
          />
        ))}
      </View>
      <Button title="Crop Image" onPress={cropImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  image: {
    width: 300,
    height: 300
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  input: {
    width: 70,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    textAlign: 'center',
    marginRight: 10
  }
});

export default EditableImage;
