import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

import { app, auth } from "../FirebaseConfig";

const MyPage = ({ navigation }) => {
  const [userName, setUserName] = useState("");
  const [nickname, setNickname] = useState("");
  const [hasExercised, setHasExercised] = useState(false);
  const [exerciseVolumeData, setExerciseVolumeData] = useState({});
  const [exerciseCaloriesData, setExerciseCaloriesData] = useState({});
  const currentUserEmail = auth.currentUser.email;

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const db = getFirestore();
        const userDocRef = doc(db, "users", currentUserEmail);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserName(userDocSnap.data().name);
          setNickname(userDocSnap.data().nickname);

          const exerciseColRef = collection(userDocRef, "exercise");
          const exerciseQuerySnapshot = await getDocs(exerciseColRef);

          let totalVolume = [];
          let totalCalories = [];
          let dates = [];
          const today = new Date(); // 현재 날짜
          const sevenDaysAgo = new Date(
            today.getTime() - 7 * 24 * 60 * 60 * 1000
          );

          for (let i = 6; i >= 0; i--) {
            const currentDate = new Date(
              today.getTime() - i * 24 * 60 * 60 * 1000
            );
            const formattedDate = currentDate.toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
            });
            dates.push(formattedDate);

            let dayVolume = 0;
            let dayCalories = 0;

            exerciseQuerySnapshot.docs.forEach((doc) => {
              const exercise = doc.data();
              const date = new Date(doc.id);

              if (date.getDate() === currentDate.getDate()) {
                Object.keys(exercise).forEach((key) => {
                  const items = exercise[key];
                  if (key <= 7) {
                    items.forEach((item) => {
                      if (item.done && item.kg) {
                        dayVolume +=
                          parseFloat(item.kg) * parseFloat(item.count);
                      }
                    });
                  } else if (key === "8") {
                    items.forEach((item) => {
                      if (item.done && item.time) {
                        dayCalories += 13 * parseFloat(item.time);
                      }
                    });
                  } else if (key === "9") {
                    items.forEach((item) => {
                      if (item.done && item.time) {
                        dayCalories += 9 * parseFloat(item.time);
                      }
                    });
                  } else if (key === "10") {
                    items.forEach((item) => {
                      if (item.done && item.time) {
                        dayCalories += 4 * parseFloat(item.time);
                      }
                    });
                  }
                });
              }
            });
            console.log(dayVolume);
            console.log(dayCalories);

            totalVolume.push(dayVolume);
            totalCalories.push(dayCalories);
          }

          setExerciseVolumeData({
            labels: dates,
            datasets: [
              {
                data: totalVolume,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2, // optional
              },
            ],
          });

          setExerciseCaloriesData({
            labels: dates,
            datasets: [
              {
                data: totalCalories,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2, // optional
              },
            ],
          });

          setHasExercised(
            totalVolume.some((volume) => volume > 0) ||
              totalCalories.some((calories) => calories > 0)
          );
        }
      };

      fetchUserData();
    }, [])
  );

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.nickname}>{nickname}님</Text>
        <Text style={styles.email}>{currentUserEmail}</Text>
        <Text style={styles.name}>{userName}</Text>
        <View style={styles.logoutButton}>
          <Button onPress={handleLogout} title="로그아웃" color="#FFFFFF" />
        </View>
      </View>

      {hasExercised ? (
        <ScrollView>
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>총 볼륨</Text>
            <LineChart
              data={exerciseVolumeData}
              width={300}
              height={200}
              yAxisSuffix="kg"
              yAxisInterval={100}
              chartConfig={chartConfig}
              bezier
              style={styles.graphStyle}
            />
          </View>
          <View style={styles.graphContainer}>
            <Text style={styles.graphTitle}>소모 칼로리</Text>
            <LineChart
              data={exerciseCaloriesData}
              width={300}
              height={200}
              yAxisSuffix="kcal"
              yAxisInterval={100}
              chartConfig={chartConfig}
              bezier
              style={styles.graphStyle}
            />
          </View>
        </ScrollView>
      ) : (
        <View>
          <Text style={styles.noExerciseText}>
            일주일 동안 운동을 하지 않았습니다.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#FFFFFF",
  backgroundGradientTo: "#FFFFFF",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nickname: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  email: {
    fontSize: 16,
    color: "grey",
    marginBottom: 10,
    textAlign: "center",
  },
  name: {
    fontSize: 18,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    fontWeight: "bold",
  },
  graphContainer: {
    marginTop: 25,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  graphStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noExerciseText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 25,
  },
});

export default MyPage;
