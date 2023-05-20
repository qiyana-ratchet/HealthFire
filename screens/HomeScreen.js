import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { auth } from "../FirebaseConfig";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      {user && (
        <View style={styles.profileContainer}>
          <Image style={styles.profileImage} source={{ uri: user.photoURL }} />
          <Text style={styles.profileText}>{user.displayName}</Text>
        </View>
      )}

      <Text style={styles.title}>오늘의 운동 랭킹</Text>
      <View style={styles.rankingContainer}></View>

      <Text style={styles.title}>운동 일정</Text>
      <View style={styles.scheduleContainer}></View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>헬스파이어</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 50,
  },
  profileContainer: {
    borderWidth: 1,
    borderColor: "#b5b5b5",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 30,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  rankingContainer: {
    borderWidth: 1,
    borderColor: "#b5b5b5",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    alignItems: "center",
    height: 300,
  },
  scheduleContainer: {
    borderWidth: 1,
    borderColor: "#b5b5b5",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    height: 300,
  },
  footerContainer: {
    borderWidth: 0,
    height: 100,
    justifyContent: "center",
  },
  footerText: {
    textAlign: "center",
  },
});

export default HomeScreen;
