import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Divider } from "react-native-paper"; // add this import statement
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore, auth } from "../FirebaseConfig";

const windowWidth = Dimensions.get("window").width;

export default function WorkoutScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});
  const [exerciseData, setExerciseData] = useState(null);
  const [totalKg, setTotalKg] = useState(0);
  const [totalKcal, setTotalKcal] = useState(0);
  const [done, setDone] = useState(false);
  const [perc, setPerc] = useState(0);

  const user = auth.currentUser;
  const email = user ? user.email : "";

  const userCollection = collection(firestore, "users");
  const userDoc = doc(userCollection, email);

  const [buttonColor, setButtonColor] = useState("#D9D9D9");

  const fetchMarkedDates = async () => {
    try {
      const exerciseCollection = await getDocs(collection(userDoc, "exercise")); //이 작업이 완료되면
      const dates = {};

      exerciseCollection.forEach((doc) => {
        // console.log(doc.id);
        dates[doc.id] = { marked: true, dotColor: "red" };
      });

      setMarkedDates(dates);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", fetchMarkedDates);
  }, [navigation]);

  //날짜 선택됐을 때
  const handleDayPress = async (date) => {
    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: { ...prevMarkedDates[selectedDate], selected: false },
      [date.dateString]: {
        ...prevMarkedDates[date.dateString],
        selected: true,
        selectedColor: "#fc493e",
      },
    }));

    setSelectedDate(date.dateString);

    const dateRef = doc(collection(userDoc, "exercise"), date.dateString); //전에 눌린거
    const dateDoc = await getDoc(dateRef); //실제 해당날짜의 운동 데이터 가져옴.₩

    if (dateDoc.exists()) {
      setExerciseData(dateDoc.data());
    } else {
      setExerciseData(null); //usereffect로가
    }
  };
  useEffect(() => {
    let totalKg = 0;
    let totalKcal = 0;
    let totalSet = 0;
    let acheiveSet = 0;
    let percentage = 0;

    if (exerciseData) {
      Object.keys(exerciseData).forEach((key) => {
        //key: 1,3,5..
        const items = exerciseData[key];
        if (key <= 7) {
          //근육
          items.forEach((item) => {
            totalSet += 1;
            if (item.done && item.kg) {
              totalKg += parseFloat(item.kg) * parseFloat(item.count);
              acheiveSet += 1;
            }
          });
        } else if (key == 8) {
          //유산소 - 조깅
          items.forEach((item) => {
            totalSet += 1;
            if (item.done && item.time) {
              totalKcal += 13 * parseFloat(item.time);
              acheiveSet += 1;
            }
          });
        } else if (key == 9) {
          //유산소
          items.forEach((item) => {
            totalSet += 1;
            if (item.done && item.time) {
              totalKcal += 9 * parseFloat(item.time);
              acheiveSet += 1;
            }
          });
        } else if (key == 10) {
          //유산소
          items.forEach((item) => {
            totalSet += 1;
            if (item.done && item.time) {
              totalKcal += 4 * parseFloat(item.time);
              acheiveSet += 1;
            }
          });
        }
      });
    }

    percentage = Math.round((acheiveSet / totalSet) * 100);

    setTotalKg(totalKg);
    setTotalKcal(totalKcal);
    setPerc(percentage);
    // // console.log(totalSet);

    // console.log(percentage);
  }, [exerciseData, done]);

  function getKeyText(key) {
    if (key === "1") {
      return "스쿼트";
    } else if (key === "2") {
      return "데드리프트";
    } else if (key === "3") {
      return "런지";
    } else if (key === "4") {
      return "레그익스텐션";
    } else if (key === "5") {
      return "벤치프레스";
    } else if (key === "6") {
      return "덤벨플라이";
    } else if (key === "7") {
      return "딥스";
    } else if (key === "8") {
      return "조깅";
    } else if (key === "9") {
      return "사이클";
    } else if (key === "10") {
      return "플랭크";
    } else {
      return "기타";
    }
  }

  const handleExerciseButtonPress = () => {
    navigation.navigate("운동 선택", { selectedDate: selectedDate }); // 메인 화면으로 이동
  };

  const handleDoneButtonPress = async (item) => {
    const newColor = buttonColor === "#FC493E" ? "#D9D9D9" : "#FC493E";

    setButtonColor(newColor);
    setDone(!done);
    console.log(done);

    const dateRef = doc(collection(userDoc, "exercise"), selectedDate);
    const updatedExerciseData = { ...exerciseData };

    Object.entries(updatedExerciseData).forEach(([key, value]) => {
      value.forEach((exerciseItem) => {
        //value는 1,3,5
        if (exerciseItem === item) {
          // console.log(exerciseItem.done);
          exerciseItem.done = !exerciseItem.done;
        }
      });
    });

    await updateDoc(dateRef, updatedExerciseData);
  };

  return (
    <View style={styles.container}>
      <View>
        <Calendar
          theme={{
            backgroundColor: "#D9D9D9",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "grey",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#fc493e",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#00adf5",
            selectedDotColor: "white",
            arrowColor: "#fc493e",
            monthTextColor: "#fc493e",
            indicatorColor: "blue",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 15,
          }}
          style={styles.calendar}
          markedDates={markedDates} //이거 하나인데?
          onDayPress={handleDayPress}
        />
      </View>

      <ScrollView contentContainerStyle={styles.excontainer}>
        {exerciseData ? (
          <View style={styles.totalcontainer}>
            <View style={styles.total}>
              <Text style={styles.title}>총볼륨</Text>
              <Text style={styles.contents}>{totalKg}</Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.title}>소모칼로리</Text>
              <Text style={styles.contents}>{totalKcal}</Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.title}>달성률</Text>
              <Text style={styles.contents}>{perc}%</Text>
            </View>
          </View>
        ) : (
          <Text></Text>
        )}

        {exerciseData ? (
          Object.keys(exerciseData).map((key) => (
            <View key={key} style={styles.exerciseContainer}>
              <View style={styles.exerciseNameContainer}>
                <Text style={styles.exerciseName}>{getKeyText(key)}</Text>
              </View>
              <View>
                {exerciseData[key].map((item, index) => (
                  <View style={styles.setContainer} key={index}>
                    <View style={styles.setContainer}>
                      <Text
                        style={{
                          borderWidth: 1,
                          borderColor: "#FC493E",
                          fontSize: 20,
                          color: "#FC493E",
                        }}
                      >
                        {" "}
                        {index + 1}{" "}
                      </Text>
                      <Text style={{ color: "#FC493E" }}> 세트 </Text>
                    </View>

                    {item.kg && item.count ? (
                      <View style={styles.setContainer}>
                        <Text
                          style={{ backgroundColor: "#D9D9D9", fontSize: 20 }}
                        >
                          {" "}
                          {item.kg}{" "}
                        </Text>
                        <Text style={{ color: "#797979" }}> kg </Text>

                        <Text
                          style={{ backgroundColor: "#D9D9D9", fontSize: 20 }}
                        >
                          {" "}
                          {item.count}{" "}
                        </Text>
                        <Text style={{ color: "#797979" }}> 회 </Text>
                      </View>
                    ) : (
                      <View style={styles.setContainer}>
                        <Text
                          style={{ backgroundColor: "#D9D9D9", fontSize: 20 }}
                        >
                          {" "}
                          {item.time}{" "}
                        </Text>
                        <Text style={{ color: "#797979" }}> 분 </Text>
                      </View>
                    )}

                    {item.done === false ? (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row-reverse",
                          height: 25,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.doneFalseButton}
                          onPress={() => handleDoneButtonPress(item)}
                        >
                          <Text style={styles.donebuttonText}> ☑️ </Text>
                        </TouchableOpacity>

                        {/* <Text>Done: {item.done.toString()}</Text> */}
                      </View>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row-reverse",
                          height: 25,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.doneTrueButton}
                          onPress={() => handleDoneButtonPress(item)}
                        >
                          <Text style={styles.donebuttonText}> ✅ </Text>
                        </TouchableOpacity>

                        {/* <Text>Done: {item.done.toString()}</Text> */}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.exerciseButton}
              onPress={handleExerciseButtonPress}
            >
              <Text style={styles.buttonText}>운동 기록하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    width: windowWidth,
    borderRadius: 1,
    alignSelf: "center",
    paddingVertical: 30,
  },
  headerText: {
    color: "red",
  },
  totalcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  total: {
    backgroundColor: "#FC493E",
    borderRadius: 50,
    padding: 10,
    width: windowWidth / 3.5,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontWeight: "bold",
  },
  contents: {
    color: "white",
    fontWeight: "bold",
  },
  exerciseButton: {
    width: windowWidth - 70,
    height: 50,
    marginTop: 0,
    backgroundColor: "#FC493E",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseNameContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#FC493E",
    padding: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: "#FC493E",
    fontWeight: "bold",
  },
  excontainer: {
    alignItems: "center",
    justifyContent: "center",
    width: windowWidth,
    padding: 20,
  },
  exerciseContainer: {
    borderRadius: 10,
    borderColor: "#FC493E",
    borderWidth: 1,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "white",
  },
  setContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  doneButton: {
    marginLeft: "auto",
    height: 25,
  },
  donebuttonText: {
    fontSize: 20,
  },
});
