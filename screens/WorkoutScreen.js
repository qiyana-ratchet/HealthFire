import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Container, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { firestore, auth } from '../FirebaseConfig'; //이파일에 쓰이는 export된 변수 firestore->우리의 firestore, auth
import { collection, doc, getDoc, setDoc, getCollection, getDocs, updateDoc } from 'firebase/firestore';

// const exercises = [
//   {id: 1, name: '스쿼트'},
//   {id: 2, name: '데드리프트'},
//   {id: 3, name: '런지'},
//   {id: 4, name: '레그익스텐션'},
//   {id: 5, name: '벤치프레스'},
//   {id: 6, name: '덤벨플라이'},
//   {id: 7, name: '딥스'},
//   {id: 8, name: '조깅'},
//   {id: 9, name: '사이클'},
//   {id: 10, name: '플랭크'},
// ];







export default function WorkoutScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [exerciseData, setExerciseData] = useState(null);

  const user = auth.currentUser;
  const email = user ? user.email : '';

  const userCollection = collection(firestore, 'users');
  const userDoc = doc(userCollection, email);

  const [buttonColor, setButtonColor] = useState('#D9D9D9');

  //달력에 기록된 날짜 표시
  const fetchMarkedDates = async () => { // docs를 불러와서 점을 다시 찍어
    try {
      const exerciseCollection = await getDocs(collection(userDoc, 'exercise')); //이 작업이 완료되면
      const dates = {};

      exerciseCollection.forEach((doc) => {
        // console.log(doc.id);
        dates[doc.id] = { marked: true, dotColor: 'red' };
      });

      setMarkedDates(dates);
    } catch (error) {
      console.error("error", error);
    }

  };

  //기록된 날짜 즉각 업데이트
  useEffect(() => { //화면이 바뀌
    // const unsubscribe = navigation.addListener('focus', fetchMarkedDates); //네비게이션 객체에 focus(화면 포커스) 이벤트리스너 추가
    // return unsubscribe; //이전에 등록한 이벤트 리스너 해제??

    navigation.addListener('focus', fetchMarkedDates); //네비게이션 객체에 focus(화면 포커스) 이벤트리스너 추가
    //이전에 등록한 이벤트 리스너 해제??



  }, [navigation]); //화면이 바뀌는것 기준.


  //날짜 선택됐을 때 
  const handleDayPress = async (date) => {
    setSelectedDate(date.dateString); //이게 왜 업데이트가 안되냐?


    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: {...prevMarkedDates[selectedDate], selected: false},
      [date.dateString]: {...prevMarkedDates[date.dateString], selected: true, selectedColor: '#00BD00'},
    }));

    setSelectedDate(date.dateString);


    console.log("A");

    const dateRef = doc(collection(userDoc, 'exercise'), date.dateString); //전에 눌린거
    const dateDoc = await getDoc(dateRef); //실제 해당날짜의 운동 데이터 가져옴.₩

    if (dateDoc.exists()) { //이 레퍼런스가 존재하면

      setExerciseData(dateDoc.data());
      // setKeys(Object.keys(dateDoc.data())); //렌더링에 쓰지마

    } else {
      console.log("D");
      setExerciseData(null); //usereffect로가
    }



  };

  function getKeyText(key) {
    if (key === '1') {
      return '스쿼트';
    } else if (key === '2') {
      return '데드리프트';
    } else if (key === '3') {
      return '런지';
    } else if (key === '4') {
      return '레그익스텐션';
    } else if (key === '5') {
      return '벤치프레스';
    } else if (key === '6') {
      return '덤벨플라이';
    } else if (key === '7') {
      return '딥스';
    } else if (key === '8') {
      return '조깅';
    } else if (key === '9') {
      return '사이클';
    } else if (key === '10') {
      return '플랭크';
    } else {
      return '기타';
    };
  }


  const handleExerciseButtonPress = () => {
    navigation.navigate('WorkoutDetail', {selectedDate: selectedDate}); // 메인 화면으로 이동
    // 운동 선택 페이지로 이동하는 코드
  };

  const handleDoneButtonPress = async (item) => { //몇번째 세트인지
    const newColor = buttonColor === '#FC493E' ? '#D9D9D9' : '#FC493E';

    setButtonColor(newColor);


    const dateRef = doc(collection(userDoc, 'exercise'), selectedDate);
    const updatedExerciseData = { ...exerciseData };

    Object.entries(updatedExerciseData).forEach(([key, value]) => {
      value.forEach((exerciseItem) => { //value는 1,3,5
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
                      <Text style={{ borderWidth: 1, borderColor: '#FC493E', fontSize: 20, color: '#FC493E' }}> {index + 1} </Text>
                      <Text style={{ color: '#FC493E' }}> 세트 </Text>
                    </View>

                    {item.kg && item.count ? (
                      <View style={styles.setContainer} >
                        <Text style={{ backgroundColor: '#D9D9D9', fontSize: 20 }}> {item.kg} </Text>
                        <Text style={{ color: '#797979' }}> kg </Text>

                        <Text style={{ backgroundColor: '#D9D9D9', fontSize: 20 }}> {item.count} </Text>
                        <Text style={{ color: '#797979' }}> 회 </Text>
                      </View>
                    ) : (
                      <View style={styles.setContainer} >
                        <Text style={{ backgroundColor: '#D9D9D9', fontSize: 20 }}> {item.time} </Text>
                        <Text style={{ color: '#797979' }}> 분 </Text>
                      </View>
                    )}



                    {item.done === false ? (
                      <View style={{ flex: 1, flexDirection: 'row-reverse', height: 25 }}>
                        <TouchableOpacity style={styles.doneFalseButton} onPress={() => handleDoneButtonPress(item)}>
                          <Text style={styles.donebuttonText}> ☑️ </Text>
                        </TouchableOpacity>

                        {/* <Text>Done: {item.done.toString()}</Text> */}
                      </View>
                    ) : (
                      <View style={{ flex: 1, flexDirection: 'row-reverse', height: 25 }}>
                        <TouchableOpacity style={styles.doneTrueButton} onPress={() => handleDoneButtonPress(item)}>
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
            {/* <Text>기록이 없습니다.</Text> */}
            <TouchableOpacity style={styles.exerciseButton} onPress={handleExerciseButtonPress} >
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarcontainer: {
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
  exerciseButton: {
    width: 360,
    height: 50,
    marginTop: 0,
    backgroundColor: '#FC493E',
    borderRadius: 10,
    // padding: 10,
    alignItems: 'center',
  },
  exerciseNameContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#FC493E',
    padding: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    color: '#FC493E',
    fontWeight: 'bold',
  },
  excontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 370,
    marginBottom: 60,
    // backgroundColor: '#F7F7F7',
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
    backgroundColor: 'white',
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    lineHeight: 50,
    fontSize: 14,
    fontWeight: 'bold',
  },
  doneFalseButton: {
    // color: '#D9D9D9',
    // backgroundColor: '#D9D9D9',
    height: 25,
    marginRight: 5
  },
  doneTrueButton: {
    // color: '#D9',
    // backgroundColor: '#FC493E',
    height: 25,
    marginRight: 5
  },
  donebuttonText: {
    fontSize: 20,
  }
});



