import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../../context/AuthContext';
import {
  getProjectById,
  getTasksByAssigneeId,
  teams,
} from '../../../data/mockData';
import Header from '../../../components/layout/Header';

const dummyLogs = [
  {
    id: 'log1',
    date: '2024-11-20',
    hoursWorked: 8,
    tasksCompleted: ['Steel framework section B', 'Safety inspection'],
    notes: 'Completed steel framework on schedule. Minor delay due to weather.',
    projectId: 'p1',
  },
  {
    id: 'log2',
    date: '2024-11-19',
    hoursWorked: 7.5,
    tasksCompleted: ['Foundation reinforcement'],
    notes: 'Foundation work completed ahead of schedule.',
    projectId: 'p1',
  },
];

export default function DailyLogPage() {
  const {user} = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [hoursWorked, setHoursWorked] = useState('8');
  const [notes, setNotes] = useState('');

  const myTasks = useMemo(
    () => getTasksByAssigneeId(user?.id || ''),
    [user?.id],
  );
  const laborerTeams = teams.filter(team =>
    team.members.some(m => m.userId === user?.id),
  );
  const assignedProjects = laborerTeams
    .map(t => getProjectById(t.projectId))
    .filter(Boolean);

  return (
    <View style={styles.screen}>
      <Header title="Daily Log" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* New Log Entry */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon
              name="plus"
              size={20}
              color="#3b82f6"
              style={{marginRight: 8}}
            />
            <Text style={styles.cardTitle}>New Log Entry</Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.field}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={selectedDate}
                onChangeText={setSelectedDate}
                placeholder="YYYY-MM-DD"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Hours Worked</Text>
              <TextInput
                style={styles.input}
                value={hoursWorked}
                onChangeText={setHoursWorked}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Project</Text>
            <View style={styles.select}>
              {assignedProjects.map(project => (
                <Text key={project.id} style={styles.selectItem}>
                  {project.name}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Tasks Completed Today</Text>
            <View style={styles.checkboxList}>
              {myTasks
                .filter(t => t.status !== 'completed')
                .slice(0, 5)
                .map(task => (
                  <View key={task.id} style={styles.checkboxRow}>
                    <Icon name="square" size={18} color="#3b82f6" />
                    <Text style={styles.checkboxLabel}>{task.title}</Text>
                  </View>
                ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, {height: 80}]}
              multiline
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional notes..."
            />
          </View>

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Daily Log</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon
              name="calendar"
              size={20}
              color="#3b82f6"
              style={{marginRight: 8}}
            />
            <Text style={styles.cardTitle}>This Week</Text>
          </View>

          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, {marginRight: 8}]}>
              <Text style={styles.summaryValue}>15.5</Text>
              <Text style={styles.summaryLabel}>Hours Logged</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>Tasks Done</Text>
            </View>
          </View>

          <Text style={[styles.label, {marginTop: 16}]}>Recent Entries</Text>
          {dummyLogs.map(log => {
            const project = getProjectById(log.projectId);
            return (
              <View key={log.id} style={styles.logCard}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>
                    {new Date(log.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.logHours}>{log.hoursWorked}h</Text>
                </View>
                <Text style={styles.logProject}>{project?.name}</Text>
                <Text style={styles.logTasks}>
                  {log.tasksCompleted.length} tasks completed
                </Text>
              </View>
            );
          })}
        </View>

        {/* Log History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log History</Text>
          {dummyLogs.map(log => {
            const project = getProjectById(log.projectId);
            return (
              <View key={log.id} style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <Icon name="clipboard" size={20} color="#f7f7f7ff" />
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>
                      {new Date(log.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <Text style={styles.historyHours}>{log.hoursWorked}h</Text>
                  </View>
                  <Text style={styles.logProject}>{project?.name}</Text>
                  <Text style={styles.logTasks}>
                    Tasks Completed: {log.tasksCompleted.join(', ')}
                  </Text>
                  {log.notes ? (
                    <Text style={styles.logNotes}>{log.notes}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#1f2937'},
  container: {padding: 5, paddingBottom: 24},

  card: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f9fafb',
    marginBottom: 12,
  },

  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  field: {flex: 1, marginRight: 8},
  label: {fontSize: 14, color: '#9ca3af', marginBottom: 4},
  input: {
    backgroundColor: '#1f2937',
    borderColor: '#374151',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#f9fafb',
    height: 40,
  },
  select: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    padding: 10,
  },
  selectItem: {color: '#f9fafb', paddingVertical: 4},

  checkboxList: {marginTop: 8},
  checkboxRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  checkboxLabel: {color: '#f9fafb', marginLeft: 8},

  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  submitText: {color: '#fff', fontWeight: '700'},

  summaryRow: {flexDirection: 'row', marginTop: 12},
  summaryCard: {
    flex: 1,
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  summaryValue: {fontSize: 20, fontWeight: '700', color: '#f9fafb'},
  summaryLabel: {fontSize: 12, color: '#9ca3af', marginTop: 4},

  logCard: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logDate: {color: '#f9fafb', fontWeight: '600'},
  logHours: {color: '#3b82f6', fontWeight: '600'},
  logProject: {color: '#9ca3af', fontSize: 12},
  logTasks: {color: '#9ca3af', fontSize: 12, marginTop: 2},
  logNotes: {color: '#f9fafb', fontSize: 12, marginTop: 4},

  historyRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  historyIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  historyDate: {color: '#f9fafb', fontWeight: '600', flexShrink: 1},
  historyHours: {color: '#3b82f6', fontWeight: '600'},
});
