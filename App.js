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
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  // 메인 화면의 탭 네비게이션
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Friends" component={FriendScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Workout" component={WorkoutScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // 로그인 화면과 메인 화면을 네비게이션으로 연결
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
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
