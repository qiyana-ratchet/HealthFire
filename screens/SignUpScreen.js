import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import "react-native-gesture-handler";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app, auth } from "../FirebaseConfig";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const db = getFirestore();

  const handleSubmit = async () => {
    if (!name) {
      alert("이름을 입력해주세요");
      return;
    }
    if (!nickname) {
      alert("닉네임를 입력해주세요");
      return;
    }
    if (!email) {
      alert("이메일을 입력해주세요");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name, nickname });
      const userData = {
        email: user.email,
        name,
        nickname,
        uid: user.uid,
      };
      await setDoc(doc(db, "users", user.email), userData); // Here's the change
      setIsRegistrationSuccess(true);
      console.log("Registration Successful. Please Login to proceed");
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  if (isRegistrationSuccess) {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 2 }}>
          <View
            style={{
              height: hp(13),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../assets/success.png")}
              style={{
                height: wp(20),
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </View>
          <View
            style={{
              height: hp(7),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#ffffff", fontSize: wp("4%") }}>
              회원가입이 완료되었습니다.
            </Text>
          </View>

          <View style={{ height: hp(20), justifyContent: "center" }}>
            <View>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.5}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{ color: "white", fontSize: wp("4%") }}>
                  로그인 하러가기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/SignUpTitle.png")}
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="이름 입력"
        />
        <TextInput
          style={styles.input}
          onChangeText={setNickname}
          value={nickname}
          placeholder="닉네임 입력"
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          placeholder="이메일 입력해주세요"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="비밀번호를 입력해주세요"
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder="비밀번호 확인"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
    padding: 20,
  },
  logo: {
    width: 240,
    height: 200,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#252525",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    height: 60,
    borderColor: "#c7c7cc",
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 18,
    width: "100%",
  },
  button: {
    backgroundColor: "#fc493e",
    paddingVertical: 20,
    paddingHorizontal: 100,
    alignItems: "center",
    borderRadius: 30,
    marginTop: 20,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SignUpScreen;
