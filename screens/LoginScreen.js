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
} from "react-native";
import { app, auth } from "../FirebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { color } from "react-native-elements/dist/helpers";

export default function LoginScreen({ navigation }) {
  // 로그인 화면
  const [email, setEmail] = useState(""); // 이메일과 비밀번호를 위한 상태 변수
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 로그인 처리
    const auth = getAuth(); // Firebase 인증 객체
    signInWithEmailAndPassword(auth, email, password) // Firebase 로그인 함수
      .then((userCredential) => {
        // 로그인 성공 시
        console.log("Login success");
        // Signed in
        const user = userCredential.user; // 로그인한 사용자 정보
        // ...
        navigation.navigate("Main"); // 메인 화면으로 이동
      })
      .catch((error) => {
        // 로그인 실패 시
        console.log("Login Error");
        const errorCode = error.code; // 에러 코드
        const errorMessage = error.message; // 에러 메시지
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  };

  const handleSignUp = () => {
    // 회원가입 처리
    // const auth = getAuth();
    // createUserWithEmailAndPassword(auth, email, password)  // Firebase 회원가입 함수
    //   .then((userCredential) => {  // 회원가입 성공 시
    //     console.log("Sign-up success");
    //     // Signed in
    //     const user = userCredential.user;  // 회원가입한 사용자 정보
    //     // ...
    //   })
    //   .catch((error) => {  // 회원가입 실패 시
    //     console.log("Sign-up Error");
    //     const errorCode = error.code;  // 에러 코드
    //     const errorMessage = error.message;  // 에러 메시지
    //     console.log(errorCode)
    //     console.log(errorMessage)
    //     // ..
    //   });
    navigation.navigate("SignUp"); // 회원가입 화면으로 이동
  };

  return (
    // 이메일과 비밀번호를 입력받아 로그인하거나 회원가입할 수 있는 화면
    <View style={styles.container}>
      <Image
        source={require("../assets/logowhite.png")}
        style={{ width: 250, height: 100, top: -50, marginTop: 120 }}
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
      <Text style={styles.textRegister}>회원이 아니신가요?</Text>
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
    backgroundColor: "#252525",
  },
  input: {
    width: "80%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#FFFCF2",
  },
  buttonStyle: {
    marginTop: 10,
    width: "80%",
    height: 55,
    borderWidth: 1,
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
  textRegister: {
    marginTop: 100,
    color: "#fff",
  },
});
