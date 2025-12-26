import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useAuth} from '../../context/AuthContext';
import {projects} from '../../data/mockData';
import Header from '../../components/layout/Header';

const dummyIssues = [
  {
    id: 'i1',
    title: 'Crane malfunction on floor 5',
    description: 'The main crane is showing error codes and needs inspection',
    projectId: 'p1',
    priority: 'urgent',
    status: 'open',
    reportedAt: '2024-11-20',
    reportedBy: 'Mike Johnson',
  },
  {
    id: 'i2',
    title: 'Missing safety barriers',
    description: 'Safety barriers on the east side need to be replaced',
    projectId: 'p1',
    priority: 'high',
    status: 'in-progress',
    reportedAt: '2024-11-19',
    reportedBy: 'Carlos Rodriguez',
  },
  {
    id: 'i3',
    title: 'Electrical wiring concerns',
    description:
      'Wiring in section B does not match the blueprint specifications',
    projectId: 'p2',
    priority: 'medium',
    status: 'resolved',
    reportedAt: '2024-11-18',
    reportedBy: 'Emily Davis',
  },
];

const priorityColors = {
  low: '#475569',
  medium: '#facc15',
  high: '#f97316',
  urgent: '#ef4444',
};

const statusColors = {
  open: '#ef4444',
  'in-progress': '#3b82f6',
  resolved: '#22c55e',
};

export default function IssuesPage() {
  const {user} = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('low');

  const openCount = dummyIssues.filter(i => i.status === 'open').length;
  const inProgressCount = dummyIssues.filter(
    i => i.status === 'in-progress',
  ).length;

  return (
    <View style={styles.screen}>
      <Header title="Report Issues" subtitle="Manage your Issues" />

      <View style={styles.container}>
        {/* Header badges */}
        <View style={styles.badgesRow}>
          <View style={[styles.badge, {backgroundColor: '#1f2937'}]}>
            <Icon name="alert-triangle" size={16} color="#ef4444" />
            <Text style={[styles.badgeText, {color: '#fff'}]}>
              {openCount} Open
            </Text>
          </View>
          <View style={[styles.badge, {backgroundColor: '#1f2937'}]}>
            <Icon name="clock" size={16} color="#3b82f6" />
            <Text style={[styles.badgeText, {color: '#fff'}]}>
              {inProgressCount} In Progress
            </Text>
          </View>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => setModalVisible(true)}>
            <Icon name="plus" size={16} color="#fff" style={{marginRight: 4}} />
            <Text style={styles.reportBtnText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Issues list */}
        <FlatList
          data={dummyIssues}
          keyExtractor={item => item.id}
          style={{marginTop: 16}}
          renderItem={({item}) => {
            const project = projects.find(p => p.id === item.projectId);
            return (
              <View style={styles.issueCard}>
                <View style={styles.issueLeft}>
                  <View
                    style={[
                      styles.statusIcon,
                      {
                        backgroundColor:
                          item.status === 'resolved' ? '#065f46' : '#991b1b',
                      },
                    ]}>
                    <Icon
                      name={
                        item.status === 'resolved'
                          ? 'check-circle'
                          : 'alert-triangle'
                      }
                      size={20}
                      color={item.status === 'resolved' ? '#22c55e' : '#ef4444'}
                    />
                  </View>
                </View>
                <View style={styles.issueContent}>
                  <Text style={styles.issueTitle}>{item.title}</Text>
                  <Text style={styles.issueDesc}>{item.description}</Text>
                  <Text style={styles.issueMeta}>
                    {project?.name} • Reported by {item.reportedBy} •{' '}
                    {new Date(item.reportedAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.badgeRow}>
                    <View
                      style={[
                        styles.priorityBadge,
                        {backgroundColor: priorityColors[item.priority]},
                      ]}>
                      <Text style={styles.badgeLabel}>{item.priority}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {backgroundColor: statusColors[item.status]},
                      ]}>
                      <Text style={styles.badgeLabel}>{item.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />

        {/* Report Issue Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: '#111827'}]}>
              <Text style={[styles.modalTitle, {color: '#fff'}]}>
                Report New Issue
              </Text>
              <TextInput
                style={[styles.input, {color: '#fff', borderColor: '#374151'}]}
                placeholder="Issue Title"
                placeholderTextColor="#9ca3af"
                value={issueTitle}
                onChangeText={setIssueTitle}
              />
              <TextInput
                style={[
                  styles.input,
                  {height: 80, color: '#fff', borderColor: '#374151'},
                ]}
                placeholder="Description"
                placeholderTextColor="#9ca3af"
                multiline
                value={issueDesc}
                onChangeText={setIssueDesc}
              />
              <Text style={[styles.label, {color: '#fff'}]}>Project</Text>
              {projects.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.projectItem,
                    {
                      backgroundColor:
                        selectedProject === p.id ? '#3b82f6' : '#1f2937',
                    },
                  ]}
                  onPress={() => setSelectedProject(p.id)}>
                  <Text
                    style={{color: selectedProject === p.id ? '#fff' : '#fff'}}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <Text style={[styles.label, {color: '#fff'}]}>Priority</Text>
              <View style={styles.priorityRow}>
                {['low', 'medium', 'high', 'urgent'].map(p => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.priorityItem,
                      {
                        backgroundColor:
                          selectedPriority === p
                            ? priorityColors[p]
                            : '#374151',
                      },
                    ]}
                    onPress={() => setSelectedPriority(p)}>
                    <Text
                      style={{color: selectedPriority === p ? '#fff' : '#fff'}}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  setModalVisible(false);
                  setIssueTitle('');
                  setIssueDesc('');
                  setSelectedProject(null);
                  setSelectedPriority('low');
                }}>
                <Text style={styles.submitText}>Submit Issue</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: 8}}
                onPress={() => setModalVisible(false)}>
                <Text style={{color: '#ef4444', textAlign: 'center'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0f172a'},
  container: {padding: 5},
  badgesRow: {flexDirection: 'row', gap: 8, justifyContent: 'space-between'},
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  badgeText: {marginLeft: 6, fontWeight: '600', color: '#fff', fontSize: 12},

  reportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  reportBtnText: {color: '#fff', fontWeight: '600', fontSize: 14},

  issueCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  issueLeft: {marginRight: 12},
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueContent: {flex: 1},
  issueTitle: {fontWeight: '700', fontSize: 16, color: '#fff'},
  issueDesc: {fontSize: 14, color: '#94a3b8', marginTop: 4},
  issueMeta: {fontSize: 12, color: '#9ca3af', marginTop: 6},

  badgeRow: {flexDirection: 'row', marginTop: 8, gap: 8},
  priorityBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  statusBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12},
  badgeLabel: {color: '#fff', fontWeight: '600', fontSize: 12},

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {borderRadius: 12, padding: 20, backgroundColor: '#111827'},
  modalTitle: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 16,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderColor: '#374151',
    color: '#fff',
  },
  label: {fontWeight: '600', marginBottom: 6, color: '#fff'},

  projectItem: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityItem: {
    flex: 1,
    marginRight: 8,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {color: '#fff', fontWeight: '700', fontSize: 14},
});
