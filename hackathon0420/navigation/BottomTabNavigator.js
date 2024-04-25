// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import HomeScreen from "../screens/HomeScreen";
import NewReceiptScreen from "../screens/NewReceiptScreen";
import EditScreen from "../screens/EditScreen";
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
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="New Receipt"
        component={NewReceiptNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
        options={{ headerTitle: "Your receipt" }}
      />

      <HomeStack.Screen   //HomeScreenの上に重ねる画面はここに記述！
        name="EditScreen"
        component={EditScreen}
        options={{ headerTitle: "Edit" }}
      />

      <HomeStack.Screen
        name="Popup"
        component={Popup}
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
        options={{ headerTitle: "Add New Receipt" }}
      />
    </NewReceiptStack.Navigator>
  );
}
