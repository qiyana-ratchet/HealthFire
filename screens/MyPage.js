import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";

import { app, auth } from "../FirebaseConfig";

const MyPage = ({ navigation }) => {
  const [calorieData, setCalorieData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);

  useEffect(() => {
    const fetchExerciseData = async () => {
      const db = getFirestore();
      const currentUserEmail = auth.currentUser.email;
      const userDocRef = doc(db, "users", currentUserEmail);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return;
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

      let calorieData = [];
      let volumeData = [];

      exerciseQuerySnapshot.docs.forEach((doc) => {
        const exercise = doc.data();
        const date = doc.id;

        if (date >= formattedSevenDaysAgo) {
          let calorieSum = 0;
          let volumeSum = 0;

          Object.keys(exercise).forEach((key) => {
            const items = exercise[key];

            if (key <= "7") {
              items.forEach((item) => {
                if (item.done && item.kg) {
                  volumeSum += parseFloat(item.kg) * parseFloat(item.count);
                }
              });
            } else if (key === "8") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  calorieSum += 13 * parseFloat(item.time);
                }
              });
            } else if (key === "9") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  calorieSum += 9 * parseFloat(item.time);
                }
              });
            } else if (key === "10") {
              items.forEach((item) => {
                if (item.done && item.time) {
                  calorieSum += 4 * parseFloat(item.time);
                }
              });
            }
          });

          calorieData.push(calorieSum);
          volumeData.push(volumeSum);
        }
      });

      setCalorieData(calorieData);
      setVolumeData(volumeData);
    };

    fetchExerciseData();
  }, [navigation]); // Add an empty dependency array here

  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>총 칼로리 소모량</Text>
        <LineChart
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                data: calorieData,
              },
            ],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#F5F5F5",
            backgroundGradientFrom: "#F5F5F5",
            backgroundGradientTo: "#F5F5F5",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(61, 61, 61, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.graph}
        />
      </View>

      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>총 볼륨량</Text>
        <LineChart
          data={{
            labels: [
              "Day 1",
              "Day 2",
              "Day 3",
              "Day 4",
              "Day 5",
              "Day 6",
              "Day 7",
            ],
            datasets: [
              {
                data: volumeData,
              },
            ],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#F5F5F5",
            backgroundGradientFrom: "#F5F5F5",
            backgroundGradientTo: "#F5F5F5",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(61, 61, 61, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.graph}
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
  graphContainer: {
    marginBottom: 20,
  },
  graphTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D3D3D",
    marginBottom: 10,
  },
  graph: {
    borderRadius: 16,
  },
});

export default MyPage;
