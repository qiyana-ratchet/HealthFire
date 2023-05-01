import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import FriendScreen from './screens/FriendScreen';
import RankingScreen from './screens/RankingScreen';
import WorkoutScreen from './screens/WorkoutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {  // 메인 화면의 탭 네비게이션
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Friends" component={FriendScreen} />
        <Tab.Screen name="Ranking" component={RankingScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
      </Tab.Navigator>
  );
}

export default function App() {  // 로그인 화면과 메인 화면을 네비게이션으로 연결
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
