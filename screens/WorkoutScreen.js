import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function WorkoutScreen({ navigation }) {  // 운동 화면
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    // db에서 데이터 가져와서 markedDates state 업데이트
    // 예시 데이터
    setMarkedDates({
      '2023-05-01': { marked: true, dotColor: 'blue' },
      '2023-05-05': { marked: true, dotColor: 'blue' },
      '2023-05-09': { marked: true, dotColor: 'blue' },
    });
  }, []);

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    // 날짜를 눌렀을때 실행할 코드
  };

  const handleExerciseButtonPress = () => {
    navigation.navigate('WorkoutDetail'); // 메인 화면으로 이동
    // 운동 선택 페이지로 이동하는 코드
  };

  return (
    <View style={styles.container}>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />
      <TouchableOpacity style={styles.exerciseButton} onPress={handleExerciseButtonPress}>
        <Text style={styles.buttonText}>운동 기록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseButton: {
    marginTop: 20,
    backgroundColor: '#FC493E',
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

