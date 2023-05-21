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

    // Move the request to friends
    await updateDoc(userRef, {
      friends: arrayUnion(requestId),
      requests: arrayRemove(requestId),
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
        <Text style={styles.title}>Friend Requests</Text>
        {requests.map((request) => (
          <View key={request} style={styles.requestContainer}>
            <Text style={styles.requestText}>{request}</Text>
            <View>
              <Button title="Accept" onPress={() => handleAccept(request)} />
              <Button title="Reject" onPress={() => handleReject(request)} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fc493e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 80,
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  bodyStyle: {
    flex: 1,
    marginTop: 30,
  },
  closeButtonContainer: {
    alignSelf: "flex-end",
    paddingBottom: 20,
  },
  closeButton: {
    width: 20,
    height: 20,
  },
});

export default AddFriendScreen;
