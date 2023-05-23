import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {firestore, auth} from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const exercises = [
  {id: 1, name: '스쿼트'},
  {id: 2, name: '데드리프트'},
  {id: 3, name: '런지'},
  {id: 4, name: '레그익스텐션'},
  {id: 5, name: '벤치프레스'},
  {id: 6, name: '덤벨플라이'},
  {id: 7, name: '딥스'},
  {id: 8, name: '조깅'},
  {id: 9, name: '사이클'},
  {id: 10, name: '플랭크'},
];

export default function WorkoutDetailScreen2({route, navigation}) {
  const {selectedExercises} = route.params;

  const [sets, setSets] = useState({});

  const handleComplete = async () => {
    // Firestore에 운동 데이터를 저장
    const user = auth.currentUser;
    const email = user ? user.email : ''; // Firestore에 저장할 사용자 이메일
    const workoutData = sets;
    try {
      await firestore.collection('users').doc(email).collection('exercise').doc('20230524').set({"4": [{"count": "12", "interval": "5"}]}
      )
      // await firestore.collection('users').doc(email).collection('exercise').doc('20230524').set(workoutData);
      console.log('Workout data saved successfully.');
    } catch (error) {
      console.log("sets: ",sets)
      console.error('Error saving workout data:', error);
    }

    // WorkoutDetailScreen2 화면을 종료
    navigation.navigate('Main');
  };

  const handleAddSet = (exerciseId) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId]
        ? [...prevSets[exerciseId], {count: '', interval: ''}]
        : [{count: '', interval: ''}],
    }));
  };

  const handleSetCountChange = (exerciseId, setIndex, count) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, index) => {
        if (index === setIndex) {
          return {...set, count};
        }
        return set;
      }),
    }));
  };

  const handleSetIntervalChange = (exerciseId, setIndex, interval) => {
    setSets(prevSets => ({
      ...prevSets,
      [exerciseId]: prevSets[exerciseId].map((set, index) => {
        if (index === setIndex) {
          return {...set, interval};
        }
        return set;
      }),
    }));
  };

  return (
    <View style={styles.container}>
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
                  <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                  <View style={styles.setInputContainer}>
                    <TextInput
                      style={styles.setTextInput}
                      value={set.count}
                      onChangeText={text =>
                        handleSetCountChange(exerciseId, setIndex, text)
                      }
                      keyboardType="numeric"
                    />
                    <Text style={styles.setInputLabel}>세트</Text>
                    <TextInput
                      style={styles.setTextInput}
                      value={set.interval}
                      onChangeText={text =>
                        handleSetIntervalChange(exerciseId, setIndex, text)
                      }
                      keyboardType="numeric"
                    />
                    <Text style={styles.setInputLabel}>초</Text>
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
    padding: 16,
  },
  exerciseContainer: {
    marginBottom: 16,
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
  },
  addSetButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    width: 32,
    height: 32,
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
  },
  setInputLabel: {
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});