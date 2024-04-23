// Learn more about createBottomTabNavigator:
// https://reactnavigation.org/docs/bottom-tab-navigator
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useColorScheme } from "react-native";

import Colors from "../constants/Colors";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import HomeScreen from "../screens/HomeScreen";
import NewReciptScreen from "../screens/NewReciptScreen";
import EditScreen from "../screens/EditScreen";

const BottomTab = createBottomTabNavigator();   //5.画面下部にタブがある画面

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
      {/* <BottomTab.Screen
        name="TabOne"
        component={TabOneNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
          ),
        }}
      /> */}

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
        name="New Recipt"
        component={NewReciptNavigator}
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

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
// const TabOneStack = createStackNavigator();

// function TabOneNavigator() {
//   return (
//     <TabOneStack.Navigator>
//       <TabOneStack.Screen
//         name="TabOneScreen"
//         component={TabOneScreen}
//         options={{ headerTitle: "Tab One Title" }}
//       />
//     </TabOneStack.Navigator>
//   );
// }

// const TabTwoStack = createStackNavigator();

// function TabTwoNavigator() {
//   return (
//     <TabTwoStack.Navigator>
//       <TabTwoStack.Screen
//         name="TabTwoScreen"
//         component={TabTwoScreen}
//         options={{ headerTitle: "Tab Two Title" }}
//       />
//     </TabTwoStack.Navigator>
//   );
// }

const HomeStack = createStackNavigator();

function HomeNavigator() {   //7.ホーム画面の内容
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}   //8.screens/HomeScreen.jsのHomeScreenの内容をここに表示
        options={{ headerTitle: "Your recipt" }}
      />

      <HomeStack.Screen   //HomeScreenの上に重ねる画面はここに記述！
        name="EditScreen"
        component={EditScreen}
        options={{ headerTitle: "Edit" }}
      />
    </HomeStack.Navigator>
  );
}const NewReciptStack = createStackNavigator();

function NewReciptNavigator() {
  return (
    <NewReciptStack.Navigator>
      <NewReciptStack.Screen
        name="NewReciptScreen"
        component={NewReciptScreen}
        options={{ headerTitle: "Add New Recipt" }}
      />
    </NewReciptStack.Navigator>
  );
}
