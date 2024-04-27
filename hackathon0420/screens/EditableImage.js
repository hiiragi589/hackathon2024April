import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, Alert, Text, TextInput, ScrollView } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const EditableImage = ({ route }) => {
  const { image } = route.params || {};
  const [currentImageUri, setCurrentImageUri] = useState(image);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cropParams, setCropParams] = useState({ originX: 0, originY: 0, width: 100, height: 100 });
  const [inputValues, setInputValues] = useState({ originX: '0', originY: '0', width: '100', height: '100' });

  useEffect(() => {
    Image.getSize(image, (width, height) => {
      setDimensions({ width, height });
      setCropParams({ originX: 0, originY: 0, width, height });
      setInputValues({ originX: '0', originY: '0', width: width.toString(), height: height.toString() });
    }, error => {
      Alert.alert("Error", "Cannot get the image size: " + error.message);
    });
  }, [image]);

  const handleInput = (param, value) => {
    const intValue = value.trim() === '' ? 0 : parseInt(value, 10);  // Treat empty input as zero
    if (!isNaN(intValue)) {
      setInputValues(prev => ({
        ...prev,
        [param]: value,
      }));
      setCropParams(prev => ({
        ...prev,
        [param]: Math.max(0, intValue),  // Prevent negative values
      }));
    } else {
      Alert.alert("Error", "Please enter a valid number.");
    }
  };

  const cropImage = async () => {
    try {
      if (
        cropParams.originX >= 0 &&
        cropParams.originY >= 0 &&
        cropParams.width > 0 && // 横幅が正の値であることを確認
        cropParams.height > 0 && // 高さが正の値であることを確認
        cropParams.originX + cropParams.width <= dimensions.width &&
        cropParams.originY + cropParams.height <= dimensions.height
      ) {
        const result = await manipulateAsync(
          currentImageUri,
          [{ crop: cropParams }],
          { compress: 1, format: SaveFormat.JPEG }
        );
        setCurrentImageUri(result.uri);
        // Reset input values after cropping
        setInputValues({ originX: '0', originY: '0', width: dimensions.width.toString(), height: dimensions.height.toString() });
      } else {
        Alert.alert("Error", "Invalid crop options: Please make sure the requested crop rectangle is inside the source image and has positive width and height.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to crop the image: " + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Image source={{ uri: currentImageUri }} style={styles.image} resizeMode="contain" />
        <View style={styles.coordinateContainer}>
          <Text style={styles.coordinateLabel}>左上: X: 0, Y: 0</Text>
          <Text style={styles.coordinateLabel}>左下: X: 0, Y: {dimensions.height}</Text>
          <Text style={styles.coordinateLabel}>右上: X: {dimensions.width}, Y: 0</Text>
          <Text style={styles.coordinateLabel}>右下: X: {dimensions.width}, Y: {dimensions.height}</Text>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Origin X:</Text>
            <TextInput style={styles.input} keyboardType='numeric' 
                       onChangeText={(text) => handleInput('originX', text)} value={inputValues.originX} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Origin Y:</Text>
            <TextInput style={styles.input} keyboardType='numeric' 
                       onChangeText={(text) => handleInput('originY', text)} value={inputValues.originY} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Width:</Text>
            <TextInput style={styles.input} keyboardType='numeric' 
                       onChangeText={(text) => handleInput('width', text)} value={inputValues.width} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Height:</Text>
            <TextInput style={styles.input} keyboardType='numeric' 
                       onChangeText={(text) => handleInput('height', text)} value={inputValues.height} />
          </View>
          <Button title="Crop Image" onPress={cropImage} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },
  coordinateContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  coordinateLabel: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 4,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 80,
    marginRight: 10,
    textAlign: 'right',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'white',
  },
});

export default EditableImage;
