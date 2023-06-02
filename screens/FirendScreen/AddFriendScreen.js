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
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { app, auth } from "../../FirebaseConfig";
import Dialog from "react-native-dialog";

const AddFriendScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [visible, setVisible] = useState(false);
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
    const currentUserEmail = auth.currentUser.email;

    // Get currentUser's document from Firestore
    const currentUserSnapshot = await getDoc(
      doc(db, "users", currentUserEmail)
    );
    const currentUserData = currentUserSnapshot.data();

    if (foundUser) {
      // Check if foundUser's email is in currentUser's friends list
      if (
        currentUserData.friend &&
        currentUserData.friend.includes(foundUser.email)
      ) {
        // Display message here
        alert("이미 친구로 추가되어 있습니다.");
        return;
      }

      const foundUserDoc = doc(db, "users", foundUser.id);
      await updateDoc(foundUserDoc, {
        requests: arrayUnion(currentUserEmail),
      });
      setVisible(true);
      setFoundUser(null);
      setSearch("");
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    // handle the confirm action here
    setVisible(false);
  };

  useEffect(() => {
    if (auth.currentUser === null) {
      navigation.navigate("Login"); // Assuming 'Login' is the name of your Login screen
    }
  }, []);

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
        <Dialog.Container visible={visible}>
          <Dialog.Title>친구 요청</Dialog.Title>
          <Dialog.Description>친구 요청이 전송되었습니다!</Dialog.Description>
          <Dialog.Button label="취소" onPress={handleCancel} />
          <Dialog.Button label="확인" onPress={handleConfirm} />
        </Dialog.Container>
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
  searchContainer: {
    flex: 1,
  },
  searchBox: {
    marginVertical: 30,
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
    backgroundColor: "#fff",
    borderColor: "#fff",
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
    width: "80%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: 700,
  },

  resultText: {
    flex: 1,
    padding: 40,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontWeight: 700,
  },
});

export default AddFriendScreen;
