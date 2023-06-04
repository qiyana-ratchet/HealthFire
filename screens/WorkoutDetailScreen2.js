import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { firestore, auth } from '../FirebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

const exercises = [
  { id: 1, name: '스쿼트', valueType: 'count' },
  { id: 2, name: '데드리프트', valueType: 'count' },
  { id: 3, name: '런지', valueType: 'count' },
  { id: 4, name: '레그익스텐션', valueType: 'count' },
  { id: 5, name: '벤치프레스', valueType: 'count' },
  { id: 6, name: '덤벨플라이', valueType: 'count' },
  { id: 7, name: '딥스', valueType: 'count' },
  { id: 8, name: '조깅', valueType: 'time' },
  { id: 9, name: '사이클', valueType: 'time' },
  { id: 10, name: '플랭크', valueType: 'time' },
];

export default function WorkoutDetailScreen2({ route, navigation }) {
  const { selectedDate, selectedExercises } = route.params;

  const [sets, setSets] = useState({});

  const handleComplete = async () => {
    const user = auth.currentUser;
    const email = user ? user.email : '';
    const workoutData = {};

    selectedExercises.forEach(exerciseId => {
      const exercise = exercises.find(exercise => exercise.id === exerciseId);
      const exerciseSets = sets[exerciseId] || [];

      const setData = exerciseSets.map(set => {
        const { valueType } = exercise;
        let setData = {};

        if (valueType === 'count') {
          setData = { count: set.count, kg: set.kg, done: false };
        } else if (valueType === 'time') {
          setData = { time: set.time, done: false };
        }

        return setData;
      });

      workoutData[exerciseId] = setData;
    });

    // 수정된 부분 시작
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    // const formattedDate = `${year}-${month}-${day}`;
    const formattedDate = selectedDate;
    // 수정된 부분 끝

    try {
      const userCollection = collection(firestore, 'users');
      const userDoc = doc(userCollection, email);
      const exerciseCollection = collection(userDoc, 'exercise');
      // 수정된 부분 시작
      const exerciseDoc = doc(exerciseCollection, formattedDate);
      // 수정된 부분 끝
      await setDoc(exerciseDoc, workoutData);
      console.log('Workout data saved successfully.');
    } catch (error) {
      console.error('Error saving workout data:', error);
    }

    navigation.navigate('Main');
  };

  const handleAddSet = (exerciseId) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId]
        ? [...prevSets[exerciseId], { count: '', kg: '', time: '' }]
        : [{ count: '', kg: '', time: '' }],
    }));
  };

  const handleSetValueChange = (exerciseId, setIndex, valueName, value) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, index) => {
        if (index === setIndex) {
          return { ...set, [valueName]: value };
        }
        return set;
      }),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>운동 기록</Text>
      </View>

      <ScrollView>
        {selectedExercises.map(exerciseId => {
          const exercise = exercises.find(exercise => exercise.id === exerciseId);
          const exerciseSets = sets[exerciseId] || [];

          return (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <TouchableOpacity
                  style={styles.addSetButton}
                  onPress={() => handleAddSet(exerciseId)}
                >
                  <Text style={styles.addSetButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              {exerciseSets.map((set, setIndex) => (
                <View key={setIndex} style={styles.setContainer}>
                  <Text style={styles.setNumber}>Set {setIndex + 1} :</Text>
                  <View style={styles.setInputContainer}>
                    {exercise.valueType === 'count' && (
                      <>
                        <TextInput
                          style={styles.setTextInput}
                          value={set.count}
                          onChangeText={text =>
                            handleSetValueChange(exerciseId, setIndex, 'count', text)
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.setInputLabel}>세트</Text>
                        <TextInput
                          style={styles.setTextInput}
                          value={set.kg}
                          onChangeText={text =>
                            handleSetValueChange(exerciseId, setIndex, 'kg', text)
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.setInputLabel}>kg</Text>
                      </>
                    )}
                    {exercise.valueType === 'time' && (
                      <>
                        <TextInput
                          style={styles.setTextInput}
                          value={set.time}
                          onChangeText={text =>
                            handleSetValueChange(exerciseId, setIndex, 'time', text)
                          }
                          keyboardType="numeric"
                        />
                        <Text style={styles.setInputLabel}>분</Text>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#fc493e",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: 80,
    width: '100%',
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  exerciseContainer: {
    marginBottom: 16,
    marginTop: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  addSetButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    width: 32,
    height: 32,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSetButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setNumber: {
    fontSize: 16,
    marginRight: 8,
    marginLeft: 16,
  },
  setInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  setTextInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 8,
    height: 40,
    marginRight: 8,
    marginLeft: 8,
  },
  setInputLabel: {
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#fc493e',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    marginBottom: 46,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
