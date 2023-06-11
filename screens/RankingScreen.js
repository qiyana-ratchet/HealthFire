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
  const [weightRankingData, setWeightRankingData] = useState([]);
  const [timeRankingData, setTimeRankingData] = useState([]);
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
      let weightRanking = [];
      let timeRanking = [];

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
                  weightSum += parseFloat(item.kg) * parseFloat(item.count);
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

        weightRanking.push({
          nickname: userNickname,
          totalWeight: weightSum,
          totalTime: timeSum,
        });

        timeRanking.push({
          nickname: userNickname,
          totalWeight: weightSum,
          totalTime: timeSum,
        });
      }

      weightRanking.sort((a, b) => b.totalWeight - a.totalWeight);
      timeRanking.sort((a, b) => b.totalTime - a.totalTime);

      setWeightRankingData(weightRanking);
      setTimeRankingData(timeRanking);
    };

    fetchRankings();
  }, [navigation]);

  const renderRankingItem = ({ item, index }) => (
    <View style={styles.rankingItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.nickname}>{item.nickname}</Text>
      <Text style={styles.value}>
        {showTotalWeight
          ? `총 볼륨: ${item.totalWeight}kg`
          : `총 소모 칼로리: ${item.totalTime}Kcal`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="볼륨 순으로 보기"
          onPress={() => setShowTotalWeight(true)}
          disabled={showTotalWeight}
        />
        <Button
          title="소모칼로리 순으로 보기"
          onPress={() => setShowTotalWeight(false)}
          disabled={!showTotalWeight}
        />
      </View>
      <View style={styles.rankingContainer}>
        <Text style={styles.rankingHeader}>
          {showTotalWeight ? "총 볼륨 랭킹" : "총 소모 칼로리 랭킹"}
        </Text>
        <FlatList
          data={showTotalWeight ? weightRankingData : timeRankingData}
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3D3D3D",
    marginBottom: 20,
  },
  rankingContainer: {
    marginBottom: 20,
  },
  rankingHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D3D3D",
    marginBottom: 20,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  rank: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D3D3D",
  },
  nickname: {
    flex: 3,
    fontSize: 18,
    color: "#3D3D3D",
  },
  value: {
    flex: 2,
    fontSize: 16,
    color: "#3D3D3D",
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryText: {
    fontSize: 16,
    color: "#3D3D3D",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});

export default RankingScreen;
