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

export default function WorkoutDetailScreen({route, navigation}) {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const { selectedDate } = route.params; // 선택된 날짜 받기

  const toggleExerciseSelection = (exerciseId) => {
    const index = selectedExercises.indexOf(exerciseId);
    if (index !== -1) {
      setSelectedExercises([...selectedExercises.slice(0, index), ...selectedExercises.slice(index + 1)]);
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  const handleSelectComplete = () => {
    navigation.navigate('WorkoutDetail2', {selectedExercises, selectedDate});
    console.log('selectedDate',selectedDate)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>운동 기록</Text>
      </View>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
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
    marginLeft: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    backgroundColor: '#fc493e',
    borderRadius: 4,
    borderColor: '#fc493e',
  },
  exerciseName: {
    fontSize: 16,
  },
  selectCompleteButton: {
    backgroundColor: '#fc493e',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    marginVertical: 16,
    marginBottom: 46,
  },
  selectCompleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});