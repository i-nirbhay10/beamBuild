import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from '../../../components/layout/Header';
import {projects} from '../../../data/mockData';

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
  low: '#94a3b8',
  medium: '#facc15',
  high: '#fb923c',
  urgent: '#ef4444',
};

const statusColors = {
  open: '#ef4444',
  'in-progress': '#3b82f6',
  resolved: '#10b981',
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function IssuesScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [priority, setPriority] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    alert(
      `Title: ${title}\nProject: ${selectedProject}\nPriority: ${priority}\nDesc: ${description}`,
    );
    setIsModalVisible(false);
    setTitle('');
    setDescription('');
    setSelectedProject('');
    setPriority('');
  };

  const renderIssue = ({item}) => {
    const project = projects.find(p => p.id === item.projectId);
    let iconName = 'report-problem';
    let iconColor = statusColors[item.status] || '#64748b';
    if (item.status === 'resolved') iconName = 'check-circle';
    if (item.status === 'in-progress') iconName = 'access-time';

    return (
      <View style={styles.card}>
        <View style={[styles.iconWrapper, {backgroundColor: `${iconColor}33`}]}>
          <MaterialIcons name={iconName} size={18} color={iconColor} />
        </View>
        <View style={{flex: 1, marginRight: 8}}>
          <Text style={styles.issueTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.issueDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.issueMeta} numberOfLines={1}>
            {project?.name} • {item.reportedBy} •{' '}
            {new Date(item.reportedAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View
            style={[
              styles.badge,
              {backgroundColor: `${priorityColors[item.priority]}33`},
            ]}>
            <Text style={{color: priorityColors[item.priority], fontSize: 11}}>
              {item.priority}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              {backgroundColor: `${iconColor}33`, marginTop: 4},
            ]}>
            <Text style={{color: iconColor, fontSize: 11}}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header title="Issues" subtitle="Report and track project issues" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 20}}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.headerBadge}>
            <MaterialIcons name="report-problem" size={14} color="#ef4444" />
            <Text style={styles.badgeText}>
              {dummyIssues.filter(i => i.status === 'open').length} Open
            </Text>
          </View>
          <View style={styles.headerBadge}>
            <MaterialIcons name="access-time" size={14} color="#3b82f6" />
            <Text style={styles.badgeText}>
              {dummyIssues.filter(i => i.status === 'in-progress').length} In
              Progress
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setIsModalVisible(true)}>
            <MaterialIcons name="add" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        {/* Issues List */}
        <FlatList
          data={dummyIssues}
          keyExtractor={item => item.id}
          renderItem={renderIssue}
          scrollEnabled={false}
        />

        {/* Add Issue Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report New Issue</Text>

              <TextInput
                style={styles.input}
                placeholder="Issue Title"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />

              <Picker
                selectedValue={selectedProject}
                onValueChange={setSelectedProject}
                style={styles.picker}>
                <Picker.Item label="Select Project" value="" />
                {projects.map(p => (
                  <Picker.Item key={p.id} label={p.name} value={p.id} />
                ))}
              </Picker>

              <Picker
                selectedValue={priority}
                onValueChange={setPriority}
                style={styles.picker}>
                <Picker.Item label="Select Priority" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
                <Picker.Item label="Urgent" value="urgent" />
              </Picker>

              <TextInput
                style={[styles.input, {height: 80}]}
                multiline
                placeholder="Description"
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitText}>Submit Issue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{marginTop: 8}}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#0f172a', padding: 5},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {color: '#fff', fontSize: 12, marginLeft: 4},
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {color: '#fff', fontSize: 12, marginLeft: 4},
  card: {
    flexDirection: 'row',
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  issueTitle: {color: '#fff', fontSize: 13, fontWeight: '500'},
  issueDesc: {color: '#94a3b8', fontSize: 11, marginTop: 2},
  issueMeta: {color: '#64748b', fontSize: 10, marginTop: 2},
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: '#020617',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  picker: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  submitText: {color: '#fff', fontWeight: '600'},
  cancelText: {color: '#94a3b8', textAlign: 'center'},
});
