import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {projects, users} from '../../data/mockData';

export default function NewTaskModal({visible, onClose}) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Create New Task</Text>
        <TextInput placeholder="Task Title" style={styles.input} />
        <TextInput
          placeholder="Description"
          style={[styles.input, {height: 80}]}
          multiline
        />
        <Text style={styles.label}>Project</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 12}}>
          {projects.map(p => (
            <TouchableOpacity key={p.id} style={styles.selectBtn}>
              <Text>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.label}>Assign To</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginBottom: 12}}>
          {users.map(u => (
            <TouchableOpacity key={u.id} style={styles.selectBtn}>
              <Text>{u.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.addBtn, {flex: 1, marginRight: 8}]}
            onPress={onClose}>
            <Text style={styles.addBtnText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, {flex: 1, backgroundColor: '#aaa'}]}
            onPress={onClose}>
            <Text style={styles.addBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {flex: 1, padding: 12},
  modalTitle: {fontSize: 18, fontWeight: '700', marginBottom: 12},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  label: {fontWeight: '600', marginBottom: 4},
  selectBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginRight: 8,
  },
  modalButtons: {flexDirection: 'row', marginTop: 12},
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0b74ff',
  },
  addBtnText: {color: '#fff', marginLeft: 6},
});
