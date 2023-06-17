import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { app, auth } from "../FirebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginScreen({ navigation }) {
  // 로그인 화면
  const [email, setEmail] = useState(""); // 이메일과 비밀번호를 위한 상태 변수
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    const auth = getAuth(); // Firebase 인증 객체
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login success");
        const user = userCredential.user;
        setEmail("");
        setPassword("");
        navigation.navigate("Main");
      })
      .catch((error) => {
        Alert.alert(
          "로그인 실패",
          "아이디 또는 비밀번호가 잘못됐습니다. 다시 시도해주세요!",
          [{ text: "확인", onPress: () => console.log("!") }],
          { cancelable: false }
        );
      });
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp"); // 회원가입 화면으로 이동
  };

  return (
    // 이메일과 비밀번호를 입력받아 로그인하거나 회원가입할 수 있는 화면
    <View style={styles.container}>
      <Image
        source={require("../assets/Logo.png")}
        style={{ width: 250, height: 55, top: -50, marginTop: 120 }}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호(최소 6자리)"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.buttonStyle} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <View style={styles.lineLeft}></View>
        <Text style={styles.textRegister}>회원이 아니신가요?</Text>
        <View style={styles.lineRight}></View>
      </View>
      <TouchableOpacity
        style={styles.registerButtonStyle}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  input: {
    width: "80%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  buttonStyle: {
    marginTop: 10,
    width: "80%",
    height: 55,
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FC493E",
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonStyle: {
    marginTop: 20,
    backgroundColor: "black",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    height: 55,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFEFE",
    textAlign: "center",
    fontWeight: 700,
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 100,
  },
  lineLeft: {
    flex: 1,
    height: 1,
    backgroundColor: "#d7d7d7",
    marginLeft: 60,
  },
  lineRight: {
    flex: 1,
    height: 1,
    backgroundColor: "#d7d7d7",
    marginRight: 60,
  },
  textRegister: {
    color: "#747474",
    marginHorizontal: 10,
  },
});
