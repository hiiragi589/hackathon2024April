// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme, Alert } from "react-native";
import { HeaderBackButton } from '@react-navigation/stack';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'

import Colors from "../constants/Colors";
import HomeScreen from "../screens/HomeScreen";
import NewReceiptScreen from "../screens/NewReceiptScreen";
import EditScreen from "../screens/EditScreen";
import ShareScreen from "../screens/ShareScreen";
import Popup from "../components/Popup";

const BottomTab = createBottomTabNavigator();   //5.画面下部にタブがある画面

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="home"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}
    >

      <BottomTab.Screen   //6.ホーム画面の内容
        name="Home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            // <TabBarIcon name="ios-code" color={color} />
            <FontAwesomeIcon icon={faHome} />
          ),
        }}
      />
      <BottomTab.Screen
        name="New Receipt"
        component={NewReceiptNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            // <TabBarIcon name="ios-code" color={color} />
            <FontAwesomeIcon icon={faPlus} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

const HomeStack = createStackNavigator();

function HomeNavigator() {   //7.ホーム画面の内容
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}   //8.screens/HomeScreen.jsのHomeScreenの内容をここに表示
        options={{ headerShown: false}}   //ヘッダーなんかねえよ
      />

      <HomeStack.Screen   //HomeScreenの上に重ねる画面はここに記述！
        name="EditScreen"
        component={EditScreen}
        options={{headerTitle: "レシートの編集"}}
      />

      <HomeStack.Screen
        name="Popup"
        component={Popup}
      />

      <HomeStack.Screen   //HomeScreenの上に重ねる画面はここに記述！
        name="ShareScreen"
        component={ShareScreen}
        options={{ headerTitle: "レシートの共有" }}
      />
    </HomeStack.Navigator>
  );
}

const NewReceiptStack = createStackNavigator();

function NewReceiptNavigator() {
  return (
    <NewReceiptStack.Navigator>
      <NewReceiptStack.Screen
        name="NewReceiptScreen"
        component={NewReceiptScreen}
        options={{ headerTitle: "新しいレシートの追加" }}
      />
    </NewReceiptStack.Navigator>
  );
}
