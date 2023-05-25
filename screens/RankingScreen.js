import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { app, auth } from "../FirebaseConfig";

export default function RankingScreen({ navigation }) {
  const [volumeRanking, setVolumeRanking] = useState([]);
  const [calorieRanking, setCalorieRanking] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    const fetchRankings = async () => {
      const currentUser = auth.currentUser.email;
      const userDocRef = doc(db, "users", currentUser);

      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return;
      }

      const friendEmails = userDocSnap.data().friend;
      const friendPromises = friendEmails.map((friendEmail) => {
        const friendDocRef = doc(db, "users", friendEmail);
        return getDoc(friendDocRef);
      });

      const friendDocSnaps = await Promise.all(friendPromises);

      const friendData = friendDocSnaps.map((friendDocSnap) => ({
        nickname: friendDocSnap.data().nickname,
        volume: friendDocSnap.data().volume, // This assumes the friends have a 'volume' field in their data
        calories: friendDocSnap.data().calories, // This assumes the friends have a 'calories' field in their data
      }));

      const volumeRanking = [...friendData].sort((a, b) => b.volume - a.volume);
      const calorieRanking = [...friendData].sort(
        (a, b) => b.calories - a.calories
      );

      setVolumeRanking(volumeRanking);
      setCalorieRanking(calorieRanking);
    };

    fetchRankings();
  }, []);

  const renderRanking = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.nickname}</Text>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.volume}>{item.volume}</Text>
      <Text style={styles.calories}>{item.calories}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>운동 랭킹</Text>
      <Text style={styles.subtitle}>볼륨 랭킹</Text>
      <FlatList
        data={volumeRanking}
        renderItem={renderRanking}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text style={styles.subtitle}>칼로리 랭킹</Text>
      <FlatList
        data={calorieRanking}
        renderItem={renderRanking}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    fontSize: 18,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
  },
  volume: {
    fontSize: 16,
    color: "#888",
  },
  calories: {
    fontSize: 16,
    color: "#888",
  },
});
