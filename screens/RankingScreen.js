import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";

import { app, auth } from "../FirebaseConfig";

const RankingScreen = ({ navigation }) => {
  const [rankingData, setRankingData] = useState([]);
  const [showTotalWeight, setShowTotalWeight] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      const db = getFirestore();
      const currentUserEmail = auth.currentUser.email;
      const userDocRef = doc(db, "users", currentUserEmail);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        return [];
      }

      const friends = userDocSnap.data().friend || [];
      friends.push(currentUserEmail);
      let ranking = [];

      for (const userEmail of friends) {
        const userRef = doc(db, "users", userEmail);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          continue;
        }

        const exerciseColRef = collection(userRef, "exercise");
        const exerciseQuerySnapshot = await getDocs(exerciseColRef);

        const today = Timestamp.fromDate(new Date());
        const sevenDaysAgoTimestamp = Timestamp.fromMillis(
          today.toMillis() - 6 * 24 * 60 * 60 * 1000
        );
        const formattedSevenDaysAgo = `${
          sevenDaysAgoTimestamp.toDate().toISOString().split("T")[0]
        }`;

        let weightSum = 0;
        let timeSum = 0;

        exerciseQuerySnapshot.docs.forEach((doc) => {
          const exercise = doc.data();
          const date = doc.id;
          if (date < formattedSevenDaysAgo) {
            return;
          }

          Object.keys(exercise).forEach((key) => {
            const items = exercise[key];
            if (key <= 7) {
              items.forEach((item) => {
                if (item.done && item.kg) {
                  weightSum += item.kg * item.count;
                }
              });
            } else if (key === "8") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  timeSum += 13 * parseFloat(item.time);
                }
              });
            } else if (key === "9") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  timeSum += 9 * parseFloat(item.time);
                }
              });
            } else if (key === "10") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  timeSum += 4 * parseFloat(item.time);
                }
              });
            }
          });
        });

        const userNickname = userSnap.data().nickname;
        ranking.push({
          nickname: userNickname,
          totalWeight: weightSum,
          totalTime: timeSum,
        });
      }

      // Sort ranking by total weight and time
      ranking.sort(
        (a, b) => b.totalWeight + b.totalTime - (a.totalWeight + a.totalTime)
      );
      setRankingData(ranking);
    };

    fetchRankings();
  }, [navigation]);

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.value}>
        {showTotalWeight
          ? `Total Weight: ${item.totalWeight}`
          : `Total Time: ${item.totalTime}`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ranking</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Show Weight Ranking"
          onPress={() => setShowTotalWeight(true)}
          disabled={showTotalWeight}
        />
        <Button
          title="Show Time Ranking"
          onPress={() => setShowTotalWeight(false)}
          disabled={!showTotalWeight}
        />
      </View>
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingHeader}>
          {showTotalWeight ? "Weight Ranking" : "Time Ranking"}
        </Text>
        <FlatList
          data={rankingData}
          renderItem={renderRankingItem}
          keyExtractor={(item, index) => index.toString()}
        />
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default RankingScreen;
