import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const AddFriendScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
    console.log("Search text: ", text);
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
      <View style={styles.bodyStyle}></View>
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
    color: "#fff",
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
});

export default AddFriendScreen;
