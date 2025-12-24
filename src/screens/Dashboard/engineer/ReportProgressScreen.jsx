import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../components/layout/Header';
import {useAuth} from '../../../context/AuthContext';
import {projects, teams, getTasksByAssigneeId} from '../../../data/mockData';
import ProgressBar from 'react-native-progress/Bar';

export default function ReportProgressScreen() {
  const {user} = useAuth();
  const [selectedTask, setSelectedTask] = useState('');
  const [progress, setProgress] = useState('');
  const [notes, setNotes] = useState('');

  const myTasks = getTasksByAssigneeId(user?.id || '');
  const inProgressTasks = myTasks.filter(
    t => t.status === 'in-progress' || t.status === 'pending',
  );

  const memberTeams = teams.filter(team =>
    team.members.some(m => m.userId === user?.id),
  );

  const tasksCompletedCount = useMemo(
    () => myTasks.filter(t => t.status === 'completed').length,
    [myTasks],
  );

  const handleSubmit = () => {
    alert(`Task: ${selectedTask}\nProgress: ${progress}\nNotes: ${notes}`);
    setSelectedTask('');
    setProgress('');
    setNotes('');
  };

  const renderActiveTask = ({item: task}) => {
    const project = projects.find(p => p.id === task.projectId);
    const isInProgress = task.status === 'in-progress';
    return (
      <View style={styles.taskCard}>
        <View
          style={[
            styles.taskIcon,
            {backgroundColor: isInProgress ? '#3b82f6/20' : '#64748b/20'},
          ]}>
          <MaterialIcons
            name={isInProgress ? 'access-time' : 'report-problem'}
            size={18}
            color={isInProgress ? '#3b82f6' : '#94a3b8'}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.taskTitle} numberOfLines={1}>
            {task.title}
          </Text>
          <Text style={styles.taskProject}>{project?.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title="Report Progress"
        subtitle="Update your task and project progress"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 24}}>
        {/* Report Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submit Progress</Text>

          <Text style={styles.label}>Task</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedTask}
              onValueChange={value => setSelectedTask(value)}>
              <Picker.Item label="Select a task..." value="" />
              {inProgressTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <Picker.Item
                    key={task.id}
                    label={`${task.title} (${project?.name})`}
                    value={task.id}
                  />
                );
              })}
            </Picker>
          </View>

          <Text style={styles.label}>Progress</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={progress}
              onValueChange={value => setProgress(value)}>
              <Picker.Item label="Select progress..." value="" />
              <Picker.Item label="25% Complete" value="25" />
              <Picker.Item label="50% Complete" value="50" />
              <Picker.Item label="75% Complete" value="75" />
              <Picker.Item label="100% Complete" value="100" />
              <Picker.Item label="Blocked" value="blocked" />
            </Picker>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={3}
            placeholder="Enter your notes..."
            placeholderTextColor="#94a3b8"
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <MaterialIcons name="send" size={18} color="#fff" />
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.cardSmall}>
          <Text style={styles.cardTitle}>Progress Summary</Text>
          <Text style={styles.label}>
            Completed: {tasksCompletedCount}/{myTasks.length}
          </Text>
          <ProgressBar
            progress={
              myTasks.length > 0 ? tasksCompletedCount / myTasks.length : 0
            }
            width={null}
            height={8}
            color="#10b981"
            unfilledColor="#1e293b"
            borderRadius={5}
          />
        </View>

        <View style={styles.cardSmall}>
          <Text style={styles.cardTitle}>Active Tasks</Text>
          <FlatList
            data={inProgressTasks.slice(0, 4)}
            keyExtractor={item => item.id.toString()}
            renderItem={renderActiveTask}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0f172a', padding: 5},
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardSmall: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10},
  label: {color: '#94a3b8', marginBottom: 4, fontSize: 13},
  pickerWrapper: {
    height: 36,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  textarea: {
    backgroundColor: '#0f172a',
    color: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 13,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 6,
  },
  submitText: {color: '#fff', fontWeight: '600', marginLeft: 6, fontSize: 14},
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 8,
    marginVertical: 3,
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  taskTitle: {color: '#fff', fontWeight: '500', fontSize: 14},
  taskProject: {color: '#94a3b8', fontSize: 11, marginTop: 2},
});
