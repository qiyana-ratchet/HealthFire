import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RankingScreen() {
  // 랭킹 화면
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Ranking Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
