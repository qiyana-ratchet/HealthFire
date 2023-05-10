import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Pressable} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const exercises = [
  { id: 1, name: '벤치프레스' },
  { id: 2, name: '스쿼트' },
  { id: 3, name: '레그프레스' },
  { id: 4, name: '데드리프트' },
  { id: 5, name: '밀리터리프레스' },
  { id: 6, name: '숄더프레스' },
  { id: 7, name: '바벨컬' },
  { id: 8, name: '딥스' },
  { id: 9, name: '푸쉬업' },
  { id: 10, name: '크런치' },
];

export default function WorkoutDetailScreen2({route, navigation}) {
  const {selectedExercises} = route.params;

  const [sets, setSets] = useState([]);
  const [interval, setInterval] = useState(60);

  const handleComplete = () => {
    // 데이터를 저장하거나 다른 작업을 수행합니다.
    // ...

    // WorkoutDetailScreen2 화면을 종료하고 이전 화면으로 돌아갑니다.
    navigation.navigate('Main');
  };

  const handleAddSet = (exerciseId) => {
    const index = sets.findIndex(set => set.exerciseId === exerciseId);
    if (index !== -1) {
      const updatedSets = [...sets];
      updatedSets[index].count += 1;
      setSets(updatedSets);
    } else {
      setSets([...sets, {exerciseId, count: 1}]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {selectedExercises.map(exerciseId => {
          const exercise = exercises.find(exercise => exercise.id === exerciseId);
          const exerciseSets = sets.filter(set => set.exerciseId === exerciseId);
          return (
            <View key={exercise.id} style={styles.exerciseContainer}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exercise.id)}>
                  <Text style={styles.addSetButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              {exerciseSets.map((set, index) => (
                <View key={index} style={styles.setContainer}>
                  <Text style={styles.setNumber}>Set {index + 1}</Text>
                  <Picker
                    selectedValue={set.count}
                    style={styles.setPicker}
                    onValueChange={(itemValue) => {
                      const updatedSets = [...sets];
                      updatedSets[index].count = itemValue;
                      setSets(updatedSets);
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((count) => (
                      <Picker.Item key={count} label={`${count} 세트`} value={count}/>
                    ))}
                  </Picker>
                  <Picker
                    selectedValue={interval}
                    style={styles.intervalPicker}
                    onValueChange={setInterval}
                  >
                    {[30, 45, 60, 90, 120].map((value) => (
                      <Picker.Item key={value} label={`${value} 초 인터벌`} value={value}/>
                    ))}
                  </Picker>
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
};

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
  setPicker: {
    flex: 1,
    height: 50,
    marginHorizontal: 8,
  },
  intervalPicker: {
    flex: 1,
    height: 50,
    marginHorizontal: 8,
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
