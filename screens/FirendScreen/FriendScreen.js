import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function FriendScreen({ navigation }) {
  const friendCount = 10;
  const sentRequestCount = 2;
  const receivedRequestCount = 3;

  const handleAddFriend = () => {
    navigation.navigate("AddFriend");
  };
  const handleRequestFriend = () => {
    navigation.navigate("RequestFriend");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>운동 친구</Text>
      <View style={styles.statsContainer}>
        <View style={styles.column}>
          <View style={styles.countContainer}>
            <Text style={styles.statsText}>내 친구</Text>
            <Text style={styles.countText}>{friendCount}명</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <View style={styles.countContainer}>
            <Text style={styles.statsText}>보낸 요청</Text>
            <Text style={styles.countText}>{sentRequestCount}명</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <View style={styles.countContainer}>
            <Text style={styles.statsText}>받은 요청</Text>
            <Text style={styles.countText}>{receivedRequestCount}명</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
          <Image
            source={require("../../assets/addFriendIcon.png")}
            style={styles.addIcon}
          />
          <Text style={styles.addButtonText}>친구 추가</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestFriend}
        >
          <Text style={styles.addButtonText}>친구 요청</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.friendContainer}></View>
        <View style={styles.friendContainer}></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 30,
  },
  addButton: {
    flexDirection: "row",
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fc493e",
    borderRadius: 10,
    height: 55,
    flex: 1,
    borderRadius: 10,
    margin: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    flexDirection: "row",
    width: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252525",
    borderRadius: 10,
    height: 55,
    flex: 1,
    borderRadius: 10,
    margin: 10,
  },

  addIcon: {
    resizeMode: "contain",
    alignSelf: "center",
    marginRight: 10,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 20,
    marginHorizontal: 10,
  },
  column: {
    flex: 1,
  },
  countContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginTop: 20,
    height: "100%",
    width: 1,
    backgroundColor: "#d3d3d3",
  },
  statsText: {
    fontSize: 16,
    margin: 15,
    fontWeight: 300,
  },
  countText: {
    fontSize: 24,
    fontWeight: 700,
  },
  bodyContainer: {
    marginVertical: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
  },
  friendContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#aaaaaa",
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    width: 180,
    height: 200,
    margin: 15,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 15,
  },
});
