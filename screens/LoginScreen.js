import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
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
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="로그인" onPress={handleLogin} />
      <Button title="회원가입" onPress={handleSignUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
