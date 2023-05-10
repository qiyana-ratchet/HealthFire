import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const filters = [
  '어깨',
  '하체',
  '등',
  '팔',
  '복근',
];

const exercises = [
  {id: 1, name: '벤치프레스'},
  {id: 2, name: '스쿼트'},
  {id: 3, name: '레그프레스'},
  {id: 4, name: '데드리프트'},
  {id: 5, name: '밀리터리프레스'},
  {id: 6, name: '숄더프레스'},
  {id: 7, name: '바벨컬'},
  {id: 8, name: '딥스'},
  {id: 9, name: '푸쉬업'},
  {id: 10, name: '크런치'},
];

export default function WorkoutDetailScreen({navigation}) {
  const [selectedExercises, setSelectedExercises] = useState([]);

  const toggleExerciseSelection = (exerciseId) => {
    const index = selectedExercises.indexOf(exerciseId);
    if (index !== -1) {
      setSelectedExercises([...selectedExercises.slice(0, index), ...selectedExercises.slice(index + 1)]);
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleSelectComplete = () => {
    navigation.navigate('WorkoutDetail2', {selectedExercises});
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {filters.map(filter => (
          <TouchableOpacity key={filter} style={styles.filter}>
            <Text style={styles.filterText}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.exerciseListContainer}>
        {exercises.map(exercise => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.exerciseItem}
            onPress={() => toggleExerciseSelection(exercise.id)}
          >
            <View style={styles.checkboxContainer}>
              {selectedExercises.includes(exercise.id) && (
                <View style={styles.checkbox}/>
              )}
            </View>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.selectCompleteButton} onPress={handleSelectComplete}>
        <Text style={styles.selectCompleteButtonText}>선택 완료</Text>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filter: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterText: {
    fontSize: 16,
  },
  exerciseListContainer: {
    flex: 1,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  exerciseName: {
    fontSize: 16,
  },
  selectCompleteButton: {
    backgroundColor: '#333',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCompleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});