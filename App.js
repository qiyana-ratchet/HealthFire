import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import FriendScreen from "./screens/FirendScreen/FriendScreen";
import RankingScreen from "./screens/RankingScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import SignUpScreen from "./screens/SignUpScreen";
import WorkoutDetailScreen from "./screens/WorkoutDetailScreen";
import WorkoutDetailScreen2 from "./screens/WorkoutDetailScreen2";
import AddFriendScreen from "./screens/FirendScreen/AddFriendScreen";
import RequestFriendScreen from "./screens/FirendScreen/FriendRequest";
import MyPage from "./screens/MyPage.js";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#fc493e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "운동 기록") {
            iconName = focused ? "fitness" : "fitness-outline";
          } else if (route.name === "운동 친구") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "랭킹") {
            iconName = focused ? "podium" : "podium-outline";
          } else if (route.name === "내 정보") {
            iconName = focused ? "person" : "person-outline";
          }

          color = focused ? "tomato" : "gray";
          return <Ionicons name={iconName} size={27} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",

        tabBarStyle: { height: 100, paddingVertical: 10, fontWeight: 700 },
      })}
    >
      <Tab.Screen name="운동 기록" component={WorkoutScreen} />
      <Tab.Screen name="운동 친구" component={FriendScreen} />
      <Tab.Screen name="랭킹" component={RankingScreen} />
      <Tab.Screen name="내 정보" component={MyPage} />
    </Tab.Navigator>
  );
}

export default function App() {
  // 로그인 화면과 메인 화면을 네비게이션으로 연결
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fc493e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitle: " ", // For iOS, this will replace the default 'Back' text
          headerBackTitleVisible: true, // Makes the back button title visible
          headerBackTitleStyle: {
            // style the back title
            color: "#fff",
            fontSize: 16,
          },
          headerLeftContainerStyle: {
            // You can add additional styles to the back button container
            paddingLeft: 10,
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="운동 선택" component={WorkoutDetailScreen} />
        <Stack.Screen name="운동 시간 기록" component={WorkoutDetailScreen2} />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddFriend"
          component={AddFriendScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RequestFriend"
          component={RequestFriendScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
