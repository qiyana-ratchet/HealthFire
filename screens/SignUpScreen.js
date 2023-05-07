import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Toast,
} from "react-native";
import { app, auth } from "../FirebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          updateProfile(auth.currentUser, { displayName: name, nickname });
          Alert.alert("회원가입 성공");
          setName("");
          setNickname("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigation.navigate("Login"); // 회원가입 화면으로 이동
        })
        .catch((err) => {
          console.log("err.message:", err.message);
        });
    } else {
      Alert.alert(
        "비밀번호 오류",
        "비밀번호와 비밀번호 확인 값이 일치하지 않습니다."
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="이름 입력"
      />
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        onChangeText={setNickname}
        value={nickname}
        placeholder="닉네임 입력"
      />
      <Text style={styles.label}>이메일</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        placeholder="이메일 입력"
      />
      <Text style={styles.label}>비밀번호</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="비밀번호 입력"
      />
      <Text style={styles.label}>비밀번호 확인</Text>
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        placeholder="비밀번호 확인 입력"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>다음 단계</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
    color: "#222",
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderColor: "#c7c7cc",
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  checkbox: {
    alignSelf: "flex-start",
    marginBottom: 20,
    marginLeft: 0,
    paddingLeft: 0,
    backgroundColor: "#ffffff",
    borderWidth: 0,
  },
  button: {
    backgroundColor: "#1877F2",
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default SignUpScreen;
