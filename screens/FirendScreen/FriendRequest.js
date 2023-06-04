import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app, auth } from "../../FirebaseConfig";

const AddFriendScreen = ({ navigation }) => {
  const db = getFirestore();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const currentUser = auth.currentUser.email;
    const userRef = doc(db, "users", currentUser);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (userData.requests) {
      setRequests(userData.requests);
    }
  };

  const handleAccept = async (requestId) => {
    const currentUser = auth.currentUser.email;
    const userRef = doc(db, "users", currentUser);

    // User who sent the request
    const requestUserRef = doc(db, "users", requestId);

    // Move the request to friends for the current user
    await updateDoc(userRef, {
      friend: arrayUnion(requestId),
      requests: arrayRemove(requestId),
    });

    // Add the current user to the friend list of the user who sent the request
    await updateDoc(requestUserRef, {
      friend: arrayUnion(currentUser),
    });

    // Remove the request from local state
    setRequests(requests.filter((req) => req !== requestId));
  };

  const handleReject = async (requestId) => {
    const currentUser = auth.currentUser.uid;
    const userRef = doc(db, "users", currentUser);

    // Remove the request
    await updateDoc(userRef, {
      requests: arrayRemove(requestId),
    });

    // Remove the request from local state
    setRequests(requests.filter((req) => req !== requestId));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textStyle}>친구 요청</Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButtonContainer}
        >
          <Image
            source={require("../../assets/closeButton.png")}
            style={styles.closeButton}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyStyle}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <View key={request} style={styles.requestContainer}>
              <Text style={styles.requestText}>{request}</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleAccept(request)}
                >
                  <Text style={styles.buttonText}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => handleReject(request)}
                >
                  <Text style={styles.buttonText}>거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>친구 요청이 없습니다</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    backgroundColor: "#fc493e",
    paddingTop: 80,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textStyle: {
    color: "white",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 30,
  },

  closeButtonContainer: {
    marginRight: 30,
    marginTop: 4,
    width: 20,
    height: 20,
  },
  closeButton: {
    flex: 1,
    width: 20,
    height: 20,
  },
  bodyStyle: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  requestContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#34C759", // Green
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: "#FF3B30", // Red
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyMessage: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AddFriendScreen;
