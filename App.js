import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import FriendScreen from "./screens/FirendScreen/FriendScreen";
import RankingScreen from "./screens/RankingScreen";
import WorkoutScreen from "./screens/WorkoutScreen";
import SignUpScreen from "./screens/SignUpScreen";
import WorkoutDetailScreen from "./screens/WorkoutDetailScreen";
import WorkoutDetailScreen2 from "./screens/WorkoutDetailScreen2";
import AddFriendScreen from "./screens/FirendScreen/AddFriendScreen";
import RequestFriendScreen from "./screens/FirendScreen/FriendRequest";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  // 메인 화면의 탭 네비게이션
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // You can add more cases as you need
          if (route.name === "홈") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "운동 친구") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "랭킹") {
            iconName = focused ? "podium" : "podium-outline";
          } else if (route.name === "운동 기록") {
            iconName = focused ? "fitness" : "fitness-outline";
          }

          // You can return any component that you like here!
          color = focused ? "tomato" : "gray";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="운동 친구"
        component={FriendScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="랭킹"
        component={RankingScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="운동 기록" component={WorkoutScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // 로그인 화면과 메인 화면을 네비게이션으로 연결
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
        <Stack.Screen name="WorkoutDetail2" component={WorkoutDetailScreen2} />
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
