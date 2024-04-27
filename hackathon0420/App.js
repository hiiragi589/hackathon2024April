import "react-native-gesture-handler";

/*import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme } from "react-native";*/

import React from 'react';
import CameraScreen from './CameraScreen.tsx';
import EditableImage from "./screens/EditableImage.js";
import {NavigationContainer} from '@react-navigation/native';
import{createStackNavigator} from '@react-navigation/stack';
import{View} from 'react-native';

const Stack = createStackNavigator();



export default class App extends React.Component {
  render() {
    return (
      <View style={{flex:1}}>
      <NavigationContainer>
       <Stack.Navigator initialRouteName="CameraScreen">
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="EditableImage" component={EditableImage} />
      </Stack.Navigator>
      </NavigationContainer>
      </View>
    );
  }
}

/*export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}*/
