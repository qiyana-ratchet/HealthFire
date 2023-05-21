import React, { useState, useEffect } from "react";
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
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { app, auth } from "../../FirebaseConfig";

const AddFriendScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const db = getFirestore();

  const handleSearch = async (text) => {
    setSearch(text);
    const usersCol = collection(db, "users");
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const found = userList.find((user) => user.nickname === text);
    setFoundUser(found);
  };

  const addFriend = async () => {
    if (foundUser) {
      const currentUser = auth.currentUser.email;
      const foundUserDoc = doc(db, "users", foundUser.id);
      await updateDoc(foundUserDoc, {
        requests: arrayUnion(currentUser),
      });
      alert("Friend request sent!");
      setFoundUser(null);
      setSearch("");
    }
  };

  useEffect(() => {
    if (auth.currentUser === null) {
      navigation.navigate("Login"); // Assuming 'Login' is the name of your Login screen
    }
  }, []);

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
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="닉네임을 입력해주세요"
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        {foundUser && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{foundUser.nickname}님</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.addFriendButton}
                onPress={addFriend}
              >
                <Text style={styles.buttonText}>친구 추가</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  searchContainer: {
    flex: 1,
  },
  searchBox: {
    marginHorizontal: 30,
    height: 60,
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#aaaaaa",
    backgroundColor: "#fff",
  },

  resultContainer: {
    flex: 1,
    height: 350,
    marginVertical: 30,
    marginHorizontal: 35,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#aaaaaa",
    justifyContent: "space-between", // 컴포넌트들을 양끝으로 배치
  },
  buttonContainer: {
    marginBottom: 20, // 버튼의 아래 여백
  },
  addFriendButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc493e",
    borderRadius: 10,
    height: 55,
    width: "60%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  resultText: {
    padding: 40,
    textAlign: "center",
    fontSize: 24,
    fontWeight: 700,
  },
});

export default AddFriendScreen;
