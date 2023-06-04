import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
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
import { app, auth } from "../../FirebaseConfig";

export default function FriendScreen({ navigation }) {
  const [friends, setFriends] = useState([]);
  const [friendCount, setFriendCount] = useState(null);
  const [requestCount, setRequestCount] = useState(null);

  const db = getFirestore();

  const handleAddFriend = () => {
    navigation.navigate("AddFriend");
  };
  const handleRequestFriend = () => {
    navigation.navigate("RequestFriend");
  };

  useEffect(() => {
    const fetchFriends = async () => {
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
      const friendNames = friendDocSnaps.map(
        (friendDocSnap) => friendDocSnap.data().nickname
      );

      setFriends(friendNames);
    };

    const fetchCounts = async () => {
      const currentUser = auth.currentUser.email;
      const userDocRef = doc(db, "users", currentUser);

      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return;
      }

      const friendCount = userDocSnap.data().friend?.length || 0;
      const requestCount = userDocSnap.data().requests?.length || 0;

      setFriendCount(friendCount);
      setRequestCount(requestCount);
    };

    fetchCounts();
    fetchFriends();
  }, [friends]);

  const renderFriend = ({ item }) => {
    if (!item) return <View style={styles.emptyBlock}></View>; // empty block when there's no friend
    return (
      <View style={styles.friendBox}>
        <View style={styles.friendWrapper}>
          <View style={styles.friendContainer}>
            <Text style={styles.nickname}>{item}님</Text>
          </View>
        </View>
      </View>
    );
  };

  let displayFriends = friends;
  if (friends.length % 2 !== 0) {
    displayFriends = [...friends, ""];
  }

  return (
    <FlatList
      style={styles.container}
      data={displayFriends}
      renderItem={renderFriend}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2} // Show 2 friends per line
      ListHeaderComponent={() => (
        <View style={{ paddingBottom: 20 }}>
          <View style={styles.header}>
            <Text style={styles.title}>운동 친구</Text>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.column}>
              <View style={styles.countContainer}>
                <Text style={styles.statsText}>내 친구</Text>
                <Text style={styles.countText}>{friendCount}명</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.column}>
              <View style={styles.countContainer}>
                <Text style={styles.statsText}>받은 요청</Text>
                <Text style={styles.countText}>{requestCount}명</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddFriend}
            >
              <Image
                source={require("../../assets/addFriendIcon.png")}
                style={styles.addIcon}
              />
              <Text style={styles.addButtonText}>친구 추가</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.requestButton}
              onPress={handleRequestFriend}
            >
              <Text style={styles.requestButtonText}>친구 요청</Text>
              {requestCount > 0 && <View style={styles.notificationCircle} />}
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: "#fc493e",
    paddingTop: 80,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  addButton: {
    flexDirection: "row",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc493e",
    borderRadius: 10,
    height: 50,
    flex: 1,
    borderRadius: 10,
    marginRight: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    flexDirection: "row",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
    borderRadius: 10,
    height: 50,
    flex: 1,
    borderRadius: 10,
  },

  addIcon: {
    resizeMode: "contain",
    alignSelf: "center",
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 20,
    marginHorizontal: 10,
  },
  column: {
    flex: 1,
  },
  countContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginTop: 20,
    height: "100%",
    width: 1,
    backgroundColor: "#d3d3d3",
  },
  statsText: {
    fontSize: 16,
    margin: 15,
    fontWeight: 300,
  },
  countText: {
    fontSize: 24,
    fontWeight: 700,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  status: {
    fontSize: 16,
    color: "#888",
    marginTop: 5,
  },
  notificationCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ff0000",
    position: "absolute",
    right: 10,
    top: 10,
  },
  friendWrapper: {
    flex: 1,
    padding: 10,
    marginHorizontal: 11,
  },
  friendContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    justifyContent: "flex-end",
    height: 180,
    padding: 5,
  },

  emptyBlock: {
    backgroundColor: "transparent",
    flex: 1,
    borderRadius: 10,
  },
  friendBox: {
    flex: 1,
  },
});
