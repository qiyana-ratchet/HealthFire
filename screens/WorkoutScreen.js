
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Container,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { firestore, auth } from "../FirebaseConfig"; //이파일에 쓰이는 export된 변수 firestore->우리의 firestore, auth
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getCollection,
  getDocs,
} from "firebase/firestore";


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
  const [done, setDone] = useState(false);

  //달력에 기록된 날짜 표시
  const fetchMarkedDates = async () => {
    // docs를 불러와서 점을 다시 찍어
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

  //기록된 날짜 즉각 업데이트
  useEffect(() => {
    //화면이 바뀌
    // const unsubscribe = navigation.addListener('focus', fetchMarkedDates); //네비게이션 객체에 focus(화면 포커스) 이벤트리스너 추가
    // return unsubscribe; //이전에 등록한 이벤트 리스너 해제??

    navigation.addListener("focus", fetchMarkedDates); //네비게이션 객체에 focus(화면 포커스) 이벤트리스너 추가
    //이전에 등록한 이벤트 리스너 해제??
  }, [navigation]); //화면이 바뀌는것 기준.

  //날짜 선택됐을 때
  const handleDayPress = async (date) => {


    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: { ...prevMarkedDates[selectedDate], selected: false },
      [date.dateString]: { ...prevMarkedDates[date.dateString], selected: true, selectedColor: '#00BD00' },
    }));

    setSelectedDate(date.dateString);


    const dateRef = doc(collection(userDoc, 'exercise'), date.dateString); //전에 눌린거
    const dateDoc = await getDoc(dateRef); //실제 해당날짜의 운동 데이터 가져옴.
    if (dateDoc.exists()) {
      //이 레퍼런스가 존재하면

      setExerciseData(dateDoc.data());
      // setKeys(Object.keys(dateDoc.data())); //렌더링에 쓰지마.
      setSelectedDate(date.dateString);
    } else {
      setExerciseData(null); //usereffect로가
    }
  };

  // const countTotalVol = () => {
  //   console.log(exerciseData[1]);
  //   // exerciseData.forEach(([key, value]) => {
  //   //   value.forEach((exerciseItem) => { //value는 1,3,5
  //   //     if (exerciseItem.done) {
  //   //       // console.log(exerciseItem.done);
  //   //       console.log(exerciseItem.kg);
  //   //     }
  //   //   });
  //   // });
  // };

  useEffect(() => {
    let totalKg = 0;
    let totalKcal = 0;
    let totalSet = 0;
    let acheiveSet = 0;
    let percentage = 0;

    if (exerciseData) {
      Object.keys(exerciseData).forEach((key) => { //key: 1,3,5..
        const items = exerciseData[key];
        totalSet += 1;
        if (key <= 7) { //근육 
          items.forEach((item) => {
            if (item.done && item.kg) {
              totalKg += parseFloat(item.kg) * parseFloat(item.count);
              acheiveSet += 1;
            }
          });
        } else if (key == 8) { //유산소 - 조깅
          items.forEach((item) => {
            if (item.done && item.time) {
              totalKcal += 13 * parseFloat(item.time);
              acheiveSet += 1;
            }
          });
        } else if (key == 9) { //유산소 
          items.forEach((item) => {
            if (item.done && item.time) {
              totalKcal += 9 * parseFloat(item.time);
              acheiveSet += 1;
            }
          });
        } else if (key == 10) { //유산소
          items.forEach((item) => {
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

  //이 값이 바뀌면 렌더링을 다시해?
  // useEffect(() => {

  //   async function dd(){
  //     const dateRef = doc(collection(userDoc, 'exercise'), selectedDate); //전에 눌린거
  //     const dateDoc = await getDoc(dateRef); //실제 해당날짜의 운동 데이터 가져옴.

  //     if(dateDoc.exists()){
  //       setExerciseData(dateDoc.data());
  //     }

  //   }

  //   dd();

  //   console.log("set 직후 exerciseData:", exerciseData);
  //   console.log("set 직후 keys:", keys);

  // },[selectedDate]);

  // useEffect(()=>{

  //   if(exerciseData){
  //     setExerciseData(exerciseData);
  //   }

  //   console.log("set 후 exerciseData:", exerciseData);
  //   console.log("set 직후 keys:", keys);

  // },[exerciseData]);

  // useEffect(()=> {
  //   if(keys) {

  //   }
  // }, [keys]);

  //리렌더링 되면서 그전의 값이 왜 계속되냐
  //선택날짜 동기화
  // useEffect(() => {
  //   console.log("-----------------------------------------");
  //   console.log("운동 날짜 : ", selectedDate);
  //   console.log("운동 데이터 : " , exerciseData);
  //   console.log("운동 종류 : ",keys);
  //   console.log("B");

  //   if (selectedDate && exerciseData && keys) {
  //     try{
  //       console.log("C");
  //       console.log("운동 날짜 : ", selectedDate);
  //       console.log("운동 데이터 : " , exerciseData); //안바뀜
  //       console.log("운동 종류 : ",keys); //안바뀜
  //     }catch{
  //       console.log("error", error);
  //     }
  //   }

  //   console.log("\n\n");

  // },[selectedDate, keys, exerciseData]);

  //useEffect : 시작될때 반드시 한번 실행된다.
  //운동날짜에 ''이게 null인가? false래.
  //set할때마다 userEffect로 바로 가는게 맞는듯.

  // useEffect(() => {
  //   console.log("exerciseData",exerciseData); //바뀐 후
  // }, [exerciseData]);

  // useEffect(() => {

  // }, []);

  const handleExerciseButtonPress = () => {
    navigation.navigate('WorkoutDetail', { selectedDate: selectedDate }); // 메인 화면으로 이동
    // 운동 선택 페이지로 이동하는 코드
  };

  const handleDoneButtonPress = async (item) => { //몇번째 세트인지
    const newColor = buttonColor === '#FC493E' ? '#D9D9D9' : '#FC493E';

    setButtonColor(newColor);
    setDone(!done);
    console.log(done);


    const dateRef = doc(collection(userDoc, 'exercise'), selectedDate);
    const updatedExerciseData = { ...exerciseData };

    Object.entries(updatedExerciseData).forEach(([key, value]) => {
      value.forEach((exerciseItem) => { //value는 1,3,5
        if (exerciseItem === item) {
          // console.log(exerciseItem.done);
          exerciseItem.done = !exerciseItem.done;

    item.done = !item.done;
        }
      });
    });

    await updateDoc(dateRef, updatedExerciseData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarcontainer}>
        <Calendar
          theme={{
            backgroundColor: '#D9D9D9',
            calendarBackground: '#ffffff',
            textSectionTitleColor: 'grey',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: 'red',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: 'red',
            arrowColor: 'red',
            monthTextColor: 'red',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 15,
          }}

          style={styles.calendar}
          markedDates={markedDates} //이거 하나인데?
          onDayPress={handleDayPress} />
      </View>


      {/* <Text>Selected Date: {selectedDate} </Text> */}

      {/* <View>
      {exerciseData ? (
        <Text> exerciseData: {exerciseData[1].map((item, index) => (
          <View key={index}>
            <Text>Count: {item.count}</Text>
            <Text>Done: {item.done.toString()}</Text>
            <Text>Kg: {item.kg}</Text>
          </View>
        ))} </Text>
      ): (
        <Text> 데이터가 없습니다 </Text>
      )}

      {keys ? (
        <Text> keys: {keys} </Text>
      ): (
        <Text> 키들이 없습니다 </Text>
      )}
      </View> */}

      {/* <Text>exercise Data: {exerciseData} </Text> */}
      {/* <Text>Keys: {keys} </Text> */}
      {/* <Text>markedDates: {markedDates} </Text> */}
      <View>
        {exerciseData ? (
          <View style={styles.totalcontainer}>
            <View style={styles.total}>
              <Text style={styles.title}>총볼륨</Text>
              <Text style={styles.contents}>{totalKg}</Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.title}>총칼로리</Text>
              <Text style={styles.contents}>{totalKcal}</Text>
            </View>

            <View style={styles.total}>
              <Text style={styles.title}>달성률</Text>
              <Text style={styles.contents}>{perc}%</Text>
            </View>
          </View>
        ): (
          <Text></Text>
        )}
      </View>



      <ScrollView contentContainerStyle={styles.excontainer}>
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
                          <Text style={styles.donebuttonText}> ✅ </Text>
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
                          <Text style={styles.donebuttonText}> ☑️ </Text>
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
            <Text>기록이 없습니다.</Text>
            <TouchableOpacity
              style={styles.exerciseButton}
              onPress={handleExerciseButtonPress}
            >
              <Text style={styles.buttonText}>운동 기록하기!!!</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    width: 360,
    margin: 10,
    borderRadius: 1,
    alignSelf: 'center',
    borderRadius: 20,
  },
  headerText: {
    color: 'red',
  },
  totalcontainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'black'
  },
  total: {
    backgroundColor: '#FC493E',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 50,
    width: 70,
    height: 50,
    marginBottom:5,
  },
  title: {
    padding: 5,
    textAlign: 'center'
  },
  contents: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  exerciseButton: {
    width: 360,
    height: 50,
    marginTop: 20,
    backgroundColor: "#FC493E",
    borderRadius: 10,
    // padding: 10,
    alignItems: "center",
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
    width: 370,
    paddingBottom: 20,
    borderColor: "#FC493E",
    // margin: 10,
  },
  exerciseContainer: {
    borderRadius: 10,
    borderColor: '#FC493E',
    borderWidth: '1',
    width: 360,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  setContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: "white",
    lineHeight: 50,
    fontSize: 14,
    fontWeight: "bold",
  },
  doneFalseButton: {
    // color: '#D9D9D9',
    // backgroundColor: '#D9D9D9',
    height: 25,
    marginRight: 5,
  },
  doneTrueButton: {
    // color: '#D9',
    // backgroundColor: '#FC493E',
    height: 25,
    marginRight: 5,
  },
  donebuttonText: {
    fontSize: 20,
  },
});
