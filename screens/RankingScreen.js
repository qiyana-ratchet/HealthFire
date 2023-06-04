import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  getFirestore,
  addDays,
  startOfDay,
  Timestamp,
} from "firebase/firestore";

import { app, auth } from "../FirebaseConfig";

const RankingScreen = ({ navigation }) => {
  const [rankingData, setRankingData] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const fetchRankings = async () => {
      const db = getFirestore();
      const currentUserEmail = auth.currentUser.email;
      const userDocRef = doc(db, "users", currentUserEmail);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        return [];
      }
      const exerciseColRef = collection(userDocRef, "exercise");
      const exerciseQuerySnapshot = await getDocs(exerciseColRef);

      const today = Timestamp.fromDate(new Date());
      const sevenDaysAgoTimestamp = Timestamp.fromMillis(
        today.toMillis() - 6 * 24 * 60 * 60 * 1000
      );
      const formattedSevenDaysAgo = `${
        sevenDaysAgoTimestamp.toDate().toISOString().split("T")[0]
      }`;

      const exerciseData = exerciseQuerySnapshot.docs
        .map((doc) => {
          const exercise = doc.data();
          const date = doc.id;
          return { exercise, date };
        })
        .filter((data) => {
          const { date } = data;
          return date >= formattedSevenDaysAgo;
        });

      let weightSum = 0;
      let timeSum = 0;

      const result = exerciseData.filter((data) => {
        exerciseResult = data.exercise;
        Object.keys(exerciseResult).forEach((key) => {
          const items = exerciseResult[key];
          if (key <= 7) {
            // 근육 운동
            items.forEach((item) => {
              if (item.done && item.kg) {
                weightSum += parseFloat(item.kg) * parseFloat(item.count);
              }
            });
          } else if (key == 8) {
            // 조깅
            items.forEach((item) => {
              if (item.done && item.time) {
                timeSum += 13 * parseFloat(item.time);
              }
            });
          } else if (key == 9) {
            // 유산소 운동
            items.forEach((item) => {
              if (item.done && item.time) {
                timeSum += 9 * parseFloat(item.time);
              }
            });
          } else if (key == 10) {
            // 유산소 운동
            items.forEach((item) => {
              if (item.done && item.time) {
                timeSum += 4 * parseFloat(item.time);
              }
            });
          }
        });
      });

      setTotalWeight(weightSum);
      setTotalTime(timeSum);
      const userRankingRef = doc(db, "users", currentUserEmail);
      await setDoc(
        userRankingRef,
        { totalTime: timeSum, totalWeight: weightSum },
        { merge: true }
      );
    };

    fetchRankings();
  }, []);

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ranking</Text>
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingHeader}>Overall Ranking</Text>
        <FlatList
          data={rankingData}
          renderItem={renderRankingItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Total Weight: {totalWeight.toFixed(2)} kg
        </Text>
        <Text style={styles.summaryText}>
          Total Kcal: {totalTime.toFixed(2)} Kcal
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  rankingContainer: {
    marginBottom: 20,
  },
  rankingHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  rank: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  nickname: {
    flex: 3,
    fontSize: 16,
  },
  value: {
    flex: 2,
    fontSize: 16,
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
  },
});

export default RankingScreen;
