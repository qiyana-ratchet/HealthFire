import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Button,
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
  const [selectedRanking, setSelectedRanking] = useState("volume");
  const [friendCount, setFriendCount] = useState(null);
  const [requestCount, setRequestCount] = useState(null);

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

      const friendCount = userDocSnap.data().friend?.length || 0;
      const requestCount = userDocSnap.data().requests?.length || 0;

      setFriendCount(friendCount);
      setRequestCount(requestCount);
    };

    fetchRankings();
  }, []);

  const selectRanking = (rankingType) => {
    setSelectedRanking(rankingType);
  };

  const renderRanking = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>{index + 1}등</Text>
      <Text style={styles.name}>{item.nickname}</Text>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>운동 랭킹</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={
            selectedRanking === "volume" ? styles.buttonSelected : styles.button
          }
          onPress={() => selectRanking("volume")}
        >
          <Text style={styles.buttonText}>총 볼륨순 랭킹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedRanking === "calories"
              ? styles.buttonSelected
              : styles.button
          }
          onPress={() => selectRanking("calories")}
        >
          <Text style={styles.buttonText}>총 칼로리 소모 랭킹</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={Header}
      style={styles.container}
      data={selectedRanking === "volume" ? volumeRanking : calorieRanking}
      renderItem={renderRanking}
      keyExtractor={(item, index) => index.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    backgroundColor: "#fc493e",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 80,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginTop: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#D3D3D3",
  },
  buttonSelected: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fc493e",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  listContainer: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flex: 1,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    textAlign: "center",
    marginVertical: 8,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  name: {
    fontSize: 20,
  },
  rank: {
    fontSize: 20,
  },
  volume: {
    fontSize: 20,
  },
  calories: {
    fontSize: 20,
  },
});
